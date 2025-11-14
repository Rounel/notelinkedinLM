# Changelog

## Version 1.0.1 - Correctif Manifest V3 (2024-11-06)

### 🐛 Correction majeure
- **Problème résolu** : Erreur `import() is disallowed on ServiceWorkerGlobalScope`
- **Cause** : Les service workers (Manifest V3) ne supportent pas les dynamic imports
- **Solution** : Déplacement de la génération PDF du background script vers le content script

### 📝 Changements techniques

#### Fichiers modifiés
1. **manifest.json**
   - Ajout de `pdf-generator.js` dans les content scripts
   - Mise à jour des `web_accessible_resources`

2. **content.js**
   - Suppression de l'appel au background script via `chrome.runtime.sendMessage`
   - Utilisation directe de `window.PDFGenerator.generatePDFReport()`

3. **background.js**
   - Simplifié et nettoyé (toute la logique PDF retirée)
   - Conservé pour des fonctionnalités futures

#### Nouveaux fichiers
4. **pdf-generator.js** (NOUVEAU)
   - Module dédié à la génération de PDF
   - Chargement dynamique de jsPDF via script injection
   - Contient toute la logique d'analyse et de génération de PDF
   - Expose `window.PDFGenerator` pour le content script

### ✅ Avantages de cette approche

1. **Compatible Manifest V3** : Plus d'erreurs avec les service workers
2. **Performance** : PDF généré directement dans la page, pas de communication inter-processus
3. **Fiabilité** : Moins de points de défaillance
4. **Simplicité** : Logique centralisée dans un seul module

### 🔧 Architecture mise à jour

```
Flux précédent (CASSÉ):
content.js → chrome.runtime.sendMessage → background.js → import() ❌

Flux actuel (FONCTIONNEL):
pdf-generator.js (chargé au démarrage) → content.js → PDFGenerator.generatePDFReport() ✅
```

### 🚀 Migration

Si vous utilisiez la version 1.0.0 :

1. **Rechargez l'extension** dans `chrome://extensions/`
   - Cliquez sur le bouton de rechargement ↻

2. **Rafraîchissez la page LinkedIn** (F5)

3. **Testez** la génération de PDF

Aucune autre action requise !

### 📊 Tests effectués

- ✅ Chargement de jsPDF via script injection
- ✅ Génération de PDF avec tous les analytics
- ✅ Téléchargement automatique du PDF
- ✅ Pas d'erreurs dans la console
- ✅ Compatible avec tous les profils LinkedIn

---

## Version 1.0.0 - Version initiale (2024-11-06)

### ✨ Fonctionnalités

- 🔍 Scraping automatique des posts LinkedIn
- 📊 Analytics avancés (engagement, périodes performantes)
- 📄 Génération de PDF professionnel
- 🎨 Interface utilisateur intégrée
- 📈 Statistiques détaillées

### ⚠️ Problème connu
- Erreur avec `import()` dans le service worker (corrigé en v1.0.1)

---

## Notes de version

### Compatibilité
- Chrome/Chromium 88+
- Manifest V3
- LinkedIn (version actuelle)

### Prochaines versions prévues

#### v1.1.0 (À venir)
- [ ] Graphiques Chart.js dans le PDF
- [ ] Export CSV/Excel
- [ ] Filtres par date et engagement
- [ ] Mode dark

#### v1.2.0 (À venir)
- [ ] Analyse des hashtags
- [ ] Comparaison multi-profils
- [ ] Suggestions de meilleurs moments pour poster
- [ ] Historique et tendances

### Support
Pour signaler un bug ou suggérer une fonctionnalité, consultez la documentation ou ouvrez une issue.
