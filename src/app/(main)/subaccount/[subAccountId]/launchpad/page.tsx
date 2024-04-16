import BlurPage from "@/components/golbal/BlurPage";
import { db } from "@/lib/db";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GradientText from "@/components/golbal/GradientText";
import { getStripeOAuthLink } from "@/lib/utils";
import { stripe } from "@/lib/stripe";
type Props = {
  params: {
    subAccountId: string;
  };
  searchParams: {
    state: string;
    code: string;
  };
};

const page = async ({
  params: { subAccountId },
  searchParams: { code, state },
}: Props) => {
  const subAccountDetails = await db.subAccount.findUnique({
    where: { id: subAccountId },
  });
  if (!subAccountDetails) return;
  const allDetailsExist =
    subAccountDetails.address &&
    subAccountDetails.subAccountLogo &&
    subAccountDetails.city &&
    subAccountDetails.companyEmail &&
    subAccountDetails.companyPhone &&
    subAccountDetails.country &&
    subAccountDetails.name &&
    subAccountDetails.state;

  let connectStripe = false;
  const stripeOAuthLink = () => {
    return getStripeOAuthLink({
      type: "subaccount",
      id: `launchpad___${subAccountId}`,
    });
  };
  if (code) {
    const res = await stripe.oauth.token({
      grant_type: "authorization_code",
      code: code,
    });
    if (!subAccountDetails.connectAccountId) {
      await db.subAccount.update({
        where: { id: subAccountDetails.id },
        data: { connectAccountId: res.stripe_user_id },
      });
      connectStripe = true;
    }
  }
  return (
    <BlurPage>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full h-full max-w-[800px]">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>
                <GradientText from="red" to="blue" size="3rem">
                  Lets get started!
                </GradientText>
              </CardTitle>
              <CardDescription>
                Follow the steps below to get your account setup.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                  <Image
                    src="/appstore.png"
                    alt="app logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain"
                  />
                  <GradientText from="red" size="20px" to="blue">
                    {" "}
                    Save the website as a shortcut on your mobile device
                  </GradientText>
                </div>
                <Button className="bg-primary/50">Start</Button>
              </div>
              <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                  <Image
                    src="/stripelogo.png"
                    alt="app logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain"
                  />
                  <p className="text-muted-foreground">
                    Connect your stripe account to accept payments and see your
                    dashboard.
                  </p>
                </div>
                {subAccountDetails.connectAccountId || connectStripe ? (
                  <CheckCircleIcon
                    size={50}
                    className=" text-primary p-2 flex-shrink-0"
                  />
                ) : (
                  <Link
                    className="bg-primary/50 hover:bg-primary/45 py-2 px-4 rounded-md text-white"
                    href={stripeOAuthLink()}
                  >
                    connect
                  </Link>
                )}
              </div>
              <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                  <Image
                    src={subAccountDetails.subAccountLogo}
                    alt="app logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain"
                  />
                  <p className="text-muted-foreground">
                    {" "}
                    Fill in all your bussiness details
                  </p>
                </div>
                {allDetailsExist ? (
                  <CheckCircleIcon
                    size={50}
                    className="text-primary p-2 flex-shrink-0"
                  />
                ) : (
                  <Link
                    className="bg-primary py-2 px-4 rounded-md text-white"
                    href={`/agency/${subAccountDetails.id}/settings`}
                  >
                    Start
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BlurPage>
  );
};

export default page;
