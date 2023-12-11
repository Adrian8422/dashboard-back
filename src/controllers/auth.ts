import { addMinutes } from "date-fns";
import { generateToken } from "../lib/functions/jwt";
import { generateRandomCode } from "../lib/functions/randomcode";
import { User } from "../models/user";
import { send } from "../lib/connection/nodemailer";
import { expiredCode } from "../lib/functions/expiredCode";
import { Auth } from "../models/auth";
type DataBodySignUp = {
  email: string;
  name?: string;
  lastname?: string;
  age?: number;
  rol?: string;
};
export const findUserOrCreateUser = async (data: DataBodySignUp) => {
  const { email, name, lastname, age, rol } = data;
  if (!data?.email) throw "You should provide a email";
  const auth = await Auth.findOne({ where: { email } });

  // In this step, we look up a registration with rol 'admin', if there is some register with this rol, we automatically assign in the field rol the value 'client'

  const users = await User.findAll();
  if (!auth) {
    if (users.find((item) => item.dataValues.rol == "admin")) {
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          email,
          name,
          lastname,
          age: "",
          rol: "client",
        },
      });
      const auth = await Auth.create({
        email: email,
        verification_code: null,
        expiration_code: new Date(),
        userId: user.dataValues.id,
        rol: user.dataValues.rol,
      });

      return auth;
    }
    // Here we created a user with rol 'admin'
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        email,
        age: "",
        rol: "admin",
      },
    });
    const auth = await Auth.create({
      email: email,
      verification_code: null,
      expiration_code: new Date(),
      userId: user.dataValues.id,
      rol: user.dataValues.rol,
    });
    return auth;
  }
  return auth;
};

export const sendCode = async (data: any) => {
  const auth = await findUserOrCreateUser(data);
  if (!auth) throw "User not found";

  const verification_code = generateRandomCode();
  const expiration_code = addMinutes(new Date(), 20);

  await send(data.email, verification_code);

  // Update the verification code regardless of whether the user was created or not, also update the expiration code
  const userModificado = await auth.update({
    verification_code,
    expiration_code,
  });
  console.log("userModificado", userModificado);

  return {
    newUser: auth.isNewRecord,
    message: "We sent code to email",
  };
};

export const signInUser = async (email: string, code: number) => {
  const auth = await Auth.findOne({
    where: { email, verification_code: code },
  });
  if (!auth) throw new Error("Auth not found or throw code");
  const { expiration_code } = auth?.dataValues;

  const expired = await expiredCode(expiration_code);
  if (expired) {
    auth?.dataValues.verification_code == null;
    auth?.dataValues.expiration_code == new Date();
    auth?.save();
    throw new Error("Code expired, please generate a new code");
  }

  if (auth?.dataValues.verification_code == code && !expired) {
    const token = generateToken({
      id: auth?.dataValues.id,
      email: auth?.dataValues.email,
      rol: auth?.dataValues.rol,
    });
    return token;
  } else throw new Error("Throw verification, please generate a new code");
};

export const changeRol = async (id: string, rol: string) => {
  console.log("rol controller", rol);
  if (rol !== "client" && rol !== "admin")
    throw new Error("Throw in value rol");
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  await user.update({
    rol,
  });
  await user.save();
  return user;
};
