import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { subscriptionCreation } from "@/lib/stripe/stripe-action";

const webhookEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "product.created",
  "product.updated",
]);

export async function POST(request: NextRequest) {
  let stripeEvent: Stripe.Event;
  const body = await request.text();
  const signature = headers().get("Stripe-Signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return new NextResponse(
      "Webhook error: Missing signature or webhook secret",
      {
        status: 400,
      }
    );
  }
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error: Error | any) {
    return new NextResponse("Webhook error: " + error.message, {
      status: 400,
    });
  }
  try {
    if (webhookEvents.has(stripeEvent.type)) {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      if (
        !subscription.metadata.connectAccountPayments &&
        !subscription.metadata.connectAccountSubscriptions
      ) {
        switch (stripeEvent.type) {
          case "customer.subscription.created": {
            await subscriptionCreation(
              subscription,
              subscription.customer as string
            );
            break;
          }
          case "customer.subscription.updated": {
            if (subscription.status === "active") {
              await subscriptionCreation(
                subscription,
                subscription.customer as string
              );
            } else {
              console.log("Subscription status is not active", subscription);
              break;
            }
          }
          default:
            console.log("Unhandled event type", stripeEvent.type);
        }
      } else {
        console.log(
          "Skipped from webhook because subscription was from Connected Account",
          subscription
        );
      }
    }
  } catch (err: any) {
    console.log(err);
    return new NextResponse("Webhook error: " + err.message, { status: 400 });
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
