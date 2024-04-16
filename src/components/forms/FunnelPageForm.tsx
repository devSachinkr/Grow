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
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Funnel, FunnelPage } from "@prisma/client";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import FileUpload from "../golbal/FileUpload";
import { Button } from "../ui/button";
import Loading from "../golbal/Loading";
import {
  deleteFunnelePage,
  getFunnels,
  saveActivity,
  upsertFunnelPage,
} from "@/lib/queries";
import { CopyPlusIcon, Trash } from "lucide-react";
import { v4 } from "uuid";
import ToastNotify from "../golbal/ToastNotify";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
type Props = {
  subAccId: string;
  funnelId: string;
  order: number;
  defaultData?: FunnelPage;
};
const FunnelPageFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  pathName: z.string().optional(),
});
const FunnelPageForm = ({ funnelId, order, subAccId, defaultData }: Props) => {
  const form = useForm<z.infer<typeof FunnelPageFormSchema>>({
    resolver: zodResolver(FunnelPageFormSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultData?.name || "",
      pathName: defaultData?.pathName || "",
    },
  });
  const router = useRouter();
  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData?.name || "",
        pathName: defaultData?.pathName || "",
      });
    }
  }, [defaultData]);
  const onSubmit = async (values: z.infer<typeof FunnelPageFormSchema>) => {
    if (order !== 0 && !values.pathName)
      return form.setError("pathName", {
        message:
          "Pages other than the first page in the funnel require a path name example 'secondstep'.",
      });
    try {
      const response = await upsertFunnelPage(
        subAccId,
        {
          ...values,
          id: defaultData?.id || v4(),
          order: defaultData?.order || order,
          pathName: values.pathName || "",
        },
        funnelId
      );

      await saveActivity({
        agencyId: undefined,
        desc: `| Updated a funnel page | ${response?.name}`,
        subAccId: subAccId,
      });

      ToastNotify({
        title: "Success",
        msg: "Saves Funnel Page Details",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      ToastNotify({
        title: "Oppse",
        msg: "Could Save Funnel Page Details",
      });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Page</CardTitle>
        <CardDescription>
          Funnel pages are flow in the order they are created by default. You
          can move them around to change their order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting || order === 0}
              control={form.control}
              name="pathName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Path Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Path for the page"
                      {...field}
                      value={field.value?.toLowerCase()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Button
                className="w-22 self-end"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting ? <Loading /> : "Save Page"}
              </Button>

              {defaultData?.id && (
                <Button
                  variant={"outline"}
                  className="w-22 self-end border-destructive text-destructive hover:bg-destructive"
                  disabled={form.formState.isSubmitting}
                  type="button"
                  onClick={async () => {
                    const res = await deleteFunnelePage(defaultData.id);
                    await saveActivity({
                      agencyId: undefined,
                      desc: `| Deleted a funnel page | ${res?.name}`,
                      subAccId: subAccId,
                    });
                    router.refresh();
                  }}
                >
                  {form.formState.isSubmitting ? <Loading /> : <Trash />}
                </Button>
              )}
              {defaultData?.id && (
                <Button
                  variant={"outline"}
                  size={"icon"}
                  disabled={form.formState.isSubmitting}
                  type="button"
                  onClick={async () => {
                    const res = await getFunnels(subAccId);
                    if (!res) return;
                    const lastFunnelPage = res?.find(
                      (funnel) => funnel.id === funnelId
                    )?.FunnelPages.length;

                    await upsertFunnelPage(
                      subAccId,
                      {
                        ...defaultData,
                        id: v4(),
                        order: lastFunnelPage ? lastFunnelPage : 0,
                        visits: 0,
                        name: `${defaultData.name} Copy`,
                        pathName: `${defaultData.pathName}copy`,
                        content: defaultData.content,
                      },
                      funnelId
                    );
                    ToastNotify({
                      title: "Success",
                      msg: "Saves Funnel Page Details",
                    });
                    router.refresh();
                  }}
                >
                  {form.formState.isSubmitting ? <Loading /> : <CopyPlusIcon />}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FunnelPageForm;
