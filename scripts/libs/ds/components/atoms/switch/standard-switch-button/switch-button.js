export const SWITCH_TYPES = {
  CHECKED: 'checked',
  UNCHECKED: 'unchecked',
};

/**
 * Extracts AEM instrumentation attributes
 */
export function extractInstrumentationAttributes(element) {
  const instrumentation = {};
  if (!element) return instrumentation;

  [...element.attributes].forEach((attr) => {
    if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
      instrumentation[attr.name] = attr.value;
    }
  });

  return instrumentation;
}

/**
 * Create Switch Element
 *
 * @param {string} type - "checked" | "unchecked"
 * @param {boolean} disabled
 * @param {Object} instrumentation
 * @returns {HTMLElement}
 */
export function createSwitch(type, disabled, instrumentation = {}) {
  const wrapper = document.createElement('label');
  wrapper.className = 'switch';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.role = 'switch';

  const uniqueId = `switch-${Math.random().toString(36).substring(2, 9)}`;
  input.id = uniqueId;
  input.name = 'switch-group';

  if (type === SWITCH_TYPES.CHECKED) {
    input.checked = true;
  }

  if (disabled) {
    input.classList.add('custom-disabled');
    wrapper.style.pointerEvents = 'none';
  }

  wrapper.appendChild(input);

  Object.entries(instrumentation).forEach(([attr, value]) => {
    wrapper.setAttribute(attr, value);
  });

  return wrapper;
}

/**
 * Reads UE rows and extracts values
 */
function extractValuesFromRows(rows) {
  const type = rows[0]?.textContent?.trim().toLowerCase()
    || SWITCH_TYPES.UNCHECKED;

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
