# IMMEDIATE ACTION CHECKLIST - Apple App Store Resubmission

## 🚨 CRITICAL: Do These First

### 1. Convert to Organization Account (REQUIRED)
**This is the #1 blocker for approval**

- [ ] Contact Apple Developer Support: https://developer.apple.com/contact/
- [ ] Request account conversion from Individual to Organization
- [ ] Prepare required documents:
  - [ ] Employer Identification Number (EIN)
  - [ ] Business registration documents
  - [ ] D-U-N-S number (if applicable)
  - [ ] Legal business name and address
- [ ] Wait for Apple to process (2-5 business days typically)

**OR if you have a business:**
- [ ] Create new Apple Developer account as Organization
- [ ] Transfer app to organization account

**Why this matters:** Apps handling health/medical data MUST be submitted by organizations, not individuals (Guideline 5.1.1)

---

## 📱 App Store Connect Changes

### 2. Update URLs in App Store Connect
- [ ] Go to App Store Connect: https://appstoreconnect.apple.com
- [ ] Select DOGSWAB app
- [ ] Click on your current version
- [ ] Update the following fields:

**Support URL:**
- [ ] Enter: `https://dogswab.com/support` (or host the `/public/support.html` file)

**Privacy Policy URL:**
- [ ] Enter: `https://dogswab.com/privacy` (or host the `/public/privacy.html` file)

**App Description (add Terms link):**
- [ ] Add this line: "Terms of Use: https://dogswab.com/terms"
- [ ] OR upload `/public/terms.html` in the EULA field

---

## 🏗️ Technical Steps

### 3. Build and Upload New Version
The code is already fixed! Just need to build and upload:

```bash
# Build the project
npm run build

# Sync with Capacitor
npm run build:mobile

# Open Xcode
npm run ios

# In Xcode:
# 1. Select "Any iOS Device (arm64)" as target
# 2. Product → Archive
# 3. Upload to App Store Connect
```

---

## 📋 App Store Connect - Subscription Setup

### 4. Create In-App Purchase Products

**Product 1: Basic Subscription**
- [ ] Product ID: `com.dogswab.basic.monthly`
- [ ] Type: Auto-Renewable Subscription
- [ ] Subscription Group: DOGSWAB Subscriptions
- [ ] Price: $9.99 USD
- [ ] Duration: 1 month
- [ ] Display Name: "DOGSWAB Basic Monthly"
- [ ] Description: "50 AI consultations/month, basic health tracking, photo analysis"

**Product 2: Premium Subscription**
- [ ] Product ID: `com.dogswab.premium.monthly`
- [ ] Type: Auto-Renewable Subscription
- [ ] Subscription Group: DOGSWAB Subscriptions
- [ ] Price: $19.99 USD
- [ ] Duration: 1 month
- [ ] Display Name: "DOGSWAB Premium Monthly"
- [ ] Description: "Unlimited consultations, vet booking, priority support"

**Product 3: Pro Subscription**
- [ ] Product ID: `com.dogswab.pro.monthly`
- [ ] Type: Auto-Renewable Subscription
- [ ] Subscription Group: DOGSWAB Subscriptions
- [ ] Price: $49.99 USD
- [ ] Duration: 1 month
- [ ] Display Name: "DOGSWAB Pro Monthly"
- [ ] Description: "All Premium features + 24/7 support + family sharing"

---

## 🌐 Website Setup (If Using External URLs)

### 5. Host Legal Pages (Optional but Recommended)

**Option A: Use GitHub Pages (Free)**
1. Create a GitHub repository
2. Upload `support.html`, `privacy.html`, `terms.html` to root
3. Enable GitHub Pages in settings
4. Use URLs in App Store Connect

**Option B: Use Your Own Domain**
1. Upload files to `https://dogswab.com/support`
2. Upload files to `https://dogswab.com/privacy`
3. Upload files to `https://dogswab.com/terms`
4. Ensure they're publicly accessible
5. Test all links before resubmission

**Option C: Use In-App Files (Current Setup)**
- The files are already in `/public/` folder
- They're accessible via `/support.html`, `/privacy.html`, `/terms.html`
- No external hosting needed!

