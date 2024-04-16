import FunnelEditor from "@/app/(main)/subaccount/[subAccountId]/funnels/[funnelId]/editor/[funnelPageId]/$components/funnnel-editor/FunnelEditor";
import EditorProvider from "@/app/providers/web-editor/editorProvider";
import { getDomainContent } from "@/lib/queries";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: {
    domain: string;
    path: string;
  };
};

const page = async ({ params: { domain, path } }: Props) => {
  const data = await getDomainContent(domain.slice(0, -1));
  const pageData = data?.FunnelPages.find((page) => page.pathName === path);
  if (!pageData || !data) return notFound();

  return  <EditorProvider
  subAccountId={data.subAccountId}
  funnelId={pageData.funnelId}
  pageDetails={pageData}
>
  <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
</EditorProvider>;
};

export default page;
