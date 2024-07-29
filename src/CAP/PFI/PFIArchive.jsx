import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
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

export function PFIArchive() {
  /**
   * useState hook to manage data
   * 1- archive data
   * 2- isLoadingArchivedData
   * 3- uniqueCAPIDOptions
   * 4- uniqueSERIALOptions
   * 5- uniqueItemsOptions
   */

  const [archivePFI, setArchivePFI] = useState([]);
  const [isLoadingArchivePFI, setIsLoadingArchivePFI] = useState(false);

  const [uniqueCAPIDOptions, setUniqueCAPIDOptions] = useState([]);
  const [uniqueCAPIDQueue, setUniqueCAPIDQueue] = useState("");

  const [uniqueSERIALOptions, setUniqueSERIALOptions] = useState([]);
  const [uniqueSERIALQueue, setUniqueSERIALQueue] = useState("");

  const [uniqueItemsOptions, setUniqueItemsOptions] = useState([]);
  const [uniqueItemsQueue, setUniqueItemsQueue] = useState("");

  const [filterArchivedPFITable, setFilterArchivedPFITable] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRows, setSelectedRows] = useState([]);

  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const [reloadTable, setReloadTable] = useState(false);

  const [isDeletingPFIs, setIsDeletingPFIs] = useState(false);
  const [isRestoringPFIs, setIsRestoringPFIs] = useState(false);

  /**
   * useEffect hook to load the data one time only
   * 1- Fetch Archived Items
   */

  useEffect(() => {
    async function loadArchivePFI() {
      setIsLoadingArchivePFI(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/pfi/archive"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingArchivePFI(false);
          return;
        }

        setArchivePFI(resData.data);

        const uniqueCAPID = [
          ...new Set(resData.data.map((cap) => cap.Customer.customerCapIdNo)),
        ].map((cap) => ({
          label: cap,
          value: cap,
        }));
        setUniqueCAPIDOptions(uniqueCAPID);

        const uniqueSERIAL = [
          ...new Set(resData.data.map((serial) => serial.SERIAL)),
        ].map((serial) => ({
          label: serial,
          value: serial,
        }));
        setUniqueSERIALOptions(uniqueSERIAL);

        const uniqueItems = [
          ...new Set(
            resData.data.flatMap((item) =>
              item.PFIItems.map((itemName) => itemName.Items.itemName)
            )
          ),
        ].map((items) => ({
          label: items,
          value: items,
        }));
        setUniqueItemsOptions(uniqueItems);

        setIsLoadingArchivePFI(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingArchivePFI(false);
        return;
      }
    }
    loadArchivePFI();
  }, [reloadTable]);

  /**
   * Send Data to APIs
   */

  const handleRestorePFIs = async () => {
    setIsRestoringPFIs(true);

    const pfiIds = { ids: selectedRows.map((row) => row.id) };

    console.log(pfiIds);

    try {
      const response = await fetch(
        "https://benchmark-innovation-production.up.railway.app/api/pfi/soft",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pfiIds),
        }
      );

      const resData = await response.json();

      console.log(resData.message);
      if (!response.ok) {
        toast.error(resData.message);
        setIsRestoringPFIs(false);
        return;
      }

      toast.success("Restored Successfully");

      setSelectedRows([]);
      setIsRestoringPFIs(false);
      setReloadTable(!reloadTable);
    } catch (error) {
      toast.error(error.message);
      setIsRestoringPFIs(false);
      return;
    }
  };
  const handleDeletingPFIs = async () => {};

  /**
   * Functions and variables
   * 1- filteredPFIs
   * 2- totalPages
   * 3- currentData
   */

  const filteredPFIs = archivePFI.filter(
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
      (!uniqueSERIALQueue ||
        pfi.SERIAL.toLowerCase() === uniqueSERIALQueue.toLowerCase())
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

  function handleRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  }

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

  console.log(archivePFI);

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
            className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-200 hover:bg-blue-600"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            <ChevronsLeft size={20} className="text-white" />
          </button>
          <button
            className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <ChevronRight size={20} className="text-white" />
          </button>
          <button
            className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            <ChevronsRight size={20} className="text-white" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[#F5F5F5] flex flex-col p-10 ml-20 w-full gap-5">
      <div className="flex flex-col gap-3 md:flex-row justify-center md:justify-start items-center md:gap-12">
        <div>
          <h1 className="text-3xl text-neutral-900">Archived Proformas</h1>
          <p className="text-md text-neutral-500 mt-2">
            Review all archived PFIs and restore or delete them through the
            following table.
          </p>
        </div>

        <div className="bg-white p-2 border shadow-md rounded-md w-80">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <ShoppingBag size={20} className="text-blue-700" /> Total Requests
          </h1>
          <div className="mb-3 text-neutral-900 font-semibold text-[28px]">
            {isLoadingArchivePFI ? (
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
              archivePFI.length
            )}
          </div>
          <Link
            to="/CAP-pfi-review"
            className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
          >
            Review PFIs <ArrowRight size={16} className="mt-1" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col w-full my-6 bg-white border shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              setFilterArchivedPFITable(!filterArchivedPFITable);
            }}
            className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
          >
            Filter
            <motion.span
              animate={{ rotate: filterArchivedPFITable ? -180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <ChevronDown size={20} />
            </motion.span>
          </button>

          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex justify-center items-center gap-1 px-10 py-2 bg-green-500 text-white rounded-md transition-all duration-300 hover:bg-green-900">
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
        </div>

        <AnimatePresence>
          {filterArchivedPFITable && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              style={{ overflow: "hidden" }}
              className="flex justify-between gap-6 mt-4"
            >
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
                options={uniqueItemsOptions}
                value={uniqueItemsOptions.find(
                  (option) => option.value === uniqueItemsQueue
                )}
                onChange={(option) => {
                  setUniqueItemsQueue(option && option.value);
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

        {isLoadingArchivePFI ? (
          <h1 className="text-center text-[24px] mt-8 flex items-center gap-2 justify-center">
            Please Wait Archived PFIs Are Loading
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
        ) : archivePFI.length <= 0 ? (
          <h1 className="text-center text-[24px] mt-8">NO PFIs FOUND.</h1>
        ) : (
          <table className="min-w-full divide-y divide-neutral-900 mt-2">
            <thead className="bg-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  PFIs
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
                  Item
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Unit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  SHPDate
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  QTY
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  SHP - Fees
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  PFI - Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-800">
              {currentData.map((pfi, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-150 hover:bg-gray-100 ${
                    selectedRows.includes(pfi) ? "bg-neutral-300" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={(event) => handleCheckboxChange(event, pfi)}
                        checked={selectedRows.includes(pfi)}
                        className="sr-only"
                      />
                      <div className="w-6 h-6 bg-white border rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 checked:bg-blue-600 checked:border-blue-600 hover:bg-blue-100 hover:border-blue-300">
                        {selectedRows.includes(pfi) && (
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
                    {pfi.Customer.customerCapIdNo}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {pfi.SERIAL}
                  </td>
                  <td className="px-4 py-6 whitespace-normal text-sm font-medium text-gray-900">
                    <ul className="list-decimal pl-5">
                      {pfi.PFIItems.map((item, index) => (
                        <li key={index}>{item.Items.itemName}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    <ol className="list-decimal pl-5">
                      {pfi.PFIItems.map((item, index) =>
                        item.program.length > 0 ? (
                          <li key={`program-${index}`}>Program</li>
                        ) : item.unit.length > 0 ? (
                          item.unit.map((u, idx) => (
                            <li key={`unit-${index}-${idx}`}>{u.label}</li>
                          ))
                        ) : (
                          <li key={`empty-${index}`}>No Data</li>
                        )
                      )}
                    </ol>
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {pfi.PFIItems.map((item, index) =>
                      item.program.length > 0 ? (
                        item.program.map((p, idx) => (
                          <div key={`date-prog-${index}-${idx}`}>
                            {formateDate(p.SHPDate)}
                          </div>
                        ))
                      ) : item.unit.length > 0 ? (
                        item.unit.map((u, idx) => (
                          <div key={`date-unit-${index}-${idx}`}>
                            {formateDate(u.SHPDate)}
                          </div>
                        ))
                      ) : (
                        <div key={`date-empty-${index}`}>No Date</div>
                      )
                    )}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {pfi.PFIItems.map((item) => item.quantity).join(", ")}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {pfi.PFIItems.map((item, index) => (
                      <ul key={index}>
                        <li>{`$ ${item.SHPFees}`}</li>
                      </ul>
                    ))}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {pfi.PFIItems.map((item, index) => (
                      <ul key={index}>
                        <li>{`$ ${item.price}`}</li>
                      </ul>
                    ))}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {pfi.PFIItems.map((item, index) => (
                      <ul key={index}>
                        <li>{`$ ${item.total}`}</li>
                      </ul>
                    ))}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {`$ ${pfi.PFIValue}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="px-5 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
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
                    <AlertDialogAction onClick={handleRestorePFIs}>
                      Confirm
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="px-5 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
                  {isDeletingPFIs ? (
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
                  <form method="post">
                    <AlertDialogAction onClick={handleDeletingPFIs}>
                      Confirm
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

export default PFIArchive;
