/**
 * @typedef {Object} OptionConfig
 * @property {string} labelText
 * @property {string} optionValue
 * @property {string} [descriptionText]
 * @property {boolean} [shouldShowCheckbox=false]
 * @property {"unchecked"|"checked"|"indeterminate"} [typeStatus="unchecked"]
 * @property {boolean} [disabled=false]
 * @property {Record<string,string>} [instrumentation={}]
 */

import { createOptionsList } from '../../options/options-list/options-list.js';

/**
 * @param {string} label
 * @param {OptionConfig[]} optionsArray
 * @param {(values: string[]) => void} onChange
 * @param {string} [hintText]
 * @param {string} [hintIcon]
 * @param {boolean} [isMultiSelect=false]
 * @param {Object} [instrumentation={}]
 * @returns {HTMLElement}
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
  let optionsList; // predeclare to avoid no-use-before-define

  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'input-main-wrapper';

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

  function updateFloatingLabel() {
    inputContainer.classList.toggle('has-value', selectedOptions.length > 0);
  }

  function findLabelForValue(value) {
    const found = optionsArray.find((o) => o.optionValue === value);
    return found?.labelText || value;
  }

  function updateValueSpan() {
    valueSpan.textContent = isMultiSelect
      ? selectedOptions.map(findLabelForValue).join(', ')
      : findLabelForValue(selectedOptions[0]) || '';
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
      activeIndex = delta < 0 ? buttons.length - 1 : 0;
      buttons[activeIndex].focus();
      return;
    }
    const max = buttons.length - 1;
    const next = Math.max(0, Math.min(activeIndex + delta, max));
    activeIndex = next;
    buttons[next].focus();
  }

  function openList() {
    select.setAttribute('aria-expanded', 'true');
    optionsList.classList.add('options-list-visible');
  }

  function closeList() {
    select.setAttribute('aria-expanded', 'false');
    optionsList.classList.remove('options-list-visible');
    activeIndex = null;
  }

  function toggleList() {
    const expanded = select.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeList();
    } else {
      openList();
    }
  }

  function setSelectedOption(event) {
    const optionValue = event.detail.value;
    if (isMultiSelect) {
      if (selectedOptions.includes(optionValue)) {
        selectedOptions = selectedOptions.filter((v) => v !== optionValue);
      } else {
        selectedOptions.push(optionValue);
      }
    } else {
      selectedOptions = [optionValue];
      closeList();
    }
    updateFloatingLabel();
    updateValueSpan();
    onChange(selectedOptions);
  }

  optionsList = createOptionsList(
    optionsArray,
    setSelectedOption,
    isMultiSelect,
  );
  mainWrapper.appendChild(optionsList);

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

  Object.entries(instrumentation).forEach(([name, value]) => {
    mainWrapper.setAttribute(name, value);
  });

  function handleOutsideClick(e) {
    if (select.getAttribute('aria-expanded') !== 'true') return;
    if (!mainWrapper.contains(e.target)) {
      closeList();
    }
  }
  document.addEventListener('mousedown', handleOutsideClick);

  select.addEventListener('click', toggleList);
  valueSpan.addEventListener('click', toggleList);

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
      return;
    }
    if (e.key === 'Escape' && expanded) {
      e.preventDefault();
      closeList();
      select.focus();
    }
  });

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
