import { createButton } from '@unipol-ds/components/atoms/buttons/standard-button/standard-button.js';

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
const extractValuesFromRows = (rows) => {
  const text = rows[0]?.textContent?.trim() || '';
  const variant = rows[1]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const href = rows[2]?.querySelector('a')?.href || rows[2]?.textContent?.trim() || '';
  const openInNewTab = rows[3]?.textContent?.trim() === 'true';
  const iconSize = rows[4]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
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
};

/**
 * Decorating button-group component
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  if (!block) return;

  const editorialVariant = block.children[0]?.textContent?.trim() || 'primary horizontal';
  const [firstVariant, direction] = editorialVariant.split(' ');

  block.children[0].remove();

  const firstButtonContainer = block.querySelector('[data-field-name="firstButtonConfig"]');
  const secondButtonContainer = block.querySelector('[data-field-name="secondButtonConfig"]');

  // Creating buttons
  const createButtonFromContainer = (container, defaultVariant) => {
    if (!container) return null;
    const rows = [...container.children];
    const values = extractValuesFromRows(rows);
    const variant = defaultVariant || values.variant;
    if (!values.text) return null;
    return createButton(
      values.text,
      values.href,
      values.openInNewTab,
      variant,
      values.iconSize,
      values.leftIcon,
      values.rightIcon,
      values.instrumentation
    );
  };

  const firstButton = createButtonFromContainer(firstButtonContainer, firstVariant);
  const secondButton = createButtonFromContainer(secondButtonContainer, 'secondary');

  block.innerHTML = '';
  block.classList.add('button-group');
  block.style.display = 'flex';
  block.style.flexDirection = direction === 'vertical' ? 'column' : 'row';
  block.style.gap = 'var(--Space-200-8)';

  if (firstButton) block.appendChild(firstButton);
  if (secondButton) block.appendChild(secondButton);
}
