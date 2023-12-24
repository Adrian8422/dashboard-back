import { User } from "../models/user";

export const getUsersClients = async () => {
  const users = await User.findAll();
  if (!users) throw new Error("Users not found");
  const usersClients = users.filter((user) => user.dataValues.rol == "client");
  return usersClients;
};
