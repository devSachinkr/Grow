import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Plus, SettingsIcon, SquareStackIcon } from "lucide-react";
import ToolTip from "@/components/golbal/ToolTip";

const TabsLists = () => {
  return (
    <TabsList className=" flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4 ">
      <ToolTip text="Settings">
        <TabsTrigger
          value="Settings"
          className="w-10 h-10 p-0 data-[state=active]:bg-muted"
        >
          <SettingsIcon />
        </TabsTrigger>
      </ToolTip>

      <ToolTip text="Components">
        <TabsTrigger
          value="Components"
          className="data-[state=active]:bg-muted w-10 h-10 p-0"
        >
          <Plus />
        </TabsTrigger>
      </ToolTip>

      <ToolTip text="Layers">
        <TabsTrigger
          value="Layers"
          className="w-10 h-10 p-0 data-[state=active]:bg-muted"
        >
          <SquareStackIcon />
        </TabsTrigger>
      </ToolTip>
      <ToolTip text="Media">
        <TabsTrigger
          value="Media"
          className="w-10 h-10 p-0 data-[state=active]:bg-muted"
        >
          <Database />
        </TabsTrigger>
      </ToolTip>
    </TabsList>
  );
};

export default TabsLists;
