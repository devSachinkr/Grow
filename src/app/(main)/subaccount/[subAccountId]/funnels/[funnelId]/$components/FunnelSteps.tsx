"use client";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Funnel, FunnelPage } from "@prisma/client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DragDropContext,
  DragStart,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useModal } from "@/app/providers/modal-provider";
import CustomModal from "@/components/golbal/CustomModal";
import { Check, ExternalLink, LucideEdit } from "lucide-react";
import FunnelPagePlaceholder from "@/components/icons/funnel-page-placeholder";
import Link from "next/link";
import GradientText from "@/components/golbal/GradientText";
import ToastNotify from "@/components/golbal/ToastNotify";
import { upsertFunnelPage } from "@/lib/queries";
import FunnelPageForm from "@/components/forms/FunnelPageForm";
import FunnelStepCard from "./FunnelStepCard";
type Props = {
  funnel: Funnel;
  subAccId: string;
  pages: FunnelPage[];
  funnelId: string;
};

const FunnelSteps = ({ funnel, funnelId, pages, subAccId }: Props) => {
  const { setOpen } = useModal();
  const [currentPage, setCurrentPage] = useState<FunnelPage | undefined>(
    pages[0]
  );
  const [pagesState, setPagesState] = useState(pages);
  const onDragStart = (event: DragStart) => {
    const { draggableId } = event;
    const value = pagesState.find((p) => p.id === draggableId);
  };
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }
    const newPages = Array.from(pagesState)
      .toSpliced(source.index, 1)
      .toSpliced(destination.index, 0, pagesState[source.index])
      .map((page, idx) => {
        return { ...page, order: idx };
      });
    setPagesState(newPages);
    newPages.forEach(async (page, idx) => {
      try {
        await upsertFunnelPage(
          subAccId, 
          {
            name: page.name,
            order: idx,
            id: page.id,
          },
          funnelId
        );
      } catch (error) {
        ToastNotify({
          title: "Oppse",
          msg: "Failed to update funnel page",
        });
        return;
      }
    });
  };
  return (
    <AlertDialog>
      <div className="flex border-[1px] lg:!flex-row flex-col ">
        <aside className="flex-[0.3] bg-background p-6  flex flex-col justify-between ">
          <ScrollArea className="h-full ">
            <div className="flex gap-4 items-center">
              <Check />
              <GradientText from="red" to="blue" size="2.5rem">
                Funnel Steps
              </GradientText>
            </div>
            {pagesState.length ? (
              <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <Droppable
                  droppableId="funnels"
                  direction="vertical"
                  key="funnels"
                >
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {pagesState.map((page, idx) => (
                        <div
                          className="relative"
                          key={page.id}
                          onClick={() => setCurrentPage(page)}
                        >
                          <FunnelStepCard
                            funnelPage={page}
                            idx={idx}
                            key={page.id}
                            activePage={page.id === currentPage?.id}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="text-center text-muted-foreground py-6">
                No Pages
              </div>
            )}
          </ScrollArea>
          <Button
            className="mt-4 w-full bg-primary/55"
            onClick={() => {
              setOpen(
                <CustomModal
                  title=" Create or Update a Funnel Page"
                  desc="Funnel Pages allow you to create step by step processes for customers to follow"
                >
                  <FunnelPageForm
                    subAccId={subAccId}
                    funnelId={funnelId}
                    order={pagesState.length}
                  />
                </CustomModal>
              );
            }}
          >
            Create New Steps
          </Button>
        </aside>
        <aside className="flex-[0.7] bg-muted p-4 ">
          {!!pages.length ? (
            <Card className="h-full flex justify-between flex-col">
              <CardHeader>
                <p className="text-sm text-muted-foreground">Page name</p>
                <CardTitle>{currentPage?.name}</CardTitle>
                <CardDescription className="flex flex-col gap-4">
                  <div className="border-2 rounded-lg sm:w-80 w-full  overflow-clip">
                    <Link
                      href={`/subaccount/${subAccId}/funnels/${funnelId}/editor/${currentPage?.id}`}
                      className="relative group"
                    >
                      <div className="cursor-pointer group-hover:opacity-30 w-full">
                        <FunnelPagePlaceholder />
                      </div>
                      <LucideEdit
                        size={50}
                        className="!text-muted-foreground absolute top-1/2 left-1/2 opacity-0 transofrm -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 transition-all duration-100"
                      />
                    </Link>

                    <Link
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_SCHEME}${funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${currentPage?.pathName}`}
                      className="group flex items-center justify-start p-2 gap-2 hover:text-primary transition-colors duration-200"
                    >
                      <ExternalLink size={15} />
                      <div className="w-64 overflow-hidden overflow-ellipsis ">
                        {process.env.NEXT_PUBLIC_SCHEME}
                        {funnel.subDomainName}.{process.env.NEXT_PUBLIC_DOMAIN}/
                        {currentPage?.pathName}
                      </div>
                    </Link>
                  </div>

                  <FunnelPageForm
                    subAccId={subAccId}
                    defaultData={currentPage}
                    funnelId={funnelId}
                    order={currentPage?.order || 0}
                  />
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              Create a page to view page settings.
            </div>
          )}
        </aside>
      </div>
    </AlertDialog>
  );
};

export default FunnelSteps;
