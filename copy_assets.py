import os
import shutil

src_dir = r"C:\Users\ashish\.gemini\antigravity-ide\brain\bb1f02b0-8b00-4df4-8025-af6eace124ae"
dest_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "images")

os.makedirs(dest_dir, exist_ok=True)

# Copy main folder images
if os.path.exists(src_dir):
    for f in os.listdir(src_dir):
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.svg')):
            src_file = os.path.join(src_dir, f)
            dest_file = os.path.join(dest_dir, f)
            shutil.copy2(src_file, dest_file)
            print(f"Copied {f}")

# Copy user uploaded images
user_dir = os.path.join(src_dir, ".user_uploaded")
if os.path.exists(user_dir):
    for f in os.listdir(user_dir):
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.svg')):
            src_file = os.path.join(user_dir, f)
            dest_file = os.path.join(dest_dir, f)
            shutil.copy2(src_file, dest_file)
            print(f"Copied {f}")

# Create convenient aliases
ashish_photo = os.path.join(user_dir, "media_1787765083046.jpg")
if os.path.exists(ashish_photo):
    shutil.copy2(ashish_photo, os.path.join(dest_dir, "ashish_portrait.jpg"))
    print("Created ashish_portrait.jpg alias")

print("All assets successfully copied to assets/images/")
