# Render Static Site Deployment Configuration

## Problem: 404 on Page Refresh

When you refresh the page on routes like `/review-plans`, `/notes`, etc., you get a 404 error. This happens because the static site server doesn't know about React Router's client-side routes.

## Solution: Configure Rewrite Rules

### Option 1: Using Render Dashboard (Recommended)

1. Go to your Render Dashboard: https://dashboard.render.com
2. Select your frontend service
3. Go to **Settings** tab
4. Scroll down to **Static Site** section
5. Under **Redirects/Rewrites**, add:

   **Key**: `/*`
   **Value**: `/index.html`
   **Status**: `200`

   OR

   Add environment variable:
   - **Key**: `SPA_FALLBACK`
   - **Value**: `index.html`

### Option 2: Using render.yaml (if using Infrastructure as Code)

A `render.yaml` file has been created in the root directory. If you're using Render's Infrastructure as Code:

1. Make sure `render.yaml` is in your repository root
2. Render will automatically use it during deployment

### Option 3: Manual Configuration via Build Command

If the above don't work, you can create a custom server configuration:

1. Create a simple Express server in the `frontend` directory (optional)
2. Or ensure Render recognizes it as a Single Page Application (SPA)

## Verify Configuration

After configuring:

1. Deploy your frontend again
2. Navigate to any route (e.g., `/review-plans`)
3. Refresh the page (F5)
4. The page should load correctly instead of showing 404

## Alternative: Using HashRouter (Not Recommended)

If you can't configure server rewrites, you could use `HashRouter` instead of `BrowserRouter`, but this changes URLs to include `#` (e.g., `/#/review-plans`), which is less clean.

The current configuration uses `BrowserRouter`, which requires proper server configuration.

## Current Status

- ✅ `_redirects` file created (for Netlify)
- ✅ `vercel.json` created (for Vercel)
- ✅ `render.yaml` created (for Render)
- ⚠️ **Action Required**: Configure redirects in Render Dashboard

