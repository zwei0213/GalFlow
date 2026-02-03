import os

target = r"D:\jj\script\0_kyo_01.ast"

with open(target, "rb") as f:
    # Read a chunk from the middle where text usually is
    f.seek(1000) 
    raw = f.read(200)

print(f"Hex: {raw.hex()}")
