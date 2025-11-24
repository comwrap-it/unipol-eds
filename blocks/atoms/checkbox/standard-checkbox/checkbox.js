/**
 * Checkbox - Utility Component
 */

export const CHECKBOX_TYPES = {
  UNCHECKED: 'unchecked',
  CHECKED: 'checked',
  INDETERMINATE: 'indeterminate',
};

/**
 * Create checkbox
 *
 * @param {string} typeStatus - "unchecked", "checked", "indeterminate"
 * @param {boolean} disabled - disables checkbox if true
 * @param {Object} instrumentation - AEM props
 * @returns {HTMLElement}
 */
export function createCheckbox(typeStatus, disabled, instrumentation = {}) {
  const wrapper = document.createElement('label');
  wrapper.className = 'checkbox';
  wrapper.setAttribute('role', 'checkbox');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = 'checkbox';

  if (typeStatus === CHECKBOX_TYPES.CHECKED) {
    checkbox.checked = true;
    checkbox.setAttribute('aria-checked', 'true');
  } else if (typeStatus === CHECKBOX_TYPES.INDETERMINATE) {
    checkbox.indeterminate = true;
    checkbox.setAttribute('aria-checked', 'mixed');
  } else {
    checkbox.setAttribute('aria-checked', 'false');
  }

  if (disabled) {
    checkbox.disabled = true;
    wrapper.classList.add('disabled');
    checkbox.setAttribute('aria-disabled', 'true');
  }

  Object.entries(instrumentation).forEach(([attr, value]) => {
    checkbox.setAttribute(attr, value);
  });

  const customSpan = document.createElement('span');
  customSpan.className = 'checkbox-custom';

  customSpan.tabIndex = 0;
  customSpan.setAttribute('role', 'checkbox');
  customSpan.setAttribute('aria-checked', checkbox.checked ? 'true' : 'false');

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      customSpan.classList.remove('minus-icon');
      customSpan.classList.add('checked-icon');
      checkbox.setAttribute('aria-checked', 'true');
    } else {
      customSpan.classList.remove('checked-icon', 'minus-icon');
      checkbox.setAttribute('aria-checked', 'false');
    }
  });

  if (typeStatus === CHECKBOX_TYPES.CHECKED) {
    customSpan.classList.add('checked-icon');
  } else if (typeStatus === CHECKBOX_TYPES.INDETERMINATE) {
    customSpan.classList.add('minus-icon');
  }

  wrapper.appendChild(checkbox);
  wrapper.appendChild(customSpan);

  return wrapper;
}

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
 * Reads UE rows and extracts values
 *
 * @param {Array<HTMLElement>} rows
 */
function extractValuesFromRows(rows) {
  const typeStatus = rows[0]?.textContent?.trim().toLowerCase()
    || CHECKBOX_TYPES.UNCHECKED;

  const disabled = rows[1]?.textContent?.trim().toLowerCase() === 'true';

  const instrumentation = extractInstrumentationAttributes(rows[0]);

  return {
    typeStatus,
    disabled,
    instrumentation,
  };
}

/**
 * Decorator for Checkbox
 *
 * @param {HTMLElement} block
 */
export default function decorateCheckbox(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const { typeStatus, disabled, instrumentation } = extractValuesFromRows(rows);

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  let checkboxElement;

  if (hasInstrumentation) {
    checkboxElement = block.querySelector('input.checkbox');

    if (!checkboxElement) {
      checkboxElement = createCheckbox(typeStatus, disabled, instrumentation);
      rows[0].textContent = '';
      rows[0].appendChild(checkboxElement);
    } else {
      checkboxElement.replaceWith(
        createCheckbox(typeStatus, disabled, instrumentation),
      );
    }
  } else {
    block.textContent = '';
    checkboxElement = createCheckbox(typeStatus, disabled);
    block.appendChild(checkboxElement);
  }

  block.classList.add('checkbox-block');
}
