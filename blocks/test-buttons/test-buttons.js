import { createIconButton } from '../atoms/buttons/icon-button/icon-button.js';
import { createLinkButton } from '../atoms/buttons/link-button/link-button.js';
import {
  BUTTON_ICON_SIZES,
  BUTTON_VARIANTS,
  createButton,
} from '../atoms/buttons/standard-button/standard-button.js';
import {
  NAVIGATION_PILL_VARIANTS,
  NAVIGATION_PILL_ICON_SIZES,
  createNavigationPill,
} from '../atoms/navigation-pill/navigation-pill.js';
import { createCategoryChip } from '../atoms/category-chip/category-chip.js';
import { createCategoryTab } from '../atoms/category-tab/category-tab.js';
import { createTextarea } from '../atoms/inputs/textarea/textarea.js';
import { createTextfield } from '../atoms/inputs/textfield/textfield.js';
import createOption from '../atoms/options/option/option.js';
import { createOptionsList } from '../atoms/options/options-list/options-list.js';
import { createTag } from '../atoms/tag/tag.js';
import { create3Dicons } from '../atoms/3D-icons/3D-icons.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/standard-button/standard-button.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/icon-button/icon-button.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/link-button/link-button.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/category-chip/category-chip.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/category-tab/category-tab.css`,
    ),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/inputs/inputs.css`),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/options/option/option.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/options/options-list/options-list.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/checkbox/standard-checkbox/checkbox.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/3D-icons/3D-icons.css`,
    ),
  ]);
  isStylesLoaded = true;
}

const optionsData = [
  {
    labelText: 'Email notifications',
    descriptionText: 'Get updates about account activity',
    shouldShowCheckbox: true,
    typeStatus: 'checked',
    disabled: false,
    instrumentation: { 'data-tracking-id': 'opt_email', 'data-aue-resource': 'option-1' },
  },
  {
    labelText: 'SMS alerts',
    descriptionText: 'Security and login alerts via SMS',
    shouldShowCheckbox: true,
    typeStatus: 'unchecked',
    disabled: true,
    instrumentation: { 'data-tracking-id': 'opt_sms' },
  },
  {
    labelText: 'Weekly digest',
    descriptionText: 'Summary of product updates',
    shouldShowCheckbox: true,
    typeStatus: 'indeterminate',
    disabled: false,
    instrumentation: { 'data-tracking-id': 'opt_digest' },
  },
  {
    labelText: 'Beta features',
    descriptionText: 'Access experimental features',
    shouldShowCheckbox: false,
    typeStatus: 'unchecked',
    disabled: false,
    instrumentation: { 'data-tracking-id': 'opt_beta' },
  },
];

/**
 * Decorates a test buttons element
 * @param {HTMLElement} block - The test buttons element
 */
