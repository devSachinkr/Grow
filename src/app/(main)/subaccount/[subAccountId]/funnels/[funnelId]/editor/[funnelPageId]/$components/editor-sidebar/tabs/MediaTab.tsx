"use client";
import Loading from "@/components/golbal/Loading";
import MediaComponent from "@/components/media/MediaComponent";
import { getMedia } from "@/lib/queries";
import { MediaFile } from "@/lib/types";
import { Media } from "@prisma/client";
import React, { useEffect, useState } from "react";

type Props = {
  subAccId: string;
};

const MediaTab = ({ subAccId }: Props) => {
  const [data, setData] = useState<MediaFile>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const res = await getMedia(subAccId);
      if (res) {
        setData(res);
      }
      setLoading(false)
    };
    fetchData();
  }, [subAccId]);
  return (
    <div className="h-[100%] overflow-y-auto p-4">
      {loading ? (
        <Loading />
      ) : (
        <MediaComponent subAccId={subAccId} data={data} />
      )}
    </div>
  );
};

export default MediaTab;
