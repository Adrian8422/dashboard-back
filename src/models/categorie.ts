import { DataTypes, Model } from "sequelize";
import { sequelize } from "../lib/connection/db/postgres";

class Categorie extends Model {}

Categorie.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, modelName: "Categorie" }
);

export { Categorie };
