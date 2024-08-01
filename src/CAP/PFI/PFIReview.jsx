import { usePFIReview } from "@/hooks/usePFIReview";
import { Link } from "react-router-dom";
import Pagination from "@/components/Pagination";

import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import { toast, ToastContainer } from "react-toastify";
import {
  Loader,
  Download,
  ChevronDown,
  ArrowRight,
  Box,
  ShoppingBag,
  ArchiveIcon,
  ArchiveRestore,
} from "lucide-react";
import { exportToPDF, exportToExcel } from "@/utils/ExcelPDF";
import { handleArchiveRestoreOrDeleteData } from "@/utils/ARDDate";
import { PageHeader } from "@/components/PageHeader";
import PFITable from "@/tables/PFITable";
import Filter from "@/components/Filter";

export function PFIReview() {
  const {
    requestedPFIs,
    isLoadingRequestedPFIs,
    uniqueCAPIDOptions,
    uniqueCAPIDQueue,
    setUniqueCAPIDQueue,
    uniquePFINoOptions,
    uniquePFINoQueue,
    setUniquePFINoQueue,
    uniqueItemsOptions,
    uniqueItemsQueue,
    setUniqueItemsQueue,
    filterRequestedPFITable,
    setFilterRequestedPFITable,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    pfiRequestId,
    setPFIRequestId,
    isArchivingPFIRequest,
    setIsArchivingPFIRequest,
    pfiData,
    setPFIDate,
    isLoadingSinglePFI,
    reloadTable,
    setIsReloadTable,
    selectedRows,
    setSelectedRows,
    isUpdatingPFI,
    setIsUpdatingPFI,
    updatedData,
    setUpdatedData,
    isCreatingPO,
    setIsCreatingPO,
    isDeletingPFI,
    setIsDeletingPFI,
  } = usePFIReview("reviewPFI");

  const handleArchiveOrDeletePFIs = async (endPoint, setIsLoadingState) => {
    const pfiIds = {
      ids: selectedRows.map((row) => row.id),
    };

    await handleArchiveRestoreOrDeleteData(
      pfiIds,
      endPoint,
      setIsLoadingState,
      setIsReloadTable,
      reloadTable,
      setSelectedRows
    );
  };

  const handleUpdatePFI = async () => {
    setIsUpdatingPFI(true);

    try {
      const response = await fetch(
        `https://benchmark-innovation-production.up.railway.app/api/pfi/${pfiRequestId.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const resData = await response.json();

      console.log(resData.message);

      if (!response.ok) {
        toast.error(resData.message);
        setIsUpdatingPFI(false);
        return;
      }

      toast.success("PFI Updated Successfully");
      setIsReloadTable(!reloadTable);
      setPFIRequestId({
        id: "",
      });
      setPFIDate({
        PFINo: "",
        PFIValue: "",
      });
      setIsUpdatingPFI(false);
    } catch (error) {
      toast.error(error.message);
      setIsUpdatingPFI(false);
      return;
    }
  };

  const handleCreatePO = async () => {
    setIsCreatingPO(true);

    const poData = {
      PFIId: selectedRows.map((pfi) => pfi.id),
    };

    try {
      const response = await fetch(
        "https://benchmark-innovation-production.up.railway.app/api/po",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(poData),
        }
      );
      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.message);
        setIsCreatingPO(false);
        return;
      }

      toast.success("PO Created Succefully");

      setIsReloadTable(!reloadTable);
      setSelectedRows([]);
      setIsCreatingPO(false);
    } catch (error) {
      toast.error(error.message);
      setIsCreatingPO(false);
      return;
    }
  };

  /**
   * Functions and variables
   * 1- filteredPFIs
   * 2- totalPages
   * 3- currentData
   */

  const filteredPFIs = requestedPFIs.filter(
    (pfi) =>
      (!uniqueCAPIDQueue ||
        pfi.Customer.customerCapIdNo.toString().toLowerCase() ===
          uniqueCAPIDQueue.toString().toLowerCase()) &&
      (!uniqueItemsQueue ||
        pfi.PFIItems.some((item) =>
          item.Items.itemName
            .toLowerCase()
            .includes(uniqueItemsQueue.toLowerCase())
        )) &&
      (!uniquePFINoQueue ||
        pfi.PFINo.toLowerCase() === uniquePFINoQueue.toLowerCase())
  );
  const totalPages = Math.ceil(filteredPFIs.length / rowsPerPage);

  const currentData = filteredPFIs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const formateDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  /**
   * handleOnChange functions
   * 1- handleRowsPerPage
   */

  function handleRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  }

  function handleCheckboxChange(event, pfi) {
    const isChecked = event.target.checked;

    setSelectedRows((prevRows) => {
      if (isChecked) {
        return [...prevRows, pfi];
      } else {
        return prevRows.filter((row) => row !== pfi);
      }
    });
  }

  /* Export functions
   * 1- handleExportArchivedPFIToExcel
   * 2- handleExportArchivedPFIToPDF
   */

  const handleExportRequestedPFIToExcel = () => {
    const formatRequestedPFIDataForExcel = () => {
      return requestedPFIs.map((pfi) => ({
        "Customer Name": pfi.Customer.customerName,
        "CAP ID": pfi.Customer.customerCapIdNo,
        Item: pfi.PFIItems.map((item) => item.Items.itemName).join(", "),
        Unit: pfi.PFIItems.map((item) => {
          if (item.program.length > 0) {
            return "Program";
          } else if (item.unit.length > 0) {
            return item.unit.map((u) => u.label).join(", ");
          } else {
            return "No Data";
          }
        }).join(", "),
        SHPDate: pfi.PFIItems.map((item) => {
          if (item.program.length > 0) {
            return item.program.map((p) => formateDate(p.SHPDate)).join(", ");
          } else if (item.unit.length > 0) {
            return item.unit.map((u) => formateDate(u.SHPDate)).join(", ");
          } else {
            return "No Date";
          }
        }).join(", "),
        QTY: pfi.PFIItems.map((item) => item.quantity).join(", "),
        SHPFees: pfi.PFIItems.map((item) => item.SHPFees).join(", "),
        Price: pfi.PFIItems.map((item) => item.price).join(", "),
        Total: pfi.PFIItems.map((item) => item.total).join(", "),
        PFIValue: pfi.PFIValue,
        "PFI - Serial": pfi.SERIAL,
      }));
    };
    exportToExcel(formatRequestedPFIDataForExcel, "requested-PFI-requests");
    toast.success("requested-PFI-requests Excel Sheet Downloaded Successfully");
  };

  const handleExportRequestedPFIToPDF = () => {
    const columns = [
      "Customer Name",
      "CAP ID",
      "Item",
      "Unit",
      "SHPDate",
      "QTY",
      "SHPFees",
      "Price",
      "Total",
      "PFIValue",
      "PFI Serial",
    ];
    exportToPDF(
      requestedPFIs.map((pfi) => ({
        "Customer Name": pfi.Customer.customerName,
        "CAP ID": pfi.Customer.customerCapIdNo,
        Item: pfi.PFIItems.map((item) => item.Items.itemName).join(", "),
        Unit: pfi.PFIItems.map((item) => {
          if (item.program.length > 0) {
            return "Program";
          } else if (item.unit.length > 0) {
            return item.unit.map((u) => u.label).join(", ");
          } else {
            return "No Data";
          }
        }).join(", "),
        SHPDate: pfi.PFIItems.map((item) => {
          if (item.program.length > 0) {
            return item.program.map((p) => formateDate(p.SHPDate)).join(", ");
          } else if (item.unit.length > 0) {
            return item.unit.map((u) => formateDate(u.SHPDate)).join(", ");
          } else {
            return "No Date";
          }
        }).join(", "),
        QTY: pfi.PFIItems.map((item) => item.quantity).join(", "),
        SHPFees: pfi.PFIItems.map((item) => item.SHPFees).join(", "),
        Price: pfi.PFIItems.map((item) => item.price).join(", "),
        Total: pfi.PFIItems.map((item) => item.total).join(", "),
        PFIValue: pfi.PFIValue,
        "PFI Serial": pfi.SERIAL,
      })),
      columns,
      "requested-PFI-requests"
    );
    toast.success("requested-PFI-requests PDF Downloaded Successfully");
  };

  return (
    <section className="bg-[#f8fcff] flex flex-col p-8 md:p-10 ml-20 mr-10 w-full gap-5">
      <PageHeader
        title="Proforma Review"
        subTitle="Review all requested PFIs and edit them through the following table."
        isLoadingState={isLoadingRequestedPFIs}
        data={requestedPFIs}
        cardOneTitle="Total Requests"
        cardOneTextLink="New PFI"
        cardOneLink="/CAP-pfi-request"
        iconOne={<ShoppingBag size={20} className="text-blue-700" />}
        cardTwoTitle="Archive"
        cardTwoTextLink="Archive"
        cardTwoLink="/CAP-pfi-archive"
        iconTwo={<ArchiveRestore size={20} className="text-blue-700" />}
      />

      <div className="flex flex-col w-full my-6 bg-white border shadow rounded-lg p-4">
        <div className="flex flex-col md:flex-row justify-start md:justify-between gap-3 items-center mb-4">
          <div className="flex flex-col gap-3 items-start">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex justify-center w-full items-center gap-1 px-10 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500">
                  DownLoad <Download size={18} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Download Data</DialogTitle>
                  <DialogDescription className="mt-2">
                    Please select your preferred format to download the data:
                    Excel or PDF.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4">
                  <div className="flex flex-col justify-center gap-3 items-center md:justify-end md:flex-row">
                    <button
                      onClick={handleExportRequestedPFIToExcel}
                      className="flex justify-center items-center gap-1 w-full md:w-[110px] px-3 py-2 bg-emerald-700 text-white rounded-md transition-all duration-300 hover:bg-emerald-900"
                    >
                      Excel
                    </button>
                    <button
                      onClick={handleExportRequestedPFIToPDF}
                      className="flex justify-center items-center gap-1 w-full md:w-[110px] px-3 py-2 bg-red-700 text-white rounded-md transition-all duration-300 hover:bg-red-900"
                    >
                      PDF
                    </button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button
              onClick={() => {
                setFilterRequestedPFITable(!filterRequestedPFITable);
              }}
              className="flex justify-center items-center gap-1 w-full md:w-[110px] px-3 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
            >
              Filter
              <motion.span
                animate={{ rotate: filterRequestedPFITable ? -180 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <ChevronDown size={20} />
              </motion.span>
            </button>
          </div>

          <div className="flex flex-col items-start gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
                  {isCreatingPO ? (
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
                    "Create PO"
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will create PO for those
                    PFIs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSelectedRows([])}>
                    Cancel
                  </AlertDialogCancel>
                  <form method="post">
                    <AlertDialogAction onClick={handleCreatePO}>
                      Confirm
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex gap-3 items-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="px-7 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
                    {isArchivingPFIRequest ? (
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
                      "Archive"
                    )}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will restore those
                      PFIs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedRows([])}>
                      Cancel
                    </AlertDialogCancel>
                    <form method="delete">
                      <AlertDialogAction
                        onClick={() => {
                          handleArchiveOrDeletePFIs(
                            "https://benchmark-innovation-production.up.railway.app/api/pfi/soft",
                            setIsArchivingPFIRequest
                          );
                        }}
                      >
                        Confirm
                      </AlertDialogAction>
                    </form>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="px-8 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
                    {isDeletingPFI ? (
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
                      "Delete"
                    )}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will restore those
                      PFIs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedRows([])}>
                      Cancel
                    </AlertDialogCancel>
                    <form method="delete">
                      <AlertDialogAction
                        onClick={() => {
                          handleArchiveOrDeletePFIs(
                            "https://benchmark-innovation-production.up.railway.app/api/pfi",
                            setIsDeletingPFI
                          );
                        }}
                      >
                        Confirm
                      </AlertDialogAction>
                    </form>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {filterRequestedPFITable && (
            <Filter
              uniqueFirstOptions={uniqueCAPIDOptions}
              uniqueFirstQueue={uniqueCAPIDQueue}
              setUniqueFirstQueue={setUniqueCAPIDQueue}
              firstPlaceHolder="CAP - ID"
              uniqueSecondOptions={uniquePFINoOptions}
              uniqueSecondQueue={uniquePFINoQueue}
              setUniqueSecondQueue={setUniquePFINoQueue}
              secondPlaceHolder="Quote #"
              uniqueThirdOptions={uniqueItemsOptions}
              uniqueThirdQueue={uniqueItemsQueue}
              setUniqueThirdQueue={setUniqueItemsQueue}
              ThirdPlaceHolder="Item Name"
            />
          )}
        </AnimatePresence>

        <PFITable
          isLoadingState={isLoadingRequestedPFIs}
          fetchedData={requestedPFIs}
          currentData={currentData}
          selectedRows={selectedRows}
          handleCheckboxChange={handleCheckboxChange}
          handleUpdatePFI={handleUpdatePFI}
          isLoadingSinglePFI={isLoadingSinglePFI}
          pfiData={pfiData}
          pfiRequestId={pfiRequestId}
          setPFIRequestId={setPFIRequestId}
          isUpdatingPFI={isUpdatingPFI}
          updatedData={updatedData}
          setUpdatedData={setUpdatedData}
          setPFIDate={setPFIDate}
          formateDate={formateDate}
        />

        <hr className="border-neutral-400" />

        <div className="flex flex-col justify-center gap-3 md:flex-row md:justify-between items-center mt-4 md:mt-2">
          <div className="flex items-center gap-2">
            <input
              value={selectedRows.length}
              onChange={(event) => event.target.value}
              className="w-10 pl-3 border rounded-md shadow"
            />
            <p className="">row selected</p>
          </div>
          <Pagination
            rowsPerPage={rowsPerPage}
            handleRowsPerPage={handleRowsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      <h1 className="text-center text-sm text-neutral-400">
        @2024 ApexBuild, Benchmark - All rights reserved
      </h1>
      <br />
      <ToastContainer />
    </section>
  );
}

export default PFIReview;
