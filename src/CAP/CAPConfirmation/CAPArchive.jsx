import { useCAPConfirmation } from "@/hooks/useCAPConfirmation";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import {
  ArchiveRestore,
  ChevronDown,
  Download,
  Loader,
  PackageCheck,
  PackageX,
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
import CAPOrdersTable from "@/tables/CAPOrdersTable";
import Pagination from "@/components/Pagination";
import Filter from "@/components/Filter";
import Select from "react-select";
import { handleArchiveRestoreOrDeleteData } from "@/utils/ARDDate";

export function CAPArchive() {
  //? Custom Hook for CAP Confirmation Orders

  const {
    archivedOrders,
    isLoadingArchivedOrders,
    reloadTable,
    setReloadTable,
    selectedRows,
    setSelectedRows,
    filterOrders,
    setFilterOrders,
    isRestoringOrder,
    setIsRestoringOrder,
    isDeletingOrder,
    setIsDeletingOrder,
    uniqueArchivedCustomerNameOptions,
    uniqueArchivedCustomerNameQueue,
    setUniqueArchivedCustomerNameQueue,
    uniqueArchivedCAPIDOptions,
    uniqueArchivedCAPIDQueue,
    setUniqueArchivedCAPIDQueue,
    uniqueArchivedOrderConfirmationNoOptions,
    uniqueArchivedOrderConfirmationNoQueue,
    setUniqueArchivedOrderConfirmationNoQueue,
    uniqueArchivedDateOptions,
    uniqueArchivedDateQueue,
    setUniqueArchivedDateQueue,
    date,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
  } = useCAPConfirmation("archivedOrders");

  const handleRestoreOrDeletePFIs = async (endPoint, setIsLoadingState) => {
    const orderId = {
      ids: selectedRows.map((row) => row.id),
    };

    await handleArchiveRestoreOrDeleteData(
      orderId,
      endPoint,
      setIsLoadingState,
      setReloadTable,
      reloadTable,
      setSelectedRows
    );
  };

  const filteredOrders = archivedOrders.filter(
    (order) =>
      (!uniqueArchivedCustomerNameQueue ||
        order.PO.PFI.some(
          (pfi) =>
            pfi.Customer.customerName.toLowerCase() ===
            uniqueArchivedCustomerNameQueue.toLowerCase()
        )) &&
      (!uniqueArchivedCAPIDQueue ||
        order.PO.PFI.some(
          (pfi) =>
            pfi.Customer.customerCapIdNo.toString().toLowerCase() ===
            uniqueArchivedCAPIDQueue.toLowerCase()
        )) &&
      (!uniqueArchivedOrderConfirmationNoQueue ||
        order.orderConfirmationNo.toString().toLowerCase() ===
          uniqueArchivedOrderConfirmationNoQueue.toLowerCase()) &&
      (!uniqueArchivedDateQueue ||
        date(order.createdAt).toLowerCase() ===
          uniqueArchivedDateQueue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const currentData = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle onChange function
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

  return (
    <section className="bg-[#f8fcff] flex flex-col p-10 ml-20 w-full gap-5">
      <PageHeader
        title="Confirmed CAP Orders Archive"
        subTitle="Review all archived orders and restore, delete, or extract data them through the following table."
        data={archivedOrders}
        isLoadingState={isLoadingArchivedOrders}
        cardOneTitle="Total Archives"
        iconOne={<PackageX size={20} className="text-blue-700" />}
        cardOneTextLink="View Confirmed Orders"
        cardOneLink="/CAP-confirmation-review"
        cardTwoTitle="New Confirmation"
        cardTwoTextLink="New Order"
        iconTwo={<PackageCheck size={20} className="text-blue-700" />}
        cardTwoLink="/CAP-po-review"
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
                setFilterOrders(!filterOrders);
              }}
              className="flex justify-center items-center gap-1 w-full md:w-[110px] px-3 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
            >
              Filter
              <motion.span
                animate={{ rotate: filterOrders ? -180 : 0 }}
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
                  {isRestoringOrder ? (
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
                    This action cannot be undone. This will restore those
                    Orders.
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
                          "https://benchmark-innovation-production.up.railway.app/api/cap-confirmation/soft",
                          setIsRestoringOrder
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
                  {isDeletingOrder ? (
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
                    This action cannot be undone. This will delete those Orders.
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
                          "https://benchmark-innovation-production.up.railway.app/api/cap-confirmation",
                          setIsDeletingOrder
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
          {filterOrders && (
            <Filter
              uniqueFirstOptions={uniqueArchivedCustomerNameOptions}
              uniqueFirstQueue={uniqueArchivedCustomerNameQueue}
              setUniqueFirstQueue={setUniqueArchivedCustomerNameQueue}
              firstPlaceHolder="Customer Name"
              uniqueSecondOptions={uniqueArchivedCAPIDOptions}
              uniqueSecondQueue={uniqueArchivedCAPIDQueue}
              setUniqueSecondQueue={setUniqueArchivedCAPIDQueue}
              secondPlaceHolder="CAP ID"
              uniqueThirdOptions={uniqueArchivedOrderConfirmationNoOptions}
              uniqueThirdQueue={uniqueArchivedOrderConfirmationNoQueue}
              setUniqueThirdQueue={setUniqueArchivedOrderConfirmationNoQueue}
              ThirdPlaceHolder="Order Confirmation #"
            >
              <Select
                options={uniqueArchivedDateOptions}
                value={uniqueArchivedDateOptions.find(
                  (option) => option.value === uniqueArchivedDateQueue
                )}
                onChange={(option) =>
                  setUniqueDateQueue(option && option.value)
                }
                isClearable
                className="w-full"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="Issue Date"
              />
            </Filter>
          )}
        </AnimatePresence>

        <CAPOrdersTable
          isLoadingState={isLoadingArchivedOrders}
          fetchedData={archivedOrders}
          currentData={currentData}
          selectedRows={selectedRows}
          handleCheckboxChange={handleCheckboxChange}
          formatDate={date}
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

export default CAPArchive;
