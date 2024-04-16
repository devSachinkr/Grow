import React from "react";
import { getFunnelDetails } from "@/lib/queries";
import { redirect } from "next/navigation";
import BlurPage from "@/components/golbal/BlurPage";
import Link from "next/link";
import GradientText from "@/components/golbal/GradientText";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FunnelSettings from "./$components/FunnelSettings";
import FunnelSteps from "./$components/FunnelSteps";
type Props = {
  params: {
    funnelId: string;
    subAccountId: string;
  };
};

const page = async ({ params: { funnelId,subAccountId } }: Props) => {
  const funnelDetails = await getFunnelDetails(funnelId);
  if (!funnelDetails) return redirect(`/subaccount/${subAccountId}/funnels`);

  return (
    <BlurPage>
      <Link
        href={`/subaccount/${subAccountId}/funnels`}
        className="flex justify-between gap-4 mb-4 text-muted-foreground"
      >
        <p>{"< "}Back</p>
      </Link>
      <h1>
        <GradientText from="red" to="blue" size="3rem">
          {funnelDetails.name}
        </GradientText>
      </h1>
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnelDetails}
            subAccId={subAccountId}
            pages={funnelDetails.FunnelPages}
            funnelId={funnelId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelSettings
            subAccId={subAccountId}
            defaultData={funnelDetails}
          />
        </TabsContent>
      </Tabs>
    </BlurPage>
  );
};

export default page;
