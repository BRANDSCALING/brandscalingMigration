# GoHighLevel Setup Checklist

## Step-by-Step Integration Guide

### Phase 1: Landing Page Setup

1. **Create Entry Tier Landing Page**
   - Go to Sites → Landing Pages → Create New
   - Name: "Brandscaling Entry - £49 Special"
   - Include product details, testimonials, urgency elements
   - Add Stripe checkout button for £49

2. **Create Elite Tier Landing Page**
   - Go to Sites → Landing Pages → Create New
   - Name: "Brandscaling Elite - £20k Mastermind"
   - Include premium positioning, exclusive benefits
   - Add Stripe checkout button for £20,000

3. **Update Homepage Buttons**
   - Replace current GHL links with your actual landing page URLs
   - Test both buttons redirect correctly

### Phase 2: Stripe Integration

1. **Configure Stripe Products**
   - Entry Tier: £49 one-time payment
   - Elite Tier: £20,000 one-time payment
   - Copy product IDs for webhook configuration

2. **Set Up Stripe Webhooks**
   - In Stripe Dashboard → Webhooks → Add endpoint
   - URL: `https://your-domain.com/api/webhook/stripe`
   - Events: `checkout.session.completed`

### Phase 3: GoHighLevel Automation Workflow

1. **Create New Automation**
   - Go to Marketing → Workflows → Create New
   - Name: "Brandscaling Purchase to Platform Access"
   - Trigger: Purchase Completed (Stripe)

2. **Add Webhook Action**
   - Add Action → Webhook
   - Method: POST
   - URL: `https://your-domain.com/api/webhook/ghl-purchase`
   - Headers: `Content-Type: application/json`
   - Body:
   ```json
   {
     "email": "{{contact.email}}",
     "firstName": "{{contact.first_name}}",
     "lastName": "{{contact.last_name}}",
     "product": "{{purchase.product_name}}",
     "amount": "{{purchase.amount}}",
     "orderId": "{{purchase.order_id}}",
     "customerId": "{{contact.id}}"
   }
   ```

3. **Add Email Action After Webhook**
   - Add Action → Send Email
   - Template: Create welcome email template (see below)
   - Delay: 2 minutes (allows webhook to process)

### Phase 4: Email Template Creation

1. **Create Welcome Email Template**
   - Go to Marketing → Templates → Email Templates
   - Name: "Brandscaling Platform Welcome"
   - Subject: "Your Brandscaling Platform Access is Ready!"

2. **Email Template Content**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Brandscaling!</h1>
  </div>
  
  <div style="padding: 30px; background: #f8fafc;">
    <h2 style="color: #1e40af;">Hi {{contact.first_name}},</h2>
    
    <p style="font-size: 16px; line-height: 1.6;">
      Your <strong>{{webhook.accessTier}}</strong> tier access is now active!
    </p>
    
    <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #0369a1; margin-top: 0;">🔐 Your Login Details:</h3>
      <p style="font-family: monospace; font-size: 14px; margin: 5px 0;">
        <strong>Email:</strong> {{webhook.loginCredentials.email}}<br>
        <strong>Password:</strong> {{webhook.loginCredentials.password}}<br>
        <strong>Login URL:</strong> <a href="{{webhook.loginCredentials.loginUrl}}">{{webhook.loginCredentials.loginUrl}}</a>
      </p>
    </div>
    
    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px;">
      <h3 style="color: #0369a1; margin-top: 0;">Next Steps:</h3>
      <ol style="color: #374151;">
        <li>Click the login link above</li>
        <li>Complete your Entrepreneurial DNA assessment</li>
        <li>Access your personalized content</li>
        <li>Start your transformation journey</li>
      </ol>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{webhook.loginCredentials.loginUrl}}" 
         style="background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Access Your Platform
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px;">
      If you have any questions, reply to this email or contact our support team.
    </p>
  </div>
  
  <div style="background: #1f2937; padding: 20px; text-align: center;">
    <p style="color: #9ca3af; margin: 0;">
      Welcome to your transformation journey!<br>
      <strong style="color: #e5e7eb;">The Brandscaling Team</strong>
    </p>
  </div>
</div>
```

### Phase 5: Testing & Validation

1. **Test Entry Purchase Flow**
   - Complete test purchase on Entry landing page
   - Verify webhook receives correct data
   - Check email is sent with correct credentials
   - Test login with provided credentials

2. **Test Elite Purchase Flow**
   - Repeat process for Elite tier
   - Verify higher access level is granted

### Phase 6: Platform Configuration

**I need these details from you:**

1. **Your Actual Domain**
   - What's your production domain? (to replace `https://your-domain.com`)

2. **Product Mapping**
   - What product names will Stripe send for Entry vs Elite?
   - Should be "entry" and "elite" or different names?

3. **GHL Webhook URL**
   - Confirm your webhook endpoint will be: `https://yourdomain.com/api/webhook/ghl-purchase`

4. **Email Domain**
   - What domain should welcome emails come from? (e.g., welcome@brandscaling.co.uk)

## Current Integration Status

✅ **Platform Ready**: Webhook endpoint functional and tested
✅ **Credential Generation**: Secure 12-character passwords created
✅ **Response Format**: Returns all data needed for GHL automation
✅ **Account Creation**: Users automatically added to platform database

## What Happens Next

Once you provide the domain and product details:
1. I'll update the webhook URLs in your platform
2. You'll configure the GHL automation with exact webhook URL
3. We'll test end-to-end: Landing → Purchase → Webhook → Email → Login

## Support During Setup

If you encounter any issues:
- Share screenshots of GHL automation setup
- Provide error messages from webhook responses
- Test with the curl commands I can provide for debugging

Ready to proceed with your domain and product configuration details?