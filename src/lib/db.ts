require('dotenv').config();
import { Sequelize } from 'sequelize';
import pg from 'pg';
// import SearchHistory from './models/SearchHistory';
import User from './models/User';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false, 
  dialectOptions: {
    // Keep SSL logic: Some internal servers don't require SSL over VPN, 
    // but Render and most cloud hosts do.
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    // VPN specific: Increase connection timeout
    connectTimeout: 60000 
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000, // How long to wait for a connection before throwing error
    idle: 10000     // How long to keep a connection alive while unused
  }
});

// User.hasMany(SearchHistory, { foreignKey: 'userId', as: 'history' });
// SearchHistory.belongsTo(User, { foreignKey: 'userId' });

export const connectDB = async () => {
  try {
    // authenticate() verifies the credentials and network path
    await sequelize.authenticate();

    //  await sequelize.sync({ force: true });
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.error('❌ VPN/Database Connection Error:', err);
    // Log more detail to see if it's a timeout or a credential issue
  }
};

export default sequelize;