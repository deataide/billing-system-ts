import { createSubscription } from "../services/stripe/subscription";



const createSubscriptionController = async (req: any, res: any) => {
    try {
  
      const {customer, price, userId} = req.body
  
      const result = await createSubscription({customer, price}, userId);
  
      return res.status(201).json({ message: result });
    } catch (error:any) {
      return res.status(500).json({ error: `Internal Error: ${error.message}` });
    }
  };

  export {createSubscriptionController}
  