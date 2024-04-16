import AgencyForm from "@/components/forms/AgencyForm";
import GradientText from "@/components/golbal/GradientText";
import { getUserDetails, verifyInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  searchParams: {
    plan: Plan;
    state: string;
    code: string;
  };
};

const page = async ({ searchParams: { plan, state, code } }: Props) => {
  const agencyId = await verifyInvitation();
  const userDetails = await getUserDetails();
  if (agencyId) {
    if (
      userDetails?.role === "SUBACCOUNT_USER" ||
      userDetails?.role === "SUBACCOUNT_GUEST"
    ) {
      return redirect("/subaccount");
    } else if (
      userDetails?.role === "AGENCY_OWNER" ||
      userDetails?.role === "AGENCY_ADMIN"
    ) {
      if (plan) {
        return redirect(`/agency/${agencyId}/billing?plan=${plan}`);
      }
      if (state) {
        const statePath = state.split("___")[0];
        const stateAgencyId = state.split("___")[1];
        if (!stateAgencyId) return <div className="">Not Authorized</div>;
        return redirect(`/agency/${stateAgencyId}/${statePath}?code=${code}`);
      } else return redirect(`/agency/${agencyId}`);
    } else {
      return <div>Not Authorized</div>;
    }
  }
  const user = await currentUser();

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <div className="text-center ">
          <GradientText
            text="Create An Agency"
            from="red"
            to="blue"
            size="2rem"
          />
          <AgencyForm
            data={{ agencyEmail: user?.emailAddresses[0].emailAddress }}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
