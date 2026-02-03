import os

target = "public/galgame_index.json"

with open(target, "rb") as f:
    raw = f.read(32)

print(f"Hex: {raw.hex()}")
