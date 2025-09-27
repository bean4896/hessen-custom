# Tech Stack & Features Documentation

## 🏗️ Architecture Overview

Hessen Custom Furniture is built using a modern, full-stack architecture with Next.js 15 as the foundation, implementing a feature-based modular structure for scalability and maintainability.

## 🛠️ Core Technologies

### Frontend Framework
- **Next.js 15.3.5** - React framework with App Router
- **TypeScript 5.8.3** - Type-safe development
- **React 18** - Component-based UI library
- **Tailwind CSS 4** - Utility-first CSS framework

### Backend & Database
- **Next.js API Routes** - Serverless backend functions
- **PostgreSQL** - Primary database
- **Prisma ORM** - Database toolkit and query builder
- **Docker** - Containerized database setup

### Authentication & Security
- **NextAuth.js** - Authentication framework
- **JWT Sessions** - Stateless authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Payment Processing
- **Stripe** - Payment gateway integration
- **Stripe Elements** - Embedded payment forms
- **Payment Intents** - Secure payment processing
- **Webhooks** - Real-time payment notifications

### State Management
- **React Context API** - Global state management
- **Local Storage** - Client-side persistence
- **Zustand** - Lightweight state management (for cart)

### UI Components & Styling
- **shadcn/ui** - Pre-built component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **Tailwind CSS** - Styling and responsive design

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database management GUI

## 📊 Database Schema

### Core Models

#### User Model
```typescript
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  phone     String?
  password  String
  role      String   @default("customer")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  addresses Address[]
  orders    Order[]
  accounts  Account[]
  sessions  Session[]
}
```

#### Product Model
```typescript
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  basePrice   Decimal  @db.Decimal(10, 2)
  category    String
  images      String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  variants ProductVariant[]
  orderItems OrderItem[]
}
```

#### Order Model
```typescript
model Order {
  id                   String   @id @default(uuid())
  orderNumber          String   @unique
  status               String   @default("pending")
  paymentStatus        String   @default("pending")
  subtotal             Decimal  @db.Decimal(10, 2)
  tax                  Decimal  @db.Decimal(10, 2)
  shipping             Decimal  @db.Decimal(10, 2)
  total                Decimal  @db.Decimal(10, 2)
  stripePaymentIntentId String? @unique
  paidAt               DateTime?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  // Relations
  user            User         @relation(fields: [userId], references: [id])
  shippingAddress Address      @relation("ShippingAddress", fields: [shippingAddressId], references: [id])
  billingAddress  Address      @relation("BillingAddress", fields: [billingAddressId], references: [id])
  items           OrderItem[]
}
```

#### OrderItem Model
```typescript
model OrderItem {
  id           String  @id @default(uuid())
  orderId      String
  productId    String
  variantId    String?
  quantity     Int
  price        Decimal @db.Decimal(10, 2)
  total        Decimal @db.Decimal(10, 2)
  configuration Json?  // Product configuration as JSON
  
  // Relations
  order   Order          @relation(fields: [orderId], references: [id])
  product Product        @relation(fields: [productId], references: [id])
  variant ProductVariant? @relation(fields: [variantId], references: [id])
}
```

## 🎨 Feature Implementation

### 1. Product Configuration System

#### Configuration Structure
```typescript
interface ProductConfiguration {
  material: string;        // e.g., "Oak Wood", "Pine"
  size: string;           // e.g., "Queen", "King"
  headboard: string;      // e.g., "Upholstered", "Wooden"
  bedframeBody: string;   // e.g., "Platform", "Traditional"
  finishColour: string;   // e.g., "Natural", "Dark Oak"
  optional: string[];     // e.g., ["Drawer Storage", "USB Port"]
}
```

#### Dynamic Pricing
- Base price calculation from product options
- Real-time price updates during configuration
- Tax calculation (9% GST)
- Shipping cost calculation

### 2. Shopping Cart System

#### Cart State Management
```typescript
interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  configuration?: ProductConfiguration;
}
```

#### Features
- **Persistent Storage**: Cart data saved to localStorage
- **Configuration Preservation**: Full product configurations stored
- **Quantity Management**: Add/remove items with validation
- **Price Calculation**: Real-time total updates

