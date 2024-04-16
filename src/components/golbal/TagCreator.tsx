"use client";
import { Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { PlusCircleIcon, TrashIcon, X } from "lucide-react";
import { toast } from "../ui/use-toast";
import { v4 } from "uuid";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import TagComponent from "./TagComponent";
import {
  deleteTag,
  getTagsForSubaccount,
  saveActivity,
  upsertTag,
} from "@/lib/queries";
import ToastNotify from "./ToastNotify";
type Props = {
  subAccId: string;
  getSelectedTags: Dispatch<SetStateAction<Tag[]>>;
  defaultTags: Tag[];
};
const tagColor = ["BLUE", "ORANGE", "ROSE", "GREEN", "PURPLE"];
export type tagColor = (typeof tagColor)[number];
const TagCreator = ({ defaultTags, getSelectedTags, subAccId }: Props) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(defaultTags || []);
  const [tags, setTags] = useState<Tag[]>([]);
  const router = useRouter();
  const [value, setValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  useEffect(() => {
    getSelectedTags(selectedTags);
  }, [selectedTags]);
  useEffect(() => {
    if (subAccId) {
      const fetchData = async () => {
        const res = await getTagsForSubaccount(subAccId);
        if (res) setTags(res.Tags || []);
      };
      fetchData();
    }
  }, [subAccId]);

  const handleDeleteSelection = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleAddTag = async () => {
    if (!value) {
      ToastNotify({
        title: "Oppse",
        msg: "Tags need to have a name",
      });
      return;
    }
    if (!selectedColor) {
      ToastNotify({
        title: "Oppse",
        msg: "Please Select a color",
      });
      return;
    }
    const tagData: Tag = {
      color: selectedColor,
      createdAt: new Date(),
      id: v4(),
      name: value,
      subAccountId: subAccId,
      updatedAt: new Date(),
    };

    setTags([...tags, tagData]);
    setValue("");
    setSelectedColor("");
    try {
      const res = await upsertTag(subAccId, tagData);
      if (res) {
        await saveActivity({
          agencyId: undefined,
          desc: `Updated a tag | ${res?.name}`,
          subAccId: subAccId,
        });
        ToastNotify({
          title: "Success",
          msg: "Tag created successfully",
        });
      }
    } catch (error) {
      ToastNotify({
        title: "Oppse",
        msg: "Could not create tag",
      });
    }
  };
  const handleAddSelections = (tag: Tag) => {
    if (selectedTags.every((t) => t.id !== tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  const handleDeleteTag = async (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
    try {
      const res = await deleteTag(tagId);
      if (res) {
        await saveActivity({
          agencyId: undefined,
          desc: ` | Deleted a tag | ${res?.name}`,
          subAccId: subAccId,
        });

        ToastNotify({
          title: "Success",
          msg: "Tag  Deleted.",
        });
      }

      router.refresh();
    } catch (error) {
      ToastNotify({
        title: "Oppse",
        msg: "Could not delete tag",
      });
    }
  };
  return (
    <AlertDialog>
      <Command className="bg-transparent">
        {!!selectedTags.length && (
          <div className="flex flex-wrap gap-2 p-2 bg-background border-2 border-border rounded-md">
            {selectedTags.map((tag) => (
              <div key={tag.id} className="flex items-center">
                <TagComponent title={tag.name} colorName={tag.color} />
                <X
                  size={14}
                  className="text-muted-foreground cursor-pointer"
                  onClick={() => handleDeleteSelection(tag.id)}
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 my-2">
          {tagColor.map((colorName) => (
            <TagComponent
              key={colorName}
              selectedColor={setSelectedColor}
              title=""
              colorName={colorName}
            />
          ))}
        </div>
        <div className="relative mb-5">
          <CommandInput
            placeholder="Search for tag..."
            value={value}
            onValueChange={setValue}
          />
          <PlusCircleIcon
            onClick={handleAddTag}
            size={20}
            className="absolute top-1/2 transform -translate-y-1/2 right-2 hover:text-primary transition-all cursor-pointer text-muted-foreground"
          />
        </div>
        <CommandList>
          <CommandSeparator />
          <CommandGroup heading="Tags">
            {tags.map((tag) => (
              <CommandItem
                key={tag.id}
                className="hover:!bg-secondary !bg-transparent flex items-center justify-between !font-light cursor-pointer"
              >
                <div onClick={() => handleAddSelections(tag)}>
                  <TagComponent title={tag.name} colorName={tag.color} />
                </div>

                <AlertDialogTrigger>
                  <TrashIcon
                    size={16}
                    className="cursor-pointer text-muted-foreground hover:text-rose-400  transition-all"
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                      This action cannot be undone. This will permanently delete
                      your the tag and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      Delete Tag
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </Command>
    </AlertDialog>
  );
};

export default TagCreator;
