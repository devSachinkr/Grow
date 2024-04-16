"use client";
import { Agency } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ToastNotify from "../golbal/ToastNotify";
import { useRouter } from "next/navigation";
import { NumberInput } from "@tremor/react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import FileUpload from "../golbal/FileUpload";
import { Switch } from "../ui/switch";
import {
  deleteAgency,
  initUser,
  saveActivity,
  updateAgencyDetails,
  upsertAgency,
} from "@/lib/queries";
import { Button } from "../ui/button";
import GradientText from "../golbal/GradientText";
import Loading from "../golbal/Loading";
import { v4 } from "uuid";
type Props = {
  data: Partial<Agency>;
};

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  agencyEmail: z.string().email({ message: "Email is required" }),
  agencyPhone: z
    .string()
    .min(10, { message: "Phone Number must be 10 digits" })
    .max(10, { message: "Phone Number must be 10 digits" }),
  whiteLabel: z.boolean().optional(),
  agencyLogo: z.string().min(1, { message: "Logo is required" }),
  address: z
    .string()
    .min(3, { message: "Address must should be at least 3 characters" }),
  city: z
    .string()
    .min(3, { message: "City must should be at least 3 characters" }),
  state: z
    .string()
    .min(3, { message: "State must should be at least 3 characters" }),
  country: z
    .string()
    .min(3, { message: "Country must should be at least 3 characters" }),
  pincode: z
    .string()
    .min(3, { message: "Postal Code must should be at least 3 characters" }),
});
const AgencyForm = ({ data }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name,
      agencyEmail: data?.agencyEmail,
      agencyPhone: data?.agencyPhone,
      whiteLabel: data?.whiteLabel,
      address: data?.address,
      city: data?.city,
      state: data?.state,
      country: data?.country,
      pincode: data?.pincode,
    },
  });
  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
      });
    }
  }, [data]);
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState<boolean>(false);
  const isLoading = form.formState.isSubmitting;
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    let newUserData;
    let custId;
    try {
      if (!data?.id) {
        const bodyData = {
          email: values.agencyEmail,
          name: values.name,
          shipping: {
            address: {
              line1: values.address,
              city: values.city,
              state: values.state,
              postal_code: values.pincode,
              country: values.country,
            },
            name: values.name,
          },
          address: {
            line1: values.address,
            city: values.city,
            state: values.state,
            postal_code: values.pincode,
            country: values.country,
          },
        };
        const res = await fetch("/api/stripe/create-customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        });
        const data: { customerId: string } = await res.json();
        custId = data.customerId;
      }
      newUserData = await initUser({ role: "AGENCY_OWNER" });
      if (!data?.customerId && !custId) return;
      await upsertAgency({
        id: data?.id ? data?.id : v4(),
        address: values.address,
        city: values.city,
        state: values.state,
        country: values.country,
        pincode: values.pincode,
        customerId: data?.customerId || custId || "",
        name: values.name,
        agencyEmail: values.agencyEmail,
        agencyPhone: values.agencyPhone,
        //@ts-ignore
        whiteLabel: values.whiteLabel,
        agencyLogo: values.agencyLogo,
        createdAt: new Date(),
        updatedAt: new Date(),
        goal: 5,
        connectAccountId: "",
      });
      ToastNotify({
        title: "Success",
        msg: "Agency created successfully",
      });

      router.refresh();
    } catch (error) {
      console.log(error);
      ToastNotify({
        title: "Oppse",
        msg: "Failed to create agency. Please try again later.",
      });
    }
  };

  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency(true);
    try {
      const res = await deleteAgency(data.id);
      ToastNotify({
        title: "Success",
        msg: "Agency deleted successfully",
      });
      router.refresh();
    } catch (err) {
      console.log(err);
      ToastNotify({
        title: "Oppse",
        msg: "Something went wrong. Please try again later.",
      });
    }
    setDeletingAgency(false);
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agency Infromation</CardTitle>
          <CardDescription>
            Create your agency effortlessly with our streamlined form! Just fill
            in the details, and {"we'll"} guide you through the process.{" "}
            {"Let's"} build your dream agency together!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndPoint="agencyLogo"
                        onChange={field.onChange}
                        value={field.value}
                      ></FileUpload>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your agency name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agencyEmail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Email</FormLabel>
                      <FormControl>
                        <Input readOnly placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="agencyPhone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled={isLoading}
                control={form.control}
                name="whiteLabel"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                      <div className=" flex flex-col gap-x-2">
                        <FormLabel>Whitelabel Agency</FormLabel>
                        <FormDescription className="m-[5px]">
                          <GradientText from="red" to="blue" size="20px">
                            Turning on whilelabel mode will show your agency
                            logo to all sub accounts by default. You can
                            overwrite this functionality through sub account
                            settings.
                          </GradientText>
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          defaultChecked
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 st..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Zipcpde</FormLabel>
                      <FormControl>
                        <Input placeholder="Zipcode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {data?.id && (
                <div className="flex flex-col gap-2">
                  <FormLabel>Create A Goal</FormLabel>
                  <FormDescription>
                    ✨ Create a goal for your agency. As your business grows
                    your goals grow too so dont forget to set the bar higher!
                  </FormDescription>
                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (val: any) => {
                      if (!data?.id) return;
                      await updateAgencyDetails(data.id, { goal: val });
                      await saveActivity({
                        agencyId: data.id,
                        desc: `Updated the agency goal to | ${val} Sub Account`,
                        subAccId: undefined,
                      });
                      router.refresh();
                    }}
                    min={1}
                    className="bg-background !border !border-input"
                    placeholder="Sub Account Goal"
                  />
                </div>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Save Agency Information"}
              </Button>

              {data?.id && (
                <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                  <div>
                    <div>Danger Zone</div>
                  </div>
                  <div className="text-muted-foreground">
                    Deleting your agency cannpt be undone. This will also delete
                    all sub accounts and all data related to your sub accounts.
                    Sub accounts will no longer have access to funnels, contacts
                    etc.
                  </div>
                  <AlertDialogTrigger
                    disabled={isLoading || deletingAgency}
                    className="text-red-600 p-2 text-center mt-2 rounded-md hove:bg-red-600 hover:text-white whitespace-nowrap"
                  >
                    {deletingAgency ? "Deleting..." : "Delete Agency"}
                  </AlertDialogTrigger>
                </div>
              )}
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-left">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-left">
                    This action cannot be undone. This will permanently delete
                    the Agency account and all related sub accounts.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center">
                  <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deletingAgency}
                    className="bg-destructive hover:bg-destructive"
                    onClick={handleDeleteAgency}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AgencyForm;
