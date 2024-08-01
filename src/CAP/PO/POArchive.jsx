import { PageHeader } from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import { usePO } from "@/hooks/usePO";
import { motion, AnimatePresence } from "framer-motion";

import { ToastContainer } from "react-toastify";

import {
  ArchiveRestore,
  GitPullRequest,
  Download,
  ChevronDown,
  Loader,
} from "lucide-react";

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
import Filter from "@/components/Filter";
import POTable from "@/tables/POTable";
import { handleArchiveRestoreOrDeleteData } from "@/utils/ARDDate";

export function POArchive() {
  const {
    archivedPOs,
    isLoadingArchivedPOs,
    uniqueArchivedCustomerNameOptions,
    uniqueArchivedCustomerNameQueue,
    setUniqueArchivedCustomerNameQueue,
    uniqueArchivedCAPIDOptions,
    uniqueArchivedCAPIDQueue,
    setUniqueArchivedCAPIDQueue,
    uniqueArchivedDateOptions,
    uniqueArchivedDataQueue,
    setUniqueArchivedDataQueue,
    filterCreatedPOTable,
    setFilterCreatedPOTable,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    selectedRows,
    setSelectedRows,
    reloadTable,
    setReloadTable,
    formatDate,
    isRestoringPO,
    setIsRestoringPO,
    isDeletingPO,
    setIsDeletingPO,
  } = usePO("poArchive");

  /**
   * Send Data to the API
   * 1- Restore and Delete
   */

  const handleRestoreOrDeletePOs = async (endPoint, setIsLoadingState) => {
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

  /**
   * filter method and functions
   */

  const filteredPOs = archivedPOs.filter(
    (po) =>
      (!uniqueArchivedCAPIDQueue ||
        po.PFI.some(
          (pfi) =>
            pfi.Customer.customerCapIdNo &&
            pfi.Customer.customerCapIdNo.toString().toLowerCase() ===
              uniqueArchivedCAPIDQueue.toString().toLowerCase()
        )) &&
      (!uniqueArchivedCustomerNameQueue ||
        po.PFI.some(
          (pfi) =>
            pfi.Customer.customerName &&
            pfi.Customer.customerName.toLowerCase() ===
              uniqueArchivedCustomerNameQueue.toLowerCase()
        )) &&
      (!uniqueArchivedDataQueue ||
        (po.createdAt &&
          formatDate(po.createdAt).toLowerCase() ===
            uniqueArchivedDataQueue.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPOs.length / rowsPerPage);

  const currentData = filteredPOs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  /**
   * handle onChange function
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

  return (
    <section className="bg-[#f8fcff] flex flex-col p-10 ml-20 w-full gap-5">
      <PageHeader
        title="Purchase Orders Archive"
        subTitle=" Review all archived PO and restore or delete them through the following table."
        isLoadingState={isLoadingArchivedPOs}
        data={archivedPOs}
        cardOneTitle="Total Archives"
        cardOneTextLink="Review Purchase Orders"
        cardOneLink="/CAP-po-review"
        iconOne={<ArchiveRestore size={20} className="text-blue-700" />}
        cardTwoTitle="New PO"
        cardTwoTextLink="Create new PO"
        cardTwoLink="/CAP-pfi-review"
        iconTwo={<GitPullRequest size={20} className="text-blue-700" />}
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

          <div className="flex flex-col gap-3 item-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="px-7 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
                  {isRestoringPO ? (
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
                    "Restore"
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will restore those POs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSelectedRows([])}>
                    Cancel
                  </AlertDialogCancel>
                  <form method="delete">
                    <AlertDialogAction
                      onClick={() => {
                        handleRestoreOrDeletePOs(
                          "https://benchmark-innovation-production.up.railway.app/api/po/soft",
                          setIsRestoringPO
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
                        handleRestoreOrDeletePOs(
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

        <AnimatePresence>
          {filterCreatedPOTable && (
            <Filter
              uniqueFirstOptions={uniqueArchivedCAPIDOptions}
              uniqueFirstQueue={uniqueArchivedCAPIDQueue}
              setUniqueFirstQueue={setUniqueArchivedCAPIDQueue}
              firstPlaceHolder="CAP - ID"
              uniqueSecondOptions={uniqueArchivedCustomerNameOptions}
              uniqueSecondQueue={uniqueArchivedCustomerNameQueue}
              setUniqueSecondQueue={setUniqueArchivedCustomerNameQueue}
              secondPlaceHolder="Customer Name"
              uniqueThirdOptions={uniqueArchivedDateOptions}
              uniqueThirdQueue={uniqueArchivedDataQueue}
              setUniqueThirdQueue={setUniqueArchivedDataQueue}
              ThirdPlaceHolder="Issue Date"
            />
          )}
        </AnimatePresence>

        <POTable
          isLoadingState={isLoadingArchivedPOs}
          fetchedData={archivedPOs}
          currentData={currentData}
          selectedRows={selectedRows}
          handleCheckboxChange={handleCheckboxChange}
          formatDate={formatDate}
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

export default POArchive;
