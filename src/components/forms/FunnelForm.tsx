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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "../ui/textarea";
import FileUpload from "../golbal/FileUpload";
import { Button } from "../ui/button";
import Loading from "../golbal/Loading";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GradientText from "../golbal/GradientText";
import { saveActivity, upsertFunnel } from "@/lib/queries";
import { FunnelFormSchema } from "@/lib/types";
import { Funnel } from "@prisma/client";
import { v4 } from "uuid";
import ToastNotify from "../golbal/ToastNotify";
import { useModal } from "@/app/providers/modal-provider";
import { useRouter } from "next/navigation";
type Props = {
  subAccId: string;
  defaultData?: Funnel;
}; 

const FunnelForm = ({ subAccId, defaultData }: Props) => {
    console.log(subAccId)
  const { setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof FunnelFormSchema>>({
    resolver: zodResolver(FunnelFormSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultData?.name || "",
      description: defaultData?.description || "",
      favicon: defaultData?.favicon || "",
      subDomainName: defaultData?.subDomainName || "",
    },
  });
  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof FunnelFormSchema>) => {
    const res = await upsertFunnel(
      subAccId,
      { ...values, liveProducts: defaultData?.liveProducts || "[]" },
      defaultData?.id || v4()
    );
    if (res) {
      saveActivity({
        agencyId: undefined,
        desc: ` | updated funnel | ${res.name}`,
        subAccId: subAccId,
      });
      ToastNotify({
        title: "Success",
        msg: "Funnel updated successfully",
      });
      router.refresh();
    } else {
      ToastNotify({
        title: "Oppse",
        msg: "Failed to save funnel details",
      });
    }
    setClose();
  };
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>
          <GradientText from="red" to="blue" size="3rem">
            Funnel Details
          </GradientText>
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
                  <FormLabel>Funnel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funnel Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit more about this funnel."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="subDomainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub domain</FormLabel>
                  <FormControl>
                    <Input placeholder="Sub domain for funnel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="favicon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndPoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
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

export default FunnelForm;
