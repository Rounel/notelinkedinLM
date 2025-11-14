#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script simple pour créer des icônes basiques sans emojis
"""

try:
    from PIL import Image, ImageDraw, ImageFont

    def create_icon(size, output_path):
        # Couleur LinkedIn
        bg_color = (10, 102, 194)
        text_color = (255, 255, 255)

        # Créer l'image
        img = Image.new('RGB', (size, size), color=bg_color)
        draw = ImageDraw.Draw(img)

        # Dessiner un graphique simple (barres)
        if size >= 48:
            bar_width = size // 8
            bar_spacing = size // 12
            start_x = size // 4

            # 3 barres de hauteurs différentes
            heights = [size // 2, size // 1.5, size // 2.5]
            for i, height in enumerate(heights):
                x = start_x + i * (bar_width + bar_spacing)
                y = size - size // 6
                draw.rectangle(
                    [x, y - height, x + bar_width, y],
                    fill=text_color
                )
        else:
            # Pour petites icônes, juste un rectangle
            padding = size // 4
            draw.rectangle(
                [padding, padding, size - padding, size - padding],
                fill=text_color
            )

        # Sauvegarder
        img.save(output_path, 'PNG')
        print(f"Icon created: {output_path}")

    print("Generating icons for LinkedIn Analytics extension...")
    print()

    sizes = [16, 48, 128]
    for size in sizes:
        output_path = f"icons/icon{size}.png"
        create_icon(size, output_path)

    print()
    print("All icons generated successfully!")
    print("You can now load the extension in Chrome:")
    print("1. Go to chrome://extensions/")
    print("2. Enable Developer mode")
    print("3. Click 'Load unpacked'")
    print("4. Select this folder")

except ImportError:
    print("ERROR: Pillow is not installed.")
    print("Please install it with: pip install pillow")
    print()
    print("Alternative: Create PNG images manually:")
    print("- icon16.png (16x16 pixels)")
    print("- icon48.png (48x48 pixels)")
    print("- icon128.png (128x128 pixels)")
    print("Use blue background (#0a66c2) and white graphics")
