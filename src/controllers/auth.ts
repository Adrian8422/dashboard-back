import { addMinutes } from "date-fns";
import { generateToken } from "../lib/functions/jwt";
import { generateRandomCode } from "../lib/functions/randomcode";
import { User } from "../models/user";
import { send } from "../lib/connection/nodemailer";
import { expiredCode } from "../lib/functions/expiredCode";
import { Auth } from "../models/auth";

export const findUserOrCreateUser = async (
  email: string,
  age?: number,
  rol?: string
) => {
  if (!email) throw "You should provide a email";
  const auth = await Auth.findOne({ where: { email } });

  // In this step, we look up a registration with rol 'admin', if there is some register with this rol, we automatically assign in the field rol the value 'client'

  const users = await User.findAll();
  if (!auth) {
    if (users.find((item) => item.dataValues.rol == "admin")) {
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          email,
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

export const sendCode = async (email: string) => {
  const auth = await findUserOrCreateUser(email);
  if (!auth) throw "User not found";

  const verification_code = generateRandomCode();
  const expiration_code = addMinutes(new Date(), 20);

  await send(email, verification_code);

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
  try {
    const auth = await Auth.findOne({
      where: { email, verification_code: code },
    });
    if (!auth) throw "Auth not found";
    const { expiration_code } = auth?.dataValues;

    const expired = await expiredCode(expiration_code);
    if (expired) {
      auth?.dataValues.verification_code == null;
      auth?.dataValues.expiration_code == new Date();
      auth?.save();
      throw "Code expired, please generate a new code";
    }
    if (auth?.dataValues.verification_code == code && !expired) {
      const token = generateToken({
        id: auth?.dataValues.id,
        email: auth?.dataValues.email,
        rol: auth?.dataValues.rol,
      });
      return token;
    } else throw "Throw verification, please generate a new code";
  } catch (error) {
    return error;
  }
};