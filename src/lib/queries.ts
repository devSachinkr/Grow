"use server";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { db } from "./db";
import { redirect } from "next/navigation";
import {
  Agency,
  Contact,
  Lane,
  Media,
  Pipeline,
  Plan,
  Prisma,
  Role,
  SubAccount,
  Tag,
  Ticket,
  User,
} from "@prisma/client";
import { v4 } from "uuid";
import {
  FunnelFormSchema,
  MediaType,
  SaveActivityProps,
  UpsertFunnelPage,
} from "./types";
import { z } from "zod";
import { Content } from "next/font/google";
import { revalidatePath } from "next/cache";

export const getUserDetails = async () => {
  const user = await currentUser();
  if (!user) throw new Error("User not found");
  const res = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      Agency: {
        include: {
          SubAccount: { include: { SidebarOption: true } },
          sidebarOption: true,
        },
      },
      Permissions: true,
    },
  });
  return res;
};

export const createTeam = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return null;
  const response = await db.user.create({ data: { ...user } });
  return response;
};

export const verifyInvitation = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const res = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });

  if (res) {
    const userDetails = await createTeam(res.agencyId, {
      email: res.email,
      agencyId: res.agencyId,
      name: `${user.firstName} ${user.lastName}`,
      role: res.role,
      avatar: user.imageUrl,
      id: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await saveActivity({
      desc: "Joined",
      agencyId: res?.agencyId,
      subAccId: undefined,
    });
    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || "SUBACCOUNT_USER",
        },
      });
      await db.invitation.delete({
        where: { email: userDetails.email },
      });
      return userDetails.agencyId;
    } else {
      return null;
    }
  } else {
    const agency = await db.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    });
    return agency ? agency.agencyId : null;
  }
};

export const saveActivity = async ({
  desc,
  subAccId,
  agencyId,
}: SaveActivityProps) => {
  const user = await currentUser();
  let userDetails;
  if (!user) {
    const res = await db.user.findFirst({
      where: {
        Agency: { SubAccount: { some: { id: subAccId } } },
      },
    });
    if (res) {
      userDetails = res;
    }
  } else {
    userDetails = await db.user.findUnique({
      where: { email: user?.emailAddresses[0].emailAddress },
    });
  }
  if (!userDetails) throw new Error("User not found");
  let findAgencyId = agencyId;
  if (!findAgencyId) {
    if (!subAccId) throw new Error("Need At least one of agencyId or subAccId");
    const res = await db.subAccount.findUnique({ where: { id: subAccId } });
    if (res) findAgencyId = res.agencyId;
  }
  if (subAccId) {
    await db.notification.create({
      data: {
        notification: `${userDetails.name}| ${desc}`,
        User: {
          connect: {
            id: userDetails.id,
          },
        },
        Agency: {
          connect: {
            id: findAgencyId,
          },
        },
        SubAccount: {
          connect: {
            id: subAccId,
          },
        },
      },
    });
  } else {
    await db.notification.create({
      data: {
        notification: `${userDetails.name}| ${desc}`,
        User: {
          connect: {
            id: userDetails.id,
          },
        },
        Agency: {
          connect: {
            id: findAgencyId,
          },
        },
      },
    });
  }
};

export const updateAgencyDetails = async (
  agencyId: string,
  data: Partial<Agency>
) => {
  try {
    const res = await db.agency.update({
      where: { id: agencyId },
      data: data,
    });
    return res ? res : null;
  } catch (error) {
    console.log("error", error);
  }
};

export const deleteAgency = async (agencyId: string) => {
  const res = await db.agency.delete({
    where: { id: agencyId },
  });
  if (!res) throw new Error("Failed to delete agency");

  return res;
};

export const initUser = async (data: Partial<User>) => {
  const user = await currentUser();
  if (!user) return;
  const res = await db.user.upsert({
    where: { email: user?.emailAddresses[0].emailAddress },
    update: data,
    create: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
      name: `${user.firstName} ${user.lastName}`,
      role: data.role || "SUBACCOUNT_USER",
    },
  });
  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: data.role || "SUBACCOUNT_USER",
    },
  });
  return res;
};

