import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import { run, get, all } from './db.js';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper to parse project fields
const parseProject = (p) => {
  // Helper: fetch website HTML with CORS proxy fallbacks
  async function fetchWebsiteHtml(url) {
    try {
      const parsed = new URL(url);
      if (!parsed.protocol.startsWith('http')) throw new Error();
    } catch (e) {
      throw new Error('Invalid URL format. Please include http:// or https://');
    }

    const encodedUrl = encodeURIComponent(url);
    const proxies = [
      { url: `https://corsproxy.io/?url=${encodedUrl}`, type: 'text' },
      { url: `https://api.allorigins.win/get?url=${encodedUrl}&_ts=${Date.now()}`, type: 'json' },
      { url: `https://api.codetabs.com/v1/proxy?quest=${encodedUrl}`, type: 'text' }
    ];

    for (const proxy of proxies) {
      try {
        const response = await fetch(proxy.url);
        if (response.ok) {
          let content = '';
          if (proxy.type === 'json') {
            const data = await response.json();
            content = data.contents;
          } else {
            content = await response.text();
          }

          if (content && content.includes('<html') && content.length > 100) {
            return content;
          }
        }
      } catch (err) {
        console.warn(`Proxy ${proxy.url} failed: ${err?.message || err}`);
      }
    }

    throw new Error('Target site is heavily protected or proxies are down.');
  }

  // --- API Keys Management ---

  app.post('/api/keys', async (req, res) => {
    const { userId, name } = req.body;
    try {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const apiKey = crypto.randomBytes(24).toString('hex');
      const createdAt = new Date().toISOString();

      await run('INSERT INTO api_keys (id, apiKey, userId, name, createdAt) VALUES (?, ?, ?, ?, ?)', [
        id, apiKey, userId, name || null, createdAt
      ]);

      const row = await get('SELECT id, apiKey, userId, name, revoked, createdAt FROM api_keys WHERE id = ?', [id]);
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/keys/user/:userId', async (req, res) => {
    try {
      const rows = await all('SELECT id, apiKey, userId, name, revoked, createdAt FROM api_keys WHERE userId = ?', [req.params.userId]);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/keys/:id', async (req, res) => {
    try {
      await run('UPDATE api_keys SET revoked = 1 WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Public clone endpoint secured by API key
  app.post('/api/clone', async (req, res) => {
    try {
      const apiKeyHeader = (req.headers.authorization || '').replace(/^Bearer\s+/i, '') || req.query.apiKey || req.body.apiKey;
      const url = req.body.url || req.query.url;

      if (!apiKeyHeader) return res.status(401).json({ error: 'Missing API key' });
      if (!url) return res.status(400).json({ error: 'Missing url parameter' });

      const keyRow = await get('SELECT * FROM api_keys WHERE apiKey = ? AND revoked = 0', [apiKeyHeader]);
      if (!keyRow) return res.status(401).json({ error: 'Invalid or revoked API key' });

      const html = await fetchWebsiteHtml(url);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/projects/user/:userId', async (req, res) => {
    try {
      const projects = await all('SELECT * FROM projects WHERE userId = ?', [req.params.userId]);
      res.json(projects.map(parseProject));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/projects', async (req, res) => {
    const { userId, sourceUrl, rebrandInfo } = req.body;
    try {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const createdAt = new Date().toISOString();
      const status = 'pending';

      // Handle rebrandInfo text/json
      const rebrandInfoStr = rebrandInfo ? JSON.stringify(rebrandInfo) : null;

      await run(
        'INSERT INTO projects (id, userId, sourceUrl, status, createdAt, rebrandInfo) VALUES (?, ?, ?, ?, ?, ?)',
        [id, userId, sourceUrl, status, createdAt, rebrandInfoStr]
      );

      const project = await get('SELECT * FROM projects WHERE id = ?', [id]);
      res.json(parseProject(project));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const allowed = ['name', 'status', 'previewImage', 'outputHtml', 'rebrandInfo'];

    try {
      const project = await get('SELECT * FROM projects WHERE id = ?', [id]);
      if (!project) return res.status(404).json({ error: 'Project not found' });

      const keys = Object.keys(updates).filter(k => allowed.includes(k));
      if (keys.length > 0) {
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values = keys.map(k => {
          if (k === 'rebrandInfo' && typeof updates[k] === 'object') {
            return JSON.stringify(updates[k]);
          }
          return updates[k];
        });

        await run(`UPDATE projects SET ${setClause} WHERE id = ?`, [...values, id]);
      }

      const updatedProject = await get('SELECT * FROM projects WHERE id = ?', [id]);
      res.json(parseProject(updatedProject));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/projects/:id', async (req, res) => {
    try {
      await run('DELETE FROM projects WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Subscriptions ---

  app.get('/api/subscriptions/user/:userId', async (req, res) => {
    try {
      const sub = await get('SELECT * FROM subscriptions WHERE userId = ? AND status = ?', [req.params.userId, 'active']);
      res.json(sub || null);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/subscriptions', async (req, res) => {
    const { userId, planId } = req.body;
    try {
      await run('UPDATE subscriptions SET status = ? WHERE userId = ? AND status = ?', ['cancelled', userId, 'active']);

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const startDate = new Date().toISOString();
      const status = 'active';

      await run(
        'INSERT INTO subscriptions (id, userId, planId, status, startDate) VALUES (?, ?, ?, ?, ?)',
        [id, userId, planId, status, startDate]
      );

      const sub = await get('SELECT * FROM subscriptions WHERE id = ?', [id]);
      res.json(sub);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Payments ---

  app.get('/api/payments', async (req, res) => {
    try {
      const payments = await all('SELECT * FROM payments');
      res.json(payments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/payments/user/:userId', async (req, res) => {
    try {
      const payments = await all('SELECT * FROM payments WHERE userId = ?', [req.params.userId]);
      res.json(payments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/payments', async (req, res) => {
    const { userId, amount, currency, status, method, description } = req.body;
    try {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const createdAt = new Date().toISOString();

      await run(
        'INSERT INTO payments (id, userId, amount, currency, status, method, createdAt, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, userId, amount, currency, status, method, createdAt, description]
      );

      const payment = await get('SELECT * FROM payments WHERE id = ?', [id]);
      res.json(payment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Stats ---

  app.get('/api/stats', async (req, res) => {
    try {
      const userCount = await get('SELECT COUNT(*) as count FROM users');
      const projectCount = await get('SELECT COUNT(*) as count FROM projects');
      const completedProjectCount = await get("SELECT COUNT(*) as count FROM projects WHERE status = 'completed'");
      const revenue = await get("SELECT SUM(amount) as total FROM payments WHERE status = 'completed'");

      const planBreakdown = await all('SELECT plan, COUNT(*) as count FROM users GROUP BY plan');

      const plans = {
        free: 0,
        starter: 0,
        pro: 0,
        agency: 0
      };

      planBreakdown.forEach(row => {
        if (plans[row.plan] !== undefined) {
          plans[row.plan] = row.count;
        }
      });

      res.json({
        totalUsers: userCount.count,
        totalProjects: projectCount.count,
        completedProjects: completedProjectCount.count,
        totalRevenue: revenue.total || 0,
        planBreakdown: plans
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '4.1.0'
    });
  });

<<<<<<< HEAD
=======
// Helper: fetch website HTML with CORS proxy fallbacks
async function fetchWebsiteHtml(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith('http')) throw new Error();
  } catch (e) {
    throw new Error('Invalid URL format. Please include http:// or https://');
  }

  const encodedUrl = encodeURIComponent(url);
  const proxies = [
    { url: `https://corsproxy.io/?url=${encodedUrl}`, type: 'text' },
    { url: `https://api.allorigins.win/get?url=${encodedUrl}&_ts=${Date.now()}`, type: 'json' },
    { url: `https://api.codetabs.com/v1/proxy?quest=${encodedUrl}`, type: 'text' }
  ];

  for (const proxy of proxies) {
    try {
      const response = await fetch(proxy.url);
      if (response.ok) {
        let content = '';
        if (proxy.type === 'json') {
          const data = await response.json();
          content = data.contents;
        } else {
          content = await response.text();
        }

        if (content && content.includes('<html') && content.length > 100) {
          return content;
        }
      }
    } catch (err) {
      console.warn(`Proxy ${proxy.url} failed: ${err?.message || err}`);
    }
  }

  throw new Error('Target site is heavily protected or proxies are down.');
}

// --- API Keys Management ---

app.post('/api/keys', async (req, res) => {
  const { userId, name } = req.body;
  try {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const apiKey = crypto.randomBytes(24).toString('hex');
    const createdAt = new Date().toISOString();

    await run('INSERT INTO api_keys (id, apiKey, userId, name, createdAt) VALUES (?, ?, ?, ?, ?)', [
      id, apiKey, userId, name || null, createdAt
    ]);

    const row = await get('SELECT id, apiKey, userId, name, revoked, createdAt FROM api_keys WHERE id = ?', [id]);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/keys/user/:userId', async (req, res) => {
  try {
    const rows = await all('SELECT id, apiKey, userId, name, revoked, createdAt FROM api_keys WHERE userId = ?', [req.params.userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/keys/:id', async (req, res) => {
  try {
    await run('UPDATE api_keys SET revoked = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public clone endpoint secured by API key
app.post('/api/clone', async (req, res) => {
  try {
    const apiKeyHeader = (req.headers.authorization || '').replace(/^Bearer\s+/i, '') || req.query.apiKey || req.body.apiKey;
    const url = req.body.url || req.query.url;

    if (!apiKeyHeader) return res.status(401).json({ error: 'Missing API key' });
    if (!url) return res.status(400).json({ error: 'Missing url parameter' });

    const keyRow = await get('SELECT * FROM api_keys WHERE apiKey = ? AND revoked = 0', [apiKeyHeader]);
    if (!keyRow) return res.status(401).json({ error: 'Invalid or revoked API key' });

    const html = await fetchWebsiteHtml(url);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

>>>>>>> cacd644 (feat(api): add API key generation, clone endpoint, client service, and UI)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`🚀 Web2One Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: SQLite (web2one.sqlite)`);
  });
