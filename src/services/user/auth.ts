import bcrypt from "bcrypt"
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../../utils/generateToken";

type LoginData = {
  email: string;
  password: string;
};

export const userLogin = async (data: LoginData) => {
  const prisma = new PrismaClient();
  try {
    if (!data.email || !data.password) {
      throw "E-mail or password invalids";
    }

    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw "E-mail or password invalids";
    }

    const correctPassword = await bcrypt.compare(data.password, user.password);
    if (!correctPassword) return "Email or password incorrects";

    const token = generateToken(user.id, false);

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      token: token,
    };

    return { ...payload };
  } catch (error) {
    throw new Error(`Internal Error ${error}`);
  }
};
