import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/connection/db/postgres";

class User extends Model {}
User.init(
  {
    email: DataTypes.STRING,
    age: DataTypes.STRING,
    rol: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);
export { User };