### 3. Payment Integration

#### Stripe Integration
```typescript
// Payment Intent Creation
const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmountInCents,
  currency: 'SGD',
  metadata: {
    cartItems: JSON.stringify(items),
  },
});
```

#### Features
- **Embedded Forms**: Stripe Elements for secure card input
- **Guest Checkout**: No account required
- **Payment Intent**: Secure payment processing
- **Webhook Handling**: Real-time payment status updates

### 4. User Authentication

#### NextAuth.js Configuration
```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Password verification with bcrypt
        const isValid = await bcrypt.compare(
          credentials.password, 
          user.password
        );
        return isValid ? user : null;
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
};
```

### 5. Admin Panel

#### Role-Based Access Control
```typescript
// Admin access check
const isAdmin = session?.user && (
  session.user.email === 'admin@hessen.com' || 
  session.user.role === 'admin'
);
```

#### Features
- **Order Management**: View all orders and status
- **Customer Management**: Customer information and history
- **Payment Tracking**: Stripe payment status monitoring

## 🔧 API Architecture

### API Routes Structure

#### Authentication Endpoints
- `POST /api/auth/[...nextauth]` - NextAuth.js handler
- `GET /api/auth/session` - Session management

#### Order Management
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/session/[sessionId]` - Get order by payment intent

#### Admin Endpoints
- `GET /api/admin/orders` - Get all orders (admin only)
- `GET /api/admin/customers` - Get all customers (admin only)

#### Payment Processing
- `POST /api/create-payment-intent-from-cart` - Create payment intent
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

### Error Handling
```typescript
// Standardized error response
return NextResponse.json({
  error: 'Error message',
  details: error instanceof Error ? error.message : 'Unknown error'
}, { status: 500 });
```

## 🎯 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js Image component with WebP support
- **Lazy Loading**: Component-level lazy loading
- **Memoization**: React.memo and useMemo for expensive operations

### Backend Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Prisma connection management
- **Caching**: Strategic caching for frequently accessed data
- **API Optimization**: Efficient data fetching and minimal payloads

## 🔒 Security Implementation

### Data Protection
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: Comprehensive form validation
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React's built-in XSS protection

### Payment Security
- **PCI Compliance**: Stripe handles sensitive payment data
- **HTTPS Enforcement**: Secure data transmission
- **Webhook Verification**: Stripe webhook signature validation

## 📱 Responsive Design

### Breakpoint Strategy
```css
/* Mobile First Approach */
.container {
  @apply px-4 sm:px-6 lg:px-8;
}

.grid {
  @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
}
```

### Component Responsiveness
- **Mobile**: Single column layout, touch-optimized
- **Tablet**: Two-column layout, larger touch targets
- **Desktop**: Multi-column layout, hover states

## 🧪 Testing Strategy

### Testing Tools
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Cypress** - End-to-end testing
- **Prisma Test Environment** - Database testing

### Test Coverage
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete user journey testing
- **Payment Testing**: Stripe test mode integration

## 🚀 Deployment Configuration

### Environment Variables
```env
# Production Configuration
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@host:5432/db
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Build Optimization
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

## 📈 Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: API response times
- **User Analytics**: Usage patterns and behavior

### Business Metrics
- **Order Tracking**: Conversion rates and order completion
- **Payment Success**: Stripe payment success rates
- **User Engagement**: Configuration saves and cart abandonment

## 🔄 CI/CD Pipeline

### Automated Workflows
- **Code Quality**: ESLint and Prettier checks
- **Type Checking**: TypeScript compilation
- **Testing**: Automated test suite execution
- **Deployment**: Automated deployment to production

### Quality Gates
- **Code Coverage**: Minimum 80% test coverage
- **Performance Budget**: Bundle size and load time limits
- **Security Scanning**: Dependency vulnerability checks

---

This technical documentation provides a comprehensive overview of the Hessen Custom Furniture platform's architecture, implementation details, and technical decisions. For implementation-specific details, refer to the source code and inline documentation.
