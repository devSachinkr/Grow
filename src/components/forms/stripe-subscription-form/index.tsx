"use client";
import Loading from "@/components/golbal/Loading";
import ToastNotify from "@/components/golbal/ToastNotify";
import { Button } from "@/components/ui/button";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
type Props = {
  selectedPriceId: string | null;
};

const SubscriptionForm = ({ selectedPriceId }: Props) => {
  const elements = useElements();
  const stripeHook = useStripe();
  const [priceError, setPriceError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!selectedPriceId) {
      setLoading(false);
      setPriceError("You need to select a plan to subscribe.");
      return;
    }
    setPriceError("");
    event.preventDefault();
    if (!stripeHook || !elements) return;

    try {
      setLoading(true);
      const { error } = await stripeHook.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_URL}/agency`,
        },
      });
      if (error) {
        console.log(error)
        throw new Error();
      }
      ToastNotify({
        title: "Success",
        msg: "Your payment has been successfully processed. ",
      });
    } catch (error) {
      console.log(error);
      ToastNotify({
        title: "Oppse",
        msg: "We couldnt process your payment. Please try a different card",
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <small className="text-destructive">{priceError}</small>   
      <PaymentElement />
      <Button disabled={!stripeHook} className="mt-4 w-full">
        {loading ? <Loading /> : "Pay"}
      </Button>
    </form>
  );
};

export default SubscriptionForm;
