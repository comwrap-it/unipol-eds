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

  const firstContainer = block.children[1];
  const secondContainer = block.children[2];

  // Creating buttons
  const createButtonFromContainer = (container, defaultVariant) => {
    if (!container) return null;
    const rows = [...container.children];
    const values = extractValuesFromRows(rows);

    const button = createButton(
      values.text,
      values.href,
      values.openInNewTab,
      defaultVariant || values.variant,
      values.iconSize,
      values.leftIcon,
      values.rightIcon,
      values.instrumentation
    );

    if (container.hasAttribute('data-aue-resource')) {
      button.setAttribute('data-aue-resource', container.getAttribute('data-aue-resource'));
      const aueBehavior = container.getAttribute('data-aue-behavior');
      if (aueBehavior) button.setAttribute('data-aue-behavior', aueBehavior);
    }

    return button;
  };

  const buttons = [
    createButtonFromContainer(firstContainer, firstVariant),
    createButtonFromContainer(secondContainer, 'secondary')
  ].filter(Boolean);

  block.innerHTML = '';
  block.classList.add('button-group');
  block.style.display = 'flex';
  block.style.flexDirection = direction === 'vertical' ? 'column' : 'row';
  block.style.gap = 'var(--Space-200-8)';

  buttons.forEach(btn => block.appendChild(btn));

}
