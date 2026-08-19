import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Nath Water Service...');

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@123', salt);
  const deliveryPassword = await bcrypt.hash('Delivery@123', salt);
  const customerPassword = await bcrypt.hash('Customer@123', salt);

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nathwater.com' },
    update: {},
    create: {
      name: 'Nath Water Admin',
      email: 'admin@nathwater.com',
      phone: '9876543210',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('👤 Admin user created:', admin.email);

  // 2. Create Delivery Person
  const deliveryPerson = await prisma.user.upsert({
    where: { email: 'delivery@nathwater.com' },
    update: {},
    create: {
      name: 'Ramesh Kumar (Delivery)',
      email: 'delivery@nathwater.com',
      phone: '9876543211',
      password: deliveryPassword,
      role: 'DELIVERY_PERSON',
    },
  });
  console.log('🚚 Delivery person user created:', deliveryPerson.email);

  // 3. Create Sample Customer
  const customer = await prisma.user.upsert({
    where: { email: 'customer@gmail.com' },
    update: {},
    create: {
      name: 'Rahul Sharma',
      email: 'customer@gmail.com',
      phone: '9876543212',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });
  console.log('👤 Sample customer user created:', customer.email);

  // 4. Create Sample Customer Address
  await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: 'Rahul Sharma',
      phone: '9876543212',
      houseBuilding: 'Flat 402, Sunshine Apartments',
      street: 'MG Road',
      area: 'Shivaji Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411005',
      landmark: 'Near City Bank',
      type: 'HOME',
      isDefault: true,
    },
  });

  // 5. Seed Water Products
  const productsData = [
    {
      name: '20L Mineral Water Can',
      description: 'Purified mineral water in durable hygienic 20 Liter dispenser can.',
      capacity: '20L',
      price: 60.0,
      deliveryCharge: 10.0,
      unit: 'CAN',
      stock: 500,
    },
    {
      name: '25L Premium Water Can',
      description: 'Extra purified alkaline water in 25 Liter sturdy handle can.',
      capacity: '25L',
      price: 75.0,
      deliveryCharge: 15.0,
      unit: 'CAN',
      stock: 300,
    },
    {
      name: '1000L Water Tanker',
      description: 'Clean municipal grade fresh water tanker for commercial/residential bulk supply.',
      capacity: '1000L',
      price: 800.0,
      deliveryCharge: 200.0,
      unit: 'TANKER',
      stock: 50,
    },
    {
      name: '2000L Water Tanker',
      description: 'High volume potable water tanker for industrial and building requirements.',
      capacity: '2000L',
      price: 1500.0,
      deliveryCharge: 300.0,
      unit: 'TANKER',
      stock: 30,
    },
    {
      name: '5000L Heavy Water Tanker',
      description: 'Heavy capacity water supply tanker service for housing societies.',
      capacity: '5000L',
      price: 3200.0,
      deliveryCharge: 500.0,
      unit: 'TANKER',
      stock: 20,
    },
  ];

  for (const prod of productsData) {
    const createdProd = await prisma.product.create({
      data: prod,
    });
    // Create inventory record
    await prisma.inventory.create({
      data: {
        productId: createdProd.id,
        totalStock: prod.stock,
        availableStock: prod.stock,
        damagedStock: 0,
        returnedStock: 0,
      },
    });
  }
  console.log('💧 Water products and inventory created.');

  // 6. Seed Test Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderAmount: 100,
        maxDiscount: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'WATER50',
        discountType: 'FIXED',
        discountValue: 50,
        minOrderAmount: 300,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ],
  });
  console.log('🎟️ Coupons created.');

  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
