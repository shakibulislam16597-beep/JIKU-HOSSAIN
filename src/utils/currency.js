/**
 * Currency Conversion Utilities
 * Exchange Rate: 1 USD = 122 BDT
 */
export const USD_TO_BDT = 122;

/**
 * Formats a USD amount to Bangladeshi Taka (BDT)
 * Example: formatBDT(49.99) -> "৳6,099"
 *
 * @param {number} usd - Price in USD
 * @returns {string} Formatted BDT price with ৳ symbol and thousand separators
 */
export function formatBDT(usd) {
  if (typeof usd !== 'number' || isNaN(usd)) {
    return '৳0';
  }
  const bdtAmount = Math.round(usd * USD_TO_BDT);
  return `৳${bdtAmount.toLocaleString('en-US')}`;
}

/**
 * Formats a USD amount to $ string
 * Example: formatUSD(49.99) -> "$49.99"
 *
 * @param {number} usd - Price in USD
 * @returns {string} Formatted USD price
 */
export function formatUSD(usd) {
  if (typeof usd !== 'number' || isNaN(usd)) {
    return '$0.00';
  }
  return `$${usd.toFixed(2)}`;
}
