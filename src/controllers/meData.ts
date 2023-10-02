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
  return await User.findOne({ where: { email, rol } });
};
export const updateMeData = async (
  { email, rol, id }: TypeUserFind,
  data?: InputDataUser
) => {
  try {
    const user = await User.findOne({
      where: { email, rol, id },
    });
    if (!user) throw "User not found";
    const updateUser = await user?.update({
      ...data,
    });
    await user?.save();
    if (!updateUser) throw "An error has occurred";
    console.log("USER ", user);
    return user.dataValues;
  } catch (error) {
    console.log(error);
    return error;
  }
};
