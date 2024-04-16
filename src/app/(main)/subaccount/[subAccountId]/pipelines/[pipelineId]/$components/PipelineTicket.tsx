"use client";
import { TicketWithTags } from "@/lib/types";
import React, { Dispatch, SetStateAction } from "react";
import { Draggable } from "react-beautiful-dnd";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Contact2Icon,
  Edit,
  LinkIcon,
  MoreHorizontalIcon,
  Trash,
  User2Icon,
} from "lucide-react";
import { useModal } from "@/app/providers/modal-provider";
import CustomModal from "@/components/golbal/CustomModal";
import TagComponent from "@/components/golbal/TagComponent";
import { Tag } from "@prisma/client";
import TicketForm from "@/components/forms/TicketForm";
import { useRouter } from "next/navigation";
import ToastNotify from "@/components/golbal/ToastNotify";
import { deleteTicket, saveActivity } from "@/lib/queries";
type Props = {
  allTickets: TicketWithTags;
  setAllTickets: Dispatch<SetStateAction<TicketWithTags>>;
  subAccId: string;
  // @ts-ignore
  ticket: TicketWithTags[0];
  idx: number;
};

const PipelineTicket = ({
  allTickets,
  idx,
  setAllTickets,
  ticket,
  subAccId,
}: Props) => {
  const { setOpen } = useModal();
  const router = useRouter();
  // @ts-ignore
  const editNewTicket = (ticket: TicketWithTags[0]) => {
    setAllTickets((tickets) =>
      allTickets?.map((t) => {
        if (t.id === ticket.id) {
          return ticket;
        }
        return t;
      })
    );
  };
  const handleClickEdit = async () => {
    setOpen(
      <CustomModal title="Update Ticket Details" desc="">
        <TicketForm
          getNewTicket={editNewTicket}
          laneId={ticket.laneId}
          subAccId={subAccId}
        />
      </CustomModal>,
      async () => {
        return { ticket: ticket };
      }
    );
  };
  const handleDeleteTicket = async () => {
    try {
      setAllTickets((tickets) => tickets?.filter((t) => t.id !== ticket.id));
      const res = await deleteTicket(ticket.id);
      if (res) {
        await saveActivity({
          agencyId: undefined,
          desc: ` | Deleted ticket |${ticket.name} `,
          subAccId,
        });
        ToastNotify({
          title: "Success",
          msg: "Ticket deleted successfully",
        });
        router.refresh();
      }
    } catch (error) {
      ToastNotify({
        title: "Oppse",
        msg: "Failed to delete ticket",
      });
      console.log(error);
    }
  };
  return (
    <Draggable draggableId={ticket.id.toString()} index={idx}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          const offset = { x: 300, y: 20 };
          // @ts-ignore
          const x = provided.draggableProps.style?.left - offset?.x;
          // @ts-ignore
          const y = provided.draggableProps.style?.top - offset?.y;
          // @ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            left: x,
            top: y,
          };
        }
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <AlertDialog>
              <DropdownMenu>
                <Card className="my-4 dark:bg-slate-900 bg-white shadow-none transition-all">
                  <CardHeader className="p-[12px]">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg w-full">{ticket.name}</span>
                      <DropdownMenuTrigger>
                        <MoreHorizontalIcon className="text-muted-foreground" />
                      </DropdownMenuTrigger>
                    </CardTitle>
                    <span className="text-muted-foreground text-xs">
                      {new Date().toLocaleDateString()}
                    </span>
                    <div className="flex items-center flex-wrap gap-2">
                      {ticket.Tags.map((tag: Tag) => (
                        <TagComponent
                          key={tag.id}
                          title={tag.name}
                          colorName={tag.color}
                        />
                      ))}
                    </div>
                    <CardDescription className="w-full ">
                      {ticket.description}
                    </CardDescription>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="p-2 text-muted-foreground flex gap-2 hover:bg-muted transition-all rounded-lg cursor-pointer items-center">
                          <LinkIcon />
                          <span className="text-xs font-bold">CONTACT</span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent side="right" className="w-fit">
                        <div className="flex justify-between space-x-4">
                          <Avatar>
                            <AvatarImage />
                            <AvatarFallback className="bg-primary">
                              {ticket.Customer?.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              {ticket.Customer?.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {ticket.Customer?.email}
                            </p>
                            <div className="flex items-center pt-2">
                              <Contact2Icon className="mr-2 h-4 w-4 opacity-70" />
                              <span className="text-xs text-muted-foreground">
                                Joined{" "}
                                {ticket.Customer?.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </CardHeader>
                  <CardFooter className="m-0 p-2 border-t-[1px] border-muted-foreground/20 flex items-center justify-between">
                    <div className="flex item-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          alt="contact"
                          src={ticket.Assigned?.avatar}
                        />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          {ticket.Assigned?.name}
                          {!ticket.assignedUserId && <User2Icon size={14} />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col justify-center">
                        <span className="text-sm text-muted-foreground">
                          {ticket.assignedUserId
                            ? "Assigned to"
                            : "Not Assigned"}
                        </span>
                        {ticket.assignedUserId && (
                          <span className="text-xs w-28  overflow-ellipsis overflow-hidden whitespace-nowrap text-muted-foreground">
                            {ticket.Assigned?.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-bold">
                      {!!ticket.value &&
                        new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: "USD",
                        }).format(+ticket.value)}
                    </span>
                  </CardFooter>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Trash size={15} />
                        Delete Ticket
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={handleClickEdit}
                    >
                      <Edit size={15} />
                      Edit Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </Card>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the ticket and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={handleDeleteTicket}
                    >
                      Delete
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

export default PipelineTicket;
