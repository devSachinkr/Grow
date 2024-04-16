import AgencyForm from "@/components/forms/AgencyForm";
import UserForm from "@/components/forms/UserForm";
import { db } from "@/lib/db";
import { getUserDetails } from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    agencyId: string;
  };
};

const page = async ({ params: { agencyId } }: Props) => {
  const user = await getUserDetails();
  if (!user) {
    return redirect("/");
  }
  const agencyDetails = await db.agency.findUnique({
    where: { id: agencyId },
    include: { SubAccount: true },
  });

  if (!agencyDetails) return null;

  const subAccounts = agencyDetails.SubAccount;
  return <div className="flex lg:!flex-row flex-col gap-4">
    <AgencyForm data={agencyDetails}/>
    <UserForm type="agency" id={agencyId} subAccounts={subAccounts} userData={user} />
  </div>;
};

export default page;
