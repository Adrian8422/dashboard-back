import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/connection/db/postgres";

class Task extends Model {}
Task.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  { sequelize, modelName: "task" }
);
export { Task };
