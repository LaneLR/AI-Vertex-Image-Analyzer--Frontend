import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import bcrypt from 'bcryptjs';

// Define attributes interface
interface UserAttributes {
  id: string;
  email: string;
  password?: string;
  firstName?: string;
  subscriptionStatus: 'basic' | 'pro';
  dailyScansCount: number;
  lastScanDate: string;
  stripeCustomerId?: string;
  isVerified?: boolean;
  verificationCode?: string;
}

// Define creation attributes
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'dailyScansCount' | 'lastScanDate' | 'subscriptionStatus'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public subscriptionStatus!: 'basic' | 'pro';
  public dailyScansCount!: number;
  public lastScanDate!: string;
  public stripeCustomerId!: string;
  public isVerified!: boolean;
  public verificationCode!: string;

  // Security: Remove password from JSON responses
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }

  async comparePassword(candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('basic', 'pro'),
    defaultValue: 'basic'
  },
  dailyScansCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastScanDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  sequelize,
  modelName: 'User',
  hooks: {
    beforeCreate: async (user: User) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user: User) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

export default User;