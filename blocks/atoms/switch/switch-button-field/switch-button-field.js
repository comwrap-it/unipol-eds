import { createSwitchButtonField } from '@unipol-ds/components/atoms/switch/switch-button-field/switch-button-field.js';
import { CHECKED_STATES } from '../../../../constants/index.js';
import { extractInstrumentationAttributes } from '../../../../scripts/utils.js';

/**
 * Decorator
 *
 * @param {HTMLElement} block
 */
export default function decorateSwitchButtonField(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const type = rows[0]?.textContent?.trim().toLowerCase() || CHECKED_STATES.UNCHECKED;
  const disabled = rows[1]?.textContent?.trim().toLowerCase() === 'true';
  const label = rows[2]?.textContent?.trim() || '';
  const description = rows[3]?.textContent?.trim() || '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);

  block.textContent = '';

  const switchButtonField = createSwitchButtonField({
    type,
    disabled,
    label,
    description,
    instrumentation,
  });

  block.appendChild(switchButtonField);
  block.classList.add('switch-button-field-block');
}
