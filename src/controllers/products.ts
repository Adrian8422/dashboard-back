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
  console.log("entro aca???");
  try {
    // aqui aplicar logica de busqueda de ese producto con ese nombre para que si ese producto ya existe no lo cree de nuevo sino que sume uno al stock del que ya hay
    const findProduct = await Product.findOne({ where: { title: data.title } });
    console.log("Encontramos el producto ?", findProduct);
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
    if (!newProduct) throw "We can't create this product";
    // We find this supplier in db, if there isn't this supplier, we create
    const [supplier, created] = await Supplier.findOrCreate({
      where: { name: newProduct.dataValues.supplierName },
      defaults: { name: newProduct.dataValues.supplierName },
    });
    newProduct.dataValues.supplierId = supplier.dataValues.id;
    await newProduct.save();

    console.log("NEW SUPPLIER: ", supplier, "created?:", created);
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
  try {
    const product = await Product.findByPk(id);
    if (!product) throw "Product not found";
    const updatedProduct = await product.update(dataValues);
    if (!updatedProduct) throw "Failed update product";
    return product.dataValues;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getAllProducts = async () => {
  try {
    const products = await Product.findAll();
    if (!products) throw "Products not found";
    return products;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getProductId = async (id: string) => {
  try {
    const product = await Product.findByPk(id);
    if (!product) throw "Product id not found";
    return product.dataValues;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const product = await Product.findByPk(id);
    if (!product) throw "product not found";
    const deleted: any = await product.destroy();
    if (!deleted) throw "Could not be deleted";
    return { message: "Deleted product" };
  } catch (error) {
    return error;
  }
};
