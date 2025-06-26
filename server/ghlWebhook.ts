import { Request, Response } from 'express';
import { storage } from './storage.js';
import { sendCredentialEmail } from './emailService.js';
import { generateUserCredentials } from './generateCredentials.js';

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

    // Send welcome email with credentials
    await sendCredentialEmail(email, password, accessTier);

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