import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../CSS/Select.css";

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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
} from "lucide-react";
import { Link } from "react-router-dom";
import PFI from "@/forms/PFI";

export function OrderEntry() {
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
   *
   */

  const [customersList, setCustomersList] = useState([]);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  const customerCodeOptions = customersList.map((code) => ({
    label: code.customerCode,
    value: code.id,
  }));
  const [selectedCustomerCode, setSelectedCustomerCode] = useState(null);

  const [selectedQTYPFIRequest, setSelectedQTYPFIRequest] = useState(null);
  const QTYOfPFIRequestOptions = [
    { label: "A", value: 1 },
    { label: "B", value: 2 },
    { label: "C", value: 3 },
    { label: "D", value: 4 },
  ];

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
    value: c.value,
  }));
  const [selectedCycles, setSelectedCycles] = useState([]);

  const [requestPFIForm, setRequestPFIForm] = useState({
    customerId: "",
    itemId: "",
    QTY: "",
    noOfCycle: [],
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
  const [poTableFilter, setPOTableFilter] = useState(false);

  const [pfiId, setPFIId] = useState({
    id: "",
  });
  const [isDeletingPFIRequest, setIsDeletingPFIRequest] = useState(false);

  const [updateRequestedPFIInfo, setUpdateRequestPFIInfo] = useState({
    customerId: "",
    itemId: "",
    QTY: "",
    noOfCycle: "",
  });
  const [isLoadingRequestedPFIInfo, setIsLoadingRequestedPFIInfo] =
    useState(false);

  const [reloadRequestedPFITable, setReloadRequestedPFITable] = useState(false);

  /**
   * useEffect functions to Fetch Data
   * 1- Fetch Customers
   * 2- Fetch items
   * 3- Fetch cyclesPerItem
   * 4- Fetch requestedPFI
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

        setCyclesPerItem(resData.cycle);
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

  /**
   * Handle onChange function to update state values
   * 1- Request PFI Form
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

  /**
   * Sending Data to API
   * 1- requestPFI
   * 2- deleteRequestedPFI
   */

  const handleRequestPFI = async (event) => {
    event.preventDefault();
    setIsrequesttingPFI(true);

    const sumOfCyclesValues = requestPFIForm.noOfCycle.reduce(
      (index, currentValue) => {
        return index + currentValue;
      },
      0
    );

    const finalData = {
      ...requestPFIForm,
      QTY: parseInt(requestPFIForm.QTY, 10),
      noOfCycle: sumOfCyclesValues,
    };

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
   * Console.log
   */
  //console.log(requestPFIForm);
  //console.log(items);
  //console.log(itemId.id);
  //console.log(cyclesPerItem);
  console.log(requestedPFI);
  console.log(currentRequestedPFIData);

  return (
    <section className="flex flex-col p-8 ml-20 w-full gap-5">
      <h1 className="text-4xl text-neutral-900">Ordering and Supply chain</h1>
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

      {/* <div className="w-full flex flex-col gap-6 border bg-neutral-100 rounded p-4 mb-20">
        <div className="flex flex-col md:flex-row items-center gap-16 w-full">
          <form method="post" className="w-1/2">
            <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
              <h1 className="mb-4 text-center text-[22px]">Request PFI</h1>
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
                  setItemId({ id: selectedOption ? selectedOption.value : "" });
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
                    noOfCycle: selectedOption
                      ? selectedOption.map((option) => option.value)
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
                  "Request PFI"
                )}
              </button>
            </div>
          </form>

          <form method="post" className="w-1/2">
            <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
              <h1 className="mb-4 text-center text-[22px]">Final PFI</h1>
              <Select
                options={customerCodeOptions}
                isClearable
                className="mb-5"
                placeholder="Customer Code"
              />
              <Select
                options={itemDescAndCodeOptions}
                isClearable
                className="mb-5"
                placeholder="Item Description & Code"
              />
              <input
                placeholder="QTY"
                type="number"
                name="QTY"
                className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
              />
              <Select
                options={cyclesOptions}
                components={animatedOption}
                closeMenuOnSelect={false}
                isMulti
                isClearable
                className="mb-5"
                placeholder="Number of Cycle"
              />
              <button className="bg-blue-900 text-white p-3 rounded transition-all duration-300 hover:bg-blue-500">
                Request Final PFI
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col w-full bg-white border shadow rounded-lg p-3 overflow-x-auto">
          <button
            onClick={() => {
              setRequestTableFilter(!requestTableFilter);
            }}
            className="flex justify-center items-center gap-1 w-[110px] px-3 py-1 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
          >
            Filter
            <motion.span
              animate={{ rotate: requestTableFilter ? -180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <ChevronDown size={20} />
            </motion.span>
          </button>

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
                    Creation Date
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
                      {pfi.noOfCycle}
                    </td>
                    <td className="px-4 py-6 text-center whitespace-normal break-words text-sm font-medium text-gray-900">
                      {formateDate(pfi.createdAt)}
                    </td>
                    <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
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
                                    style={{ display: "inline-block" }}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <RequestedPFIPagination />
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-6 border bg-neutral-100 rounded p-4 mb-40">
        <Tabs defaultValue="poCreate" className="w-[560px]">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="poCreate">PO - Creation</TabsTrigger>
            <TabsTrigger value="confirm">CAP - Confirmation</TabsTrigger>
          </TabsList>
          <TabsContent value="poCreate">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Create PO</CardTitle>
                <CardDescription>
                  Create PO for the requested PFI here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <form method="post">
                  <div className="flex flex-col">
                    <input
                      placeholder="PFI - Number"
                      type="number"
                      className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                    />
                    <Select
                      components={animatedOption}
                      closeMenuOnSelect={false}
                      isMulti
                      isClearable
                      className="mb-5"
                      placeholder="Requested - PFI"
                    />
                    <input
                      placeholder="Price"
                      type="number"
                      className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                    />
                    <input
                      placeholder="Shipping Fees"
                      type="number"
                      className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                    />
                    <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                      Request PFI
                    </button>
                  </div>
                </form>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="confirm">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-[22px]">CAP Confirmation</CardTitle>
                <CardDescription>
                  Confirm your PO through the following forms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <form>
                  <div className="flex flex-col p-4">
                    <Select className="mb-6" placeholder="PO - ID" />
                    <input
                      placeholder="Order Confirmation Number"
                      type="number"
                      className="w-full mb-6 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                    />
                    <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                      Confirm Order
                    </button>
                  </div>
                </form>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col w-full bg-white border shadow rounded-lg p-2 overflow-x-auto">
          <button
            onClick={() => {
              setPOTableFilter(!poTableFilter);
            }}
            className="flex justify-center items-center gap-1 w-[110px] px-3 py-1 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
          >
            Filter
            <motion.span
              animate={{ rotate: poTableFilter ? -180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <ChevronDown size={20} />
            </motion.span>
          </button>

          <AnimatePresence>
            {poTableFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                style={{ overflow: "hidden" }}
                className="flex justify-between gap-6 mt-4"
              >
                <Select
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="Customer code"
                />
                <Select
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="Item"
                />
                <Select
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="QTY"
                />
                <Select
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="Cycle"
                />
                <Select
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

          <table className="min-w-full divide-y divide-neutral-900 mt-2">
            <thead className="bg-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Customer Code
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
                  QTY
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Cycle
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  PFI - ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-800"></tbody>
          </table>
        </div>
      </div> */}

      <div className="w-full border bg-neutral-100 rounded p-4">
        <Tabs defaultValue="pfi" className="w-full">
          <TabsList className="grid w-[60%] grid-cols-4 bg-white">
            <TabsTrigger value="pfi">PFI - Requests</TabsTrigger>
            <TabsTrigger value="po">PO - Creation</TabsTrigger>
            <TabsTrigger value="triton">Triton - Invoice</TabsTrigger>
            <TabsTrigger value="uae">UAE - Annual Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="pfi">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>PFI Request and Confirmation</CardTitle>
                <CardDescription>
                  Create PFI requests and Final PFI through the following forms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <PFI />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="po">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>PO Creation</CardTitle>
                <CardDescription>
                  Create PO for the Requested PFIs and confirm the PO through
                  the following forms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="w-full flex flex-col gap-6 border bg-neutral-100 rounded p-4">
                  <div className="flex flex-col md:flex-row items-start gap-16 w-full">
                    <form method="post" className="w-1/2">
                      <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
                        <h1 className="mb-4 text-center text-[22px]">
                          Create PO
                        </h1>
                        <input
                          placeholder="PFI - Number"
                          type="number"
                          className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                        />
                        <Select
                          components={animatedOption}
                          closeMenuOnSelect={false}
                          isMulti
                          isClearable
                          className="mb-5"
                          placeholder="Requested - PFI"
                        />
                        <input
                          placeholder="Price"
                          type="number"
                          className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                        />
                        <input
                          placeholder="Shipping Fees"
                          type="number"
                          className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                        />
                        <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                          Create PO
                        </button>
                      </div>
                    </form>

                    <form method="post" className="w-1/2">
                      <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
                        <h1 className="mb-4 text-center text-[22px]">
                          Confirm PO
                        </h1>
                        <Select className="mb-6" placeholder="PO - ID" />
                        <input
                          placeholder="Order Confirmation Number"
                          type="number"
                          className="w-full mb-6 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                        />
                        <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                          Confirm Order
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="flex flex-col w-full bg-white border shadow rounded-lg p-4 overflow-x-auto">
                    <button
                      onClick={() => {
                        setPOTableFilter(!poTableFilter);
                      }}
                      className="flex justify-center items-center gap-1 w-[110px] px-3 py-1 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
                    >
                      Filter
                      <motion.span
                        animate={{ rotate: poTableFilter ? -180 : 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ChevronDown size={20} />
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {poTableFilter && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          style={{ overflow: "hidden" }}
                          className="flex justify-between gap-6 mt-4"
                        >
                          <Select
                            className="w-full custom-select"
                            classNamePrefix="reac-select"
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            placeholder="Customer code"
                          />
                          <Select
                            className="w-full custom-select"
                            classNamePrefix="reac-select"
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            placeholder="Item"
                          />
                          <Select
                            className="w-full custom-select"
                            classNamePrefix="reac-select"
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            placeholder="QTY"
                          />
                          <Select
                            className="w-full custom-select"
                            classNamePrefix="reac-select"
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            placeholder="Cycle"
                          />
                          <Select
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

                    <table className="min-w-full divide-y divide-neutral-900 mt-2">
                      <thead className="bg-gray-200">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                          >
                            Customer Code
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
                            QTY
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                          >
                            Cycle
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                          >
                            PFI - ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-neutral-800"></tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="triton">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Triton Invoices</CardTitle>
                <CardDescription>
                  Create Triton Invoices here through the following forms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col md:flex-row justify-between w-full">
                  <form>
                    <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-[400px]">
                      <h1 className="mb-4 text-center text-[22px]">
                        Triton Invoice
                      </h1>
                      <input
                        placeholder="Commercial Invoice - ID"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <input
                        placeholder="Commercial Invoice Value / Item"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <input
                        placeholder="AWB - ID"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <Select
                        placeholder="QTY"
                        className="w-full mb-3 rounded h-[30px] md:h-[35px] lg:h-[40px]  border-gray-400 focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex flex-col items-start">
                        <label
                          htmlFor="shipDate"
                          className="mb-1 text-neutral-600"
                        >
                          Ship - Date
                        </label>
                        <input
                          id="shipDate"
                          type="date"
                          className="w-full mb-2 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <label
                          htmlFor="arrivalDate"
                          className="mb-1 text-neutral-600"
                        >
                          Arrival - Date
                        </label>
                        <input
                          id="arrivalDate"
                          type="date"
                          className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                        />
                      </div>
                      <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                        Create Triton Invoice
                      </button>
                    </div>
                  </form>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="uae">
            <Card>
              <CardHeader>
                <CardTitle>UAE</CardTitle>
                <CardDescription>UAE invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2"></CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* <h1 className="text-4xl text-neutral-900">Initial Table</h1>
      <div className="w-full bg-white rounded p-4"></div>

      <div className="w-full border bg-neutral-100 rounded p-4">
        <Tabs defaultValue="cap" className="w-[1000px]">
          <TabsList className="grid w-1/2 grid-cols-3 bg-white">
            <TabsTrigger value="cap">CAP - Requests</TabsTrigger>
            <TabsTrigger value="triton">Triton - Invoices</TabsTrigger>
            <TabsTrigger value="uae">UAE - Annual Subscription</TabsTrigger>
          </TabsList>
          <TabsContent value="cap">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>CAP Request and Orders</CardTitle>
                <CardDescription>
                  Create CAP requests and orders through the following forms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col md:flex-row justify-between w-full">
                  <form method="post">
                    <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-[400px]">
                      <h1 className="mb-4 text-center text-[22px]">
                        Request PFI
                      </h1>
                      <Select
                        options={customerCodeOptions}
                        value={selectedCustomerCode}
                        onChange={(selectedOption) => {
                          setSelectedCustomerCode(selectedOption);
                          setRequestPFIForm((prev) => ({
                            ...prev,
                            customerCode: selectedOption
                              ? selectedOption.value
                              : "",
                          }));
                        }}
                        isClearable
                        className="mb-5"
                        placeholder="Customer Code"
                      />
                      <Select
                        className="mb-5"
                        placeholder="Item Description & Code"
                      />
                      <input
                        placeholder="QTY"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <Select
                        options={QTYOfPFIRequestOptions}
                        value={selectedQTYPFIRequest}
                        components={animatedOption}
                        closeMenuOnSelect={false}
                        isMulti
                        onChange={(selectedOption) => {
                          setSelectedQTYPFIRequest(selectedOption);
                          setRequestPFIForm((prev) => ({
                            ...prev,
                            QTY: selectedOption ? selectedOption.value : "",
                          }));
                        }}
                        isClearable
                        className="mb-5"
                        placeholder="Number of Cycle"
                      />
                      <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                        Request PFI
                      </button>
                    </div>
                  </form>

                  <form>
                    <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-[400px]">
                      <h1 className="mb-4 text-center text-[22px]">
                        CAP Order Confirmation
                      </h1>
                      <Select className="mb-5" placeholder="PO - ID" />
                      <input
                        placeholder="Order Confirmation Number"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                        Confirm Order
                      </button>
                    </div>
                  </form>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="triton">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Triton Invoices</CardTitle>
                <CardDescription>
                  Create Triton Invoices here through the following forms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col md:flex-row justify-between w-full">
                  <form>
                    <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-[400px]">
                      <h1 className="mb-4 text-center text-[22px]">
                        Triton Invoice
                      </h1>
                      <input
                        placeholder="Commercial Invoice - ID"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <input
                        placeholder="Commercial Invoice Value / Item"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <input
                        placeholder="AWB - ID"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <Select
                        placeholder="QTY"
                        className="w-full mb-3 rounded h-[30px] md:h-[35px] lg:h-[40px]  border-gray-400 focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex flex-col items-start">
                        <label
                          htmlFor="shipDate"
                          className="mb-1 text-neutral-600"
                        >
                          Ship - Date
                        </label>
                        <input
                          id="shipDate"
                          type="date"
                          className="w-full mb-2 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <label
                          htmlFor="arrivalDate"
                          className="mb-1 text-neutral-600"
                        >
                          Arrival - Date
                        </label>
                        <input
                          id="arrivalDate"
                          type="date"
                          className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                        />
                      </div>
                      <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                        Create Triton Invoice
                      </button>
                    </div>
                  </form>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="uae">
            <Card>
              <CardHeader>
                <CardTitle>UAE</CardTitle>
                <CardDescription>UAE invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2"></CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div> */}
    </section>
  );
}

export default OrderEntry;
