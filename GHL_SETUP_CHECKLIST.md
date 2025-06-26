# GoHighLevel Setup Checklist

## 🎯 Complete Integration Setup

### ✅ Phase 1: Brandscaling Platform (COMPLETE)
- [x] Purchase-to-credentials system implemented
- [x] Email service configured with Resend
- [x] Webhook endpoint created: `/api/webhook/ghl-purchase`
- [x] Entry/Elite buttons link to GHL pages
- [x] Signup functionality removed
- [x] Auth page shows purchase guidance

### 🔧 Phase 2: GoHighLevel Configuration (YOUR NEXT STEPS)

#### 1. Landing Page Setup
- [ ] Create Entry tier landing page in GHL
- [ ] Create Elite tier landing page in GHL  
- [ ] Update button URLs in Landing.tsx:
  - Replace `https://your-ghl-entry-landing.com`
  - Replace `https://your-ghl-elite-landing.com`

#### 2. Stripe Integration in GHL
- [ ] Connect Stripe account to GHL
- [ ] Create Entry product (£49)
- [ ] Create Elite product (£20k)
- [ ] Set up checkout forms

#### 3. Webhook Configuration
- [ ] Add webhook URL to GHL automation: `https://your-brandscaling-domain.com/api/webhook/ghl-purchase`
- [ ] Configure webhook to trigger after successful payment
- [ ] Map webhook data fields (see required format below)

### 📋 Required Webhook Data Format

Your GHL webhook must send this exact structure:

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

### 🔄 Complete Flow Verification

1. **Customer Journey:**
   ```
   Brandscaling Homepage → Click Entry/Elite → GHL Landing Page → GHL Checkout → Payment → Webhook → Account Creation → Email with Credentials
   ```

2. **Test the Flow:**
   - Click Entry button → Lands on your GHL page ✓
   - Complete purchase → Webhook fires ✓
   - Check email → Credentials received ✓
   - Login at /auth → Access granted ✓

### 🧪 Testing Commands

Test webhook locally:
```bash
curl -X POST http://localhost:5000/api/webhook/ghl-purchase \
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

Expected response:
```json
{
  "success": true,
  "message": "Purchase processed and credentials sent",
  "userId": "user_xxx_xxx",
  "accessTier": "entry"
}
```

### 🚀 Go Live Steps

1. Update button URLs with real GHL landing pages
2. Deploy Brandscaling platform to production
3. Update GHL webhook to production URL
4. Test complete purchase flow
5. Verify email delivery
6. Monitor webhook logs

### 📞 Support & Troubleshooting

**Common Issues:**
- Webhook not receiving data → Check GHL automation triggers
- Invalid product mapping → Ensure product field matches "entry" or "elite"
- Email not sending → Verify Resend domain verification
- User can't login → Check credentials generation logs

**Debug Logs Location:**
- Server logs: Check console for "GHL Webhook received:" messages
- Email logs: Check Resend dashboard for delivery status
- User creation: Check database for new user records

### ✨ What's Already Working

- ✅ Secure 12-character password generation
- ✅ Professional welcome emails with credentials
- ✅ Automatic user account creation
- ✅ Tier-based access control
- ✅ Sign-in only authentication (no signup)
- ✅ Complete webhook endpoint ready for GHL

**Your platform is 100% ready for GoHighLevel integration. Just need to:**
1. Create the GHL landing pages
2. Update the button URLs
3. Configure the webhook in GHL automation

The entire purchase-to-access system is fully functional!