import { html } from 'lit';

// Import Number Block component
import {
  createNumberBlock,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from '@blocks/number-block/number-block.js';

// CSS is loaded globally in preview-head.html

/**
 * Number Block Component Story
 *
 * Number Block is an organism component that displays up to 3 statistical items:
 * - A numeric value (title) - max 7 characters
 * - A description text - max 40 characters
 *
 * Perfect for showcasing key metrics, statistics, or highlights.
 */
export default {
  title: 'Organisms/Number Block',
  tags: ['autodocs'],
  render: (args) => {
    const items = [];

    // Build items array from args
    if (args.showItem1) {
      items.push({
        title: args.item1Title,
        description: args.item1Description,
      });
    }

    if (args.showItem2) {
      items.push({
        title: args.item2Title,
        description: args.item2Description,
      });
    }

    if (args.showItem3) {
      items.push({
        title: args.item3Title,
        description: args.item3Description,
      });
    }

    const element = createNumberBlock(items);
    return html`${element}`;
  },
  argTypes: {
    // Item 1
    showItem1: {
      control: 'boolean',
      description: 'Show first number item',
      table: {
        category: 'Item 1',
      },
    },
    item1Title: {
      control: 'text',
      description: `Numeric value (max ${MAX_TITLE_LENGTH} characters)`,
      if: { arg: 'showItem1', eq: true },
      table: {
        category: 'Item 1',
      },
    },
    item1Description: {
      control: 'text',
      description: `Description (max ${MAX_DESCRIPTION_LENGTH} characters)`,
      if: { arg: 'showItem1', eq: true },
      table: {
        category: 'Item 1',
      },
    },

    // Item 2
    showItem2: {
      control: 'boolean',
      description: 'Show second number item',
      table: {
        category: 'Item 2',
      },
    },
    item2Title: {
      control: 'text',
      description: `Numeric value (max ${MAX_TITLE_LENGTH} characters)`,
      if: { arg: 'showItem2', eq: true },
      table: {
        category: 'Item 2',
      },
    },
    item2Description: {
      control: 'text',
      description: `Description (max ${MAX_DESCRIPTION_LENGTH} characters)`,
      if: { arg: 'showItem2', eq: true },
      table: {
        category: 'Item 2',
      },
    },

    // Item 3
    showItem3: {
      control: 'boolean',
      description: 'Show third number item',
      table: {
        category: 'Item 3',
      },
    },
    item3Title: {
      control: 'text',
      description: `Numeric value (max ${MAX_TITLE_LENGTH} characters)`,
      if: { arg: 'showItem3', eq: true },
      table: {
        category: 'Item 3',
      },
    },
    item3Description: {
      control: 'text',
      description: `Description (max ${MAX_DESCRIPTION_LENGTH} characters)`,
      if: { arg: 'showItem3', eq: true },
      table: {
        category: 'Item 3',
      },
    },
  },
  args: {
    showItem1: true,
    item1Title: '1.500+',
    item1Description: 'Clienti soddisfatti',
    showItem2: true,
    item2Title: '99,9%',
    item2Description: 'Tasso di soddisfazione',
    showItem3: true,
    item3Title: '10+',
    item3Description: 'Anni di esperienza',
  },
};

// ========== THREE ITEMS STORIES ==========

/**
 * Default number block with 3 items
 */
export const ThreeItems = {
  args: {
    showItem1: true,
    item1Title: '1.500+',
    item1Description: 'Clienti soddisfatti',
    showItem2: true,
    item2Title: '99,9%',
    item2Description: 'Tasso di soddisfazione',
    showItem3: true,
    item3Title: '10+',
    item3Description: 'Anni di esperienza',
  },
  parameters: {
    docs: {
      description: {
        story: 'Number block with three statistical items, showcasing key metrics.',
      },
    },
  },
};

/**
 * Business metrics
 */
export const BusinessMetrics = {
  args: {
    showItem1: true,
    item1Title: '€50M',
    item1Description: 'Capitale gestito',
    showItem2: true,
    item2Title: '5.000',
    item2Description: 'Polizze attive',
    showItem3: true,
    item3Title: '24/7',
    item3Description: 'Assistenza clienti',
  },
  parameters: {
    docs: {
      description: {
        story: 'Business-focused metrics with monetary and service values.',
      },
    },
  },
};

/**
 * Growth statistics
 */
export const GrowthStats = {
  args: {
    showItem1: true,
    item1Title: '+150%',
    item1Description: 'Crescita annuale',
    showItem2: true,
    item2Title: '200+',
    item2Description: 'Partner commerciali',
    showItem3: true,
    item3Title: '50+',
    item3Description: 'Premi e riconoscimenti',
  },
  parameters: {
    docs: {
      description: {
        story: 'Growth and achievement statistics with percentage values.',
      },
    },
  },
};

// ========== TWO ITEMS STORIES ==========

/**
 * Number block with 2 items
 */
export const TwoItems = {
  args: {
    showItem1: true,
    item1Title: '25+',
    item1Description: 'Anni sul mercato',
    showItem2: true,
    item2Title: '100%',
    item2Description: 'Made in Italy',
    showItem3: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Number block with only two items for simpler layouts.',
      },
    },
  },
};

