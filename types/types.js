// GENERIC TYPES
/**
 * @typedef {'small'|'medium'|'large'|'extra-large'} IconSizes
 */

// TAG TYPES
/**
 * @typedef {'default'|'secondary'|'neutral'|'custom'} TagType
 */

/**
 * @typedef {'mobility'|'welfare'|'property'} TagCategory
 */

/**
 * @typedef TagConf
 * @property {string} label - Link text
 * @property {TagCategory} category - category name
 * @property {TagType} type - tag type
 */

// LINK BUTTON TYPES
/**
 * @typedef LinkButtonConf
 * @property {string} label - Link text
 * @property {string} href - URL for the link
 * @property {boolean} openInNewTab - Open link in new tab (optional)
 * @property {boolean} leftIcon - left icon class
 * @property {boolean} rightIcon - right icon class
 * @property {IconSizes} leftIconSize - size of left icon
 * @property {IconSizes} rightIconSize - size of right icon
 * @property {boolean} disabled - Disabled state (optional)
 */

// Optional: keep if you need ESM module semantics; otherwise remove.
export {};
