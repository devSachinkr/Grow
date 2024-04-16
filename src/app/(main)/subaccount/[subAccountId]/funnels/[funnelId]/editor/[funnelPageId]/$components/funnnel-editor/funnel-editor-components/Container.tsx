"use client";
import {
  EditorElement,
  useEditor,
} from "@/app/providers/web-editor/editorProvider";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React from "react";
import { v4 } from "uuid";
import Recursive from "./Recursive";
import { Trash } from "lucide-react";
import GradientText from "@/components/golbal/GradientText";

type Props = {
  element: EditorElement;
};

const Container = ({ element }: Props) => {
  const { content, id, name, styles, type } = element;
  const { state, dispatch } = useEditor();

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;
    switch (componentType) {
      case "text":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: "Text Element",
              },
              id: v4(),
              name: "Text",
              styles: {
                color: "white",
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
      case "video":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: "https://youtube.com/embed/IVAWBpeNAmE?si=FZTnYYPOjw7Q5N8u",
              },
              id: v4(),
              name: "Video",
              styles: {},
              type: "video",
            },
          },
        });
        break;
      case "link":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                href: "https://google.com",
                innerText: "Link Element",
              },
              id: v4(),
              name: "Link",
              styles: { ...defaultStyles },
              type: "link",
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
              content: [
                {
                  content: [],
                  id: v4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
                {
                  content: [],
                  id: v4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
              ],
              id: v4(),
              name: "Two Columns",
              styles: { ...defaultStyles, display: "flex" },
              type: "2Col",
            },
          },
        });
        break;
      case "contactForm":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content:[],
              id: v4(),
              name: "Contact Form",
              styles: {},
              type: "contactForm",
            },
          },
        });
        break;
      case 'paymentForm':
        dispatch({
          type:'ADD_ELEMENT',
          payload:{
            containerId:id,
            elementDetails:{
              content:[],
              id:v4(),
              name:'Payment Form',
              styles:{},
              type:'paymentForm'
            }
          }
        })
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === "__body") return;
    const componentType = e.dataTransfer.setData(
      "componentType",
      type as string
    );
  };
  const handleClick = (e: React.MouseEvent) => {
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
      payload: { elementDetails: { ...element } },
    });
  };
  return (
    <div
      style={styles}
      className={clsx("relative p-4 transition-all group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "h-full": type === "__body",
        "overflow-y-auto": type === "__body",
        "flex flex-col md:!flex-row": type === "2Col",
        "!border-blue-500":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-2":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === "__body",
        "!border-solid":
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        "border-dashed border-[1px] border-blue-500": !state.editor.liveMode,
      })}
      onDrop={(e) => handleDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== "__body"}
      onDragStart={(e) => handleDragStart(e, "container")}
      onClick={handleClick}
    >
      <Badge
        className={clsx(
          "absolute -top-[23px] p-1 -left-[1px] rounded-none rounded-t-lg hidden bg-black hover:bg-slate-800",
          {
            block:
              state.editor.selectedElement.id === id && !state.editor.liveMode,
          }
        )}
      >
        <GradientText from="red" to="blue" size="20px">
          {name}
        </GradientText>
      </Badge>
      {Array.isArray(content) &&
        content.map((childEle) => (
          <Recursive key={childEle.id} element={childEle} />
        ))}

      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div className="absolute bg-black px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
            <Trash size={16} onClick={handleDeleteElement} />
          </div>
        )}
    </div>
  );
};

export default Container;
