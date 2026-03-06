# 💳 Complete Payment Integration Setup Guide

## Overview

Your app now has a complete payment system that works on both web and mobile:
- **Web/Desktop**: Stripe Checkout
- **iOS**: Apple In-App Purchases
- **Android**: Google Play Billing (future)

## Step 1: Create Stripe Account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Sign up with your email
3. Complete business verification

## Step 2: Create Subscription Products in Stripe

Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products) and create 3 products:

### Product 1: DOGSWAB Basic Monthly
- **Name**: DOGSWAB Basic Monthly
- **Description**: 50 AI consultations/month, basic health tracking, photo symptom analysis, email support
- **Pricing Model**: Recurring
- **Price**: $9.99 USD
- **Billing Period**: Monthly
- Click "Add product"
- **Copy the Price ID** (starts with `price_`)

### Product 2: DOGSWAB Premium Monthly
- **Name**: DOGSWAB Premium Monthly
- **Description**: Unlimited AI consultations, advanced health analytics, vet booking, priority support, multi-pet management
- **Pricing Model**: Recurring
- **Price**: $19.99 USD
- **Billing Period**: Monthly
- Click "Add product"
- **Copy the Price ID** (starts with `price_`)

### Product 3: DOGSWAB Pro Monthly
- **Name**: DOGSWAB Pro Monthly
- **Description**: Everything in Premium plus video consultations, 24/7 emergency hotline, family sharing (5 members)
- **Pricing Model**: Recurring
- **Price**: $49.99 USD
- **Billing Period**: Monthly
- Click "Add product"
- **Copy the Price ID** (starts with `price_`)

## Step 3: Get Your Stripe Keys

### Publishable Key (for web app)
1. Go to [Developers → API Keys](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)

### Secret Key (for backend)
1. In the same page, reveal and copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
2. **Keep this secure - never commit to GitHub!**

## Step 4: Configure Stripe Webhook

1. Go to [Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://xcphzuyzdrjikagujegx.supabase.co/functions/v1/stripe-webhook`
4. Description: "DOGSWAB Subscription Updates"
5. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
6. Click "Add endpoint"
7. Copy the **Signing secret** (starts with `whsec_`)

## Step 5: Add Environment Variables

### Local Development (.env file)
Add these to your `.env` file:

```env
VITE_SUPABASE_URL=https://xcphzuyzdrjikagujegx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjcGh6dXl6ZHJqaWthZ3VqZWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4Mjc3MjEsImV4cCI6MjA4NDQwMzcyMX0.YqP7Rcv3NYd8Ir02QtZ7xqJgt3fAmkSPQdQSUpFBu2I

# Add these Stripe variables:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_STRIPE_BASIC_PRICE_ID=price_xxxxxxxxxxxxx
VITE_STRIPE_PREMIUM_PRICE_ID=price_xxxxxxxxxxxxx
VITE_STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx
```

### Netlify Environment Variables
1. Go to your Netlify site dashboard
2. Site settings → Environment variables
3. Add these variables:
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `VITE_STRIPE_BASIC_PRICE_ID`
   - `VITE_STRIPE_PREMIUM_PRICE_ID`
   - `VITE_STRIPE_PRO_PRICE_ID`

### Supabase Edge Function Secrets
Run these commands in your terminal:

```bash
# Set Stripe Secret Key
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Set Webhook Secret
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 6: Test the Payment Flow

### Test Mode (recommended first)
1. Make sure you're using **test mode** keys (pk_test_ and sk_test_)
2. Go to your app and click "Subscribe"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Any future expiry date (e.g., 12/34)
5. Any 3-digit CVC (e.g., 123)
6. Any ZIP code

### Live Mode (when ready)
1. Switch to **live mode** in Stripe Dashboard
2. Replace all test keys with live keys (pk_live_ and sk_live_)
3. Update Netlify environment variables
4. Update Supabase secrets
5. Update webhook URL

## Step 7: Verify Everything Works

### Web Payments Checklist
- [ ] Subscription modal opens when clicking upgrade
- [ ] All 3 plans show correct prices
- [ ] Clicking "Subscribe Now" redirects to Stripe Checkout
- [ ] Test card payment completes successfully
- [ ] User is redirected back with success message
- [ ] Subscription status updates in app

### Webhook Checklist
- [ ] Checkout completion creates subscription record
- [ ] Subscription updates are tracked
- [ ] Cancellations are handled
- [ ] Failed payments are logged

## Payment Flow Architecture

```
┌─────────────────────────────────────────────────────┐
│                    User Action                       │
│          (Clicks "Subscribe" in web app)             │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│              Frontend (React)                        │
│  - SubscriptionModal collects plan selection         │
│  - Calls createStripeCheckoutSession()               │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│        Supabase Edge Function                        │
│         (create-checkout)                            │
│  - Creates Stripe Checkout Session                   │
│  - Returns checkout URL                              │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│            Stripe Checkout                           │
│  - User enters payment details                       │
│  - Stripe processes payment                          │
│  - Redirects to success/cancel URL                   │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│            Stripe Webhook                            │
│        (stripe-webhook function)                     │
│  - Receives checkout.session.completed               │
│  - Updates subscription in Supabase DB               │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│              User Dashboard                          │
│  - Shows active subscription                         │
│  - Unlocks premium features                          │
└─────────────────────────────────────────────────────┘
```

## Mobile Payments (iOS)

For iOS, the app uses Apple In-App Purchases instead of Stripe. This is automatically handled by the `iapService.ts` file.

**Important**: iOS requires separate setup in App Store Connect with product IDs matching your subscription tiers.

## Troubleshooting

### "Payment system not configured" error
- Check that all environment variables are set correctly
- Verify Stripe keys are valid (test vs live mode)
- Check browser console for detailed error messages

### Webhook not firing
- Verify webhook URL is correct in Stripe Dashboard
- Check that webhook secret is set in Supabase
- Test webhook using Stripe CLI: `stripe trigger checkout.session.completed`

### Subscription not showing as active
- Check Supabase subscriptions table for records
- Verify webhook received the event (check Stripe Dashboard → Webhooks → Events)
- Look at edge function logs in Supabase

## Security Best Practices

✅ **DO:**
- Keep secret keys secure
- Use environment variables
- Validate webhooks with signing secrets
- Use HTTPS for all endpoints
- Test in test mode first

❌ **DON'T:**
- Commit secret keys to Git
- Share API keys publicly
- Skip webhook signature verification
- Use test keys in production

## Support

If you need help:
- Stripe Documentation: [https://stripe.com/docs](https://stripe.com/docs)
- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Contact: support@dogswab.com

## Next Steps

After completing this setup:
1. Test thoroughly in test mode
2. Set up subscription management UI
3. Add billing portal link (for users to manage subscriptions)
4. Implement subscription status checking on app load
5. Add grace period handling for failed payments
6. Set up email notifications for subscription events
