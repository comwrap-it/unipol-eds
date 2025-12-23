import { CHECKED_STATES } from "../../../../constants/index.js";
import { createSwitch } from "../../../../scripts/libs/ds/components/atoms/switch/standard-switch-button/switch-button.js";
import { extractInstrumentationAttributes } from "../../../../scripts/utils.js";

/**
 * Reads UE rows and extracts values
 */
function extractValuesFromRows(rows) {
  const type = rows[0]?.textContent?.trim().toLowerCase()
    || CHECKED_STATES.UNCHECKED;

  const disabled = rows[1]?.textContent?.trim().toLowerCase() === 'true';

  const instrumentation = extractInstrumentationAttributes(rows[0]);

  return {
    type,
    disabled,
    instrumentation,
  };
}

/**
 * Decorator for Switch
 *
 * @param {HTMLElement} block
 */
export default function decorateSwitch(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const { type, disabled, instrumentation } = extractValuesFromRows(rows);

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  let switchElement;

  if (hasInstrumentation) {
    switchElement = block.querySelector('label.switch');

    if (!switchElement) {
      switchElement = createSwitch(type, disabled, instrumentation);
      rows[0].textContent = '';
      rows[0].appendChild(switchElement);
    } else {
      switchElement.replaceWith(createSwitch(type, disabled, instrumentation));
    }
  } else {
    block.textContent = '';
    switchElement = createSwitch(type, disabled);
    block.appendChild(switchElement);
  }

  block.classList.add('switch-block');
}
