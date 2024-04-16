"use client";
import { useModal } from "@/app/providers/modal-provider";
import SubAccountDetails from "@/components/forms/SubAccountForm";
import CustomModal from "@/components/golbal/CustomModal";
import { Button } from "@/components/ui/button";
import { getAgencyDetails } from "@/lib/queries";
import { Agency, AgencySidebarOption, SubAccount, User } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import React from "react";

type Props = {
  user: User & {
    Agency:
      | Agency
      | (null & {
          SubAccount: SubAccount[];
          SidebarOption: AgencySidebarOption[];
        })
      | null;
  };
  id: string;
};

const SubaccountButton = ({ id, user }: Props) => {

  const { setOpen } = useModal();
  const clickHandler = () => {
    setOpen(
      <CustomModal title="Sub account details" desc="Enter sub account details">
        <SubAccountDetails
          agencyDetails={user.Agency as Agency}
          userId={user.id}
          userName={user.name}
        />
      </CustomModal>
    ); 
  };
  return (
      <Button
        onClick={clickHandler}
        variant={"ghost"}
        className=" bg-primary/60 w-[200px] flex items-center justify-center gap-x-2 self-end mb-4"
      >
        <PlusCircle size={16} />
        Create Subaccount
      </Button>
  );
};

export default SubaccountButton;
