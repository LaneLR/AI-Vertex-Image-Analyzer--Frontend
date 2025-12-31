const bcrypt = require('bcryptjs');
const User = require('../lib/models/User'); 
const { connectDB } = require('../lib/db');
require('dotenv').config(); 

async function createTestUser() {
  try {
    // 1. Connect to the Database
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    connectDB();
    console.log('✅ Connected to Database for seeding users...');

    const existingUser = await User.findOne({ email: 'test@flipfinder.com' });
    if (existingUser) {
      console.log('⚠️ Test user already exists. Skipping creation.');
    } else {
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await User.create({
        email: 'test@flipfinder.com',
        password: hashedPassword,
        subscriptionStatus: 'pro',
        dailyScansCount: 0,
        lastScanDate: null,
        darkMode: false,
        paymentProvider: 'none',
        providerCustomerId: null,
        providerSubscriptionId: null,
        subscriptionEndDate: null,
        cancelAtPeriodEnd: false,
        isVerified: true,
        verificationCode: null,
      });

      console.log('🚀 Test user created successfully!');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    process.exit(1);
  }
}

createTestUser();