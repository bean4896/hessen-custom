#!/bin/bash

# Hessen Custom Ecommerce Setup Script
echo "🚀 Setting up Hessen Custom Ecommerce Application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please update the values as needed."
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm dlx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
pnpm dlx prisma migrate dev --name init

# Seed database (if seed file exists)
if [ -f prisma/seed.ts ]; then
    echo "🌱 Seeding database..."
    pnpm dlx prisma db seed
fi

echo "✅ Setup complete!"
echo ""
echo "🎉 Your Hessen Custom Ecommerce application is ready!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Run 'pnpm dev' to start the development server"
echo "3. Visit http://localhost:3000 to see your application"
echo "4. Visit http://localhost:8080 for database admin (Adminer)"
echo ""
echo "🔧 Useful commands:"
echo "- pnpm dev          # Start development server"
echo "- pnpm build        # Build for production"
echo "- pnpm prisma studio # Open Prisma Studio"
echo "- docker-compose logs # View Docker logs"
echo "- docker-compose down # Stop Docker services"
