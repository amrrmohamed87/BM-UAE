import { useCAPConfirmation } from "@/hooks/useCAPConfirmation";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import {
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
import Filter from "@/components/Filter";
import Select from "react-select";
import CAPOrdersTable from "@/tables/CAPOrdersTable";
import { handleCheckboxChange } from "@/utils/utils";
import Pagination from "@/components/Pagination";
import { handleArchiveRestoreOrDeleteData } from "@/utils/ARDDate";

export function CAPReview() {
  //? Custom Hook for CAP Confirmation Orders

  const {
    confirmedOrders,
    isLoadingOrders,
    reloadTable,
    setReloadTable,
    selectedRows,
    setSelectedRows,
    filterOrders,
    setFilterOrders,
    isArchivingOrder,
    setIsArchivingOrder,
    isDeletingOrder,
    setIsDeletingOrder,
    capInvoiceData,
    setCAPInvoiceData,
    swiftData,
    setSwiftData,
    isCreatingInvoice,
    setIsCreatingInvoice,
    isSwift,
    setIsSwift,
    uniqueCustomerNameOptions,
    uniqueCustomerNameQueue,
    setUniqueCustomerNameQueue,
    uniqueCAPIDOptions,
    uniqueCAPIDQueue,
    setUniqueCAPIDQueue,
    uniqueOrderConfirmationNoOptions,
    uniqueOrderConfirmationNoQueue,
    setUniqueOrderConfirmationNoQueue,
    uniqueDateOptions,
    uniqueDateQueue,
    setUniqueDateQueue,
    date,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
  } = useCAPConfirmation("reviewOrders");

  //Sending Data to the API
  const handleCreateInvoice = async () => {
    setIsCreatingInvoice(true);

    const invoiceData = {
      CAPOrderId: selectedRows.length > 0 && selectedRows[0].id,
      capInvoiceNo: capInvoiceData.capInvoiceNo,
      swiftNo: swiftData.swiftNo ? swiftData.swiftNo : "",
    };

    console.log(invoiceData);

    try {
      const response = await fetch(
        "https://benchmark-innovation-production.up.railway.app/api/cap-invoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceData),
        }
      );
      const resData = await response.json();

      console.log(resData.message);

      if (!response.ok) {
        toast.error(resData.message);
        setIsCreatingInvoice(false);
        return;
      }

      toast.success("Invoice Created Succefully");

      setReloadTable(!reloadTable);
      setCAPInvoiceData({
        capInvoiceNo: "",
      });
      setSwiftData({
        swiftNo: "",
      });
      setIsSwift(false);
      setIsCreatingInvoice(false);
    } catch (error) {
      toast.error(error.message);
      setIsCreatingInvoice(false);
      return;
    }
  };
  const handleArchiveOrDeletePFIs = async (endPoint, setIsLoadingState) => {
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

  // Filtering data methods
  const filteredOrders = confirmedOrders.filter(
    (order) =>
      (!uniqueCustomerNameQueue ||
        order.PO.PFI.some(
          (pfi) =>
            pfi.Customer.customerName.toLowerCase() ===
            uniqueCustomerNameQueue.toLowerCase()
        )) &&
      (!uniqueCAPIDQueue ||
        order.PO.PFI.some(
          (pfi) =>
            pfi.Customer.customerCapIdNo.toString().toLowerCase() ===
            uniqueCAPIDQueue.toLowerCase()
        )) &&
      (!uniqueOrderConfirmationNoQueue ||
        order.orderConfirmationNo.toString().toLowerCase() ===
          uniqueOrderConfirmationNoQueue.toLowerCase()) &&
      (!uniqueDateQueue ||
        date(order.createdAt).toLowerCase() === uniqueDateQueue.toLowerCase())
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
        title="Confirmed CAP Orders Review"
        subTitle="Review all confirmed orders and edit, archive, delete, or extract data them through the following table."
        data={confirmedOrders}
        isLoadingState={isLoadingOrders}
        cardOneTitle="Total Orders"
        iconOne={<PackageCheck size={20} className="text-blue-700" />}
        cardOneTextLink="New Order Confirmation"
        cardOneLink="/CAP-po-review"
        cardTwoTitle="Archived Orders"
        cardTwoTextLink="Archive"
        iconTwo={<PackageX size={20} className="text-blue-700" />}
        cardTwoLink="/CAP-confirmation-archive"
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

          <div className="flex flex-col gap-3 items-start">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
                  {isCreatingInvoice ? (
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
                    "Create Invoice"
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will create Invoice for
                    this Order.
                  </AlertDialogDescription>

                  <div className="flex flex-col justify-center">
                    <input
                      placeholder="CAP Invoice Number"
                      type="number"
                      name="Cap Invoice Number"
                      value={capInvoiceData.capInvoiceNo}
                      onChange={(event) => {
                        setCAPInvoiceData((prev) => ({
                          ...prev,
                          capInvoiceNo: event.target.value,
                        }));
                      }}
                      className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                    />

                    <div>
                      <button
                        className="border px-6 py-1 shadow  rounded-md mb-2 transition-all duration-300 hover:text-blue-500"
                        type="button"
                        onClick={() => setIsSwift(!isSwift)}
                      >
                        Swift
                      </button>
                    </div>

                    <AnimatePresence>
                      {isSwift && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          style={{ overflow: "hidden" }}
                        >
                          <input
                            placeholder="Swift Number"
                            type="number"
                            name="Swift Number"
                            value={swiftData.swiftNo}
                            onChange={(event) => {
                              setSwiftData((prev) => ({
                                ...prev,
                                swiftNo: event.target.value,
                              }));
                            }}
                            className="w-full p-1 mb-4 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setSelectedRows([]);
                      setCAPInvoiceData({
                        capInvoiceNo: "",
                      });
                      setSwiftData({
                        swiftNo: "",
                      });
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <form method="post">
                    <AlertDialogAction onClick={handleCreateInvoice}>
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
                    {isArchivingOrder ? (
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
                            "https://benchmark-innovation-production.up.railway.app/api/cap-confirmation/soft",
                            setIsArchivingOrder
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
        </div>

        <AnimatePresence>
          {filterOrders && (
            <Filter
              uniqueFirstOptions={uniqueCustomerNameOptions}
              uniqueFirstQueue={uniqueCustomerNameQueue}
              setUniqueFirstQueue={setUniqueCustomerNameQueue}
              firstPlaceHolder="Customer Name"
              uniqueSecondOptions={uniqueCAPIDOptions}
              uniqueSecondQueue={uniqueCAPIDQueue}
              setUniqueSecondQueue={setUniqueCAPIDQueue}
              secondPlaceHolder="CAP ID"
              uniqueThirdOptions={uniqueOrderConfirmationNoOptions}
              uniqueThirdQueue={uniqueOrderConfirmationNoQueue}
              setUniqueThirdQueue={setUniqueOrderConfirmationNoQueue}
              ThirdPlaceHolder="Order Confirmation #"
            >
              <Select
                options={uniqueDateOptions}
                value={uniqueDateOptions.find(
                  (option) => option.value === uniqueDateQueue
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
          isLoadingState={isLoadingOrders}
          fetchedData={confirmedOrders}
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

export default CAPReview;