export const upsertAgency = async (agencyDetails: Agency, price?: Plan) => {
  if (!agencyDetails.agencyEmail) return;
  try {
    const res = await db.agency.upsert({
      where: { id: agencyDetails.id },
      update: agencyDetails,
      create: {
        users: {
          connect: {
            email: agencyDetails.agencyEmail,
          },
        },
        ...agencyDetails,
        sidebarOption: {
          create: [
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${agencyDetails.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${agencyDetails.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${agencyDetails.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${agencyDetails.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${agencyDetails.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${agencyDetails.id}/team`,
            },
          ],
        },
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getNotifications = async (agencyId: string) => {
  try {
    const res = await db.notification.findMany({
      where: { agencyId: agencyId },
      include: { User: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const upsertSubAccount = async (data: SubAccount) => {
  try {
    if (!data.companyEmail) return null;
    const agencyOwner = await db.user.findFirst({
      where: {
        Agency: { id: data.agencyId },
        role: "AGENCY_OWNER",
      },
    });
    if (!agencyOwner) throw new Error("Agency not exist");
    const permissionId = v4();
    const res = await db.subAccount.upsert({
      where: { id: data.id },
      update: { ...data },
      create: {
        ...data,
        Permissions: {
          create: {
            access: true,
            email: agencyOwner.email,
            id: permissionId,
          },
          connect: {
            subAccountId: data.id,
            id: permissionId,
          },
        },
        Pipeline: {
          create: {
            name: "Lead Cycle",
          },
        },
        SidebarOption: {
          create: [
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/subaccount/${data?.id}/launchpad`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/subaccount/${data?.id}/settings`,
            },
            {
              name: "Funnels",
              icon: "pipelines",
              link: `/subaccount/${data?.id}/funnels`,
            },
            {
              name: "Media",
              icon: "database",
              link: `/subaccount/${data?.id}/media`,
            },
            {
              name: "Automations",
              icon: "chip",
              link: `/subaccount/${data?.id}/automations`,
            },
            {
              name: "Pipelines",
              icon: "flag",
              link: `/subaccount/${data?.id}/pipelines`,
            },
            {
              name: "Contacts",
              icon: "person",
              link: `/subaccount/${data?.id}/contacts`,
            },
            {
              name: "Dashboard",
              icon: "category",
              link: `/subaccount/${data?.id}`,
            },
          ],
        },
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUserPermission = async (userId: string) => {
  try {
    const res = await db.user.findUnique({
      where: { id: userId },
      select: { Permissions: { include: { SubAccount: true } } },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (data: Partial<User>) => {
  const res = await db.user.update({
    where: { email: data.email },
    data: { ...data },
  });
  await clerkClient.users.updateUserMetadata(res.id, {
    privateMetadata: { role: data.role || "SUBACCOUNT_USER" },
  });
  return res;
};

export const changeUserPermissions = async (
  premissionId: string | undefined,
  userEmail: string,
  subAccId: string,
  val: boolean
) => {
  try {
    const res = await db.permissions.upsert({
      where: { id: premissionId },
      update: { email: userEmail, access: val, subAccountId: subAccId },
      create: { email: userEmail, access: val, subAccountId: subAccId },
    });
    return res;
  } catch (error) {
    console.log("Failed to change user permissions ", error);
  }
};

export const deleteSubAccount = async (subAccId: string) => {
  try {
    if (!subAccId) throw new Error("Sub account id is required");
    const res = await db.subAccount.delete({
      where: {
        id: subAccId,
      },
    });
    return res;
  } catch (error) {
    console.log("Failed to delete sub account", error);
  }
};

export const getAgencyDetails = async (agencyId: string) => {
  const res = await db.agency.findUnique({
    where: { id: agencyId },
    include: { SubAccount: true },
  });
  return res;
};

export const deleteUser = async (userID: string) => {
  try {
    const res = await db.user.delete({
      where: { id: userID },
    });
    return res;
  } catch (error) {
    console.log("Failed to delete user ", error);
  }
};

export const getUser = async (userId: string) => {
  const res = await db.user.findUnique({
    where: { id: userId },
  });
  return res;
};

export const sendInvitation = async (
  email: string,
  role: Role,
  agencyId: string
) => {
  if (!email || !agencyId) return;

  const res = await db.invitation.create({
    data: {
      email,
      role,
      agencyId,
    },
  });
  try {
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: process.env.NEXT_PUBLIC_URL,
      publicMetadata: {
        throughInvitation: true,
        role,
      },
    });
  } catch (error) {
    console.log("Failed to send invitation ", error);
  }
  return res;
};

export const getMedia = async (subAccId: string) => {
  if (!subAccId) throw new Error("Sub Account id is required");
  try {
    const res = await db.subAccount.findUnique({
      where: { id: subAccId },
      include: { Media: true },
    });
    if (!res) throw new Error("Failed to get Sub Account");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createMedia = async (subAccId: string, data: MediaType) => {
  try {
    const res = await db.media.create({
      data: {
        subAccountId: subAccId,
        name: data.name,
        link: data.link,
      },
    });
    return res;
  } catch (error) {
    console.log("Failed to upload file", error);
  }
};

export const deleteMedia = async (mediaId: string) => {
  try {
    const res = await db.media.delete({
      where: { id: mediaId },
    });
    return res;
  } catch (error) {
    console.log("Failed to delete media", error);
  }
};

export const getPipelineDetails = async (pipelineId: string) => {
  try {
    const res = await db.pipeline.findUnique({
      where: { id: pipelineId },
    });
    if (!res) throw new Error("Failed to get Pipeline");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getLanesWithTickets = async (pipelineId: string) => {
  if (!pipelineId) throw new Error("Pipeline id is required");
  try {
    const res = await db.lane.findMany({
      where: { pipelineId },
      include: {
        Tickets: {
          orderBy: { order: "asc" },
          include: { Tags: true, Assigned: true, Customer: true },
        },
      },
      orderBy: { order: "asc" },
    });
    if (!res) throw new Error("Failed to get Lanes");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const upsertFunnel = async (
  subAccId: string,
  funnel: z.infer<typeof FunnelFormSchema> & { liveProducts: string },
  funnelId: string
) => {
  try {
    const res = await db.funnel.upsert({
      where: { id: funnelId },
      create: {
        ...funnel,
        id: funnelId || v4(),
        subAccountId: subAccId,
      },
      update: {
        ...funnel,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const upsertPipeLine = async (
  data: Prisma.PipelineUncheckedCreateWithoutLaneInput
) => {
  try {
    const res = await db.pipeline.upsert({
      where: { id: data.id || v4() },
      create: data,
      update: { ...data },
    });
    if (!res) throw new Error("Failed to create pipeline");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deletePipeline = async (pipelineId: string) => {
  if (!pipelineId) throw new Error("Pipeline id is required");
  const res = await db.pipeline.delete({
    where: { id: pipelineId },
  });
  if (!res) throw new Error("Failed to delete pipeline");
  return res;
};

export const updateLanesOrder = async (lanes: Lane[]) => {
  try {
    const res = lanes.map((l) =>
      db.lane.update({
        where: {
          id: l.id,
        },
        data: {
          order: l.order,
        },
      })
    );
    await db.$transaction(res);
  } catch (error) {
    console.log(error);
  }
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const res = tickets.map((t) =>
      db.ticket.update({
        where: { id: t.id },
        data: {
          order: t.order,
          laneId: t.laneId,
        },
      })
    );
    await db.$transaction(res);
  } catch (error) {
    console.log(error);
  }
};

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  let order: number;
  try {
    if (!lane.order) {
      const lanes = await db.lane.findMany({
        where: {
          pipelineId: lane.pipelineId,
        },
      });
      order = lanes.length;
    } else {
      order = lane.order;
    }
    const res = await db.lane.upsert({
      where: {
        id: lane.id || v4(),
      },
      create: {
        ...lane,
        order,
      },
      update: {
        ...lane,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteLane = async (laneId: string) => {
  try {
    const res = await db.lane.delete({
      where: {
        id: laneId,
      },
    });
    if (!res) throw new Error("Failed to delete lane");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getTicketWithTags = async (pipelineId: string) => {
  try {
    const res = await db.ticket.findMany({
      where: { Lane: { pipelineId } },
      include: { Tags: true, Assigned: true, Customer: true },
    });
    if (!res) throw new Error("Failed to get tickets");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getTicketWithAllRelations = async (laneId: string) => {
  const res = await db.ticket.findMany({
    where: { laneId },
    include: {
      Assigned: true,
      Customer: true,
      Lane: true,
      Tags: true,
    },
  });
  return res;
};

export const getSubAccMembers = async (subAccId: string) => {
  const res = await db.user.findMany({
    where: {
      Agency: { SubAccount: { some: { id: subAccId } } },
      role: "SUBACCOUNT_USER",
      Permissions: {
        some: {
          subAccountId: subAccId,
          access: true,
        },
      },
    },
  });
  return res;
};

export const searchContacts = async (query: string) => {
  const res = await db.contact.findMany({
    where: {
      name: {
        contains: query,
      },
    },
  });
  return res;
};

export const upsertTicket = async (
  ticket: Prisma.TicketUncheckedCreateInput,
  tags: Tag[]
) => {
  let order: number;
  if (!ticket.order) {
    const tickets = await db.ticket.findMany({
      where: { laneId: ticket.laneId },
    });
    order = tickets.length;
  } else {
    order = ticket.order;
  }
  try {
    const res = await db.ticket.upsert({
      where: { id: ticket.id || v4() },
      update: { ...ticket, Tags: { set: tags } },
      create: { ...ticket, Tags: { connect: tags }, order },
      include: {
        Assigned: true,
        Customer: true,
        Tags: true,
        Lane: true,
      },
    });
    if (!res) throw new Error("Failed to upsert ticket");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteTicket = async (ticketId: string) => {
  if (!ticketId) throw new Error("Ticket id is required");
  const res = await db.ticket.delete({
    where: { id: ticketId },
  });
  if (!res) throw new Error(" Failed to delete ticket");
  return res;
};

export const upsertTag = async (subAccId: string, data: Tag) => {
  if (!subAccId) throw new Error("Sub Account id is required");
  try {
    const res = await db.tag.upsert({
      where: { id: data.id || v4(), subAccountId: subAccId },
      update: data,
      create: { ...data, subAccountId: subAccId },
    });
    if (!res) throw new Error("Failed to upsert tag");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteTag = async (tagId: string) => {
  if (!tagId) throw new Error("Tag id is required");
  const res = await db.tag.delete({
    where: { id: tagId },
  });
  if (!res) throw new Error("Failed to delete tag");
  return res;
};

export const getTagsForSubaccount = async (subAccId: string) => {
  const res = await db.subAccount.findUnique({
    where: { id: subAccId },
    include: { Tags: true },
  });
  return res;
};

export const upsertContact = async (
  subAccId: string,
  data: Prisma.ContactCreateWithoutSubaccountInput
) => {
  if (!subAccId) throw new Error("Sub Account id is required");
  try {
    const res = await db.contact.upsert({
      where: { id: data.id || v4(), subAccountId: subAccId },
      update: data,
      create: { ...data, subAccountId: subAccId },
    });
    if (!res) throw new Error("Failed to upsert contact");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getFunnels = async (subAccId: string) => {
  try {
    if (!subAccId) throw new Error("Sub Account id is required");
    const res = await db.funnel.findMany({
      where: { subAccountId: subAccId },
      include: { FunnelPages: true },
    });
    if (!res) throw new Error("Failed to get funnels");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getFunnelDetails = async (funnelId: string) => {
  if (!funnelId) throw new Error("Funnel id is required");

  const res = await db.funnel.findUnique({
    where: { id: funnelId },
    include: {
      FunnelPages: {
        orderBy: { order: "asc" },
      },
    },
  });
  if (!res) throw new Error("Failed to get funnel details");
  return res;
};

export const updateFunnelProducts = async (
  products: string,
  funnelId: string
) => {
  const res = await db.funnel.update({
    where: { id: funnelId },
    data: { liveProducts: products },
  });
  return res;
};

export const upsertFunnelPage = async (
  subAccId: string,
  funnelPage: UpsertFunnelPage,
  funnelId: string
) => {
  if (!subAccId || !funnelId) throw new Error("Sub Account id is required");
  try {
    const res = await db.funnelPage.upsert({
      where: { id: funnelPage.id || v4() },
      update: funnelPage,
      create: {
        ...funnelPage,
        content: funnelPage.content
          ? funnelPage.content
          : JSON.stringify([
              {
                content: [],
                id: "__body",
                name: "Body",
                type: "__body",
                styles: { backgroundColor: "black" },
              },
            ]),
        funnelId,
      },
    });
    revalidatePath(`/subaccount/${subAccId}/funnels/${funnelId}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFunnelePage = async (funnelPageId: string) => {
  console.log(funnelPageId);
  const res = await db.funnelPage.delete({
    where: { id: funnelPageId },
  });
  return res;
};

export const getFunnelPageDetails = async (funnelPageId: string) => {
  try {
    if (!funnelPageId) throw new Error("Funnel Page id is required");
    const res = await db.funnelPage.findUnique({
      where: { id: funnelPageId },
    });
    if (!res) {
      throw new Error("Failed to get Funnel Page details");
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getSubAccountDetails = (subAccId: string) => {
  if (!subAccId) throw new Error("Sub Account id is required");
  const res = db.subAccount.findUnique({
    where: { id: subAccId },
  });
  if (!res) {
    throw new Error("Failed to get Sub Account details");
  }
  return res;
};

export const getDomainContent = async (subDomainName: string) => {
  const res = await db.funnel.findUnique({
    where: { subDomainName },
    include: { FunnelPages: true },
  });
  return res;
};

export const getPipelines = async (subAccId: string) => {
  try {
    if (!subAccId) throw new Error("Sub Account id is required");
    const res = await db.pipeline.findMany({
      where: { subAccountId: subAccId },
      include: {
        Lane: {
          include: { Tickets: true },
        },
      },
    });
    if (!res) throw new Error("Failed to get pipelines");
    return res;
  } catch (error) {
    console.log(error);
  }
};
