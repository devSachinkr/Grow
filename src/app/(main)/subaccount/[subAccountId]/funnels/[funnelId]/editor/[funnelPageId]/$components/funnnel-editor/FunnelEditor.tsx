"use client";
import { useEditor } from "@/app/providers/web-editor/editorProvider";
import { Button } from "@/components/ui/button";
import { getFunnelPageDetails } from "@/lib/queries";
import clsx from "clsx";
import { EyeOff } from "lucide-react";
import React, { useEffect } from "react";
import Recursive from "./funnel-editor-components/Recursive";

type Props = {
  funnelPageId: string;
  liveMode?: boolean;
};

const FunnelEditor = ({ funnelPageId, liveMode }: Props) => {
  const { dispatch, state } = useEditor();
  useEffect(() => {
    if (liveMode) {
      dispatch({
        type: "TOGGLE_LIVE_MODE",
        payload: {
          value: true,
        },
      });
    }
  }, [liveMode]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getFunnelPageDetails(funnelPageId);
      if (!res) {
        return;
      }
      dispatch({
        type: "LOAD_DATA",
        payload: {
          elements: res.content ? JSON.parse(res.content) : "",
          withLive: !!liveMode,
        },
      });
    };
    fetchData();
  }, [funnelPageId]);

  const handleClick = () => {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {},
    });
  };
  const handleUnpreview = () => {
    dispatch({
      type: "TOGGLE_LIVE_MODE",
    });
    dispatch({
      type: "TOGGLE_PREVIEW_MODE",
    });
  };
  return (
    <div
      className={clsx(
        "use-automation-zoom-in h-full overflow-y-auto mr-[385px] bg-background transition-all rounded-md",
        {
          "!p-0 !mr-0":
            state.editor.previewMode === true || state.editor.liveMode === true,
          "!w-[850px]": state.editor.device === "Tablet",
          "!w-[420px]": state.editor.device === "Mobile",
          "w-full": state.editor.device === "DeskTop",
        }
      )}
      onClick={handleClick}
    >
      {state.editor.previewMode && state.editor.liveMode && (
        <Button
          variant={"ghost"}
          size={"icon"}
          className="w-6 h-6 bg-slate-600 p-[2px] fixed top-0 left-0 z-[100]"
          onClick={handleUnpreview}
        >
          <EyeOff />
        </Button>
      )}
      {Array.isArray(state.editor.elements) &&
        state.editor.elements.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}
    </div>
  );
};

export default FunnelEditor;
