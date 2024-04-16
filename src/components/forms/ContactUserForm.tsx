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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/app/providers/modal-provider";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Loading from "../golbal/Loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveActivity, upsertContact } from "@/lib/queries";
import ToastNotify from "../golbal/ToastNotify";
type Props = {
  subAccId: string;
};

const ContactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email is required" }),
});
const ContactUserForm = ({ subAccId }: Props) => {
  const { setClose, data } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
    },
  });
  useEffect(() => {
    if (data.contact) {
      form.reset(data.contact);
    }
  }, [data, form.reset]);
  const handleSubmit = async (values: z.infer<typeof ContactFormSchema>) => {
    const res = await upsertContact(subAccId,values);
    if (res) {
      saveActivity({
        agencyId: undefined,
        desc: `| Created a contact ${res.name}`,
        subAccId: subAccId,
      });
      ToastNotify({
        title: "Success",
        msg: "Contact created successfully",
      });
      router.refresh();
    }else{
      ToastNotify({
        title: "Oppse",
        msg: "Failed to create contact",
      });
    }
    setClose();
  };
  return (
    <Card className=" w-full">
      <CardHeader>
        <CardTitle>Contact Info</CardTitle>
        <CardDescription>
          You can assign tickets to contacts and set a value for each contact in
          the ticket.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={form.formState.isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="mt-4 bg-primary/55"
              disabled={form.formState.isLoading}
              type="submit"
            >
              {form.formState.isSubmitting ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactUserForm;
