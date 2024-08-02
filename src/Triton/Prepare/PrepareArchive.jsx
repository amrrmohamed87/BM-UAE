import { useTritonPrepare } from "@/hooks/useTritonPrepare";
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
  NotebookPen,
  SearchCheck,
} from "lucide-react";
import { exportToPDF, exportToExcel } from "@/utils/ExcelPDF";
import { handleArchiveRestoreOrDeleteData } from "@/utils/ARDDate";
import { PageHeader } from "@/components/PageHeader";

export function PrepareArchive() {
  //? useTritonPrepare hooks

  const {
    tritonPreparedArchivedData,
    isLoadingTritonPreparedArchivedData,
    filterTritonPrepare,
    setFilterTritonPrepare,
    isDeletingTritonPrepare,
    setIsDeletingTritonPrepare,
    isRestoringTritonPrepare,
    setIsRestoringTritonPrepare,
    selectedRows,
    setSelectedRows,
  } = useTritonPrepare("tritonPreparedArchive");

  return (
    <section className="bg-[#F5F5F5] flex flex-col p-10 ml-20 w-full gap-5">
      <PageHeader
        title="Triton Traceability Archive"
        subTitle="Review all archived Traceabilities for the CAP orders. Delete, Restore, And Extract Data through the following table."
        cardOneTitle="Archived Traceabilities"
        data={tritonPreparedArchivedData}
        isLoadingState={isLoadingTritonPreparedArchivedData}
        iconOne={<NotebookPen size={20} className="text-blue-700" />}
        cardOneLink="/Triton-prepare-review"
        cardOneTextLink="Review Traceabilities"
        iconTwo={<SearchCheck size={20} className="text-blue-700" />}
        cardTwoTitle="Archive Traceabilities"
        cardTwoLink="/Triton-prepare-archive"
        cardTwoTextLink="Archive"
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
                    <button className="flex justify-center items-center gap-1 w-full md:w-[110px] px-3 py-2 bg-emerald-700 text-white rounded-md transition-all duration-300 hover:bg-emerald-900">
                      Excel
                    </button>
                    <button className="flex justify-center items-center gap-1 w-full md:w-[110px] px-3 py-2 bg-red-700 text-white rounded-md transition-all duration-300 hover:bg-red-900">
                      PDF
                    </button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button
              onClick={() => {
                setFilterTritonPrepare(!filterTritonPrepare);
              }}
              className="flex justify-center items-center gap-1 w-full md:w-[110px] px-3 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
            >
              Filter
              <motion.span
                animate={{ rotate: filterTritonPrepare ? -180 : 0 }}
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
                  {isRestoringTritonPrepare ? (
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
                    <AlertDialogAction>Confirm</AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="px-8 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
                  {isDeletingTritonPrepare ? (
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
                    <AlertDialogAction>Confirm</AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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

export default PrepareArchive;
