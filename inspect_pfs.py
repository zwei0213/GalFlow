import struct
import os

def analyze_header(path):
    with open(path, 'rb') as f:
        # Read header
        sig = f.read(4)
        print(f"Signature: {sig}")
        
        # Read next few ints
        for i in range(5):
            val = f.read(4)
            if len(val) < 4: break
            int_val = struct.unpack('<I', val)[0]
            print(f"Int {i}: {int_val} ({hex(int_val)})")

        # Read some string data?
        f.seek(0)
        data = f.read(256)
        print(f"\nFirst 256 bytes:\n{data}")

path = r"C:\Users\12657\Downloads\アマカノ3\Amakano3.pfs"
if os.path.exists(path):
    analyze_header(path)
else:
    print("File not found")
