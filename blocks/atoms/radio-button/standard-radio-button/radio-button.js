export const RADIO_TYPES = {
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
 * Create Radio Element
 *
 * @param {string} type - "checked" | "unchecked"
 * @param {boolean} disabled - whether radio is disabled
 * @param {Object} instrumentation - AEM props
 * @returns {HTMLElement}
 */
export function createRadio(type, disabled, instrumentation = {}) {
  const wrapper = document.createElement('label');
  wrapper.className = 'radio';

  const input = document.createElement('input');
  input.type = 'radio';

  const uniqueId = `radio-${Math.random().toString(36).substring(2, 9)}`;
  input.id = uniqueId;
  input.name = 'radio-group';

  if (type === RADIO_TYPES.CHECKED) {
    input.checked = true;
    input.classList.add('circle-icon');
  }

  input.addEventListener('change', () => {
    if (input.checked) {
      input.classList.add('circle-icon');
    } else {
      input.classList.remove('circle-icon');
    }
  });

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
 *
 * @param {Array<HTMLElement>} rows
 */
function extractValuesFromRows(rows) {
  const type = rows[0]?.textContent?.trim().toLowerCase()
    || RADIO_TYPES.UNCHECKED;

  const disabled = rows[1]?.textContent?.trim().toLowerCase() === 'true';

  const instrumentation = extractInstrumentationAttributes(rows[0]);

  return {
    type,
    disabled,
    instrumentation,
  };
}

/**
 * Decorator for Radio Button
 *
 * @param {HTMLElement} block
 */
export default function decorateRadio(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const { type, disabled, instrumentation } = extractValuesFromRows(rows);

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  let radioElement;

  if (hasInstrumentation) {
    radioElement = block.querySelector('label.radio');

    if (!radioElement) {
      radioElement = createRadio(type, disabled, instrumentation);
      rows[0].textContent = '';
      rows[0].appendChild(radioElement);
    } else {
      radioElement.replaceWith(createRadio(type, disabled, instrumentation));
    }
  } else {
    block.textContent = '';
    radioElement = createRadio(type, disabled);
    block.appendChild(radioElement);
  }

  block.classList.add('radio-block');
}
