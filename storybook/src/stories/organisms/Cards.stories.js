/**
 * Cards Organism Stories - Atomic Design System
 * Collection of Card molecules arranged in a responsive grid
 */
import cardsDecorate from '@blocks/organisms/cards/cards.js';

// Importa i CSS necessari
import '@blocks/organisms/cards/cards.css';
import '@blocks/molecules/card/card.css';
import '@blocks/atoms/buttons/button/button.css';

/**
 * Funzione helper per creare contenuto di esempio per le cards
 */
function createSampleCards(numberOfCards = 3) {
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < numberOfCards; i++) {
    const cardDiv = document.createElement('div');
    cardDiv.innerHTML = `
      <div>
        <picture>
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23${['007acc', 'ff6b35', '00d4aa', '6f42c1', 'fd7e14', 'e83e8c'][i % 6]}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='16'%3ECard ${i + 1}%3C/text%3E%3C/svg%3E" alt="Card ${i + 1}" />
        </picture>
      </div>
      <div>
        <h3>Card Originale ${i + 1}</h3>
        <p>Questa card utilizza il componente EDS originale dalla cartella blocks. Qualsiasi modifica al file cards.js originale si riflette automaticamente qui.</p>
        <a href="#" class="button">Scopri di più</a>
      </div>
    `;
    fragment.appendChild(cardDiv);
  }
  
  return fragment;
}

export default {
  title: 'Organisms/Cards',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Cards Organism - Una collezione di molecole Card disposte in una griglia responsiva. Ogni card contiene un atomo Button integrato seguendo i principi dell\'Atomic Design.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'highlight'],
      description: 'Variante del componente cards'
    },
    columns: {
      control: { type: 'range', min: 1, max: 4, step: 1 },
      description: 'Numero di colonne nella griglia'
    }
  }
};

/**
 * Story di default per le Cards
 */
export const Default = {
  args: {
    variant: 'default',
    columns: 3
  },
  render: (args) => {
    // Crea il contenitore del blocco
    const block = document.createElement('div');
    block.className = 'cards';
    
    // Aggiungi variante se specificata
    if (args.variant && args.variant !== 'default') {
      block.classList.add(args.variant);
    }
    
    // Aggiungi contenuto di esempio
    const sampleContent = createSampleCards(args.columns || 3);
    block.appendChild(sampleContent);
    
    // Applica stili per il numero di colonne
    if (args.columns) {
      block.style.setProperty('--cards-columns', args.columns);
    }
    
    // Applica la decorazione EDS
    cardsDecorate(block);
    
    return block;
  }
};

/**
 * Story con contenuto personalizzato
 */
export const CustomContent = {
  args: {
    variant: 'default'
  },
  render: (args) => {
    const block = document.createElement('div');
    block.className = 'cards';
    
    if (args.variant && args.variant !== 'default') {
      block.classList.add(args.variant);
    }
    
    // Contenuto personalizzato
    const customCards = [
      {
        image: 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=Prodotto+A',
        title: 'Prodotto A',
        description: 'Descrizione dettagliata del prodotto A con caratteristiche specifiche.',
        link: '#prodotto-a'
      },
      {
        image: 'https://via.placeholder.com/400x300/4ecdc4/ffffff?text=Servizio+B',
        title: 'Servizio B',
        description: 'Informazioni complete sul servizio B e i suoi vantaggi.',
        link: '#servizio-b'
      }
    ];
    
    const fragment = document.createDocumentFragment();
    customCards.forEach(card => {
      const row = document.createElement('div');
      
      // Immagine
      const imageCol = document.createElement('div');
      const picture = document.createElement('picture');
      const img = document.createElement('img');
      img.src = card.image;
      img.alt = card.title;
      picture.appendChild(img);
      imageCol.appendChild(picture);
      row.appendChild(imageCol);
      
      // Contenuto
      const contentCol = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = card.title;
      const description = document.createElement('p');
      description.textContent = card.description;
      
      if (card.link) {
        const link = document.createElement('a');
        link.href = card.link;
        link.textContent = 'Scopri di più';
        link.className = 'button';
        contentCol.appendChild(title);
        contentCol.appendChild(description);
        contentCol.appendChild(link);
      } else {
        contentCol.appendChild(title);
        contentCol.appendChild(description);
      }
      
      row.appendChild(contentCol);
      fragment.appendChild(row);
    });
    
    block.appendChild(fragment);
    cardsDecorate(block);
    
    return block;
  }
};

/**
 * Story con una sola card
 */
export const SingleCard = {
  render: () => {
    const block = document.createElement('div');
    block.className = 'cards';
    
    const row = document.createElement('div');
    
    // Immagine
    const imageCol = document.createElement('div');
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = 'https://via.placeholder.com/600x400/845ec2/ffffff?text=Card+Singola';
    img.alt = 'Card Singola';
    picture.appendChild(img);
    imageCol.appendChild(picture);
    row.appendChild(imageCol);
    
    // Contenuto
    const contentCol = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = 'Card Singola';
    const description = document.createElement('p');
    description.textContent = 'Esempio di una singola card con contenuto esteso e descrizione più dettagliata.';
    contentCol.appendChild(title);
    contentCol.appendChild(description);
    row.appendChild(contentCol);
    
    block.appendChild(row);
    cardsDecorate(block);
    
    return block;
  }
};

/**
 * Story senza immagini
 */
export const TextOnly = {
  render: () => {
    const block = document.createElement('div');
    block.className = 'cards';
    
    const textCards = [
      {
        title: 'Solo Testo 1',
        description: 'Questa card contiene solo testo senza immagini.'
      },
      {
        title: 'Solo Testo 2',
        description: 'Un\'altra card con contenuto puramente testuale.'
      },
      {
        title: 'Solo Testo 3',
        description: 'Terza card dimostrativa senza elementi grafici.'
      }
    ];
    
    const fragment = document.createDocumentFragment();
    textCards.forEach(card => {
      const row = document.createElement('div');
      
      const contentCol = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = card.title;
      const description = document.createElement('p');
      description.textContent = card.description;
      contentCol.appendChild(title);
      contentCol.appendChild(description);
      row.appendChild(contentCol);
      
      fragment.appendChild(row);
    });
    
    block.appendChild(fragment);
    cardsDecorate(block);
    
    return block;
  }
};