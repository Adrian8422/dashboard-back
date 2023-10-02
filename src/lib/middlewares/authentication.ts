import jwt from "jsonwebtoken";
// I'll have replace this secret with 'proces.env.SECRET'
const secret = "secret";

export function authMiddleware(req: any, res: any, next: any) {
  try {
    const requestAuth = req.headers.authorization;
    const token = requestAuth.split(" ")[1];
    if (!requestAuth) throw "Token not found";
    const tokenVerified: any = jwt.verify(token, secret);
    console.log(tokenVerified);
    if (!tokenVerified) res.status(404).json({ message: "Throw token" });
    req.user = tokenVerified["user"];
    next();
  } catch (error) {
    next();
    return error;
  }
}
