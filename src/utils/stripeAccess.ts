let stripe = require("stripe");
import { PrismaClient } from "@prisma/client";

export const stripeAccess = async (id: string) => {
    if (!id) {
        throw new Error("Need a User ID");
    }

    const prisma = new PrismaClient();

    try {
        const user = await prisma.user.findFirst({
            where: {
                id: id,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const stripeInstance = stripe(user.stripeKey);

        return stripeInstance;
    } catch (error) {
        console.error("Error creating Stripe instance:", error);
        throw new Error("Internal Error");
    } finally {
        await prisma.$disconnect();
    }
};
