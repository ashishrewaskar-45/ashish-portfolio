import os
import shutil

dest_dir = r"C:\Users\ashish\.gemini\antigravity-ide\scratch\ashish-portfolio\assets\images"
os.makedirs(dest_dir, exist_ok=True)

files_to_copy = [
    (r"C:\Users\ashish\.gemini\antigravity-ide\brain\c57ae5c9-bc12-494b-ae65-997d83b325a0\.user_uploaded\media_1787767375355.jpg", os.path.join(dest_dir, "ashish_portrait.jpg")),
    (r"C:\Users\ashish\.gemini\antigravity-ide\brain\c57ae5c9-bc12-494b-ae65-997d83b325a0\.user_uploaded\media_1787767446216.png", os.path.join(dest_dir, "poster_restaurant_burger.png")),
    (r"C:\Users\ashish\.gemini\antigravity-ide\brain\c57ae5c9-bc12-494b-ae65-997d83b325a0\.user_uploaded\media_1787767446353.png", os.path.join(dest_dir, "poster_gourmet_bistro.png")),
    (r"C:\Users\ashish\.gemini\antigravity-ide\brain\c57ae5c9-bc12-494b-ae65-997d83b325a0\.user_uploaded\media_1787767446451.png", os.path.join(dest_dir, "banner_luxury_skincare.png")),
    (r"C:\Users\ashish\.gemini\antigravity-ide\brain\bb1f02b0-8b00-4df4-8025-af6eace124ae\portfolio_branding_1787764925389.jpg", os.path.join(dest_dir, "branding_aurelius.jpg")),
    (r"C:\Users\ashish\.gemini\antigravity-ide\brain\bb1f02b0-8b00-4df4-8025-af6eace124ae\portfolio_social_1787764947200.jpg", os.path.join(dest_dir, "social_arcana_tech.jpg")),
    (r"C:\Users\ashish\.gemini\antigravity-ide\brain\bb1f02b0-8b00-4df4-8025-af6eace124ae\portfolio_poster_1787764964543.jpg", os.path.join(dest_dir, "poster_neon_festival.jpg")),
    (r"C:\Users\ashish\.gemini\antigravity-ide\brain\bb1f02b0-8b00-4df4-8025-af6eace124ae\portfolio_banner_1787764983518.jpg", os.path.join(dest_dir, "banner_aether_audio.jpg")),
    (r"C:\Users\ashish\.gemini\antigravity-ide\brain\bb1f02b0-8b00-4df4-8025-af6eace124ae\portfolio_presentation_1787765010647.jpg", os.path.join(dest_dir, "presentation_innovatech.jpg")),
]

for src, dst in files_to_copy:
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied: {src} -> {dst}")
    else:
        print(f"File not found: {src}")

print("\nAssets directory contents:")
for f in os.listdir(dest_dir):
    size = os.path.getsize(os.path.join(dest_dir, f))
    print(f" - {f} ({size} bytes)")
