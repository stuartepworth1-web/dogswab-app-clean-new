# Enable Automatic TestFlight Upload - Quick Guide

## Current Status
✅ Your `codemagic.yaml` is now valid and will build successfully
⚠️ TestFlight upload is currently **disabled** (commented out)

## Why TestFlight Upload Was Disabled
The publishing section requires setup in Codemagic first. Once you complete the setup below, you can enable it.

## Step-by-Step Setup (5 minutes)

### Step 1: Create App Store Connect API Key

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **Users and Access** in the top navigation
3. Click **Integrations** tab, then **App Store Connect API** subtab
4. Click the **+** button to generate a new key
5. Fill in:
   - **Name**: "Codemagic API Key"
   - **Access**: Select **App Manager**
6. Click **Generate**
7. **IMPORTANT**: Click **Download API Key** - you can only do this once!
8. Save these three values:
   - **Issuer ID** (shown at the top of the page)
   - **Key ID** (in the key row)
   - **Downloaded .p8 file** (keep it safe!)

### Step 2: Add Integration in Codemagic

1. Log in to [Codemagic](https://codemagic.io)
2. Click your team name (top left)
3. Click **Integrations**
4. Find **App Store Connect** and click **Connect**
5. Enter the three values from Step 1:
   - Paste **Issuer ID**
   - Paste **Key ID**
   - Open the `.p8` file in a text editor, copy everything, and paste the **Private Key**
6. Click **Save**

### Step 3: Enable Code Signing

1. In Codemagic, go to your **DOGSWAB app**
2. Click **Settings** → **Code signing identities**
3. Under **iOS code signing**, click **Add certificate**
4. Choose one option:

   **Option A: Automatic (Easiest)**
   - Click **Automatic code signing**
   - Click **Connect to Apple Developer Portal**
   - Log in with your Apple ID
   - Codemagic will fetch everything automatically ✨

   **Option B: Manual**
   - Export your distribution certificate from Xcode
   - Upload the `.p12` file and enter password
   - Upload your distribution provisioning profile

### Step 4: Enable TestFlight Publishing

1. Open `codemagic.yaml` in your code editor
2. Find the commented-out `publishing:` section (around line 136)
3. **Uncomment these lines** (remove the `#` symbols):

```yaml
    publishing:
      email:
        recipients:
          - your.email@example.com  # ← Change this to your email
        notify:
          success: true
          failure: true
      app_store_connect:
        auth: integration
        submit_to_testflight: true
        beta_groups:
          - Internal Testers
        submit_to_app_store: false
```

4. Replace `your.email@example.com` with your actual email
5. Save and commit the file

### Step 5: Update exportOptions.plist

1. Open `ios/App/exportOptions.plist`
2. Find this line: `<string>YOUR_TEAM_ID</string>`
3. Replace `YOUR_TEAM_ID` with your Apple Team ID:
   - Find your Team ID at [Apple Developer](https://developer.apple.com/account)
   - Or in Xcode: Preferences → Accounts → Select your team → View Details
4. Save the file

### Step 6: Create Test Group in App Store Connect (Optional)

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your **DOGSWAB** app
3. Click **TestFlight** tab
4. Under **Internal Testing**, click the **+** to create a group
5. Name it: **Internal Testers**
6. Add testers by email

### Step 7: Test It!

1. Commit and push your changes
2. Codemagic will automatically start building
3. Watch the build progress in Codemagic dashboard
4. After 20-30 minutes total:
   - Build completes (~10-15 min)
   - Upload to TestFlight (~5 min)
   - App Store processing (~10-15 min)
5. Check TestFlight - your build should appear!

## What Happens Now

Every time you push to your repository:
1. ✅ Codemagic builds your app
2. ✅ Code signs with your certificate
3. ✅ Creates an IPA file
4. ✅ Uploads to App Store Connect
5. ✅ Submits to TestFlight
6. ✅ Notifies your test group
7. ✅ Emails you the result

## Troubleshooting

### "No signing certificate found"
- Make sure you completed Step 3 (code signing)
- Verify your bundle ID matches: `com.dogswab.app`

### "Authentication failed"
- Double-check your API key in Codemagic Integrations
- Ensure the key has "App Manager" access
- Try regenerating the API key

### Build succeeds but no upload
- Verify the `publishing` section is uncommented
- Check your API key has proper permissions
- Look for errors in the Codemagic build logs

### "Invalid provisioning profile"
- Your profile might be expired - regenerate it
- Ensure it matches your bundle ID
- Try automatic code signing instead

## Quick Checklist

Before pushing:
- [ ] App Store Connect API key created
- [ ] API key added to Codemagic Integrations
- [ ] Code signing configured in Codemagic
- [ ] `publishing:` section uncommented in codemagic.yaml
- [ ] Email address updated in codemagic.yaml
- [ ] Team ID updated in exportOptions.plist
- [ ] Test group created in App Store Connect (optional)

## Alternative: Upload IPA Manually

If you want to test before enabling automatic upload:

1. Let Codemagic build (will create IPA)
2. Download the IPA from **Artifacts**
3. Use **Transporter** app to upload to App Store Connect manually
4. Once confirmed working, enable automatic upload

## Need Help?

- [Codemagic Docs](https://docs.codemagic.io/yaml-publishing/app-store-connect/)
- [Apple Developer Support](https://developer.apple.com/support/)
- Check Codemagic build logs for specific errors

---

Once setup is complete, you'll have fully automated TestFlight deployments! 🚀
