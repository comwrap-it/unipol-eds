import { createButton } from '@unipol-ds/components/atoms/buttons/standard-button/standard-button.js';
import { BUTTON_VARIANTS, BUTTON_ICON_SIZES } from '../../constants/index.js';
import { extractInstrumentationAttributes } from '../../scripts/utils.js';

/** Extract button properties from rows
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {Object} An object containing button properties
 *
 * Row mapping (based on _standard-button.json field order):
 * rows[0]: standardButtonLabel (text)
 * rows[1]: standardButtonVariant (select)
 * rows[2]: standardButtonHref (aem-content)
 * rows[3]: standardButtonOpenInNewTab (boolean)
 * rows[4]: standardButtonSize (select)
 * rows[5]: standardButtonLeftIcon (select)
 * rows[6]: standardButtonRightIcon (select)
 */
export function extractButtonValuesFromRows(rows) {
  const text = rows[0]?.textContent?.trim() || '';
  const variant = rows[1]?.textContent?.trim().toLowerCase()
    || BUTTON_VARIANTS.PRIMARY;
  const href = rows[2]?.querySelector('a')?.href
    || rows[2]?.textContent?.trim()
    || '';
  const openInNewTab = rows[3]?.textContent?.trim() === 'true';
  const iconSize = rows[4]?.textContent?.trim().toLowerCase()
    || BUTTON_ICON_SIZES.MEDIUM;
  const leftIcon = rows[5]?.textContent?.trim() || '';
  const rightIcon = rows[6]?.textContent?.trim() || '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);

  return {
    text,
    variant,
    iconSize,
    href,
    openInNewTab,
    leftIcon,
    rightIcon,
    instrumentation,
  };
}

export function createButtonGroup({
  editorialVariant = 'primary',
  direction = 'horizontal',
  firstButton,
  secondButton,
}) {
  const container = document.createElement('div');
  container.classList.add('button-group', `button-group-${direction}`);
  container.style.display = 'flex';

  const buttonsConfig = [
    { ...firstButton, forcedVariant: editorialVariant },
    { ...secondButton, forcedVariant: 'secondary' },
  ];

  buttonsConfig.forEach((config) => {
    const btn = createButton(
      config.text || 'Default',
      config.href || '',
      config.openInNewTab || false,
      config.forcedVariant || config.variant,
      config.iconSize || BUTTON_ICON_SIZES.MEDIUM,
      config.leftIcon || '',
      config.rightIcon || '',
      config.instrumentation || {},
    );

    container.appendChild(btn);
  });

  return container;
}

/**
 * Decorating button-group component
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  if (!block) return;

  const editorialVariantRaw = block.children[0]?.textContent?.trim()
    || 'primary horizontal';

  const [editorialVariant = 'primary', direction = 'horizontal'] = editorialVariantRaw.split(' ');

  const children = Array.from(block.children);

  const firstButtonRows = children.slice(1, 8);
  const secondButtonRows = children.slice(8);

  const firstButton = firstButtonRows.length
    ? extractButtonValuesFromRows(firstButtonRows)
    : {};

  const secondButton = secondButtonRows.length
    ? extractButtonValuesFromRows(secondButtonRows)
    : {};

  const buttonGroupEl = createButtonGroup({
    editorialVariant,
    direction,
    firstButton,
    secondButton,
  });

  block.innerHTML = '';
  block.appendChild(buttonGroupEl);
}
