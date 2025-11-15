// Content script pour injecter le bouton sur les profils LinkedIn

let scrapingInProgress = false;

// Fonction pour créer et injecter le bouton
function injectButton() {
  // Vérifier si on est sur une page de profil
  const isProfilePage = window.location.pathname.includes('/in/');
  if (!isProfilePage) return;

  // Vérifier si le bouton existe déjà
  if (document.getElementById('linkedin-scraper-btn')) return;

  // Chercher le conteneur du nom de profil
  const profileHeader = document.querySelector('.pv-text-details__left-panel') ||
                         document.querySelector('.ph5.pb5') ||
                         document.querySelector('[data-view-name="profile-top-card"]');

  if (!profileHeader) {
    console.log('Profile header not found, retrying...');
    return;
  }

  // Créer le bouton
  const button = document.createElement('button');
  button.id = 'linkedin-scraper-btn';
  button.className = 'linkedin-scraper-button';
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM2 12V4h12v8H2z"/>
      <path d="M4 6h8v1H4V6zm0 2h8v1H4V8zm0 2h5v1H4v-1z"/>
    </svg>
    Générer PDF Analytics
  `;

  button.addEventListener('click', handleButtonClick);

  // Insérer le bouton
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'linkedin-scraper-container';
  buttonContainer.appendChild(button);

  profileHeader.appendChild(buttonContainer);
  console.log('Button injected successfully');
}

// Gérer le clic sur le bouton
async function handleButtonClick() {
  if (scrapingInProgress) {
    alert('Un scraping est déjà en cours...');
    return;
  }

  const button = document.getElementById('linkedin-scraper-btn');
  const originalText = button.innerHTML;

  try {
    scrapingInProgress = true;
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span> Scraping en cours...';

    // Récupérer les informations du profil
    const profileData = await scrapeProfileInfo();

    // Scroller et scraper tous les posts
    const posts = await scrapeAllPosts();

    if (posts.length === 0) {
      alert('Aucun post trouvé sur ce profil.');
      return;
    }

    button.innerHTML = '<span class="spinner"></span> Génération du PDF...';

    // Générer le PDF directement dans la page
    const result = await window.PDFGenerator.generatePDFReport(profileData, posts);

    if (result.success) {
      button.innerHTML = '✓ PDF généré !';
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        scrapingInProgress = false;
      }, 2000);
    } else {
      throw new Error(result.error || 'Erreur lors de la génération du PDF');
    }

  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur: ' + error.message);
    button.innerHTML = originalText;
    button.disabled = false;
    scrapingInProgress = false;
  }
}

// Scraper les informations du profil
async function scrapeProfileInfo() {
  const profileName = document.querySelector('.pv-text-details__left-panel h1')?.textContent.trim() ||
                      document.querySelector('[data-view-name="profile-top-card"] h1')?.textContent.trim() ||
                      'Profil LinkedIn';

  const profileTitle = document.querySelector('.pv-text-details__left-panel .text-body-medium')?.textContent.trim() ||
                       document.querySelector('[data-view-name="profile-top-card"] .text-body-medium')?.textContent.trim() ||
                       '';

  const profileImage = document.querySelector('.pv-top-card-profile-picture__image')?.src ||
                       document.querySelector('[data-view-name="profile-top-card"] img')?.src ||
                       '';

  return {
    name: profileName,
    title: profileTitle,
    image: profileImage,
    url: window.location.href,
    scrapedAt: new Date().toISOString()
  };
}

// Scraper tous les posts avec scroll infini
async function scrapeAllPosts() {
  const posts = [];
  const scrapedPostIds = new Set();

  // Naviguer vers la section des posts si pas déjà là
  const postsTab = document.querySelector('a[href*="/recent-activity/all/"]');
  if (postsTab && !window.location.href.includes('/recent-activity/')) {
    postsTab.click();
    await wait(2000);
  }

  let noNewPostsCount = 0;
  const maxNoNewPostsAttempts = 5;

  while (noNewPostsCount < maxNoNewPostsAttempts) {
    // Trouver tous les posts visibles
    const postElements = document.querySelectorAll('[data-urn*="urn:li:activity:"], .feed-shared-update-v2, [data-urn*="urn:li:share:"]');

    let newPostsFound = 0;

    for (const postElement of postElements) {
      const postId = postElement.getAttribute('data-urn') ||
                     postElement.querySelector('[data-urn]')?.getAttribute('data-urn') ||
                     'post-' + Math.random();

      if (scrapedPostIds.has(postId)) continue;

      scrapedPostIds.add(postId);
      newPostsFound++;

      try {
        const post = await extractPostData(postElement);
        if (post) {
          posts.push(post);
          console.log(`Post ${posts.length} scraped`);
        }
      } catch (error) {
        console.error('Erreur lors de l\'extraction du post:', error);
      }
    }

    if (newPostsFound === 0) {
      noNewPostsCount++;
    } else {
      noNewPostsCount = 0;
    }

    // Scroller vers le bas
    window.scrollTo(0, document.body.scrollHeight);
    await wait(1500);

    // Vérifier si on a atteint la fin
    const endMessage = document.querySelector('.artdeco-empty-state__message');
    if (endMessage) {
      console.log('Fin des posts atteinte');
      break;
    }
  }

  return posts;
}

// Extraire les données d'un post
async function extractPostData(postElement) {
  try {
    // Bouton voir plus - essayer plusieurs sélecteurs possibles
    const seeMoreSelectors = [
      '.feed-shared-inline-show-more-text__see-more-less-toggle',
      'button[aria-label*="voir plus"]',
      'button[aria-label*="see more"]',
      '.feed-shared-inline-show-more-text button',
      'button.feed-shared-inline-show-more-text__button',
      'button.see-more',
      '.inline-show-more-text button'
    ];

    let seeMoreButton = null;
    for (const selector of seeMoreSelectors) {
      seeMoreButton = postElement.querySelector(selector);
      if (seeMoreButton && seeMoreButton.offsetParent !== null) {
        console.log("✓ Bouton 'voir plus' trouvé:", selector);
        break;
      }
    }

    if (seeMoreButton) {
      try {
        // Scroller jusqu'au bouton pour s'assurer qu'il est visible
        seeMoreButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(200);

        // Cliquer sur le bouton
        seeMoreButton.click();
        console.log("✓ Bouton 'voir plus' cliqué");

        // Attendre que le texte complet se charge
        await wait(400);
      } catch (clickError) {
        console.warn("⚠ Erreur clic 'voir plus':", clickError);
      }
    }

    // Texte du post - essayer plusieurs sélecteurs
    let text = '';
    const textSelectors = [
      '.feed-shared-update-v2__description',
      '.feed-shared-text__text-view',
      '.feed-shared-text',
      '[data-test-id="main-feed-activity-card__commentary"]',
      '.update-components-text',
      '.feed-shared-inline-show-more-text'
    ];

    for (const selector of textSelectors) {
      const textElement = postElement.querySelector(selector);
      if (textElement) {
        text = textElement.textContent.trim();
        if (text && text.length > 0) {
          break;
        }
      }
    }

    // Si aucun texte trouvé, essayer de récupérer depuis les spans
    if (!text) {
      const spans = postElement.querySelectorAll('.feed-shared-update-v2__description span, .feed-shared-text span');
      text = Array.from(spans).map(s => s.textContent).join(' ').trim();
    }

    // Date du post
    const dateElement = postElement.querySelector('.feed-shared-actor__sub-description time, time');
    const dateStr = dateElement?.getAttribute('datetime') || dateElement?.textContent.trim() || '';

    // Statistiques de réactions
    const reactionsElement = postElement.querySelector('.social-details-social-counts__reactions-count, [aria-label*="reaction"]');
    const reactionsText = reactionsElement?.textContent.trim() || '0';
    const reactions = parseNumber(reactionsText);

    // Commentaires
    const commentsElement = postElement.querySelector('.social-details-social-counts__comments, [aria-label*="comment"]');
    const commentsText = commentsElement?.textContent.trim() || '0';
    const comments = parseNumber(commentsText);

    // Republications
    const repostsElement = postElement.querySelector('.social-details-social-counts__shares, [aria-label*="repost"]');
    const repostsText = repostsElement?.textContent.trim() || '0';
    const reposts = parseNumber(repostsText);

    // Images/médias
    const mediaElements = postElement.querySelectorAll('img[src*="media"], video');
    const hasMedia = mediaElements.length > 0;

    return {
      text: text,
      date: parseDate(dateStr),
      dateStr: dateStr,
      reactions: reactions,
      comments: comments,
      reposts: reposts,
      hasMedia: hasMedia,
      engagement: reactions + comments + reposts
    };
  } catch (error) {
    console.error('Erreur lors de l\'extraction des données du post:', error);
    return null;
  }
}

// Parser un nombre (ex: "1,234" -> 1234, "5K" -> 5000)
function parseNumber(str) {
  if (!str) return 0;

  str = str.replace(/\s/g, '').replace(/,/g, '');

  if (str.includes('K')) {
    return Math.round(parseFloat(str.replace('K', '')) * 1000);
  }
  if (str.includes('M')) {
    return Math.round(parseFloat(str.replace('M', '')) * 1000000);
  }

  return parseInt(str) || 0;
}

// Parser une date
function parseDate(dateStr) {
  if (!dateStr) return new Date();

  // Si c'est déjà en format ISO
  if (dateStr.includes('T')) {
    return new Date(dateStr);
  }

  // Gérer les formats relatifs (ex: "il y a 2 jours")
  const now = new Date();

  if (dateStr.includes('minute') || dateStr.includes('min')) {
    const minutes = parseInt(dateStr) || 1;
    return new Date(now.getTime() - minutes * 60000);
  }
  if (dateStr.includes('hour') || dateStr.includes('heure') || dateStr.includes('h')) {
    const hours = parseInt(dateStr) || 1;
    return new Date(now.getTime() - hours * 3600000);
  }
  if (dateStr.includes('day') || dateStr.includes('jour') || dateStr.includes('j')) {
    const days = parseInt(dateStr) || 1;
    return new Date(now.getTime() - days * 86400000);
  }
  if (dateStr.includes('week') || dateStr.includes('semaine') || dateStr.includes('sem')) {
    const weeks = parseInt(dateStr) || 1;
    return new Date(now.getTime() - weeks * 604800000);
  }
  if (dateStr.includes('month') || dateStr.includes('mois')) {
    const months = parseInt(dateStr) || 1;
    return new Date(now.setMonth(now.getMonth() - months));
  }
  if (dateStr.includes('year') || dateStr.includes('an')) {
    const years = parseInt(dateStr) || 1;
    return new Date(now.setFullYear(now.getFullYear() - years));
  }

  return new Date(dateStr);
}

// Fonction utilitaire pour attendre
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Observer les changements de page (LinkedIn est une SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(injectButton, 1000);
  }
}).observe(document, { subtree: true, childList: true });

// Injecter le bouton au chargement initial
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(injectButton, 2000);
  });
} else {
  setTimeout(injectButton, 2000);
}

// Réinjecter le bouton périodiquement au cas où
setInterval(injectButton, 5000);
