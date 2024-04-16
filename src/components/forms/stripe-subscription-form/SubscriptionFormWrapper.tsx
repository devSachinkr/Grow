"use client";
import React, { useEffect } from "react";
import clsx from "clsx";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import { Elements } from "@stripe/react-stripe-js";
import { Plan } from "@prisma/client";
import { useModal } from "@/app/providers/modal-provider";
import { useRouter } from "next/navigation";
import SubscriptionForm from ".";
import Loading from "@/components/golbal/Loading";
import { StripeElementsOptions } from "@stripe/stripe-js";
import ToastNotify from "@/components/golbal/ToastNotify";
import { getStripe } from "@/lib/stripe/stripe-client";
type Props = {
  customerId: string;
  planExists: boolean;
};

const SubscriptionFormWrapper = ({ customerId, planExists }: Props) => {
  const { data, setClose } = useModal();
  const [selectedPriceId, setSelectedPriceId] = React.useState<
    Plan | null | ""
  >(data?.plans?.defaultPriceId || "");
  const router = useRouter();
  const [subscription, setSubscription] = React.useState<{
    subscriptionId: string;
    clientSecret: string;
  }>({ clientSecret: "", subscriptionId: "" });
  const options: StripeElementsOptions = React.useMemo(
    () => ({
      clientSecret: subscription?.clientSecret,
      appearance: {
        theme: "flat",
      },
    }),
    [subscription]
  );
  useEffect(() => {
    if (!selectedPriceId) return;
    const createSecret = async () => {
      const res = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: selectedPriceId,
          customerId: customerId,
        }),
      });
      const data = await res.json();
      
      setSubscription({
        clientSecret: data.clientSecret,
        subscriptionId: data.subscriptionId,
      });
      if (planExists) {
        ToastNotify({
          title: "Success",
          msg: "Subscription created successfully",
        });
        setClose();
        router.refresh();
      }
    };
    createSecret();
  }, [data, selectedPriceId, customerId]);
  return (
    <div className="border-none transition-all">
      <div className="flex flex-col gap-4">
        {data.plans?.plans.map((price) => (
          <Card
            onClick={() => setSelectedPriceId(price.id as Plan)}
            key={price.id}
            className={clsx("relative cursor-pointer transition-all", {
              "border-primary": selectedPriceId === price.id,
            })}
          >   
            <CardHeader>
              <CardTitle>
              ₹{price.unit_amount ? price.unit_amount / 100 : "0"}
                <p className="text-sm text-muted-foreground">
                  {price.nickname}
                </p>
                <p className="text-sm text-muted-foreground">
                  {
                    pricingCards.find((p) => p.priceId === price.id)
                      ?.description
                  }
                </p>
              </CardTitle>
            </CardHeader>
            {selectedPriceId === price.id && (
              <div className="w-2 h-2 bg-emerald-500 rounded-full absolute top-4 right-4" />
            )}
          </Card>
        ))}

        {options.clientSecret && !planExists && (
          <>
            <h1 className="text-xl">Payment Method</h1>
            <Elements stripe={getStripe()} options={options}>
              <SubscriptionForm selectedPriceId={selectedPriceId} />
            </Elements>
          </>
        )}

        {!options.clientSecret && selectedPriceId && (
          <div className="flex items-center justify-center w-full h-40">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionFormWrapper;
