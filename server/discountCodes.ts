export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (0-100) or fixed amount in pence
  validFrom: Date;
  validUntil: Date;
  applicableProducts: string[];
  maxUses?: number;
  usedCount: number;
  active: boolean;
}

// Active discount codes configuration
export const DISCOUNT_CODES: Record<string, DiscountCode> = {
  'LAUNCH49': {
    code: 'LAUNCH49',
    type: 'fixed',
    value: 45000, // £450 off (£499 - £49 = £450)
    validFrom: new Date('2025-06-26'),
    validUntil: new Date('2025-06-27'), // 24 hours only
    applicableProducts: ['entry'],
    maxUses: 1000, // Limited to first 1000 customers
    usedCount: 0,
    active: true
  }
};

export function validateDiscountCode(
  code: string, 
  product: string, 
  originalAmount: number
): { valid: boolean; discountAmount: number; finalAmount: number; error?: string } {
  
  const discountCode = DISCOUNT_CODES[code.toUpperCase()];
  
  if (!discountCode) {
    return { valid: false, discountAmount: 0, finalAmount: originalAmount, error: 'Invalid discount code' };
  }

  if (!discountCode.active) {
    return { valid: false, discountAmount: 0, finalAmount: originalAmount, error: 'Discount code is not active' };
  }

  const now = new Date();
  if (now < discountCode.validFrom || now > discountCode.validUntil) {
    return { valid: false, discountAmount: 0, finalAmount: originalAmount, error: 'Discount code has expired' };
  }

  if (!discountCode.applicableProducts.includes(product.toLowerCase())) {
    return { valid: false, discountAmount: 0, finalAmount: originalAmount, error: 'Discount code not applicable to this product' };
  }

  if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
    return { valid: false, discountAmount: 0, finalAmount: originalAmount, error: 'Discount code usage limit reached' };
  }

  let discountAmount = 0;
  if (discountCode.type === 'percentage') {
    discountAmount = Math.round(originalAmount * (discountCode.value / 100));
  } else {
    discountAmount = discountCode.value;
  }

  const finalAmount = Math.max(0, originalAmount - discountAmount);

  return {
    valid: true,
    discountAmount,
    finalAmount,
    error: undefined
  };
}

export function incrementDiscountCodeUsage(code: string): void {
  const discountCode = DISCOUNT_CODES[code.toUpperCase()];
  if (discountCode) {
    discountCode.usedCount++;
  }
}

export function getDiscountCodeInfo(code: string): DiscountCode | null {
  return DISCOUNT_CODES[code.toUpperCase()] || null;
}