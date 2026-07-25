/**
 * currency.js — Currency utility
 * Converts USD prices from DummyJSON API → INR
 * Exchange rate: 1 USD ≈ 84 INR (approximate)
 */

const USD_TO_INR = 84

/**
 * Convert USD value to INR and format with ₹ symbol
 * @param {number} usdPrice
 * @returns {string} e.g. "₹1,00,999"
 */
export function toINR(usdPrice) {
  const inr = Math.round(usdPrice * USD_TO_INR)
  return '₹' + inr.toLocaleString('en-IN')
}

/**
 * Raw INR number (no symbol) — useful for calculations display
 */
export function toINRRaw(usdPrice) {
  return Math.round(usdPrice * USD_TO_INR)
}
