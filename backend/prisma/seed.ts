import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Nath Water Service...');

  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('Admin@123', salt);
  const deliveryPassword = await bcrypt.hash('Delivery@123', salt);
  const customerPassword = await bcrypt.hash('Customer@123', salt);

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nathwater.com' },
    update: {},
    create: {
      name: 'Nath Admin',
      email: 'admin@nathwater.com',
      phone: '9876543210',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`👤 Admin user ready: ${admin.email}`);

  // 2. Delivery Person User
  const delivery = await prisma.user.upsert({
    where: { email: 'delivery@nathwater.com' },
    update: {},
    create: {
      name: 'Ramesh Delivery',
      email: 'delivery@nathwater.com',
      phone: '9876543211',
      password: deliveryPassword,
      role: 'DELIVERY_PERSON',
    },
  });
  console.log(`🚚 Delivery person ready: ${delivery.email}`);

  // 3. Customer User
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
  console.log(`👤 Sample customer ready: ${customer.email}`);

  // 4. Sample Address for Customer
  const existingAddress = await prisma.address.findFirst({ where: { userId: customer.id } });
  if (!existingAddress) {
    await prisma.address.create({
      data: {
        userId: customer.id,
        fullName: 'Rahul Sharma',
        phone: '9876543212',
        houseBuilding: 'Flat 402, Sunshine Heights',
        street: 'FC Road',
        area: 'Shivaji Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411005',
        type: 'HOME',
        isDefault: true,
      },
    });
  }

  // 5. Water Products & Inventory
  const products = [
    {
      name: '20L Mineral Water Can',
      description: 'Pure 20 Litre chilled RO + UV mineral water delivery to home or office.',
      capacity: '20L',
      price: 60,
      deliveryCharge: 10,
      stock: 100,
      unit: 'CAN',
    },
    {
      name: '25L Premium Mineral Water Can',
      description: 'Heavy-duty 25 Litre pure drinking water jar with tap handle.',
      capacity: '25L',
      price: 75,
      deliveryCharge: 15,
      stock: 80,
      unit: 'CAN',
    },
    {
      name: '1000L Water Tanker Supply',
      description: '1000 Litre fresh groundwater tanker supply for commercial & residential buildings.',
      capacity: '1000L',
      price: 800,
      deliveryCharge: 150,
      stock: 10,
      unit: 'TANKER',
    },
    {
      name: '2000L Commercial Water Tanker',
      description: '2000 Litre express water tanker delivery for hotels, societies & construction.',
      capacity: '2000L',
      price: 1500,
      deliveryCharge: 200,
      stock: 8,
      unit: 'TANKER',
    },
    {
      name: '5000L Industrial Water Tanker',
      description: '5000 Litre large capacity water tanker for bulk industrial requirements.',
      capacity: '5000L',
      price: 3200,
      deliveryCharge: 350,
      stock: 5,
      unit: 'TANKER',
    },
  ];

  for (const prod of products) {
    const existing = await prisma.product.findFirst({ where: { name: prod.name } });
    if (!existing) {
      const createdProd = await prisma.product.create({ data: prod });
      await prisma.inventory.create({
        data: {
          productId: createdProd.id,
          totalStock: prod.stock,
          availableStock: prod.stock,
        },
      });
    }
  }

  // 6. Coupons
  const coupons = [
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
      maxDiscount: 50,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
