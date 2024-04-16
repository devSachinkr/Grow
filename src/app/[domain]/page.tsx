import { db } from "@/lib/db";
import { getDomainContent } from "@/lib/queries";
import { notFound } from "next/navigation";
import React from "react";
import EditorProvider from "../providers/web-editor/editorProvider";
import FunnelNav from "../(main)/subaccount/[subAccountId]/funnels/[funnelId]/editor/[funnelPageId]/$components/FunnelNav";
import FunnelEditor from "../(main)/subaccount/[subAccountId]/funnels/[funnelId]/editor/[funnelPageId]/$components/funnnel-editor/FunnelEditor";

type Props = {
  params: {
    domain: string;
  };
};

const page = async ({ params: { domain } }: Props) => {
  const data = await getDomainContent(domain.slice(0, -1));
  if (!data) return notFound();
  const pageData = data.FunnelPages.find((page) => !page.pathName);
  if (!pageData) return notFound();

  await db.funnelPage.update({
    where: {
      id: pageData.id,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });
  return (
    <EditorProvider
      subAccountId={data.subAccountId}
      funnelId={pageData.funnelId}
      pageDetails={pageData}
    >
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
};

export default page;
