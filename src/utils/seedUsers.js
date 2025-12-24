// seed-user.js
const bcrypt = require('bcrypt');
const User = require('../lib/models/User'); // Adjust path to your User model

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUser = await User.create({
      email: 'test@flipfinder.com',
      password: hashedPassword,
      isSubscriber: true, // Giving your test user Pro access
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    process.exit(1);
  }
}

createTestUser();