import { User } from "../models/user";
type TypeUserFind = {
  id: string;
  email: string;
  rol: string;
};
type InputDataUser = {
  age: number;
};
export const meData = async (email: string, rol: string) => {
  const user = await User.findOne({ where: { email, rol } });
  if (!user) throw new Error("User not found");
  return user;
};
export const updateMeData = async (
  { email, rol, id }: TypeUserFind,
  data?: InputDataUser
) => {
  const user = await User.findOne({
    where: { email, rol, id },
  });
  if (!user) throw new Error("User not found");
  const updateUser = await user?.update({
    ...data,
  });
  await user?.save();
  if (!updateUser)
    throw new Error("An error has occurred at the moment of update data");

  return user.dataValues;
};
