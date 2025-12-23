import { extractInstrumentationAttributes } from '../../../../scripts/utils.js';

/**
 * Extract values from block rows
 * @param {HTMLElement[]} rows The block rows
 * @returns {Object} The extracted values
 */
const extractValuesFromRows = (rows) => {
  const label = rows[0].textContent.trim();
  const icon = rows[1] ? rows[1].textContent.trim() : '';
  const iconSize = rows[2] ? rows[2].textContent.trim() : '';
  const hintText = rows[3] ? rows[3].textContent.trim() : '';
  const hintIcon = rows[4] ? rows[4].textContent.trim() : '';
  const instrumentation = extractInstrumentationAttributes(rows[0]);
  return {
    label,
    icon,
    iconSize,
    hintText,
    hintIcon,
    instrumentation,
  };
};