---

## ✅ Pre-Submission Verification

### 6. Test Everything Before Resubmitting
- [ ] Open app on iPhone (any model)
- [ ] Check UI looks good and not crowded
- [ ] Test subscription modal opens
- [ ] Verify all 3 subscription tiers display
- [ ] Click Terms link - opens `/terms.html`
- [ ] Click Privacy link - opens `/privacy.html`
- [ ] Test "Subscribe" button triggers Apple IAP (sandbox mode)
- [ ] Check support page is accessible from settings

### 7. Device Testing
- [ ] Test on iPhone 14 Pro or later
- [ ] Test on iPad (if supporting iPad)
- [ ] Test in both portrait and landscape
- [ ] Test with Dynamic Type (accessibility)
- [ ] Test with VoiceOver enabled

---

## 📝 Resubmission Steps

### 8. Submit New Version

1. **In App Store Connect:**
   - [ ] Go to "My Apps" → DOGSWAB
   - [ ] Create new version (1.0.253 or keep 1.0.252)
   - [ ] Select your new build
   - [ ] Verify all metadata is correct
   - [ ] Add this to "What's New":
   ```
   Fixed:
   - Optimized UI for all iPhone models including iPhone 17 Pro Max
   - Added comprehensive support documentation
   - Updated subscription information display
   - Improved compliance with App Store guidelines
   ```

2. **Add Review Notes:**
   - [ ] Copy content from `APPLE_REJECTION_RESPONSE.md`
   - [ ] Paste into "App Review Information" → "Notes" field
   - [ ] Include: "All issues from review 268f4dfd-bfb8-4cf8-bb72-5600ed7ef4af have been resolved"

3. **Submit for Review:**
   - [ ] Click "Submit for Review"
   - [ ] Answer export compliance questions (select No for encryption if not using)
   - [ ] Confirm submission

---

## 🎯 Timeline Expectations

### What to Expect:

**Organization Account Conversion:** 2-5 business days
**App Review After Resubmission:** 1-2 days typically
**Total Time to Approval:** ~3-7 days

---

## 📞 Support Contacts

### If You Need Help:

**Apple Developer Support:**
- Phone: 1-800-633-2152 (US)
- Online: https://developer.apple.com/contact/

**For DOGSWAB Technical Questions:**
- Review the documentation files created:
  - `APP_STORE_METADATA.md`
  - `APPLE_REJECTION_RESPONSE.md`
  - `COMPLETE_UPLOAD_GUIDE.md`

---

## ⚠️ Common Mistakes to Avoid

### DON'T:
- ❌ Submit before converting to organization account
- ❌ Forget to update URLs in App Store Connect
- ❌ Submit without testing subscription flow
- ❌ Leave broken links in the app
- ❌ Skip creating IAP products in App Store Connect

### DO:
- ✅ Test on actual device before submitting
- ✅ Verify all links work (Terms, Privacy, Support)
- ✅ Double-check subscription products are created
- ✅ Include detailed notes for reviewers
- ✅ Test in sandbox mode with test Apple ID

---

## 🎉 After Approval

### Post-Approval Tasks:
1. Monitor reviews and ratings
2. Respond to user feedback within 24-48 hours
3. Track subscription metrics
4. Plan for regular updates
5. Start marketing campaign

---

## 📊 Quick Status Check

Use this to track your progress:

```
Progress: [____] 0% - Organization account conversion in progress
Progress: [██__] 50% - Account converted, uploading build
Progress: [████] 100% - Submitted for review
```

**Current Status:** Ready for organization account conversion and resubmission

---

## 🚀 You're Ready!

All code fixes are complete. The app is ready for resubmission once you:
1. ✅ Convert to organization account (or create one)
2. ✅ Update URLs in App Store Connect
3. ✅ Create IAP products
4. ✅ Upload new build
5. ✅ Submit for review

**Estimated time to complete checklist:** 1-2 hours (plus waiting for organization approval)

Good luck with your resubmission! 🎉
