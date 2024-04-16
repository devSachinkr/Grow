"use server";
import Stripe from "stripe";
import { db } from "../db";
import { stripe } from ".";
import { Prisma } from "@prisma/client";

export const subscriptionCreation = async (
  subscription: Stripe.Subscription,
  customerId: string
) => {
  try {
    const agency = await db.agency.findFirst({
      where: { customerId },
      include: {
        SubAccount: true,
      },
    });
    if (!agency) throw new Error("Agency not found to create subscription");

    const data: Prisma.SubscriptionUncheckedCreateInput = {
      active: subscription.status === "active",
      agencyId: agency.id,
      customerId: agency.customerId,
      currentPeriodEndDate: new Date(subscription.current_period_end * 1000),
      // @ts-ignore
      priceId: subscription.plan.id,
      subscriptionId: subscription.id,
      // @ts-ignore
      plan: subscription.plan.id,
    };
    const res = await db.subscription.upsert({
      where: { agencyId: agency.id },
      update: { ...data },
      create: { ...data },
    });
    console.log("Subscription created", res);
  } catch (error) {
    console.log("Create Subscription error : ", error);
  }
};

export const getConnectAccountProducts = async (stripeAccount: string) => {
  try {
    const products = await stripe.products.list(
      {
        limit: 50,
        expand: ["data.default_price"],
      },
      { stripeAccount }
    );
    return products.data;
  } catch (error) {
    console.log(error);
  }
};
