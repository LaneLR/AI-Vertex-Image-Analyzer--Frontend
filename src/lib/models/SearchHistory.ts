import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class SearchHistory extends Model {
  public id!: number;
  public userId!: string;
  public itemTitle!: string;
  public priceRange!: string;
  public description!: string;
  public imageUrl!: string;
  public platform!: string;
  public grade!: string;
  public estimatedShippingCost!: string;
  public inInventory!: boolean;
  public specs!: Record<string, any>
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
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimatedShippingCost: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inInventory: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    specs: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue("specs");
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue("specs", JSON.stringify(value));
      },
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
  },
);

export default SearchHistory;
