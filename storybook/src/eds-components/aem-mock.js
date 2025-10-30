/**
 * Mock delle funzioni AEM per Storybook
 * Questo file sostituisce le dipendenze da scripts/aem.js per i componenti EDS
 */

export function createOptimizedPicture(src, alt = '', eager = false, breakpoints = []) {
  const picture = document.createElement('picture');
  
  // Aggiungi source elements per i breakpoints se forniti
  breakpoints.forEach(bp => {
    if (bp.media) {
      const source = document.createElement('source');
      source.media = bp.media;
      source.srcset = src;
      picture.appendChild(source);
    }
  });
  
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = eager ? 'eager' : 'lazy';
  picture.appendChild(img);
  
  return picture;
}

export function getMetadata(name, doc = document) {
  // Mock metadata per Storybook
  const mockMetadata = {
    'nav': '/nav',
    'footer': '/footer',
    'theme': 'default'
  };
  return mockMetadata[name] || '';
}

export function loadCSS(href) {
  return new Promise((resolve) => {
    // Controlla se il CSS è già caricato
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) {
      resolve();
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = resolve; // Risolvi anche in caso di errore per non bloccare
    document.head.appendChild(link);
  });
}

export function loadScript(src, attrs = {}) {
  return new Promise((resolve, reject) => {
    // Controlla se lo script è già caricato
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    Object.entries(attrs).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function toClassName(name) {
  return typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    : '';
}

export function toCamelCase(name) {
  return toClassName(name).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        let value = '';
        if (col.querySelector('a')) {
          const as = [...col.querySelectorAll('a')];
          if (as.length === 1) {
            value = as[0].href;
          } else {
            value = as.map((a) => a.href);
          }
        } else if (col.querySelector('img')) {
          const imgs = [...col.querySelectorAll('img')];
          if (imgs.length === 1) {
            value = imgs[0].src;
          } else {
            value = imgs.map((img) => img.src);
          }
        } else if (col.querySelector('p')) {
          const ps = [...col.querySelectorAll('p')];
          if (ps.length === 1) {
            value = ps[0].textContent;
          } else {
            value = ps.map((p) => p.textContent);
          }
        } else value = row.children[1].textContent;
        config[name] = value;
      }
    }
  });
  return config;
}

// Mock di sampleRUM per evitare errori
export function sampleRUM(checkpoint, data) {
  // No-op in Storybook
}

// Funzioni di decorazione mock
export function decorateButtons(element) {
  element.querySelectorAll('a').forEach((a) => {
    a.title = a.title || a.textContent;
    if (a.href !== a.textContent) {
      const up = a.parentElement;
      const twoup = a.parentElement.parentElement;
      if (!a.querySelector('img')) {
        if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
          a.className = 'button';
          up.className = 'button-container';
        }
        if (up.childNodes.length === 1 && up.tagName === 'STRONG'
          && twoup.childNodes.length === 1 && twoup.tagName === 'P') {
          a.className = 'button primary';
          twoup.className = 'button-container';
        }
        if (up.childNodes.length === 1 && up.tagName === 'EM'
          && twoup.childNodes.length === 1 && twoup.tagName === 'P') {
          a.className = 'button secondary';
          twoup.className = 'button-container';
        }
      }
    }
  });
}

export function decorateIcons(element, prefix = '') {
  const icons = [...element.querySelectorAll('span.icon')];
  icons.forEach((span) => {
    const iconName = Array.from(span.classList).find((c) => c.startsWith('icon-'));
    if (iconName) {
      const img = document.createElement('img');
      img.dataset.iconName = iconName.substring(5);
      img.src = `/icons/${prefix}${iconName.substring(5)}.svg`;
      img.alt = '';
      img.loading = 'lazy';
      span.append(img);
    }
  });
}