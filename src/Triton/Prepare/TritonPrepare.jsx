import { useTritonPrepare } from "@/hooks/useTritonPrepare";
import { PageHeader } from "@/components/PageHeader";
import TritonPrepareForm from "@/forms/TritonPrepareForm";
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
        cardOneLink="/items"
        cardOneTextLink="Items"
        cardTwoTitle="CAP Invoices"
        cardTwoLink="/CAP-invoice-review"
        cardTwoTextLink="Invoices"
      />
      <div className="flex flex-col w-full my-6 p-4">
        <TritonPrepareForm />
      </div>
    </section>
  );
}

export default TritonPrepare;
