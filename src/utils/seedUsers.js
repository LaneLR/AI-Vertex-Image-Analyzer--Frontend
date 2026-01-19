const User = require('../lib/models/User').default || require('../lib/models/User'); 
const sequelize = require('../lib/db').default || require('../lib/db'); // Import the sequelize instance
require('dotenv').config(); 

async function createTestUser() {
  try {
    // 1. Check for Database URL
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    // 2. Ensure connection and Sync
    // { alter: true } ensures the table matches your model exactly on Render
    await sequelize.authenticate();
    await sequelize.sync({ alter: false }); 

    const testEmail = 'test@flipsavvy.com';

    // 3. Find or Create User
    // We use findOne with Sequelize syntax
    const existingUser = await User.findOne({ where: { email: testEmail } });

    if (existingUser) {
      await existingUser.update({
        subscriptionStatus: 'pro',
        isVerified: true,
        isActive: true
      });
    } else {
      // NOTE: Do NOT hash the password here. 
      // Your Sequelize model has a 'beforeCreate' hook that will do it for you.
      await User.create({
        email: testEmail,
        password: 'password123', // Will be hashed by model hooks
        subscriptionStatus: 'pro',
        dailyScansCount: 0,
        lastScanDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        darkMode: false,
        paymentProvider: 'none',
        providerCustomerId: 'seed_cust_123',
        providerSubscriptionId: 'seed_sub_123',
        subscriptionEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
        cancelAtPeriodEnd: false,
        isVerified: true,
        isActive: true,
        verificationCode: null,
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding user:', error);
    process.exit(1);
  }
}

createTestUser();