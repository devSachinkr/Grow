"use client";
import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import Loading from "../golbal/Loading";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lane } from "@prisma/client";
import { getPipelineDetails, saveActivity, upsertLane } from "@/lib/queries";
import ToastNotify from "../golbal/ToastNotify";
import { useRouter } from "next/navigation";

type Props = {
  pipelineId: string;
  defaultData?: Lane;
  setClose: () => void;
};
const laneSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});
const LaneForm = ({ pipelineId, defaultData, setClose }: Props) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(laneSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultData?.name || "",
    },
  });
  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData?.name || "",
      });
    }
  }, [defaultData]);
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: any) => {
    const res = await upsertLane({
      ...values,
      id: defaultData?.id,
      pipelineId,
      order: defaultData?.order,
    });

    const pipelineDetails = await getPipelineDetails(pipelineId);
    if (!pipelineDetails) return;

    if (res) {
      await saveActivity({
        agencyId: undefined,
        desc: `Updated a lane | ${res.name}`,
        subAccId: pipelineDetails.subAccountId,
      });
      ToastNotify({
        title: "Success",
        msg: "Saved pipeline details",
      });
    } else {
      ToastNotify({
        title: "Oppse",
        msg: "Could not save pipeline details",
      });
    }

    router.refresh();
    setClose();
  };
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Lane Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lane Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lane Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-20 mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LaneForm;
