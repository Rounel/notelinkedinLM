// Module de génération de PDF - À charger dans le content script
// Ce module initialise l'environnement PDF et orchestre la génération

// Initialiser l'environnement PDF dans le contexte de la page
async function initializePDFEnvironment() {
  console.log('🔧 Initialisation de l\'environnement PDF...');

  // Vérifier si déjà initialisé
  if (window.__generateLinkedInPDF__) {
    console.log('✓ Environnement PDF déjà initialisé');
    return true;
  }

  return new Promise((resolve, reject) => {
    let scriptsLoaded = 0;
    const totalScripts = 2; // jsPDF + page-context-pdf

    const checkComplete = () => {
      scriptsLoaded++;
      console.log(`✓ Script ${scriptsLoaded}/${totalScripts} chargé`);

      if (scriptsLoaded === totalScripts) {
        // Attendre que la fonction soit disponible
        let attempts = 0;
        const checkFunction = setInterval(() => {
          attempts++;
          if (window.__generateLinkedInPDF__) {
            clearInterval(checkFunction);
            console.log('✅ Environnement PDF prêt !');
            resolve(true);
          } else if (attempts > 30) {
            clearInterval(checkFunction);
            reject(new Error('Fonction de génération PDF non disponible'));
          }
        }, 100);
      }
    };

    // 1. Charger jsPDF
    const jspdfScript = document.createElement('script');
    jspdfScript.id = 'jspdf-library';
    jspdfScript.src = chrome.runtime.getURL('libs/jspdf.min.js');
    jspdfScript.onload = checkComplete;
    jspdfScript.onerror = () => reject(new Error('Erreur chargement jsPDF'));
    document.documentElement.appendChild(jspdfScript);

    // 2. Charger le script de contexte
    const contextScript = document.createElement('script');
    contextScript.id = 'pdf-page-context';
    contextScript.src = chrome.runtime.getURL('page-context-pdf.js');
    contextScript.onload = checkComplete;
    contextScript.onerror = () => reject(new Error('Erreur chargement page-context-pdf'));
    document.documentElement.appendChild(contextScript);

    console.log('📥 Scripts injectés dans la page');
  });
}

// Analyser les données des posts
function analyzePostsData(posts) {
  if (!posts || posts.length === 0) {
    return {
      totalPosts: 0,
      totalEngagement: 0,
      avgEngagement: 0,
      topPosts: [],
      engagementByDay: {},
      engagementByMonth: {},
      performancePeriods: []
    };
  }

  // Statistiques globales
  const totalPosts = posts.length;
  const totalReactions = posts.reduce((sum, p) => sum + (p.reactions || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.comments || 0), 0);
  const totalReposts = posts.reduce((sum, p) => sum + (p.reposts || 0), 0);
  const totalEngagement = totalReactions + totalComments + totalReposts;
  const avgEngagement = totalEngagement / totalPosts;

  // Top posts par engagement
  const topPosts = [...posts]
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 10);

  // Engagement par jour de la semaine
  const engagementByDay = {
    'Lundi': { count: 0, engagement: 0 },
    'Mardi': { count: 0, engagement: 0 },
    'Mercredi': { count: 0, engagement: 0 },
    'Jeudi': { count: 0, engagement: 0 },
    'Vendredi': { count: 0, engagement: 0 },
    'Samedi': { count: 0, engagement: 0 },
    'Dimanche': { count: 0, engagement: 0 }
  };

  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  posts.forEach(post => {
    const date = new Date(post.date);
    const dayName = dayNames[date.getDay()];
    engagementByDay[dayName].count++;
    engagementByDay[dayName].engagement += post.engagement;
  });

  // Engagement par mois
  const engagementByMonth = {};
  posts.forEach(post => {
    const date = new Date(post.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!engagementByMonth[monthKey]) {
      engagementByMonth[monthKey] = { count: 0, engagement: 0 };
    }
    engagementByMonth[monthKey].count++;
    engagementByMonth[monthKey].engagement += post.engagement;
  });

  // Identifier les périodes performantes
  const performancePeriods = identifyPerformancePeriods(posts);

  // Engagement par type
  const postsWithMedia = posts.filter(p => p.hasMedia).length;
  const postsWithoutMedia = posts.length - postsWithMedia;

  const engagementWithMedia = posts
    .filter(p => p.hasMedia)
    .reduce((sum, p) => sum + p.engagement, 0);
  const engagementWithoutMedia = posts
    .filter(p => !p.hasMedia)
    .reduce((sum, p) => sum + p.engagement, 0);

  return {
    totalPosts,
    totalReactions,
    totalComments,
    totalReposts,
    totalEngagement,
    avgEngagement,
    topPosts,
    engagementByDay,
    engagementByMonth,
    performancePeriods,
    postsWithMedia,
    postsWithoutMedia,
    avgEngagementWithMedia: postsWithMedia > 0 ? engagementWithMedia / postsWithMedia : 0,
    avgEngagementWithoutMedia: postsWithoutMedia > 0 ? engagementWithoutMedia / postsWithoutMedia : 0
  };
}

// Identifier les périodes de haute performance
function identifyPerformancePeriods(posts) {
  if (posts.length === 0) return [];

  const avgEngagement = posts.reduce((sum, p) => sum + p.engagement, 0) / posts.length;
  const threshold = avgEngagement * 1.5; // 50% au-dessus de la moyenne

  // Grouper les posts performants par périodes
  const performantPosts = posts
    .filter(p => p.engagement >= threshold)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const periods = [];
  let currentPeriod = null;

  performantPosts.forEach(post => {
    const postDate = new Date(post.date);

    if (!currentPeriod) {
      currentPeriod = {
        start: postDate,
        end: postDate,
        posts: [post],
        totalEngagement: post.engagement
      };
    } else {
      const daysDiff = (postDate - currentPeriod.end) / (1000 * 60 * 60 * 24);

      if (daysDiff <= 14) { // Si moins de 14 jours entre deux posts performants
        currentPeriod.end = postDate;
        currentPeriod.posts.push(post);
        currentPeriod.totalEngagement += post.engagement;
      } else {
        periods.push(currentPeriod);
        currentPeriod = {
          start: postDate,
          end: postDate,
          posts: [post],
          totalEngagement: post.engagement
        };
      }
    }
  });

  if (currentPeriod) {
    periods.push(currentPeriod);
  }

  return periods.sort((a, b) => b.totalEngagement - a.totalEngagement).slice(0, 5);
}

// Générer le PDF complet
async function generatePDFReport(profile, posts) {
  try {
    console.log('=== Début génération PDF ===');
    console.log('Profil:', profile.name);
    console.log('Nombre de posts:', posts.length);

    // Initialiser l'environnement PDF
    console.log('Initialisation de l\'environnement...');
    await initializePDFEnvironment();

    // Analyser les données
    console.log('Analyse des données...');
    const analytics = analyzePostsData(posts);
    console.log('Analytics calculés:', analytics.totalPosts, 'posts analysés');

    // Appeler la fonction de génération dans le contexte de la page
    console.log('Appel de la fonction de génération PDF...');
    const result = await window.__generateLinkedInPDF__(profile, posts, analytics);

    if (!result.success) {
      throw new Error(result.error || 'Erreur génération PDF');
    }

    console.log('✓ PDF généré avec succès:', result.fileName);
    return { success: true };

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return { success: false, error: error.message };
  }
}

// Exporter les fonctions
window.PDFGenerator = {
  generatePDFReport
};

console.log('✓ Module PDF Generator chargé');
