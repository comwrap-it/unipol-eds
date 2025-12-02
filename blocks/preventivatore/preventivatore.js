/* eslint-disable no-console */
import { loadCSS, loadScript } from '../../scripts/aem.js';

function createSkeleton() {
  const skeleton = document.createElement('div');
  skeleton.className = 'preventivatore-skeleton';
  skeleton.innerHTML = `
    <div class="skeleton-container">
      <div class="skeleton-left">
        <div class="skeleton-form">
          <div class="skeleton-field">
            <div class="skeleton-label"></div>
            <div class="skeleton-input"></div>
            <div class="skeleton-checkbox-row">
              <div class="skeleton-checkbox"></div>
              <div class="skeleton-checkbox-label"></div>
            </div>
          </div>
          
          <div class="skeleton-field">
            <div class="skeleton-label"></div>
            <div class="skeleton-input"></div>
          </div>
          
          <div class="skeleton-field">
            <div class="skeleton-label"></div>
            <div class="skeleton-input"></div>
          </div>
          
          <div class="skeleton-actions">
            <div class="skeleton-button skeleton-button-primary"></div>
          </div>
          
          <div class="skeleton-links">
            <div class="skeleton-link"></div>
            <div class="skeleton-link"></div>
          </div>
        </div>
      </div>
      
      <div class="skeleton-right">
        <div class="skeleton-promo">
          <div class="skeleton-promo-icons">
            <div class="skeleton-icon"></div>
            <div class="skeleton-icon"></div>
            <div class="skeleton-icon"></div>
          </div>
          <div class="skeleton-promo-title"></div>
          <div class="skeleton-promo-subtitle"></div>
          <div class="skeleton-promo-discount"></div>
          <div class="skeleton-promo-features">
            <div class="skeleton-feature"></div>
            <div class="skeleton-feature"></div>
            <div class="skeleton-feature"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile version -->
    <div class="skeleton-mobile">
      <div class="skeleton-mobile-header">
        <div class="skeleton-mobile-title"></div>
      </div>
      <div class="skeleton-mobile-form">
        <div class="skeleton-field">
          <div class="skeleton-label"></div>
          <div class="skeleton-input"></div>
        </div>
        <div class="skeleton-field">
          <div class="skeleton-label"></div>
          <div class="skeleton-input"></div>
        </div>
        <div class="skeleton-field">
          <div class="skeleton-label"></div>
          <div class="skeleton-input"></div>
        </div>
        <div class="skeleton-button skeleton-button-primary"></div>
        <div class="skeleton-links">
          <div class="skeleton-link"></div>
          <div class="skeleton-link"></div>
        </div>
      </div>
    </div>
  `;
  return skeleton;
}

export default async function decorate(block) {
  // Crea e mostra lo skeleton immediatamente
  const skeleton = createSkeleton();
  block.appendChild(skeleton);

  // Crea un container per React
  const reactContainer = document.createElement('div');
  reactContainer.id = 'root';
  reactContainer.style.display = 'none'; // Nascosto inizialmente
  block.appendChild(reactContainer);

  // Listener per nascondere lo skeleton quando React è pronto
  const hideSkeletonHandler = (event) => {
    console.log('Evento preventivatoreComponentReady ricevuto:', event);

    // Nascondi lo skeleton
    skeleton.style.display = 'none';

    // Mostra il componente React
    reactContainer.style.display = 'block';

    // Rimuovi l'event listener
    window.removeEventListener('preventivatoreComponentReady', hideSkeletonHandler);

    console.log('Skeleton nascosto e componente React mostrato');
  };

  // Registra l'event listener
  window.addEventListener('preventivatoreComponentReady', hideSkeletonHandler);
  console.log('Event listener registrato per preventivatoreComponentReady');

  // Timeout di fallback (dichiarato prima per evitare errori no-use-before-define)
  const fallbackTimeout = setTimeout(() => {
    hideSkeletonHandler({ type: 'fallback' });
  }, 5000); // Ridotto da 10 a 5 secondi

  try {
    // Carica React e ReactDOM da CDN
    await loadScript('/static/js/main.bc1853d5.js');
    // Carica CSS se necessario
    await loadCSS('/static/css/main.4efb37a3.css');
    console.log('Script e CSS caricati');
  } catch (error) {
    console.error('Errore nel caricamento del componente React:', error);

    // Nascondi lo skeleton anche in caso di errore
    clearTimeout(fallbackTimeout);
    hideSkeletonHandler({ type: 'error' });
  }

  // Caricamento asincrono e non bloccante
  const loadReactAsync = async () => {
    try {
      // Preload delle risorse
      const linkPreload = document.createElement('link');
      linkPreload.rel = 'preload';
      linkPreload.href = '/static/js/main.bc1853d5.js';
      linkPreload.as = 'script';
      document.head.appendChild(linkPreload);

      // Caricamento con requestIdleCallback per non bloccare il main thread
      if ('requestIdleCallback' in window) {
        requestIdleCallback(async () => {
          await loadScript('/static/js/main.bc1853d5.js');
          await loadCSS('/static/css/main.4efb37a3.css');
        });
      } else {
        // Fallback per browser che non supportano requestIdleCallback
        setTimeout(async () => {
          await loadScript('/static/js/main.bc1853d5.js');
          await loadCSS('/static/css/main.4efb37a3.css');
        }, 100);
      }
    } catch (error) {
      console.error('Errore nel caricamento:', error);
      hideSkeletonHandler({ type: 'error' });
    }
  };

  // Avvia il caricamento in background
  loadReactAsync();
}
