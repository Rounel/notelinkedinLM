// Popup script pour afficher les informations de l'extension

document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si on est sur LinkedIn
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const statusElement = document.querySelector('.status');

    if (currentTab && currentTab.url && currentTab.url.includes('linkedin.com')) {
      statusElement.classList.add('active');
      statusElement.textContent = '✓ LinkedIn détecté - Extension active';
    } else {
      statusElement.classList.remove('active');
      statusElement.textContent = '⚠ Visitez LinkedIn pour utiliser l\'extension';
    }
  });

  // Animation au chargement
  const sections = document.querySelectorAll('.section');
  sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(10px)';

    setTimeout(() => {
      section.style.transition = 'all 0.3s ease';
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, index * 100);
  });
});
