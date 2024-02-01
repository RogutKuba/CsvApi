import { createStripeService } from '@billing/backend-common/services/Stripe/Stripe.service';
import { Hono } from 'hono';

export const webhookApp = new Hono();

webhookApp.use('/stripe', async (ctx) => {
  const stripeService = createStripeService();

  await stripeService.handleWebhook({
    rawBody: await ctx.req.text(),
    signatureHeader: ctx.req.raw.headers.get('stripe-signature') ?? '',
  });

  return ctx.json({
    processed: 'ok',
  });
});
