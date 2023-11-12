import { Model, DataTypes } from "sequelize";
import { sequelize } from "../lib/connection/db/postgres";
import { Supplier } from "./supplier";
import { Categorie } from "./categorie";

class Product extends Model {}
Product.init(
  {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    supplierName: DataTypes.STRING,
    categoriesName: DataTypes.STRING,
    createdAt: DataTypes.DATE,
  },
  { sequelize, modelName: "product" }
);
Product.belongsTo(Supplier, { foreignKey: "supplierId", as: "supplier" });
Product.belongsToMany(Categorie, {
  foreignKey: "CategoriesId",
  as: "categorie",
  through: "ProductCategories",
});
export { Product };
