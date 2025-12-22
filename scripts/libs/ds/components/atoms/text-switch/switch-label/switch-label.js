export const SWITCH_LABEL_STATES = {
  DEFAULT: 'default',
  ACTIVE: 'active',
};

/**
 * Creates a Switch Label element
 *
 * @param {Object} params
 * @param {string} params.status - "default" | "active"
 * @param {string} params.label - text content
 * @returns {HTMLElement}
 */
export function createSwitchLabel(status, label) {
  const wrapper = document.createElement('div');
  wrapper.className = 'switch-label';

  const isActive = status === SWITCH_LABEL_STATES.ACTIVE;
  if (isActive) wrapper.classList.add('active');

  const textEl = document.createElement('div');
  textEl.className = 'switch-label-text';
  textEl.textContent = label || '';

  wrapper.appendChild(textEl);

  if (isActive) {
    const dot = document.createElement('div');
    dot.className = 'switch-label-dot';
    wrapper.appendChild(dot);
  }

  return wrapper;
}
