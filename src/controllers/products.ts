import { Categorie } from "../models/categorie";
import { Product } from "../models/product";
import { Supplier } from "../models/supplier";
type InputValueProduct = {
  title: string;
  description: string;
  price: number;
  stock: number;
  supplierId: string;
  categoriesId: string;
};

export const createProduct = async (data: any) => {
  try {
    // aqui aplicar logica de busqueda de ese producto con ese nombre para que si ese producto ya existe no lo cree de nuevo sino que sume uno al stock del que ya hay
    const findProduct = await Product.findOne({ where: { title: data.title } });

    if (findProduct) {
      findProduct.dataValues.stock = findProduct.dataValues.stock + data.stock;
      await findProduct.save();

      return {
        message:
          "We found one product with this name. We incremented the value of the 'stock' field",
        product: findProduct.dataValues,
      };
    }
    const newProduct = await Product.create({
      ...data,
      createdAt: new Date(),
    });
    if (!newProduct) throw new Error("We can't create this product");
    // We find this supplier in db, if there isn't this supplier, we create
    const [supplier, created] = await Supplier.findOrCreate({
      where: { name: newProduct.dataValues.supplierName },
      defaults: { name: newProduct.dataValues.supplierName },
    });
    newProduct.dataValues.supplierId = supplier.dataValues.id;
    await newProduct.save();
    const [categorie, creted] = await Categorie.findOrCreate({
      where: {
        name: newProduct.dataValues.categoriesName,
      },
      defaults: { name: newProduct.dataValues.categoriesName },
    });
    newProduct.dataValues.categoriesName = categorie.dataValues.name;

    return newProduct.dataValues;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateProduct = async (
  id: string,
  dataValues: InputValueProduct
) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");
  const updatedProduct = await product.update(dataValues);
  if (!updatedProduct) throw new Error("Failed update product");
  return updatedProduct.dataValues;
};
export const getAllProducts = async () => {
  const products = await Product.findAll();
  if (!products[0]) throw new Error("Products not found");
  return products;
};
export const getProductId = async (id: string) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product id not found");
  return product.dataValues;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByPk(id);

  if (!product) throw new Error("product not found");
  const deleted: any = await product.destroy();
  if (!deleted) throw new Error("Could not be deleted");
  return { message: "Deleted product" };
};
