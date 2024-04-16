"use client";
import {
  EditorElement,
  useEditor,
} from "@/app/providers/web-editor/editorProvider";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import React from "react";
import Recursive from "./Recursive";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import { v4 } from "uuid";
import { Trash } from "lucide-react";
import GradientText from "@/components/golbal/GradientText";

type Props = {
  element: EditorElement;
};

const TwoColumnComponent = ({ element }: Props) => {
  const { id, content, type } = element;
  const { dispatch, state } = useEditor();

  const handleOnDrop = (e: React.DragEvent, type: string) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;
    switch (componentType) {
      case "text":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: { innerText: "Text Component" },
              id: v4(),
              name: "Text",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "text",
            },
          },
        });
        break;
      case "container":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Container",
              styles: { ...defaultStyles },
              type: "container",
            },
          },
        });
        break;
      case "2Col":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Two Columns",
              styles: { ...defaultStyles },
              type: "2Col",
            },
          },
        });
        break;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };
  return (
    <div
      style={element.styles}
      className={clsx("relative p-4 transition-all", {
        "h-fit": type === "container",
        "h-full": type === "__body",
        "m-4": type === "container",
        "!border-blue-500":
          state.editor.selectedElement.id === element.id &&
          !state.editor.liveMode,
        "!border-solid":
          state.editor.selectedElement.id === element.id &&
          !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      id="innerContainer"
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== "__body"}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, "container")}
    >
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg bg-black">
           <GradientText from="red" to="blue" size="20px">
              {state.editor.selectedElement.name}
            </GradientText>
          </Badge>
        )}
      {Array.isArray(content) &&
        content.map((childElement) => (

          <Recursive key={childElement.id} element={childElement} />
        ))}
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <div className="absolute px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white bg-black">
            <Trash
              className="cursor-pointer "
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default TwoColumnComponent;
