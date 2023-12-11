import jwt from "jsonwebtoken";
import { User } from "../../models/user";
// I'll have replace this secret with 'proces.env.SECRET'
const secret = "secret";

export async function authMiddleware(req: any, res: any, next: any) {
  try {
    const requestAuth = req.headers.authorization;
    console.log("request auth ", requestAuth);
    if (!requestAuth) res.status(404).send({ message: "Token not found" });
    const token = requestAuth.split(" ")[1];
    const tokenVerified: any = jwt.verify(token, secret);
    const queryToDatabase = await User.findOne({
      where: { email: tokenVerified.user.email },
    });

    if (!queryToDatabase)
      return res.status(404).json({ message: "User not found" });

    if (!tokenVerified) return res.status(404).json({ message: "Throw token" });
    req.user = tokenVerified["user"];
    next();
  } catch (error: any) {
    return next(error);
    // return error;
    // return error;
  }
}

export async function checkAdminMiddleware(req: any, res: any, next: any) {
  // try {
  const { rol } = req.user;
  // console.log(rol);
  // if (rol == "admin") return next();
  // } catch (error) {
  //   res.status(401).send({ error: "Unauthorized you need be 'admin'" });
  //   return new Error("User not found or your admin role isn't");
  // }
  if (rol !== "admin") {
    res.status(401).send({ error: "Unauthorized you need be 'admin'" });
    return new Error("User not found or your admin role isn't");
  } else return next();
}
