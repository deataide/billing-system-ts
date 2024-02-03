import { stripeAccess } from "../../utils/stripeAccess";

type Product = {
  name: string;
  price: number;
  description?: string;
};

const createProduct = async (data: Product, userId: string) => {
  try {
    const stripe = await stripeAccess(userId);

    const product = await stripe.products.create({
      name: data.name,
      description: data.description || null,
      type: "service",
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: data.price, // (por exemplo, 10 dólares seria 1000 centavos)
      currency: "brl",
      recurring: {
        interval: "month",
      },
    });

    await stripe.products.update(product.id, {
      default_price: price.id,
    });

    if (product && price) {
      return `Product successfully created with default price: ${product.id}`;
    }
  } catch (error) {
    throw new Error(`Internal Error ${error}`);
  }
};

const listAllProducts = async (userId: string) => {
  try {
    const stripe = await stripeAccess(userId);

    const products = await stripe.products.list({
      limit: 10,
    });

    if (products) {
      return products;
    } else {
      return "Products doesn't found";
    }
  } catch (error) {
    throw new Error(`Internal Error ${error}`);
  }
};

const deleteProduct = async (id: string, userId: string) => {
  try {
    const stripe = await stripeAccess(userId);

    const product = await stripe.products.retrieve(id);
    const defaultPriceId = product.default_price as string;

    await stripe.prices.del(defaultPriceId);

    await stripe.products.del(id);

    return `Product and associated price successfully deleted`;
  } catch (error) {
    throw new Error(`Internal Error ${error}`);
  }
};

export { createProduct, listAllProducts, deleteProduct };
