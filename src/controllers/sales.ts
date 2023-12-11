import moment from "moment";
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
  const sales = await Sale.findAll({ order: [["createdAt", "ASC"]] });
  const ventasPorMes: any = {};

  sales.forEach((sale: any) => {
    const month = moment(sale.createdAt).format("YYYY-MM");
    if (!ventasPorMes[month]) {
      ventasPorMes[month] = [];
    }
    ventasPorMes[month].push({ date: sale.createdAt, price: sale.price });
  });

  if (!sales) throw new Error("Sales not found");
  if (!sales[0]) throw new Error("There isn't sales");
  // return sales;
  return ventasPorMes;
};
export const getSalesPerDay = async () => {
  const sales = await Sale.findAll({ order: [["createdAt", "ASC"]] });
  const salesPerDay: any[] = [];

  sales.forEach((sale: any) => {
    const day: any = moment(sale.createdAt).format("YYYY-MM-DD");
    const existingDay = salesPerDay.find((item: any) => item.day == day);
    console.log("exist", existingDay);
    if (existingDay) {
      existingDay.sales += 1; // Incrementar el contador si ya hay ventas para ese día
    } else {
      salesPerDay.push({ day, sales: 1 }); // Agregar un nuevo objeto si es la primera venta de ese día
    }
  });

  return salesPerDay;
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
