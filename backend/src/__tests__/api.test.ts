import { prisma } from '../config/db';
import { generateToken } from '../utils/jwt';
import { generateOTP } from '../utils/otp';
import { processRecurringSubscriptions } from '../services/subscriptionScheduler';

async function runTests() {
  console.log('🧪 Starting Nath Water Service Automated Audit Tests...');

  try {
    // 1. Database Connection & Seed Check
    const usersCount = await prisma.user.count();
    const productsCount = await prisma.product.count();
    const couponsCount = await prisma.coupon.count();

    console.log(`✅ DB Check: Users=${usersCount}, Products=${productsCount}, Coupons=${couponsCount}`);

    // 2. Auth JWT Token Generation Check
    const testToken = generateToken({
      userId: 'test-user-id',
      email: 'test@nathwater.com',
      role: 'CUSTOMER',
    });
    if (!testToken) throw new Error('JWT token generation failed');
    console.log('✅ Auth Check: JWT Token generated successfully');

    // 3. OTP Generator Check
    const otp = generateOTP();
    if (otp.length !== 4) throw new Error('OTP generator must produce 4-digit code');
    console.log(`✅ OTP Check: 4-digit Delivery OTP generated (${otp})`);

    // 4. Product Query Check
    const products = await prisma.product.findMany({ where: { isAvailable: true } });
    if (products.length === 0) throw new Error('No available products found');
    console.log(`✅ Product Catalog Check: ${products.length} products loaded`);

    // 5. Subscription Scheduler Process Check
    await processRecurringSubscriptions();
    console.log('✅ Subscription Scheduler Check: Processed recurring subscriptions successfully');

    console.log('\n🎉 ALL AUTOMATED SYSTEM AUDIT TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (error) {
    console.error('❌ Audit Test Failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
