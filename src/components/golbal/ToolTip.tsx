import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import GradientText from "./GradientText";

type Props = {
  children?: React.ReactNode;
  text: string;
  triggerClasses?: string;
  value?: string;
};

const ToolTip = ({ children, text, triggerClasses ,value}: Props) => {
  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild className={triggerClasses} value={value}>
            {children}
          </TooltipTrigger>
          <TooltipContent>
            <GradientText size="20px" from="red" to="blue">
              {text}
            </GradientText>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ToolTip;
