import GradientText from "@/components/golbal/GradientText";
import { addOnsProducts, pricingCards } from "@/lib/constants";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import { Separator } from "@/components/ui/separator";
import PricingCard from "./$components/PricingCard";
type Props = {
  params: {
    agencyId: string;
  };
};

const page = async ({ params: { agencyId } }: Props) => {
  const addOns = await stripe.products.list({
    ids: addOnsProducts.map((p) => p.id),
    expand: ["data.default_price"],
  });
  const subscriptions = await db.agency.findUnique({
    where: { id: agencyId },
    select: {
      customerId: true,
      Subscription: true,
    },
  });
  const prices = await stripe.prices.list({
    product: process.env.NEXT_PLURA_PRODUCT_ID,
    active: true,
  });

  const currentPlanDetails = pricingCards.find(
    (p) => p.priceId === subscriptions?.Subscription?.priceId
  );
  const charges = await stripe.charges.list({
    customer: subscriptions?.customerId,
    limit: 50,
  });
  const allCharges = [
    ...charges.data.map((charge) => ({
      description: charge.description,
      amount: `₹${charge.amount / 100}`,
      date: String(new Date(charge.created * 1000).toLocaleTimeString()),
      status: "Paid",
      id: charge.id,
    })),
  ];
  return (
    <>
      <h1>
        <GradientText text="Billing" from="red" to="blue" size="3.5rem" />
      </h1>
      <Separator className=" mb-6" />
      <h2 className="text-2xl p-4">
        <GradientText from="red" to="blue" size="2.5rem">
          Current Plan
        </GradientText>
      </h2>
      <div className="flex flex-col lg:!flex-row justify-between gap-8">
        <PricingCard
          planExists={subscriptions?.Subscription?.active === true}
          prices={prices.data}
          customerId={subscriptions?.customerId || ""}
          amt={
            subscriptions?.Subscription?.active === true
              ? currentPlanDetails?.price || "₹0"
              : "₹0"
          }
          buttonCta={
            subscriptions?.Subscription?.active === true
              ? "Change Plan"
              : "Get Started"
          }
          highlightDescription="Want to modify your plan? You can do this here. If you have
          further question contact support@grow-app.com"
          highlightTitle="Plan Options"
          description={
            subscriptions?.Subscription?.active === true
              ? currentPlanDetails?.description || "Lets get started"
              : "Lets get started! Pick a plan that works best for you."
          }
          duration="/m"
          features={
            subscriptions?.Subscription?.active === true
              ? currentPlanDetails?.features || []
              : currentPlanDetails?.features ||
                pricingCards.find((pricing) => pricing.title === "Starter")
                  ?.features ||
                []
          }
          title={
            subscriptions?.Subscription?.active === true
              ? currentPlanDetails?.title || "Starter"
              : "Starter"
          }
        />
        {addOns.data.map((addOn) => (
          <PricingCard
            planExists={subscriptions?.Subscription?.active === true}
            prices={prices.data}
            customerId={subscriptions?.customerId || ""}
            key={addOn.id}
            amt={
              //@ts-ignore
              addOn.default_price?.unit_amount
                ? //@ts-ignore
                  `₹${addOn.default_price.unit_amount / 100}`
                : "₹0"
            }
            buttonCta="Subscribe"
            description="Dedicated support line & teams channel for support"
            duration="/m"
            features={[]}
            title={"24/7 priority support"}
            highlightTitle="Get support now!"
            highlightDescription="Get priority support and skip the long long with the click of a button."
          />
        ))}
      </div>
      <h2 className="text-2xl p-4">Payment History</h2>
      <Table className="bg-card border-[1px] border-border rounded-md">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead className="w-[200px]">Description</TableHead>
            <TableHead className="w-[200px]">Invoice Id</TableHead>
            <TableHead className="w-[300px]">Date</TableHead>
            <TableHead className="w-[200px]">Paid</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {allCharges.map((charge) => (
            <TableRow key={charge.id}>
              <TableCell>{charge.description}</TableCell>
              <TableCell className="text-muted-foreground">
                {charge.id}
              </TableCell>
              <TableCell>{charge.date}</TableCell>
              <TableCell>
                <p
                  className={clsx("", {
                    "text-emerald-500": charge.status.toLowerCase() === "paid",
                    "text-orange-600":
                      charge.status.toLowerCase() === "pending",
                    "text-red-600": charge.status.toLowerCase() === "failed",
                  })}
                >
                  {charge.status.toUpperCase()}
                </p>
              </TableCell>
              <TableCell className="text-right">{charge.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default page;
