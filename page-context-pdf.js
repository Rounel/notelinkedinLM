// Ce fichier s'exécute dans le contexte de la page (pas dans le content script)
// Il a accès à window.jspdf après le chargement de jsPDF

(function() {
  'use strict';

  console.log('[Page Context] Script chargé');

  // Attendre que jsPDF soit disponible
  function waitForJsPDF() {
    return new Promise((resolve) => {
      const check = () => {
        if (window.jspdf && window.jspdf.jsPDF) {
          console.log('[Page Context] jsPDF trouvé !');
          resolve(window.jspdf.jsPDF);
        } else if (window.jsPDF) {
          console.log('[Page Context] jsPDF trouvé (global) !');
          resolve(window.jsPDF);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  // Fonction pour générer le PDF
  window.__generateLinkedInPDF__ = async function(profileData, postsData, analyticsData) {
    console.log('[Page Context] Génération du PDF...', {
      profile: profileData.name,
      posts: postsData.length
    });

    try {
      const jsPDF = await waitForJsPDF();
      const doc = new jsPDF();
      let yPos = 20;

      // En-tête
      doc.setFontSize(24);
      doc.setTextColor(10, 102, 194);
      doc.text('LinkedIn Analytics Report', 20, yPos);

      yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Genere le ${new Date().toLocaleDateString('fr-FR')}`, 20, yPos);

      // Informations du profil
      yPos += 15;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Profil', 20, yPos);

      yPos += 8;
      doc.setFontSize(12);
      doc.text(`Nom: ${profileData.name}`, 20, yPos);
      yPos += 6;
      doc.text(`Titre: ${profileData.title}`, 20, yPos);

      // Statistiques globales
      yPos += 15;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Statistiques Globales', 20, yPos);

      yPos += 8;
      doc.setFontSize(12);
      doc.text(`Total de posts: ${analyticsData.totalPosts}`, 20, yPos);
      yPos += 6;
      doc.text(`Total d'engagement: ${analyticsData.totalEngagement}`, 20, yPos);
      yPos += 6;
      doc.text(`Engagement moyen: ${Math.round(analyticsData.avgEngagement)}`, 20, yPos);
      yPos += 6;
      doc.text(`Total de reactions: ${analyticsData.totalReactions}`, 20, yPos);
      yPos += 6;
      doc.text(`Total de commentaires: ${analyticsData.totalComments}`, 20, yPos);
      yPos += 6;
      doc.text(`Total de republications: ${analyticsData.totalReposts}`, 20, yPos);

      // Impact des médias
      yPos += 12;
      doc.setFontSize(14);
      doc.text('Impact des Medias', 20, yPos);
      yPos += 7;
      doc.setFontSize(11);
      doc.text(`Posts avec media: ${analyticsData.postsWithMedia} (engagement moyen: ${Math.round(analyticsData.avgEngagementWithMedia)})`, 20, yPos);
      yPos += 6;
      doc.text(`Posts sans media: ${analyticsData.postsWithoutMedia} (engagement moyen: ${Math.round(analyticsData.avgEngagementWithoutMedia)})`, 20, yPos);

      // Nouvelle page pour les graphiques
      doc.addPage();
      yPos = 20;

      doc.setFontSize(16);
      doc.text('Analyse de Performance', 20, yPos);

      yPos += 10;
      doc.setFontSize(14);
      doc.text('Engagement par Jour de la Semaine', 20, yPos);
      yPos += 5;

      doc.setFontSize(10);
      Object.entries(analyticsData.engagementByDay).forEach(([day, data]) => {
        const avgEng = data.count > 0 ? Math.round(data.engagement / data.count) : 0;
        doc.text(`${day}: ${data.count} posts, engagement moyen: ${avgEng}`, 25, yPos);
        yPos += 5;
      });

      // Périodes performantes
      yPos += 10;
      doc.setFontSize(14);
      doc.text('Periodes de Haute Performance', 20, yPos);
      yPos += 7;

      if (analyticsData.performancePeriods.length > 0) {
        doc.setFontSize(11);
        analyticsData.performancePeriods.forEach((period, index) => {
          const startDate = new Date(period.start).toLocaleDateString('fr-FR');
          const endDate = new Date(period.end).toLocaleDateString('fr-FR');
          const avgEng = Math.round(period.totalEngagement / period.posts.length);

          doc.text(`${index + 1}. ${startDate} - ${endDate}`, 20, yPos);
          yPos += 5;
          doc.text(`   ${period.posts.length} posts, engagement total: ${period.totalEngagement}, moyenne: ${avgEng}`, 20, yPos);
          yPos += 6;

          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
      } else {
        doc.setFontSize(11);
        doc.text('Aucune periode de haute performance identifiee', 20, yPos);
      }

      // Top posts
      doc.addPage();
      yPos = 20;
      doc.setFontSize(16);
      doc.text('Top 10 Posts par Engagement', 20, yPos);
      yPos += 10;

      analyticsData.topPosts.forEach((post, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(10, 102, 194);
        doc.text(`#${index + 1} - Engagement: ${post.engagement}`, 20, yPos);
        yPos += 6;

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Date: ${new Date(post.date).toLocaleDateString('fr-FR')}`, 20, yPos);
        yPos += 5;

        doc.setTextColor(0, 0, 0);
        doc.text(`Reactions: ${post.reactions} | Commentaires: ${post.comments} | Republications: ${post.reposts}`, 20, yPos);
        yPos += 6;

        const postText = post.text.substring(0, 200) + (post.text.length > 200 ? '...' : '');
        const lines = doc.splitTextToSize(postText, 170);
        doc.text(lines.slice(0, 3), 20, yPos);
        yPos += lines.slice(0, 3).length * 5 + 8;
      });

      // Liste complète
      doc.addPage();
      yPos = 20;
      doc.setFontSize(16);
      doc.text('Liste Complete des Posts', 20, yPos);
      yPos += 10;

      postsData.forEach((post) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`${new Date(post.date).toLocaleDateString('fr-FR')} - Engagement: ${post.engagement}`, 20, yPos);
        yPos += 5;

        doc.setTextColor(0, 0, 0);
        const postText = post.text.substring(0, 150) + (post.text.length > 150 ? '...' : '');
        const lines = doc.splitTextToSize(postText, 170);
        doc.text(lines.slice(0, 2), 20, yPos);
        yPos += lines.slice(0, 2).length * 5 + 6;
      });

      // Télécharger le PDF
      const fileName = `LinkedIn_Analytics_${profileData.name.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      console.log('[Page Context] PDF généré:', fileName);
      return { success: true, fileName };

    } catch (error) {
      console.error('[Page Context] Erreur génération PDF:', error);
      return { success: false, error: error.message };
    }
  };

  console.log('[Page Context] Fonction __generateLinkedInPDF__ prête');

})();
