import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArchiveRestore,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  GitPullRequest,
  ListChecks,
  Loader,
  ShoppingBag,
  Trash,
} from "lucide-react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../../CSS/Select.css";

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
import { Link } from "react-router-dom";
import { exportToPDF, exportToExcel } from "@/utils/ExcelPDF";
import { handleArchiveRestoreOrDeleteData } from "@/utils/ARDDate";
import PFITable from "@/tables/PFITable";
import { usePFIReview } from "@/hooks/usePFIReview";
import Pagination from "@/components/Pagination";
import { PageHeader } from "@/components/PageHeader";
import Filter from "@/components/Filter";

export function PFIArchive() {
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const {
    archivePFI,
    isLoadingArchivePFI,
    uniqueArchivedCAPIDOptions,
    uniqueArchivedCAPIDQueue,
    uniqueArchivedItemsOptions,
    uniqueArchivedItemsQueue,
    uniqueArchivedPFINoOptions,
    uniqueArchivedPFINoQueue,
    setUniqueArchivedCAPIDQueue,
    setUniqueArchivedItemsQueue,
    setUniqueArchivedPFINoQueue,
    filterRequestedPFITable,
    setFilterRequestedPFITable,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    reloadTable,
    setIsReloadTable,
    isRestoringPFIs,
    setIsRestoringPFIs,
    selectedRows,
    setSelectedRows,
    isDeletingPFI,
    setIsDeletingPFI,
  } = usePFIReview("archivePFI");

  /**
   * Send Data to APIs
   */

  const handleRestoreOrDeletePFIs = async (endPoint, setIsLoadingState) => {
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

  /**
   * Functions and variables
   * 1- filteredPFIs
   * 2- totalPages
   * 3- currentData
   */

  const filteredPFIs = archivePFI.filter(
    (pfi) =>
      (!uniqueArchivedCAPIDQueue ||
        pfi.Customer.customerCapIdNo.toString().toLowerCase() ===
          uniqueArchivedCAPIDQueue.toString().toLowerCase()) &&
      (!uniqueArchivedItemsQueue ||
        pfi.PFIItems.some((item) =>
          item.Items.itemName
            .toLowerCase()
            .includes(uniqueArchivedItemsQueue.toLowerCase())
        )) &&
      (!uniqueArchivedPFINoQueue ||
        pfi.PFINo.toLowerCase() === uniqueArchivedPFINoQueue.toLowerCase())
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
   * 2- handleCheckboxChange
   */

  function handleCheckboxChange(event, pfi) {
    const isChecked = event.target.checked;

    setSelectedRows((prevRow) => {
      if (isChecked) {
        return [...prevRow, pfi];
      } else {
        return prevRow.filter((row) => row !== pfi);
      }
    });
  }

  /* Export functions
   * 1- handleExportArchivedPFIToExcel
   * 2- handleExportArchivedPFIToPDF
   */

  const handleExportArchivedPFIToExcel = () => {
    setIsDownloadingExcel(true);
    const formatRequestedPFIDataForExcel = () => {
      return archivePFI.map((pfi) => ({
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
    exportToExcel(formatRequestedPFIDataForExcel, "archived-PFI-requests");
    toast.success("archived-PFI-requests Excel Sheet DownLoad Successfully");
    setIsDownloadingExcel(false);
  };

  const handleExportArchivedPFIToPDF = () => {
    setIsDownloadingPDF(true);
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
      archivePFI.map((pfi) => ({
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
      "archived-PFI-requests"
    );
    toast.success("archived-PFI-requests PDF Sheet DownLoad Successfully");
    setIsDownloadingPDF(false);
  };

  /**
   * Custome Components
   * 1- Pagination
   */

  return (
    <section className="bg-[#f8fcff] flex flex-col p-10 ml-20 w-full gap-5">
      <PageHeader
        title="Proforma Archive"
        subTitle=" Review all archived PFIs and restore or delete them through the following table."
        isLoadingState={isLoadingArchivePFI}
        data={archivePFI}
        cardOneTitle="Total Archives"
        cardOneTextLink="Review PFI"
        cardOneLink="/CAP-pfi-review"
        iconOne={<ArchiveRestore size={20} className="text-blue-700" />}
        cardTwoTitle="New Request"
        cardTwoTextLink="create new PFI"
        cardTwoLink="/CAP-pfi-request"
        iconTwo={<GitPullRequest size={20} className="text-blue-700" />}
      />

      <div className="flex flex-col w-full my-6 bg-white border shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col gap-3 items-start">
            <button
              onClick={() => {
                setFilterRequestedPFITable(!filterRequestedPFITable);
              }}
              className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
            >
              Filter
              <motion.span
                animate={{ rotate: filterRequestedPFITable ? -180 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <ChevronDown size={20} />
              </motion.span>
            </button>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex justify-center items-center gap-1 px-10 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500">
                  DownLoad <Download size={18} />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Download Data</DialogTitle>
                  <DialogDescription className="mt-2">
                    Please select your preferred format to download the data:
                    Excel or PDF.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4">
                  <button
                    disabled={isDownloadingExcel}
                    onClick={handleExportArchivedPFIToExcel}
                    className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-emerald-700 text-white rounded-md transition-all duration-300 hover:bg-emerald-900"
                  >
                    {isDownloadingExcel ? (
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
                      "Excel"
                    )}
                  </button>
                  <button
                    disabled={isDownloadingPDF}
                    onClick={handleExportArchivedPFIToPDF}
                    className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-red-700 text-white rounded-md transition-all duration-300 hover:bg-red-900"
                  >
                    {isDownloadingPDF ? (
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
                      "PDF"
                    )}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-3 items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full px-5 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
                  {isRestoringPFIs ? (
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
                    "Restore PFIs"
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will restore those PFIs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSelectedRows([])}>
                    Cancel
                  </AlertDialogCancel>
                  <form method="delete">
                    <AlertDialogAction
                      onClick={() => {
                        handleRestoreOrDeletePFIs(
                          "https://benchmark-innovation-production.up.railway.app/api/pfi/soft",

                          setIsRestoringPFIs
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
                <button className="w-full px-5 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
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
                    "Delete PFIs"
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will Delete those PFIs
                    frfom our server.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSelectedRows([])}>
                    Cancel
                  </AlertDialogCancel>
                  <form method="delete">
                    <AlertDialogAction
                      onClick={() => {
                        handleRestoreOrDeletePFIs(
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

        <AnimatePresence>
          {filterRequestedPFITable && (
            <Filter
              uniqueFirstOptions={uniqueArchivedCAPIDOptions}
              uniqueFirstQueue={uniqueArchivedCAPIDQueue}
              setUniqueFirstQueue={setUniqueArchivedCAPIDQueue}
              firstPlaceHolder="CAP - ID"
              uniqueSecondOptions={uniqueArchivedPFINoOptions}
              uniqueSecondQueue={uniqueArchivedPFINoQueue}
              setUniqueSecondQueue={setUniqueArchivedPFINoQueue}
              secondPlaceHolder="Quote #"
              uniqueThirdOptions={uniqueArchivedItemsOptions}
              uniqueThirdQueue={uniqueArchivedItemsQueue}
              setUniqueThirdQueue={setUniqueArchivedItemsQueue}
              ThirdPlaceHolder="Item Name"
            />
          )}
        </AnimatePresence>

        <PFITable
          isLoadingState={isLoadingArchivePFI}
          fetchedData={archivePFI}
          currentData={currentData}
          selectedRows={selectedRows}
          handleCheckboxChange={handleCheckboxChange}
          formateDate={formateDate}
        />

        <hr className="border-neutral-400" />

        <div className="flex justify-between items-center mt-2">
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
            setRowsPerPage={setRowsPerPage}
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

export default PFIArchive;
