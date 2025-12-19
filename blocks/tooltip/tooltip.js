import {
  getValuesFromBlock,
  restoreInstrumentation,
  isAuthorMode,
} from '../../scripts/utils.js';

/**
 * Creates Tooltip
 *
 * @param toolTip object that contains value and instrumentation for EDS component
 * @param toolTipSub object that contains value and instrumentation for EDS component
 * @returns {HTMLElement}
 */
export function createTooltip(toolTip, toolTipSub) {
  const wrapper = document.createElement('div');
  wrapper.className = 'tooltip';

  const trigger = document.createElement('span');
  trigger.className = 'tooltip-trigger';
  trigger.textContent = toolTip?.value || '';

  if (toolTip?.instrumentation) {
    restoreInstrumentation(trigger, toolTip.instrumentation);
  }

  const content = document.createElement('div');
  content.className = 'tooltip-content';

  if (toolTipSub?.value) {
    content.append(...toolTipSub.value);
  }

  if (toolTipSub?.instrumentation) {
    restoreInstrumentation(content, toolTipSub.instrumentation);
  }

  // In author mode mostriamo sempre il tooltip
  if (isAuthorMode(wrapper)) {
    wrapper.classList.add('open');
  }

  wrapper.append(trigger, content);

  // Interazione tooltip (hover / focus)
  trigger.addEventListener('mouseenter', () => {
    wrapper.classList.add('open');
  });

  trigger.addEventListener('mouseleave', () => {
    wrapper.classList.remove('open');
  });

  trigger.addEventListener('focus', () => {
    wrapper.classList.add('open');
  });

  trigger.addEventListener('blur', () => {
    wrapper.classList.remove('open');
  });

  return wrapper;
}

/**
 * Decorator for Tooltip
 *
 * @param {HTMLElement} block
 */
export default async function decorateTooltip(block) {
  if (!block) return;

  const properties = ['toolTip', 'toolTipSub'];
  const values = getValuesFromBlock(block, properties);

  const tooltipElement = createTooltip(
    values.toolTip,
    values.toolTipSub,
  );

  block.textContent = '';
  block.appendChild(tooltipElement);
  block.classList.add('tooltip-block');
}
