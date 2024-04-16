import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import { db } from "@/lib/db";
import { getAgencyDetails } from "@/lib/queries";
import DataTable from "./data/data-table";
import { columns } from "./data/columns";
import { Plus, PlusCircle } from "lucide-react";
import { currentUser } from "@clerk/nextjs";
import InvitationForm from "@/components/forms/InvitationForm";

interface Props {
  params: { agencyId: string };
}
const page = async ({ params: { agencyId } }: Props) => {
  const user = await currentUser();
  const users = await db.user.findMany({
    where: { agencyId },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });
  if (!users) return null;
  const agencyDetails = await getAgencyDetails(agencyId);
  if (!agencyDetails) return;

  return (
    <DataTable
      actionButtonText={
        <>
          <PlusCircle /> Add
        </>
      }
      modalChildren={<InvitationForm agencyId={agencyId}/>}
      columns={columns}
      data={users}
      filterValue="name"
    ></DataTable>
  );
};

export default page;
