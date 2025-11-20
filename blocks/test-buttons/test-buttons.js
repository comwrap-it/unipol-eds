import { createIconButton } from '../atoms/buttons/icon-button/icon-button.js';
import { createLinkButton } from '../atoms/buttons/link-button/link-button.js';
import {
  BUTTON_ICON_SIZES,
  BUTTON_VARIANTS,
  createButton,
} from '../atoms/buttons/standard-button/standard-button.js';
import { createCategoryChip } from '../atoms/category-chip/category-chip.js';
import { createCategoryTab } from '../atoms/category-tab/category-tab.js';
import { createTextarea } from '../atoms/inputs/textarea/textarea.js';
import { createTextfield } from '../atoms/inputs/textfield/textfield.js';
import createOption from '../atoms/options/option/option.js';
import { createOptionsList } from '../atoms/options/options-list/options-list.js';
import { createTag } from '../atoms/tag/tag.js';
import { createButtonGroup } from '../molecules/button-group/button-group.js';

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
      `${window.hlx.codeBasePath}/blocks/molecules/button-group/button-group.css`,
    ),
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/molecules/banners/mini-banner/mini-banner.css`,
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
  const showLeftIcon = rows[12]?.textContent?.trim() === 'true';
  const showRightIcon = rows[13]?.textContent?.trim() === 'true';
  const leftIconSize = rows[14]?.textContent?.trim().toLowerCase() || 'm';
  const rightIconSize = rows[15]?.textContent?.trim().toLowerCase() || 'm';
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
    showLeftIcon,
    showRightIcon,
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

  // create mini banner (rows 24-37)
  // Mini banner structure:
  // row[24]: title
  // row[25]: buttonGroupVariant
  // rows[26-31]: button 1 (label, variant, href, size, leftIcon, rightIcon)
  // rows[32-37]: button 2 (label, variant, href, size, leftIcon, rightIcon)
  const miniBannerContainer = document.createElement('div');
  miniBannerContainer.style = 'width: 100%; display: flex; justify-content: center; margin-top: 40px;';

  // Create mini banner wrapper
  const miniBanner = document.createElement('div');
  miniBanner.className = 'mini-banner';

  // Mini banner title
  const miniBannerTitle = document.createElement('h3');
  miniBannerTitle.className = 'title';
  miniBannerTitle.textContent = rows[24]?.textContent?.trim() || 'Mini Banner Title';
  miniBanner.appendChild(miniBannerTitle);

  // Create button group for mini banner
  const buttonGroupRows = rows.slice(25, 38); // 13 rows for button group
  if (buttonGroupRows.length > 0 && buttonGroupRows[0]?.textContent?.trim()) {
    const buttonGroup = createButtonGroup(buttonGroupRows);
    if (buttonGroup) {
      miniBanner.appendChild(buttonGroup);
    }
  }

  miniBannerContainer.appendChild(miniBanner);
  testButtons.appendChild(miniBannerContainer);

  // Clear block and append test buttons
  block.textContent = '';
  block.appendChild(testButtons);
}
