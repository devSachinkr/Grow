"use client";
import { Pipeline } from "@prisma/client";
import React from "react";
import { Pipe } from "stream";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import ToastNotify from "@/components/golbal/ToastNotify";
import { useRouter } from "next/navigation";
import PipeLineForm from "@/components/forms/PipeLineForm";
import { useModal } from "@/app/providers/modal-provider";
import { deletePipeline, saveActivity } from "@/lib/queries";
type Props = {
  pipelineId: string;
  pipelines: Pipeline[];
  subAccId: string;
};

const PipelineSettings = ({ pipelineId, pipelines, subAccId }: Props) => {
  const { setClose } = useModal();
  const router = useRouter();
  return (
    <AlertDialog>
      <div>
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"}>Delete Pipeline</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    const res = await deletePipeline(pipelineId);
                    if (res) {
                      await saveActivity({
                        subAccId,
                        agencyId: undefined,
                        desc: `| Deleted pipeline ${res.name}`,
                      });
                    }
                    ToastNotify({
                      title: "Success",
                      msg: "Pipeline deleted successfully",
                    });
                    router.replace(`/subaccount/${subAccId}/pipelines`);
                  } catch (error) {
                    ToastNotify({
                      title: "Oppse",
                      msg: "Could Delete Pipeline",
                    });
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>

        <PipeLineForm
          subAccId={subAccId}
          defaultData={pipelines.find((p) => p.id === pipelineId)}
          setClose={setClose}
        />
      </div>
    </AlertDialog>
  );
};

export default PipelineSettings;
