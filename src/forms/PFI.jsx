import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../CSS/Select.css";

import { exportToPDF, exportToExcel } from "@/utils/ExcelPDF";

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

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader,
  Pen,
  Trash,
  ExternalLink,
  FileInput,
  Users,
  ArrowRight,
  Box,
  Download,
} from "lucide-react";

export function PFI() {
  /**
   * useState hook to manage and update data
   * 1- customersList, isLoadingCustomersList
   * ---------------------------
   * 2- selectedQTYPFIRequest
   * 3- selectedCustomerCode
   * 4- items
   * 5- isLoadingItems
   * 6- itemDescAndCodeOptions
   * 7- selecteditem
   * 8- itemId
   * 9- cyclesPerItem
   * 10- isLoadingCyclesPerItem
   * 11- cyclesOptions
   * 12- selectedCycles
   * 13- requestPFIForm
   * 14- isRequesttingPFI
   * ---------------------------
   * 15- requestedPFI
   * 16- isLoadingRequestedPFI
   * 17- uniqueCustomerCodeOptions
   * 18- customerCodeQueue
   * 19- uniqueItemOptions
   * 20- itemQueue
   * 21- uniquePFIIDOptions
   * 22- pfiIdQueue
   * 23- rowsPerRequestedPFIPage
   * 24- currentRequestedPFIPage
   * ----------------------------
   * 25- pfiId
   * 26- isDeletingPFIRequest
   * 27- updateRequestedPFIInfo
   * 28- isLoadingRequestedPFIInfo
   * 29- reloadRequestedPFITable
   * 30 - requestTableFilter
   * ----------------------------
   * 31- isLoadingSinglePFI
   * 32- updatedPFIData
   *
   */

  const [customersList, setCustomersList] = useState([]);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  const customerCodeOptions = customersList.map((code) => ({
    label: code.customerCode,
    value: code.id,
  }));
  const [selectedCustomerCode, setSelectedCustomerCode] = useState(null);

  const [items, setItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const itemDescAndCodeOptions = items.map((item) => ({
    label: item.itemName,
    value: item.id,
  }));
  const [selectedItem, setSelectedItem] = useState(null);

  const [itemId, setItemId] = useState({
    id: "",
  });
  const [cyclesPerItem, setCyclesPerItem] = useState([]);
  const [isLoadingCyclesPerItem, setIsLoadingCyclesPerItem] = useState(false);
  const cyclesOptions = cyclesPerItem.map((c) => ({
    label: c.label,
    value: c.SHPDate,
  }));
  const [selectedCycles, setSelectedCycles] = useState([]);

  const [requestPFIForm, setRequestPFIForm] = useState({
    customerId: "",
    itemId: "",
    QTY: "",
    noOfCycles: [{ label: "", SHPDate: "" }],
  });
  const [isRequesttingPFI, setIsrequesttingPFI] = useState(false);

  const [requestedPFI, setRequestedPFI] = useState([]);
  const [isLoadingRequestedPFI, setIsLoadingRequestedPFI] = useState(false);

  const [uniqueCustomerCodeOptions, setUniqueCustomerCodeOptions] = useState(
    []
  );
  const [customerCodeQueue, setCustomerCodeQueue] = useState("");

  const [uniqueItemOptions, setUniqueItemOptions] = useState([]);
  const [itemQueue, setItemQueue] = useState("");

  const [uniquePFISerialOptions, setUniquePFISerialOptions] = useState([]);
  const [pfiSerialQueue, setPFISerialQueue] = useState("");

  const [rowsPerRequestedPFIPage, setRowsPerRequestedPFIPage] = useState(4);
  const [currentRequestedPFIPage, setCurrentRequestedPFIPage] = useState(1);

  const [requestTableFilter, setRequestTableFilter] = useState(false);

  const [pfiId, setPFIId] = useState({
    id: "",
  });
  const [isDeletingPFIRequest, setIsDeletingPFIRequest] = useState(false);

  const [reloadRequestedPFITable, setReloadRequestedPFITable] = useState(false);
  const [updatedPFIData, setUpdatedPFIData] = useState({
    customerId: "",
    itemId: "",
    QTY: "",
    noOfCycles: [
      {
        label: "",
        SHPDate: "",
      },
    ],
  });

  const [isLoadingSinglePFI, setIsLoadingSinglePFI] = useState(false);

  /**
   * useEffect functions to Fetch Data
   * 1- Fetch Customers
   * 2- Fetch items
   * 3- Fetch cyclesPerItem
   * 4- Fetch requestedPFI
   * 5- Fetch singlePFI
   */

  useEffect(() => {
    async function fetchCustomers() {
      setIsLoadingCustomer(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/customer"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingCustomer(false);
          return;
        }

        setCustomersList(resData.data);
        setIsLoadingCustomer(false);
      } catch (error) {
        toast.error("Catch Block error");
        setIsLoadingCustomer(false);
        return;
      }
    }
    fetchCustomers();
  }, []);

  useEffect(() => {
    async function loadItems() {
      setIsLoadingItems(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/items"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingItems(false);
          return;
        }

        setItems(resData.data);
        setIsLoadingItems(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingItems(false);
        return;
      }
    }
    loadItems();
  }, []);

  useEffect(() => {
    async function loadCyclesPerItem() {
      setIsLoadingCyclesPerItem(true);

      try {
        const response = await fetch(
          `https://benchmark-innovation-production.up.railway.app/api/items/${itemId.id}`
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingCyclesPerItem(false);
          return;
        }

        setCyclesPerItem(resData.Cycles);
        setIsLoadingCyclesPerItem(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingCyclesPerItem(false);
        return;
      }
    }

    if (itemId.id) {
      loadCyclesPerItem();
    }
  }, [itemId]);

  useEffect(() => {
    async function loadRequestedPFI() {
      setIsLoadingRequestedPFI(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/pfi"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingRequestedPFI(false);
          return;
        }

        setRequestedPFI(resData.data);

        const uniqueCustomers = [
          ...new Set(
            resData.data.map((customer) => customer.Customer.customerCode)
          ),
        ].map((customer) => ({
          label: customer,
          value: customer,
        }));
        setUniqueCustomerCodeOptions(uniqueCustomers);

        const uniqueItems = [
          ...new Set(resData.data.map((item) => item.Items.itemName)),
        ].map((item) => ({
          label: item,
          value: item,
        }));
        setUniqueItemOptions(uniqueItems);

        const uniquePFISerial = [
          ...new Set(resData.data.map((pfi) => pfi.SERIAL)),
        ].map((serial) => ({
          label: serial,
          value: serial,
        }));
        setUniquePFISerialOptions(uniquePFISerial);

        setIsLoadingRequestedPFI(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingRequestedPFI(false);
        return;
      }
    }
    loadRequestedPFI();
  }, [reloadRequestedPFITable]);

  useEffect(() => {
    async function loadSinglePFI() {
      if (!pfiId.id) return;
      setIsLoadingSinglePFI(true);

      try {
        const response = await fetch(
          `https://benchmark-innovation-production.up.railway.app/api/pfi/${pfiId.id}`
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingSinglePFI(false);
          return;
        }

        setUpdatedPFIData({
          customerId: resData.Customer.customerCode,
          itemId: resData.Items.itemName,
          QTY: resData.QTY,
          noOfCycles: resData.noOfCycle.map((cycle) => ({
            label: cycle.label,
            value: cycle.SHPDate,
          })),
        });

        setIsLoadingSinglePFI(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingSinglePFI(false);
        return;
      }
    }
    loadSinglePFI();
  }, [pfiId]);

  /**
   * Handle onChange function to update state values
   * 1- Request PFI Form
   * 2- RowsPerRequestedPFI
   * 3- handleUpdatePFI
   */

  function handleRequestPFIChange(event) {
    const { name, value } = event.target;
    setRequestPFIForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleRowsPerRequestedPFI(event) {
    setRowsPerRequestedPFIPage(event.target.value);
    setCurrentRequestedPFIPage(1);
  }

  function handleUpdatedPFI(event) {
    const { name, value } = event.target;
    setUpdatedPFIData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Sending Data to API
   * 1- requestPFI
   * 2- deleteRequestedPFI
   */

  const handleRequestPFI = async (event) => {
    event.preventDefault();
    setIsrequesttingPFI(true);

    const finalData = {
      ...requestPFIForm,
      QTY: parseInt(requestPFIForm.QTY, 10),
    };

    console.log(finalData);

    const response = await fetch(
      "https://benchmark-innovation-production.up.railway.app/api/pfi",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      }
    );

    const resData = await response.json();

    if (!response.ok) {
      toast.error(resData.message);
      setIsrequesttingPFI(false);
      return;
    }

    toast.success("PFI Requested Successfully");

    setRequestPFIForm({
      customerId: "",
      itemId: "",
      QTY: "",
      noOfCycle: [],
    });
    setSelectedCycles([]);
    setSelectedCustomerCode(null);
    setSelectedItem(null);

    setIsrequesttingPFI(false);
    setReloadRequestedPFITable(!reloadRequestedPFITable);
    try {
    } catch (error) {
      toast.error(error.message);
      setIsrequesttingPFI(false);
      return;
    }
  };

  const handleDeleteRequestedPFI = async () => {
    setIsDeletingPFIRequest(true);

    try {
      const response = await fetch(
        `https://benchmark-innovation-production.up.railway.app/api/pfi/${pfiId.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application.json",
          },
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.message);
        setIsDeletingPFIRequest(false);
        return;
      }

      toast.success("PFI Request Deleted Successfully");

      setPFIId({ id: "" });
      setIsDeletingPFIRequest(false);
      setReloadRequestedPFITable(!reloadRequestedPFITable);
    } catch (error) {
      toast.error(error.message);
      setIsDeletingPFIRequest(false);
      return;
    }
  };

  /**
   * Functions
   * 1- filterRequestedPFIData
   * 2- totalRequestedPFIPages
   * 3- currentRequestedPFIData
   * 4- formateDate
   */

  const filterRequestedPFIData = requestedPFI.filter(
    (pfi) =>
      (!customerCodeQueue ||
        pfi.Customer.customerCode.toLowerCase() ===
          customerCodeQueue.toLowerCase()) &&
      (!itemQueue ||
        pfi.Items.itemName.toLowerCase() === itemQueue.toLowerCase()) &&
      (!pfiSerialQueue ||
        pfi.SERIAL.toLowerCase() === pfiSerialQueue.toLowerCase())
  );

  const totalRequestedPFIPages = Math.ceil(
    filterRequestedPFIData.length / rowsPerRequestedPFIPage
  );

  const currentRequestedPFIData = filterRequestedPFIData.slice(
    (currentRequestedPFIPage - 1) * rowsPerRequestedPFIPage,
    currentRequestedPFIPage * rowsPerRequestedPFIPage
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
   * Functional Components
   * 1- RequestedPFIPagination
   */

  const RequestedPFIPagination = () => (
    <div className="flex justify-end items-center gap-6 mt-6">
      <p>
        Rows per Page{" "}
        <input
          type="number"
          value={rowsPerRequestedPFIPage}
          onChange={handleRowsPerRequestedPFI}
          className="w-12 pl-3 border-2 rounded-md"
        />
      </p>
      <p>
        page {currentRequestedPFIPage} of {totalRequestedPFIPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-200 hover:bg-blue-600"
          onClick={() => {
            setCurrentRequestedPFIPage(1);
          }}
        >
          <ChevronsLeft size={20} className="text-white" />
        </button>
        <button
          disabled={currentRequestedPFIPage === 1}
          onClick={() => setCurrentRequestedPFIPage((prev) => prev - 1)}
          className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button
          disabled={currentRequestedPFIPage === totalRequestedPFIPages}
          onClick={() => setCurrentRequestedPFIPage((prev) => prev + 1)}
          className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
        >
          <ChevronRight size={20} className="text-white" />
        </button>
        <button
          className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
          onClick={() => {
            setCurrentRequestedPFIPage(totalRequestedPFIPages);
          }}
        >
          <ChevronsRight size={20} className="text-white" />
        </button>
      </div>
    </div>
  );

  /**
   * Animations
   * 1- Select animation
   */

  const animatedOption = makeAnimated();

  /**
   * Console log
   */

  console.log(updatedPFIData.customerId);
  console.log(cyclesPerItem);

  const formatDataForExcel = () => {
    return requestedPFI.map((item) => ({
      "Customer Code": item.Customer.customerCode,
      Item: item.Items.itemName,
      "PFI - Serial": item.SERIAL,
      QTY: item.QTY,
      Cycles: item.noOfCycle
        .slice()
        .reverse()
        .map((cycle) => cycle.label)
        .join(", "),
      SHPDate: item.noOfCycle
        .slice()
        .reverse()
        .map((cycle) => formateDate(cycle.SHPDate))
        .join(", "),
    }));
  };

  const handleExportToExcel = () => {
    exportToExcel(formatDataForExcel, "requested_PFI");
  };

  const handleExportToPDF = () => {
    const columns = [
      "Customer Code",
      "Item",
      "PFI - Serial",
      "QTY",
      "Cycles",
      "SHPDate",
    ];
    exportToPDF(
      requestedPFI.map((pfi) => ({
        "Customer Code": pfi.Customer.customerCode,
        Item: pfi.Items.itemName,
        "PFI - Serial": pfi.SERIAL,
        QTY: pfi.QTY,
        Cycles: pfi.noOfCycle
          .slice()
          .reverse()
          .map((cycle) => cycle.label)
          .join(", "),
        SHPDate: pfi.noOfCycle
          .slice()
          .reverse()
          .map((cycle) => formateDate(cycle.SHPDate))
          .join(", "),
      })),
      columns,
      "requested_PFI"
    );
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6 border bg-neutral-100 rounded p-4">
        <div className="grid grid-cols-3  gap-4  p-4">
          <div className="bg-white p-4 border shadow-md rounded-md ">
            <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
              <Users size={20} className="text-blue-700" /> Total Customers
            </h1>
            <p className="mb-3 text-neutral-900 font-semibold text-[28px]">
              {customersList.length}
            </p>
            <Link
              to="/create-account"
              className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
            >
              Manage Users <ArrowRight size={16} className="mt-1" />
            </Link>
          </div>

          <div className="bg-white p-4 border shadow-md rounded-md ">
            <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
              <Box size={20} className="text-blue-700" /> Items
            </h1>
            <p className="mb-3 text-neutral-900 font-semibold text-[28px]">
              {items.length}
            </p>
            <Link
              to="/add-items"
              className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
            >
              Manage Items <ArrowRight size={16} className="mt-1" />
            </Link>
          </div>

          <div className="bg-white p-4 border shadow-md rounded-md ">
            <h1 className="flex items-center gap-1 text-[16px] mb-2 text-neutral-400">
              <FileInput size={20} className="text-blue-700" /> Requested Orders
            </h1>
            <p className="mb-3 text-neutral-900 font-semibold text-[28px]">
              {isRequesttingPFI ? (
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
                requestedPFI.length
              )}
            </p>
            <p
              onClick={() => setRequestTableFilter(!requestTableFilter)}
              className="flex justify-end items-center cursor-pointer gap-1 text-blue-500 transition-all duration-300 hover:underline"
            >
              Search Requests <ArrowRight size={16} className="mt-1" />
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center w-full">
          <form method="post" className="w-2/3">
            <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
              <h1 className="mb-4 text-center text-[22px]">Create PFI</h1>
              <Select
                options={customerCodeOptions}
                value={selectedCustomerCode}
                onChange={(selectedOption) => {
                  setSelectedCustomerCode(selectedOption);
                  setRequestPFIForm((prev) => ({
                    ...prev,
                    customerId: selectedOption ? selectedOption.value : "",
                  }));
                }}
                isClearable
                className="mb-5"
                placeholder="Customer Code"
              />
              <Select
                options={itemDescAndCodeOptions}
                value={selectedItem}
                onChange={(selectedOption) => {
                  setSelectedItem(selectedOption);
                  setRequestPFIForm((prev) => ({
                    ...prev,
                    itemId: selectedOption ? selectedOption.value : "",
                  }));
                  setItemId({
                    id: selectedOption ? selectedOption.value : "",
                  });
                }}
                isClearable
                className="mb-5"
                placeholder="Item Description & Code"
              />
              <input
                placeholder="QTY"
                type="number"
                name="QTY"
                value={requestPFIForm.QTY}
                onChange={handleRequestPFIChange}
                className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
              />
              <Select
                options={cyclesOptions}
                value={selectedCycles}
                components={animatedOption}
                closeMenuOnSelect={false}
                isMulti
                onChange={(selectedOption) => {
                  setSelectedCycles(selectedOption);
                  setRequestPFIForm((prev) => ({
                    ...prev,
                    noOfCycles: selectedOption
                      ? selectedOption.map((option) => ({
                          label: option.label,
                          SHPDate: formateDateToUpdateInfo(option.value),
                        }))
                      : [],
                  }));
                }}
                isClearable
                className="mb-5"
                placeholder="Number of Cycle"
              />
              <button
                disabled={isRequesttingPFI}
                onClick={handleRequestPFI}
                className="bg-blue-900 text-white p-3 rounded transition-all duration-300 hover:bg-blue-500"
              >
                {isRequesttingPFI ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    style={{ display: "inline-block" }}
                  >
                    <Loader className="text-white" />
                  </motion.div>
                ) : (
                  "Create PFI"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col w-full bg-white border shadow rounded-lg p-4 overflow-x-auto">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setRequestTableFilter(!requestTableFilter);
              }}
              className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
            >
              Filter
              <motion.span
                animate={{ rotate: requestTableFilter ? -180 : 0 }}
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
                      onClick={handleExportToExcel}
                      className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-emerald-700 text-white rounded-md transition-all duration-300 hover:bg-emerald-900"
                    >
                      Excel
                    </button>
                    <button
                      onClick={handleExportToPDF}
                      className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-red-700 text-white rounded-md transition-all duration-300 hover:bg-red-900"
                    >
                      PDF
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <AnimatePresence>
            {requestTableFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                style={{ overflow: "hidden" }}
                className="flex justify-between gap-6 mt-4"
              >
                <Select
                  options={uniqueCustomerCodeOptions}
                  value={uniqueCustomerCodeOptions.find(
                    (option) => option.value === customerCodeQueue
                  )}
                  onChange={(option) => {
                    setCustomerCodeQueue(option && option.value);
                  }}
                  isClearable
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="Code"
                />
                <Select
                  options={uniqueItemOptions}
                  value={uniqueItemOptions.find(
                    (option) => option.value === itemQueue
                  )}
                  onChange={(option) => {
                    setItemQueue(option && option.value);
                  }}
                  isClearable
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="Item"
                />
                <Select
                  options={uniquePFISerialOptions}
                  value={uniquePFISerialOptions.find(
                    (option) => option.value === pfiSerialQueue
                  )}
                  onChange={(option) => {
                    setPFISerialQueue(option && option.value);
                  }}
                  isClearable
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="PFI - ID"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {isLoadingRequestedPFI ? (
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
          ) : requestedPFI.length <= 0 ? (
            <h1 className="text-center text-[24px] mt-8">
              NO PFIs FOUND, PLEASE TRY AGAIN LATER
            </h1>
          ) : (
            <table className="min-w-full divide-y divide-neutral-900 mt-2">
              <thead className="bg-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    Customer Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    Item
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    PFI - Serial
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    QTY
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    Cycles
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    SHPDate
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-800">
                {currentRequestedPFIData.map((pfi, index) => (
                  <tr key={index}>
                    <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                      {pfi.Customer.customerCode}
                    </td>
                    <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                      {pfi.Items.itemName}
                    </td>
                    <td className="px-4 py-6  whitespace-normal break-words text-sm font-medium text-gray-900">
                      {pfi.SERIAL}
                    </td>
                    <td className="px-4 py-6 text-center whitespace-normal break-words text-sm font-medium text-gray-900">
                      {pfi.QTY}
                    </td>
                    <td className="px-4 py-6 text-center whitespace-normal break-words text-sm font-medium text-gray-900">
                      {pfi.noOfCycle
                        .slice()
                        .reverse()
                        .map((cycle) => cycle.label)
                        .join(", ")}
                    </td>
                    <td className="px-4 py-6 text-center whitespace-normal break-words text-sm font-medium text-gray-900">
                      {pfi.noOfCycle
                        .slice()
                        .reverse()
                        .map((cycle) => formateDate(cycle.SHPDate))
                        .join(", ")}
                    </td>
                    <td className="px-4 py-6 flex gap-2 whitespace-normal break-words text-sm font-medium text-gray-900">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() =>
                              setPFIId({
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
                              This action cannot be undone. This will
                              permanently delete this Customer and remove its
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() =>
                                setPFIId({
                                  id: "",
                                })
                              }
                            >
                              Cancel
                            </AlertDialogCancel>
                            <form method="delete">
                              <AlertDialogAction
                                disabled={isDeletingPFIRequest}
                                onClick={handleDeleteRequestedPFI}
                              >
                                {isDeletingPFIRequest ? (
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
                                  "Confirm"
                                )}
                              </AlertDialogAction>
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => {
                              setPFIId({
                                id: pfi.id,
                              });
                            }}
                          >
                            <Pen size={18} className="text-blue-500" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
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
                            <div className="grid gap-4 py-4">
                              <Select
                                options={customerCodeOptions}
                                value={customerCodeOptions.filter((option) =>
                                  updatedPFIData.customerId.includes(
                                    option.label
                                  )
                                )}
                                name="customerId"
                                onChange={handleUpdatedPFI}
                                isClearable
                                className="mb-5"
                                placeholder="Customer Code"
                              />
                              <Select
                                options={itemDescAndCodeOptions}
                                value={itemDescAndCodeOptions.filter((option) =>
                                  updatedPFIData.itemId.includes(option.label)
                                )}
                                name="itemId"
                                onChange={(selectedOption) => {
                                  setItemId({
                                    id: selectedOption.value,
                                  });
                                  setUpdatedPFIData((prev) => ({
                                    ...prev,
                                    itemId: selectedOption
                                      ? selectedOption.label
                                      : "",
                                  }));
                                }}
                                isClearable
                                className="mb-5"
                                placeholder="Number of Cycle"
                              />
                              <input
                                placeholder="QTY"
                                type="number"
                                name="QTY"
                                value={updatedPFIData.QTY}
                                onChange={handleDeleteRequestedPFI}
                                className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                              />
                              <Select
                                options={cyclesPerItem}
                                value={cyclesPerItem.filter((option) =>
                                  updatedPFIData.noOfCycles.some(
                                    (cycle) => cycle.label === option.label
                                  )
                                )}
                                name="noOfCycles"
                                onChange={(selectedOption) => {
                                  setUpdatedPFIData((prev) => ({
                                    ...prev,
                                    noOfCycles: selectedOption
                                      ? selectedOption.map((option) => ({
                                          label: option.label,
                                          value: option.value,
                                        }))
                                      : [],
                                  }));
                                }}
                                isClearable
                                isMulti
                                className="mb-5"
                                placeholder="Number of Cycle"
                              />
                            </div>
                          )}

                          <DialogFooter>
                            <button>Save changes</button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <RequestedPFIPagination />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default PFI;
