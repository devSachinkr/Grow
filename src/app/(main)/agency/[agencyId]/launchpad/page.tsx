import GradientText from "@/components/golbal/GradientText";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getStripeOAuthLink } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Props {
  params: {
    agencyId: string;
  };
  searchParams: { code: string };
}
const page = async ({
  params: { agencyId },
  searchParams: { code },
}: Props) => {
  const user = await currentUser();
  if (!user) return null;
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: agencyId,
    },
  });
  if (!agencyDetails) return null;
  const allDetailsExist =
    agencyDetails.address &&
    agencyDetails.agencyLogo &&
    agencyDetails.city &&
    agencyDetails.agencyEmail &&
    agencyDetails.agencyPhone &&
    agencyDetails.country &&
    agencyDetails.name &&
    agencyDetails.state &&
    agencyDetails.pincode;

  const stripeOAuthLink = getStripeOAuthLink({
    type: "agency",
    id: `launchpad___${agencyDetails.id}`,
  });
  let connectStripeAcc = false;
  if (code) {
    if (!agencyDetails.connectAccountId) {
      try {
        const res = await stripe.oauth.token({
          grant_type: "authorization_code",
          code: code,
        });
        await db.agency.update({
          where: { id: agencyId },
          data: { connectAccountId: res.stripe_user_id },
        });
        
        connectStripeAcc = true;
      } catch (error) {
        console.log(error);
      
      }
    }
  }
  return (
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
              {agencyDetails.connectAccountId || connectStripeAcc ? (
                <CheckCircleIcon
                  size={50}
                  className=" text-primary p-2 flex-shrink-0"
                />
              ) : (
                <Link
                  className="bg-primary/50 py-2 px-4 rounded-md text-white"
                  href={stripeOAuthLink}
                >
                  connect
                </Link>
              )}
            </div>
            <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
              <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                <Image
                  src={agencyDetails.agencyLogo}
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
                  href={`/agency/${agencyId}/settings`}
                >
                  Start
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
