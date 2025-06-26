import { Router } from 'express';
import { validateDiscountCode, getDiscountCodeInfo } from './discountCodes.js';

const router = Router();

// Validate discount code endpoint for frontend use
router.post('/validate-discount', (req, res) => {
  try {
    const { code, product, amount } = req.body;

    if (!code || !product || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: code, product, amount'
      });
    }

    const amountInPence = Math.round(parseFloat(amount) * 100);
    const validation = validateDiscountCode(code, product, amountInPence);

    if (validation.valid) {
      res.json({
        success: true,
        valid: true,
        discountAmount: validation.discountAmount / 100, // Convert back to pounds
        finalAmount: validation.finalAmount / 100,
        savings: validation.discountAmount / 100
      });
    } else {
      res.json({
        success: true,
        valid: false,
        error: validation.error
      });
    }

  } catch (error) {
    console.error('Discount validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get discount code information (without applying it)
router.get('/discount-info/:code', (req, res) => {
  try {
    const { code } = req.params;
    const discountInfo = getDiscountCodeInfo(code);

    if (!discountInfo) {
      return res.status(404).json({
        success: false,
        error: 'Discount code not found'
      });
    }

    // Return safe information (not sensitive details)
    res.json({
      success: true,
      code: discountInfo.code,
      type: discountInfo.type,
      active: discountInfo.active,
      validUntil: discountInfo.validUntil,
      applicableProducts: discountInfo.applicableProducts
    });

  } catch (error) {
    console.error('Discount info error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;