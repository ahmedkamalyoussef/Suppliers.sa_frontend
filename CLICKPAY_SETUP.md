# ClickPay Integration Setup Guide

This guide will help you set up ClickPay payment integration for your Supplier.sa project.

## Prerequisites

1. ClickPay merchant account
2. ClickPay API credentials
3. Next.js project with the ClickPay integration files

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# ClickPay Configuration
NEXT_PUBLIC_CLICKPAY_PROFILE_ID=your_profile_id_here
CLICKPAY_SERVER_KEY=your_server_key_here
NEXT_PUBLIC_CLICKPAY_CLIENT_KEY=your_client_key_here
NEXT_PUBLIC_CLICKPAY_BASE_URL=https://secure.clickpay.com.sa
```

## Getting ClickPay Credentials

1. **Log in to ClickPay Merchant Dashboard**

   - Visit: https://secure.clickpay.com.sa
   - Use your merchant credentials

2. **Get Your API Credentials**
   - Navigate to "API Settings" or "Integration"
   - Copy your Profile ID, Server Key, and Client Key
   - Note: Server Key should be kept secret (server-side only)
   - Client Key can be used on the frontend

## File Structure

The ClickPay integration includes the following files:

```
lib/clickpay/
├── types.ts          # TypeScript interfaces and types
├── config.ts         # Configuration and payment plans
├── service.ts        # ClickPay API service functions
└── utils.ts          # Utility functions

components/
├── ClickPayButton.tsx        # Payment button component
├── ClickPayPaymentForm.tsx   # Payment form component
├── PaymentModal.tsx          # Payment modal wrapper
├── PaymentSuccess.tsx        # Success page component
└── PaymentError.tsx          # Error handling component

app/api/payment/
├── callback/route.ts         # ClickPay callback handler
└── status/route.ts           # Transaction status API
```

## API Endpoints

### Payment Callback

- **URL**: `/api/payment/callback`
- **Method**: POST
- **Purpose**: Handles ClickPay payment callbacks

### Transaction Status

- **URL**: `/api/payment/status?transaction_id={id}`
- **Method**: GET
- **Purpose**: Check transaction status

## Testing

### Sandbox Environment

1. Use ClickPay sandbox credentials for testing
2. Test with ClickPay test cards
3. Verify callback handling

### Test Cards (Sandbox)

- **Successful Payment**: 4242424242424242
- **Declined Payment**: 4000000000000002
- **3D Secure**: 4000000000003220

## Production Setup

1. **Update Environment Variables**

   - Replace sandbox credentials with production credentials
   - Update base URL to production ClickPay endpoint

2. **SSL Certificate**

   - Ensure your domain has valid SSL certificate
   - ClickPay requires HTTPS for production

3. **Webhook Configuration**
   - Configure ClickPay webhooks to point to your callback URL
   - URL: `https://yourdomain.com/api/payment/callback`

## Payment Flow

1. **User selects plan** → ClickPay button triggers payment modal
2. **User fills form** → Customer details collected
3. **Payment request** → Sent to ClickPay API
4. **Redirect to ClickPay** → User completes payment
5. **Callback handling** → ClickPay sends result to your callback URL
6. **Success/Error** → User redirected to appropriate page

## Customization

### Payment Plans

Edit `lib/clickpay/config.ts` to modify payment plans:

```typescript
export const paymentPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 99,
    currency: "SAR",
    // ... other properties
  },
];
```

### Styling

All components use Tailwind CSS classes and can be customized by modifying the component files.

## Security Notes

1. **Server Key**: Never expose server key on frontend
2. **Validation**: Always validate payment data on server-side
3. **HTTPS**: Use HTTPS in production
4. **Webhooks**: Verify ClickPay webhook signatures

## Support

For ClickPay integration support:

- ClickPay Documentation: https://docs.clickpay.com.sa
- ClickPay Support: support@clickpay.com.sa

## Troubleshooting

### Common Issues

1. **"Profile ID not found"**

   - Check if profile ID is correct
   - Ensure you're using the right environment (sandbox/production)

2. **"Invalid server key"**

   - Verify server key is correct
   - Check if key has proper permissions

3. **Callback not working**

   - Ensure callback URL is accessible
   - Check if HTTPS is properly configured
   - Verify webhook configuration in ClickPay dashboard

4. **Payment form validation errors**
   - Check customer data format
   - Ensure required fields are filled
   - Verify phone number format (Saudi format)

### Debug Mode

Enable debug logging by adding to your environment:

```env
NEXT_PUBLIC_CLICKPAY_DEBUG=true
```

This will log additional information to help with troubleshooting.
