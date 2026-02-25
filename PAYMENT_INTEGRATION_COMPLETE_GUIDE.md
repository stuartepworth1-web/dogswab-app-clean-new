# Complete Payment Integration Guide

## Overview

DOGSWAB uses **Stripe** for all payment processing including:
- Monthly subscriptions (Basic, Premium, Pro plans)
- One-time vet consultation bookings
- Veterinarian registration and payouts

This guide explains how to make the payment system 100% functional for real customers.

---

## Current Status

The app is configured to work with Stripe but requires setup:

1. **Stripe Account** - Required
2. **API Keys** - Need to be added to environment variables
3. **Products & Price IDs** - Need to be created in Stripe Dashboard
4. **Webhooks** - Need to be configured for subscription events

---

## Step-by-Step Setup

### Part 1: Stripe Account Setup

1. **Create a Stripe Account** (if you don't have one)
   - Go to https://stripe.com
   - Click "Start now" and create an account
   - Complete business verification

2. **Enable Test Mode**
   - In your Stripe Dashboard, toggle "Test mode" in the top right
   - This lets you test everything before going live

---

### Part 2: Create Subscription Products

Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)

#### Product 1: DOGSWAB Basic
```
Name: DOGSWAB Basic Monthly
Description: 50 AI consultations/month, basic health tracking, photo analysis, email support
Pricing Model: Recurring
Price: $9.99 USD
Billing Period: Monthly
```

#### Product 2: DOGSWAB Premium (Most Popular)
```
Name: DOGSWAB Premium Monthly
Description: Unlimited AI consultations, vet booking, priority support, multi-pet management, predictive health alerts
Pricing Model: Recurring
Price: $19.99 USD
Billing Period: Monthly
```

#### Product 3: DOGSWAB Pro
```
Name: DOGSWAB Pro Monthly
Description: Everything in Premium plus video vet consultations, 24/7 emergency hotline, family sharing (5 members), custom reports, API access
Pricing Model: Recurring
Price: $49.99 USD
Billing Period: Monthly
```

After creating each product, **copy the Price ID** (starts with `price_`).

---

### Part 3: Get Your API Keys

1. Go to [Stripe Dashboard → Developers → API Keys](https://dashboard.stripe.com/apikeys)

2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`) - Keep this private!

3. Copy both keys (use Test mode keys first)

---

### Part 4: Update Environment Variables

Update the `.env` file in your project:

```env
# Stripe Keys (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Existing Supabase keys remain unchanged
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

### Part 5: Update Price IDs in Code

After updating the `.env` file, you need to update the Price IDs in the code:

Open `src/services/stripeService.ts` and update lines 29, 41, and 56:

```typescript
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'DOGSWAB Basic Monthly',
    price: 9.99,
    priceId: 'price_YOUR_BASIC_PRICE_ID',  // ← Replace this
    features: [...]
  },
  {
    id: 'premium',
    name: 'DOGSWAB Premium Monthly',
    price: 19.99,
    priceId: 'price_YOUR_PREMIUM_PRICE_ID',  // ← Replace this
    popular: true,
    features: [...]
  },
  {
    id: 'pro',
    name: 'DOGSWAB Pro Monthly',
    price: 49.99,
    priceId: 'price_YOUR_PRO_PRICE_ID',  // ← Replace this
    features: [...]
  }
];
```

---

### Part 6: Configure Webhooks (Important for Production)

Webhooks allow Stripe to notify your app about subscription events.

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)

2. Click "Add endpoint"

3. Enter your webhook URL:
   - For development: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks
   - For production: `https://your-domain.com/api/webhooks/stripe`

4. Select these events to listen for:
   - `checkout.session.completed` - When payment succeeds
   - `customer.subscription.created` - New subscription
   - `customer.subscription.updated` - Subscription changed
   - `customer.subscription.deleted` - Subscription canceled
   - `invoice.payment_succeeded` - Monthly payment succeeded
   - `invoice.payment_failed` - Payment failed

5. Copy the **Webhook signing secret** (starts with `whsec_`)

6. Add it to your `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   ```

---

### Part 7: Test the Integration

#### Test Subscriptions

1. In your app, click "Upgrade" or choose a subscription plan
2. Use Stripe test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **3D Secure**: `4000 0025 0000 3155`
   - Use any future expiry date, any CVC, any postal code

3. Complete the checkout flow

4. Check your Stripe Dashboard to see the test payment

#### Test Vet Bookings

1. Navigate to "Find a Vet" in the app
2. Book a consultation
3. Use the same test cards to complete payment

