import bcrypt from "bcrypt";
import { existsOrError } from "../../utils/existsOrErros";
import {PrismaClient } from "@prisma/client";
import { encryptData } from "../../utils/encrypt";
import 'dotenv/config'

type User = {
  name: string;
  password: string;
  email: string;
  stripeKey: string;
};

const createUser = async (user: User) => {
  try {
    const prisma = new PrismaClient();

    existsOrError(user.name, "Invalid name");
    existsOrError(user.email, "Invalid e-mail");
    existsOrError(user.password, "Invalid password");
    existsOrError(user.stripeKey, "Invalid Stripe Key");

    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (userAlreadyExists) {
      throw "User already exists";
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Por enquanto salvando em texto plano
    //const encryptedStripeKey = encryptData(user.stripeKey);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        stripeKey: user.stripeKey
      },
    });

    return "User registered"
  } catch (error) {
    console.log(error)
    throw new Error(`Internal Error = ${error}`);
  }
};

const getUsers = async () => {
  try {
    const prisma = new PrismaClient();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return [users];
  } catch (error: any) {
    throw new Error("Internal Error = " + error);
  }
};

const getUserById = async (id: string) => {
  const prisma = new PrismaClient();

  try {
    existsOrError(id, "Missing id");

    const user = await prisma.user.findFirst({ where: { id: id } });

    if (!user) {
      return "User doesn't exists";
    }

    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

const deleteUserById = async (id: string) => {
  const prisma = new PrismaClient();

  try {
    existsOrError(id, "Missing id");

    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    if (!user) {
      return "User was not found or was deleted";
    }
  } catch (error) {
    throw new Error(`Internal Error ${error}`);
  }
};

export { createUser, getUsers, getUserById, deleteUserById };
