"use client";
import {
  DevicesTypes,
  useEditor,
} from "@/app/providers/web-editor/editorProvider";
import GradientText from "@/components/golbal/GradientText";
import ToastNotify from "@/components/golbal/ToastNotify";
import ToolTip from "@/components/golbal/ToolTip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { saveActivity, upsertFunnelPage } from "@/lib/queries";
import { FunnelPage } from "@prisma/client";
import clsx from "clsx";
import {
  ArrowLeftCircle,
  EyeIcon,
  Laptop,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
type Props = {
  funnelId: string;
  funnelPageId: string;
  subAccountId: string;
  funnelPageDetails: FunnelPage;
};

const FunnelNav = ({
  funnelId,
  funnelPageId,
  subAccountId,
  funnelPageDetails,
}: Props) => {
  const router = useRouter();
  const { state, dispatch } = useEditor();
  useEffect(() => {
    dispatch({
      type: "SET_FUNNELPAGE_ID",
      payload: {
        funnelPageId: funnelPageId,
      },
    });
  }, [funnelPageId]);

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.target.value || e.target.value === funnelPageDetails.name) {
      e.target.value = funnelPageDetails.name;
      return;
    }
    const name = e.target.value;
    const res = await upsertFunnelPage(
      subAccountId,
      { id: funnelPageId, name, order: funnelPageDetails.order },
      funnelPageId
    );
    if (res) {
      ToastNotify({
        title: "Success",
        msg: "Changes saved",
      });
    } else {
      ToastNotify({
        title: "Oppse",
        msg: "Page name not updated",
      });
    }
  };
  const handlePreviewClick = () => {
    dispatch({
      type: "TOGGLE_PREVIEW_MODE",
    });
    dispatch({
      type: "TOGGLE_LIVE_MODE",
    });
  };
  const handleUndo = () => {
    dispatch({
      type: "UNDO",
    });
  };
  const handleRedo = () => {
    dispatch({
      type: "REDO",
    });
  };
  const handleSave = async () => {
    const content = JSON.stringify(state.editor.elements);
    console.log(content);
    const res = await upsertFunnelPage(
      subAccountId,
      { ...funnelPageDetails, content },
      funnelPageId
    );
    if (res) {
      await saveActivity({
        subAccId: subAccountId,
        desc: `| Updated funnel page | ${res.name}`,

        agencyId: undefined,
      });
      ToastNotify({
        title: "Success",
        msg: "Changes saved",
      });
      router.refresh();
    } else {
      ToastNotify({
        title: "Oppse",
        msg: "Failed to save page details",
      });
    }
  };
  return (
    <TooltipProvider delayDuration={0}>
      <nav
        className={clsx(
          "border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all",
          { "!h-0 !p-0 !overflow-hidden": state.editor.previewMode }
        )}
      >
        <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
          <Link href={`/subaccount/${subAccountId}/funnels/${funnelId}`}>
            <ArrowLeftCircle />
          </Link>
          <div className="flex flex-col w-full ">
            <Input
              defaultValue={funnelPageDetails.name}
              className="border-none h-5 m-0 p-0 text-lg"
              onBlur={handleBlur}
            />
            <span className="text-sm text-muted-foreground">
              Path: /{funnelPageDetails.pathName}
            </span>
          </div>
        </aside>
        <aside>
          <Tabs
            defaultValue="DeskTop"
            className="w-fit "
            value={state.editor.device}
            onValueChange={(value) => {
              dispatch({
                type: "CHANGE_DEVICE",
                payload: { device: value as DevicesTypes },
              });
            }}
          >
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="DeskTop"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0"
                  >
                    <Laptop />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <GradientText from="red" to="blue" size="20px">
                    Desktop
                  </GradientText>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Tablet"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <Tablet />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <GradientText from="red" to="blue" size="20px">
                    Tablet
                  </GradientText>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Mobile"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <Smartphone />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <GradientText from="red" to="blue" size="20px">
                    Mobile
                  </GradientText>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>
        <aside className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-slate-800"
            onClick={handlePreviewClick}
          >
            <ToolTip text="Preview">
              <EyeIcon />
            </ToolTip>
          </Button>
          <ToolTip text="Undo">
            <Button
              disabled={!(state.history.currentIndex > 0)}
              onClick={handleUndo}
              variant={"ghost"}
              size={"icon"}
              className="hover:bg-slate-800"
            >
              <Undo2 />
            </Button>
          </ToolTip>
          <ToolTip text="Redo">
            <Button
              disabled={
                !(state.history.currentIndex < state.history.history.length - 1)
              }
              onClick={handleRedo}
              variant={"ghost"}
              size={"icon"}
              className="hover:bg-slate-800 mr-4"
            >
              <Redo2 />
            </Button>
          </ToolTip>
          <div className="flex flex-col item-center mr-4">
            <div className="flex flex-row items-center gap-4">
              Draft
              <Switch disabled defaultChecked={true} />
              Publish
            </div>
            <span className="text-muted-foreground text-sm">
              Last updated {funnelPageDetails.updatedAt.toLocaleDateString()}
            </span>
          </div>
          <Button onClick={handleSave}>Save</Button>
        </aside>
      </nav>
    </TooltipProvider>
  );
};

export default FunnelNav;
