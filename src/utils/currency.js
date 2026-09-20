/**
 * Currency Formatting Utilities for Bangladeshi Taka (৳)
 */

/**
 * Formats a number in BDT (৳)
 * Example: formatBDT(1200) -> "৳ 1,200"
 *
 * @param {number} amount - Price in BDT
 * @returns {string} Formatted BDT price
 */
export function formatBDT(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '৳ 0';
  }
  return `৳ ${Math.round(amount).toLocaleString('en-US')}`;
}

export const USD_TO_BDT = 122;
