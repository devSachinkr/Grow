import React from "react";

type Props = {};

const TwoColumnPlaceholder = (props: Props) => {
  return (
    <div
      draggable
      className="h-14 w-14 bg-muted/70 rounded-lg p-2 flex flex-col gap-[4px] cursor-pointer"
      onDragStart={(e) => {
        if (e.type === null) return;
        e.dataTransfer.setData("componentType", "2Col");
      }}
    >
      <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full"></div>
      <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full"></div>
    </div>
  );
};

export default TwoColumnPlaceholder;