---

### Part 8: Enable Apple In-App Purchases (iOS Only)

For the iOS app, you should also integrate Apple's In-App Purchase for subscriptions to comply with App Store guidelines.

The app currently has the infrastructure ready in `src/services/iapService.ts`.

To activate:

1. Create subscription products in [App Store Connect](https://appstoreconnect.apple.com)
2. Use the same pricing tiers: $9.99, $19.99, $49.99
3. Copy the product IDs from App Store Connect
4. Test using TestFlight and Sandbox accounts

**Note**: For web and Android, continue using Stripe. For iOS, Apple requires In-App Purchase.

---

## Going Live (Production)

When ready to accept real payments:

1. **Switch to Live Mode** in Stripe Dashboard
2. **Get Live API Keys** from [API Keys page](https://dashboard.stripe.com/apikeys)
3. **Update `.env` file** with live keys (remove `_test_` keys)
4. **Update Price IDs** with live product price IDs
5. **Configure production webhook** with your live domain
6. **Complete Stripe verification** if prompted
7. **Test with real card** (small amount first)

---

## Veterinarian Payouts

For vets receiving payments:

1. **Stripe Connect** is used for marketplace functionality
2. Vets connect their bank accounts during registration
3. Platform takes 15% commission, vets receive 85%
4. Payouts happen monthly via direct deposit

To enable:
1. Go to [Stripe Dashboard → Connect Settings](https://dashboard.stripe.com/settings/connect)
2. Enable "Standard" account type
3. Complete onboarding requirements

---

## Cost Breakdown

### Stripe Fees (Standard Pricing)
- **Credit/Debit Cards**: 2.9% + $0.30 per transaction
- **International Cards**: +1.5%
- **Currency Conversion**: +1%
- **Subscriptions**: Same as above, charged monthly
- **Payouts**: Free (to US bank accounts)

### Example Math
- Customer pays $19.99/month for Premium
- Stripe fee: ($19.99 × 2.9%) + $0.30 = $0.88
- You receive: $19.99 - $0.88 = $19.11 per month

---

## Troubleshooting

### "Payment system not configured" error
- Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set in `.env`
- Make sure the key doesn't contain quotes or extra spaces
- Restart your development server after changing `.env`

### Checkout redirects but fails
- Verify Price IDs are correct in `stripeService.ts`
- Check that products are active in Stripe Dashboard
- Look for errors in browser console

### Webhooks not working
- Use [Stripe CLI](https://stripe.com/docs/stripe-cli) for local testing
- Verify webhook URL is publicly accessible
- Check webhook signing secret is correct

---

## Security Best Practices

1. **Never commit API keys** to Git (`.env` is in `.gitignore`)
2. **Use environment variables** for all sensitive data
3. **Validate on the server** - Never trust client-side amounts
4. **Use webhook signatures** to verify Stripe events
5. **Implement rate limiting** on payment endpoints
6. **Log all transactions** for audit trails
7. **Use HTTPS** in production (required by Stripe)

---

## Support Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe API Reference**: https://stripe.com/docs/api
- **Test Cards**: https://stripe.com/docs/testing
- **Webhooks Guide**: https://stripe.com/docs/webhooks
- **Stripe Dashboard**: https://dashboard.stripe.com

---

## Summary Checklist

Before going live, ensure:

- [ ] Stripe account created and verified
- [ ] Three subscription products created
- [ ] API keys added to `.env`
- [ ] Price IDs updated in code
- [ ] Test purchases completed successfully
- [ ] Webhooks configured and tested
- [ ] Error handling tested
- [ ] Production keys ready for deployment
- [ ] HTTPS enabled on production domain
- [ ] Compliance review completed (GDPR, PCI DSS via Stripe)

---

## Quick Start for Customers

Once everything above is configured:

1. Customer visits your app
2. Clicks "Upgrade" or selects a plan
3. Enters payment details on Stripe Checkout
4. Gets redirected back to app with active subscription
5. Immediately gets access to premium features

That's it! Stripe handles:
- PCI compliance
- Fraud detection
- Recurring billing
- Failed payment retries
- Subscription management
- International currencies

---

## Need Help?

If you encounter issues during setup:

1. Check the [Stripe Dashboard logs](https://dashboard.stripe.com/logs)
2. Review browser console for JavaScript errors
3. Test with Stripe's recommended test cards
4. Contact Stripe Support (they're very responsive!)
5. Review this guide's troubleshooting section

---

**Last Updated**: January 2026
**DOGSWAB Version**: 1.0.860
**Stripe API Version**: Latest
