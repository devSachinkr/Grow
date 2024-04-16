"use client";
import { useModal } from "@/app/providers/modal-provider";
import React from "react";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import GradientText from "../golbal/GradientText";
import CustomModal from "../golbal/CustomModal";
import MediaForm from "../forms/MediaForm";

type Props = {
  subAccId: string;
};

const UploadMediaButton = ({ subAccId }: Props) => {
  const {  setOpen, setClose } = useModal();
  return (
    <Button
      onClick={()=>setOpen(
        <CustomModal
          desc="Upload your phots/video/files in a single click."
          title="Guardian store "
        >
         <MediaForm subAccId={subAccId} setClose={setClose}/>
        </CustomModal>
      )}
      variant={"outline"}
      className="flex justify-center items-center gap-x-2 bg-transparent "
    >
      <Upload  size={16}/>
    <span className="text-primary font-bold">Upload</span>
    </Button>
  );
};

export default UploadMediaButton;
