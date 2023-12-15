import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/connection/db/postgres";

class Supplier extends Model {}

Supplier.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true, // Puedes ajustar según tus necesidades
    },
    cellphone: {
      type: DataTypes.STRING,
      allowNull: true, // O ajusta según tus necesidades
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true, // O ajusta según tus necesidades
      // validate: {
      //   isEmail: true, // Valida que el campo sea un correo electrónico válido
      // },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Supplier",
  }
);

export { Supplier };
