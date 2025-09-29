# Vercel Environment Variables Setup

## Production Environment Variables for hessen-custom.vercel.app

Copy these environment variables to your Vercel project settings:

### Required Variables

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# Next.js Configuration
NEXTAUTH_URL="https://hessen-custom.vercel.app"
NEXTAUTH_SECRET="your-production-secret-key-min-32-chars-long"

# Ecommerce Configuration
NEXT_PUBLIC_CURRENCY="SGD"
NEXT_PUBLIC_TAX_RATE="0.09"
NEXT_PUBLIC_SHIPPING_FREE_THRESHOLD="500"
NEXT_PUBLIC_SHIPPING_COST="50"

# Payment Configuration (Replace with your actual Stripe keys)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_live_your_live_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_live_your_live_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_production_webhook_secret"

# App Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://hessen-custom.vercel.app"
```

### Optional Variables

```bash
# Cloudinary Configuration (for image hosting)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_production_cloud_name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your_production_api_key"
NEXT_PUBLIC_CLOUDINARY_API_SECRET="your_production_api_secret"

# Email Configuration (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-production-email@gmail.com"
SMTP_PASS="your-app-password"

# Redis Configuration (for caching - use Upstash Redis on Vercel)
REDIS_URL="redis://username:password@host:port"
```

## Setup Instructions

### 1. Database Setup
Choose one of these options:

**Option A: Vercel Postgres (Recommended)**
1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection string to `DATABASE_URL`

**Option B: Neon (Free tier available)**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

**Option C: Supabase**
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string to `DATABASE_URL`

### 2. Stripe Configuration
1. Go to [stripe.com](https://stripe.com) dashboard
2. Switch to "Live mode" (toggle in top left)
3. Go to Developers → API keys
4. Copy your live publishable and secret keys
5. Go to Developers → Webhooks
6. Create a new endpoint for `https://hessen-custom.vercel.app/api/webhooks/stripe`
7. Copy the webhook secret

### 3. NextAuth Secret
Generate a secure secret:
```bash
openssl rand -base64 32
```

### 4. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add all environment variables in Project Settings → Environment Variables
4. Deploy!

## Post-Deployment Setup

After deployment, you'll need to:

1. **Run Database Migrations:**
   ```bash
   # Connect to your Vercel project and run:
   npx prisma migrate deploy
   ```

2. **Seed the Database:**
   ```bash
   npx prisma db seed
   ```

3. **Update Stripe Webhook URL:**
   - Go to Stripe Dashboard → Webhooks
   - Update the endpoint URL to your Vercel domain

## Testing

Once deployed, test these features:
- ✅ Homepage loads
- ✅ Product configurator works
- ✅ Add to cart functionality
- ✅ Checkout process
- ✅ Stripe payment integration
- ✅ Order success page
- ✅ Admin panel access

## Troubleshooting

**Build Fails:**
- Check all environment variables are set
- Ensure DATABASE_URL is correct
- Verify Stripe keys are valid

**Database Issues:**
- Run `npx prisma generate` locally
- Check database connection string
- Ensure database is accessible from Vercel

**Payment Issues:**
- Verify Stripe keys are in live mode
- Check webhook endpoint is configured
- Test with Stripe test cards first


