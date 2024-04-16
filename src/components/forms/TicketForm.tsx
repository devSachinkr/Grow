"use client";
import { useModal } from "@/app/providers/modal-provider";
import {
  getSubAccMembers,
  saveActivity,
  searchContacts,
  upsertTicket,
} from "@/lib/queries";

import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { CheckIcon, ChevronsUpDownIcon, User2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { cn } from '@/lib/utils'
import { TicketFormSchema, TicketWithTags } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, Tag, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ToastNotify from "../golbal/ToastNotify";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Loading from "../golbal/Loading";
import TagCreator from "../golbal/TagCreator";
type Props = {
  laneId: string;
  subAccId: string;
  getNewTicket: (ticket: TicketWithTags) => void;
};

const TicketForm = ({ getNewTicket, laneId, subAccId }: Props) => {
  const { data: defaultData, setClose } = useModal();
  const form = useForm<z.infer<typeof TicketFormSchema>>({
    resolver: zodResolver(TicketFormSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultData.ticket?.name || "",
      description: defaultData?.ticket?.description || "",
    },
  });
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [contact, setContact] = useState("");
  const [search, setSearch] = useState("");
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [assignedTo, setAssignedTo] = useState(
    defaultData.ticket?.Assigned?.id || ""
  );
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([]);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isLoading = form.formState.isLoading;
  useEffect(() => {
    if (subAccId) {
      const fetchData = async () => {
        const res = await getSubAccMembers(subAccId);
        if (res) setAllTeamMembers(res);
      };
      fetchData();
    }
  }, [subAccId]);
  useEffect(() => {
    if (defaultData.ticket) {
      form.reset({
        name: defaultData.ticket.name || "",
        description: defaultData.ticket?.description || "",
        value: String(defaultData.ticket?.value || 0),
      });
      if (defaultData.ticket.customerId)
        setContact(defaultData.ticket.customerId);

      const fetchData = async () => {
        const res = await searchContacts(
          // @ts-ignore
          defaultData.ticket?.Customer?.name
        );
        setContactList(res);
      };
      fetchData();
    }
  }, []);
  const onSubmit = async (values: z.infer<typeof TicketFormSchema>) => {
    if (!laneId) return;
    try {
      const res = await upsertTicket(
        {
          ...values,
          laneId,
          id: defaultData.ticket?.id,
          assignedUserId: assignedTo,
          ...(contact ? { customerId: contact } : {}),
        },
        tags
      );
      if (res) {
        await saveActivity({
          agencyId: undefined,
          desc: ` | Updated a ticket | ${res?.name}`,
          subAccId,
        });
        // @ts-ignore
        getNewTicket(res);
        ToastNotify({
          title: "Success",
          msg: "Saved  details",
        });
      }
      router.refresh();
    } catch (error) {
      ToastNotify({
        title: "Oppse",
        msg: "Could not save pipeline details",
      });
    }
    setClose();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ticket Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h3>Add tags</h3>
            <TagCreator
              subAccId={subAccId}
              getSelectedTags={setTags}
              defaultTags={defaultData.ticket?.Tags || []}
            />
            <FormLabel>Assigned To Team Member</FormLabel>
            <Select
              onValueChange={setAssignedTo}
              defaultValue={assignedTo}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage alt="contact" />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm text-muted-foreground">
                        Not Assigned
                      </span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {allTeamMembers.map((teamMember) => (
                  <SelectItem
                    key={teamMember.id}
                    value={teamMember.id}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          alt="contact"
                          src={teamMember.avatar}
                        />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm text-muted-foreground">
                        {teamMember.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormLabel>Customer</FormLabel>
            <Popover>
              <PopoverTrigger
                asChild
                className="w-full"
              >
                <Button
                  variant="outline"
                  role="combobox"
                  className="justify-between"
                >
                  {contact
                    ? contactList.find((c) => c.id === contact)?.name
                    : 'Select Customer...'}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search..."
                    className="h-9"
                    value={search}
                    onChangeCapture={async (value) => {
                      //@ts-ignore
                      setSearch(value.target.value)
                      if (saveTimerRef.current)
                        clearTimeout(saveTimerRef.current)
                      saveTimerRef.current = setTimeout(async () => {
                        const response = await searchContacts(
                          //@ts-ignore
                          value.target.value
                        )
                        setContactList(response)
                        setSearch('')
                      }, 1000)
                    }}
                  />
                  <CommandList asChild>
                  <CommandEmpty>No Customer found.</CommandEmpty>
                  <CommandGroup>
                    {contactList.map((c) => (
                      <CommandItem
                        key={c.id}
                        value={c.id}
                        onSelect={(currentValue) => {
                          setContact(
                            currentValue === contact ? '' : currentValue
                          )
                        }}
                      >
                        {c.name}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            contact === c.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              className="w-20 mt-4"
              disabled={isLoading}
              type="submit"
            >
              {form.formState.isSubmitting ? <Loading /> : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
};

export default TicketForm;
