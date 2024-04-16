import {
  Contact,
  Funnel,
  Lane,
  Notification,
  Prisma,
  Role,
  SubAccount,
  Tag,
  Ticket,
  User,
} from "@prisma/client";
import {
  getMedia,
  getPipelineDetails,
  getTicketWithAllRelations,
  getTicketWithTags,
  getUserDetails,
  getUserPermission,
} from "./queries";
import { db } from "./db";
import { z } from "zod";
import Stripe from "stripe";

export interface SaveActivityProps {
  desc: string;
  agencyId?: string | undefined;
  subAccId?: string | undefined;
}

export type NotificationWithUser =
  | ({
      User: {
        id: string;
        name: string;
        avatar: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        role: Role;
        agencyId: string;
      };
    } & Notification)[]
  | undefined;

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserPermission
>;

export type AuthUserWithAgencySidebarOptionsSubAccounts =
  Prisma.PromiseReturnType<typeof getUserDetails>;
const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
  agencyId: string
) => {
  return await db.user.findFirst({
    where: { Agency: { id: agencyId } },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });
};
export type UsersWithAgencySubAccountPermissionsSidebarOptions =
  Prisma.PromiseReturnType<
    typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
  >;

export type MediaFile = Prisma.PromiseReturnType<typeof getMedia>;

export type MediaType = Prisma.MediaCreateWithoutSubaccountInput;

export type TicketAndTag = Ticket & {
  Tags: Tag[];
  Assigned: User | null;
  Customer: Contact | null;
};

export type LaneDetail = Lane & {
  Tickets: TicketAndTag[];
};

export const FunnelFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
});

export type PipelineWithLanesCardTagTicket = Prisma.PromiseReturnType<
  typeof getPipelineDetails
>;

export type TicketWithTags = Prisma.PromiseReturnType<typeof getTicketWithTags>;

export type TicketDetails = Prisma.PromiseReturnType<
  typeof getTicketWithAllRelations
>;

const currencyRegex = /^(\d{1,3}(,\d{3})*|(\d+))(\.\d{2})?$/;
export const TicketFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  value: z.string().refine((value) => currencyRegex.test(value), {
    message: "Invalid value",
  }),
});

export type Address = {
  city: string;
  country: string;
  line1: string;
  postal_code: string;
  state: string;
};
export type Shipping = {
  address: Address;
  name: string;
};
export type StripeCustomerType = {
  email: string;
  name: string;
  shipping: Shipping;
  address: Address;
};

export type PriceList = Stripe.ApiList<Stripe.Price>;

export type FunnelsForSubAccount=Funnel&{
  SubAccount:SubAccount
}

export type UpsertFunnelPage=Prisma.FunnelPageCreateWithoutFunnelInput