// Background service worker - Simplifié
// La génération de PDF est maintenant gérée dans le content script

// Ce service worker peut être utilisé pour des fonctionnalités futures
chrome.runtime.onInstalled.addListener(() => {
  console.log('LinkedIn Post Analytics Extension installed');
});

// Listener pour messages futurs (optionnel)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Peut être utilisé pour des fonctionnalités futures
  console.log('Message reçu:', request);
  sendResponse({ received: true });
  return true;
});
