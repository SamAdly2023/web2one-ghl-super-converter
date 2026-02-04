<div align="center">
<h1>🚀 Web2One - GHL Super Converter</h1>
<p>Clone any website and convert it to GoHighLevel-ready HTML in seconds</p>
</div>

## 📦 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deploying to Render.com

### Step 1: Create a New Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **New +** → **Web Service**
3. Connect your GitHub/GitLab repository
4. Enter the repository URL

### Step 2: Configure Build Settings

| Setting | Value |
|---------|-------|
| **Name** | web2one-ghl-converter |
| **Environment** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | Free (or Starter for better performance) |

### Step 3: Set Environment Variables

In the **Environment** section, add:

```
NODE_ENV=production
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_GEMINI_API_KEY=AIzaSyBTn4trIqGR0QKLBxMI4tRQLnUalxWZ0Pk
VITE_PAYPAL_CLIENT_ID=AarwkYK4lzBjwzF7OCgJeoRBnGAZehBAsNrEyrQZSdzu7yyPH3P7qEm0qtm-VNj_SvYFPpKA9PjZqO2G
```

### Step 4: Deploy

Click **Create Web Service** and wait for the build to complete.

---

## 🔐 Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://your-app.onrender.com` (production)
7. Add authorized redirect URIs (same as above)
8. Copy the Client ID and add to environment variables

---

## 💳 PayPal Integration

The app uses PayPal for payments:

- **Client ID**: Configured in services/paypalService.ts
- **Mode**: Live (change to sandbox URL for testing)

---

## 📱 Features

- ✅ Professional landing page with pricing
- ✅ Google OAuth authentication
- ✅ One-Tap login popup
- ✅ User dashboard with credits
- ✅ Admin dashboard (user management)
- ✅ AI-powered website cloning
- ✅ Rebranding tools
- ✅ PayPal subscription payments
- ✅ User guide / documentation

---

## 🎯 Pricing Plans

| Plan | Price | Credits |
|------|-------|---------|
| Free | $0 | 2 |
| Starter | $49/mo | 10 |
| Pro | $97/mo | Unlimited |
| Agency | $297/mo | Unlimited + Team |

---

## 👤 Admin Access

Default admin email: `samadly728@gmail.com`

---

## 🔧 Tech Stack

- React 19 + TypeScript
- Tailwind CSS
- Google Gemini AI
- PayPal SDK
- Express.js
- Vite

---

© 2026 Web2One. All rights reserved.
