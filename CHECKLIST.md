# ✅ Checklist de Vérification

Utilisez cette checklist pour vous assurer que l'extension est correctement installée et configurée.

## 📦 Avant l'installation

- [ ] Tous les fichiers sont présents :
  - [ ] `manifest.json`
  - [ ] `content.js`
  - [ ] `background.js`
  - [ ] `styles.css`
  - [ ] `popup.html`
  - [ ] `popup.js`
  - [ ] `package.json`
  - [ ] `README.md`
  - [ ] `LICENSE`

- [ ] Dossier `libs/` :
  - [ ] `jspdf.min.js` est présent (355 KB environ)

- [ ] Dossier `icons/` :
  - [ ] `icon16.png` (16x16 pixels)
  - [ ] `icon48.png` (48x48 pixels)
  - [ ] `icon128.png` (128x128 pixels)

## 🔧 Installation dans Chrome

- [ ] Chrome est ouvert
- [ ] Navigué vers `chrome://extensions/`
- [ ] Mode développeur activé (bouton en haut à droite)
- [ ] Extension chargée via "Charger l'extension non empaquetée"
- [ ] Extension visible dans la liste
- [ ] Aucune erreur affichée (texte rouge)

## 🧪 Tests fonctionnels

### Test 1 : Popup de l'extension
- [ ] Cliquez sur l'icône de l'extension dans la barre Chrome
- [ ] Le popup s'affiche avec le design bleu LinkedIn
- [ ] Le titre "NoteLinkedinLM" est visible
- [ ] La version "1.0.0" est affichée
- [ ] Les sections sont visibles et bien formatées

### Test 2 : Injection du bouton
- [ ] Ouvrez https://www.linkedin.com/
- [ ] Connectez-vous si nécessaire
- [ ] Visitez un profil (par exemple le vôtre ou un profil public)
- [ ] URL contient `/in/`
- [ ] Attendez 2-3 secondes
- [ ] Le bouton "Générer PDF Analytics" apparaît
- [ ] Le bouton a le bon style (bleu, coins arrondis, icône)
- [ ] Au survol, le bouton change de couleur

### Test 3 : Scraping des posts
- [ ] Cliquez sur le bouton "Générer PDF Analytics"
- [ ] Le bouton change pour afficher "Scraping en cours..."
- [ ] Un spinner apparaît
- [ ] Le bouton est désactivé (grisé)
- [ ] La page commence à scroller automatiquement
- [ ] Ouvrez la console (F12) pour voir les logs
- [ ] Les messages "Post X scraped" apparaissent

### Test 4 : Génération du PDF
- [ ] Après le scraping, le message change pour "Génération du PDF..."
- [ ] Après quelques secondes, le bouton affiche "✓ PDF généré !"
- [ ] Le PDF se télécharge automatiquement
- [ ] Le nom du fichier suit le format : `LinkedIn_Analytics_[Nom]_[Date].pdf`
- [ ] Le bouton revient à son état normal après 2 secondes

### Test 5 : Contenu du PDF
- [ ] Ouvrez le PDF téléchargé
- [ ] La page 1 contient :
  - [ ] Titre "LinkedIn Analytics Report"
  - [ ] Date de génération
  - [ ] Nom du profil
  - [ ] Titre du profil
  - [ ] Statistiques globales
- [ ] Les pages suivantes contiennent :
  - [ ] Analyse de performance
  - [ ] Engagement par jour
  - [ ] Périodes performantes
  - [ ] Top 10 posts
  - [ ] Liste complète des posts
- [ ] Les statistiques sont cohérentes (pas de NaN ou undefined)
- [ ] Les dates sont au bon format
- [ ] Le texte est lisible

## 🐛 Tests d'erreur

### Scénario 1 : Profil sans posts
- [ ] Visitez un profil LinkedIn récent/vide
- [ ] Cliquez sur le bouton
- [ ] Message d'alerte "Aucun post trouvé" apparaît
- [ ] Le bouton revient à son état normal
- [ ] Pas de téléchargement de PDF

