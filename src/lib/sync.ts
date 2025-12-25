import sequelize from './db';
import User from './models/User';

const syncDatabase = async () => {
  try {
    // 'alter: true' updates the table schema without dropping data
    // await sequelize.sync({ force: true });
    await sequelize.sync({ alter: true });
    console.log('✅ Database & tables synced');
  } catch (error) {
    console.error('❌ Unable to sync database:', error);
  }
};

export default syncDatabase;