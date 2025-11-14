# 🔧 Fix : Chargement de jsPDF

## Problème rencontré

```
Erreur lors de la génération du PDF: Error: jsPDF non chargé correctement
```

## Cause

Le problème venait de la méthode de chargement de jsPDF. L'injection simple via `<script src="...">` ne garantissait pas que jsPDF soit disponible dans le bon contexte.

### Problèmes avec l'approche précédente

1. **Timing** : Le script était chargé, mais `window.jspdf` n'était pas immédiatement disponible
2. **Contexte d'exécution** : Les content scripts ont un contexte isolé
3. **Export UMD** : jsPDF utilise un format UMD qui nécessite une initialisation complète

## Solution appliquée

### Nouvelle méthode : Fetch + Eval

Au lieu d'injecter un `<script src="...">`, on utilise maintenant **fetch + eval** :

```javascript
// 1. Télécharger le script via fetch
const url = chrome.runtime.getURL('libs/jspdf.min.js');
const response = await fetch(url);
const scriptText = await response.text();

// 2. Créer un élément script avec le contenu textuel
const scriptElement = document.createElement('script');
scriptElement.textContent = scriptText;  // ← Contenu, pas src!
document.head.appendChild(scriptElement);

// 3. Attendre que jsPDF soit disponible
while (attempts < maxAttempts) {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (window.jspdf?.jsPDF || window.jsPDF) {
    return window.jspdf.jsPDF || window.jsPDF;
  }
}
```

### Avantages de cette méthode

✅ **Contrôle total** : On contrôle exactement quand et comment le script est exécuté
✅ **Contexte garanti** : Le script s'exécute dans le contexte de la page
✅ **Attente active** : On attend activement que jsPDF soit disponible
✅ **Debug facile** : Logs détaillés à chaque étape
✅ **Chemins multiples** : Vérifie `window.jspdf.jsPDF` ET `window.jsPDF`

## Test de la correction

### 1. Recharger l'extension

```bash
chrome://extensions/ → Bouton ↻ Recharger
```

### 2. Ouvrir la console

```bash
F12 → Console
```

### 3. Tester sur LinkedIn

```bash
1. Visitez un profil LinkedIn
2. Cliquez sur "Générer PDF Analytics"
3. Observez les logs dans la console
```

### Logs attendus

```
📥 Chargement de jsPDF via fetch...
📄 Script jsPDF téléchargé, taille: 364xxx caractères
✅ Script jsPDF exécuté
✓ jsPDF trouvé à window.jspdf.jsPDF
=== Début génération PDF ===
Profil: [Nom du profil]
Nombre de posts: XX
✓ jsPDF déjà chargé (window.jspdf.jsPDF)
jsPDF chargé, type: function
Analyse des données...
... [génération du PDF]
✓ PDF généré !
```

## Dépannage

### Si jsPDF n'est toujours pas trouvé

Vérifiez dans les logs de la console :

```javascript
// Devrait afficher:
window.jspdf: object
window.jsPDF: function
// OU
window.jspdf: object
window.jspdf.jsPDF: function
```

Si vous voyez `undefined`, le problème peut venir de :

1. **Fichier manquant** : Vérifiez que `libs/jspdf.min.js` existe
   ```bash
   ls -lh libs/jspdf.min.js  # Devrait être ~356 KB
   ```

2. **Permissions** : Vérifiez `web_accessible_resources` dans `manifest.json`
   ```json
   "web_accessible_resources": [{
     "resources": ["libs/jspdf.min.js"],
     "matches": ["https://www.linkedin.com/*"]
   }]
   ```

3. **Cache** : Videz le cache de l'extension
   ```bash
   chrome://extensions/ → Détails → Effacer le cache
   ```

### Si le téléchargement échoue

```
❌ Erreur lors du chargement de jsPDF: TypeError: Failed to fetch
```

**Solution** : Vérifiez les permissions dans `manifest.json`

```json
"permissions": [
  "activeTab",
  "storage",
  "downloads"
]
```

## Méthodes alternatives (si ça ne marche toujours pas)

### Alternative 1 : Charger depuis un CDN externe

Si rien ne fonctionne, on peut charger depuis un CDN :

```javascript
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
document.head.appendChild(script);
```

**Note** : Nécessite d'ajouter dans `manifest.json` :
```json
"content_security_policy": {
  "extension_pages": "script-src 'self' https://cdnjs.cloudflare.com; object-src 'self'"
}
```

### Alternative 2 : Utiliser une bibliothèque plus simple

Si jsPDF pose trop de problèmes, on peut utiliser :
- **pdfmake** : Plus simple, meilleure compatibilité
- **html2pdf** : Génère des PDF depuis HTML
- API serveur : Générer le PDF côté serveur

## Fichiers modifiés

- ✅ `pdf-generator.js` - Nouvelle méthode de chargement avec fetch
- ✅ `FIX_JSPDF_LOADING.md` - Cette documentation

## Statut

🟢 **Corrigé** : La méthode fetch + eval devrait résoudre le problème

---

**Dernière mise à jour** : 2024-11-06
**Version** : 1.0.2
