// import { DataTypes, Model, Optional } from "sequelize";
// import sequelize from "../db";
// import bcrypt from "bcryptjs";

// interface UserAttributes {
//   id: string;
//   email: string;
//   password?: string;
//   subscriptionStatus: "basic" | "hobby" | "pro" | "business";
//   darkMode?: boolean;

//   // Usage tracking
//   dailyScansCount: number;
//   lastScanDate: string;

//   // Unified Billing Fields
//   paymentProvider: "stripe" | "apple" | "google" | "none"; // Track where they subscribed
//   providerCustomerId?: string; // Stripe Customer ID or Apple App Account Token
//   providerSubscriptionId?: string; // Stripe Sub ID or Apple Original Transaction ID

//   // Subscription Lifecycle
//   subscriptionEndDate?: Date; // Unified expiry date
//   cancelAtPeriodEnd: boolean; // true if they toggled "cancel" but still have time left

//   // Auth & Security
//   isVerified?: boolean;
//   verificationCode?: string;
//   isActive?: boolean;
// }

// interface UserCreationAttributes
//   extends Optional<
//     UserAttributes,
//     | "id"
//     | "dailyScansCount"
//     | "lastScanDate"
//     | "subscriptionStatus"
//     | "paymentProvider"
//     | "cancelAtPeriodEnd"
//   > {}

// class User
//   extends Model<UserAttributes, UserCreationAttributes>
//   implements UserAttributes
// {
//   public id!: string;
//   public email!: string;
//   public password!: string;
//   public subscriptionStatus!: "basic" | "hobby" | "pro" | "business";
//   public dailyScansCount!: number;
//   public lastScanDate!: string;
//   public darkMode!: boolean;

//   public paymentProvider!: "stripe" | "apple" | "none";
//   public providerCustomerId!: string;
//   public providerSubscriptionId!: string;
//   public subscriptionEndDate!: Date;
//   public cancelAtPeriodEnd!: boolean;

//   public isVerified!: boolean;
//   public verificationCode!: string;
//   public isActive!: boolean;

//   toJSON() {
//     const values = { ...this.get() };
//     delete values.password;
//     return values;
//   }

//   async comparePassword(candidatePassword: string) {
//     return bcrypt.compare(candidatePassword, this.password);
//   }
// }

// User.init(
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: { isEmail: true },
//     },
//     password: { type: DataTypes.STRING, allowNull: true },
//     subscriptionStatus: {
//       type: DataTypes.ENUM("basic", "hobby", "pro", "business"),
//       defaultValue: "basic",
//     },
//     dailyScansCount: { type: DataTypes.INTEGER, defaultValue: 0 },
//     lastScanDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
//     darkMode: { type: DataTypes.BOOLEAN, defaultValue: false },

//     paymentProvider: {
//       type: DataTypes.ENUM("stripe", "apple", "google", "none"),
//       defaultValue: "none",
//     },
//     providerCustomerId: { type: DataTypes.STRING, allowNull: true }, 
//     providerSubscriptionId: { type: DataTypes.STRING, allowNull: true },
//     subscriptionEndDate: { type: DataTypes.DATE, allowNull: true },
//     cancelAtPeriodEnd: { type: DataTypes.BOOLEAN, defaultValue: false },

//     isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
//     verificationCode: { type: DataTypes.STRING, allowNull: true },
//     isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
//   },
//   {
//     sequelize,
//     modelName: "User",
//     tableName: "users",
//     hooks: {
//       beforeCreate: async (user: User) => {
//         if (user.password) {
//           const salt = await bcrypt.genSalt(10);
//           user.password = await bcrypt.hash(user.password, salt);
//         }
//       },
//       beforeUpdate: async (user: User) => {
//         if (user.changed("password") && user.password) {
//           const salt = await bcrypt.genSalt(10);
//           user.password = await bcrypt.hash(user.password, salt);
//         }
//       },
//     },
//   }
// );

// export default User;
