# DOGSWAB - App Store Metadata Requirements

## CRITICAL: App Store Connect Configuration

### ⚠️ IMPORTANT APPLE DEVELOPER PROGRAM REQUIREMENT

**You MUST enroll as an ORGANIZATION, not an individual.**

According to Apple's Guideline 5.1.1(ix), apps that offer highly regulated services or handle sensitive user data (like healthcare/veterinary information) must be submitted by an organization account.

**Action Required:**
1. Convert your individual Apple Developer account to an organization account
2. Contact Apple Developer Support: https://developer.apple.com/contact/
3. Or enroll in a new Apple Developer Program account as an organization

---

## App Information

### App Name
**DOGSWAB - Pet Health Assistant**

### Subtitle (30 characters max)
**Pet Medical Records Manager**

### Description

**DOGSWAB: Veterinary Document Manager & Pet Health Organizer**

The complete document management system for your pet's health records. Store vaccination certificates, track medication schedules, set vet appointment reminders, and find licensed veterinarians near you.

**Primary Features:**
• Document Storage - Upload and organize vaccination records, lab results, prescriptions, and medical documents
• Smart Reminders - Never miss medications, checkups, or vaccinations with automated health reminders
• Veterinary Directory - Search and connect with licensed veterinarians in your area
• Appointment History - Track all vet visits and medical consultations
• Insurance Comparison - Compare pet insurance quotes from multiple providers
• Health Timeline - Visual timeline of your pet's complete medical history

**Additional Tool:**
• AI Educational Assistant - Get general pet care information (EDUCATIONAL ONLY - not medical advice)

⚠️ IMPORTANT MEDICAL DISCLAIMER
DOGSWAB is a document management and veterinary directory tool. This app does NOT provide medical advice, diagnosis, or treatment. The AI assistant provides educational information only. For all health concerns, symptoms, or emergencies, consult a licensed veterinarian immediately.

**Subscription Tiers:**
• Free: 3 documents per pet, basic reminders, limited AI queries
• Premium ($9.99/month): Unlimited documents, smart reminders, vet directory access
• Pro ($19.99/month): Family sharing, priority support, advanced health analytics

**What DOGSWAB Is:**
A document management and organizational tool for pet health records. We help you store documents, set reminders, and find licensed veterinarians.

**What DOGSWAB Is NOT:**
DOGSWAB does not provide veterinary services, medical advice, diagnosis, or treatment. We are a document storage and veterinary directory platform. All medical advice must come from licensed veterinary professionals.

**Privacy & Security:**
Your pet's health data is encrypted and secure. We never sell your information.

**Support:**
Email: support@dogswab.com
Website: https://dogswab.com

---

## Required Links (MUST BE FUNCTIONAL)

### Support URL
**https://dogswab.com/support**
(Or use: `/support.html` in the app)

### Marketing URL (Optional)
**https://dogswab.com**

### Privacy Policy URL (REQUIRED)
**https://dogswab.com/privacy**
(Or use: `/privacy.html` in the app)

**Action Required:** Add this URL to the Privacy Policy field in App Store Connect

### Terms of Use (EULA) URL (REQUIRED FOR SUBSCRIPTIONS)
**https://dogswab.com/terms**
(Or use: `/terms.html` in the app)

**Action Required:** Either:
1. Add this URL in the App Description field, OR
2. Upload custom EULA in App Store Connect

---

## Auto-Renewable Subscription Information

### REQUIRED in App Store Connect Metadata:

**Product 1: DOGSWAB Premium Monthly**
- Title: DOGSWAB Premium Monthly
- Duration: 1 month
- Price: $9.99
- Features: Unlimited AI consultations, Vet booking, Health tracking
- Privacy Policy: https://dogswab.com/privacy
- Terms of Use: https://dogswab.com/terms

**Product 2: DOGSWAB Pro Monthly**
- Title: DOGSWAB Pro Monthly
- Duration: 1 month
- Price: $19.99
- Features: All Premium features + Priority support + Multi-pet management
- Privacy Policy: https://dogswab.com/privacy
- Terms of Use: https://dogswab.com/terms

### REQUIRED in the App Itself:

The app already includes (in SubscriptionModal.tsx):
✅ Title of each subscription
✅ Length of subscription (monthly)
✅ Price of each subscription
✅ Functional links to Privacy Policy
✅ Functional links to Terms of Use (EULA)
✅ Description of what's included

---

## Categories

### Primary Category
**Medical**

### Secondary Category
**Health & Fitness**

---

## Keywords (100 characters max)

```
pet records,vet documents,vaccination tracker,pet reminders,veterinary,pet organizer,medical records
```

---

## App Store Screenshots Requirements

