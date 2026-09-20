export const VALID_COUPONS = {
  EID20: { code: 'EID20', discountPercent: 20, description: 'Eid special 20% off' },
  WELCOME10: { code: 'WELCOME10', discountPercent: 10, description: 'Welcome 10% off' }
};

export function validateCoupon(codeStr) {
  if (!codeStr || typeof codeStr !== 'string') return null;
  const cleanCode = codeStr.trim().toUpperCase();
  return VALID_COUPONS[cleanCode] || null;
}
