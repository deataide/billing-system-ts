import { stripeAccess } from "../../utils/stripeAccess";

  type SubscriptionType = {
    customer: string;
    price: string;
  }
  
  const createSubscription = async (data: SubscriptionType, userId: string) => {
    try {
      const stripe = await stripeAccess(userId)
      const subscription = await stripe.subscriptions.create({
        customer: data.customer,
        items: [
          {
            price: data.price,
          },
        ],
        trial_end: 'now',
  
      });
  
      // Cria a fatura associada à assinatura
      const invoice = await stripe.invoices.create({
        customer: data.customer,
        subscription: subscription.id,
        days_until_due: 30,  // Define o vencimento para 30 dias
        collection_method: 'send_invoice',  // Configura a forma de coleta da fatura
      });
  
      // Você pode retornar informações específicas, como IDs
      return `Subscription and invoice created successfully. Subscription ID: ${subscription.id}, Invoice ID: ${invoice.id}`;
    } catch (error: any) {

      throw new Error(`Error creating subscription: ${error.message}`);
    }
  };
  
  export { createSubscription };
  