import { User } from "../models/user";

export const getUsers = async () => {
  const users = await User.findAll();
  if (!users) throw new Error("Users not found");
  return users;
};
