import { Lane } from "@prisma/client";
import React, { Dispatch, SetStateAction, useMemo } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useRouter } from "next/navigation";
import { deleteLane, saveActivity } from "@/lib/queries";
import { LaneDetail, TicketWithTags } from "@/lib/types";
import { useModal } from "@/app/providers/modal-provider";
import { Edit, MoreVertical, PlusCircleIcon, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import PipelineTicket from "./PipelineTicket";
import CustomModal from "@/components/golbal/CustomModal";
import LaneForm from "@/components/forms/LaneForm";
import ToastNotify from "@/components/golbal/ToastNotify";
import { set } from "date-fns";
import TicketForm from "@/components/forms/TicketForm";
type Props = {
  idx: number;
  lane: Lane;
  setAllTickets: Dispatch<SetStateAction<TicketWithTags>>;
  allTickets: TicketWithTags;
  tickets: TicketWithTags;
  pipelineId: string;
  subAccId: string;
  setClose: () => void;
};

const PipelineLane = ({
  idx,
  lane,
  allTickets,
  pipelineId,
  setAllTickets,
  subAccId,
  tickets,
  setClose,
}: Props) => {
  const router = useRouter();
  const { setOpen } = useModal();
  const randomColor = `#${Math.random().toString(16).slice(2, 8)}`;
  const amt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  });
  const laneAmt = useMemo(() => {
    return tickets?.reduce(
      (sum, ticket) => sum + (Number(ticket?.value) || 0),
      0
    );
  }, [tickets]);
  const handleEditLane = () => {
    setOpen(
      <CustomModal
        title="Edit Lane Details"
        desc="Simply change details of the lane in one click"
      >
        <LaneForm
          pipelineId={pipelineId}
          setClose={setClose}
          defaultData={lane}
        />
      </CustomModal>
    );
  };
  const handleDeleteLane = async () => {
    const res = await deleteLane(lane.id);
    if (res) {
      saveActivity({
        agencyId: undefined,
        desc: ` | Deleted lane |${res.name} `,
        subAccId,
      });
      ToastNotify({
        title: "Success",
        msg: "Lane deleted successfully",
      });
    } else {
      ToastNotify({
        title: "Oppse",
        msg: "Failed to delete lane ",
      });
    }
    setClose();
    router.refresh();
  };
  const addNewTicket = (ticket: any) => {
    //@ts-ignore
    setAllTickets([...allTickets, ticket]);
  };
  const handleCreateTicket = () => {
    setOpen(
      <CustomModal
        title="Create Ticket"
        desc="Ticket's are the way to tracks of tasks"
      >
        <TicketForm
          getNewTicket={addNewTicket}
          laneId={lane.id}
          subAccId={subAccId}
        />
      </CustomModal>
    );
  };
  return (
    <Draggable draggableId={lane.id.toString()} index={idx} key={lane.id}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          //@ts-ignore
          const offset = { x: 300, y: 0 };
          //@ts-ignore
          const x = provided.draggableProps.style?.left - offset.x;
          //@ts-ignore
          const y = provided.draggableProps.style?.top - offset.y;
          //@ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            top: y,
            left: x,
          };
        }

        return (
          <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="h-full"
          >
            <AlertDialog>
              <DropdownMenu>
                <div className="bg-slate-200/30 dark:bg-background/20  h-[700px] w-[300px] px-4 relative rounded-lg overflow-visible flex-shrink-0 ">
                  <div
                    {...provided.dragHandleProps}
                    className=" h-14 backdrop-blur-lg dark:bg-background/40 bg-slate-200/60  absolute top-0 left-0 right-0 z-10 "
                  >
                    <div className="h-full flex items-center p-4 justify-between cursor-grab border-b-[1px] ">
                      <div className="flex items-center w-full gap-2">
                        <div
                          className={cn("w-4 h-4 rounded-full")}
                          style={{ background: randomColor }}
                        />
                        <span className="font-bold text-sm">{lane.name}</span>
                      </div>
                      <div className="flex items-center flex-row">
                        <Badge className="bg-white text-black">
                          {amt.format(laneAmt ? laneAmt : 0)}
                        </Badge>
                        <DropdownMenuTrigger>
                          <MoreVertical className="text-muted-foreground cursor-pointer" />
                        </DropdownMenuTrigger>
                      </div>
                    </div>
                  </div>

                  <Droppable
                    droppableId={lane.id.toString()}
                    key={lane.id}
                    type="ticket"
                  >
                    {(provided) => (
                      <div className=" max-h-[700px] overflow-auto pt-12 ">
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="mt-2"
                        >
                          {tickets?.map((ticket, index) => (
                            <PipelineTicket
                              allTickets={allTickets}
                              setAllTickets={setAllTickets}
                              subAccId={subAccId}
                              ticket={ticket}
                              key={ticket.id.toString()}
                              idx={index}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger>
                      <DropdownMenuItem className="flex items-center gap-2 hover:bg-background/45 w-full" >
                        <Trash size={15} />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={handleEditLane}
                    >
                      <Edit size={15} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={handleCreateTicket}
                    >
                      <PlusCircleIcon size={15} />
                      Create Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </div>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={handleDeleteLane}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </DropdownMenu>
            </AlertDialog>
          </div>
        );
      }}
    </Draggable>
  );
};

export default PipelineLane;
