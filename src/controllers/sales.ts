import { Product } from "../models/product";
import { Sale } from "../models/sale";

export const createSale = async (productId: string, dataValues: any) => {
  const product = await Product.findByPk(productId);
  console.log("PRODUCT FINDING", product);
  if (!product) throw new Error("Product not found");
  if (product.dataValues.stock - dataValues.quantity >= 0) {
    product.dataValues.stock -= dataValues.quantity;
    product.save();
  } else {
    throw new Error(
      `Exceeds the current stock, there are only ${product.dataValues.stock} `
    );
  }

  if (!dataValues) throw new Error("We need data for to create this sale");
  const newSale = await Sale.create({
    date: new Date(),
    productId,
    ...dataValues,
  });
  console.log("new SALE", newSale);
  if (!newSale) throw new Error("We didn't create this sale");
  return newSale;
};
export const allSales = async () => {
  const sales = await Sale.findAll();
  if (!sales) throw new Error("Sales not found");
  if (!sales[0]) throw new Error("There isn't sales");
  return sales;
};

export const getSaleId = async (id: string) => {
  const sale = await Sale.findByPk(id);
  if (!sale) throw new Error("Sale not found");
  return sale.dataValues;
};
export const updateSale = async (
  saleId: string,
  dataValues: any,
  email: any
) => {
  const sale = await Sale.findByPk(saleId);
  if (!sale) throw new Error("Sale not found");
  const updatedSale = await sale.update({ modified_by: email, ...dataValues });
  if (!updatedSale) throw new Error("Error, we didn't update this 'sale'");
  return updatedSale.dataValues;
};

export const deleteSale = async (id: string) => {
  const sale = await Sale.findByPk(id);
  if (!sale) throw new Error("Sale not found");

  await sale.destroy();
  return {
    message: "Successfully deleted sale",
  };
};
