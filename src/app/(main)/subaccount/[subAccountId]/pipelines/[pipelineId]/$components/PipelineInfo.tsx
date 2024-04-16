"use client";
import { Pipeline } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import { useModal } from "@/app/providers/modal-provider";
import CustomModal from "@/components/golbal/CustomModal";
import PipeLineForm from "@/components/forms/PipeLineForm";
import GradientText from "@/components/golbal/GradientText";
type Props = {
  pipelineId: string;
  subAccId: string;
  pipelines: Pipeline[];
};

const PipelineInfo = ({ pipelineId, pipelines, subAccId }: Props) => {
  const { setOpen: OpenModal, setClose } = useModal();
  const [value, setValue] = useState(pipelineId);
  const [open, setOpen] = useState(false);

  const handleClickCreatePipeline = () => {
    OpenModal(
      <CustomModal
        title="Create new pipeline"
        desc="Pipeline allows you to groups tickets into lanes  and track your business."
      >
        <PipeLineForm subAccId={subAccId} setClose={setClose} />
      </CustomModal>
    );
  };
  return (
    <div>
      <div className="flex items-end gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between flex items-center"
            >
              {value
                ? pipelines.find((pipeline) => pipeline.id === value)?.name
                : "Select a pipeline..."}

              <GradientText
                from="red"
                to="blue"
                classes="ml-2 h-4 flex items-center "
                size="1.2rem"
                text="<>"
                />
             
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No pipelines found.</CommandEmpty>
                <CommandGroup heading="Pipelines">
                  {pipelines?.map((pipeline) => (
                    <Link
                      key={pipeline.id}
                      href={`/subaccount/${subAccId}/pipelines/${pipeline.id}`}
                    >
                      <CommandItem
                        key={pipeline.id}
                        value={pipeline.id}
                        onSelect={(currentValue) => {
                          setValue(currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === pipeline.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {pipeline.name}
                      </CommandItem>
                    </Link>
                  ))}
                  <Button
                    variant="secondary"
                    className="flex gap-2 w-full mt-4"
                    onClick={handleClickCreatePipeline}
                  >
                    <Plus size={15} />
                    Create Pipeline
                  </Button>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PipelineInfo;
