import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/connection/db/postgres";

class User extends Model {}
User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: DataTypes.STRING,
    age: DataTypes.STRING,
    rol: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);
export { User };
