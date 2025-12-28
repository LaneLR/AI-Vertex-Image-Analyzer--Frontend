// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../db';

// class SearchHistory extends Model {
//   public id!: number;
//   public userId!: number;
//   public itemTitle!: string;
//   public price!: string;
//   public link!: string; // Good to store so they can click back to the item
// }

// SearchHistory.init({
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   userId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   itemTitle: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   price: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   link: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   }
// }, {
//   sequelize,
//   tableName: 'search_histories',
//   underscored: true,
// });

// export default SearchHistory;