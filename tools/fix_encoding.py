import json
import os

target = "public/galgame_index.json"

if not os.path.exists(target):
    print("File not found")
    exit()

with open(target, "rb") as f:
    raw = f.read()

# Try detecting encoding
try:
    # Attempt Shift JIS
    content = raw.decode("shift_jis")
    print("Detected Shift-JIS. Converting to UTF-8...")
    
    # Verify by printing a sample (Shift JIS 'kanji' should look like kanji)
    if "「" in content or "あ" in content:
        print("Sample check passed.")
        with open(target, "w", encoding="utf-8") as f:
            f.write(content)
        print("Converted successfully.")
    else:
        # Maybe it was already UTF-8?
        try:
             utftest = raw.decode("utf-8")
             print("File appears to be valid UTF-8 already.")
        except:
             print("Unknown encoding.")

except UnicodeDecodeError:
    print("Not Shift-JIS.")
    try:
        utftest = raw.decode("utf-8")
        print("File is valid UTF-8.")
    except UnicodeDecodeError:
        print("File is neither Shift-JIS nor UTF-8.")
