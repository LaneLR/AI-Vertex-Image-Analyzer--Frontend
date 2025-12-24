require('dotenv').config();
import { Sequelize } from 'sequelize';
import pg from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  dialectModule: pg, 
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // REQUIRED FOR RENDER
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;