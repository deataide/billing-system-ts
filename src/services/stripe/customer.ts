import { stripeAccess } from "../../utils/stripeAccess";

type Customer = {
  name: string;
  email: string;
  payment_method: string;
  address?: Object;
  phone?: string;
  coupon?: string;
};

const createCustomer = async (data: Customer, userId: string) => {
  try {

    const stripe = await stripeAccess(userId)
    // Crie o cliente no Stripe
    const customer = await stripe.customers.create({
      name: data.name,
      email: data.email,
      address: data.address || null,
      coupon: data.coupon || null,
      phone: data.phone || null,
    });

    // Crie um método de pagamento do tipo boleto
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'boleto',
      billing_details: {
        email: data.email,
      },
    });

    // Anexe o método de pagamento ao cliente
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });

    // Atualize o método de pagamento padrão do cliente
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    return "Customer successfully created.";
  } catch (error) {
    throw new Error(`Internal Error: ${error}`);
  }
};

const listAllCustomers = async (userId:string) => {


  try {

    const stripe = await stripeAccess(userId)
    const customers = await stripe.customers.list({
      limit: 10});


    if (!customers) {
      return "You don't have customers";
    }

    return customers


  } catch (error) {
    throw new Error(`Internal Error: ${error}`);
  }
};

const deleteCustomer = async (id: string, userId: string) => {
  try {
    const stripe = await stripeAccess(userId)
    const deleted = await stripe.customers.del(id);

    if (deleted) {
      return `Customer sucessfull deleted`;
    }
  } catch (error) {
    throw new Error(`Internal Error: ${error}`);
  }
};

export {listAllCustomers, deleteCustomer, createCustomer}