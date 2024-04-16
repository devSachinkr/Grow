import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { customerId, priceId } = await req.json();
  if (!customerId || !priceId) {
    return new NextResponse("Customer Id or Price Id are missing", {
      status: 400,
    });
  }
  const subscription = await db.agency.findFirst({
    where: {
      customerId,
    },
    include: {
      Subscription: true,
    },
  });
  try {
    if (
      subscription?.Subscription?.subscriptionId &&
      subscription?.Subscription?.active
    ) {
      if (!subscription.Subscription.subscriptionId) {
        throw new Error("Subscription id is missing");
      }
      console.log("updating the subscription");
      const recentSubscriptionDetails = await stripe.subscriptions.retrieve(
        subscription.Subscription.subscriptionId
      );

      const updatedSubscription = await stripe.subscriptions.update(
        subscription.Subscription.subscriptionId,
        {
          items: [
            {
              id: recentSubscriptionDetails.items.data[0].id,
              deleted: true,
            },
            {
              price: priceId,
            },
          ],
          expand: ["latest_invoice.payment_intent"],
        }
      );
     return  NextResponse.json({
        subscriptionId: updatedSubscription.id,
        clientSecret:
        // @ts-ignore
          updatedSubscription.latest_invoice?.payment_intent?.client_secret,

        status: true,
      });
    }else{
        console.log("creating new subscription");
        const newSubscription=await stripe.subscriptions.create({
         customer:customerId,
         items:[
            {
                price:priceId
            },
         ],
         payment_behavior:"default_incomplete",
         payment_settings:{save_default_payment_method:"on_subscription"},
         expand:["latest_invoice.payment_intent"]
        })
       return NextResponse.json({
          subscriptionId: newSubscription.id,
          clientSecret:
          // @ts-ignore
            newSubscription.latest_invoice?.payment_intent?.client_secret,
          status: true,
        })
    }
  } catch (error) {
    console.log(error);
  }
}
