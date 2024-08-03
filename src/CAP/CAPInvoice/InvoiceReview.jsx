import { useCAPInvoice } from "@/hooks/useCAPInvoice";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import {
  ChevronDown,
  Download,
  FileMinus2,
  FileText,
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
import Select from "react-select";
import CAPInvoiceTable from "@/tables/CAPInvoiceTable";
import Pagination from "@/components/Pagination";
import { handleArchiveRestoreOrDeleteData } from "@/utils/ARDDate";

export function InvoiceReview() {
  //? Custome hook for Invoices Review

  const {
    capInvoices,
    isLoadingCAPInvoices,
    reloadTable,
    setReloadTable,
    selectedRows,
    setSelectedRows,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    filterInvoices,
    setFilterInvoices,
    isDeletingInvoice,
    setIsDeletingInvoice,
    isArchivingInvoice,
    setIsArchivingInvoice,
    uniqueCustomerNameOptions,
    uniqueCustomerNameQueue,
    setUniqueCustomerNameQueue,
    uniqueCAPIDOptions,
    uniqueCAPIDQueue,
    setUniqueCAPIDQueue,
    uniqueCapInvoiceNoOptions,
    uniqueCapInvoiceNoQueue,
    setUniqueCapInvoiceNoQueue,
    uniqueStatusOptions,
    uniqueStatusQueue,
    setUniqueStatusQueue,
  } = useCAPInvoice("invoicesReview");

  //Sending data to api
  const handleArchiveOrDelete = async (endPoint, setIsLoadingState) => {
    const invoiceIds = {
      ids: selectedRows.map((row) => row.id),
    };

    await handleArchiveRestoreOrDeleteData(
      invoiceIds,
      endPoint,
      setIsLoadingState,
      setReloadTable,
      reloadTable,
      setSelectedRows
    );
  };

  //Filter functions
  const filteredInvoices = capInvoices.filter(
    (invoice) =>
      (!uniqueCustomerNameQueue ||
        invoice.CAPOrder.PO.PFI.some(
          (pfi) =>
            pfi.Customer.customerName.toLowerCase() ===
            uniqueCustomerNameQueue.toLowerCase()
        )) &&
      (!uniqueCAPIDQueue ||
        invoice.CAPOrder.PO.PFI.some(
          (pfi) =>
            pfi.Customer.customerCapIdNo.toString().toLowerCase() ===
            uniqueCAPIDQueue.toLowerCase()
        )) &&
      (!uniqueCapInvoiceNoQueue ||
        invoice.capInvoiceNo.toLowerCase() ===
          uniqueCapInvoiceNoQueue.toLowerCase()) &&
      (!uniqueStatusQueue ||
        invoice.status.toLowerCase() === uniqueStatusQueue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);

  const currentData = filteredInvoices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  //handle onChange functions

  function handleCheckboxChange(event, invoice) {
    const isChecked = event.target.checked;

    setSelectedRows((prevRows) => {
      if (isChecked) {
        return [...prevRows, invoice];
      } else {
        return prevRows.filter((row) => row !== invoice);
      }
    });
  }

  return (
    <section className="bg-[#f8fcff] flex flex-col p-10 ml-20 w-full gap-5">
      <PageHeader
        title="CAP Invoices Review"
        subTitle="Review all cap invoices and edit, archive, delete, or extract data them through the following table."
        data={capInvoices}
        isLoadingState={isLoadingCAPInvoices}
        cardOneTitle="Total Invoices"
        iconOne={<FileText size={20} className="text-blue-700" />}
        cardOneTextLink="New CAP Invoice"
        cardOneLink="/CAP-confirmation-review"
        cardTwoTitle="Archived Invoices"
        cardTwoTextLink="Archive"
        iconTwo={<FileMinus2 size={20} className="text-blue-700" />}
        cardTwoLink="/CAP-invoice-archive"
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
                setFilterInvoices(!filterInvoices);
              }}
              className="flex justify-center items-center gap-1 w-full md:w-[110px] px-3 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
            >
              Filter
              <motion.span
                animate={{ rotate: filterInvoices ? -180 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <ChevronDown size={20} className="mt-1" />
              </motion.span>
            </button>
          </div>

          <div className="flex flex-col gap-3 items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="px-7 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
                  {isArchivingInvoice ? (
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
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will archive those
                    Invoices.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSelectedRows([])}>
                    Cancel
                  </AlertDialogCancel>
                  <form method="delete">
                    <AlertDialogAction
                      onClick={() => {
                        handleArchiveOrDelete(
                          "https://benchmark-innovation-production.up.railway.app/api/cap-invoice/soft",
                          setIsArchivingInvoice
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
                  {isDeletingInvoice ? (
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
                    This action cannot be undone. This will delete those
                    invoices.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setSelectedRows([])}>
                    Cancel
                  </AlertDialogCancel>
                  <form method="delete">
                    <AlertDialogAction
                      onClick={() =>
                        handleArchiveOrDelete(
                          "https://benchmark-innovation-production.up.railway.app/api/cap-invoice",
                          setIsDeletingInvoice
                        )
                      }
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
          {filterInvoices && (
            <Filter
              uniqueFirstOptions={uniqueCustomerNameOptions}
              uniqueFirstQueue={uniqueCustomerNameQueue}
              setUniqueFirstQueue={setUniqueCustomerNameQueue}
              firstPlaceHolder="Customer Name"
              uniqueSecondOptions={uniqueCAPIDOptions}
              uniqueSecondQueue={uniqueCAPIDQueue}
              setUniqueSecondQueue={setUniqueCAPIDQueue}
              secondPlaceHolder="CAP ID"
              uniqueThirdOptions={uniqueCapInvoiceNoOptions}
              uniqueThirdQueue={uniqueCapInvoiceNoQueue}
              setUniqueThirdQueue={setUniqueCapInvoiceNoQueue}
              ThirdPlaceHolder="Cap Invoice #"
            >
              <Select
                options={uniqueStatusOptions}
                value={uniqueStatusOptions.find(
                  (option) => option.value === uniqueStatusQueue
                )}
                onChange={(option) =>
                  setUniqueStatusQueue(option && option.value)
                }
                isClearable
                className="w-full"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="Status"
              />
            </Filter>
          )}
        </AnimatePresence>

        <CAPInvoiceTable
          isLoadingState={isLoadingCAPInvoices}
          fetchedData={capInvoices}
          currentData={currentData}
          selectedRows={selectedRows}
          handleCheckboxChange={handleCheckboxChange}
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

export default InvoiceReview;
