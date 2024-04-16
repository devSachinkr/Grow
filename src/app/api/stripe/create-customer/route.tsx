import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { StripeCustomerType } from "@/lib/types";

export async function POST(request: Request) {
  const { address, name, email, shipping }: StripeCustomerType =
    await request.json();
  if (!address || !name || !email || !shipping) {
    return new NextResponse("Missing required fields", {
      status: 400,
    });
  }
  try {
    const customer = await stripe.customers.create({
      name,
      email,
      address,
      shipping,
    });
    return Response.json({
      customerId: customer.id,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error creating customer", {
      status: 500,
    });
  }
}
