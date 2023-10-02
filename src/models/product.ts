import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/connection/db/postgres";
import { Supplier } from "./supplier";

class Product extends Model {}
Product.init(
  {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    supplierName: DataTypes.STRING,
    categoriesId: DataTypes.STRING,
    createdAt: DataTypes.DATE,
  },
  { sequelize, modelName: "product" }
);
Product.belongsTo(Supplier, { foreignKey: "supplierId", as: "supplier" });
export { Product };
