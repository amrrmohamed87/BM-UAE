import { useState, useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../CSS/Select.css";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

export function AddItems() {
  /**
   * useState hook to manage and update data
   * 1- itemsFiletr
   * 2- numberOfCycles
   * 3- selectedCycles
   * ----------------------
   * 4- items
   * 5- isLoadingItems
   * 6- uniqueItemCodeOptions
   * 7- itemCodesQueue
   * 8- uniqueItemDescriptionOptions
   * 9- itemDescriptionQueue
   * 10- uniqueCycleOptions
   * 11- cycleQueue
   * 12- uniqueShippingDateOptions
   * 13- shippingDateQueue
   * -----------------------
   * 14- currentPage
   * 15- rowsPerPage
   * -----------------------
   * 16- itemsData
   * 17- isAddingItem
   * 18- isDeletingItem
   * 19- deletedItemId
   * 20- itemPerIdData
   * 21- isLoadingItemPerIdData
   * 22- itemUpdatedData
   * 23- isUpdatingItem
   * 24- reloadItems
   *
   */

  const [itemsFilter, setItemsFilter] = useState(false);
  const numberOfCycles = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
  ];
  const [selectedCycles, setSelectedCycled] = useState([]);

  const [items, setItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  const [uniqueItemCodeOptions, setUniqueItemCodeOptions] = useState([]);
  const [itemCodesQueue, setItemCodeQueue] = useState("");

  const [uniqueItemDescriptionOptions, setUniqueItemDescriptionOptions] =
    useState([]);
  const [itemDescriptionQueue, setItemDescriptionQueue] = useState("");

  const [uniqueCycleOptions, setUniqueCycleOptions] = useState([]);
  const [cycleQueue, setCycleQueue] = useState("");

  const [uniqueShippingDateOptions, setUniqueShippingDate] = useState([]);
  const [shippingDateQueue, setShippingDateQueue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const [itemsData, setItemsData] = useState({
    code: "",
    desc: "",
    cycle: [],
    SHPDate: "",
  });
  const [isAddingItems, setIsAddingItems] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState({
    itemID: "",
  });

  const [itemId, setItemId] = useState({
    itemID: "",
  });
  const [itemPerIdData, setItemPerIdData] = useState([]);
  const [isLoadingItemPerId, setIsLoadingItemPerId] = useState(false);
  const [itemUpdatedData, setItemUpdatedData] = useState({
    desc: "",
    cycle: [],
    SHPDate: "",
  });
  const [isUpdatingItem, setIsUpdatingItem] = useState(false);

  const [reloadItems, setReloadItems] = useState(false);

  /**
   * useEffect functions to Fetch Data
   * 1- Fetch Items
   * 2- Fetch one Item
   */

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

        const uniqueItemCodes = [
          ...new Set(resData.data.map((item) => item.code)),
        ].map((code) => ({
          label: code,
          value: code,
        }));
        setUniqueItemCodeOptions(uniqueItemCodes);

        const uniqueItemDescriptions = [
          ...new Set(resData.data.map((item) => item.desc)),
        ].map((desc) => ({
          label: desc,
          value: desc,
        }));
        setUniqueItemDescriptionOptions(uniqueItemDescriptions);

        const uniqueCycles = [
          ...new Set(
            resData.data.flatMap((item) => item.cycle.map((c) => c.label))
          ),
        ].map((cycle) => ({
          label: cycle,
          value: cycle,
        }));
        setUniqueCycleOptions(uniqueCycles);

        const uniqueShippingDates = [
          ...new Set(resData.data.map((item) => formateDate(item.SHPDate))),
        ].map((date) => ({
          label: date,
          value: date,
        }));
        setUniqueShippingDate(uniqueShippingDates);

        setIsLoadingItems(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingItems(false);
        return;
      }
    }
    loadItems();
  }, [isAddingItems || isDeletingItem || reloadItems]);

  useEffect(() => {
    async function loadItemPerId() {
      if (!itemId.itemID) return;

      setIsLoadingItemPerId(true);

      try {
        const response = await fetch(
          `https://benchmark-innovation-production.up.railway.app/api/items/${itemId.itemID}`
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingItemPerId(false);
          return;
        }

        setItemPerIdData(resData);

        setItemUpdatedData({
          desc: resData.desc,
          cycle: resData.cycle.map((cycle) => cycle.label),
          SHPDate: formateDateToUpdateInfo(resData.SHPDate),
        });
        setIsLoadingItemPerId(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingItemPerId(false);
        return;
      }
    }
    loadItemPerId();
  }, [itemId]);

  /**
   * Sending Data to APIs Functions
   * 1- Create items
   * 2- Delete items
   * 3- Update items
   */

  const handleAddItems = async (event) => {
    event.preventDefault();
    setIsAddingItems(true);

    try {
      const response = await fetch(
        "https://benchmark-innovation-production.up.railway.app/api/items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemsData),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.message);
        setIsAddingItems(false);
        return;
      }

      toast.success("Item Added Successfully");

      setItemsData({
        code: "",
        desc: "",
        cycle: [],
        SHPDate: "",
      });
      setSelectedCycled([]);

      setIsAddingItems(false);
    } catch (error) {
      toast.error(
        "Unexpected error during adding items, please refresh the page then try again."
      );
      setIsAddingItems(false);
      return;
    }
  };

  const handleDeleteItems = async () => {
    setIsDeletingItem(true);

    try {
      const response = await fetch(
        `https://benchmark-innovation-production.up.railway.app/api/items/${deletedItemId.itemID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.error);
        setIsDeletingItem(false);
        return;
      }

      toast.success("Item Deleted Successfully");
      setDeletedItemId({
        itemID: "",
      });
      setIsDeletingItem(false);
    } catch (error) {
      toast.error(error.message);
      setIsDeletingItem(false);
      return;
    }
  };

  const handleUpdateItems = async () => {
    setIsUpdatingItem(true);

    const updatedData = {
      ...itemUpdatedData,
      SHPDate: new Date(itemUpdatedData.SHPDate).toISOString().split("T")[0],
    };

    try {
      const response = await fetch(
        `https://benchmark-innovation-production.up.railway.app/api/items/${itemId.itemID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.error);
        setIsUpdatingItem(false);
        return;
      }

      toast.success("Item Updated Successfully");
      setItemId({ itemID: "" });
      setItemPerIdData([]);
      setIsUpdatingItem(false);
      setReloadItems(!reloadItems);
    } catch (error) {
      toast.error(error.message);
      setIsUpdatingItem(false);
    }
  };

  /**
   * Functions
   * 1- formateDate function
   * 2- filterItems function
   * 3- totalPages
   * 4- currentData
   * 5- animationOption
   * 6- formateDateToUpdateInfo
   */

  const formateDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const filteredItems = items.filter(
    (item) =>
      (!itemCodesQueue ||
        item.code.toLowerCase() === itemCodesQueue.toLowerCase()) &&
      (!itemDescriptionQueue ||
        item.desc.toLowerCase() === itemDescriptionQueue.toLowerCase()) &&
      (!cycleQueue ||
        item.cycle.some(
          (c) => c.label.toLowerCase() === cycleQueue.toLowerCase()
        )) &&
      (!shippingDateQueue || formateDate(item.SHPDate) === shippingDateQueue)
  );

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const currentData = filteredItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const animatedOption = makeAnimated();

  /**
   * Handle onChange functions
   * 1- handleRowsPerPage
   * 2- addingItemsChange
   */

  function handleRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  }

  function handleAddingItemsChange(event) {
    const { name, value } = event.target;
    setItemsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleUpdateItemChange(event) {
    const { name, value } = event.target;
    setItemUpdatedData((prev) => ({
      ...prev,
      [name]: name === "SHPDate" ? formateDateToUpdateInfo(value) : value,
    }));
  }

  function handleUpdateItemSelectChange(selectedOption) {
    setItemUpdatedData((prev) => ({
      ...prev,
      cycle: selectedOption ? selectedOption.map((option) => option.label) : [],
    }));
  }

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
   * 1- Pagination
   */

  const Pagination = () => (
    <div className="flex justify-end items-center gap-6 mt-6">
      <p>
        Rows per Page{" "}
        <input
          type="number"
          value={rowsPerPage}
          onChange={handleRowsPerPage}
          className="w-12 pl-3 border-2 rounded-md"
        />
      </p>
      <p>
        page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-200 hover:bg-blue-600"
          onClick={() => {
            setCurrentPage(1);
          }}
        >
          <ChevronsLeft size={20} className="text-white" />
        </button>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
        >
          <ChevronRight size={20} className="text-white" />
        </button>
        <button
          className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
          onClick={() => {
            setCurrentPage(totalPages);
          }}
        >
          <ChevronsRight size={20} className="text-white" />
        </button>
      </div>
    </div>
  );

  /**
   * Console log
   */
  console.log(itemsData);
  console.log(items);
  console.log(currentData);
  console.log(deletedItemId);
  console.log(deletedItemId.itemID);
  console.log(itemPerIdData);
  console.log(itemUpdatedData);
  console.log(itemUpdatedData.cycle);

  return (
    <section className="bg-gray-100 flex flex-col p-10 ml-20 w-full gap-5">
      <h1 className="text-4xl text-neutral-900">Master Items - Data</h1>

      <div className="w-full flex flex-col md:flex-row gap-6 border bg-neutral-100 rounded p-4 mb-40">
        <form method="post">
          <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-[400px]">
            <h1 className="mb-4 text-center text-[22px]">Add Items</h1>
            <input
              placeholder="Item - Code"
              type="text"
              name="code"
              value={itemsData.code}
              onChange={handleAddingItemsChange}
              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
            />
            <input
              placeholder="Item - Description"
              type="text"
              name="desc"
              value={itemsData.desc}
              onChange={handleAddingItemsChange}
              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
            />
            <Select
              options={numberOfCycles}
              value={selectedCycles}
              name="cycle"
              components={animatedOption}
              closeMenuOnSelect={false}
              isMulti
              onChange={(selectedOption) => {
                setSelectedCycled(selectedOption);
                setItemsData((prev) => ({
                  ...prev,
                  cycle: selectedOption
                    ? selectedOption.map((option) => option.value)
                    : [],
                }));
              }}
              isClearable
              className="mb-5"
              placeholder="Number of Cycle"
            />
            <div className="flex flex-col">
              <label htmlFor="shippingDate" className="text-neutral-500 mb-1">
                Shipping - Date
              </label>
              <input
                type="date"
                name="SHPDate"
                value={itemsData.SHPDate}
                onChange={handleAddingItemsChange}
                className="w-full mb-5 text-neutral-500 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
              />
            </div>
            <button
              disabled={isAddingItems}
              onClick={handleAddItems}
              className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500"
            >
              {isAddingItems ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  style={{ display: "inline-block" }}
                >
                  <Loader className="text-white" />
                </motion.div>
              ) : (
                "Add Items"
              )}
            </button>
          </div>
        </form>

        <div className="flex flex-col w-full bg-white border shadow rounded-lg p-4 overflow-x-auto">
          <button
            onClick={() => {
              setItemsFilter(!itemsFilter);
            }}
            className="flex justify-center items-center gap-1 w-[110px] px-3 py-1 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
          >
            Filter
            <motion.span
              animate={{ rotate: itemsFilter ? -180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <ChevronDown size={20} />
            </motion.span>
          </button>

          <AnimatePresence>
            {itemsFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                style={{ overflow: "hidden" }}
                className="flex justify-between gap-6 mt-4"
              >
                <Select
                  options={uniqueItemCodeOptions}
                  onChange={(option) => {
                    setItemCodeQueue(option ? option.value : "");
                  }}
                  value={uniqueItemCodeOptions.find(
                    (option) => option.value === itemCodesQueue
                  )}
                  isClearable
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="Item - Code"
                />
                <Select
                  options={uniqueItemDescriptionOptions}
                  onChange={(option) => {
                    setItemDescriptionQueue(option ? option.value : "");
                  }}
                  value={uniqueItemDescriptionOptions.find(
                    (option) => option.value === itemDescriptionQueue
                  )}
                  isClearable
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="Item - Desc"
                />
                <Select
                  options={uniqueCycleOptions}
                  onChange={(option) => {
                    setCycleQueue(option ? option.value : "");
                  }}
                  value={uniqueCycleOptions.find(
                    (option) => option.value === cycleQueue
                  )}
                  isClearable
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="Cycles"
                />
                <Select
                  options={uniqueShippingDateOptions}
                  onChange={(option) => {
                    setShippingDateQueue(option ? option.value : "");
                  }}
                  value={uniqueShippingDateOptions.find(
                    (option) => option.value === shippingDateQueue
                  )}
                  isClearable
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="Shipping - Date"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {isLoadingItems ? (
            <h1 className="text-center text-[24px] mt-8 flex items-center gap-2 justify-center">
              Please Wait Items Are Loading
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
          ) : items.length <= 0 ? (
            <h1 className="text-center text-[24px] mt-8">
              NO ITEMS FOUND, PLEASE TRY AGAIN LATER or Create Items
            </h1>
          ) : (
            <table className="min-w-full divide-y divide-neutral-900 mt-2">
              <thead className="bg-blue-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-100 tracking-wider"
                  >
                    Item Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-100 tracking-wider"
                  >
                    Item Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-100 tracking-wider"
                  >
                    Cycles
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-100 tracking-wider"
                  >
                    Shipping Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-100 tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-neutral-100 divide-y divide-neutral-400">
                {currentData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.desc}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="">
                        {item.cycle.map((cycle, cycleIndex) => (
                          <span key={cycleIndex}>
                            {cycle.label} {}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formateDate(item.SHPDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center justify-center gap-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() => {
                              setDeletedItemId({
                                itemID: item.id,
                              });
                            }}
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
                              permanently delete this item and remove its data
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <form method="delete">
                              <AlertDialogAction onClick={handleDeleteItems}>
                                Continue
                              </AlertDialogAction>
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => {
                              setItemId({
                                itemID: item.id,
                              });
                            }}
                          >
                            <Pen size={18} className="text-green-700" />
                          </button>
                        </DialogTrigger>
                        <DialogContent
                          onClose={() => {
                            setItemId({ itemID: "" });
                            setItemUpdatedData({
                              desc: "",
                              cycle: [],
                              SHPDate: "",
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

                          {isLoadingItemPerId ? (
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
                                placeholder="Item - Desc"
                                type="text"
                                name="desc"
                                value={itemUpdatedData.desc}
                                onChange={handleUpdateItemChange}
                                className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                              />
                              <Select
                                options={numberOfCycles}
                                value={numberOfCycles.filter((option) =>
                                  itemUpdatedData.cycle.includes(option.label)
                                )}
                                name="cycle"
                                components={animatedOption}
                                closeMenuOnSelect={false}
                                isMulti
                                onChange={handleUpdateItemSelectChange}
                                isClearable
                                className="mb-5"
                                placeholder="Number of Cycle"
                              />

                              <input
                                type="date"
                                name="SHPDate"
                                value={itemUpdatedData.SHPDate}
                                onChange={handleUpdateItemChange}
                                className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                              />
                            </div>
                          )}

                          <DialogFooter>
                            <form method="patch">
                              <button
                                disabled={isUpdatingItem}
                                onClick={handleUpdateItems}
                                className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500"
                              >
                                {isUpdatingItem ? (
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
      </div>

      <ToastContainer />
    </section>
  );
}

export default AddItems;
