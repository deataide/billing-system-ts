import dotenv from "dotenv";
import jwt from "jsonwebtoken";

export const generateToken = (id: string, recuperationTime: boolean) => {
  try {

    const secret = process.env.AUTH_SECRET;
    let expiresIn = 60 * 60;

    if (recuperationTime === true) {
      expiresIn = 60 * 5;
    }

    if (!secret) {
      throw new Error("AUTH_SECRET is not defined");
    }
    const token = jwt.sign({ id }, secret, { expiresIn });

    return token;
  } catch (error) {
    throw new Error("Error to generate a token");
  }
};
