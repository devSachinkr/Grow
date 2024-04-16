import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";
import Link from "next/link";
import { getUserDetails } from "@/lib/queries";
import { SubAccount } from "@prisma/client";
import { AlertDescription } from "@/components/ui/alert";
import GradientText from "@/components/golbal/GradientText";
import DeleteButton from "./$components/DeleteButton";
import SubaccountButton from "./$components/SubaccountButton";
type Props = {
  params: { agencyId: string };
};

const page = async ({params:{agencyId}}: Props) => {
  const user = await getUserDetails();
  if (!user) return;

  return (
    <AlertDialog>
      <div className="flex flex-col ">
        <SubaccountButton
          user={user}
          id={agencyId}
        />
        <Command className="rounded-lg bg-transparent">
          <CommandInput placeholder="Search Account..." />
          <CommandList>
            <CommandEmpty className="p-6">
              <GradientText from="red" to="blue" size="2.5rem">
                No Results Found.
              </GradientText>
            </CommandEmpty>
            <CommandGroup heading="Sub Accounts">
              {!!user.Agency?.SubAccount.length ? (
                user.Agency.SubAccount.map((sub) => (
                  <CommandItem
                    key={sub.id}
                    className="h-32 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                  >
                    <Link
                      href={`/subaccount/${sub.id}`}
                      className="flex gap-4 w-full h-full"
                    >
                      <div className="relative w-32">
                        <Image
                          src={sub.subAccountLogo}
                          alt="subaccount logo"
                          fill
                          className="rounded-md object-contain bg-muted/50 p-4"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                          {sub.name}
                          <span className="text-muted-foreground text-xs">
                            {sub.address}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <AlertDialogTrigger asChild>
                      <Button
                        size={"sm"}
                        variant={"destructive"}
                        className="w-20 hover:bg-red-600 hover:text-white !text-white"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-left">
                          Are your absolutely sure
                        </AlertDialogTitle>
                        <AlertDescription className="text-left">
                          This action cannot be undon. This will delete the
                          subaccount and all data related to the subaccount.
                        </AlertDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex items-center">
                        <AlertDialogCancel className="mb-2">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive">
                          <DeleteButton subaccountId={sub.id} />
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </CommandItem>
                ))
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  No Sub accounts
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};

export default page;
