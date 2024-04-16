import {
  EditorElement,
  useEditor,
} from "@/app/providers/web-editor/editorProvider";
import GradientText from "@/components/golbal/GradientText";
import { Badge } from "@/components/ui/badge";
import { EditorBtns } from "@/lib/constants";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React from "react";

type Props = {
  element: EditorElement;
};

const VideoComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const styles = element.styles;
  const handleDrag = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
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
    dispatch({ type: "DELETE_ELEMENT", payload: { elementDetails: element } });
  };
  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDrag(e, "video")}
      onClick={handleClick}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center",
        {
          "!border-blue-500": state.editor.selectedElement.id === element.id,
          "!border-solid": state.editor.selectedElement.id === element.id,
          "border-dashed border-[1px] border-blue-500": !state.editor.liveMode,
        }
      )}
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
        <iframe
          width={element.styles.width || "560"}
          height={element.styles.height || "315"}
          src={element.content.src}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
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

export default VideoComponent;
