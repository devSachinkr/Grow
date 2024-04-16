'use client'
import ToastNotify from "@/components/golbal/ToastNotify";
import { deleteSubAccount, saveActivity } from "@/lib/queries";
import { useRouter } from "next/navigation";
import React from "react";

type Props = { subaccountId: string };

const DeleteButton = ({ subaccountId }: Props) => {
  const router=useRouter();
  const clickHandler = async () => {
    const res = await deleteSubAccount(subaccountId);
 
    if (res) {
      ToastNotify({
        title: "Success",
        msg: "Subaccount deleted successfully",
      });
      router.refresh();
    } else {
      ToastNotify({
        title: "Oppse",
        msg: "Failed to delete subaccount",
      });
    }
  };
  return <div onClick={clickHandler}>Delete</div>;
};

export default DeleteButton;
