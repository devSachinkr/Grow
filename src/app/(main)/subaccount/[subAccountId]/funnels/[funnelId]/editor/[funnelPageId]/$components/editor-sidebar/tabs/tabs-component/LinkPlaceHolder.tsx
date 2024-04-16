import { EditorBtns } from "@/lib/constants";
import { LinkIcon } from "lucide-react";
import React from "react";

type Props = {};

const LinkPlaceHolder = (props: Props) => {
  const handleDrag = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };
  return (
    <div
      className="h-14 w-14 bg-muted flex items-center justify-center rounded-lg"
      draggable
      onDragStart={(e) => handleDrag(e, "link")}
    >
      <LinkIcon size={40} className="text-muted-foreground cursor-pointer" />
    </div>
  );
};

export default LinkPlaceHolder;
