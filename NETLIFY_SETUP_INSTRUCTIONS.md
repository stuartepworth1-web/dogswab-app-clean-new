# Netlify Environment Variables Setup

Your API key issue has been fixed! The Anthropic API key is now securely stored in a Supabase Edge Function instead of the frontend code.

## Required Environment Variables in Netlify

You need to set these environment variables in your Netlify dashboard:

### 1. Go to Netlify Dashboard
- Navigate to your site
- Click **Site configuration** → **Environment variables**

### 2. Add These Variables

**VITE_SUPABASE_URL**
```
[Your Supabase project URL from .env file]
```

**VITE_SUPABASE_ANON_KEY**
```
[Your Supabase anon key from .env file]
```

**VITE_STRIPE_PUBLISHABLE_KEY** (if using Stripe)
```
[Your Stripe publishable key from .env file]
```

### 3. Configure Anthropic API Key in Supabase

The Anthropic API key is now configured server-side:

1. Get your API key from: https://console.anthropic.com/settings/keys
2. Run this command in your terminal (replace with your actual key):

```bash
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

This keeps your API key secure on the server where users can't access it.

## What Changed?

- **Before:** API key was in frontend code → visible to users → security risk
- **After:** API key is in Supabase Edge Function → stays on server → secure

The AI chat now calls a Supabase Edge Function at `/functions/v1/ai-chat` which handles the Anthropic API securely.

## Next Steps

1. Set the environment variables in Netlify
2. Configure the Anthropic API key in Supabase using the command above
3. Redeploy your site

Your build will now succeed without security warnings!
