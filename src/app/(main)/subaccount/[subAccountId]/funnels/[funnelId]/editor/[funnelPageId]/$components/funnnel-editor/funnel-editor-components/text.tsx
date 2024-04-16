"use client";
import {
  EditorElement,
  useEditor,
} from "@/app/providers/web-editor/editorProvider";
import GradientText from "@/components/golbal/GradientText";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React, { CSSProperties } from "react";

type Props = {
  element: EditorElement;
};

const TextComponent = ({ element }: Props) => {
  const { dispatch, state } = useEditor();
  const styles: CSSProperties = element.styles;
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: { ...element },
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
        },
      },
    });
  };
  return (
    <div
      style={styles}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all",
        {
          "!border-blue-500": state.editor.selectedElement.id === element.id,

          "!border-solid": state.editor.selectedElement.id === element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
      onClick={handleClick}
    >
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute p-1 -top-[23px] -left-[1px] rounded-none rounded-t-lg bg-black hover:bg-slate-700">
            <GradientText from="red" to="blue" size="20px">
              {state.editor.selectedElement.name}
            </GradientText>
          </Badge>
        )}
      <span
        contentEditable={!state.editor.liveMode}
        onBlur={(e) => {
          dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
              elementDetails: {
                ...element,
                content: {
                  innerText: e.target.innerText,
                },
              },
            },
          });
        }}
      >
        {!Array.isArray(element.content) && element.content.innerText}
      </span>
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white bg-black">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default TextComponent;
