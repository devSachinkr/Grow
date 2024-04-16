import { Funnel } from "@prisma/client";
import React from "react";

import FunnelForm from "@/components/forms/FunnelForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { getConnectAccountProducts } from "@/lib/stripe/stripe-action";
import FunnelProductsTable from "./FunnelProductsTable";
type Props = {
  subAccId: string;
  defaultData: Funnel;
};

const FunnelSettings = async ({ defaultData, subAccId }: Props) => {
  const subaccountDetails = await db.subAccount.findUnique({
    where: { id: subAccId },
  });
  if (!subaccountDetails) return null;
  if (!subaccountDetails.connectAccountId) return null;
  const products = await getConnectAccountProducts(
    subaccountDetails.connectAccountId
  );
  if (!products) return null;
  return (
    <div className="flex gap-4 flex-col xl:!flex-row">
      <Card className="flex-1 flex-shrink">
        <CardHeader>
          <CardTitle>Funnel Products</CardTitle>
          <CardDescription>
            Select the products and services you wish to sell on this funnel.
            You can sell one time and recurring products too.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <>
            {subaccountDetails.connectAccountId ? (
              <FunnelProductsTable
                defaultData={defaultData}
                products={products}
              />
            ) : (
              "Connect your stripe account to sell products."
            )}
          </>
        </CardContent>
      </Card>

      <FunnelForm subAccId={subAccId} defaultData={defaultData} />
    </div>
  );
};

export default FunnelSettings;
