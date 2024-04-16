import { db } from "@/lib/db";
import {
  getLanesWithTickets,
  getPipelineDetails,
  updateLanesOrder,
  updateTicketsOrder,
} from "@/lib/queries";
import { LaneDetail } from "@/lib/types";
import { redirect } from "next/navigation";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PipelineInfo from "./$components/PipelineInfo";
import PipelineSettings from "./$components/PipelineSettings";
import PipelineView from "./$components/PipelineView";
type Props = {
  params: {
    subAccountId: string;
    pipelineId: string;
  };
};

const page = async ({ params: { pipelineId, subAccountId } }: Props) => {
  const pipelineDetails = await getPipelineDetails(pipelineId);
  if (!pipelineDetails)
    return redirect(`/subaccount/${subAccountId}/pipelines`);
  const allPiplelineOfSubAccount = await db.pipeline.findMany({
    where: {
      subAccountId,
    },
  });
  const lanes = (await getLanesWithTickets(pipelineId)) as LaneDetail[];
  return (
    <Tabs defaultValue="view" className="w-full">
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PipelineInfo
          pipelineId={pipelineId}
          subAccId={subAccountId}
          pipelines={allPiplelineOfSubAccount}
        />
        <div>
          <TabsTrigger value="view">Pipeline View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="view">
        <PipelineView
          lanes={lanes}
          pipelineDetails={pipelineDetails}
          pipelineId={pipelineId}
          subAccId={subAccountId}
          updateLanesOrder={updateLanesOrder}
          updateTicketsOrder={updateTicketsOrder}
        />
      </TabsContent>
      <TabsContent value="settings">
        <PipelineSettings
          pipelineId={pipelineId}
          pipelines={allPiplelineOfSubAccount}
          subAccId={subAccountId}
        />
      </TabsContent>
    </Tabs>
  );
};

export default page;
