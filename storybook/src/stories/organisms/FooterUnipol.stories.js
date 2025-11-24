import { html } from 'lit';

// Import Footer Unipol component
import { createTextLinkComponent } from '@blocks/text-list/text-list.js';
import { createFooterDownloadSection } from '@blocks/footer-download-section/footer-download-section.js';
import { createFooterPrivacyComponent } from '@blocks/footer-privacy-section/footer-privacy-section.js';
import { createFooterSocialComponent } from '@blocks/footer-social-section/footer-social-section.js';
import { createFooterCopyrightComponent } from '@blocks/footer-copyright-section/footer-copyright-section.js';


// CSS is loaded globally in preview-head.html

/**
 * Footer Unipol Component Story
 * 
 * Footer Unipol is an organism component that displays:
 * - Link columns (using text-list)
 * - Download section (brand, QR code, app stores)
 * - Privacy Section (privacy links)
 * - Social section (social icons)
 * - Copyright section (Copyright Text)
 *
 **/


 /* RIFARE
export default {
  title: 'Organisms/Footer Unipol',
  tags: ['autodocs'],
  render: (args) => {
    // Create link columns (text-list elements)
    const linkColumns = [];
    if (args.showLinkColumns) {
      for (let i = 0; i < args.numberOfColumns; i += 1) {
        const column = createTextListColumn(
          args[`column${i + 1}Title`] || `Column ${i + 1}`,
          args[`column${i + 1}Links`] || []
        );
        linkColumns.push(column);
      }
    }

    // Create download section
    let downloadSection = null;
    if (args.showDownloadSection) {
      downloadSection = createFooterDownloadSection({
        logo: args.logoUrl || 'https://via.placeholder.com/150x50?text=Unipol',
        brandText: args.brandText || 'Unipol Gruppo',
        brandHref: args.brandHref || '#',
        qrCode: args.qrCodeUrl || 'https://via.placeholder.com/100x100?text=QR',
        qrCodeText: args.qrCodeText || 'Scansiona il QR code',
        googlePlayImage: args.googlePlayImageUrl || 'https://via.placeholder.com/120x40?text=Google+Play',
        googlePlayHref: args.googlePlayHref || '#',
        appStoreImage: args.appStoreImageUrl || 'https://via.placeholder.com/120x40?text=App+Store',
        appStoreHref: args.appStoreHref || '#',
      });
    }

    // Create utility links
    let utilityLinks = null;
    if (args.showUtilityLinks) {
      utilityLinks = createFooterUtilityLinks(args.utilityLinks || [
        { label: 'Privacy', href: '#' },
        { label: 'Termini', href: '#' },
        { label: 'Cookie', href: '#' },
        { label: 'Note Legali', href: '#' },
      ]);
    }

    // Create bottom section
    let bottom = null;
    if (args.showBottom) {
      const socialIcons = args.showSocialIcons ? [
        {
          iconUrl: 'https://via.placeholder.com/24x24?text=F',
          href: '#',
          ariaLabel: 'Facebook',
        },
        {
          iconUrl: 'https://via.placeholder.com/24x24?text=I',
          href: '#',
          ariaLabel: 'Instagram',
        },
        {
          iconUrl: 'https://via.placeholder.com/24x24?text=L',
          href: '#',
          ariaLabel: 'LinkedIn',
        },
        {
          iconUrl: 'https://via.placeholder.com/24x24?text=Y',
          href: '#',
          ariaLabel: 'YouTube',
        },
      ] : [];

      bottom = createFooterBottom({
        copyrightText: args.copyrightText || '© 2024 Unipol. Tutti i diritti riservati.',
        socialIcons,
      });
    }

    // Create footer
    const footer = createFooterUnipol({
      linkColumns,
      downloadSection,
      utilityLinks,
      bottom,
    });

    return html`${footer}`;
  },
  argTypes: {
    showLinkColumns: {
      control: 'boolean',
      description: 'Show link columns section',
    },
    numberOfColumns: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Number of link columns',
    },
    showDownloadSection: {
      control: 'boolean',
      description: 'Show download section',
    },
    showUtilityLinks: {
      control: 'boolean',
      description: 'Show utility links',
    },
    showBottom: {
      control: 'boolean',
      description: 'Show bottom section',
    },
    showSocialIcons: {
      control: 'boolean',
      description: 'Show social icons in bottom section',
    },
    copyrightText: {
      control: 'text',
      description: 'Copyright text',
    },
    brandText: {
      control: 'text',
      description: 'Brand button text',
    },
    brandHref: {
      control: 'text',
      description: 'Brand button URL',
    },
    qrCodeText: {
      control: 'text',
      description: 'QR code description text',
    },
  },
  args: {
    showLinkColumns: true,
    numberOfColumns: 4,
    showDownloadSection: true,
    showUtilityLinks: true,
    showBottom: true,
    showSocialIcons: true,
    copyrightText: '© 2024 Unipol. Tutti i diritti riservati.',
    brandText: 'Unipol Gruppo',
    brandHref: '#',
    qrCodeText: 'Scansiona il QR code per scaricare l\'app',
  },
};


*/
/** RIFARE
 * Helper function to create a text-list column

function createTextListColumn(title, links) {
  const column = document.createElement('div');
  column.className = 'text-list';

  // Title
  if (title) {
    const titleElement = document.createElement('div');
    titleElement.className = 'text-list-title';
    titleElement.textContent = title;
    column.appendChild(titleElement);
  }

  // Links
  const linksContainer = document.createElement('ul');
  linksContainer.className = 'text-list-links';

  if (links && links.length > 0) {
    links.forEach((link) => {
      const linkElement = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = link.href || '#';
      anchor.textContent = link.text || 'Link';
      linkElement.appendChild(anchor);
      linksContainer.appendChild(linkElement);
    });
  } else {
    // Default links
    for (let i = 1; i <= 5; i += 1) {
      const linkElement = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = '#';
      anchor.textContent = `Link ${i}`;
      linkElement.appendChild(anchor);
      linksContainer.appendChild(linkElement);
    }
  }

  column.appendChild(linksContainer);
  return column;
}

// Complete Footer
export const Complete = {
  args: {
    showLinkColumns: true,
    numberOfColumns: 4,
    showDownloadSection: true,
    showUtilityLinks: true,
    showBottom: true,
    showSocialIcons: true,
  },
};

// Footer with Link Columns Only
export const LinkColumnsOnly = {
  args: {
    showLinkColumns: true,
    numberOfColumns: 4,
    showDownloadSection: false,
    showUtilityLinks: false,
    showBottom: false,
  },
};

// Footer with Download Section Only
export const DownloadSectionOnly = {
  args: {
    showLinkColumns: false,
    showDownloadSection: true,
    showUtilityLinks: false,
    showBottom: false,
  },
};

// Minimal Footer (Bottom Only)
export const Minimal = {
  args: {
    showLinkColumns: false,
    showDownloadSection: false,
    showUtilityLinks: false,
    showBottom: true,
    showSocialIcons: true,
  },
};

// Footer without Social Icons
export const NoSocialIcons = {
  args: {
    showLinkColumns: true,
    numberOfColumns: 4,
    showDownloadSection: true,
    showUtilityLinks: true,
    showBottom: true,
    showSocialIcons: false,
  },
};

 */
