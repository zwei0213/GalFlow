import os
import re
import json
import glob

SCRIPT_DIR = r"D:\jj\script"
OUTPUT_JSON = r"D:\jj\public\galgame_index.json"

def parse_ast_files():
    results = []
    
    files = glob.glob(os.path.join(SCRIPT_DIR, "*.ast"))
    print(f"Found {len(files)} script files.")
    
    for file_path in files:
        file_name = os.path.basename(file_path)
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Failed to read {file_name}: {e}")
            continue

        # Split content into blocks or chunks? 
        # The structure is somewhat recursive, but we can look for 'vo' anchors.
        
        # Regex to find VO and then capture the following ja block
        # We assume the ja block follows the vo block relatively closely.
        # But wait, looking at the dump:
        # {"vo"...},
        # },
        # ja={ ... }
        
        # so VO is inside text={ vo={...} } or similar?
        # Actually it looks like:
        # text={
        #   vo={ {"vo",file="X"} },
        #   ja={ "Text", ... }
        # }
        
        # Let's try to match the sequence:
        # 1. file="AUDIO_ID"
        # 2. Search forward for ja={
        # 3. Capture content of ja={ ... }
        
        # We use a scanner approach
        
        # Find all occurrences of vo file definition
        # Returns iterator of match objects
        vo_matches = list(re.finditer(r'\{"vo",file="([^"]+)"', content))
        
        for i, match in enumerate(vo_matches):
            audio_id = match.group(1)
            start_idx = match.end()
            
            # Look for "ja={" after this point
            # We want the NEAREST one.
            # But we must ensure we don't cross into another VO block?
            # Usually one VO per block.
            
            # Limit search to next 1000 chars to be safe
            search_window = content[start_idx : start_idx + 2000]
            
            ja_match = re.search(r'ja=\{', search_window)
            if not ja_match:
                # Maybe no text for this voice?
                continue
            
            ja_start = ja_match.end()
            
            # Now extract everything until the matching closing brace of ja={...}
            # Since braces nest, simple regex is risky. But `ja` content seems simple: strings and rt2 tags.
            # Let's just consume until `},` which closes the ja block? or `}` followed by `,` or `}` line end.
            
            # Look for the closing of `ja={`
            # It usually ends with `},` and then `linkback` or something exists in the outer block.
            # Or we can just grab lines until we hit a line starting with `},` with correct indentation?
            # Lua table syntax...
            
            # Let's try simple brace counting on the substring
            ja_content = ""
            brace_count = 1
            local_idx = 0
            
            full_window = search_window[ja_start:]
            
            for char in full_window:
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                
                if brace_count == 0:
                    break
                ja_content += char
            
            # Now we have the content inside ja={ ... }
            # Example:
            # {
            # name={"女子学生Ａ","アコ"},
            # "「おおお、助かったぁ！！」",
            # {"rt2"},
            # },
            
            # We want to extract the double-quoted strings that look like dialogue.
            # Avoid `name={"..."}`.
            
            # Remove `name={...}` first to avoid confusion
            ja_clean = re.sub(r'name=\{[^}]+\},', '', ja_content)
            
            # Extract all strings
            # Look for "..."
            # Be careful of escaped quotes but assuming simple here
            strings = re.findall(r'"([^"]+)"', ja_clean)
            
            # Filter out non-dialogue strings if any?
            # Usually just dialogue strings and maybe some commands if they are quoted.
            # But in the dump, {"rt2"} is not a string "rt2", it's a token? 
            # Wait, `{"rt2"}`: rt2 is unquoted identifier in Lua table if it's a value?
            # Inspect: `{"rt2"}` -> `rt2` is likely a variable/string.
            # Inspect: `file="man_tuc..."` -> keys are strings.
            
            # In `ja={ ... "text" ... }`:
            # text is distinct.
            
            # Let's filter strings:
            # - Ignore english-only strings? (Might be commands?)
            # - Dialogue usually has Japanese.
            # - Or ignore known keywords.
            
            dialogue_parts = []
            for s in strings:
                if s in ["rt2", "no", "a", "wait"]: continue
                # Basic check: contains Japnese or length > 1?
                dialogue_parts.append(s)
                
            full_text = "".join(dialogue_parts)
            
            if full_text:
                results.append({
                    "text": full_text,
                    "audio": audio_id,
                    "source": file_name
                })
                
    print(f"Extracted {len(results)} total lines.")
    
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
        
    print("Saved to JSON.")

if __name__ == "__main__":
    parse_ast_files()
