import Unauthorized from "@/components/unauthorized";
import { getUserDetails, verifyInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";
import React from "react";

type Props = { searchParams: { state: string; code: string } };

const page = async ({ searchParams: { code, state } }: Props) => {
  const agencyId = verifyInvitation();
  if (!agencyId) return <Unauthorized />;
  const user = await getUserDetails();
  if (!user) return;
  const getSubAccountAccess = user.Permissions.find((p) => p.access === true);
  if (state) {
    const statePath = state.split("___")[0];
    const stateSubAccountId = state.split("___")[1];
    if (!stateSubAccountId) return <Unauthorized />;
    return redirect(
      `/subaccount/${stateSubAccountId}/${statePath}?code=${code}`
    );
  }
  if (getSubAccountAccess) {
    return redirect(`/subaccount/${getSubAccountAccess.subAccountId}`);
  }
  return <Unauthorized />;
};

export default page;
