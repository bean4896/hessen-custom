# Hessen Custom Furniture

A modern, full-stack e-commerce platform for custom furniture configuration and ordering. Built with Next.js 15, TypeScript, and Stripe payments.

![Hessen Custom Furniture](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?style=for-the-badge&logo=stripe)

## 🏠 Overview

Hessen Custom Furniture is an innovative e-commerce platform that allows customers to configure and order custom furniture pieces online. The platform features a sophisticated product configurator, secure payment processing, and comprehensive order management.

### Key Features

- 🎨 **Interactive Product Configurator** - Real-time customization with visual previews
- 💳 **Secure Payment Processing** - Integrated Stripe payments with guest checkout
- 🛒 **Smart Cart Management** - Persistent cart with configuration preservation
- 👤 **User Authentication** - NextAuth.js with JWT sessions
- 📱 **Responsive Design** - Mobile-first approach with modern UI
- 🔧 **Admin Panel** - Order and customer management for administrators
- 💾 **Saved Configurations** - Users can save and reload product configurations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hessen-custom
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/hessen_custom"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   
   # App Configuration
   NEXT_PUBLIC_CURRENCY="SGD"
   NEXT_PUBLIC_TAX_RATE="0.09"
   NEXT_PUBLIC_SHIPPING_FREE_THRESHOLD="500"
   NEXT_PUBLIC_SHIPPING_COST="50"
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL (using Docker)
   docker-compose up -d
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 User Journey

### For Customers

1. **Browse Products** - Explore furniture categories (Bedframes, Kitchen, Sideboards)
2. **Configure** - Use the interactive configurator to customize materials, sizes, and finishes
3. **Add to Cart** - Save configured items with all customization details
4. **Checkout** - Complete purchase with guest or registered account
5. **Order Tracking** - Receive confirmation and track order status

### For Administrators

1. **Access Admin Panel** - Login with admin credentials
2. **View Orders** - Monitor all customer orders and status
3. **Manage Customers** - View customer information and order history
4. **Track Payments** - Monitor Stripe payment status

## 🛠️ Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed database with sample data
pnpm db:studio    # Open Prisma Studio
pnpm db:reset     # Reset database (development only)

# Deployment
pnpm deploy       # Deploy to production
```

## 📁 Project Structure

```
hessen-custom/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── components/     # Reusable components
│   │   └── page.tsx        # Main pages
│   ├── components/         # UI components
│   │   └── ui/            # shadcn/ui components
│   ├── features/          # Feature-based modules
│   │   ├── auth/          # Authentication
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Checkout flow
│   │   └── product/       # Product configuration
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   └── shared/            # Shared components and utilities
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── docker/               # Docker configuration
```

## 🔐 Authentication

The platform supports both guest checkout and registered user accounts:

- **Guest Users**: Can complete purchases without creating an account
- **Registered Users**: Can save configurations, track orders, and manage profile
- **Admin Users**: Have access to the admin panel for order management

### Default Admin Account
- **Email**: admin@hessen.com
- **Password**: admin123

## 💳 Payment Processing

Integrated with Stripe for secure payment processing:

- **Payment Methods**: Credit cards, debit cards
- **Guest Checkout**: No account required for purchases
- **Automatic Account Creation**: Guest users get accounts created after purchase
- **Order Confirmation**: Email confirmations and order tracking

## 🎨 Product Configuration

The product configurator supports:

- **Materials**: Various wood types and finishes
- **Sizes**: Multiple size options for each product
- **Design Elements**: Headboards, body styles, and finishes
- **Optional Add-ons**: Additional features and accessories
- **Real-time Pricing**: Dynamic price calculation based on selections
- **Saved Configurations**: Users can save and reload configurations

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive design for tablet screens
- **Desktop Experience**: Full-featured desktop interface
- **Touch-Friendly**: Optimized for touch interactions

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Set up production database**
   ```bash
   npx prisma migrate deploy
   ```

3. **Configure environment variables**
   - Update all environment variables for production
   - Set up Stripe production keys
   - Configure production database URL

4. **Deploy to your hosting platform**
   - Vercel (recommended for Next.js)
   - AWS
   - DigitalOcean
   - Or any Node.js hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email**: support@hessen.sg
- **Documentation**: [TECHSTACK.md](./TECHSTACK.md)
- **Issues**: Create an issue in the repository

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Payments powered by [Stripe](https://stripe.com/)
- Database managed with [Prisma](https://prisma.io/)
- Authentication with [NextAuth.js](https://next-auth.js.org/)

---

**Hessen Custom Furniture** - Crafting your perfect furniture experience online.