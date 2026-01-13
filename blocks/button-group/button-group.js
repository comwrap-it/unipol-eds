import { extractInstrumentationAttributes } from '../../scripts/utils.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`),
  ]);
  isStylesLoaded = true;
}

const getText = (row) => row?.textContent?.trim() || '';
const getBoolean = (row) => getText(row).toLowerCase() === 'true';

export function extractButtonValues(rows) {
  return {
    buttonGroupVariant: getText(rows[0]),

    firstButtonLabel: getText(rows[1]),
    firstButtonVariant: getText(rows[2]) || 'primary',
    firstButtonHref: getText(rows[3]) || '#',
    firstButtonOpenInNewTab: getBoolean(rows[4]),
    firstButtonSize: getText(rows[5]) || 'medium',
    firstButtonLeftIcon: getText(rows[6]),
    firstButtonRightIcon: getText(rows[7]),

    secondButtonLabel: getText(rows[8]),
    secondButtonVariant: getText(rows[9]) || 'primary',
    secondButtonHref: getText(rows[10]) || '#',
    secondButtonOpenInNewTab: getBoolean(rows[11]),
    secondButtonSize: getText(rows[12]) || 'medium',
    secondButtonLeftIcon: getText(rows[13]),
    secondButtonRightIcon: getText(rows[14]),

    instrumentation: extractInstrumentationAttributes(rows[0]),
  };
}

export function createButtonGroup(values) {
  const container = document.createElement('div');
  container.className = 'button-group';

  container.classList.remove('button-group-primary', 'button-group-accent', 'button-group-vertical', 'button-group-horizontal');
  const [variantButtonGroup, orientation] = values.buttonGroupVariant.split(' ');
  container.classList.add(`button-group-${variantButtonGroup}`, `button-group-${orientation}`);

  if (values.instrumentation) {
    Object.entries(values.instrumentation).forEach(([key, val]) => {
      container.setAttribute(key, val);
    });
  }

  function createButton({
    label, variant, href, openInNewTab, size, leftIcon, rightIcon,
  }) {
    const button = document.createElement('a');
    button.className = `btn ${variant}`;
    button.href = href;
    if (openInNewTab) button.target = '_blank';
    if (!openInNewTab) {
      button.role = 'button';
      button.setAttribute('tabindex', '0');
    }
    if (leftIcon) {
      const iLeft = document.createElement('i');
      iLeft.className = `${leftIcon} icon-${size}`;
      button.appendChild(iLeft);
    }

    const textNode = document.createTextNode(label);
    button.appendChild(textNode);

    if (rightIcon) {
      const iRight = document.createElement('i');
      iRight.className = `${rightIcon} icon-${size}`;
      button.appendChild(iRight);
    }

    return button;
  }

  const firstButton = createButton({
    label: values.firstButtonLabel,
    variant: values.firstButtonVariant,
    href: values.firstButtonHref,
    openInNewTab: values.firstButtonOpenInNewTab,
    size: values.firstButtonSize,
    leftIcon: values.firstButtonLeftIcon,
    rightIcon: values.firstButtonRightIcon,
  });

  const secondButton = createButton({
    label: values.secondButtonLabel,
    variant: values.secondButtonVariant,
    href: values.secondButtonHref,
    openInNewTab: values.secondButtonOpenInNewTab,
    size: values.secondButtonSize,
    leftIcon: values.secondButtonLeftIcon,
    rightIcon: values.secondButtonRightIcon,
  });

  container.appendChild(firstButton);
  container.appendChild(secondButton);

  return container;
}

export default async function decorate(block) {
  if (!block) return;
  await ensureStylesLoaded();

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = Array.from(wrapper.children);

  const values = extractButtonValues(rows);
  const buttonGroupEl = createButtonGroup(values);

  block.innerHTML = '';
  block.appendChild(buttonGroupEl);
  block.classList.add('button-group-block');
}
