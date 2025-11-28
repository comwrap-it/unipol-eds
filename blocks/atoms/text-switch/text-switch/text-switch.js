import {
  createSwitchLabel,
  SWITCH_LABEL_STATES,
} from '../switch-label/switch-label.js';

/**
 * Create Text Switch
 *
 * @param {Object} params
 * @param {string} params.labelLeft
 * @param {string} params.labelRight
 * @param {"left"|"right"} params.initialActive
 */
export function createTextSwitch(labelLeft, labelRight, initialActive) {
  const wrapper = document.createElement('div');
  wrapper.className = 'text-switch';

  const leftIsActive = initialActive === 'left';
  const rightIsActive = initialActive === 'right';

  const leftLabel = createSwitchLabel(
    leftIsActive ? SWITCH_LABEL_STATES.ACTIVE : SWITCH_LABEL_STATES.DEFAULT,
    labelLeft,
  );

  const rightLabel = createSwitchLabel(
    rightIsActive ? SWITCH_LABEL_STATES.ACTIVE : SWITCH_LABEL_STATES.DEFAULT,
    labelRight,
  );

  /**
   * Recreates structure of a switch label
   */
  function refreshLabel(el, text, isActive) {
    el.innerHTML = '';

    const textEl = document.createElement('div');
    textEl.className = 'switch-label-text';
    textEl.textContent = text;
    el.appendChild(textEl);

    if (isActive) {
      const dot = document.createElement('div');
      dot.className = 'switch-label-dot';
      el.classList.add('active');
      el.appendChild(dot);
    } else {
      el.classList.remove('active');
    }
  }

  // Activate left
  function activateLeft() {
    leftLabel.classList.add('active');
    rightLabel.classList.remove('active');

    // Rebuild dot
    refreshLabel(leftLabel, labelLeft, true);
    refreshLabel(rightLabel, labelRight, false);
  }

  // Activate right
  function activateRight() {
    leftLabel.classList.remove('active');
    rightLabel.classList.add('active');

    refreshLabel(leftLabel, labelLeft, false);
    refreshLabel(rightLabel, labelRight, true);
  }

  leftLabel.addEventListener('click', () => {
    activateLeft();
  });

  rightLabel.addEventListener('click', () => {
    activateRight();
  });

  wrapper.appendChild(leftLabel);
  wrapper.appendChild(rightLabel);

  return wrapper;
}

/**
 * Decorator
 */
export default function decorateTextSwitch(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = [...wrapper.children];

  const labelLeft = rows[0]?.textContent?.trim() || 'Option A';
  const labelRight = rows[1]?.textContent?.trim() || 'Option B';
  const initialActive = rows[2]?.textContent?.trim().toLowerCase() === 'right'
    ? 'right'
    : 'left';

  block.textContent = '';

  const textSwitch = createTextSwitch({
    labelLeft,
    labelRight,
    initialActive,
  });

  block.appendChild(textSwitch);
  block.classList.add('text-switch-block');
}
