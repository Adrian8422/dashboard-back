import { DataTypes, Model } from "sequelize";
import { sequelize } from "../lib/connection/db/postgres";

class Notification extends Model {}
Notification.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idReference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "notification" }
);

export { Notification };
