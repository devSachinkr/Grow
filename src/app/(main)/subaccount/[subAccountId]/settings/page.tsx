import AgencyForm from "@/components/forms/AgencyForm";
import SubAccountDetails from "@/components/forms/SubAccountForm";
import UserForm from "@/components/forms/UserForm";
import BlurPage from "@/components/golbal/BlurPage";
import Settings from "@/components/icons/settings";
import { db } from "@/lib/db";
import { getUserDetails } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    subAccountId: string;
  };
};

const page = async ({ params: { subAccountId } }: Props) => {
  const user = await currentUser();
  if (!user) return redirect(`/`);
  const userDetails = await getUserDetails();
  if (!userDetails) return redirect(`/`);
  const subAccDetails = await db.subAccount.findUnique({
    where: { id: subAccountId },
  });

  if (!subAccDetails) return;
  const agencyDetails = await db.agency.findUnique({
    where: { id: subAccDetails.agencyId },
    include: { SubAccount: true },
  });
  if (!agencyDetails) return;
  const subAccount=agencyDetails.SubAccount
  return (
    <BlurPage>
      <div className="flex lg:!flex-row flex-col gap-4">
        <SubAccountDetails
          agencyDetails={agencyDetails}
          details={subAccDetails}
          userId={userDetails.id}
          userName={userDetails.name}
        />
         <UserForm id={userDetails.id} type="subaccount" subAccounts={subAccount} userData={userDetails}/>
      </div>
    </BlurPage>
  );
};

export default page;
