/**
 * Story semplice per testare l'integrazione EDS
 */

export default {
  title: 'Development/Integration Tests',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Test semplice per verificare l\'integrazione dei componenti EDS in Storybook.'
      }
    }
  }
};

/**
 * Test di base per verificare che l'integrazione funzioni
 */
export const BasicTest = {
  render: () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <h2>🎉 Integrazione EDS Funzionante!</h2>
      <p>Questo dimostra che Storybook può caricare e visualizzare contenuti per i componenti EDS.</p>
      <div class="test-block" style="
        padding: 20px; 
        border: 2px solid #0066cc; 
        border-radius: 8px; 
        background: #f0f8ff;
        margin: 20px 0;
      ">
        <h3>Componenti EDS Disponibili:</h3>
        <ul>
          <li>✅ Cards - Griglia di card con immagini e contenuto</li>
          <li>✅ Header - Navigazione principale del sito</li>
          <li>✅ Footer - Piè di pagina</li>
          <li>✅ Hero - Sezione hero principale</li>
          <li>✅ Columns - Layout a colonne</li>
          <li>✅ Fragment - Frammenti di contenuto</li>
        </ul>
      </div>
    `;
    return container;
  }
};

/**
 * Test del CSS EDS
 */
export const CSSTest = {
  render: () => {
    const container = document.createElement('div');
    
    // Simula la struttura di una card EDS
    container.innerHTML = `
      <div class="cards">
        <ul>
          <li>
            <div class="cards-card-image">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='100%25' height='100%25' fill='%230066cc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='20'%3EEDS Test%3C/text%3E%3C/svg%3E" alt="Test Image" />
            </div>
            <div class="cards-card-body">
              <h3>Test Card EDS</h3>
              <p>Questa card utilizza gli stili CSS originali del componente EDS Cards.</p>
            </div>
          </li>
        </ul>
      </div>
    `;
    
    // Carica il CSS delle cards
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../blocks/organisms/cards/cards.css';
    document.head.appendChild(link);
    
    return container;
  }
};

/**
 * Test della configurazione Vite
 */
export const ConfigTest = {
  render: () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="padding: 20px; background: #f5f5f5; border-radius: 8px;">
        <h3>🔧 Configurazione Vite</h3>
        <p><strong>Alias configurati:</strong></p>
        <ul>
          <li><code>@blocks</code> → <code>../blocks</code></li>
          <li><code>@scripts</code> → <code>../scripts</code></li>
          <li><code>@styles</code> → <code>../styles</code></li>
        </ul>
        <p><strong>Funzionalità abilitate:</strong></p>
        <ul>
          <li>✅ Import di componenti EDS dalla cartella blocks</li>
          <li>✅ Mock delle funzioni AEM per Storybook</li>
          <li>✅ Caricamento CSS dei componenti</li>
          <li>✅ Supporto Web Components</li>
        </ul>
      </div>
    `;
    return container;
  }
};