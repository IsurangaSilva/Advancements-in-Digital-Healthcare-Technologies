import os
import pygame
from PIL import Image, ImageDraw
import sys

def create_placeholder_images():
    """Create placeholder images for the chat and animation"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Create profile_pictures directory and placeholder user icon
    profile_dir = os.path.join(base_dir, "profile_pictures")
    os.makedirs(profile_dir, exist_ok=True)
    user_icon_path = os.path.join(profile_dir, "profile.jpg")
    
    if not os.path.exists(user_icon_path):
        # Create a blue circular user icon
        img = Image.new('RGB', (100, 100), color=(0, 100, 255))
        draw = ImageDraw.Draw(img)
        draw.ellipse([(5, 5), (95, 95)], fill=(0, 70, 200))
        img.save(user_icon_path)
        print(f"Created placeholder user icon at {user_icon_path}")
    
    # Create assets/images directory and placeholder AI icon
    assets_dir = os.path.join(base_dir, "assets", "images")
    os.makedirs(assets_dir, exist_ok=True)
    ai_icon_path = os.path.join(assets_dir, "chatbot.png")
    
    if not os.path.exists(ai_icon_path):
        # Create a green circular AI icon
        img = Image.new('RGB', (100, 100), color=(0, 200, 0))
        draw = ImageDraw.Draw(img)
        draw.ellipse([(5, 5), (95, 95)], fill=(0, 150, 0))
        img.save(ai_icon_path)
        print(f"Created placeholder AI icon at {ai_icon_path}")
    
    # Create animation images for the face
    animation_images = {
        "eyeeopen_mouthopen.png": (255, 200, 200),    # Red-ish
        "eyesopen_mouthclosed.png": (200, 255, 200),  # Green-ish
        "eyesclosed_mouthclosed.png": (200, 200, 255) # Blue-ish
    }
    
    for filename, color in animation_images.items():
        image_path = os.path.join(assets_dir, filename)
        if not os.path.exists(image_path):
            # Create a simple face image
            img = Image.new('RGB', (400, 450), color=color)
            draw = ImageDraw.Draw(img)
            
            # Draw face
            draw.ellipse([(100, 50), (300, 300)], fill=(255, 255, 200))
            
            # Draw eyes based on filename
            if "eyesclosed" in filename:
                # Closed eyes (just lines)
                draw.line([(150, 150), (180, 150)], fill=(0, 0, 0), width=3)
                draw.line([(220, 150), (250, 150)], fill=(0, 0, 0), width=3)
            else:
                # Open eyes (circles)
                draw.ellipse([(140, 140), (180, 160)], fill=(255, 255, 255), outline=(0, 0, 0), width=2)
                draw.ellipse([(220, 140), (260, 160)], fill=(255, 255, 255), outline=(0, 0, 0), width=2)
                draw.ellipse([(155, 145), (165, 155)], fill=(0, 0, 0))
                draw.ellipse([(235, 145), (245, 155)], fill=(0, 0, 0))
                
            # Draw mouth based on filename
            if "mouthopen" in filename:
                draw.ellipse([(170, 200), (230, 240)], fill=(150, 0, 0), outline=(0, 0, 0), width=2)
            else:
                draw.line([(170, 220), (230, 220)], fill=(0, 0, 0), width=3)
                
            img.save(image_path)
            print(f"Created placeholder animation image at {image_path}")
    
    print("All placeholder images created successfully")

if __name__ == "__main__":
    create_placeholder_images()
