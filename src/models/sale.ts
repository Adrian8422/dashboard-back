import { DataTypes, Model } from "sequelize";
import { sequelize } from "../lib/connection/db/postgres";

class Sale extends Model {}
Sale.init(
  {
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buyer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_email_buyer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_phone_buyer: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modified_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, modelName: "Sale" }
);

export { Sale };
