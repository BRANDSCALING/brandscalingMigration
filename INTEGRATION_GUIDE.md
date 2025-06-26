# GoHighLevel + Brandscaling Integration Guide

## Overview
This guide explains how to integrate your GoHighLevel landing pages with the Brandscaling platform for automated user account creation and credential delivery.

## Complete Purchase Flow

### 1. User Experience Flow
```
Brandscaling Homepage → Entry/Elite Button → GHL Landing Page → GHL Checkout → Payment → Webhook → Account Creation → Email Credentials
```

### 2. Button Configuration
The Brandscaling homepage buttons are configured to open your GHL landing pages:

**Entry Tier (£49):**
- Button: "Get Started" 
- Links to: `https://your-ghl-landing-page.com/entry`

**Elite Tier (£20k):**
- Button: "Apply Now"
- Links to: `https://your-ghl-landing-page.com/elite`

## GoHighLevel Setup

### 1. Landing Page URLs
Update the button URLs in `/client/src/pages/Landing.tsx`:
- Replace `https://your-ghl-landing-page.com/entry` with your actual Entry tier landing page
- Replace `https://your-ghl-landing-page.com/elite` with your actual Elite tier landing page

### 2. Webhook Configuration
Add this webhook URL to your GHL automation sequence:

**Webhook URL:** `https://your-brandscaling-domain.com/api/webhook/ghl-purchase`
**Method:** POST
**Trigger:** After successful payment/order completion

### 3. Required Webhook Data
Your GHL webhook must send this data structure:

```json
{
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe", 
  "product": "entry", // or "elite"
  "amount": "49.00", // or "20000.00"
  "orderId": "GHL_ORDER_123",
  "customerId": "GHL_CUSTOMER_456"
}
```

### 4. Product Mapping
The system maps GHL products to access tiers:
- `"entry"` or `"entry-tier"` → Entry tier access
- `"elite"` or `"elite-tier"` or `"mastermind"` → Elite tier access

## Stripe Integration in GHL

### 1. Payment Processing
- Configure Stripe in your GHL account
- Set up products for Entry (£49) and Elite (£20k) tiers
- Ensure webhook fires after successful payment

### 2. Customer Data Flow
```
GHL Form → Stripe Payment → GHL Webhook → Brandscaling API → User Account + Email
```

## Automated Account Creation

### 1. What Happens After Purchase
1. Customer completes payment in GHL
2. GHL sends webhook to Brandscaling
3. System generates secure 12-character password
4. User account created with appropriate access tier
5. Welcome email sent with login credentials
6. Customer can immediately sign in at `/auth`

### 2. Email Content
Professional welcome email includes:
- Login credentials (email + generated password)
- Access tier information
- Direct login link
- Feature overview based on tier

## Testing the Integration

### 1. Test Webhook
Use this endpoint to test the integration:
```bash
curl -X POST https://your-domain.com/api/webhook/ghl-purchase \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "product": "entry",
    "amount": "49.00",
    "orderId": "TEST_123",
    "customerId": "TEST_456"
  }'
```

### 2. Expected Response
```json
{
  "success": true,
  "message": "Purchase processed and credentials sent",
  "userId": "user_1234567890_abc123",
  "accessTier": "entry"
}
```

## Security Considerations

### 1. Webhook Security
- Add webhook signature verification
- Validate all incoming data
- Rate limit webhook endpoint

### 2. Credential Security
- Passwords are 12-character alphanumeric + symbols
- Store hashed passwords in production
- Implement password reset functionality

## Troubleshooting

### 1. Common Issues
- **Webhook not firing:** Check GHL automation triggers
- **Invalid product mapping:** Verify product names match expected values
- **Email not sending:** Check Resend domain verification
- **User can't login:** Verify credentials were generated correctly

### 2. Debug Logs
Check server logs for:
- `GHL Webhook received:` - Incoming webhook data
- `User account created successfully` - Account creation confirmation
- `Welcome email sent successfully` - Email delivery status

## Next Steps

1. **Update Button URLs:** Replace placeholder URLs with your actual GHL landing pages
2. **Configure GHL Webhook:** Add the webhook URL to your GHL automation
3. **Test Integration:** Process a test purchase to verify the complete flow
4. **Monitor Logs:** Check that webhooks are received and processed correctly
5. **Verify Emails:** Ensure welcome emails are delivered successfully

## Support

For integration issues:
1. Check webhook logs in GHL dashboard
2. Verify webhook payload matches expected format
3. Test webhook endpoint directly
4. Check email delivery in Resend dashboard