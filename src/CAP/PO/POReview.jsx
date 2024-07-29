import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import {
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

export function POReview() {
  /**
   * useState hook to manage data
   * 1- createdPOs
   * 2- isLoadingCreatedPOs
   * 3- uniqueCustomerNameOptions
   * 4- uniqueCustomerNameQueue
   * 3- uniqueCAPIDOptions
   * 4- uniqueCAPIDQueue
   * 5- uniqueSERIALOptions
   * 6- uniqueSERIALQueue
   * 7- uniqueDateOptions
   * 8- uniqueDataQueue
   * ------------------------
   * 9- filterCreatedPOTable
   * 10- rowsPerPage
   * 11- currentPage
   * ---------------------
   * 12- isConfirmingCapOrder
   * 13- selectedRows
   *
   */

  const [createdPOs, setCreatedPOs] = useState([]);
  const [isLoadingCreatedPOs, setIsLoadingCreatedPOs] = useState(false);

  const [uniqueCustomerNameOptions, setUniqueCustomerNameOptions] = useState(
    []
  );
  const [uniqueCustomerNameQueue, setUniqueCustomerNameQueue] = useState("");

  const [uniqueCAPIDOptions, setUniqueCAPIDOptions] = useState([]);
  const [uniqueCAPIDQueue, setUniqueCAPIDQueue] = useState("");

  const [uniqueSERIALOptions, setUniqueSERIALOptions] = useState([]);
  const [uniqueSERIALQueue, setUniqueSERIALQueue] = useState("");

  const [uniqueDateOptions, setUniqueDateOptions] = useState([]);
  const [uniqueDataQueue, setUniqueDataQueue] = useState("");

  const [filterCreatedPOTable, setFilterCreatedPOTable] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  console.log(createdPOs);

  const [orderConfirmationData, setorderConfirmationData] = useState({
    POId: "",
    orderConfirmationNo: "",
  });

  const [isConfirmingCapOrder, setIsConfirmingCapOrder] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  /**
   * useEffect fucntions to fetch data
   * 1- fetch createdPOs
   *
   */

  useEffect(() => {
    async function fetchCreatedPOs() {
      setIsLoadingCreatedPOs(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/po"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingCreatedPOs(false);
          return;
        }

        setCreatedPOs(resData.data);

        const uniqueCustomerName = [
          ...new Set(
            resData.data.flatMap((po) =>
              po.PFI.map((pfi) => pfi.Customer.customerName)
            )
          ),
        ].map((customer) => ({
          label: customer,
          value: customer,
        }));
        setUniqueCustomerNameOptions(uniqueCustomerName);

        const uniqueCAPID = [
          ...new Set(
            resData.data.flatMap((po) =>
              po.PFI.map((pfi) => pfi.Customer.customerCapIdNo)
            )
          ),
        ].map((cap) => ({
          label: cap,
          value: cap,
        }));
        setUniqueCAPIDOptions(uniqueCAPID);

        const uniqueSERIAL = [
          ...new Set(resData.data.map((po) => po.SERIAL)),
        ].map((serial) => ({
          label: serial,
          value: serial,
        }));
        setUniqueSERIALOptions(uniqueSERIAL);

        const uniqueDates = [
          ...new Set(resData.data.map((date) => formatDate(date.createdAt))),
        ].map((date) => ({
          label: date,
          value: date,
        }));
        setUniqueDateOptions(uniqueDates);

        setIsLoadingCreatedPOs(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingCreatedPOs(false);
        return;
      }
    }
    fetchCreatedPOs();
  }, []);

  /**
   * Sendind Data to APIs
   * 1- handleConfirmCapOrder
   */

  const handleConfirmCapOrder = async () => {};

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

  function formatDate(dateString) {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  }

  const filteredPOs = createdPOs.filter(
    (po) =>
      (!uniqueCAPIDQueue ||
        po.PFI.some(
          (pfi) =>
            pfi.Customer.customerCapIdNo.toString().toLowerCase() ===
            uniqueCAPIDQueue.toString().toLowerCase()
        )) &&
      (!uniqueCustomerNameQueue ||
        po.PFI.some(
          (pfi) =>
            pfi.Customer.customerName.toLowerCase() ===
            uniqueCustomerNameQueue.toLowerCase()
        )) &&
      (!uniqueSERIALQueue ||
        po.SERIAL.toLowerCase() === uniqueSERIALQueue.toLowerCase()) &&
      (!uniqueDataQueue ||
        formatDate(po.createdAt).toLowerCase() ===
          uniqueDataQueue.toLowerCase())
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

  const Pagination = () => {
    return (
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          <p>Rows per Page:</p>
          <input
            type="number"
            value={rowsPerPage}
            onChange={handleRowsPerPage}
            className="w-12 pl-3 border-2 rounded-md"
          />
        </div>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <button
            className="px-2 py-1 rounded-md border-2 bg-[#93C572] transition-all duration-200 hover:bg-blue-600"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            <ChevronsLeft size={20} className="text-white" />
          </button>
          <button
            className="px-2 py-1 rounded-md border-2 bg-[#93C572] transition-all duration-300 hover:bg-blue-600"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            className="px-2 py-1 rounded-md border-2 bg-[#93C572] transition-all duration-300 hover:bg-blue-600"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <ChevronRight size={20} className="text-white" />
          </button>
          <button
            className="px-2 py-1 rounded-md border-2 bg-[#93C572] transition-all duration-300 hover:bg-blue-600"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            <ChevronsRight size={20} className="text-white" />
          </button>
        </div>
      </div>
    );
  };

  console.log(selectedRows);

  const handlePrintPDF = () => {
    const columns = ["Customer", "CAP ID", "Quote #", "PFI Value"];
    printPO(
      selectedRows.map((row) => ({
        Customer: row.PFI.map((pfi) => pfi.Customer.customerName),
        "CAP ID": row.PFI.map((pfi) => pfi.Customer.customerCapIdNo),
        "Quote #": row.PFI.map((pfi) => pfi.PFIValue),
        "PFI Value": row.PFI.map((pfi) => `$ ${pfi.PFIValue}`),
      })),
      columns
    );
    toast.success("POBMI-CAP-Invoice Successfully Downloaded");
    setSelectedRows([]);
  };

  return (
    <section className="bg-[#f5f5f5] flex flex-col p-10 ml-20 w-full gap-5">
      <div className="flex flex-col gap-3 md:flex-row justify-center md:justify-start items-center md:gap-12">
        <div>
          <h1 className="text-3xl text-neutral-900">Purchase Orders Review</h1>
          <p className="text-md text-neutral-500 mt-2">
            Review all created POs and edit them through the following table.
          </p>
        </div>

        <div className="bg-white p-2 border shadow-md rounded-md w-80">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <ShoppingBag size={20} className="text-blue-700" /> Total POs
          </h1>
          <div className="mb-3 text-neutral-900 font-semibold text-[28px]">
            {isLoadingCreatedPOs ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
                style={{ display: "inline-block" }}
              >
                <Loader className="text-black" />
              </motion.div>
            ) : (
              createdPOs.length
            )}
          </div>
          <Link
            to="/CAP-pfi-review"
            className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
          >
            New PO <ArrowRight size={16} className="mt-1" />
          </Link>
        </div>

        <div className="bg-white p-4 border shadow-md rounded-md w-80">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <Box size={20} className="text-blue-700" /> Orders
          </h1>
          <div className="mb-3 text-neutral-900 font-semibold text-[18px]">
            you can check all orders
          </div>
          <Link
            to="/CAP-confirmation-review"
            className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
          >
            View orders <ArrowRight size={16} className="mt-1" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col w-full my-6 bg-white border shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
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

          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex justify-center items-center gap-1 px-10 py-2 bg-neutral-800 text-white rounded-md transition-all duration-300 hover:bg-neutral-500">
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

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="px-10 py-2 bg-neutral-800 rounded-md text-white transition-all duration-300 hover:bg-neutral-500">
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
                    <div className="flex gap-2 items-center">
                      Print
                      <Printer className="text-white" size={18} />
                    </div>
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
                    <AlertDialogAction onClick={handlePrintPDF}>
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              style={{ overflow: "hidden" }}
              className="flex justify-between gap-6 mt-4"
            >
              <Select
                options={uniqueCustomerNameOptions}
                value={uniqueCustomerNameOptions.find(
                  (option) => option.value === uniqueCustomerNameQueue
                )}
                onChange={(option) => {
                  setUniqueCustomerNameQueue(option && option.value);
                }}
                isClearable
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="Customer Name"
              />
              <Select
                options={uniqueCAPIDOptions}
                value={uniqueCAPIDOptions.find(
                  (option) => option.value === uniqueCAPIDQueue
                )}
                onChange={(option) => {
                  setUniqueCAPIDQueue(option && option.value);
                }}
                isClearable
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="CAP - ID"
              />
              <Select
                options={uniqueDateOptions}
                value={uniqueDateOptions.find(
                  (option) => option.value === uniqueDataQueue
                )}
                onChange={(option) => {
                  setUniqueDataQueue(option && option.value);
                }}
                isClearable
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="Item Name"
              />
              <Select
                options={uniqueSERIALOptions}
                value={uniqueSERIALOptions.find(
                  (option) => option.value === uniqueSERIALQueue
                )}
                onChange={(option) => {
                  setUniqueSERIALQueue(option && option.value);
                }}
                isClearable
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="PFI - Serial"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoadingCreatedPOs ? (
          <h1 className="text-center text-[24px] mt-8 flex items-center gap-2 justify-center">
            Please Wait Requested PFIs Are Loading
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear",
              }}
              style={{ display: "inline-block" }}
            >
              <Loader className="text-black" />
            </motion.div>
          </h1>
        ) : createdPOs.length <= 0 ? (
          <h1 className="text-center text-[24px] mt-8">NO POs FOUND.</h1>
        ) : (
          <table className="min-w-full divide-y divide-neutral-900 mt-2">
            <thead className="bg-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  POs
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Customer Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  CAP - Id
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Serial
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-800">
              {currentData.map((po, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-150 hover:bg-gray-100 ${
                    selectedRows.includes(po) ? "bg-neutral-300" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={(event) => handleCheckboxChange(event, po)}
                        checked={selectedRows.includes(po)}
                        className="sr-only"
                      />
                      <div className="w-6 h-6 bg-white border rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 checked:bg-blue-600 checked:border-blue-600 hover:bg-blue-100 hover:border-blue-300">
                        {selectedRows.includes(po) && (
                          <svg
                            className="w-4 h-4 text-black"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </label>
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {po.PFI.length > 1
                      ? po.PFI.map((pfi) => pfi.Customer.customerName).join(
                          ", "
                        )
                      : po.PFI.map((pfi) => pfi.Customer.customerName)}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {po.PFI.length > 1
                      ? po.PFI.map((pfi) => pfi.Customer.customerCapIdNo).join(
                          ", "
                        )
                      : po.PFI.map((pfi) => pfi.Customer.customerCapIdNo)}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {po.SERIAL}
                  </td>
                  <td className="px-4 py-6 whitespace-normal text-sm font-medium text-gray-900">
                    {formatDate(po.createdAt)}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button>
                            <Trash size={18} className="text-red-500" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will archive
                              this PFI and store its data in the archive table.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <form method="delete">
                              <AlertDialogAction>
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
                                  "Archive"
                                )}
                              </AlertDialogAction>
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button>
                            <Edit size={18} className="text-blue-500" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will archive
                              this PFI and store its data in the archive table.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <form method="delete">
                              <AlertDialogAction>
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
                                  "Archive"
                                )}
                              </AlertDialogAction>
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-3 item-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="px-5 py-2 bg-[#acd491] rounded-md text-white transition-all duration-300 hover:bg-blue-500">
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
                  <AlertDialogCancel onClick={() => setSelectedRows([])}>
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

            <button className="px-5 py-2 bg-[#183902] rounded-md text-white transition-all duration-300 hover:bg-blue-500">
              Archive
            </button>
            <button className="px-5 py-2 bg-[#93C572] rounded-md text-white transition-all duration-300 hover:bg-blue-500">
              Delete
            </button>
          </div>

          <Pagination />
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
