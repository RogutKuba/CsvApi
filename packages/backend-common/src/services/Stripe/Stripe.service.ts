import { env } from '@billing/backend-common/env';
import { ServerError } from '@billing/backend-common/errors/serverError';
import Stripe from 'stripe';
import {
  handleSubscriptionCreated,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
} from './helper/handleSubscriptionChange';
import { Id } from '@billing/base';

function createStripeClient() {
  return new Stripe(env.STRIPE_SECRET_KEY);
}

export const createStripeService = () => {
  const stripeClient = createStripeClient();

  const self = {
    createStripeCustomer: async (params: { accountId: Id<'account'> }) => {
      const customer = await stripeClient.customers.create({
        name: params.accountId,
      });

      return customer.id;
    },
    handleWebhook: async (params: {
      rawBody: string;
      signatureHeader: string;
    }) => {
      const { rawBody, signatureHeader } = params;

      // handle stripe webhook
      const event = await (async () => {
        try {
          return await stripeClient.webhooks.constructEventAsync(
            rawBody,
            signatureHeader,
            env.STRIPE_WEBHOOK_ENDPOINT_SECRET
          );
        } catch (err: any) {
          console.error('cannot verify stripe webhook signature:', err.message);
          throw new ServerError({ message: 'invalid stripe event' });
        }
      })();

      switch (event.type) {
        case 'customer.subscription.created':
          return await handleSubscriptionCreated(event);
        case 'customer.subscription.updated':
          return await handleSubscriptionUpdated(event);
        case 'customer.subscription.deleted':
          return await handleSubscriptionDeleted(event);
        default:
          return 'not-useful event';
      }
    },
  };

  return self;
};
