"use client";

import { useModal } from "@/app/providers/modal-provider";
import ContactForm from "@/components/forms/ContactForm";
import ContactUserForm from "@/components/forms/ContactUserForm";
import CustomModal from "@/components/golbal/CustomModal";
import { Button } from "@/components/ui/button";

type Props = {
  subAccId: string;
};

const ContactButton = ({ subAccId }: Props) => {
  const { setOpen } = useModal();
  const handleClick = () => {
    setOpen(
      <CustomModal title="Create Contact">
        <ContactUserForm subAccId={subAccId} />
      </CustomModal>
    );
  };
  return (
    <div className="flex justify-end mb-5">
      <Button className="bg-primary/55" onClick={handleClick}>
        Create
      </Button>
    </div>
  );
};
export default ContactButton;
