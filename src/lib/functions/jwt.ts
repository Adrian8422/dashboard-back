import jwt from "jsonwebtoken";

// I'll have replace this secret with 'proces.env.SECRET'
const secret = "secret";

const generateToken = (userData: any) => {
  try {
    const token = jwt.sign({ user: userData }, secret);
    return { token };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { generateToken };
