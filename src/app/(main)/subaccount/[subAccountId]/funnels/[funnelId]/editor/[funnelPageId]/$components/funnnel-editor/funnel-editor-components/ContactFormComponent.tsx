"use client";
import {
  EditorElement,
  useEditor,
} from "@/app/providers/web-editor/editorProvider";
import ContactForm, { ContactFormSchema } from "@/components/forms/ContactForm";
import ToastNotify from "@/components/golbal/ToastNotify";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { EditorBtns } from "@/lib/constants";
import { getFunnelDetails, saveActivity, upsertContact } from "@/lib/queries";

import clsx from "clsx";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";
import { z } from "zod";

type Props = {
  element: EditorElement;
};

const ContactFormComponent = (props: Props) => {
  const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor();
  const router = useRouter();

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };

  const styles = props.element.styles;

  const goToNextPage = async () => {
    if (!state.editor.liveMode) return;
    const funnelPages = await getFunnelDetails(funnelId);
    if (!funnelPages || !pageDetails) return;
    if (funnelPages.FunnelPages.length > pageDetails.order + 1) {
      const nextPage = funnelPages.FunnelPages.find(
        (page) => page.order === pageDetails.order + 1
      );
      if (!nextPage) return;
      router.replace(
        `${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`
      );
    }
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };

  const onFormSubmit = async (values: z.infer<typeof ContactFormSchema>) => {
    if (!state.editor.liveMode || state.editor.previewMode) {
      ToastNotify({
        title: "Oppse",
        msg: "Request Send only in Live mode ",
      });
      return;
    }

    try {
      const response = await upsertContact(subaccountId, values);
      //WIP Call trigger endpoint
      await saveActivity({
        agencyId: undefined,
        desc: `A New contact signed up | ${response?.name}`,
        subAccId: subaccountId,
      });
      ToastNotify({
        title: "Success",
        msg: "Successfully Saved your info",
      });
      await goToNextPage();
    } catch (error) {
      ToastNotify({
        title: "Oppse",
        msg: "Could not save your information",
      });
    }
  };

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, "contactForm")}
      onClick={handleOnClickBody}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center",
        {
          "!border-blue-500":
            state.editor.selectedElement.id === props.element.id,

          "!border-solid": state.editor.selectedElement.id === props.element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      <ContactForm
        desc="Contact Us"
        title="Want a free quote? We can help you"
        onSubmit={onFormSubmit}
      />
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default ContactFormComponent;
