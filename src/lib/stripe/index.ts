import stripe from "stripe";
const Stripe = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  appInfo: {
    name: "Grow",
    version: "0.1.0",
  },
});

export { Stripe as stripe };
