import shutil
import os
import sys

source_dir = "/Users/yasin.celenk/.gemini/antigravity/brain/dcc0bed5-6d99-44ca-a885-c39bdcf289d7"
dest_dir = "/Users/yasin.celenk/userex-ai/public"

mapping = {
    "uploaded_image_0_1766495277190.png": "vion-logo-text-light.png",
    "uploaded_image_1_1766495277190.png": "vion-logo-icon-light.png",
    "uploaded_image_2_1766495277190.png": "vion-logo-icon-dark.png",
    "uploaded_image_3_1766495277190.png": "vion-logo-full-dark.png",
    "uploaded_image_2_1766495277190.png": "favicon.ico"
}

print(f"Source: {source_dir}")
print(f"Dest: {dest_dir}")

for src_name, dest_name in mapping.items():
    src_path = os.path.join(source_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    
    try:
        if os.path.exists(src_path):
            shutil.copy2(src_path, dest_path)
            print(f"SUCCESS: Copied {src_name} -> {dest_name}")
            print(f"Size: {os.path.getsize(dest_path)} bytes")
        else:
            print(f"ERROR: Source file not found: {src_path}")
    except Exception as e:
        print(f"ERROR: Failed to copy {src_name} -> {dest_name}: {e}")

try:
    print("\nListing public directory content:")
    for f in os.listdir(dest_dir):
        if "vion" in f or "favicon" in f:
            print(f"{f} - {os.path.getsize(os.path.join(dest_dir, f))} bytes")
except Exception as e:
    print(f"Error listing dir: {e}")
