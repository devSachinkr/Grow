import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: {
    subAccountId: string;
  };
};

const page = async ({ params: { subAccountId } }: Props) => {
  const res = await db.pipeline.findFirst({
    where: { subAccountId },
  });
  if (res) {
    return redirect(`/subaccount/${subAccountId}/pipelines/${res.id}`);
  }
  try {
    const res = await db.pipeline.create({
      data: {
        subAccountId,
        name: "My Pipeline",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export default page;
