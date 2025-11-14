import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  
  // Estrai i dati dai children del block (configurazione EDS)
  const socialLabel = children[0]?.textContent?.trim() || '';
  const facebookUrl = children[1]?.querySelector('a')?.href || '#';
  const instagramUrl = children[2]?.querySelector('a')?.href || '#';
  const linkedinUrl = children[3]?.querySelector('a')?.href || '#';
  const youtubeUrl = children[4]?.querySelector('a')?.href || '#';
  const privacyUrl = children[5]?.querySelector('a')?.href || '#';
  const cookieUrl = children[6]?.querySelector('a')?.href || '#';
  const ivassUrl = children[7]?.querySelector('a')?.href || '#';
  const paymentUrl = children[8]?.querySelector('a')?.href || '#';
  
  // Estrai link delle colonne con la nuova struttura container
  const column1Links = extractLinksFromContainer(children[9]);
  const column2Links = extractLinksFromContainer(children[10]);
  
  const companyInfo = children[11]?.innerHTML || '';
  const appTitle = children[12]?.innerHTML || 'Scarica o aggiorna l\'App<br>Unipol';
  const appStoreUrl = children[13]?.querySelector('a')?.href || '#';
  const googlePlayUrl = children[14]?.querySelector('a')?.href || '#';
  const qrCodeImage = children[15]?.querySelector('img')?.src || children[15]?.querySelector('a')?.href || '';
  const phoneImage = children[16]?.querySelector('img')?.src || children[16]?.querySelector('a')?.href || '';
  const description = children[17]?.innerHTML || '';

  // Funzione helper per estrarre link da un container multifield
  function extractLinksFromContainer(containerChild) {
    if (!containerChild) return [];
    const links = [];
    
    // Con la struttura container, ogni elemento del multifield è in un div separato
    const containerItems = containerChild.children;
    
    for (let i = 0; i < containerItems.length; i++) {
      const item = containerItems[i];
      
      // Cerca i nuovi nomi delle proprietà: linkText e linkUrl
      const textElement =
        item.querySelector('[data-aue-prop="linkText"], .linkText, .text') || item.children[0];
      const urlElement =
        item.querySelector('[data-aue-prop="linkUrl"], .linkUrl, a') || item.children[1];
      
      const text = textElement?.textContent?.trim() || '';
      // linkUrl può essere su href o come testo (fallback)
      const url = urlElement?.href || urlElement?.textContent?.trim() || '#';
      
      if (text) {
        links.push({ text, url });
      }
    }
    
    return links;
  }

  // Crea la struttura del footer
  block.innerHTML = '';
  block.className = 'unipol-footer block';
  block.setAttribute('data-mfe-name', 'tpdFooter');
  block.setAttribute('data-aue-label', 'Unipol Footer');
  block.setAttribute('data-aue-type', 'container');
  block.setAttribute('data-aue-model', 'unipol-footer');

  // Social strip
  const socialStrip = document.createElement('div');
  socialStrip.className = 'u-top';
  socialStrip.setAttribute('role', 'region');
  socialStrip.setAttribute('aria-label', 'Seguici');
  
  const socialWrap = document.createElement('div');
  socialWrap.className = 'u-wrap';
  
  const socialLabelEl = document.createElement('span');
  socialLabelEl.className = 'label';
  socialLabelEl.textContent = socialLabel;
  socialLabelEl.setAttribute('data-aue-label', 'Etichetta Social');
  socialLabelEl.setAttribute('data-aue-type', 'text');
  socialLabelEl.setAttribute('data-aue-prop', 'socialLabel');
  
  const socialNav = document.createElement('nav');
  socialNav.className = 'u-social';
  socialNav.setAttribute('aria-label', 'Social');
  
  // Social links
  const socialLinks = [
    { url: facebookUrl, label: 'Facebook', text: 'f', prop: 'facebookUrl' },
    { url: instagramUrl, label: 'Instagram', text: 'ig', prop: 'instagramUrl' },
    { url: linkedinUrl, label: 'LinkedIn', text: 'in', prop: 'linkedinUrl' },
    { url: youtubeUrl, label: 'YouTube', text: '▶', prop: 'youtubeUrl' }
  ];
  
  socialLinks.forEach(social => {
    const link = document.createElement('a');
    link.setAttribute('aria-label', social.label);
    link.href = social.url;
    link.title = social.label;
    link.textContent = social.text;
    link.setAttribute('data-aue-label', `URL ${social.label}`);
    link.setAttribute('data-aue-type', 'text');
    link.setAttribute('data-aue-prop', social.prop);
    socialNav.appendChild(link);
  });
  
  socialWrap.appendChild(socialLabelEl);
  socialWrap.appendChild(socialNav);
  socialStrip.appendChild(socialWrap);

  // Utility links
  const utilitySection = document.createElement('div');
  utilitySection.className = 'u-utility';
  utilitySection.setAttribute('role', 'navigation');
  utilitySection.setAttribute('aria-label', 'Utility');
  
  const utilityWrap = document.createElement('div');
  utilityWrap.className = 'u-wrap';
  
  const utilityGrid = document.createElement('div');
  utilityGrid.className = 'grid';
  
  const utilityLinks = [
    { url: privacyUrl, text: 'PRIVACY', prop: 'privacyUrl' },
    { url: cookieUrl, text: 'INFORMATIVA E GESTIONE COOKIE', prop: 'cookieUrl' },
    { url: ivassUrl, text: 'ACCESSO AREA RISERVATA IVASS 41/2018', prop: 'ivassUrl' },
    { url: paymentUrl, text: 'PAGAMENTO POLIZZE', prop: 'paymentUrl' }
  ];
  
  utilityLinks.forEach(util => {
    const link = document.createElement('a');
    link.href = util.url;
    link.textContent = util.text;
    link.setAttribute('data-aue-label', util.text);
    link.setAttribute('data-aue-type', 'text');
    link.setAttribute('data-aue-prop', util.prop);
    utilityGrid.appendChild(link);
  });
  
  utilityWrap.appendChild(utilityGrid);
  utilitySection.appendChild(utilityWrap);

  // Main content
  const mainSection = document.createElement('div');
  mainSection.className = 'u-main';
  
  const mainWrap = document.createElement('div');
  mainWrap.className = 'u-wrap';
  
  const columnsContainer = document.createElement('div');
  columnsContainer.className = 'u-columns';

  // Column 1
  const col1 = document.createElement('section');
  col1.className = 'u-col';
  
  const col1Title = document.createElement('h3');
  col1Title.innerHTML = ' ';
  
  const col1List = document.createElement('ul');
  col1List.className = 'u-links';
  col1List.setAttribute('data-aue-label', 'Link Colonna 1');
  col1List.setAttribute('data-aue-type', 'container');
  col1List.setAttribute('data-aue-prop', 'column1Links');

  column1Links.forEach((linkData, index) => {
    const li = document.createElement('li');
    // segna l'item del container
    li.setAttribute('data-aue-type', 'container-item');
    li.setAttribute('data-aue-model', 'unipol-footer');

    const link = document.createElement('a');
    link.href = linkData.url;
    link.setAttribute('data-aue-label', `Link ${index + 1} Colonna 1`);
    // mappa l'URL sull'attributo href
    link.setAttribute('data-aue-type', 'text');
    link.setAttribute('data-aue-prop', 'linkUrl');
    link.setAttribute('data-aue-attr', 'href');

    // testo del link esposto come proprietà distinta
    const textSpan = document.createElement('span');
    textSpan.textContent = linkData.text;
    textSpan.setAttribute('data-aue-type', 'text');
    textSpan.setAttribute('data-aue-prop', 'linkText');

    link.appendChild(textSpan);
    li.appendChild(link);
    col1List.appendChild(li);
  });
  
  col1.appendChild(col1Title);
  col1.appendChild(col1List);

  // Column 2
  const col2 = document.createElement('section');
  col2.className = 'u-col';
  
  const col2Title = document.createElement('h3');
  col2Title.innerHTML = ' ';
  
  const col2List = document.createElement('ul');
  col2List.className = 'u-links';
  col2List.setAttribute('data-aue-label', 'Link Colonna 2');
  col2List.setAttribute('data-aue-type', 'container');
  col2List.setAttribute('data-aue-prop', 'column2Links');

  column2Links.forEach((linkData, index) => {
    const li = document.createElement('li');
    li.setAttribute('data-aue-type', 'container-item');
    li.setAttribute('data-aue-model', 'unipol-footer');

    const link = document.createElement('a');
    link.href = linkData.url;
    link.setAttribute('data-aue-label', `Link ${index + 1} Colonna 2`);
    link.setAttribute('data-aue-type', 'text');
    link.setAttribute('data-aue-prop', 'linkUrl');
    link.setAttribute('data-aue-attr', 'href');

    const textSpan = document.createElement('span');
    textSpan.textContent = linkData.text;
    textSpan.setAttribute('data-aue-type', 'text');
    textSpan.setAttribute('data-aue-prop', 'linkText');

    link.appendChild(textSpan);
    li.appendChild(link);
    col2List.appendChild(li);
  });
  
  const companyInfoDiv = document.createElement('div');
  companyInfoDiv.className = 'u-datisocietari';
  companyInfoDiv.innerHTML = companyInfo;
  companyInfoDiv.setAttribute('data-aue-label', 'Informazioni Societarie');
  companyInfoDiv.setAttribute('data-aue-type', 'richtext');
  companyInfoDiv.setAttribute('data-aue-prop', 'companyInfo');
  companyInfoDiv.setAttribute('data-aue-model', 'unipol-footer');

  col2.appendChild(col2Title);
  col2.appendChild(col2List);
  col2.appendChild(companyInfoDiv);

  // App section - Struttura a due colonne come nel design originale
  const appSection = document.createElement('div');
  appSection.className = 'u-app-section';
  
  // Prima colonna: Titolo, stores e QR code
  const appCol = document.createElement('div');
  appCol.className = 'u-col u-app';
  appCol.setAttribute('aria-label', 'App Unipol');
  
  const appTitleEl = document.createElement('h3');
  appTitleEl.innerHTML = appTitle;
  appTitleEl.setAttribute('data-aue-label', 'Titolo App');
  appTitleEl.setAttribute('data-aue-type', 'richtext');
  appTitleEl.setAttribute('data-aue-prop', 'appTitle');
  appTitleEl.setAttribute('data-aue-model', 'unipol-footer');

  const storesDiv = document.createElement('div');
  storesDiv.className = 'u-stores';
  
  const appStoreLink = document.createElement('a');
  appStoreLink.className = 'u-store';
  appStoreLink.href = appStoreUrl;
  appStoreLink.setAttribute('aria-label', 'App Store iOS');
  appStoreLink.textContent = 'App Store';
  appStoreLink.setAttribute('data-aue-label', 'URL App Store');
  appStoreLink.setAttribute('data-aue-type', 'text');
  appStoreLink.setAttribute('data-aue-prop', 'appStoreUrl');
  
  const googlePlayLink = document.createElement('a');
  googlePlayLink.className = 'u-store';
  googlePlayLink.href = googlePlayUrl;
  googlePlayLink.setAttribute('aria-label', 'Google Play');
  googlePlayLink.textContent = 'Google Play';
  googlePlayLink.setAttribute('data-aue-label', 'URL Google Play');
  googlePlayLink.setAttribute('data-aue-type', 'text');
  googlePlayLink.setAttribute('data-aue-prop', 'googlePlayUrl');
  
  storesDiv.appendChild(appStoreLink);
  storesDiv.appendChild(googlePlayLink);
  
  const qrDiv = document.createElement('div');
  qrDiv.className = 'u-qr';
  
  const qrImg = document.createElement('img');
  qrImg.alt = 'QR App Unipol';
  qrImg.src = "qr src"; //CAMBIARE
  qrImg.setAttribute('data-aue-label', 'Immagine QR Code');
  qrImg.setAttribute('data-aue-type', 'reference');
  qrImg.setAttribute('data-aue-prop', 'qrCodeImage');
  qrImg.setAttribute('data-aue-model', 'unipol-footer');

  qrDiv.appendChild(qrImg);
  
  appCol.appendChild(appTitleEl);
  appCol.appendChild(storesDiv);
  appCol.appendChild(qrDiv);
  
  // Seconda colonna: Immagine del telefono
  const imageCol = document.createElement('div');
  imageCol.className = 'u-col u-image';
  
  const phoneImg = document.createElement('img');
  phoneImg.className = 'u-phone';
  phoneImg.alt = 'Anteprima app';
  phoneImg.src =  "Phone image"; //CAMBIARE
  phoneImg.setAttribute('data-aue-label', 'Immagine Telefono');
  phoneImg.setAttribute('data-aue-type', 'reference');
  phoneImg.setAttribute('data-aue-prop', 'phoneImage');
  phoneImg.setAttribute('data-aue-model', 'unipol-footer');

  imageCol.appendChild(phoneImg);
  
  // Assembla le due colonne dell'app
  appSection.appendChild(appCol);
  appSection.appendChild(imageCol);

  columnsContainer.appendChild(col1);
  columnsContainer.appendChild(col2);
  columnsContainer.appendChild(appSection);
  
  mainWrap.appendChild(columnsContainer);
  mainSection.appendChild(mainWrap);

  // Bottom description
  const bottomSection = document.createElement('div');
  bottomSection.className = 'u-bottom';
  
  const bottomWrap = document.createElement('div');
  bottomWrap.className = 'u-wrap';
  
  const descriptionP = document.createElement('p');
  descriptionP.className = 'u-desc';
  descriptionP.innerHTML = description;
  descriptionP.setAttribute('data-aue-label', 'Descrizione Azienda');
  descriptionP.setAttribute('data-aue-type', 'richtext');
  descriptionP.setAttribute('data-aue-prop', 'description');
  descriptionP.setAttribute('data-aue-model', 'unipol-footer');

  bottomWrap.appendChild(descriptionP);
  bottomSection.appendChild(bottomWrap);

  // Assembla tutto
  block.appendChild(socialStrip);
  block.appendChild(utilitySection);
  block.appendChild(mainSection);
  block.appendChild(bottomSection);

}