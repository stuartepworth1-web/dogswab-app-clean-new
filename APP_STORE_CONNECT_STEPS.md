# Quick App Store Connect Setup Guide

## STEP 1: Update App Information (5 minutes)

1. Log into https://appstoreconnect.apple.com
2. Select your app "DOGSWAB"
3. Go to **App Information**
4. Update these URLs:
   - **Support URL:** `https://dogswab.com/support.html`
   - **Privacy Policy URL:** `https://dogswab.com/privacy.html`
5. Click **Save**

---

## STEP 2: Update App Description (3 minutes)

1. In App Store Connect, go to your app
2. Click **App Store** tab
3. Scroll to **Description**
4. Add this text at the beginning:

```
🐾 DOGSWAB - Your Pet's AI Health Assistant

Get instant answers to pet health questions, connect with licensed veterinarians, and manage your pet's wellness—all in one app.

EDUCATIONAL INFORMATION ONLY - NOT MEDICAL ADVICE
For medical concerns, always consult a licensed veterinarian.

✨ SUBSCRIPTION PLANS

• DOGSWAB Basic Monthly - $9.99/month
  50 AI consultations, basic health tracking, photo analysis

• DOGSWAB Premium Monthly - $19.99/month
  Unlimited consultations, vet booking, priority support

• DOGSWAB Pro Monthly - $49.99/month
  Everything in Premium + video consultations, 24/7 hotline

Auto-renewable subscriptions. Cancel anytime in Settings. Payment charged to iTunes Account. Auto-renews unless cancelled 24 hours before period ends.

Terms of Use: https://dogswab.com/terms.html
Privacy Policy: https://dogswab.com/privacy.html
```

5. Click **Save**

---

## STEP 3: Create IAP Products (20 minutes)

### Create Subscription Group
1. Go to **Features** → **In-App Purchases**
2. Click **Manage** next to "Subscription Groups"
3. Click **"+"** to create group
4. Name: `DOGSWAB Subscriptions`
5. Click **Create**

### Add Subscription #1: Basic
1. Click **"+"** in subscription group
2. Select **Auto-Renewable Subscription**
3. Fill in:
   - **Reference Name:** `DOGSWAB Basic Monthly`
   - **Product ID:** `com.dogswab.basic.monthly`
4. Click **Create**
5. Fill in details:
   - **Subscription Duration:** 1 Month
   - **Subscription Price:** Tier 10 ($9.99)
6. **Subscription Localizations:**
   - **Display Name:** DOGSWAB Basic
   - **Description:** 50 AI consultations per month, basic health tracking, photo symptom analysis, email support
7. **Review Information:**
   - Upload a screenshot of the subscription screen
8. Click **Save**

### Add Subscription #2: Premium
1. Click **"+"** in subscription group
2. Select **Auto-Renewable Subscription**
3. Fill in:
   - **Reference Name:** `DOGSWAB Premium Monthly`
   - **Product ID:** `com.dogswab.premium.monthly`
4. Click **Create**
5. Fill in details:
   - **Subscription Duration:** 1 Month
   - **Subscription Price:** Tier 20 ($19.99)
6. **Subscription Localizations:**
   - **Display Name:** DOGSWAB Premium
   - **Description:** Unlimited AI consultations, advanced health analytics, vet booking marketplace, priority support, multi-pet management, predictive health alerts
7. **Review Information:**
   - Upload a screenshot of the subscription screen
8. Click **Save**

### Add Subscription #3: Pro
1. Click **"+"** in subscription group
2. Select **Auto-Renewable Subscription**
3. Fill in:
   - **Reference Name:** `DOGSWAB Pro Monthly`
   - **Product ID:** `com.dogswab.pro.monthly`
4. Click **Create**
5. Fill in details:
   - **Subscription Duration:** 1 Month
   - **Subscription Price:** Tier 50 ($49.99)
6. **Subscription Localizations:**
   - **Display Name:** DOGSWAB Pro
   - **Description:** Everything in Premium plus video vet consultations, 24/7 emergency hotline, family sharing for 5 members, custom health reports, API access
7. **Review Information:**
   - Upload a screenshot of the subscription screen
8. Click **Save**

### Submit for Review
1. For each subscription, click **Submit for Review**
2. Confirm submission

---

## STEP 4: Accept Paid Apps Agreement (10 minutes)

1. In App Store Connect, click your name (top right)
2. Go to **Agreements, Tax, and Banking**
3. Find **Paid Apps** agreement
4. Click **Request**
5. Follow prompts to accept
6. Complete **Contact Information**
7. Complete **Bank Information**
8. Complete **Tax Forms** (W-9 for US entities)
9. Submit

