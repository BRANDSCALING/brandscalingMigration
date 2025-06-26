import { Request, Response } from 'express';
import { storage } from './storage.js';
import { sendWelcomeEmail } from './emailService.js';
import { generateUserCredentials } from './generateCredentials.js';

/**
 * GoHighLevel Webhook Handler
 * Processes purchase completions from GHL and creates user accounts
 */
export async function handleGhlPurchaseWebhook(req: Request, res: Response) {
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
      customerId 
    } = req.body;

    // Validate required fields
    if (!email || !product) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: email and product' 
      });
    }

    // Map product to access tier
    let accessTier: string;
    switch (product.toLowerCase()) {
      case 'entry':
      case 'entry-tier':
        accessTier = 'entry';
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
    
    // Create user account
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
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

    // Store user in database
    await storage.createLead(newUser);
    
    // Log credential generation
    console.log(`Generated credentials for ${email}: ${credentials.password}`);

    // Send welcome email with credentials
    await sendWelcomeEmail(email, credentials.password, accessTier);

    console.log(`User account created successfully for ${email} with ${accessTier} access`);

    // Respond to GHL webhook
    res.status(200).json({
      success: true,
      message: 'Purchase processed and credentials sent',
      userId: userId,
      accessTier: accessTier
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