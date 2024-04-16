import InfoBar from "@/components/golbal/InfoBar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import { db } from "@/lib/db";
import {
  getNotifications,
  getUserDetails,
  verifyInvitation,
} from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: {
    subAccountId: string;
  };
};

const layout = async ({ children, params: { subAccountId } }: Props) => {
  const agencyId = await verifyInvitation();
  if (!agencyId) return <Unauthorized />;
  const user = await currentUser();
  if (!user) return redirect("/");

  let allNoti: any = [];
  if (!user.privateMetadata.role) {
    return <Unauthorized />;
  } else {
    const permissions = await getUserDetails();
    const hasPermi = permissions?.Permissions.find(
      (p) => p.subAccountId === subAccountId && p.access
    );
    if (!hasPermi) return <Unauthorized />;
    const notifications = await getNotifications(agencyId);
    if (notifications) allNoti = notifications;
    if (
      user?.privateMetadata.role === "AGENCY_OWNER" ||
      user?.privateMetadata.role === "AGENCY_ADMIN"
    ) {
      allNoti = notifications;
    } else {
      const filterNotification = notifications?.filter(
        (n) => n.subAccountId === subAccountId
      );
      if (filterNotification) {
        allNoti = filterNotification;
      }
    }
  }
  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={subAccountId} type="subaccount" />
      <div className="md:pl-[300px]">
        <InfoBar
          notifications={allNoti}
          subAccountId={subAccountId}
          role={user.privateMetadata.role as Role}
        />
      <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default layout;
