import { Categorie } from "../models/categorie";

export const createCategorie = async (data: any) => {
  const findCategorie = await Categorie.findOne({
    where: {
      name: data.name,
    },
  });
  if (findCategorie)
    throw new Error(
      "We did not create this supplier, because it already exists"
    );

  const newCategorie = await Categorie.create(data);
  if (!newCategorie) throw new Error("We can't create this categorie");
  return newCategorie;
};

export const allCategories = async () => {
  const categories = await Categorie.findAll();
  if (!categories) throw new Error("We didn't find any categorie");
  return categories;
};

export const categorieById = async (id: string) => {
  const categorie = await Categorie.findByPk(id);
  if (!categorie) throw new Error("Categorie not found");
  return categorie;
};

export const updateCategorie = async (id: string, dataValues: any) => {
  const categorie = await Categorie.findByPk(id);
  if (!categorie) throw new Error("Categorie not found");
  const updatedCategorie = await categorie.update(dataValues);
  if (!updatedCategorie) throw new Error("We didn't update this categorie");
  return updatedCategorie;
};

export const deleteCategorie = async (id: string) => {
  const categorie = await Categorie.findByPk(id);
  if (!categorie) throw new Error("Categorie not found");
  await categorie.destroy();
  return {
    message: "The category has been successfully deleted",
  };
};
