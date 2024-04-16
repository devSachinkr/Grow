import { EditorBtns } from "@/lib/constants";
import { Container } from "lucide-react";
import React from "react";

type Props = {};

const ContainerPlaceHolder = (props: Props) => {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };
  return (
    <div
      className="h-14 w-14 bg-muted/70 rounded-lg p-2 flex flex-col gap-[4px]"
      draggable
      onDragStart={(e) => handleDragStart(e, "container")}
    >
        <Container size={40} className="cursor-pointer text-muted-foreground"/>
    </div>
  );
};

export default ContainerPlaceHolder;
