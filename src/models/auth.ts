import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/connection/db/postgres";

class Auth extends Model {}
Auth.init(
  {
    email: DataTypes.STRING,
    verification_code: DataTypes.INTEGER,
    expiration_code: DataTypes.DATE,
    rol: DataTypes.STRING,
    userId: DataTypes.STRING,
  },
  { sequelize, modelName: "Auth" }
);
export { Auth };
