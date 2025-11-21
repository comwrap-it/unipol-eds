import { createLinkButton } from '../atoms/buttons/link-button/link-button.js';
import { createIconButton } from '../atoms/buttons/icon-button/icon-button.js';
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
import createSelect from '../atoms/inputs/select/select.js';
import { createTextarea } from '../atoms/inputs/textarea/textarea.js';
import { createTextfield } from '../atoms/inputs/textfield/textfield.js';
import createOption from '../atoms/options/option/option.js';
import { createOptionsList } from '../atoms/options/options-list/options-list.js';
import { createTag } from '../atoms/tag/tag.js';
import {
  RADIO_TYPES,
  createRadio,
} from '../atoms/radio-button/standard-radio-button/radio-button.js';
import { create3Dicons } from '../atoms/3D-icons/3D-icons.js';
import { createRadioButtonField } from '../atoms/radio-button/radio-button-field/radio-button-field.js';

let isStylesLoaded = false;
async function ensureStylesLoaded() {
  if (isStylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  const base = window.hlx.codeBasePath;
  await Promise.all(
    [
      'blocks/atoms/buttons/standard-button/standard-button.css',
      'blocks/atoms/buttons/icon-button/icon-button.css',
      'blocks/atoms/buttons/link-button/link-button.css',
      'blocks/atoms/category-chip/category-chip.css',
      'blocks/atoms/category-tab/category-tab.css',
      'blocks/atoms/tag/tag.css',
      'blocks/atoms/inputs/inputs.css',
      'blocks/atoms/options/option/option.css',
      'blocks/atoms/options/options-list/options-list.css',
      'blocks/atoms/checkbox/standard-checkbox/checkbox.css',
      'blocks/atoms/navigation-pill/navigation-pill.css',
      'blocks/atoms/radio-button/standard-radio-button/radio-button.css',
      'blocks/atoms/radio-button/radio-button-field/radio-button-field.css',
      'blocks/atoms/3D-icons/3D-icons.css',
    ].map((p) => loadCSS(`${base}/${p}`)),
  );
  isStylesLoaded = true;
}

const optionsData = [
  {
    labelText: 'Email notifications',
    optionValue: 'email_notifications',
    descriptionText: 'Get updates about account activity',
    shouldShowCheckbox: true,
    typeStatus: 'checked',
    disabled: false,
    instrumentation: {
      'data-tracking-id': 'opt_email',
      'data-aue-resource': 'option-1',
    },
  },
  {
    labelText: 'SMS alerts',
    optionValue: 'sms_alerts',
    descriptionText: 'Security and login alerts via SMS',
    shouldShowCheckbox: true,
    typeStatus: 'unchecked',
    disabled: true,
    instrumentation: { 'data-tracking-id': 'opt_sms' },
  },
  {
    labelText: 'Weekly digest',
    optionValue: 'weekly_digest',
    descriptionText: 'Summary of product updates',
    shouldShowCheckbox: true,
    typeStatus: 'indeterminate',
    disabled: false,
    instrumentation: { 'data-tracking-id': 'opt_digest' },
  },
  {
    labelText: 'Beta features',
    optionValue: 'beta_features',
    descriptionText: 'Access experimental features',
    shouldShowCheckbox: false,
    typeStatus: 'unchecked',
    disabled: false,
    instrumentation: { 'data-tracking-id': 'opt_beta' },
  },
];

function getConfigFromRows(block) {
  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = Array.from(wrapper.children);

  return {
    text: rows[0]?.textContent?.trim() || 'Button',
    variant:
      rows[1]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY,
    href:
      rows[2]?.querySelector('a')?.href || rows[2]?.textContent?.trim() || '',
    iconSize:
      rows[3]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM,
    leftIcon: rows[4]?.textContent?.trim() || '',
    rightIcon: rows[5]?.textContent?.trim() || '',
    icon: rows[6]?.textContent?.trim() || '',
    iconBtnVariant:
      rows[7]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY,
    iconBtnIconSize:
      rows[8]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM,
    iconBtnHref:
      rows[9]?.querySelector('a')?.href || rows[9]?.textContent?.trim() || '',
    linkText: rows[10]?.textContent?.trim() || 'Link',
    linkHref:
      rows[11]?.querySelector('a')?.href
      || rows[11]?.textContent?.trim()
      || '#',
    linkLeftIcon: rows[12]?.textContent?.trim() === 'true',
    linkRightIcon: rows[13]?.textContent?.trim() === 'true',
    leftIconSize:
      rows[14]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM,
    rightIconSize:
      rows[15]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM,
    categoryChipCategory: rows[16]?.textContent?.trim() || '',
    categoryChipIcon: rows[17]?.textContent?.trim() || '',
    categoryTabLabel: rows[18]?.textContent?.trim() || '',
    categoryTabIcon: rows[19]?.textContent?.trim() || '',
    categoryTabIconSize:
      rows[20]?.textContent?.trim() || BUTTON_ICON_SIZES.MEDIUM,
    tagLabel: rows[21]?.textContent?.trim() || 'Tag',
    tagCategory: rows[22]?.textContent?.trim() || 'mobility',
    tagType: rows[23]?.textContent?.trim() || 'default',
  };
}

/* -------- UI Helpers -------- */
function centeredRow(child) {
  const container = document.createElement('div');
  container.style = 'width:100%;display:flex;justify-content:center;margin-top:20px;';
  container.appendChild(child);
  return container;
}

/* -------- Builders -------- */
function buildStandardButton(cfg) {
  return createButton(
    cfg.text,
    cfg.href,
    cfg.variant,
    cfg.iconSize,
    cfg.leftIcon,
    cfg.rightIcon,
  );
}

function buildIconButton(cfg) {
  return createIconButton(
    cfg.icon,
    cfg.iconBtnVariant,
    cfg.iconBtnIconSize,
    cfg.iconBtnHref,
  );
}

function buildLinkButton(cfg) {
  return createLinkButton(
    cfg.linkText,
    cfg.linkHref,
    cfg.linkLeftIcon,
    cfg.linkRightIcon,
    cfg.leftIconSize,
    cfg.rightIconSize,
  );
}

function buildCategoryChip(cfg) {
  return createCategoryChip(cfg.categoryChipCategory, cfg.categoryChipIcon);
}

function buildCategoryTab(cfg) {
  return createCategoryTab(
    cfg.categoryTabLabel,
    cfg.categoryTabIcon,
    cfg.categoryTabIconSize,
  );
}

function buildTag(cfg) {
  return createTag(cfg.tagLabel, cfg.tagCategory, cfg.tagType);
}

function buildNavigationPill() {
  return createNavigationPill(
    'NavPill',
    undefined,
    NAVIGATION_PILL_VARIANTS.SECONDARY,
    'search-icon',
    NAVIGATION_PILL_ICON_SIZES.LARGE,
    'phone-icon',
    NAVIGATION_PILL_ICON_SIZES.SMALL,
  );
}

function buildRadioButton() {
  return createRadio(RADIO_TYPES.UNCHECKED);
}

function buildRadioButtonField() {
  return createRadioButtonField(
    RADIO_TYPES.UNCHECKED,
    false,
    'LabelTest',
    'longText',
  );
}

function buildTextfield() {
  return createTextfield(
    'Sample Textfield',
    'search-icon',
    BUTTON_ICON_SIZES.SMALL,
    'hint text',
    'checked-icon',
  );
}

function buildTextarea() {
  return createTextarea(
    'Sample Textarea',
    'search-icon',
    BUTTON_ICON_SIZES.SMALL,
    'hint text',
    'checked-icon',
  );
}

function buildSingleOption() {
  return createOption(
    'Sample Option',
    'sample_option_value',
    (e) => console.log('Option clicked', e.detail),
    'This is a description for the option.',
    true,
    'unchecked',
    false,
    { 'data-tracking-id': 'sample_option' },
  );
}

function buildOptionsList() {
  return createOptionsList(
    optionsData,
    (e) => {
      console.log('Options list selection event:', e.detail);
    },
    true,
  );
}

function buildSelect() {
  return createSelect(
    'Sample Select',
    optionsData,
    (values) => console.log('Selected values:', values),
    'Hint text',
    'search-icon',
    false,
  );
}

function build3DIconsSets() {
  const container = document.createElement('div');
  container.style = 'width:100%;display:flex;justify-content:center;margin-top:20px;gap:24px;flex-wrap:wrap;';
  container.appendChild(create3Dicons(true, true, true));
  container.appendChild(create3Dicons(true, true, false));
  container.appendChild(create3Dicons(true, false, false));
  container.appendChild(create3Dicons(false, true, true));
  return container;
}

/* -------- Main Decorator -------- */
export default async function decorate(block) {
  console.log('Decorating test-buttons block...');
  if (!block) return;

  await ensureStylesLoaded();

  const config = getConfigFromRows(block);
  const testButtons = document.createElement('div');
  testButtons.className = 'test-buttons';

  // Core components
  testButtons.appendChild(buildStandardButton(config));
  testButtons.appendChild(buildIconButton(config));
  testButtons.appendChild(buildLinkButton(config));
  testButtons.appendChild(buildCategoryChip(config));
  testButtons.appendChild(buildCategoryTab(config));
  testButtons.appendChild(buildTag(config));
  testButtons.appendChild(buildNavigationPill());
  testButtons.appendChild(buildRadioButton());
  testButtons.appendChild(buildRadioButtonField());

  // Inputs (centered)
  testButtons.appendChild(centeredRow(buildTextfield()));
  testButtons.appendChild(centeredRow(buildTextarea()));
  testButtons.appendChild(centeredRow(buildSingleOption()));
  testButtons.appendChild(centeredRow(buildOptionsList()));
  testButtons.appendChild(centeredRow(buildSelect()));
  testButtons.appendChild(build3DIconsSets());

  // Mount
  block.innerHTML = '';
  block.appendChild(testButtons);
}
