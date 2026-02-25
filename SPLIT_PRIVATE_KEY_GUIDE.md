# How to Split Your App Store Connect Private Key for Codemagic

Codemagic has issues with long multi-line environment variables. This guide will help you split your private key into 6 parts.

## Step 1: Get Your Private Key Content

1. Open your `.p8` file in a text editor
2. Copy the ENTIRE contents (including the BEGIN and END lines)

Your key should look like this:
```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
[multiple lines of base64 text]
...more base64 text here
-----END PRIVATE KEY-----
```

## Step 2: Split the Key into 6 Equal Parts

You need to divide the entire key (including newlines) into 6 roughly equal parts.

### Example Splitting Method:

If your key has 30 lines total, split it like this:
- **PART 1**: Lines 1-5 (includes `-----BEGIN PRIVATE KEY-----` and some content)
- **PART 2**: Lines 6-10
- **PART 3**: Lines 11-15
- **PART 4**: Lines 16-20
- **PART 5**: Lines 21-25
- **PART 6**: Lines 26-30 (includes remaining content and `-----END PRIVATE KEY-----`)

### Important Notes:
- Keep ALL line breaks exactly as they are
- Each part should be continuous text with line breaks
- The first part MUST start with `-----BEGIN PRIVATE KEY-----`
- The last part MUST end with `-----END PRIVATE KEY-----`

## Step 3: Add to Codemagic Environment Variables

1. Go to your Codemagic project
2. Navigate to **Settings** → **Environment variables**
3. Create 6 new environment variables:

   - `APP_STORE_CONNECT_PRIVATE_KEY_PART1` → Paste PART 1
   - `APP_STORE_CONNECT_PRIVATE_KEY_PART2` → Paste PART 2
   - `APP_STORE_CONNECT_PRIVATE_KEY_PART3` → Paste PART 3
   - `APP_STORE_CONNECT_PRIVATE_KEY_PART4` → Paste PART 4
   - `APP_STORE_CONNECT_PRIVATE_KEY_PART5` → Paste PART 5
   - `APP_STORE_CONNECT_PRIVATE_KEY_PART6` → Paste PART 6

4. Make sure ALL variables are:
   - ✅ Marked as **Secure** (hidden)
   - ✅ Available to **all branches** or your specific branch

## Step 4: Remove Old Variable

Delete the old `APP_STORE_CONNECT_PRIVATE_KEY` environment variable (the one that wasn't working).

## Step 5: Test

Trigger a new build. The `codemagic.yaml` will automatically concatenate all 6 parts back together before publishing to App Store Connect.

## Troubleshooting

If the build still fails:

1. **Check line breaks**: Make sure you copied the exact line breaks from the original `.p8` file
2. **Check completeness**: Verify the concatenated parts form a complete key:
   - Starts with `-----BEGIN PRIVATE KEY-----`
   - Ends with `-----END PRIVATE KEY-----`
   - No missing characters between parts
3. **Try fewer/more parts**: If 6 parts don't work, try splitting into 4 or 8 parts
4. **Verify key validity**: Test your `.p8` file locally first using the App Store Connect API

## Example Tool to Split (Optional)

You can use this simple Python script to split your key:

```python
# Read your .p8 file
with open('AuthKey_YOUR_KEY_ID.p8', 'r') as f:
    content = f.read()

# Split into 6 parts
total_length = len(content)
part_size = total_length // 6

parts = []
for i in range(6):
    if i == 5:  # Last part gets remainder
        parts.append(content[i * part_size:])
    else:
        parts.append(content[i * part_size:(i + 1) * part_size])

# Print parts
for i, part in enumerate(parts, 1):
    print(f"\n=== PART {i} ===")
    print(part)
    print(f"=== END PART {i} ===\n")
```

Save as `split_key.py` and run: `python split_key.py`