⚠️ **Banking info takes 1-2 days to verify**

---

## STEP 5: Convert to Organization Account

### Option A: Convert Existing Account
1. Go to https://developer.apple.com/contact/
2. Select **Membership and Account**
3. Select **Update your existing membership**
4. Explain you need to convert from Individual to Organization
5. Wait for Apple's response (1-2 business days)
6. Provide requested documents:
   - D-U-N-S Number
   - Business registration
   - Articles of incorporation
   - Proof of authority

### Option B: Create New Organization Account
1. Go to https://developer.apple.com/programs/enroll/
2. Click **Start Your Enrollment**
3. Select **Enroll as an Organization**
4. Complete enrollment ($99/year)
5. Wait for approval (3-5 business days)
6. Transfer app from old account to new account

### Get D-U-N-S Number (Required)
1. Go to https://www.dnb.com/duns-number/get-a-duns.html
2. Request free D-U-N-S number for Apple Developer Program
3. Takes 1-5 business days

---

## STEP 6: Test in Sandbox (15 minutes)

### Create Sandbox Testers
1. In App Store Connect, go to **Users and Access**
2. Click **Sandbox Testers**
3. Click **"+"** to add tester
4. Create test Apple IDs (use fake emails)
5. Create at least 3 testers

### Test on Device
1. Install app via TestFlight
2. Sign out of real Apple ID in Settings → App Store
3. Launch DOGSWAB app
4. Try to subscribe
5. Sign in with sandbox tester account when prompted
6. Complete test purchase (free in sandbox)
7. Verify subscription activates
8. Test "Restore Purchases"

---

## STEP 7: Resubmit to App Store (5 minutes)

1. Build new version with `npm run build:mobile`
2. Upload to App Store Connect via Xcode or Transporter
3. In App Store Connect:
   - Select new build
   - Click **Submit for Review**
4. In **App Review Information**, add note:

```
All issues from rejection 268f4dfd-bfb8-4cf8-bb72-5600ed7ef4af have been addressed:

1. ✅ UI optimized for iPhone 17 Pro Max and iPad Air
2. ✅ Organization account conversion in progress
3. ✅ Support URL now functional: https://dogswab.com/support.html
4. ✅ Terms & Privacy links added to app and metadata
5. ✅ Native In-App Purchases implemented (Stripe removed)

Test account for review:
Email: test@dogswab.com
Password: AppleReview2024!
```

5. Click **Submit**

---

## Timeline Summary

| Task | Time |
|------|------|
| Update App Store Connect info | 5 min |
| Update description | 3 min |
| Create IAP products | 20 min |
| Accept Paid Apps Agreement | 10 min |
| Bank verification | 1-2 days |
| Organization conversion | 3-5 days |
| Sandbox testing | 15 min |
| **Total** | **5-7 business days** |

---

## Checklist

### Before Resubmitting
- [ ] Support URL updated in App Store Connect
- [ ] Privacy Policy URL updated in App Store Connect
- [ ] Terms of Use added to description
- [ ] All 3 IAP products created (Basic, Premium, Pro)
- [ ] IAP products submitted for review
- [ ] Paid Apps Agreement accepted
- [ ] Banking information complete
- [ ] Tax forms complete
- [ ] Organization conversion started
- [ ] Tested subscriptions in Sandbox
- [ ] New build uploaded
- [ ] Submitted for review with notes

### After Submission
- [ ] Monitor for Apple's response (typically 24-48 hours)
- [ ] Respond promptly if Apple requests more info
- [ ] Once approved, monitor IAP purchases
- [ ] Check for any user issues with subscriptions

---

## Common Issues

### "IAP products not found"
- Make sure Product IDs match EXACTLY (case-sensitive)
- Wait 2-4 hours after creating products
- Clear cache and rebuild app

### "Sandbox tester already used"
- Create new sandbox tester
- Or change tester's password in App Store Connect

### "Banking info rejected"
- Ensure business name matches exactly
- Use business bank account (not personal)
- Contact Apple Developer Support if stuck

### "Organization conversion taking too long"
- Call Apple Developer Support: 1-800-692-7753
- Have your D-U-N-S number ready
- Be prepared to provide legal documents

---

## Need Help?

- **Apple Developer Support:** 1-800-692-7753
- **App Store Connect Help:** https://help.apple.com/app-store-connect/
- **IAP Testing Guide:** https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases

---

## Success!

Once all these steps are complete, your app should be approved by Apple. The most time-consuming parts are the organization account conversion and banking verification, so start those immediately.

Good luck with your resubmission! 🚀
