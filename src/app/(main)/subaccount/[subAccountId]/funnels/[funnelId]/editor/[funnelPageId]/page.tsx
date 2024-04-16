import EditorProvider from "@/app/providers/web-editor/editorProvider";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import FunnelNav from "./$components/FunnelNav";
import FunnelSideBar from "./$components/editor-sidebar/FunnelSideBar";
import FunnelEditor from "./$components/funnnel-editor/FunnelEditor";

type Props = {
  params: {
    funnelId: string;
    funnelPageId: string;
    subAccountId: string;
  };
};

const page = async ({
  params: { funnelId, funnelPageId, subAccountId },
}: Props) => {
  const funnelPageDetails = await db.funnelPage.findFirst({
    where: {
      id: funnelPageId,
    },
  });
  if (!funnelPageDetails)
    return redirect(`/subaccount/${subAccountId}/funnels/${funnelId}`);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
      <EditorProvider
        subAccountId={subAccountId}
        funnelId={funnelId}
        pageDetails={funnelPageDetails}
      >
        {/* Navigation Bar */}
        <FunnelNav
          funnelId={funnelId}
          funnelPageId={funnelPageId}
          subAccountId={subAccountId}
          funnelPageDetails={funnelPageDetails}
        />
        <div className="h-full flex justify-center">
          <FunnelEditor funnelPageId={funnelPageId}/>
        </div>
        {/* Side Bar */}
        <FunnelSideBar
          subAccountId={subAccountId}

        />
      </EditorProvider>
    </div>
  );
};

export default page;
