# 📊 LinkedIn Post Analytics - Extension Chrome

Une extension Chrome puissante pour scraper et analyser les posts LinkedIn d'un profil, générer des statistiques détaillées et créer un rapport PDF complet avec analytics.

## ✨ Fonctionnalités

- 🔍 **Scraping automatique** : Récupère tous les posts d'un profil LinkedIn
- 📈 **Analytics avancés** : Analyse les réactions, commentaires, republications
- 📊 **Graphiques de performance** : Visualisation de l'engagement par jour, semaine, mois
- 🎯 **Identification des périodes performantes** : Détecte automatiquement quand les posts ont le plus d'impact
- 📄 **Export PDF** : Génère un rapport PDF complet téléchargeable
- ⚡ **Interface intuitive** : Bouton intégré directement sur les profils LinkedIn

## 🚀 Installation

### Prérequis
- Google Chrome ou tout navigateur basé sur Chromium (Edge, Brave, etc.)
- Un compte LinkedIn

### Étapes d'installation

1. **Télécharger l'extension**
   ```bash
   # Si vous clonez depuis un repo
   git clone [url-du-repo]
   cd linkedin-post-scraper-extension
   ```

2. **Créer les icônes** (si pas encore présentes)
   - Voir le fichier `icons/README.md` pour les instructions
   - Vous avez besoin de 3 fichiers : `icon16.png`, `icon48.png`, `icon128.png`
   - Option rapide : utilisez un générateur d'icônes en ligne

3. **Charger l'extension dans Chrome**
   - Ouvrez Chrome et allez sur `chrome://extensions/`
   - Activez le **Mode développeur** (coin supérieur droit)
   - Cliquez sur **Charger l'extension non empaquetée**
   - Sélectionnez le dossier `linkedin-post-scraper-extension`
   - L'extension est maintenant installée !

## 📖 Utilisation

### Étape 1 : Visiter un profil LinkedIn
Naviguez vers n'importe quel profil LinkedIn (par exemple : `https://www.linkedin.com/in/nom-utilisateur/`)

### Étape 2 : Cliquer sur le bouton
Un bouton **"Générer PDF Analytics"** apparaît automatiquement à côté du nom du profil.

### Étape 3 : Lancer le scraping
Cliquez sur le bouton et attendez :
- L'extension va automatiquement :
  - Scroller sur la page des posts
  - Récupérer tous les posts visibles
  - Extraire les statistiques (réactions, commentaires, republications)
  - Analyser les données

### Étape 4 : Télécharger le PDF
Une fois terminé, le PDF se télécharge automatiquement avec :
- Informations du profil
- Statistiques globales
- Engagement par jour de la semaine
- Périodes de haute performance
- Top 10 des meilleurs posts
- Liste complète de tous les posts

## 📊 Contenu du rapport PDF

Le PDF généré contient :

### 1. Vue d'ensemble
- Nom et titre du profil
- Date de génération du rapport
- URL du profil

### 2. Statistiques globales
- Nombre total de posts
- Total des réactions, commentaires, republications
- Engagement moyen par post
- Impact des médias (posts avec/sans images)

### 3. Analyse temporelle
- **Engagement par jour de la semaine** : Identifie les meilleurs jours pour poster
- **Engagement par mois** : Tendances sur la période

### 4. Périodes performantes
- Détection automatique des périodes où l'engagement était élevé
- Analyse des facteurs de succès

### 5. Top posts
- Les 10 posts avec le plus d'engagement
- Détails complets (date, statistiques, contenu)

### 6. Liste complète
- Tous les posts scrapés avec leurs métriques

## 🔧 Structure du projet

```
linkedin-post-scraper-extension/
├── manifest.json          # Configuration de l'extension
├── content.js             # Script injecté dans LinkedIn (scraping)
├── background.js          # Service worker (génération PDF)
├── styles.css             # Styles du bouton
├── popup.html             # Interface popup de l'extension
├── popup.js               # Script du popup
├── libs/
│   └── jspdf.min.js       # Bibliothèque jsPDF
├── icons/
│   ├── icon16.png         # Icône 16x16
│   ├── icon48.png         # Icône 48x48
│   ├── icon128.png        # Icône 128x128
│   └── README.md          # Instructions pour les icônes
└── README.md              # Ce fichier
```

## ⚙️ Configuration avancée

### Modifier les seuils de performance
Dans `background.js`, ligne ~181 :
```javascript
const threshold = avgEngagement * 1.5; // 50% au-dessus de la moyenne
```

### Ajuster le délai de scroll
Dans `content.js`, ligne ~134 :
```javascript
await wait(1500); // Délai en millisecondes
```

### Limiter le nombre de posts
Dans `content.js`, ajoutez une condition dans la boucle de scraping :
```javascript
if (posts.length >= 100) break; // Limite à 100 posts
```

## 🐛 Résolution de problèmes

### Le bouton n'apparaît pas
- Vérifiez que vous êtes bien sur un profil LinkedIn (`/in/...`)
- Rechargez la page (F5)
- Vérifiez que l'extension est activée dans `chrome://extensions/`

### Le scraping est incomplet
- LinkedIn limite parfois le nombre de posts affichés
- Scrollez manuellement plus bas avant de cliquer sur le bouton
- L'extension utilise un scroll automatique, soyez patient

### Le PDF ne se télécharge pas
- Vérifiez les permissions de téléchargement de Chrome
- Assurez-vous que les popups ne sont pas bloqués

### Erreur "jsPDF is not defined"
- Vérifiez que le fichier `libs/jspdf.min.js` est présent
- Rechargez l'extension dans `chrome://extensions/`

## ⚠️ Avertissements

- **Respect des conditions d'utilisation** : Cette extension est fournie à des fins éducatives. Assurez-vous de respecter les conditions d'utilisation de LinkedIn.
- **Limite de taux** : Un scraping intensif peut temporairement limiter votre accès. Utilisez avec modération.
- **Données privées** : Les posts scrapés peuvent contenir des informations sensibles. Utilisez les données de manière responsable.
- **Performance** : Le scraping de profils avec beaucoup de posts (>500) peut prendre plusieurs minutes.

## 🔄 Mises à jour futures

Fonctionnalités prévues :
- [ ] Graphiques Chart.js intégrés dans le PDF
- [ ] Export en CSV/Excel
- [ ] Analyse des hashtags les plus performants
- [ ] Comparaison de plusieurs profils
- [ ] Analyse des heures de publication optimales
- [ ] Support multilingue

## 📝 Changelog

### Version 1.0.0 (Date actuelle)
- ✨ Première version
- 🔍 Scraping automatique des posts
- 📊 Génération de statistiques
- 📄 Export PDF complet

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :
1. Forkez le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [jsPDF](https://github.com/parallax/jsPDF) - Génération de PDF
- LinkedIn pour leur plateforme
- La communauté open source

## 📧 Contact

Pour toute question ou suggestion :
- Ouvrez une issue sur GitHub
- Contactez-moi via LinkedIn

---

**Note** : Cette extension n'est pas affiliée à LinkedIn Corporation.
