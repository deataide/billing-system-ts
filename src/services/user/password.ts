import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/generateToken";
import "dotenv/config";
import base64url from "base64url";
import bcrypt from "bcrypt";
import path from 'path'
import dotenv from 'dotenv'
import { PrismaClient } from "@prisma/client";

const changePassword = async (email: string) => {

  const prisma = new PrismaClient();

  try {

    const user = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if (!user) {
      throw new Error("User doesn't exist.");
    }

    const token = generateToken(user.id, true);
  
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        recuperationToken: token
      }
    });

    const encodedToken = base64url(token);

    const transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Recuperação de Conta",
      text: "",
      html: `
        <p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha.</p>
        <a href="http://localhost:5173/new-password/${encodedToken}">Redefinir Senha</a>
      `,
    });

    return "A message has been sent to your email";
  } catch (error) {
    throw new Error(`Internal Error ${error}`);
  }
};


const redefinePassword = async (token: string, password: string) => {
  const envPath = path.resolve(__dirname, 'C:\\Users\\deivi\\Desktop\\completeLogin\\src', '.env');
  dotenv.config({ path: envPath });

  const prisma = new PrismaClient();

  if (!password) {
    throw new Error("Type your new password");
  }

  try {
    const decodedToken = base64url.decode(token);

    if (!decodedToken || typeof decodedToken !== "string") {
      throw new Error("Invalid or missing token");
    }

    const secret = process.env.AUTH_SECRET || 'NONE';

    const user = await prisma.user.findFirst({
      where: {
        recuperationToken: decodedToken
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    try {
       jwt.verify(decodedToken, secret);
    } catch (error) {
      throw new Error(`Invalid session ${error}`);
    }

    const hashedPassword = await bcrypt.hash(password, Number(secret));

    // Use o método update para atualizar o usuário no banco de dados
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        password: hashedPassword,
        recuperationToken: null
      }
    });

    return "Password changed successfully!";
  } catch (error) {
    throw new Error(`Internal Error ${error}`);
  }
};


export { changePassword, redefinePassword };
