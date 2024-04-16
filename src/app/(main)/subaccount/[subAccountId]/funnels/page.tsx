import { getFunnels } from "@/lib/queries";
import React from "react";
import FunnelsDataTable from "./data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import BlurPage from "@/components/golbal/BlurPage";
import FunnelForm from "@/components/forms/FunnelForm";

const page = async ({
  params: { subAccountId },
}: {
  params: { subAccountId: string };
}) => {
  const funnels = await getFunnels(subAccountId);
  if (!funnels) return null;

  return (
    <BlurPage>
      <FunnelsDataTable
        buttonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={<FunnelForm subAccId={subAccountId}></FunnelForm>}
        filterValue="name"
        columns={columns}
        //@ts-ignore
        data={funnels}
      />
    </BlurPage>
  );
};

export default page;
