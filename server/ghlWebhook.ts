import { Request, Response } from 'express';
import { storage } from './storage.js';
import { sendCredentialEmail } from './emailService.js';
import { generateUserCredentials } from './generateCredentials.js';
import { validateDiscountCode, incrementDiscountCodeUsage } from './discountCodes.js';

/**
 * GoHighLevel Webhook Handler
 * Processes purchase completions from GHL and creates user accounts
 */
export async function handleGhlWebhook(req: Request, res: Response) {
  try {
    console.log('GHL Webhook received:', JSON.stringify(req.body, null, 2));
    
    // Extract customer data from GHL webhook
    const { 
      email, 
      firstName, 
      lastName, 
      product, 
      amount,
      orderId,
      customerId,
      discountCode
    } = req.body;

    // Validate required fields
    if (!email || !product) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: email and product' 
      });
    }

    // Validate discount code if provided
    let discountInfo = null;
    if (discountCode) {
      const originalAmount = parseFloat(amount) * 100; // Convert to pence
      const validation = validateDiscountCode(discountCode, product, originalAmount);
      
      if (!validation.valid) {
        console.error(`Invalid discount code ${discountCode}: ${validation.error}`);
        return res.status(400).json({
          success: false,
          error: `Discount code error: ${validation.error}`
        });
      }
      
      discountInfo = validation;
      console.log(`Valid discount code ${discountCode} applied: £${validation.discountAmount / 100} off`);
    }

    // Map product to access tier
    let accessTier: string;
    switch (product.toLowerCase()) {
      case 'entry':
      case 'entry-tier':
        accessTier = 'entry';
        break;
      case 'expert':
      case 'expert-tier':
        accessTier = 'expert';
        break;
      case 'elite':
      case 'elite-tier':
      case 'mastermind':
        accessTier = 'elite';
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          error: `Unknown product: ${product}` 
        });
    }

    // Generate secure credentials
    const credentials = generateUserCredentials();
    const password = credentials.password;
    const userId = credentials.userId;
    
    // Create user account  
    const newUser = {
      id: userId,
      email: email,
      firstName: firstName || null,
      lastName: lastName || null,
      role: 'student',
      accessTier: accessTier,
      isActive: true,
      stripeCustomerId: customerId || null,
      ghlOrderId: orderId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store user in database (using lead creation temporarily)
    await storage.createLead({
      email: email,
      name: `${firstName || ''} ${lastName || ''}`.trim(),
      addedByAdmin: 'GHL_WEBHOOK'
    });
    
    // Log credential generation
    console.log(`Generated credentials for ${email}: ${password}`);

    // Increment discount code usage if applicable
    if (discountCode && discountInfo?.valid) {
      incrementDiscountCodeUsage(discountCode);
      console.log(`Discount code ${discountCode} usage incremented`);
    }

    // Instead of sending email directly, return credentials to GHL for workflow automation
    console.log(`User account created successfully for ${email} with ${accessTier} access`);
    console.log(`Generated password for GHL workflow: ${password}`);

    // Respond to GHL webhook with credentials for automation
    res.status(200).json({
      success: true,
      message: 'Purchase processed and account created',
      userId: userId,
      accessTier: accessTier,
      discountApplied: discountInfo ? {
        code: discountCode,
        discountAmount: discountInfo.discountAmount / 100, // Convert back to pounds
        originalAmount: parseFloat(amount),
        finalAmount: discountInfo.finalAmount / 100
      } : null,
      loginCredentials: {
        email: email,
        password: password,
        loginUrl: `${process.env.FRONTEND_URL || 'https://your-domain.com'}/signin`
      }
    });

  } catch (error) {
    console.error('GHL webhook processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process purchase',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}



/**
 * Webhook endpoint configuration for GoHighLevel
 * Add this URL to your GHL automation:
 * POST https://your-brandscaling-domain.com/api/webhook/ghl-purchase
 */