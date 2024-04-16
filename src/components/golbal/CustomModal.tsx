import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useModal } from "@/app/providers/modal-provider";
import GradientText from "./GradientText";

interface Props {
  title: string;
  desc?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}
const CustomModal = ({ desc, title, children, defaultOpen }: Props) => {
    const {isOpen, setClose} = useModal();
  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className="overflow-auto md:max-h-[700px] md:h-fit h-screen bg-card">
        <DialogHeader className="pt-8 text-left">
          <DialogTitle className="text-2xl font-bold">
            <GradientText text={title} from="red" to="blue" size="2.5rem" />
          </DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
