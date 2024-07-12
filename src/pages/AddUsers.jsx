import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import makeAnimated from "react-select/animated";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import Select from "react-select";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader,
  Pen,
  Trash,
} from "lucide-react";

export function AddUsers() {
  /**
   * useState hook to manage and update data
   * 1- customerFilter
   * ------------------
   * 2- customerData
   * 3- isAddingCustomer
   * 4- selectedType
   * ------------------
   * 5- customersList
   * 6- isLoadingCustomers
   * 7- uniqueCustomerEmailOptions
   * 8- customerEmailQueue
   * 9- uniqueCustomerCodeOptions
   * 10- customerCodeQueue
   * 11- uniqueCapIdOptions
   * 12- capIdQueue
   * 13- uniqueCutomerTypeOptions
   * 14- customerTypeQueue
   * 15- currentCustomerPage
   * 16- customerRowsPerPage
   * ------------------
   * 17- cutomerId
   * 18- isDeletingCustomer
   * ------------------
   * 19- updatedCustomerInfo
   * 20- isLoadingCustomerInfo
   * 21- isUpdatingCustomer
   * 22- reloadCustomerTable
   *
   */

  const [filter, setIsFilter] = useState(false);

  const [customerData, setCustomerData] = useState({
    customerName: "",
    username: "",
    email: "",
    tel: "",
    customerCapIdNo: "",
    customerType: [],
    customerAddress: "",
    TAX: "",
    taxValidityDate: "",
  });
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [selectedType, setSelectedType] = useState([]);

  const [customersList, setCustomersList] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  const [uniqueCustomerEmailOptions, setUniqueCustomerEmailOptions] = useState(
    []
  );
  const [customerEmailQueue, setCustomerEmailQueue] = useState("");

  const [uniqueCustomerCodeOptions, setUniqueCustomerCodeOptions] = useState(
    []
  );
  const [customerCodeQueue, setCustomerCodeQueue] = useState("");

  const [uniqueCapIdOptions, setUniqueCapIdOptions] = useState([]);
  const [capIdQueue, setCapIdQueue] = useState("");

  const [uniqueCutomerTypeOptions, setUniqueCustomerTypeOptions] = useState([]);
  const [customerTypeQueue, setCustomerTypeQueue] = useState("");

  const [currentCustomerPage, setCurrentCustomerPage] = useState(1);
  const [customerRowsPerPage, setCustomerRowsPerPage] = useState(7);

  const [customerId, setCustomerId] = useState({
    id: "",
  });
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);

  const [updatedCustomerInfo, setUpdatedCustomerInfo] = useState({
    customerAddress: "",
    username: "",
    tel: "",
    email: "",
    TAX: "",
    taxValidityDate: "",
  });
  const [isLoadingCustomerInfo, setIsLoadingCustomerInfo] = useState(false);
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);
  const [reloadCustomerTable, setReloadCustomerTable] = useState(false);

  /**
   * Sending Data to APIs Functions
   * 1- Create Customer
   * 2- Delete Customer
   * 3- handleUpdateCustomer
   */

  const handleCreateCustomer = async (event) => {
    //event.preventDefault();
    setIsAddingCustomer(true);

    const customerFinalData = {
      customerName: customerData.customerName,
      username: customerData.username,
      email: customerData.email,
      tel: customerData.tel,
      customerCapIdNo: parseInt(customerData.customerCapIdNo, 10),
      customerType: customerData.customerType,
      customerAddress: customerData.customerAddress,
      TAX: parseInt(customerData.TAX, 10),
      taxValidityDate: customerData.taxValidityDate,
    };

    try {
      const response = await fetch(
        "https://benchmark-innovation-production.up.railway.app/api/customer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerFinalData),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.message);
        setIsAddingCustomer(false);
        return;
      }

      toast.success("Customer Added Successfully");
      setCustomerData({
        customerName: "",
        username: "",
        email: "",
        tel: "",
        customerCapIdNo: "",
        customerType: [],
        customerAddress: "",
        TAX: "",
        taxValidityDate: "",
      });
      setSelectedType([]);

      setIsAddingCustomer(false);
    } catch (error) {
      toast.error(error.message);
      setIsAddingCustomer(false);
      return;
    }
  };

  const handleDeleteCustomer = async () => {
    setIsDeletingCustomer(true);

    try {
      const response = await fetch(
        `https://benchmark-innovation-production.up.railway.app/api/customer/${customerId.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.message);
        setIsDeletingCustomer(false);
        return;
      }

      toast.success("Customer Deleted Successfully");

      setCustomerId({
        id: "",
      });
      setIsDeletingCustomer(false);
    } catch (error) {
      toast.error(error.message);
      setIsDeletingCustomer(false);
      return;
    }
  };

  const handleUpdateCustomer = async () => {
    setIsUpdatingCustomer(true);

    const customerNewData = {
      ...updatedCustomerInfo,
      TAX: parseInt(updatedCustomerInfo.TAX, 10),
      taxValidityDate: new Date(updatedCustomerInfo.taxValidityDate)
        .toISOString()
        .split("T")[0],
    };

    try {
      const response = await fetch(
        `https://benchmark-innovation-production.up.railway.app/api/customer/${customerId.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerNewData),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.message);
        setIsUpdatingCustomer(false);
        return;
      }

      toast.success("Customer Data Updated Successfully");

      setUpdatedCustomerInfo({
        customerAddress: "",
        username: "",
        tel: "",
        email: "",
        TAX: "",
        taxValidityDate: "",
      });
      setCustomerId({
        id: "",
      });
      setIsUpdatingCustomer(false);
      setReloadCustomerTable(!reloadCustomerTable);
    } catch (error) {
      toast.error(error.message);
      setIsUpdatingCustomer(false);
      return;
    }
  };

  /**
   * useEffect hook to fetch data
   * 1- fetch customers
   * 2- fetch customer
   */

  useEffect(() => {
    async function loadCustomers() {
      setIsLoadingCustomers(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/customer"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingCustomers(false);
          return;
        }

        setCustomersList(resData.data);

        const uniqueCustomerEmail = [
          ...new Set(resData.data.map((email) => email.email)),
        ].map((email) => ({
          label: email,
          value: email,
        }));
        setUniqueCustomerEmailOptions(uniqueCustomerEmail);

        const uniqueCustomerCode = [
          ...new Set(resData.data.map((code) => code.customerCode)),
        ].map((code) => ({
          label: code,
          value: code,
        }));
        setUniqueCustomerCodeOptions(uniqueCustomerCode);

        const uniqueCapId = [
          ...new Set(resData.data.map((cap) => cap.customerCapIdNo)),
        ].map((cap) => ({
          label: cap,
          value: cap,
        }));
        setUniqueCapIdOptions(uniqueCapId);

        const uniqueCustomerType = [
          ...new Set(
            resData.data.map((customer) => customer.CustomerType?.type)
          ),
        ].map((type) => ({
          label: type,
          value: type,
        }));
        setUniqueCustomerTypeOptions(uniqueCustomerType);

        setIsLoadingCustomers(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingCustomers(false);
        return;
      }
    }
    loadCustomers();
  }, [isAddingCustomer || isDeletingCustomer || reloadCustomerTable]);

  useEffect(() => {
    async function loadCustomerInfo() {
      setIsLoadingCustomerInfo(true);

      try {
        const response = await fetch(
          `https://benchmark-innovation-production.up.railway.app/api/customer/${customerId.id}`
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingCustomerInfo(false);
          return;
        }

        setUpdatedCustomerInfo({
          customerAddress: resData.customerAddress,
          username: resData.username,
          email: resData.email,
          tel: resData.tel,
          TAX: resData.TAX,
          taxValidityDate: formateDateToUpdateInfo(resData.taxValidityDate),
        });

        setIsLoadingCustomerInfo(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingCustomerInfo(false);
        return;
      }
    }
    loadCustomerInfo();
  }, [customerId]);

  /**
   * functions and constants
   * 1- customer type select options
   * 2- animatedOption
   * 3- formateDate function
   * 4- filterCustomers function
   * 5- totalPages
   * 6- currentCustomerData
   * 7- formateDateToUpdateInfo
   */

  const customerTypes = [
    { label: "UPA", value: "UPA" },
    { label: "PRIV", value: "PRIV" },
    { label: "GOV", value: "GOV" },
  ];

  const animatedOption = makeAnimated();

  const formateDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const filterCustomers = customersList.filter(
    (customer) =>
      (!customerEmailQueue ||
        customer.email.toLowerCase() === customerEmailQueue.toLowerCase()) &&
      (!customerCodeQueue ||
        customer.customerCode.toLowerCase() ===
          customerCodeQueue.toLowerCase()) &&
      (!capIdQueue ||
        customer.customerCapIdNo.toString() === capIdQueue.toString()) &&
      (!customerTypeQueue ||
        customer.CustomerType?.type.toLowerCase() ===
          customerTypeQueue.toLowerCase())
  );

  const totalCustomerPages = Math.ceil(
    filterCustomers.length / customerRowsPerPage
  );

  const currentCustomerData = filterCustomers.slice(
    (currentCustomerPage - 1) * customerRowsPerPage,
    currentCustomerPage * customerRowsPerPage
  );

  const formateDateToUpdateInfo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  /**
   * Handle onChange functions
   * 1- handleAddCustomerChange
   * 2- handleCustomerRowsPerPage
   * 3- handleUpdateCustomerDataChange
   */

  function handleAddCustomerChange(event) {
    const { name, value } = event.target;

    setCustomerData((prevCustomerData) => ({
      ...prevCustomerData,
      [name]: value,
    }));
  }

  function handleCustomerRowPerPage(event) {
    setCustomerRowsPerPage(event.target.value);
    setCurrentCustomerPage(1);
  }

  function handleUpdateCustomerDataChange(event) {
    const { name, value } = event.target;
    setUpdatedCustomerInfo((prev) => ({
      ...prev,
      [name]:
        name === "taxValidityDate" ? formateDateToUpdateInfo(value) : value,
    }));
  }

  /**
   * Functional Components
   * 1- Pagination
   */

  const Pagination = () => (
    <div className="flex justify-end items-center gap-6 mt-6">
      <p>
        Rows per Page{" "}
        <input
          type="number"
          value={customerRowsPerPage}
          onChange={handleCustomerRowPerPage}
          className="w-12 pl-3 border-2 rounded-md"
        />
      </p>
      <p>
        page {currentCustomerPage} of {totalCustomerPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-200 hover:bg-blue-600"
          onClick={() => {
            setCurrentCustomerPage(1);
          }}
        >
          <ChevronsLeft size={20} className="text-white" />
        </button>
        <button
          disabled={currentCustomerPage === 1}
          onClick={() => setCurrentCustomerPage((prev) => prev - 1)}
          className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button
          disabled={currentCustomerPage === totalCustomerPages}
          onClick={() => setCurrentCustomerPage((prev) => prev + 1)}
          className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
        >
          <ChevronRight size={20} className="text-white" />
        </button>
        <button
          className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
          onClick={() => {
            setCurrentCustomerPage(totalCustomerPages);
          }}
        >
          <ChevronsRight size={20} className="text-white" />
        </button>
      </div>
    </div>
  );

  /**
   * console.log
   */

  console.log(updatedCustomerInfo);

  return (
    <section className="bg-gray-100 flex flex-col p-10 ml-16 2xl:ml-20 w-full gap-2">
      <h1 className="text-4xl text-neutral-900">Users</h1>
      <p className="text-[18px] text-gray-500">
        Manage your users and customers
      </p>
      <div className="w-full p-4 border bg-gray-100 shadow rounded">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setIsFilter(!filter);
            }}
            className="flex items-center gap-2 bg-blue-900 text-white shadow-md px-8 py-2 rounded-md mb-2"
          >
            Filter
            <motion.span
              animate={{ rotate: filter ? -180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <ChevronDown />
            </motion.span>
          </button>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 bg-blue-900 text-white shadow-md px-8 py-2 rounded-md mb-2">
                + Add New Customer
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] md:max-w-[650px]">
              <DialogHeader>
                <DialogTitle>Add new user</DialogTitle>
                <DialogDescription>
                  Fill the form to add a new customer. Click + Create new user
                  when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Select
                  options={customerTypes}
                  value={selectedType}
                  name="customerType"
                  components={animatedOption}
                  closeMenuOnSelect={false}
                  isMulti
                  onChange={(selectedOption) => {
                    setSelectedType(selectedOption);
                    setCustomerData((prev) => ({
                      ...prev,
                      customerType: selectedOption
                        ? selectedOption.map((option) => option.value)
                        : [],
                    }));
                  }}
                  isClearable
                  className="mb-5"
                  placeholder="Customer Type"
                />
                <input
                  placeholder="Customer Name"
                  type="text"
                  name="customerName"
                  value={customerData.customerName}
                  onChange={handleAddCustomerChange}
                  className="w-full mb-2 rounded h-[30px] md:h-[35px] lg:h-[40px] border-2 border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3"
                />
                <input
                  placeholder="Username"
                  type="text"
                  name="username"
                  value={customerData.username}
                  onChange={handleAddCustomerChange}
                  className="w-full mb-2 rounded h-[30px] md:h-[35px] lg:h-[40px] border-2 border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3"
                />
                <input
                  placeholder="E-mail"
                  type="text"
                  name="email"
                  value={customerData.email}
                  onChange={handleAddCustomerChange}
                  className="w-full mb-2 rounded h-[30px] md:h-[35px] lg:h-[40px] border-2 border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3"
                />
                <input
                  placeholder="Tel"
                  type="number"
                  name="tel"
                  value={customerData.tel}
                  onChange={handleAddCustomerChange}
                  className="w-full mb-2 rounded h-[30px] md:h-[35px] lg:h-[40px] border-2 border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3"
                />
                <input
                  placeholder="CAP - ID"
                  type="text"
                  name="customerCapIdNo"
                  value={customerData.customerCapIdNo}
                  onChange={handleAddCustomerChange}
                  className="w-full mb-2 rounded h-[30px] md:h-[35px] lg:h-[40px] border-2 border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3"
                />

                <input
                  placeholder="Address"
                  type="text"
                  name="customerAddress"
                  value={customerData.customerAddress}
                  onChange={handleAddCustomerChange}
                  className="w-full mb-2 rounded h-[30px] md:h-[35px] lg:h-[40px] border-2 border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3"
                />
                <input
                  placeholder="TAX - ID"
                  type="text"
                  name="TAX"
                  value={customerData.TAX}
                  onChange={handleAddCustomerChange}
                  className="w-full mb-2 rounded h-[30px] md:h-[35px] lg:h-[40px] border-2 border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3"
                />
                <div className="flex flex-col items-start">
                  <label
                    htmlFor="validity-Date"
                    className="text-neutral-500 mb-1"
                  >
                    Validity - Date
                  </label>
                  <input
                    id="validity-Date"
                    type="date"
                    name="taxValidityDate"
                    value={customerData.taxValidityDate}
                    onChange={handleAddCustomerChange}
                    className="w-full mb-2 text-neutral-400 rounded h-[30px] md:h-[35px] lg:h-[40px] border-2 border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-2"
                  />
                </div>
              </div>
              <DialogFooter>
                <form method="post">
                  <button
                    disabled={isAddingCustomer}
                    onClick={handleCreateCustomer}
                    className="bg-blue-900 text-white p-3 rounded transition-all duration-300 hover:bg-blue-500"
                  >
                    {isAddingCustomer ? (
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
                      "+ Create Customer"
                    )}
                  </button>
                </form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <AnimatePresence>
          {filter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              style={{ overflow: "hidden" }}
              className="flex justify-between gap-6 mt-4"
            >
              <Select
                options={uniqueCustomerEmailOptions}
                value={uniqueCustomerEmailOptions.find(
                  (email) => email.value === customerEmailQueue
                )}
                onChange={(option) => {
                  setCustomerEmailQueue(option ? option.value : "");
                }}
                isClearable
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="Customer Email"
              />
              <Select
                options={uniqueCustomerCodeOptions}
                value={uniqueCustomerCodeOptions.find(
                  (code) => code.value === customerCodeQueue
                )}
                onChange={(option) => {
                  setCustomerCodeQueue(option ? option.value : "");
                }}
                isClearable
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="Customer - Code"
              />
              <Select
                options={uniqueCapIdOptions}
                value={uniqueCapIdOptions.find(
                  (cap) => cap.value === capIdQueue
                )}
                onChange={(option) => {
                  setCapIdQueue(option ? option.value : "");
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
                options={uniqueCutomerTypeOptions}
                value={uniqueCutomerTypeOptions.find(
                  (type) => type.value === customerTypeQueue
                )}
                onChange={(option) => {
                  setCustomerTypeQueue(option ? option.value : "");
                }}
                isClearable
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="Customer - Type"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoadingCustomers ? (
          <h1 className="text-center text-[24px] mt-8 flex items-center gap-2 justify-center">
            Please Wait Customers Are Loading
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
        ) : customersList.length <= 0 ? (
          <h1 className="text-center text-[24px] mt-8">
            NO CUSTOMERS FOUND, PLEASE TRY AGAIN LATER or Create a new Customer
          </h1>
        ) : (
          <table className="min-w-full shadow divide-y divide-neutral-900 mt-2">
            <thead className="bg-blue-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-100 tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-100 tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-100 tracking-wider"
                >
                  Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-100 tracking-wider"
                >
                  CAP - ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-100 tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-100 tracking-wider"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-100 tracking-wider"
                >
                  Tel
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-100 tracking-wider"
                >
                  TAX
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-100 tracking-wider"
                >
                  Validity - Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-neutral-100 tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-neutral-50 divide-y divide-neutral-400">
              {currentCustomerData.map((customer, index) => (
                <tr key={index}>
                  <td className="px-4 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.username}
                  </td>
                  <td className="px-4 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.email}
                  </td>
                  <td className="px-4 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.customerCode}
                  </td>
                  <td className="px-4 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.customerCapIdNo}
                  </td>
                  <td className="px-4 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.CustomerType?.type}
                  </td>
                  <td className="px-4 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.customerAddress}
                  </td>
                  <td className="px-4 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.tel}
                  </td>

                  <td className="px-4 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.TAX}
                  </td>
                  <td className="px-4 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formateDate(customer.taxValidityDate)}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center justify-center gap-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() =>
                            setCustomerId({
                              id: customer.id,
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
                            This action cannot be undone. This will permanently
                            delete this Customer and remove its data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() =>
                              setCustomerId({
                                id: "",
                              })
                            }
                          >
                            Cancel
                          </AlertDialogCancel>
                          <form method="delete">
                            <AlertDialogAction
                              disabled={isDeletingCustomer}
                              onClick={handleDeleteCustomer}
                            >
                              {isDeletingCustomer ? (
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

                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setCustomerId({ id: customer.id })}
                        >
                          <Pen size={18} className="text-green-700" />
                        </button>
                      </DialogTrigger>
                      <DialogContent
                        onClose={() => {
                          setCustomerId({ id: "" });
                          setUpdatedCustomerInfo({
                            customerAddress: "",
                            username: "",
                            tel: "",
                            email: "",
                            TAX: "",
                            taxValidityDate: "",
                          });
                        }}
                        className="sm:max-w-[425px]"
                      >
                        <DialogHeader>
                          <DialogTitle>Edit Item</DialogTitle>
                          <DialogDescription>
                            Make changes to the item here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>

                        {isLoadingCustomerInfo ? (
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
                            <input
                              placeholder="Customer - Address"
                              type="text"
                              name="customerAddress"
                              value={updatedCustomerInfo.customerAddress}
                              onChange={handleUpdateCustomerDataChange}
                              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                            />
                            <input
                              placeholder="Customer - username"
                              type="text"
                              name="username"
                              value={updatedCustomerInfo.username}
                              onChange={handleUpdateCustomerDataChange}
                              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                            />
                            <input
                              placeholder="Tel"
                              type="number"
                              name="tel"
                              value={updatedCustomerInfo.tel}
                              onChange={handleUpdateCustomerDataChange}
                              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                            />
                            <input
                              placeholder="Email"
                              type="email"
                              name="email"
                              value={updatedCustomerInfo.email}
                              onChange={handleUpdateCustomerDataChange}
                              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                            />
                            <input
                              placeholder="TAX"
                              type="number"
                              name="TAX"
                              value={updatedCustomerInfo.TAX}
                              onChange={handleUpdateCustomerDataChange}
                              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                            />
                            <input
                              type="date"
                              name="taxValidityDate"
                              value={updatedCustomerInfo.taxValidityDate}
                              onChange={handleUpdateCustomerDataChange}
                              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                            />
                          </div>
                        )}

                        <DialogFooter>
                          <form method="patch">
                            <button
                              disabled={isUpdatingCustomer}
                              onClick={handleUpdateCustomer}
                              className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500"
                            >
                              {isUpdatingCustomer ? (
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
                                "Save Changes"
                              )}
                            </button>
                          </form>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Pagination />
      </div>
      <ToastContainer />
    </section>
  );
}

export default AddUsers;
