
import { createCustomer, listAllCustomers, deleteCustomer } from "../services/stripe/customer";

const createCustomerController = async (req: any, res: any) => {
  try {
    const {name, email, payment_method, userId} = req.body

    const data = {name, email, payment_method, userId}

    const result = await createCustomer(data, userId)

    return res.status(201).json({ message: result });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: `Internal Error: ${error.message}` });
  }
};

const listAllCustomersController = async (req:any, res: any) => {
  try {
    const {userId} = req.params

    const result = await listAllCustomers(userId);

    return res.status(200).json({result})

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: `Internal Error: ${error.message}` });
  }
};

const deleteCustomerByIdController = async (req:any, res: any) => {
  try {
    const { customerId, userId } = req.params;
    const result = await deleteCustomer(customerId, userId)

    return res.status(200).json({ message: result });
  } catch (error:any) {
    console.error(error);
    return res.status(500).json({ error: `Internal Error: ${error.message}` });
  }
};

export {deleteCustomerByIdController, listAllCustomersController, createCustomerController}