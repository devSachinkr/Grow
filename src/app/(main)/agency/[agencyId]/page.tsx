import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ClipboardIcon,
  Contact2,
  Goal,
  Link,
  ShoppingCart,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { AreaChart } from "@tremor/react";
import GradientText from "@/components/golbal/GradientText";
import CircleProgress from "@/components/golbal/CircleProgress";
type Props = {
  params: {
    agencyId: string;
  };
  searchParams: { code: string };
};
const page = async ({
  params: { agencyId },
  searchParams: { code },
}: Props) => {
  let currency = "INR";
  let sessions;
  let totalClosedSession;
  let totalPendingSession;
  let net = 0;
  let potentialIncome = 0;
  let closingRate = 0;
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000;
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: agencyId,
    },
  });
  if (!agencyDetails) return;

  const subAccounts = await db.subAccount.findMany({
    where: {
      agencyId,
    },
  });

  if (agencyDetails.connectAccountId) {
    const res = await stripe.accounts.retrieve({
      stripeAccount: agencyDetails.connectAccountId,
    });
    currency = res?.default_currency?.toUpperCase() || "INR";
    const checkoutSessions = await stripe.checkout.sessions.list(
      {
        created: { gte: startDate, lte: endDate },
        limit: 100,
      },
      { stripeAccount: agencyDetails.connectAccountId }
    );
    sessions = checkoutSessions.data;
    totalClosedSession = checkoutSessions.data
      .filter((session) => session.status === "complete")
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));

    totalPendingSession = checkoutSessions.data
      .filter((session) => session.status === "open")
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));
    net = +totalClosedSession
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);

    potentialIncome = +totalPendingSession
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);

    closingRate = +(
      (totalClosedSession.length / checkoutSessions.data.length) *
      100
    ).toFixed(2);
  }
  return (
    <div className="relative h-full">
      {!agencyDetails.connectAccountId && (
        <div className="absolute -top-10 -left-10 right-0 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Stripe</CardTitle>
              <CardDescription>
                You need to connect your stripe account to see metrics
              </CardDescription>
              <Link
                href={`/agency/${agencyDetails.id}/launchpad`}
                className="p-2 w-fit bg-secondary text-white rounded-md flex items-center gap-2"
              >
                <ClipboardIcon />
                Launch Pad
              </Link>
            </CardHeader>
          </Card>
        </div>
      )}
      <h1 className="text-4xl">
        <GradientText from="red" to="blue" size="2.5rem">
          Dashboard
        </GradientText>
      </h1>
      <Separator className=" my-6" />
      <div className="flex flex-col gap-4 pb-6">
        <div className="flex gap-4 flex-col xl:!flex-row">
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>
                <GradientText from="red" to="blue" size="1.3rem">
                  Income
                </GradientText>
              </CardDescription>
              <CardTitle className="text-4xl">
                {net ? `${currency} ${net.toFixed(2)}` : `$0.00`}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Total revenue generated as reflected in your stripe dashboard.
            </CardContent>
            <span className="absolute right-4 top-4 text-muted-foreground">
              <GradientText from="red" to="blue" size="2rem">
                ₹
              </GradientText>
            </span>
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>
                <GradientText from="red" to="blue" size="1.3rem">
                  Potential Income
                </GradientText>
              </CardDescription>
              <CardTitle className="text-4xl">
                {potentialIncome
                  ? `${currency} ${potentialIncome.toFixed(2)}`
                  : `₹0.00`}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              This is how much you can close.
            </CardContent>
            <span className="absolute right-4 top-4 text-muted-foreground">
              <GradientText from="red" to="blue" size="2rem">
                ₹
              </GradientText>
            </span>
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>
                <GradientText from="red" to="blue" size="1.3rem">
                  Active Clients
                </GradientText>
              </CardDescription>
              <CardTitle className="text-4xl">{subAccounts.length}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Reflects the number of sub accounts you own and manage.
            </CardContent>
            <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardTitle>
                <GradientText from="red" to="blue" size="1.3rem">
                  Agency Goal
                </GradientText>
              </CardTitle>
              <CardDescription>
                <p className="mt-2">
                  Reflects the number of sub accounts you want to own and
                  manage.
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">
                    Current: {subAccounts.length}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Goal: {agencyDetails.goal}
                  </span>
                </div>
                <Progress
                className="mt-2"
                  value={(subAccounts.length / agencyDetails.goal) * 100}
                />
              </div>
            </CardFooter>
            <Goal className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
        </div>
        <div className="flex gap-4 xl:!flex-row flex-col">
          <Card className="p-4 flex-1">
            <CardHeader>
              <CardTitle>
                <GradientText from="red" to="blue" size="1.3rem">
                  Transaction History
                </GradientText>
              </CardTitle>
            </CardHeader>
            <AreaChart
              className="text-sm stroke-primary"
              data={[
                ...(totalClosedSession || []),
                ...(totalPendingSession || []),
              ]}
              index="created"
              categories={["amount_total"]}
              colors={["primary"]}
              yAxisWidth={30}
              showAnimation={true}
            />
          </Card>
          <Card className="xl:w-[400px] w-full">
            <CardHeader>
              <CardTitle>
                <GradientText from="red" to="blue" size="1.3rem">
                  Conversations
                </GradientText>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CircleProgress
                value={closingRate}
                desc={
                  <>
                    {sessions && (
                      <div className="flex flex-col">
                        Abandoned
                        <div className="flex gap-2">
                          <ShoppingCart className="text-rose-700" />
                          {sessions.length}
                        </div>
                      </div>
                    )}
                    {totalClosedSession && (
                      <div className="felx flex-col">
                        Won Carts
                        <div className="flex gap-2">
                          <ShoppingCart className="text-emerald-700" />
                          {totalClosedSession.length}
                        </div>
                      </div>
                    )}
                  </>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
