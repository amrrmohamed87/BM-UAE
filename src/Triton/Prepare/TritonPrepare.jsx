import { useTritonPrepare } from "@/hooks/useTritonPrepare";
import { PageHeader } from "@/components/PageHeader";
import { ToastContainer, toast } from "react-toastify";
import TritonPrepareForm from "@/forms/TritonPrepareForm";
import { BoxIcon, ListChecks } from "lucide-react";
export function TritonPrepare() {
  //? useTritonPrepare Hook

  const { plannedSHPDateItems, isLoadindPlannedSHPDateItems } =
    useTritonPrepare("tritonPrepare");

  return (
    <section className="bg-[#f8fcff] flex flex-col p-10 ml-20 w-full gap-5">
      <PageHeader
        title="Triton Traceability"
        subTitle="Tracking the logistics process throughout the entire operation with manual data entry through the following form."
        cardOneTitle="Items per Planned SHPDate"
        data={plannedSHPDateItems}
        isLoadingState={isLoadindPlannedSHPDateItems}
        iconOne={<BoxIcon size={20} className="text-blue-700" />}
        cardOneLink="/items"
        cardOneTextLink="Items"
        iconTwo={<ListChecks size={20} className="text-blue-700" />}
        cardTwoTitle="CAP Invoices"
        cardTwoLink="/CAP-invoice-review"
        cardTwoTextLink="Invoices"
      />
      <div className="flex flex-col w-full my-6 p-4">
        <TritonPrepareForm />
      </div>

      <h1 className="text-center text-sm text-neutral-400">
        @2024 ApexBuild, Benchmark - All rights reserved
      </h1>
      <br />
      <ToastContainer />
    </section>
  );
}

export default TritonPrepare;
