/**
 * Link Button - Utility Component
 *
 * This module exports functions for creating and decorating link buttons.
 * It can be imported or used by other components if needed.
 */

import { BUTTON_ICON_SIZES } from '../../../../constants/index.js';
import { createLinkButton } from '../../../../scripts/libs/ds/components/atoms/buttons/link-button/link-button.js';

/**
 * Create a link button from Universal Editor rows
 *
 * @param {Array} rows - Array of block children
 * @returns {HTMLElement}
 */
export function createLinkButtonFromRows(rows) {
  if (!rows || rows.length === 0) return null;

  const text = rows[0]?.textContent?.trim() || 'Link';
  const href = rows[1]?.querySelector('a')?.href || rows[1]?.textContent?.trim() || '#';
  const openInNewTab = rows[2]?.textContent?.trim() === 'true';
  const leftIcon = rows[3]?.textContent?.trim() || '';
  const rightIcon = rows[4]?.textContent?.trim() || '';
  const leftIconSize = (rows[5]?.textContent?.trim() || BUTTON_ICON_SIZES.MEDIUM).toLowerCase();
  const rightIconSize = (rows[6]?.textContent?.trim() || BUTTON_ICON_SIZES.MEDIUM).toLowerCase();
  const disabled = rows[7]?.textContent?.trim() === 'true';

  return createLinkButton(
    text,
    href,
    openInNewTab,
    leftIcon,
    rightIcon,
    leftIconSize,
    rightIconSize,
    disabled,
  );
}
