"use client";
import {
  EditorElement,
  useEditor,
} from "@/app/providers/web-editor/editorProvider";
import GradientText from "@/components/golbal/GradientText";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

const LinkComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const styles = element.styles;
  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: { ...element } },
    });
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
  return (
    <div
      style={styles}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-start justify-start",
        {
          "!border-blue-500": state.editor.selectedElement.id === element.id,
          "!border-solid": state.editor.selectedElement.id === element.id,
          "border-dashed border-[1px] border-blue-500": !state.editor.liveMode,
        }
      )}
      onClick={(e) => handleClick(e)}
      draggable={!state.editor.liveMode}
      onDragStart={(e) => {
        if (!state.editor.liveMode) return;
        e.dataTransfer.setData("componentType", "link");
      }}
    >
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg bg-black">
            <GradientText from="red" to="blue" size="20px">
              {state.editor.selectedElement.name}
            </GradientText>
          </Badge>
        )}
      {!Array.isArray(element.content) && (
        <a
          href={element.content.href || "www.google.com"}
          contentEditable={!state.editor.liveMode}
          onBlur={(e) => {
            dispatch({
              type: "UPDATE_ELEMENT",
              payload: {
                elementDetails: {
                  ...element,
                  content: {
                    innerText: e.target.innerText,
                    href: e.target.href,
                  },
                },
              },
            });
          }}
        >
          {element.content.innerText}
        </a>
      )}
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

export default LinkComponent;
