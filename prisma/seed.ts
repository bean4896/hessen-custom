import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash passwords
  const demoPasswordHash = await bcrypt.hash('demo123', 12);
  const adminPasswordHash = await bcrypt.hash('admin123', 12);

  // Create a sample user
  const user = await prisma.user.upsert({
    where: { email: 'demo@hessen.com' },
    update: {},
    create: {
      email: 'demo@hessen.com',
      name: 'Demo User',
      phone: '+65 9123 4567',
      password: demoPasswordHash,
      role: 'customer',
    },
  });

  // Create an admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hessen.com' },
    update: {},
    create: {
      email: 'admin@hessen.com',
      name: 'Admin User',
      phone: '+65 9000 0000',
      password: adminPasswordHash,
      role: 'admin',
    },
  });

  // Create a sample product
  const product = await prisma.product.upsert({
    where: { id: 'bed-frame-001' },
    update: {},
    create: {
      id: 'bed-frame-001',
      name: 'Custom Bed Frame',
      description: 'Customizable bed frame with various material and finish options',
      basePrice: 1299,
      category: 'bed_frame',
      isActive: true,
    },
  });

  // Create a sample address
  const address = await prisma.address.create({
    data: {
      userId: user.id,
      type: 'shipping',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      phone: '+65 9123 4567',
      line1: '123 Demo Street',
      line2: 'Unit 01-01',
      city: 'Singapore',
      postalCode: '123456',
      country: 'Singapore',
      isDefault: true,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`📦 Created product: ${product.name}`);
  console.log(`👤 Created user: ${user.email}`);
  console.log(`🏠 Created address for user`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
