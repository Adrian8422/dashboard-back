import { Supplier } from "../models/supplier";

//I have to see if this 'createSupplier' function I can use in the product controllers to find or create a supplier at the time of creating a product.
export const createSupplier = async (data: any) => {
  const findSupplier = await Supplier.findOne({ where: { name: data.name } });
  if (findSupplier)
    throw new Error(
      "We did not create this supplier, because it already exists"
    );
  const newSupplier = await Supplier.create(data);
  return newSupplier;
};

export const updateSupplier = async (id: string, data: any) => {
  const supplier = await Supplier.findByPk(id);
  if (!supplier) throw new Error("Supplier not found");

  const updatedSupplier = await supplier.update({ ...data });

  if (!updatedSupplier) {
    throw new Error("We couldn't update this supplier");
  }

  return updatedSupplier;
};

export const getSuppliers = async () => {
  const suppliers = await Supplier.findAll();

  if (!suppliers) {
    throw new Error("Suppliers not found");
  }
  return suppliers;
};
export const getSupplierId = async (id: string) => {
  const supplier = await Supplier.findByPk(id);
  if (!supplier) throw new Error("Supplier id not found");
  return supplier.dataValues;
};

export const deleteSupplier = async (id: string) => {
  const supplier = await Supplier.findByPk(id);

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  await supplier.destroy();

  return {
    message: "Succesfull deleted supplier",
  };
};
