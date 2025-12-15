import { decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Extract logo data from the first 2 rows
 */
function extractLogoData(rows) {
  const logoImageRow = rows[0];
  const logoLinkRow = rows[1];

  let logoImg = null;
  let logoLinkUrl = '/';
  let logoImageCell = null;
  let logoLinkCell = null;

  if (logoImageRow) {
    const cols = Array.from(logoImageRow.children);
    [, logoImageCell] = cols;
    logoImg = logoImageCell?.querySelector('img');
  }

  if (logoLinkRow) {
    const cols = Array.from(logoLinkRow.children);
    [, logoLinkCell] = cols;
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
 */
function extractActionItems(rows) {
  const actionRows = rows.slice(2);
  const actions = [];

  for (let i = 0; i < actionRows.length; i += 2) {
    const iconRow = actionRows[i];
    const linkRow = actionRows[i + 1];

    if (iconRow && linkRow) {
      const iconCols = Array.from(iconRow.children);
      const linkCols = Array.from(linkRow.children);

      const fieldName1 = iconCols[0]?.textContent?.trim();
      const fieldName2 = linkCols[0]?.textContent?.trim();

      if (fieldName1 === 'icon' && fieldName2 === 'link') {
        const iconValue = iconCols[1]?.textContent?.trim().toLowerCase();
        const linkValue = linkCols[1]?.querySelector('a')?.href
                          || linkCols[1]?.textContent?.trim();

        if (iconValue && linkValue) {
          actions.push({
            icon: iconValue,
            link: linkValue,
            iconRow,
            linkRow,
            iconCell: iconCols[1],
            linkCell: linkCols[1],
          });
        }
      }
    }
  }

  return actions;
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
      toolsList.appendChild(li);

      // Move instrumentation
      moveInstrumentation(action.iconCell, buttonWrapper);
      moveInstrumentation(action.linkCell, a);

      // Hide original rows
      action.iconRow.style.display = 'none';
      action.linkRow.style.display = 'none';
    });

    toolsWrapper.appendChild(toolsList);
    block.appendChild(toolsWrapper);
  }

  // Decorate icons
  decorateIcons(block);
}