### Scénario 2 : Pas sur un profil
- [ ] Visitez la page d'accueil LinkedIn ou le feed
- [ ] Le bouton ne devrait PAS apparaître
- [ ] Naviguez vers un profil
- [ ] Le bouton devrait apparaître après quelques secondes

### Scénario 3 : Scraping en cours
- [ ] Cliquez sur le bouton "Générer PDF"
- [ ] Pendant le scraping, essayez de cliquer à nouveau
- [ ] Message d'alerte "Un scraping est déjà en cours..." apparaît
- [ ] Le premier scraping continue normalement

## 🔍 Vérification de la console

Ouvrez la console Chrome (F12) et vérifiez :

- [ ] Aucune erreur rouge critique
- [ ] Messages de log du content script :
  ```
  Button injected successfully
  Post 1 scraped
  Post 2 scraped
  ...
  ```
- [ ] Pas de "404 Not Found" pour les ressources
- [ ] Pas de "Uncaught TypeError" ou similaire

## 📊 Vérification des données

Choisissez un profil avec au moins 10 posts et vérifiez que :

- [ ] Le nombre total de posts dans le PDF correspond approximativement
- [ ] Les statistiques sont cohérentes :
  - [ ] Total engagement = réactions + commentaires + republications
  - [ ] L'engagement moyen semble correct
- [ ] Le top 10 est trié par engagement décroissant
- [ ] Les dates sont dans l'ordre (du plus récent au plus ancien)
- [ ] Les périodes performantes sont identifiées (si applicable)

## ⚡ Performance

- [ ] Le scraping de 50 posts prend moins de 2 minutes
- [ ] Le scraping de 100 posts prend moins de 5 minutes
- [ ] La génération du PDF prend moins de 10 secondes
- [ ] Le téléchargement du PDF démarre immédiatement

## 🔒 Sécurité et permissions

- [ ] L'extension demande uniquement les permissions nécessaires :
  - [ ] `activeTab`
  - [ ] `storage`
  - [ ] `downloads`
  - [ ] `https://www.linkedin.com/*`
- [ ] Aucune donnée n'est envoyée à des serveurs externes
- [ ] Les données restent locales sur l'ordinateur

## 🎨 Interface utilisateur

- [ ] Le bouton s'intègre bien visuellement avec LinkedIn
- [ ] Les couleurs correspondent au thème LinkedIn (#0a66c2)
- [ ] Les animations sont fluides (hover, spinner)
- [ ] Le texte est lisible et bien formaté
- [ ] Le popup est responsive et bien aligné

## 📱 Compatibilité

Testez sur différents types de profils :

- [ ] Profil avec beaucoup de posts (>100)
- [ ] Profil avec peu de posts (<10)
- [ ] Profil avec des posts contenant des images
- [ ] Profil avec des posts longs
- [ ] Profil avec des posts en plusieurs langues

## 🔄 Mises à jour et maintenance

- [ ] Après une modification du code :
  - [ ] Rechargé l'extension dans chrome://extensions/
  - [ ] Rafraîchi la page LinkedIn
  - [ ] Le bouton se réinjecte correctement
  - [ ] Les modifications sont prises en compte

## ✅ Validation finale

Une fois tous les tests passés :

- [ ] L'extension fonctionne comme prévu
- [ ] Aucune erreur critique
- [ ] Les PDF générés sont corrects et complets
- [ ] L'expérience utilisateur est fluide
- [ ] Prêt pour utilisation en production !

---

## 📝 Notes de débogage

Si des problèmes persistent, notez ici les détails :

**Navigateur :** Chrome version _______
**Système d'exploitation :** _______
**Description du problème :**

**Messages d'erreur dans la console :**

**Étapes pour reproduire :**
1.
2.
3.

**Comportement attendu :**

**Comportement observé :**

---

💡 **Astuce :** Gardez cette checklist à jour si vous ajoutez de nouvelles fonctionnalités !
