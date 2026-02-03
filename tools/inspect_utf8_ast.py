import os
import re
import json

path = r"D:\jj\script\0_kyo_01.ast"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"--- {os.path.basename(path)} ---")
# Find VO and following text
# Look for {"vo" ...} which might be on one line, and then the text on the next lines.
# Text in Lua is usually double quoted string.

# Matches {"vo",file="xxx"}
vos = list(re.finditer(r'\{"vo",file="([^"]+)"', content))
print(f"Found {len(vos)} VO lines.")

# Let's peek at the context of the first 5 matches
for match in vos[:5]:
    start = match.start()
    # print context
    context = content[start:start+200]
    print(f"\nContext: {context}")
