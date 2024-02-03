import {
  createProduct,
  listAllProducts,
  deleteProduct,
} from "../services/stripe/product";

const createProductController = async (req: any, res: any) => {
  try {
    const { name, price, description, userId } = req.body;

    const data = { name, price, description, userId };

    const result = await createProduct(data, userId);

    return res.status(201).json({ message: result });
  } catch (error: any) {
    return res.status(500).json({ error: `Internal Error: ${error.message}` });
  }
};

const listAllProductsController = async (req: any, res: any) => {
  try {

    const {userId} = req.params
    const result = await listAllProducts(userId);

    return res.status(200).json({ result });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: `Internal Error: ${error.message}` });
  }
};

const deleteProductByIdController = async (req: any, res: any) => {
  try {
    const { customerId, userId } = req.params;
    const result = await deleteProduct(customerId, userId);

    return res.status(200).json({ message: result });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: `Internal Error: ${error.message}` });
  }
};

export {
  createProductController,
  listAllProductsController,
  deleteProductByIdController,
};
