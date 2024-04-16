"use client";
import { useModal } from "@/app/providers/modal-provider";
import LaneForm from "@/components/forms/LaneForm";
import CustomModal from "@/components/golbal/CustomModal";
import GradientText from "@/components/golbal/GradientText";
import { Button } from "@/components/ui/button";
import {
  LaneDetail,
  PipelineWithLanesCardTagTicket,
  TicketAndTag,
} from "@/lib/types";
import { Lane, Pipeline, Ticket } from "@prisma/client";
import { Flag, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import PipelineLane from "./PipelineLane";
type Props = {
  lanes: LaneDetail[];
  pipelineDetails: PipelineWithLanesCardTagTicket;
  pipelineId: string;
  subAccId: string;
  updateLanesOrder: (lanes: Lane[]) => Promise<void>;
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>;
};

const PipelineView = ({
  lanes,
  pipelineDetails,
  pipelineId,
  subAccId,
  updateLanesOrder,
  updateTicketsOrder,
}: Props) => {
  const { setOpen, setClose } = useModal();
  const router = useRouter();
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([]);
  const ticketsFromAllLanes: TicketAndTag[] = [];

  lanes.forEach((lane) => {
    lane.Tickets.forEach((t) => {
      ticketsFromAllLanes.push(t);
    });
  });
  const [allTickets, setAllTickets] = useState(ticketsFromAllLanes);

  useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  const AddLane = () => {
    setOpen(
      <CustomModal
        title="Create a Lane"
        desc="Lane allows  you to group ticket's"
      >
        <LaneForm pipelineId={pipelineId} setClose={setClose} />
      </CustomModal>
    );
  };
  const dargEnd = (dropResult: DropResult) => {
    const { destination, source, type } = dropResult
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return
    }

    switch (type) {
      case 'lane': {
        const newLanes = [...allLanes]
          .toSpliced(source.index, 1)
          .toSpliced(destination.index, 0, allLanes[source.index])
          .map((lane, idx) => {
            return { ...lane, order: idx }
          })

        setAllLanes(newLanes)
        updateLanesOrder(newLanes)
      }

      case 'ticket': {
        let newLanes = [...allLanes]
        const originLane = newLanes.find(
          (lane) => lane.id === source.droppableId
        )
        const destinationLane = newLanes.find(
          (lane) => lane.id === destination.droppableId
        )

        if (!originLane || !destinationLane) {
          return
        }

        if (source.droppableId === destination.droppableId) {
          const newOrderedTickets = [...originLane.Tickets]
            .toSpliced(source.index, 1)
            .toSpliced(destination.index, 0, originLane.Tickets[source.index])
            .map((item, idx) => {
              return { ...item, order: idx }
            })
          originLane.Tickets = newOrderedTickets
          setAllLanes(newLanes)
          updateTicketsOrder(newOrderedTickets)
          router.refresh()
        } else {
          const [currentTicket] = originLane.Tickets.splice(source.index, 1)

          originLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx
          })

          destinationLane.Tickets.splice(destination.index, 0, {
            ...currentTicket,
            laneId: destination.droppableId,
          })

          destinationLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx
          })
          setAllLanes(newLanes)
          updateTicketsOrder([
            ...destinationLane.Tickets,
            ...originLane.Tickets,
          ])
          router.refresh()
        }
      }
    }
    }
    return (
      <DragDropContext onDragEnd={dargEnd}>
        <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
          <div className="flex items-center justify-between">
            <h1>
              <GradientText from="red" to="blue" size="2.5rem">
                {pipelineDetails?.name}
              </GradientText>
            </h1>
            <Button
              onClick={AddLane}
              className="flex items-center gap-4 bg-primary/55"
            >
              <PlusCircle size={16} /> Add Lane
            </Button>
          </div>
          <Droppable
            droppableId="lanes"
            type="lane"
            direction="horizontal"
            key={"lanes"}
          >
            {(provided) => (
              <div
                className="flex items-center gap-x-2 overflow-auto"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div className="flex mt-4">
                  {allLanes.map((lane, idx) => (
                    <PipelineLane
                      allTickets={allTickets}
                      //@ts-ignore
                      setAllTickets={setAllTickets}
                      pipelineId={pipelineId}
                      tickets={lane?.Tickets}
                      key={idx}
                      lane={lane}
                      idx={idx}
                      setClose={setClose}
                      subAccId={subAccId}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
          {allLanes.length === 0 && (
            <div className="flex items-center justify-center w-full flex-col">
              <div className="opacity-100">
                <Flag
                  width="100%"
                  height="100%"
                  className="text-muted-foreground"
                />
              </div>
            </div>
          )}
        </div>
      </DragDropContext>
    );
  };
export default PipelineView;