### iPhone Screenshots (Required)
- 6.7" display (iPhone 14 Pro Max, 15 Pro Max, etc.)
- 5.5" display (iPhone 8 Plus, etc.)
- Minimum: 3-10 screenshots
- Format: PNG or JPEG
- Resolution: 1290 x 2796 pixels (6.7")

### iPad Screenshots (Required if supporting iPad)
- 12.9" display (iPad Pro)
- 11" display (iPad Pro)
- Resolution: 2048 x 2732 pixels (12.9")

### Screenshot Content Suggestions:
1. Welcome screen showing educational disclaimer
2. Chat interface with AI pet health info
3. Vet directory/booking interface
4. Pet profile and health records
5. Subscription options screen

---

## App Preview Video (Optional but Recommended)

- Length: 15-30 seconds
- Show main features
- Include disclaimer that app is educational only

---

## Age Rating

### Recommended: 4+
- No inappropriate content
- Medical/health information is educational
- No user-generated content
- No social features
- No gambling
- No violence

---

## App Store Review Information

### Demo Account (Optional)
Not required - app works without login

### Notes for Reviewer:

```
IMPORTANT FOR APP REVIEW:

1. EDUCATIONAL APP DISCLAIMER:
DOGSWAB provides EDUCATIONAL INFORMATION ONLY about pet health. We do NOT provide medical advice, diagnosis, or treatment. The app clearly displays medical disclaimers throughout.

2. SUBSCRIPTIONS:
- All In-App Purchases use Apple's subscription system
- No external payment processing (Stripe removed)
- Subscriptions include:
  • Free tier: 5 AI consultations/month
  • Premium ($9.99/month): Unlimited consultations
  • Pro ($19.99/month): All features

3. MARKETPLACE MODEL:
- We connect pet owners with licensed veterinarians
- Veterinarians listed are licensed professionals
- We earn 15% commission on appointments booked
- Pet insurance quotes earn referral commissions

4. COMPLIANCE:
- Privacy Policy: /privacy.html
- Terms of Use: /terms.html
- Support: /support.html
- All required subscription information is displayed in-app

5. TEST INSTRUCTIONS:
- App works without login (optional feature)
- Subscriptions can be tested in sandbox mode
- AI features use educational responses only
- No actual medical advice is provided

6. FIXES APPLIED TO THIS VERSION:
- ✅ UI optimized for iPhone 17 Pro Max and all device sizes
- ✅ Support URL now functional
- ✅ Privacy Policy linked in app and metadata
- ✅ Terms of Use (EULA) linked in app and metadata
- ✅ All subscription metadata included
- ✅ Stripe payment removed - Apple IAP only
- ✅ Responsive layout fixes applied
```

---

## Contact Information

### Email
support@dogswab.com

### Phone (Optional)
(To be added if available)

---

## Version Information

### Version Number
**1.0.252** (Current build)

### What's New in This Version
```
Initial Release

DOGSWAB is your pet health education companion:
• Learn about pet care and wellness
• Find licensed veterinarians
• Compare pet insurance quotes
• Track your pet's health records
• Book appointments with vets
• Get general pet care information

This app provides educational information only and does not replace professional veterinary care.
```

---

## Pre-Launch Checklist

Before submitting to App Store:

### Legal & Compliance
- [ ] Enrolled as ORGANIZATION (not individual) in Apple Developer Program
- [ ] Privacy Policy hosted and linked
- [ ] Terms of Use (EULA) hosted and linked
- [ ] Support page functional
- [ ] Medical disclaimers prominent throughout app
- [ ] Age rating appropriate (4+)

### Technical
- [ ] App builds without errors
- [ ] UI tested on iPhone 17 Pro Max
- [ ] UI tested on iPad Air 11-inch
- [ ] Subscriptions work in sandbox mode
- [ ] All IAP products created in App Store Connect
- [ ] No Stripe references in code
- [ ] All external links functional

### Metadata
- [ ] App name, subtitle, description complete
- [ ] Keywords optimized
- [ ] Screenshots prepared (3-10 for iPhone)
- [ ] App icon uploaded (1024x1024px)
- [ ] Privacy Policy URL added to metadata
- [ ] Terms of Use URL in app description or EULA field
- [ ] Support URL added to metadata
- [ ] Subscription information complete

### App Store Connect
- [ ] Build uploaded via Xcode or Transporter
- [ ] Build selected for this version
- [ ] All required metadata fields filled
- [ ] Export compliance information completed
- [ ] Content rights declaration completed
- [ ] Paid Apps Agreement signed

---

## Common Rejection Reasons & Fixes

### ❌ "App not optimized for device"
**Fix Applied:** Added responsive layout fixes, overflow controls, and device-specific optimizations

### ❌ "Support URL not functional"
**Fix Applied:** Created comprehensive support.html page

### ❌ "Missing Terms of Use for subscriptions"
**Fix Applied:** Created terms.html and added links in app and description

### ❌ "In-App Purchase issues with Stripe"
**Fix Applied:** Removed all Stripe code, using Apple IAP exclusively

### ❌ "Individual account for regulated service"
**Fix Required:** Must convert to organization account

---

## After Approval

### Post-Launch Tasks:
1. Monitor user reviews and ratings
2. Respond to user feedback
3. Track subscription metrics
4. Update app regularly with improvements
5. Add more veterinarians to marketplace
6. Expand insurance provider partnerships

### Marketing:
1. Submit to product hunt
2. Social media announcements
3. Press releases to pet industry publications
4. Vet clinic partnerships
5. Pet influencer outreach

---

## Support Resources

### Apple Developer
- App Store Connect: https://appstoreconnect.apple.com
- Developer Documentation: https://developer.apple.com/documentation
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines
- Contact Support: https://developer.apple.com/contact

### DOGSWAB Resources
- Support Email: support@dogswab.com
- Vet Registration: vets@dogswab.com
- Business Partnerships: partners@dogswab.com

---

## Version History

**1.0.252 (Current)**
- Initial release submission
- Fixed UI layout for iPhone 17 Pro Max
- Added functional support page
- Added Terms of Use (EULA)
- Removed Stripe, using Apple IAP only
- Added all required subscription metadata
- Comprehensive medical disclaimers

---

**Last Updated:** February 21, 2026
**Document Version:** 1.0