export default async function decorate(block) {
  if (!block) return;
  ensureStylesLoaded();

  // Get rows from block
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) {
    rows = Array.from(wrapper.children);
  }

  // Create test buttons container
  const testButtons = document.createElement('div');
  testButtons.classList.add('test-buttons');

  // standard button properties (rows 0-5)
  const text = rows[0]?.textContent?.trim() || 'Button';
  const variant = rows[1]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const href = rows[2]?.querySelector('a')?.href || rows[2]?.textContent?.trim() || '';
  const iconSize = rows[3]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const leftIcon = rows[4]?.textContent?.trim() || '';
  const rightIcon = rows[5]?.textContent?.trim() || '';
  // icon button properties
  const icon = rows[6]?.textContent?.trim() || '';
  const iconBtnVariant = rows[7]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const iconBtnIconSize = rows[8]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const iconBtnHref = rows[9]?.querySelector('a')?.href || rows[9]?.textContent?.trim() || '';
  // link button properties
  const linkText = rows[10]?.textContent?.trim() || 'Link';
  const linkHref = rows[11]?.querySelector('a')?.href || rows[11]?.textContent?.trim() || '#';
  const linkLeftIcon = rows[12]?.textContent?.trim() === 'true';
  const linkRightIcon = rows[13]?.textContent?.trim() === 'true';
  const leftIconSize = rows[14]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const rightIconSize = rows[15]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  // category chip properties
  const categoryChipCategory = rows[16]?.textContent?.trim() || '';
  const categoryChipIcon = rows[17]?.textContent?.trim() || '';
  // category tab properties
  const categoryTabLabel = rows[18]?.textContent?.trim() || '';
  const categoryTabIcon = rows[19]?.textContent?.trim() || '';
  const categoryTabIconSize = rows[20]?.textContent?.trim() || BUTTON_ICON_SIZES.MEDIUM;
  // tag properties
  const tagLabel = rows[21]?.textContent?.trim() || 'Tag';
  const tagCategory = rows[22]?.textContent?.trim() || 'mobility';
  const tagType = rows[23]?.textContent?.trim() || 'default';
  // Create standard button
  const standardButton = createButton(
    text,
    href,
    variant,
    iconSize,
    leftIcon,
    rightIcon,
  );
  testButtons.appendChild(standardButton);
  // Create icon button
  const iconButton = createIconButton(
    icon,
    iconBtnVariant,
    iconBtnIconSize,
    iconBtnHref,
  );
  testButtons.appendChild(iconButton);
  // Create link button
  const linkButton = createLinkButton(
    linkText,
    linkHref,
    linkLeftIcon,
    linkRightIcon,
    leftIconSize,
    rightIconSize,
  );
  testButtons.appendChild(linkButton);
  // Create category chip
  const categoryChip = createCategoryChip(
    categoryChipCategory,
    categoryChipIcon,
  );
  testButtons.appendChild(categoryChip);
  // Create category tab
  const categoryTab = createCategoryTab(
    categoryTabLabel,
    categoryTabIcon,
    categoryTabIconSize,
  );
  testButtons.appendChild(categoryTab);
  // Create tag
  const tag = createTag(tagLabel, tagCategory, tagType);
  testButtons.appendChild(tag);

  // Create Navigation Pill
  const navigationPill = createNavigationPill(
    'NavPill',
    undefined,
    NAVIGATION_PILL_VARIANTS.SECONDARY,
    'search-icon',
    NAVIGATION_PILL_ICON_SIZES.LARGE,
    'phone-icon',
    NAVIGATION_PILL_ICON_SIZES.SMALL,
  );
  testButtons.appendChild(navigationPill);

  // Create textfield
  const textfieldContainer = document.createElement('div');
  textfieldContainer.style = 'width: 100%; display: flex; justify-content: center; margin-top: 20px;';
  const textField = createTextfield(
    'Sample Textfield',
    'search-icon',
    BUTTON_ICON_SIZES.SMALL,
    'hint text',
    'checked-icon',
  );
  textfieldContainer.appendChild(textField);
  testButtons.appendChild(textfieldContainer);
  // Create textarea
  const textareaContainer = document.createElement('div');
  textareaContainer.style = 'width: 100%; display: flex; justify-content: center; margin-top: 20px;';
  const textArea = createTextarea(
    'Sample Textarea',
    'search-icon',
    BUTTON_ICON_SIZES.SMALL,
    'hint text',
    'checked-icon',
  );
  textareaContainer.appendChild(textArea);
  testButtons.appendChild(textareaContainer);
  // create option
  const optionContainer = document.createElement('div');
  optionContainer.style = 'width: 100%; display: flex; justify-content: center; margin-top: 20px;';
  const option = createOption(
    'Sample Option',
    'This is a description for the option.',
    true,
    'unchecked',
    false,
  );
  optionContainer.appendChild(option);
  testButtons.appendChild(optionContainer);
  // create options list
  const optionsListContainer = document.createElement('div');
  optionsListContainer.style = 'width: 100%; display: flex; justify-content: center; margin-top: 20px;';

  const optionsList = createOptionsList(optionsData);
  optionsListContainer.appendChild(optionsList);
  testButtons.appendChild(optionsListContainer);

  // Clear block and append test buttons
  block.textContent = '';
  block.appendChild(testButtons);

  // Create 3D icons
  const icons3D = create3Dicons(
    true,
    true,
    true,
  );
  block.textContent = '';
  block.appendChild(icons3D);

  // Create 3D icons
  const icons3D2items = create3Dicons(
    true,
    true,
    false,
  );
  block.appendChild(icons3D2items);

  // Create 3D icons
  const icons3D1items = create3Dicons(
    true,
    false,
    false,
  );
  block.appendChild(icons3D1items);

  // Create 3D icons
  const icons3DpropertyWelfare = create3Dicons(
    false,
    true,
    true,
  );
  block.appendChild(icons3DpropertyWelfare);
}
