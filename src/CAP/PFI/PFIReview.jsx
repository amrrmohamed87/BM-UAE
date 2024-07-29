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
  ListChecks,
  Loader,
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

export function PFIReview() {
  /**
   * useState hook to manage data
   * 1- requestedPFIs
   * 2- isLoadingRequestedPFIs
   * 3- uniqueCAPIDOptions
   * 4- uniqueCAPIDQueue
   * 5- uniqueSERIALOptions
   * 6- uniqueSERIALQueue
   * 7- uniqueItemsOptions
   * 8- uniqueItemsQueue
   * ------------------------
   * 9- filterRequestedPFITable
   * 10- rowsPerPage
   * 11- currentPage
   * ------------------------
   * 12- pfiRequestId
   * 13- isDeletingPFIRequest
   * -------------------------
   * 14- isLoadingSinglePFI
   * 15- pfiData
   * 16- reloadTable
   */

  const [requestedPFIs, setRequestedPFIs] = useState([]);
  const [isLoadingRequestedPFIs, setIsLoadingRequestedPFIs] = useState(false);

  const [uniqueCAPIDOptions, setUniqueCAPIDOptions] = useState([]);
  const [uniqueCAPIDQueue, setUniqueCAPIDQueue] = useState("");

  const [uniquePFINoOptions, setUniquePFINoOptions] = useState([]);
  const [uniquePFINoQueue, setUniquePFINoQueue] = useState("");

  const [uniqueSERIALOptions, setUniqueSERIALOptions] = useState([]);
  const [uniqueSERIALQueue, setUniqueSERIALQueue] = useState("");

  const [uniqueItemsOptions, setUniqueItemsOptions] = useState([]);
  const [uniqueItemsQueue, setUniqueItemsQueue] = useState("");

  const [filterRequestedPFITable, setFilterRequestedPFITable] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const [pfiRequestId, setPFIRequestId] = useState({
    id: "",
  });
  const [isArchivingPFIRequest, setIsArchivingPFIRequest] = useState(false);

  const [pfiData, setPFIDate] = useState([]);
  const [isLoadingSinglePFI, setIsLoadingSinglePFI] = useState(false);

  const [reloadTable, setIsReloadTable] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const [isUpdatingPFI, setIsUpdatingPFI] = useState(false);

  const [isCreatingPO, setIsCreatingPO] = useState(false);

  /**
   * useEffect fucntions to fetch data
   * 1- fetch requestesPFIs
   * 2- fetch pfiData
   */

  useEffect(() => {
    async function fetchRequestedPFIs() {
      setIsLoadingRequestedPFIs(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/pfi"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingRequestedPFIs(false);
          return;
        }

        setRequestedPFIs(resData.data);

        const uniqueCAPID = [
          ...new Set(resData.data.map((cap) => cap.Customer.customerCapIdNo)),
        ].map((cap) => ({
          label: cap,
          value: cap,
        }));
        setUniqueCAPIDOptions(uniqueCAPID);

        const uniquePFINo = [
          ...new Set(resData.data.map((pfi) => pfi.PFINo)),
        ].map((PFINo) => ({
          label: PFINo,
          value: PFINo,
        }));
        setUniquePFINoOptions(uniquePFINo);

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

        setIsLoadingRequestedPFIs(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingRequestedPFIs(false);
        return;
      }
    }
    fetchRequestedPFIs();
  }, [reloadTable]);

  useEffect(() => {
    async function loadPFIDate() {
      setIsLoadingSinglePFI(true);

      try {
        const response = await fetch(
          `https://benchmark-innovation-production.up.railway.app/api/pfi/${pfiRequestId.id}`
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingSinglePFI(false);
          return;
        }

        setPFIDate(resData);
        setIsLoadingSinglePFI(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingSinglePFI(false);
        return;
      }
    }
    if (pfiRequestId.id) {
      loadPFIDate();
    }
  }, [pfiRequestId]);

  /**
   * Function to Deal with APIs
   * 1- handleSoftDeleteRequestedPFI
   * 2- handleUpdatePFI
   * 3- handleCreatePO
   */

  //console.log(requestedPFIs);

  const handleSoftDeleteRequestedPFI = async () => {
    setIsArchivingPFIRequest(true);

    const pfiIds = {
      ids: selectedRows.map((row) => row.id),
    };
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
        setIsArchivingPFIRequest(false);
        return;
      }

      toast.success("PFI Archived Successfully");

      setSelectedRows([]);
      setIsReloadTable(!reloadTable);
      setIsArchivingPFIRequest(false);
    } catch (error) {
      toast.error(error.message);
      setIsArchivingPFIRequest(false);
      return;
    }
  };

  const handleUpdatePFI = async (event) => {
    event.preventDefault();
    setIsUpdatingPFI(true);

    const updatedData = {
      ...pfiData,
    };

    console.log(updatedData);
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
      setPFIRequestId({
        id: "",
      });
      setPFIDate([]);
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
      (!uniqueSERIALQueue ||
        pfi.SERIAL.toLowerCase() === uniqueSERIALQueue.toLowerCase()) &&
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

  const formateDateToUpdateInfo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
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
            className="w-10 pl-3 border rounded-md shadow"
          />
        </div>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <button
            className="px-2 py-1 rounded-md cursor-pointer border-2 bg-blue-500 transition-all duration-200 hover:bg-blue-900"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            <ChevronsLeft size={20} className="text-white" />
          </button>
          <button
            className="px-2 py-1 rounded-md cursor-pointer border-2 bg-blue-500 transition-all duration-300 hover:bg-blue-900"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            className="px-2 py-1 rounded-md cursor-pointer border-2 bg-blue-500 transition-all duration-300 hover:bg-blue-900"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <ChevronRight size={20} className="text-white" />
          </button>
          <button
            className="px-2 py-1 rounded-md cursor-pointer border-2 bg-blue-500 transition-all duration-300 hover:bg-blue-900"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            <ChevronsRight size={20} className="text-white" />
          </button>
        </div>
      </div>
    );
  };

  console.log(requestedPFIs);

  return (
    <section className="bg-[#F8F9FA] flex flex-col p-10 ml-20 w-full gap-5">
      <div className="flex flex-col gap-3 md:flex-row justify-center md:justify-start items-center md:gap-16">
        <div className="flex flex-col items-start w-full">
          <h1 className="text-3xl text-neutral-900">Proforma Review</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Review all requested PFIs and edit them through the following table.
          </p>
        </div>

        <div className="bg-white p-2 border shadow-md rounded-md w-full">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <ShoppingBag size={20} className="text-blue-700" /> Total Requests
          </h1>
          <div className="mb-3 text-neutral-900 font-semibold text-[28px]">
            {isLoadingRequestedPFIs ? (
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
              requestedPFIs.length
            )}
          </div>
          <Link
            to="/CAP-pfi-request"
            className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
          >
            New Request <ArrowRight size={16} className="mt-1" />
          </Link>
        </div>

        <div className="bg-white p-4 border shadow-md rounded-md w-full">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <ArchiveRestore size={20} className="text-blue-700" /> Archive
          </h1>
          <div className="mb-3 text-neutral-900 font-semibold text-[18px]">
            Archived PFIs Table
          </div>
          <Link
            to="/CAP-pfi-archive"
            className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
          >
            Archive <ArrowRight size={16} className="mt-1" />
          </Link>
        </div>

        <div className="bg-white p-4 border shadow-md rounded-md w-full">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <Box size={20} className="text-blue-700" /> PO
          </h1>
          <div className="mb-3 text-neutral-900 font-semibold text-[18px]">
            PO Table Data
          </div>
          <Link
            to="/CAP-po-review"
            className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
          >
            View <ArrowRight size={16} className="mt-1" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col w-full my-6 bg-white border shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col gap-4 items-start">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex justify-center items-center gap-1 px-10 py-2 bg-blue-500 text-white rounded-md transition-all duration-300 hover:bg-blue-900">
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
                    onClick={handleExportRequestedPFIToExcel}
                    className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-emerald-700 text-white rounded-md transition-all duration-300 hover:bg-emerald-900"
                  >
                    Excel
                  </button>
                  <button
                    onClick={handleExportRequestedPFIToPDF}
                    className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-red-700 text-white rounded-md transition-all duration-300 hover:bg-red-900"
                  >
                    PDF
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <button
              onClick={() => {
                setFilterRequestedPFITable(!filterRequestedPFITable);
              }}
              className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-blue-500 text-white rounded-md transition-all duration-300 hover:bg-blue-900"
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
                <button className="w-full py-2 bg-blue-500 rounded-md text-white transition-all duration-300 hover:bg-blue-900">
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
                  <button className="px-7 py-2 bg-blue-500 rounded-md text-white transition-all duration-300 hover:bg-blue-900">
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
                      <AlertDialogAction onClick={handleSoftDeleteRequestedPFI}>
                        Confirm
                      </AlertDialogAction>
                    </form>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="px-8 py-2 bg-blue-500 rounded-md text-white transition-all duration-300 hover:bg-blue-900">
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
                      <AlertDialogAction onClick={handleSoftDeleteRequestedPFI}>
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
                options={uniquePFINoOptions}
                value={uniquePFINoOptions.find(
                  (option) => option.value === uniquePFINoQueue
                )}
                onChange={(option) => {
                  setUniquePFINoQueue(option && option.value);
                }}
                isClearable
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="Quote #"
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
              {/*  <Select
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
              /> */}
            </motion.div>
          )}
        </AnimatePresence>

        {isLoadingRequestedPFIs ? (
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
        ) : requestedPFIs.length <= 0 ? (
          <h1 className="text-center text-[24px] mt-8">NO PFIs FOUND.</h1>
        ) : (
          <table className="min-w-full divide-y divide-neutral-400 mt-2">
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
                  Quote #
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
                <th
                  scope="col"
                  className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-400">
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
                      <div
                        className={`w-6 h-6 ${
                          selectedRows.includes(pfi)
                            ? "bg-blue-900"
                            : "bg-white"
                        } border rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 checked:bg-blue-600 checked:border-blue-600 hover:bg-blue-100 hover:border-blue-300`}
                      >
                        {selectedRows.includes(pfi) && (
                          <svg
                            className="w-4 h-4 text-white"
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
                    {pfi.PFINo}
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
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() =>
                              setPFIRequestId({
                                id: pfi.id,
                              })
                            }
                          >
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
                            <AlertDialogCancel
                              onClick={() =>
                                setPFIRequestId({
                                  id: "",
                                })
                              }
                            >
                              Cancel
                            </AlertDialogCancel>
                            <form method="delete">
                              <AlertDialogAction
                                disabled={isArchivingPFIRequest}
                                onClick={handleSoftDeleteRequestedPFI}
                              >
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
                              </AlertDialogAction>
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Dialog
                        onClose={() => {
                          setPFIRequestId({
                            id: "",
                          });
                        }}
                      >
                        <DialogTrigger asChild>
                          <button
                            onClick={() => {
                              setPFIRequestId({
                                id: pfi.id,
                              });
                            }}
                          >
                            <ListChecks size={18} className="text-blue-500" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[900px]">
                          <DialogHeader>
                            <DialogTitle>Edit PFI</DialogTitle>
                            <DialogDescription>
                              Make changes to your Request here. Click save when
                              you're done.
                            </DialogDescription>
                          </DialogHeader>
                          {isLoadingSinglePFI ? (
                            <div className="flex justify-center items-center py-10">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1,
                                  ease: "linear",
                                }}
                                style={{ display: "inline-block" }}
                              >
                                <Loader className="text-black" size={24} />
                              </motion.div>
                            </div>
                          ) : (
                            pfiData && (
                              <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
                                <input
                                  placeholder="PFI - Number"
                                  type="number"
                                  name="PFINo"
                                  value={pfiData.PFINo || ""}
                                  className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                                  onChange={(e) =>
                                    setPFIDate({
                                      ...pfiData,
                                      PFINo: e.target.value,
                                    })
                                  }
                                />
                                <div>
                                  {pfiData.PFIItems && (
                                    <div className="grid grid-cols-2 gap-8 place-content-center">
                                      {pfiData.PFIItems.map((item, index) => (
                                        <div
                                          key={index}
                                          className=" bg-neutral-100 shadow border p-3 rounded-md"
                                        >
                                          <h1 className="text-center mb-2">
                                            {item.Items.itemName}
                                          </h1>
                                          <div className="flex flex-col gap-1 items-start">
                                            <label htmlFor="SHPFees">
                                              SHipping Fees
                                            </label>
                                            <input
                                              id="SHPFees"
                                              placeholder="Shipping Fees"
                                              type="number"
                                              name="SHPFees"
                                              value={item.SHPFees || "0"}
                                              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                                              onChange={(e) => {
                                                const newPFIItems = [
                                                  ...pfiData.PFIItems,
                                                ];
                                                newPFIItems[index].SHPFees =
                                                  parseInt(e.target.value, 10);
                                                setPFIDate({
                                                  ...pfiData,
                                                  PFIItems: newPFIItems,
                                                });
                                              }}
                                            />
                                          </div>
                                          <div className="flex flex-col gap-1 items-start">
                                            <label htmlFor="price">Price</label>
                                            <input
                                              id="price"
                                              placeholder="Price"
                                              type="number"
                                              name="price"
                                              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                                              value={item.price || ""}
                                              onChange={(e) => {
                                                const newPFIItems = [
                                                  ...pfiData.PFIItems,
                                                ];
                                                newPFIItems[index].price =
                                                  parseInt(e.target.value, 10);
                                                setPFIDate({
                                                  ...pfiData,
                                                  PFIItems: newPFIItems,
                                                });
                                              }}
                                            />
                                          </div>
                                        </div>
                                      ))}{" "}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}

                          <DialogFooter>
                            <form method="patch">
                              <button
                                disabled={isUpdatingPFI}
                                onClick={handleUpdatePFI}
                                className="px-5 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500"
                              >
                                {isUpdatingPFI ? (
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
                                  "Save Changes"
                                )}
                              </button>
                            </form>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

export default PFIReview;
