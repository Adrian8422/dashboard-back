import jwt from "jsonwebtoken";
import { User } from "../../models/user";
// I'll have replace this secret with 'proces.env.SECRET'
const secret = "secret";

export async function authMiddleware(req: any, res: any, next: any) {
  try {
    const requestAuth = req.headers.authorization;
    const token = requestAuth.split(" ")[1];
    if (!requestAuth) throw new Error("Token not found");
    const tokenVerified: any = jwt.verify(token, secret);
    console.log("Token verified", tokenVerified);
    const queryToDatabase = await User.findOne({
      where: { email: tokenVerified.user.email },
    });

    if (!queryToDatabase)
      return res.status(404).json({ message: "User not found" });

    if (!tokenVerified) return res.status(404).json({ message: "Throw token" });
    req.user = tokenVerified["user"];
    next();
  } catch (error) {
    next();
    return error;
  }
}

export async function checkAdminMiddleware(req: any, res: any, next: any) {
  try {
    const { rol } = req.user;
    if (!req.user || rol == "admin") return next();
  } catch (error) {
    res.status(401).send({ error: "Unauthorized you need be 'admin'" });
    return new Error("User not found or your admin role isn't");
  }
}
