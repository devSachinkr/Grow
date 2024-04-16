import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditorBtns } from "@/lib/constants";
import React from "react";
import TextPlaceHolder from "./TextPlaceHolder";
import ContainerPlaceHolder from "./ContainerPlaceHolder";
import VideoPlceHolder from "./VideoPlceHolder";
import LinkPlaceHolder from "./LinkPlaceHolder";
import TwoColumnPlaceholder from "./TwoColumnPlaceholder";
import ContactFormPlaceholder from "./ContactFormPlaceholder";
import CheckoutPlaceHolder from "./CheckoutPlaceHolder";

type Props = {};

const ComponentsTab = (props: Props) => {
  const elements: {
    Component: React.ReactNode;
    label: string;
    id: EditorBtns;
    group: "layout" | "element";
  }[] = [
    {
      Component: <TextPlaceHolder />,
      group: "element",
      id: "text",
      label: "Text",
    },
    {
      Component: <ContainerPlaceHolder />,
      group: "layout",
      id: "container",
      label: "Container",
    },
    {
      Component: <VideoPlceHolder />,
      group: "element",
      id: "video",
      label: "Video",
    },
    {
      Component: <LinkPlaceHolder />,
      group: "element",
      id: "link",
      label: "Link",
    },
    {
      Component: <TwoColumnPlaceholder />,
      group: "layout",
      id: "2Col",
      label: "Two Columns",
    },
    {
      Component: <ContactFormPlaceholder />,
      group: "element",
      id: "contactForm",
      label: "Contact Form ",
    },
    {
      Component: <CheckoutPlaceHolder />,
      group: "element",
      id: "paymentForm",
      label: "Checkout Form ",
    },
  ];
  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["Layout", "Elements"]}
    >
      <AccordionItem value="Layout" className="px-6 py-0 border-y-[1px]">
        <AccordionTrigger className="!no-underline">Layout</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2">
          {elements
            .filter((e) => e.group === "layout")
            .map((e) => (
              <div
                className="flex-col items-center justify-center flex"
                key={e.id}
              >
                {e.Component}
                <span className="text-muted-foreground">{e.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Elements" className="px-6 py-0 border-y-[1px]">
        <AccordionTrigger className="!no-underline">Elements</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2">
          {elements
            .filter((e) => e.group === "element")
            .map((e) => (
              <div
                className="flex-col items-center justify-center flex"
                key={e.id}
              >
                {e.Component}
                <span className="text-muted-foreground">{e.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ComponentsTab;
