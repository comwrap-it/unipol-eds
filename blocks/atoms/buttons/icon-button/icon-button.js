/**
 * Icon Button - Utility Component
 *
 * This module exports reusable functions for creating and decorating icon buttons.
 * It can be imported by other components (Card, Accordion, Hero, etc.)
 *
 */

import { BUTTON_ICON_SIZES, BUTTON_VARIANTS } from '../../../../constants/index.js';
import { createIconButton } from '@unipol-ds/components/atoms/buttons/icon-button/icon-button.js';
import { extractInstrumentationAttributes } from '../../../../scripts/utils.js';

/** Extract button properties from rows
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {Object} An object containing button properties
 *
 * Row mapping (based on _icon-button.json field order):
 * rows[0]: iconButtonIcon (select)
 * rows[1]: iconButtonVariant (select)
 * rows[2]: iconButtonSize (select)
 * rows[3]: iconButtonHref (aem-content)
 * rows[4]: iconButtonOpenInNewTab (boolean)
 */
const extractValuesFromRows = (rows) => {
  const icon = rows[0]?.textContent?.trim() || '';
  const variant = rows[1]?.textContent?.trim().toLowerCase() || BUTTON_VARIANTS.PRIMARY;
  const iconSize = rows[2]?.textContent?.trim().toLowerCase() || BUTTON_ICON_SIZES.MEDIUM;
  const href = rows[3]?.querySelector('a')?.href || rows[3]?.textContent?.trim() || '';
  const openInNewTab = rows[4]?.textContent?.trim() === 'true';
  const instrumentation = extractInstrumentationAttributes(rows[0]);
  return {
    icon,
    variant,
    iconSize,
    href,
    openInNewTab,
    instrumentation,
  };
};

/**
 * Process button data from rows and create button element
 * Used when button is rendered from Universal Editor data structure
 *
 * @param {Array} rows - Array of rows from block children
 * @returns {HTMLElement} The button element
 */
export function createButtonFromRows(rows) {
  if (!rows || rows.length === 0) return null;

  const {
    icon, variant, iconSize, href, openInNewTab, instrumentation,
  } = extractValuesFromRows(rows);

  return createIconButton(
    icon,
    variant,
    iconSize,
    href,
    openInNewTab,
    instrumentation,
  );
}
