"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import FileUpload from "../golbal/FileUpload";
import { Button } from "../ui/button";
import GradientText from "../golbal/GradientText";
import { createMedia, saveActivity } from "../../lib/queries";
import ToastNotify from "../golbal/ToastNotify";
import { useRouter } from "next/navigation";
import Loading from "../golbal/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
interface Props {
  subAccId: string;
  setClose: () => void;
}

const MediaFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  link: z.string().min(1, { message: "File is required" }),
});

const MediaForm = ({ subAccId, setClose }: Props) => {
  const form = useForm<z.infer<typeof MediaFormSchema>>({
    resolver: zodResolver(MediaFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      link: "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof MediaFormSchema>) => {
    const res = await createMedia(subAccId, values);

    if (res) {
      await saveActivity({
        desc: `Uploaded a media file ${res.name}`,
        agencyId: undefined,
        subAccId,
      });
      ToastNotify({
        title: "Success",
        msg: "File uploaded successfully",
      });
      setClose();
      router.refresh();
    } else {
      ToastNotify({
        title: "Success",
        msg: "File uploaded successfully",
      });
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <GradientText
            text="File Information"
            from="red"
            to="blue"
            size="2rem"
          />
        </CardTitle>
        <CardDescription>
          Please enter the details for your file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-muted-foreground">
                    File Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your agency name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Media File
                  </FormLabel>
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
            <Button disabled={isLoading} type="submit" className="mt-4">
              {isLoading ? <Loading /> : "Upload Media"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MediaForm;
