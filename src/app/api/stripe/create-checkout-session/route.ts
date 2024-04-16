import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {
    prices,
    subAccountConnectAccId,
    subaccountId,
  }: {
    prices: { recurring: boolean; productId: string }[];
    subAccountConnectAccId: string;
    subaccountId: string;
  } = await request.json();

  const origin = request.headers.get("origin");
  if (!subAccountConnectAccId || !prices.length) {
    return new NextResponse("Sub account id or prices are missing", {
      status: 400,
    });
  }
  if (
    !process.env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT ||
    !process.env.NEXT_PUBLIC_PLATFORM_ONETIME_FEE ||
    !process.env.NEXT_PUBLIC_PLATFORM_AGENY_PERCENT
  ) {
    return;
  }

  const agencyConnectAccId = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
    select: {
      Agency: true,
    },
  });
  const subscriptionPriceExist = prices.find((p) => p.recurring);
  try {
    const session = await stripe.checkout.sessions.create(
      {
        line_items: prices.map((price) => ({
          price: price.productId,
          quantity: 1,
        })),

        ...(subscriptionPriceExist && {
          subscription_data: {
            metadata: { connectAccountSubscriptions: 'true' },
            application_fee_percent:
              +process.env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT,
          },
        }),

        ...(!subscriptionPriceExist && {
          payment_intent_data: {
            metadata: { connectAccountPayments: 'true' },
            application_fee_amount:
              +process.env.NEXT_PUBLIC_PLATFORM_ONETIME_FEE * 100,
          },
        }),

        mode: subscriptionPriceExist ? 'subscription' : 'payment',
        ui_mode: 'embedded',
        redirect_on_completion: 'never',
      },
      { stripeAccount: subAccountConnectAccId }
    )

    return NextResponse.json(
      {
        clientSecret: session.client_secret,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  } catch (error) {
    console.log('🔴 Error', error)
    //@ts-ignore
    return NextResponse.json({ error: error.message })
  }
}



export async function OPTIONS(request: Request) {
    const allowedOrigin = request.headers.get('origin')
    const response = new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
        'Access-Control-Max-Age': '86400',
      },
    })
  
    return response
  }