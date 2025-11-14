#!/usr/bin/env python3
"""
Script pour générer des icônes simples pour l'extension Chrome
Nécessite: pip install pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("❌ Pillow n'est pas installé.")
    print("📦 Installez-le avec: pip install pillow")
    exit(1)

def create_icon(size, output_path):
    """Crée une icône avec un fond bleu et le texte 'LA'"""
    # Couleur LinkedIn
    bg_color = (10, 102, 194)  # #0a66c2
    text_color = (255, 255, 255)  # Blanc

    # Créer l'image
    img = Image.new('RGB', (size, size), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Texte
    text = "📊"

    # Calculer la taille de police
    font_size = size // 2

    try:
        # Essayer d'utiliser une police système
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        # Utiliser la police par défaut
        font = ImageFont.load_default()
        text = "LA"  # Utiliser du texte si l'emoji ne fonctionne pas

    # Centrer le texte
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    position = ((size - text_width) // 2, (size - text_height) // 2 - size // 10)

    # Dessiner le texte
    draw.text(position, text, fill=text_color, font=font)

    # Sauvegarder
    img.save(output_path, 'PNG')
    print(f"✓ Icône créée: {output_path}")

def main():
    """Génère les trois icônes nécessaires"""
    print("🎨 Génération des icônes pour l'extension LinkedIn Analytics...")
    print()

    sizes = [16, 48, 128]

    for size in sizes:
        output_path = f"icons/icon{size}.png"
        create_icon(size, output_path)

    print()
    print("✅ Toutes les icônes ont été générées avec succès!")
    print("📁 Vérifiez le dossier 'icons/'")
    print()
    print("💡 Vous pouvez maintenant charger l'extension dans Chrome:")
    print("   1. Allez sur chrome://extensions/")
    print("   2. Activez le 'Mode développeur'")
    print("   3. Cliquez sur 'Charger l'extension non empaquetée'")
    print("   4. Sélectionnez ce dossier")

if __name__ == "__main__":
    main()
