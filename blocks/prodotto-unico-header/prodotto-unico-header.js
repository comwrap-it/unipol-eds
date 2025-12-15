import { decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Extract logo data from the first 2 rows
 * Rows contain only values (no label column) when using model
 */
function extractLogoData(rows) {
  const logoImageRow = rows[0];
  const logoLinkRow = rows[1];

  let logoImg = null;
  let logoLinkUrl = '/';
  let logoImageCell = null;
  let logoLinkCell = null;

  if (logoImageRow) {
    logoImageCell = logoImageRow.children[0];
    logoImg = logoImageCell?.querySelector('img');
  }

  if (logoLinkRow) {
    logoLinkCell = logoLinkRow.children[0];
    logoLinkUrl = logoLinkCell?.querySelector('a')?.href
                  || logoLinkCell?.textContent?.trim()
                  || '/';
  }

  return {
    logoImg,
    logoLinkUrl,
    logoImageRow,
    logoLinkRow,
    logoImageCell,
    logoLinkCell,
  };
}

/**
 * Extract action items from rows (starting from row 2)
 * Each row contains all fields as columns: [icon | link]
 */
function extractActionItems(rows) {
  const actionRows = rows.slice(2);
  
  return actionRows.map((row) => {
    const iconCell = row.children[0];
    const linkCell = row.children[1];

    const iconValue = iconCell?.textContent?.trim().toLowerCase() || '';
    const linkValue = linkCell?.querySelector('a')?.href
                      || linkCell?.textContent?.trim()
                      || '#';

    return {
      icon: iconValue,
      link: linkValue,
      row,
      iconCell,
      linkCell,
    };
  }).filter((action) => action.icon);
}

/**
 * Decorates the Prodotto Unico Header block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  if (!block) return;

  const rows = Array.from(block.children);
  if (rows.length < 2) return;

  // Extract data
  const logoData = extractLogoData(rows);
  const actions = extractActionItems(rows);

  // Build logo
  if (logoData.logoImg && logoData.logoImageRow) {
    logoData.logoImageRow.className = 'header-brand';
    logoData.logoImageRow.innerHTML = '';

    const anchor = document.createElement('a');
    anchor.href = logoData.logoLinkUrl;
    anchor.title = 'Vai alla Home';

    logoData.logoImg.setAttribute('alt', 'Unipol');
    logoData.logoImg.loading = 'eager';
    logoData.logoImg.fetchPriority = 'high';

    anchor.appendChild(logoData.logoImg);
    logoData.logoImageRow.appendChild(anchor);

    // Move instrumentation
    if (logoData.logoImageCell) {
      moveInstrumentation(logoData.logoImageCell, anchor);
    }
  }

  // Hide logoLink row
  if (logoData.logoLinkRow) {
    logoData.logoLinkRow.style.display = 'none';
  }

  // Build actions
  if (actions.length > 0) {
    const toolsWrapper = document.createElement('div');
    toolsWrapper.className = 'header-tools';
    const toolsList = document.createElement('ul');

    actions.forEach((action) => {
      const li = document.createElement('li');
      const buttonWrapper = document.createElement('div');
      buttonWrapper.className = `header-button header-button-${action.icon}`;

      const a = document.createElement('a');
      a.href = action.link;
      a.className = 'tool-btn';
      a.setAttribute('aria-label', action.icon);

      const iconSpan = document.createElement('span');
      iconSpan.className = `icon icon-${action.icon}`;
      a.appendChild(iconSpan);

      buttonWrapper.appendChild(a);
      li.appendChild(buttonWrapper);

      // Move instrumentation
      moveInstrumentation(action.iconCell, buttonWrapper);
      moveInstrumentation(action.linkCell, a);

      toolsList.appendChild(li);
    });

    toolsWrapper.appendChild(toolsList);
    block.appendChild(toolsWrapper);

    // Hide original action rows
    actions.forEach((action) => {
      action.row.style.display = 'none';
    });
  }

  // Decorate icons
  decorateIcons(block);
}
