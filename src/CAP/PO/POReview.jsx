import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArchiveRestore,
  ArrowRight,
  Box,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Edit,
  ListChecks,
  Loader,
  Printer,
  ShoppingBag,
  Trash,
} from "lucide-react";
import Select from "react-select";
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
import { printPO } from "@/utils/Print";
import { usePO } from "@/hooks/usePO";
import { handleArchiveRestoreOrDeleteData } from "@/utils/ARDDate";
import { PageHeader } from "@/components/PageHeader";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import POTable from "@/tables/POTable";

export function POReview() {
  const {
    createdPOs,
    isLoadingCreatedPOs,
    uniqueCustomerNameOptions,
    uniqueCustomerNameQueue,
    setUniqueCustomerNameQueue,
    uniqueCAPIDOptions,
    uniqueCAPIDQueue,
    setUniqueCAPIDQueue,
    uniqueDateOptions,
    uniqueDataQueue,
    setUniqueDataQueue,
    filterCreatedPOTable,
    setFilterCreatedPOTable,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    orderConfirmationData,
    setorderConfirmationData,
    isConfirmingCapOrder,
    setIsConfirmingCapOrder,
    selectedRows,
    setSelectedRows,
    reloadTable,
    setReloadTable,
    formatDate,
    isArchivingPO,
    setIsArchivingPO,
    isDeletingPO,
    setIsDeletingPO,
  } = usePO("poReview");

  /**
   * Sendind Data to APIs
   * 1- handleConfirmCapOrder
   * 2- handleConfirmCapOrder
   */

  const handleArchiveOrDeletePFIs = async (endPoint, setIsLoadingState) => {
    const pfiIds = {
      ids: selectedRows.map((row) => row.id),
    };

    await handleArchiveRestoreOrDeleteData(
      pfiIds,
      endPoint,
      setIsLoadingState,
      setReloadTable,
      reloadTable,
      setSelectedRows
    );
  };

  const handleConfirmCapOrder = async () => {
    setIsConfirmingCapOrder(true);
    const data = {
      ...orderConfirmationData,
      orderConfirmationNo: parseInt(
        orderConfirmationData.orderConfirmationNo,
        10
      ),
    };

    try {
      const response = await fetch(
        "https://benchmark-innovation-production.up.railway.app/api/cap-confirmation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.message);
        setIsConfirmingCapOrder(false);
        return;
      }

      toast.success("CAP Order Confirmed Successfully");
      setReloadTable(!reloadTable);
      setorderConfirmationData({
        POId: "",
        orderConfirmationNo: "",
      });
      setSelectedRows([]);
      setIsConfirmingCapOrder(false);
    } catch (error) {
      toast.error(error.message);
      setIsConfirmingCapOrder(false);
      return;
    }
  };
  /**
   * handleOnChange functions
   * 1- handleRowsPerPage
   */

  function handleRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  }

  function handleCheckboxChange(event, po) {
    const isChecked = event.target.checked;

    setSelectedRows((prevRows) => {
      if (isChecked) {
        return [...prevRows, po];
      } else {
        return prevRows.filter((row) => row !== po);
      }
    });
  }

  /**
   * Functions
   * 1- formatDate
   * 2- filteredPOs
   * 3- totalPages
   * 4- currentData
   */

  const filteredPOs = createdPOs.filter(
    (po) =>
      (!uniqueCAPIDQueue ||
        po.PFI.some(
          (pfi) =>
            pfi.Customer.customerCapIdNo &&
            pfi.Customer.customerCapIdNo.toString().toLowerCase() ===
              uniqueCAPIDQueue.toString().toLowerCase()
        )) &&
      (!uniqueCustomerNameQueue ||
        po.PFI.some(
          (pfi) =>
            pfi.Customer.customerName &&
            pfi.Customer.customerName.toLowerCase() ===
              uniqueCustomerNameQueue.toLowerCase()
        )) &&
      (!uniqueDataQueue ||
        (po.createdAt &&
          formatDate(po.createdAt).toLowerCase() ===
            uniqueDataQueue.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPOs.length / rowsPerPage);

  const currentData = filteredPOs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  /**
   * Custome Components
   * 1- Pagination
   */

  const handlePrintPDF = () => {
    const columns = ["Customer", "CAP ID", "Quote #", "PFI Value"];

    const data = createdPOs.flatMap((po) =>
      po.PFI.map((pfi) => ({
        Customer: pfi.Customer.customerName,
        "CAP ID": pfi.Customer.customerCapIdNo,
        "Quote #": pfi.PFINo,
        "PFI Value": `$ ${pfi.PFIValue}`,
      }))
    );

    printPO(data, columns);
    toast.success("POBMI-CAP-Invoice Successfully Downloaded");
  };

  return (
    <section className="bg-[#f5f5f5] flex flex-col p-10 ml-20 w-full gap-5">
      <PageHeader
        title="Purchase Orders Review"
        subTitle="Review all created POs and edit them through the following table."
        data={createdPOs}
        isLoadingState={isLoadingCreatedPOs}
        cardOneTitle="Total POs"
        iconOne={<ShoppingBag size={20} className="text-blue-700" />}
        cardOneTextLink="New Purchase Order"
        cardOneLink="/CAP-pfi-review"
        cardTwoTitle="Archived purchase orders"
        iconTwo={<ArchiveRestore size={20} className="text-blue-700" />}
        cardTwoTextLink="Archive"
        cardTwoLink="/CAP-po-archive"
      />

      <div className="flex flex-col w-full my-6 bg-white border shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col justify-start gap-3">
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
                  <button className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-emerald-700 text-white rounded-md transition-all duration-300 hover:bg-emerald-900">
                    Excel
                  </button>
                  <button className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-red-700 text-white rounded-md transition-all duration-300 hover:bg-red-900">
                    PDF
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button
              onClick={() => {
                setFilterCreatedPOTable(!filterCreatedPOTable);
              }}
              className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
            >
              Filter
              <motion.span
                animate={{ rotate: filterCreatedPOTable ? -180 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <ChevronDown size={20} />
              </motion.span>
            </button>
          </div>

          <div className="flex flex-col justify-start gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  onClick={() => {
                    setorderConfirmationData((prev) => ({
                      ...prev,
                      POId: selectedRows.length > 0 ? selectedRows[0].id : "",
                    }));
                  }}
                  className="px-5 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500"
                >
                  {isConfirmingCapOrder ? (
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
                    "Confirm CAP Order"
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will Confirm CAP Order
                    for those POs.
                  </AlertDialogDescription>
                  <div>
                    <input
                      placeholder="Order Confirmation Number"
                      type="number"
                      name="orderConfirmationNo"
                      value={orderConfirmationData.orderConfirmationNo}
                      onChange={(event) => {
                        setorderConfirmationData((prev) => ({
                          ...prev,
                          orderConfirmationNo: event.target.value,
                        }));
                      }}
                      className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                    />
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setSelectedRows([]);
                      setorderConfirmationData({
                        POId: "",
                        orderConfirmationNo: "",
                      });
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <form method="post">
                    <AlertDialogAction onClick={handleConfirmCapOrder}>
                      Confirm
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex gap-3 item-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="px-7 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
                    {isArchivingPO ? (
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
                            "https://benchmark-innovation-production.up.railway.app/api/po/soft",
                            setIsArchivingPO
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
                    {isDeletingPO ? (
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
                            "https://benchmark-innovation-production.up.railway.app/api/po",
                            setIsDeletingPO
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
          {filterCreatedPOTable && (
            <Filter
              uniqueFirstOptions={uniqueCAPIDOptions}
              uniqueFirstQueue={uniqueCAPIDQueue}
              setUniqueFirstQueue={setUniqueCAPIDQueue}
              firstPlaceHolder="CAP - ID"
              uniqueSecondOptions={uniqueCustomerNameOptions}
              uniqueSecondQueue={uniqueCustomerNameQueue}
              setUniqueSecondQueue={setUniqueCustomerNameQueue}
              secondPlaceHolder="Customer Name"
              uniqueThirdOptions={uniqueDateOptions}
              uniqueThirdQueue={uniqueDataQueue}
              setUniqueThirdQueue={setUniqueDataQueue}
              ThirdPlaceHolder="Issue Date"
            />
          )}
        </AnimatePresence>

        <POTable
          isLoadingState={isLoadingCreatedPOs}
          fetchedData={createdPOs}
          currentData={currentData}
          selectedRows={selectedRows}
          handleCheckboxChange={handleCheckboxChange}
          formatDate={formatDate}
          handlePrintPO={handlePrintPDF}
        />

        <div className="flex justify-between items-center mt-4">
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
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
      <h1 className="text-center text-sm text-neutral-400 mb-2">
        @2024 ApexBuild, Benchmark - All rights reserved
      </h1>
      <ToastContainer />
    </section>
  );
}

export default POReview;
