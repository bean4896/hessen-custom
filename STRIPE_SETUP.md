# Stripe Payment Integration Setup

## 1. Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com) and create an account
2. Complete the account setup and verification process

## 2. Get API Keys
1. Go to the Stripe Dashboard
2. Navigate to "Developers" > "API keys"
3. Copy your **Publishable key** (starts with `pk_test_...`)
4. Copy your **Secret key** (starts with `sk_test_...`)

## 3. Configure Environment Variables
Create a `.env` file in your project root and add:

```env
# Stripe Configuration
STRIPE_PUBLIC_KEY="pk_test_your_publishable_key_here"
STRIPE_SECRET_KEY="sk_test_your_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
```

## 4. Set Up Webhooks (Optional for Development)
1. In Stripe Dashboard, go to "Developers" > "Webhooks"
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://your-domain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret

## 5. Test the Integration
1. Start your development server: `pnpm dev`
2. Add items to cart on the home page
3. Go to checkout and fill in the form
4. **Guest Checkout**: You can complete the purchase without signing in - an account will be created automatically
5. Click "Complete Order" - you'll be redirected to Stripe Checkout
6. Use Stripe test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - Use any future date for expiry and any 3-digit CVC

## 6. Production Setup
When ready for production:
1. Switch to live mode in Stripe Dashboard
2. Update environment variables with live keys
3. Set up production webhook endpoints
4. Update `NEXT_PUBLIC_APP_URL` to your production domain

## Features Included
✅ Stripe Checkout Sessions  
✅ Payment processing  
✅ Order status updates via webhooks  
✅ Order success page  
✅ Receipt generation  
✅ Multi-currency support (SGD)  
✅ Tax and shipping calculations  
✅ Address collection  
✅ **Guest Checkout** - No sign-in required  
✅ **Auto Account Creation** - Accounts created for guest users  
✅ **Guest User UI** - Special messaging for non-signed-in users  

## Test Cards
- **Visa**: `4242 4242 4242 4242`
- **Visa (debit)**: `4000 0566 5566 5556`
- **Mastercard**: `5555 5555 5555 4444`
- **American Express**: `3782 822463 10005`
- **Declined**: `4000 0000 0000 0002`

All test cards use:
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)
