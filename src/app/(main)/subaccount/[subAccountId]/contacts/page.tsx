import BlurPage from "@/components/golbal/BlurPage";
import { db } from "@/lib/db";
import { Contact, SubAccount, Ticket } from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import format from "date-fns/format";
import GradientText from "@/components/golbal/GradientText";
import ContactButton from "./$components/ContactButton";
type Props = {
  params: {
    subAccountId: string;
  };
};

type SubAccWithContacts = SubAccount & {
  Contact: (Contact & {
    Ticket: Ticket[];
  })[];
};
const page = async ({ params: { subAccountId } }: Props) => {
  const TablesHead = ["Name", "Email", "Active", "Created Date", "Total Value"];
  const contacts = (await db.subAccount.findUnique({
    where: { id: subAccountId },
    include: {
      Contact: {
        include: {
          Ticket: {
            select: { value: true },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })) as SubAccWithContacts;
  const allContacts = contacts.Contact;

  const formatTotal = (ticket: Ticket[]) => {
    if (!ticket || !ticket.length) return "$0.00";
    const amt = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    });
    const total = ticket.reduce((sum, t) => sum + (Number(t?.value) || 0), 0);
    return amt.format(total);
  };

  return (
    <BlurPage>
      <h1 className="text-4xl p-4">
        <GradientText from="red" to="blue" size="2.5rem">
          Contacts
        </GradientText>
      </h1>
      <ContactButton subAccId={subAccountId} />
      <Table>
        <TableHeader>
          <TableRow>
            {TablesHead.map((head) => (
              <TableHead className="w-[200px]" key={head}>
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {allContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="flex flex-col md:!flex-row   items-center gap-x-2 gap-y-2 md:gap-y-0">
                <Avatar>
                  <AvatarImage alt="@shadcn" />
                  <AvatarFallback className="bg-primary text-white">
                    {contact.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-muted-foreground">{contact.name}</p>
              </TableCell>
              <TableCell>
                <GradientText from="red" to="blue" size="20px">
                  {contact.email}
                </GradientText>
              </TableCell>
              <TableCell>
                {formatTotal(contact.Ticket) === "$0.00" ? (
                  <Badge variant={"destructive"}>Inactive</Badge>
                ) : (
                  <Badge className="bg-emerald-700">Active</Badge>
                )}
              </TableCell>
              <TableCell>{format(contact.createdAt, "MM/dd/yyyy")}</TableCell>
              <TableCell >
                {formatTotal(contact.Ticket)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BlurPage>
  );
};

export default page;
