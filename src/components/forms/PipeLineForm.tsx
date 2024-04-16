"use client";
import React, { useEffect } from "react";
import { z } from "zod";
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
import { Button } from "../ui/button";
import Loading from "../golbal/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveActivity, upsertPipeLine } from "@/lib/queries";
import { Pipeline } from "@prisma/client";
import ToastNotify from "../golbal/ToastNotify";
import { useRouter } from "next/navigation";
import GradientText from "../golbal/GradientText";
type Props = {
  subAccId: string;
  setClose: () => void;
  defaultData?: Pipeline;
};

const pipelineSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});
const PipeLineForm = ({ subAccId, defaultData, setClose }: Props) => {
  const form = useForm({
    resolver: zodResolver(pipelineSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultData?.name || "",
    },
  });
  useEffect(() => {
    if (defaultData)
      form.reset({
        name: defaultData.name || "",
      });
  }, [defaultData]);
  const router = useRouter();
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof pipelineSchema>) => {
    const res = await upsertPipeLine({
      ...values,
      id: defaultData?.id,
      subAccountId: subAccId,
    });
    if (res) {
      await saveActivity({
        agencyId: undefined,
        desc: `${res?.name} | updated pipeline | ${values.name}`,
        subAccId: subAccId,
      });
      ToastNotify({
        title: "Success",
        msg: "Pipeline updated successfully",
      });
    } else {
      ToastNotify({
        title: "Oppse",
        msg: "Failed to save pipeline details",
      });
    }
    setClose();
    router.refresh();
  };
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>
          <GradientText
            text="Pipeline Details"
            from="red"
            to="blue"
            size="2rem"
          />
        </CardTitle>
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
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
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

export default PipeLineForm;
