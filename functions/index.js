const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const { GoogleGenAI } = require('@google/genai');

// Use Application Default Credentials in Cloud Functions or set GOOGLE_APPLICATION_CREDENTIALS
const ai = new GoogleGenAI({});

exports.generate = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

        const { rawHtml, originalUrl, rebrand } = req.body || {};
        if (!rawHtml || !originalUrl) return res.status(400).json({ error: 'Missing rawHtml or originalUrl' });

        const model = 'gemini-3-pro-preview';

        const systemInstruction = `You are an Elite Web Architect specializing in High-Fidelity Static Page Reconstruction. Output ONLY the raw HTML.`;

        const sourceContent = rawHtml.substring(0, 150000);

        const rebrandPrompt = rebrand ? `REBRAND: ${JSON.stringify(rebrand)}` : '';

        const prompt = `Clone ${originalUrl} for GHL. ${rebrandPrompt}\n\nSOURCE:\n${sourceContent}`;

        try {
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: { systemInstruction, temperature: 0.2 }
            });

            let result = response.text || '';
            result = result.trim();

            // Basic cleaning
            result = result.replace(/^```html\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/m, '');

            // Ensure it's wrapped
            if (!result.includes('id="ghl-clone-container"')) {
                result = `<div id="ghl-clone-container">${result}</div>`;
            }

            res.json({ html: result });
        } catch (err) {
            console.error('Functions Gemini error', err);
            res.status(500).json({ error: err?.message || 'AI error' });
        }
    });
});
