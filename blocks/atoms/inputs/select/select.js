/**
 * @typedef {Object} OptionConfig
 * @property {string} labelText - Required label displayed as the option title.
 * @property {string} [descriptionText] - Optional supporting text under the title.
 * @property {boolean} [shouldShowCheckbox=false] - If true, renders a checkbox for the option.
 * @property {"unchecked"|"checked"|"indeterminate"} [typeStatus="unchecked"] - checkbox state
 * @property {boolean} [disabled=false] - Disables the checkbox when true.
 * @property {Record<string, string>} [instrumentation={}] - Optional attributes from editor.
 */

import createOptionsList from '../../options/options-list/options-list.js';

/**
 * Create a textarea element with styling
 * @param {string} label - Textarea label (required)
 * @param {OptionConfig[]} optionsArray - Ordered list of options to render. (required)
 * @param {(value: string[]) => void} onChange - Callback to handle value changes (required)
 * @param {string} hintText - Hint text (optional)
 * @param {string} hintIcon - Hint icon class name (optional)
 * @param {boolean} isMultiSelect - Whether multiple options can be selected (optional)
 * @param {string} hiddenInputName - Name attribute for hidden input fallback to label (optional)
 * @param {Object} instrumentation - Instrumentation attributes (optional)
 * @returns {HTMLElement} The textarea element
 */
export default function createSelect(
  label,
  optionsArray,
  onChange,
  hintText = '',
  hintIcon = '',
  isMultiSelect = false,
  instrumentation = {},
) {
  let selectedOptions = [];
  let activeIndex = null;

  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'input-main-wrapper';
  // input container is a relative element to position icon and label absolutely within it
  const inputContainer = document.createElement('div');
  inputContainer.className = 'input-container';
  mainWrapper.appendChild(inputContainer);

  const select = document.createElement('button');
  select.className = 'input select';
  select.type = 'button';
  const id = `select-${crypto.randomUUID()}`;
  select.id = id;
  select.setAttribute('role', 'combobox');
  select.setAttribute('aria-haspopup', 'listbox');
  select.setAttribute('aria-expanded', 'false');
  select.setAttribute('aria-controls', `${id}-options`);
  select.setAttribute('aria-autocomplete', 'list');
  inputContainer.appendChild(select);

  const valueSpan = document.createElement('span');
  valueSpan.className = 'select-value';
  inputContainer.appendChild(valueSpan);

  const labelElem = document.createElement('label');
  labelElem.htmlFor = id;
  labelElem.textContent = label;
  inputContainer.appendChild(labelElem);

  const dropdownIcon = document.createElement('span');
  dropdownIcon.className = 'icon icon-small dropdown-icon';
  inputContainer.appendChild(dropdownIcon);

  const openList = () => {
    select.setAttribute('aria-expanded', 'true');
    optionsList.classList.add('options-list-visible');
    // focusAlreadySelectedOption();
  };

  const closeList = () => {
    select.setAttribute('aria-expanded', 'false');
    optionsList.classList.remove('options-list-visible');
    activeIndex = null;
  };

  const toggleList = () => {
    const expanded = select.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeList();
    } else {
      openList();
    }
  };

  const updateFLoatingLabel = () => {
    if (selectedOptions.length === 0) {
      inputContainer.classList.remove('has-value');
    } else {
      inputContainer.classList.add('has-value');
    }
  };

  const findLabelForValue = (value) => {
    const found = optionsArray.find((o) => o.optionValue === value);
    return found?.labelText || value;
  };

  const updateValueSpan = () => {
    valueSpan.textContent = isMultiSelect
      ? selectedOptions.map((value) => findLabelForValue(value)).join(', ')
      : findLabelForValue(selectedOptions[0]) || '';
  };

  const optionsList = createOptionsList(
    optionsArray,
    setSelectedOption,
    isMultiSelect,
  );
  mainWrapper.appendChild(optionsList);

  const setSelectedOption = (event) => {
    const optionValue = event.detail.value;
    if (isMultiSelect) {
      if (selectedOptions.includes(optionValue)) {
        selectedOptions = selectedOptions.filter((val) => val !== optionValue);
      } else {
        selectedOptions.push(optionValue);
      }
    } else {
      selectedOptions = [optionValue];
      closeList();
    }
    updateFLoatingLabel();
    updateValueSpan();
    onChange(selectedOptions);
  };

  if (hintText) {
    const helperContainer = document.createElement('div');
    helperContainer.className = 'helper-container';
    if (hintIcon) {
      const hintIconSpan = document.createElement('span');
      hintIconSpan.className = `icon icon-small ${hintIcon}`;
      helperContainer.appendChild(hintIconSpan);
    }
    const hintP = document.createElement('p');
    hintP.className = 'hint-text';
    hintP.textContent = hintText;
    helperContainer.appendChild(hintP);
    mainWrapper.appendChild(helperContainer);
  }

  function getOptionButtons() {
    return Array.from(optionsList.querySelectorAll('[role="option"]'));
  }

  function focusOptionAt(index) {
    const buttons = getOptionButtons();
    if (!buttons.length) return;
    const max = buttons.length - 1;
    const clamped = Math.max(0, Math.min(index, max));
    activeIndex = clamped;
    buttons[clamped].focus();
  }

  function moveFocus(delta) {
    const buttons = getOptionButtons();
    if (!buttons.length) return;
    if (activeIndex === null) {
      // First movement initializes focus to start (for ArrowDown) or end (for ArrowUp).
      activeIndex = delta < 0 ? buttons.length - 1 : 0;
      buttons[activeIndex].focus();
      return;
    }
    const max = buttons.length - 1;
    const next = Math.max(0, Math.min(activeIndex + delta, max));
    activeIndex = next;
    buttons[next].focus();
  }

  // Restore instrumentation to button element
  Object.entries(instrumentation).forEach(([name, value]) => {
    mainWrapper.setAttribute(name, value);
  });

  const handleOutsideClick = (e) => {
    if (select.getAttribute('aria-expanded') !== 'true') return;
    // If click is outside this select's wrapper, close
    if (!mainWrapper.contains(e.target)) {
      closeList();
    }
  };

  document.addEventListener('mousedown', handleOutsideClick);

  select.addEventListener('click', () => {
    toggleList();
  });

  valueSpan.addEventListener('click', () => {
    toggleList();
  });

  // Keyboard on the select button
  select.addEventListener('keydown', (e) => {
    const expanded = select.getAttribute('aria-expanded') === 'true';

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleList();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!expanded) {
        openList();
        focusOptionAt(0);
      } else {
        moveFocus(1);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!expanded) {
        openList();
        focusOptionAt(getOptionButtons().length - 1);
      } else {
        moveFocus(-1);
      }
    }

    if (e.key === 'Escape') {
      if (expanded) {
        e.preventDefault();
        closeList();
        select.focus();
      }
    }
  });

  // Keyboard on options: keep arrow navigation working once focus is in the list
  optionsList.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveFocus(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveFocus(-1);
    } else if (e.key === 'Escape') {
      const expanded = select.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        e.preventDefault();
        closeList();
        select.focus();
      }
    }
  });

  return mainWrapper;
}
