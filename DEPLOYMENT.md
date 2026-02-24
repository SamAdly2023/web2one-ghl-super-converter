# Web2One Deployment Guide

This guide walks you through deploying Web2One with Firebase Cloud Functions and Gemini AI to Render.

## Prerequisites

- Firebase project with Gemini API enabled
- Service account JSON from Firebase
- Render account with active web service
- Local Node.js 18+
- Firebase CLI installed

---

## Part 1: Deploy Cloud Functions to Firebase

### 1.1 Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 1.2 Deploy Functions

From the project root:

```bash
firebase deploy --only functions
```

This will:
- Build and deploy the Cloud Function (`functions/index.js`)
- Output function URLs, e.g.:
  ```
  Function URL: https://us-central1-web2one.cloudfunctions.net/generate
  ```

**Save the function URL** — you'll need it for Render environment variables.

### 1.3 Test the Function (Optional)

```bash
curl -X POST https://us-central1-web2one.cloudfunctions.net/generate \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com",
    "rawHtml": "<html><body>Test</body></html>",
    "rebrand": {"brandName": "MyBrand"}
  }'
```

Expected response:
```json
{
  "html": "<div id=\"ghl-clone-container\">...</div>"
}
```

---

## Part 2: Configure Render Environment Variables

### 2.1 Access Render Dashboard

1. Go to [render.com](https://render.com)
2. Select your Web Service
3. Click **Environment** tab

### 2.2 Add Firebase & Function Environment Variables

Add the following variables (replace with your values):

```
VITE_FIREBASE_API_KEY=AIzaSyBMYxaxQXRnEKXSZqlUtDj2IiYTgsxyuM4
VITE_FIREBASE_AUTH_DOMAIN=web2one.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=web2one
VITE_FIREBASE_STORAGE_BUCKET=web2one.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=905367104067
VITE_FIREBASE_APP_ID=1:905367104067:web:eda7773fab516bba1202f6
FIREBASE_DATABASE_URL=https://web2one.firebaseio.com
VITE_FUNCTIONS_GEMINI_URL=https://us-central1-web2one.cloudfunctions.net/generate
```

### 2.3 Add Service Account (Node.js Backend)

**Option A: Via Environment Variable (Recommended for Render)**

1. Get your service account JSON file: `web2one-firebase-adminsdk-fbsvc-ae657215b0.json`
2. Read the file contents and paste as a new env var:
   - Variable name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: (paste entire JSON content from the file)

**Option B: Via File Path**

1. Upload the service account JSON to your Render service
2. Set: `FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/web2one-firebase-adminsdk-fbsvc-ae657215b0.json`

### 2.4 Trigger Deployment

After adding environment variables:
- Render automatically redeploys
- Wait for the green "Live" status
- Test the deployed app

---

## Part 3: Verify Deployment

### 3.1 Test Authentication

1. Go to your Render URL (e.g., `https://web2one.onrender.com`)
2. Click **"Continue with Google"**
3. Sign in with your Google account
4. Confirm you're redirected to `/dashboard`

### 3.2 Test API Key Generation

1. In dashboard → **Settings** → **API Keys**
2. Click **"Create Key"**
3. Copy the displayed key
4. Test the key with curl:

```bash
curl -X POST https://your-render-url/api/clone \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com"
  }'
```

### 3.3 Test Website Cloning

1. In dashboard → **New Conversion**
2. Enter a website URL
3. Click **Clone**
4. Observe the conversion process
5. Once complete, view the output HTML

---

## Part 4: Troubleshooting

### Issue: Function Returns 500 Error

**Check logs:**
```bash
firebase functions:log --limit 50
```

**Common causes:**
- Gemini API not enabled in Firebase project
- Service account missing Gemini permissions
- Invalid `@google/genai` version

**Fix:**
1. Enable Generative AI API in Google Cloud Console
2. Grant service account `roles/aiplatform.user` role
3. Redeploy: `firebase deploy --only functions`

### Issue: Firebase Auth Not Working

**Symptoms:** Google sign-in fails with `invalid_client`

**Fix:**
1. Go to Firebase Console → Authentication → Google
2. Ensure Google is enabled
3. Add Render URL to authorized redirect URIs:
   - Firebase Console → Project Settings → Authorized domains
   - Add: `your-service.onrender.com`

### Issue: Environment Variables Not Loaded

**Fix:**
1. In Render dashboard, manually redeploy:
   - Click **Manual Deploy** button
   - Or push to git if auto-deploy enabled
2. Verify variables appear in deployment logs

### Issue: API Key Clone Endpoint Returns 401

**Symptoms:** `{ "error": "Invalid or revoked API key" }`

**Fix:**
1. Ensure API key is copied correctly (no spaces)
2. Check key is in Authorization header as `Bearer YOUR_KEY`
3. Verify key hasn't been revoked in dashboard

---

## Part 5: Monitor & Maintain

### View Logs

**Render logs:**
```
Render Dashboard → Logs tab
```

**Firebase Function logs:**
```bash
firebase functions:log --limit 100
```

### Update Function

If you make changes to `functions/index.js`:

```bash
firebase deploy --only functions
```

Then trigger a Render redeploy (it will auto-detect the change if using git integration).

### Check Usage

Firebase Console → Functions → Monitoring tab shows:
- Execution count
- Duration
- Error rate

---

## Part 6: Advanced: Enable Auto-Deploy

If you want Render to auto-deploy when you push to GitHub:

1. Render Dashboard → **Settings** → **Deploy Hooks**
2. Copy the Deploy Hook URL
3. Add as GitHub webhook:
   - Repo → Settings → Webhooks
   - Payload URL: (paste Deploy Hook URL)
   - Events: Push events
   - Active: ✓

Now every `git push` triggers a Render redeploy.

---

## Summary

After completing all steps:

✅ Firebase Cloud Functions deployed  
✅ Gemini API enabled and working  
✅ Firebase Auth (Google login) configured  
✅ Render environment variables set  
✅ API key management functional  
✅ Website cloning via AI operational  
✅ Public API endpoint secured with keys  

Your app is ready for production! 🚀
