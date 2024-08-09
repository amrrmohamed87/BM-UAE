import { motion } from "framer-motion";
import { useTritonPrepare } from "@/hooks/useTritonPrepare";
import { PageHeader } from "@/components/PageHeader";
import { ToastContainer, toast } from "react-toastify";
import TritonPrepareForm from "@/forms/TritonPrepareForm";
import { BoxIcon, ChevronDown, ListChecks, Loader, Search } from "lucide-react";

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
} from "@/components/ui/alert-dialog";
import Select from "react-select";
import TritonTable from "@/tables/TritonTable";
import Pagination from "@/components/Pagination";
import { useMemo } from "react";

export function TritonPrepare() {
  //? useTritonPrepare Hook

  const {
    plannedSHPDate,
    setPlannedSHPDate,
    plannedSHPDateItems,
    isLoadindPlannedSHPDateItems,
    setSearchDate,
    uniqueDateOptions,
    uniqueDateQueue,
    setUniqueDateQueue,
    date,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    selectedRows,
    setSelectedRows,
    isSavingOrder,
    setIsSavingOrder,
    filterTritonPrepare,
    setFilterTritonPrepare,
    reloadTable,
    setReloadTable,
  } = useTritonPrepare();

  const filteredData = useMemo(() => {
    return (
      plannedSHPDateItems.length > 0 &&
      plannedSHPDateItems.filter(
        (order) =>
          !uniqueDateQueue ||
          order.CAPOrder.PO.PFI.some((pfi) =>
            pfi.PFIItems.some((item) =>
              item.Items?.Cycles.some(
                (cycle) => date(cycle.SHPDate) === uniqueDateQueue
              )
            )
          )
      )
    );
  }, [plannedSHPDateItems, uniqueDateQueue]);

  const totalPages = useMemo(() => {
    return Math.ceil(
      filteredData.length > 0 && filteredData.length / rowsPerPage
    );
  }, [filteredData, rowsPerPage]);

  const currentData =
    filteredData.length > 0 &&
    filteredData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );

  function handleCheckboxChange(event, order) {
    const isChecked = event.target.checked;

    setSelectedRows((prevRows) => {
      if (isChecked) {
        return [...prevRows, order];
      } else {
        return prevRows.filter((row) => row !== order);
      }
    });
  }

  const data =
    selectedRows.length > 0 &&
    selectedRows.flatMap((order) =>
      order.CAPOrder.PO.PFI.flatMap((pfi) =>
        pfi.PFIItems.map((item) => ({
          itemId: item.Items?.id || "",
          unit:
            item.Items?.Cycles.map((cycle) => ({
              label: cycle.label,
              SHPDate: date(cycle.SHPDate),
            })) || [],
          customerId: pfi.Customer.id,
          AWB: "",
          kitNo: "",
          basicUnitPrice: "",
        }))
      )
    );

  console.log(data);

  const handleSaveTriton = async () => {
    setIsSavingOrder(true);
    const data =
      selectedRows.length > 0 &&
      selectedRows.flatMap((order) =>
        order.CAPOrder.PO.PFI.flatMap((pfi) =>
          pfi.PFIItems.map((item) => ({
            itemId: item.Items?.id,
            unit: item.Items?.Cycles,
            customerId: pfi.Customer.id,
            AWB: 0,
            kitNo: 0,
            basicUnitPrice: 0,
          }))
        )
      );

    try {
      const response = await fetch(
        "https://benchmark-innovation-production.up.railway.app/api/triton-saving",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const resData = await response.json();

      console.log(resData.message);

      if (!response.ok) {
        toast.error(resData.message);
        setIsSavingOrder(false);
        return;
      }

      toast.success("Saved Successfully");

      setSelectedRows([]);
      setReloadTable(!reloadTable);
      setIsSavingOrder(false);
    } catch (error) {
      toast.error(error.message);
      setIsSavingOrder(false);
      return;
    }
  };

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

      <div className="flex flex-col w-full my-6 bg-white border shadow rounded-lg p-4">
        <div className="flex flex-col md:flex-row justify-start md:justify-between gap-3 items-center mb-4">
          <div className="flex gap-3 items-start">
            {/* <button
              onClick={() => {
                setFilterTritonPrepare(!filterTritonPrepare);
              }}
              className="flex justify-center items-center gap-1 w-full px-6 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
            >
              Filter
              <motion.span
                animate={{ rotate: filterTritonPrepare ? -180 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <ChevronDown size={20} />
              </motion.span>
            </button> */}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full px-9 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
                  {isSavingOrder ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      style={{
                        display: "inline-block",
                      }}
                    >
                      <Loader className="text-white" />
                    </motion.div>
                  ) : (
                    "Save"
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will save those orders.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSelectedRows([])}>
                    Cancel
                  </AlertDialogCancel>
                  <form method="post">
                    <AlertDialogAction onClick={handleSaveTriton}>
                      Confirm
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex items-center border shadow rounded-md">
              <input
                type="date"
                value={plannedSHPDate.date}
                onChange={(event) => {
                  setPlannedSHPDate((prev) => ({
                    ...prev,
                    date: event.target.value,
                  }));
                }}
                className="w-[220px] px-2 py-1.5 border-none focus:outline-none focus:border-transparent"
              />
              <button
                onClick={(event) => {
                  event.preventDefault();
                  setSearchDate(plannedSHPDate.date);
                }}
              >
                <Search
                  size={18}
                  className="mr-2 hover:text-green-500 transition-all duration-200"
                />
              </button>
            </div>

            <Select
              options={uniqueDateOptions}
              value={uniqueDateOptions.find(
                (option) => option.value === uniqueDateQueue
              )}
              onChange={(option) => setUniqueDateQueue(option && option.value)}
              isClearable
              className="w-full md:w-[200px]"
              placeholder="Dates"
            />
          </div>
        </div>

        <TritonTable
          cols={[
            "Orders",
            "Customer Name",
            "CAP - ID",
            "Item Code",
            "Item Desc",
            "Cycle",
            "Date",
          ]}
          isLoadingState={isLoadindPlannedSHPDateItems}
          fetchedData={plannedSHPDateItems}
          currentData={currentData}
          selectedRows={selectedRows}
          formatDate={date}
          handleCheckboxChange={handleCheckboxChange}
        />

        <Pagination
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
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
