import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import { run, get, all } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper to parse project fields
const parseProject = (p) => {
  if (!p) return null;
  return {
    ...p,
    rebrandInfo: p.rebrandInfo ? JSON.parse(p.rebrandInfo) : undefined
  };
};

// ============ API ROUTES ============

// --- Users ---

app.get('/api/users', async (req, res) => {
  try {
    const users = await all('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await get('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (user) res.json(user);
    else res.status(404).json({ error: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/email/:email', async (req, res) => {
  try {
    const user = await get('SELECT * FROM users WHERE email = ?', [req.params.email]);
    res.json(user || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { email, name, picture } = req.body;
  try {
    let user = await get('SELECT * FROM users WHERE email = ?', [email]);

    if (user) {
      const lastLoginAt = new Date().toISOString();
      await run('UPDATE users SET lastLoginAt = ? WHERE id = ?', [lastLoginAt, user.id]);
      user.lastLoginAt = lastLoginAt;
      res.json(user);
    } else {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const createdAt = new Date().toISOString();
      const lastLoginAt = createdAt;
      const plan = 'free';
      const credits = 2;

      await run(
        'INSERT INTO users (id, email, name, picture, plan, credits, createdAt, lastLoginAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, email, name, picture, plan, credits, createdAt, lastLoginAt]
      );

      user = await get('SELECT * FROM users WHERE id = ?', [id]);
      res.json(user);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const allowed = ['name', 'picture', 'plan', 'credits', 'lastLoginAt'];

  try {
    const user = await get('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const keys = Object.keys(updates).filter(k => allowed.includes(k));
    if (keys.length > 0) {
      const setClause = keys.map(k => `${k} = ?`).join(', ');
      const values = keys.map(k => updates[k]);

      await run(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
    }

    const updatedUser = await get('SELECT * FROM users WHERE id = ?', [id]);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Projects ---

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await all('SELECT * FROM projects');
    res.json(projects.map(parseProject));
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Web2One Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: SQLite (web2one.sqlite)`);
});
