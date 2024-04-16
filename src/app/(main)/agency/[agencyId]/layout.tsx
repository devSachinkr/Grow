import BlurPage from "@/components/golbal/BlurPage";
import InfoBar from "@/components/golbal/InfoBar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import { getNotifications, verifyInvitation } from "@/lib/queries";
import { NotificationWithUser } from "@/lib/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { agencyId: string };
};

const layout = async ({ children, params }: Props) => {
  const agencyId = await verifyInvitation();
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  if (!agencyId) {
    return redirect("/agency");
  }

  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  )
    return <Unauthorized />;

  let allNoti:any = [];
  const notifications = await getNotifications(agencyId);
  if (notifications) allNoti = notifications;
  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar notifications={allNoti} role={allNoti[0]?.User?.role} />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default layout;