/**
 * Key features
 */
export const KeyFeatures = {
  args: {
    showItem1: true,
    item1Title: '0€',
    item1Description: 'Costo di attivazione',
    showItem2: true,
    item2Title: '1 min',
    item2Description: 'Tempo di preventivo',
    showItem3: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Highlighting key features with emphasis on simplicity.',
      },
    },
  },
};

// ========== SINGLE ITEM STORIES ==========

/**
 * Number block with single item
 */
export const SingleItem = {
  args: {
    showItem1: true,
    item1Title: '1°',
    item1Description: 'In Italia per qualità',
    showItem2: false,
    showItem3: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Number block with a single highlighted statistic.',
      },
    },
  },
};

// ========== SPECIAL FORMATTING STORIES ==========

/**
 * Percentages
 */
export const Percentages = {
  args: {
    showItem1: true,
    item1Title: '99%',
    item1Description: 'Clienti soddisfatti',
    showItem2: true,
    item2Title: '85%',
    item2Description: 'Raccomandazioni',
    showItem3: true,
    item3Title: '95%',
    item3Description: 'Rinnovi polizze',
  },
  parameters: {
    docs: {
      description: {
        story: 'Statistical percentages formatted consistently.',
      },
    },
  },
};

/**
 * Large numbers
 */
export const LargeNumbers = {
  args: {
    showItem1: true,
    item1Title: '10.000',
    item1Description: 'Clienti attivi',
    showItem2: true,
    item2Title: '50.000',
    item2Description: 'Sinistri gestiti',
    showItem3: true,
    item3Title: '100M€',
    item3Description: 'Risarcimenti erogati',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large numbers with thousand separators and abbreviations.',
      },
    },
  },
};

/**
 * Time periods
 */
export const TimePeriods = {
  args: {
    showItem1: true,
    item1Title: '30 gg',
    item1Description: 'Prova gratuita',
    showItem2: true,
    item2Title: '12h',
    item2Description: 'Tempo risposta',
    showItem3: true,
    item3Title: '365',
    item3Description: 'Giorni copertura',
  },
  parameters: {
    docs: {
      description: {
        story: 'Time-based values with different formats.',
      },
    },
  },
};

// ========== REAL-WORLD EXAMPLES ==========

/**
 * Landing page hero stats
 */
export const HeroStats = {
  render: () => html`
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 4rem 2rem; border-radius: 8px;">
      <div style="max-width: 900px; margin: 0 auto; color: white;">
        <h2 style="text-align: center; margin-bottom: 3rem; font-size: 2.5rem;">La nostra storia</h2>
        ${createNumberBlock([
          { title: '2010', description: 'Anno di fondazione' },
          { title: '15.000', description: 'Clienti in Italia' },
          { title: '98%', description: 'Clienti soddisfatti' },
        ])}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: Hero section with company statistics.',
      },
    },
  },
};

/**
 * Product features section
 */
export const ProductFeatures = {
  render: () => html`
    <div style="padding: 3rem 2rem; background: #f8f9fa;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 2rem;">Perché sceglierci</h2>
        ${createNumberBlock([
          { title: '0€', description: 'Nessun costo nascosto' },
          { title: '24/7', description: 'Supporto sempre attivo' },
          { title: '100%', description: 'Garanzia soddisfatti' },
        ])}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: Product features highlight section.',
      },
    },
  },
};

/**
 * Comparison with competitors
 */
export const Comparison = {
  render: () => html`
    <div style="padding: 2rem;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h3 style="text-align: center; margin-bottom: 1.5rem;">Confronto con la concorrenza</h3>
        ${createNumberBlock([
          { title: '-30%', description: 'Risparmio medio' },
          { title: '3x', description: 'Più veloce' },
        ])}
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: Competitive comparison metrics.',
      },
    },
  },
};

// ========== CHARACTER LIMIT EXAMPLES ==========

/**
 * Maximum character lengths
 */
export const MaxCharacters = {
  args: {
    showItem1: true,
    item1Title: '€50.000',  // 7 characters (at limit)
    item1Description: 'Clienti soddisfatti del nostro serv',  // 40 chars (at limit)
    showItem2: true,
    item2Title: '10 anni',  // 7 characters (at limit)
    item2Description: 'Di esperienza consolidata nel settore',  // 40 chars (at limit)
    showItem3: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing maximum character limits (7 for title, 40 for description). Text will be truncated if exceeded.',
      },
    },
  },
};

/**
 * Truncation warning
 */
export const TruncationExample = {
  args: {
    showItem1: true,
    item1Title: '1.234.567',  // 9 characters - will be truncated to "1.234.5"
    item1Description: 'This is a very long description that exceeds forty characters limit',
    showItem2: false,
    showItem3: false,
  },
  parameters: {
    docs: {
      description: {
        story: '⚠️ Example with text exceeding limits. Title will be truncated to 7 characters, description to 40. Check browser console for warnings.',
      },
    },
  },
};

