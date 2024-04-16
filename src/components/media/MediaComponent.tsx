import React from "react";

type Props = {
  data: MediaFile|null;
  subAccId: string;
};
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { FolderSearch } from "lucide-react";
import { MediaFile } from "@/lib/types";
import UploadMediaButton from "./UploadMediaButton";
import GradientText from "../golbal/GradientText";
import MediaCard from "./MediaCard";

const MediaComponent = ({ data, subAccId }: Props) => {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">
          <GradientText from="red" to="blue" size="2.5rem">
            Guardian Store
          </GradientText>
        </h1>
        <UploadMediaButton subAccId={subAccId} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for file name..." />
        <CommandList className="pb-40 max-h-full ">
          <CommandEmpty><GradientText text="No Media Files" from="red" to="blue" size="20px"/></CommandEmpty>
          <CommandGroup heading="Media Files">
            <div className="flex flex-wrap gap-4 pt-4">
              {data?.Media.map((file) => (
                <CommandItem 
                  key={file.id}
                  className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <MediaCard file={file} />
                </CommandItem>
              ))}
              {!data?.Media.length && (
                <div className="flex items-center justify-center w-full flex-col">
                  <FolderSearch
                    size={200}
                    className="dark:text-muted text-slate-300"
                  />
                  <p >
                  <GradientText text="Empty! No Files" from="red" to="blue" size="20px"/>
                  </p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaComponent;
