import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class SearchHistory extends Model {
  public id!: number;
  public userId!: string; // Changed to string to match UUID
  public itemTitle!: string;
  public priceRange!: string;
  public description!: string;
  public imageUrl!: string;
  public platform!: string;
}

SearchHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priceRange: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    //   imageUrl: {
    //     type: DataTypes.TEXT, // Store the S3/Cloudinary URL of the scan
    //     allowNull: true,
    //   },
    platform: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sources: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("sources");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("sources", JSON.stringify(value));
      },
    },
  },
  {
    sequelize,
    tableName: "search_histories",
    underscored: true,
    timestamps: true,
  }
);

export default SearchHistory;
