# Codemagic TestFlight Automatic Upload Setup Guide

## Overview
This guide will help you configure Codemagic to automatically upload your DOGSWAB iOS app to TestFlight after each successful build.

## Prerequisites
- Codemagic account connected to your repository
- Apple Developer account with admin access
- App Store Connect access

## Step 1: Create App Store Connect API Key

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to **Users and Access** → **Keys** tab
3. Click the **+** button to create a new key
4. Set these options:
   - Name: "Codemagic API Key"
   - Access: **App Manager** or **Admin**
5. Click **Generate**
6. **Download the key file** (you can only do this once!)
7. Note down:
   - **Issuer ID** (found at the top of the Keys page)
   - **Key ID** (shown in the key row)
   - **Key file** (the .p8 file you downloaded)

## Step 2: Configure Code Signing in Codemagic

### Option A: Automatic Code Signing (Recommended)

1. Log in to [Codemagic](https://codemagic.io)
2. Go to your DOGSWAB app
3. Navigate to **Settings** → **Code signing identities**
4. Under **iOS**, click **Add certificate**
5. Choose **Automatic code signing**
6. Connect your Apple Developer account:
   - Click **Connect Apple Developer Portal**
   - Sign in with your Apple ID
   - Codemagic will automatically fetch your certificates and profiles

### Option B: Manual Code Signing

If automatic doesn't work:

1. In Xcode, export your distribution certificate and provisioning profile
2. Upload them to Codemagic:
   - Go to **Settings** → **Code signing identities**
   - Upload your `.p12` certificate file
   - Upload your distribution provisioning profile
   - Enter the certificate password

## Step 3: Add App Store Connect Integration

1. In Codemagic, go to **Teams** → **Integrations**
2. Click **App Store Connect**
3. Click **Add integration**
4. Enter the details from Step 1:
   - **Issuer ID**: Your Issuer ID
   - **Key ID**: Your Key ID
   - **Private Key**: Paste the contents of your .p8 file
5. Click **Save**

## Step 4: Update codemagic.yaml Configuration

The `codemagic.yaml` file has been updated with the following changes:

### Required Updates:

1. **Update Bundle Identifier** (if different):
   ```yaml
   bundle_identifier: com.dogswab.app
   ```

2. **Update Team ID** in `exportOptions.plist`:
   - Find your Team ID in [Apple Developer Account](https://developer.apple.com/account)
   - Open `ios/App/exportOptions.plist`
   - Replace `YOUR_TEAM_ID` with your actual Team ID

3. **Update Email Notification**:
   ```yaml
   recipients:
     - your.email@example.com
   ```

### Key Features Added:

✅ **Proper code signing** - Removed `CODE_SIGNING_REQUIRED=NO`
✅ **IPA export** - Exports archive as IPA file
✅ **TestFlight publishing** - Automatically submits to TestFlight
✅ **Email notifications** - Get notified of build success/failure

## Step 5: Configure Environment Variables

In Codemagic UI:

1. Go to your app → **Settings** → **Environment variables**
2. Add these variables (if using API key authentication):
   - `APP_STORE_CONNECT_ISSUER_ID` - Your Issuer ID
   - `APP_STORE_CONNECT_KEY_IDENTIFIER` - Your Key ID
   - `APP_STORE_CONNECT_PRIVATE_KEY` - Your .p8 key contents (mark as secure!)

**Note**: If you set up the integration in Step 3, you can use `auth: integration` in the yaml (already configured).

## Step 6: Test Your Build

1. Push your code to trigger a build
2. Monitor the build in Codemagic dashboard
3. Check the build logs for:
   - ✅ Code signing successful
   - ✅ Archive created
   - ✅ IPA exported
   - ✅ Uploaded to App Store Connect

## Step 7: Verify in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to **My Apps** → **DOGSWAB**
3. Go to **TestFlight** tab
4. You should see your build processing
5. After processing (10-15 minutes), the build will be available for testing

## Troubleshooting

### Build Fails at Code Signing

**Problem**: "No signing certificate found" or "No provisioning profile found"

**Solution**:
1. Verify certificates are properly uploaded in Codemagic
2. Check that the bundle identifier matches exactly: `com.dogswab.app`
3. Ensure your provisioning profile includes your Team ID
4. Try automatic code signing instead of manual

### Build Succeeds but Doesn't Upload to TestFlight

**Problem**: Build completes but no upload happens

**Solution**:
1. Check that `submit_to_testflight: true` is in your yaml
2. Verify App Store Connect API integration is properly configured
3. Check build logs for upload errors
4. Ensure your API key has proper permissions (App Manager or Admin)

### "Missing Compliance" Error

**Problem**: Build uploaded but requires export compliance

**Solution**:
Add to your `Info.plist`:
```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

### "Invalid Provisioning Profile"

**Problem**: Provisioning profile doesn't match

**Solution**:
1. Regenerate your provisioning profile in Apple Developer Portal
2. Download and upload to Codemagic
3. Update `exportOptions.plist` with correct profile name

## Alternative: Using Codemagic UI Configuration

If you prefer not to use `codemagic.yaml`, you can configure everything in the Codemagic UI:

1. Go to **Workflow settings**
2. Enable **App Store Connect publishing**
3. Select your integration
4. Enable **Submit to TestFlight**
5. Add test groups (e.g., "Internal Testers")

## Build Artifacts

After successful build, you'll get:
- `App.ipa` - Ready for App Store
- `App.xcarchive` - Archive file
- Build logs

## Next Steps After Setup

1. **Create TestFlight Test Group**:
   - In App Store Connect → TestFlight
   - Create group: "Internal Testers"
   - Add testers' email addresses

2. **Automatic Builds**:
   - Every push to main branch triggers a build
   - Successful builds auto-upload to TestFlight
   - Testers get notified automatically

3. **Beta Testing**:
   - TestFlight app automatically downloads updates
   - Collect feedback from testers
   - Iterate based on feedback

## Best Practices

1. **Version Numbering**: Use semantic versioning (1.0.0, 1.0.1, etc.)
2. **Build Numbers**: Auto-increment on each build (already configured)
3. **Test Branches**: Consider separate workflow for development builds
4. **Release Notes**: Add what's new in each TestFlight build

## Support Links

- [Codemagic Documentation](https://docs.codemagic.io/)
- [iOS Code Signing Guide](https://docs.codemagic.io/yaml-code-signing/signing-ios/)
- [App Store Connect API](https://docs.codemagic.io/yaml-publishing/app-store-connect/)
- [Apple Developer Portal](https://developer.apple.com/)

## Quick Checklist

Before your next build:

- [ ] App Store Connect API key created and saved
- [ ] Codemagic integration configured with API key
- [ ] Code signing certificates uploaded to Codemagic
- [ ] Bundle identifier matches in all files
- [ ] Team ID updated in exportOptions.plist
- [ ] Email notification configured
- [ ] Test group created in App Store Connect
- [ ] Info.plist has export compliance key (if needed)

Once all checked, push your code and watch it automatically deploy to TestFlight!
