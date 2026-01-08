import { createButton } from '@unipol-ds/components/atoms/buttons/standard-button/standard-button.js';
import { extractValuesFromRows } from '@unipol-ds/components/atoms/buttons/standard-button/standard-button.js';

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
