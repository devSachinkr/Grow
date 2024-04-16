import BlurPage from "@/components/golbal/BlurPage";
import MediaComponent from "@/components/media/MediaComponent";
import { getMedia } from "@/lib/queries";
import React from "react";

type Props = {
    params:{
      subAccountId: string;
    }
};

const page = async ({params:{ subAccountId }}: Props) => {
  const mediaFiles = await getMedia(subAccountId);
  if (!mediaFiles) return;
  return (
    <BlurPage>
      <MediaComponent data={mediaFiles} subAccId={subAccountId} />
    </BlurPage>
  );
};

export default page;
