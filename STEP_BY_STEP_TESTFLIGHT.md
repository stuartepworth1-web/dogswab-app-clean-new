# Step-by-Step: Enable TestFlight Automatic Upload

## Current Status
✅ **Your builds will now succeed!** The app builds without code signing.
⏭️ **Next step:** Set up code signing to enable TestFlight uploads.

---

## Why This Works Now

Your `codemagic.yaml` is configured to:
- ✅ Build your iOS app successfully
- ✅ Create an `.xcarchive` file
- ❌ Skip code signing (temporary)
- ❌ Skip TestFlight upload (until you're ready)

---

## 3-Step Process to Enable TestFlight

### STEP 1: Set Up Code Signing in Codemagic

Choose **Option A** (easiest) or **Option B**:

#### Option A: Automatic Code Signing (Recommended - 2 minutes)

1. Go to [Codemagic](https://codemagic.io) and open your **DOGSWAB** app
2. Click **Settings** (left sidebar)
3. Click **Code signing identities**
4. Under **iOS**, click **Add certificate**
5. Select **Automatic code signing**
6. Click **Connect to Apple Developer Portal**
7. Sign in with your Apple Developer account
8. ✅ Done! Codemagic will automatically manage everything

#### Option B: Manual Code Signing (If automatic fails)

1. **In Xcode** on your Mac:
   - Open `ios/App/App.xcworkspace`
   - Select the App target
   - Go to Signing & Capabilities
   - Click "Download Manual Profiles"
   - Export certificate: Xcode → Preferences → Accounts → Manage Certificates → Right-click → Export

2. **In Codemagic**:
   - Settings → Code signing identities
   - Upload your `.p12` certificate
   - Enter certificate password
   - Upload your provisioning profile

3. **Update codemagic.yaml**:
   - Uncomment the `ios_signing:` section (lines 8-10)
   - Save and commit

---

### STEP 2: Create App Store Connect API Key

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **Users and Access** (top navigation)
3. Click **Integrations** tab
4. Click **App Store Connect API** subtab
5. Click **+** to generate a key
6. Fill in:
   - **Name**: Codemagic API
   - **Access**: App Manager
7. Click **Generate**
8. **CRITICAL**: Click **Download API Key** NOW (you can only do this once!)
9. Save these three values somewhere safe:
   - **Issuer ID** (at top of page)
   - **Key ID** (in the key row)
   - **Downloaded .p8 file**

---

### STEP 3: Connect App Store to Codemagic

1. In Codemagic, click your **team name** (top left)
2. Click **Integrations**
3. Find **App Store Connect** and click **Connect**
4. Enter the three values from Step 2:
   - Paste **Issuer ID**
   - Paste **Key ID**
   - Open the `.p8` file in text editor, copy ALL contents, paste as **Private Key**
5. Click **Save**
6. ✅ Integration complete!

---

## After Setup: Enable in YAML

Once Steps 1-3 are complete, update your `codemagic.yaml`:

### Edit 1: Uncomment ios_signing (lines 7-10)
```yaml
environment:
  ios_signing:
    distribution_type: app_store
    bundle_identifier: com.dogswab.app
  node: 20.9.0
```

### Edit 2: Uncomment Export IPA step (lines 129-137)
```yaml
- name: Export IPA for App Store
  script: |
    cd ios/App
    echo "📦 EXPORTING IPA FOR APP STORE..."
    xcodebuild -exportArchive \
      -archivePath build/App.xcarchive \
      -exportPath build/ipa \
      -exportOptionsPlist exportOptions.plist
```

### Edit 3: Update Build command (remove CODE_SIGN lines 126-128)
```yaml
- name: Build iOS app
  script: |
    cd ios/App
    echo "🏗️ BUILDING AND CODE SIGNING FOR APP STORE..."
    xcodebuild -workspace App.xcworkspace \
      -scheme App \
      -configuration Release \
      -destination generic/platform=iOS \
      -archivePath build/App.xcarchive \
      archive
```

### Edit 4: Uncomment publishing section (lines 142-155)
```yaml
publishing:
  email:
    recipients:
      - your.email@example.com  # ← Change this!
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

### Edit 5: Update artifacts (line 141)
```yaml
artifacts:
  - ios/App/build/ipa/*.ipa
  - ios/App/build/App.xcarchive
  - ios/App/build/logs/*.log
```

### Edit 6: Update exportOptions.plist
Open `ios/App/exportOptions.plist` and replace:
- `YOUR_TEAM_ID` with your actual Apple Team ID
  - Find it at [developer.apple.com/account](https://developer.apple.com/account)

---

## Test It!

1. Commit and push your updated `codemagic.yaml`
2. Codemagic will build automatically
3. Check the build logs:
   - ✅ Code signing successful
   - ✅ IPA exported
   - ✅ Uploaded to App Store Connect
4. After 10-15 minutes, check TestFlight in App Store Connect
5. Your build should appear! 🎉

---

## Quick Verification Checklist

Before pushing, verify:

- [ ] Code signing set up in Codemagic (Step 1)
- [ ] App Store Connect API key created (Step 2)
- [ ] API key added to Codemagic integrations (Step 3)
- [ ] Uncommented `ios_signing` in yaml
- [ ] Uncommented export IPA step
- [ ] Removed `CODE_SIGN_IDENTITY=""` lines
- [ ] Uncommented `publishing` section
- [ ] Updated email in publishing section
- [ ] Updated Team ID in exportOptions.plist
- [ ] Committed and pushed to trigger build

---

## Troubleshooting

### "No provisioning profile found"
- Retry automatic code signing in Codemagic
- Make sure your Apple Developer account is active
- Check that bundle ID matches: `com.dogswab.app`

### "Authentication failed"
- Verify API key integration in Codemagic
- Make sure API key has "App Manager" access
- Try regenerating the API key

### Build succeeds but no TestFlight upload
- Check that `auth: integration` is set
- Verify `submit_to_testflight: true`
- Look for errors in "Publishing" section of build logs

### "Missing Compliance"
- Add to `Info.plist`: `<key>ITSAppUsesNonExemptEncryption</key><false/>`

---

## Alternative: Use Codemagic UI Instead of YAML

If you prefer clicking over editing YAML:

1. In Codemagic, go to your app
2. Click **Start new build**
3. Click **Workflow Editor**
4. Enable **Distribution** → **App Store Connect**
5. Select your integration
6. Enable **Submit to TestFlight**
7. Save workflow

This achieves the same result without YAML editing!

---

## What You Get After Setup

Every push automatically:
1. ✅ Builds your iOS app
2. ✅ Code signs with your certificate
3. ✅ Creates distributable IPA
4. ✅ Uploads to App Store Connect
5. ✅ Submits to TestFlight
6. ✅ Notifies your test team
7. ✅ Emails you the status

---

## For Right Now

**Your current config will build successfully** - just without TestFlight upload. This lets you:
- ✅ Verify your app builds on Codemagic
- ✅ Check for any build errors
- ✅ Download the .xcarchive if needed
- ✅ Set up code signing at your own pace

When you're ready for TestFlight, just follow the 3 steps above!

---

## Need Help?

- [Codemagic iOS Signing Docs](https://docs.codemagic.io/yaml-code-signing/signing-ios/)
- [App Store Connect API Setup](https://docs.codemagic.io/yaml-publishing/app-store-connect/)
- Check your Codemagic build logs for specific errors
