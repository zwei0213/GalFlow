import struct
import os
import re

def extract_strings(path):
    with open(path, 'rb') as f:
        content = f.read()
    
    # Try to find common encoding (Shift-JIS is common for JP games)
    try:
        # Simple extraction of anything that looks like a string
        # This is a heuristic.
        text_content = content.decode('shift_jis', errors='ignore')
        
        # Look for potential voice file patterns (e.g., characters followed by numbers, or standard Artemis patterns)
        # Artemis often uses commands. 
        # Let's just print a chunk to see the structure.
        print(f"--- File: {os.path.basename(path)} ---")
        print(f"Hex signature: {content[:4].hex()}")
        
        # Print first 20 lines of "strings" found 
        lines = [line for line in text_content.split('\x00') if len(line) > 3]
        for line in lines[:20]:
            print(f"String: {line}")
            
    except Exception as e:
        print(f"Error: {e}")

path = r"D:\jj\script\0_kyo_01.ast"
if os.path.exists(path):
    extract_strings(path)
else:
    print("File not found")
