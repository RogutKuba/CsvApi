import { db } from '@billing/database/db';
import { accountsTable } from '@billing/database/schemas/accounts.db';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

export const handleSubscriptionCreated = async (event: Stripe.Event) => {
  if (event.type !== 'customer.subscription.created') {
    throw new Error('type mismatch');
  }

  const productId = (() => {
    const product = event.data.object.items.data[0].plan.product;
    if (typeof product === 'string') {
      return product;
    } else if (product === null || product.deleted) {
      throw new Error('Subscription doesnt exist');
    } else {
      return product.id;
    }
  })();

  const stripeCustomerId = (() => {
    if (typeof event.data.object.customer === 'string') {
      return event.data.object.customer;
    } else {
      return event.data.object.customer.id;
    }
  })();

  // handle creation event
  await db
    .update(accountsTable)
    .set({ stripeProductId: productId })
    .where(eq(accountsTable.stripeCustomerId, stripeCustomerId));
};

export const handleSubscriptionUpdated = async (event: Stripe.Event) => {
  // handle update event
  if (event.type !== 'customer.subscription.updated') {
    throw new Error('type mismatch');
  }

  const productId = (() => {
    const product = event.data.object.items.data[0].plan.product;
    if (typeof product === 'string') {
      return product;
    } else if (product === null || product.deleted) {
      throw new Error('Subscription doesnt exist');
    } else {
      return product.id;
    }
  })();

  const stripeCustomerId = (() => {
    if (typeof event.data.object.customer === 'string') {
      return event.data.object.customer;
    } else {
      return event.data.object.customer.id;
    }
  })();

  // handle creation event
  await db
    .update(accountsTable)
    .set({ stripeProductId: productId })
    .where(eq(accountsTable.stripeCustomerId, stripeCustomerId));
};

export const handleSubscriptionDeleted = async (event: Stripe.Event) => {
  // handle delete event
  if (event.type !== 'customer.subscription.deleted') {
    throw new Error('type mismatch');
  }

  const stripeCustomerId = (() => {
    if (typeof event.data.object.customer === 'string') {
      return event.data.object.customer;
    } else {
      return event.data.object.customer.id;
    }
  })();

  await db
    .update(accountsTable)
    .set({ stripeProductId: 'free-plan' })
    .where(eq(accountsTable.stripeCustomerId, stripeCustomerId));
};
