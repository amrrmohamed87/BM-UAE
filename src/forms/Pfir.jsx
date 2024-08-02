import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import makeAnimated from "react-select/animated";

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

import { Box, Loader, Trash } from "lucide-react";
export function Pfir({ itemsOptions, customerOptions }) {
  /**
   * useState hook to manage and update data
   * 1- selectedCustomerCode
   * 2- selectedItem
   * 3- itemId
   * 4- unitData
   * 5- isLoadingUnitData
   * 6- unitDataOptions
   * 7- selectedUnit
   * 8- selectedItemsData
   * 9- finalRequestData
   * 10- isRequestingPFI
   *
   */

  const [selectedCustomerCode, setSelectedCustomerCode] = useState(null);
  const [selectedItem, setSelectedItem] = useState([]);

  const [itemId, setItemId] = useState({
    id: "",
  });

  const [unitData, setUnitData] = useState([]);

  const [isLoadingUnitData, setIsLoadingUnitData] = useState(false);
  const uniqueCycles = unitData.flatMap((unit) =>
    unit.Cycles.map((cycle) => ({
      label: cycle.label,
      value: cycle.SHPDate,
    }))
  );
  const program = {
    label: "program",
    value: [...uniqueCycles],
  };
  const cyclesOptions = [...uniqueCycles, program];
  const [selectedUnit, setSelectedUnit] = useState([]);

  const [selectedItemsData, setSelectedItemsData] = useState({
    item: {
      itemId: "",
      itemName: "",
      QTY: "",
    },
    unit: [],
  });
  const [addedItems, setAddedItems] = useState([]);
  const [isAddingItems, setIsAddingItems] = useState(false);

  const [finalRequestData, setFinalRequestData] = useState({
    customerId: "",
    PFINo: "",
    PFIItems: [],
  });
  const [isRequestingPFI, setIsrequestingPFI] = useState(false);

  /**
   * useEffect hook to fetch data
   * 1- Fetch UnitPerItem
   */

  useEffect(() => {
    async function loadUnitPerItem() {
      setIsLoadingUnitData(true);

      try {
        const response = await fetch(
          `https://benchmark-innovation-production.up.railway.app/api/items/${itemId.id}`
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingUnitData(false);
          return;
        }

        setUnitData([resData]);
        setIsLoadingUnitData(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingUnitData(false);
        return;
      }
    }
    if (itemId.id) {
      loadUnitPerItem();
    }
  }, [itemId]);

  /**
   * Dealing with data Functions
   * 1- handleAddItems
   * 2- handleDeleteItem
   * 3- formatDate
   * 4- formatDateTwo
   */

  const handleAddItems = (event) => {
    event.preventDefault();
    setIsAddingItems(true);

    if (!selectedItemsData) {
      toast.error("please fill the form first, then try again");
      setIsAddingItems(false);
      return;
    }

    let unfilledInputs = [];
    Object.entries(selectedItemsData).forEach(([key, obj]) => {
      Object.entries(obj).forEach(([inputKey, value]) => {
        if (value === "") {
          unfilledInputs.push(`${inputKey}`);
        }
      });
    });

    if (unfilledInputs.length > 0) {
      toast.error(
        `Please fill the following inputs: ${unfilledInputs.join(", ")}`
      );
      setIsAddingItems(false);
      return;
    }

    const data = {
      item: {
        itemId: selectedItemsData.item.itemId,
        itemName: selectedItemsData.item.itemName,
        QTY: parseInt(selectedItemsData.item.QTY, 10),
      },
      unit: Array.isArray(selectedUnit) ? selectedUnit : [],
    };

    setAddedItems((prev) => [...prev, data]);

    setSelectedItem(null);
    setSelectedUnit([]);
    setSelectedItemsData({
      item: { itemId: "", itemName: "", QTY: "" },
      unit: [],
    });
    setItemId({ id: "" });
    setIsAddingItems(false);
  };

  const handleDeleteItem = (itemToDelete) => {
    setAddedItems((prev) => prev.filter((_, index) => index !== itemToDelete));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formateDateTwo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  /**
   * Send Data to API
   * 1- CreatePFI
   */

  const handleCreatePFI = async (event) => {
    setIsrequestingPFI(true);

    const transformAddedItems = (items) => {
      return items.map((item) => {
        const transformedItem = {
          itemId: item.item.itemId,
          quantity: item.item.QTY,
        };

        const programUnit = item.unit.find(
          (program) => program.label === "program"
        );

        if (programUnit) {
          transformedItem.program = programUnit.value.map((val) => ({
            label: val.label,
            SHPDate: formateDateTwo(val.value),
          }));
        } else {
          transformedItem.unit = item.unit.map((cycle) => ({
            label: cycle.label,
            SHPDate: formateDateTwo(cycle.value),
          }));
        }

        return transformedItem;
      });
    };
    //console.log(transformAddedItems(addedItems));

    const finalData = {
      ...finalRequestData,
      PFIItems: transformAddedItems(addedItems),
    };

    console.log(finalData);
    try {
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
        setIsrequestingPFI(false);
        console.log(resData.message);
        return;
      }

      toast.success("PFI Created Successfully");

      setAddedItems([]);
      setSelectedCustomerCode(null);
      setFinalRequestData({
        customerId: "",
        PFINo: "",
        PFIItems: [],
      });

      setIsrequestingPFI(false);
    } catch (error) {
      toast.error(error.message);
      setIsrequestingPFI(false);
      return;
    }
  };

  /**
   * Animations
   * 1- Select animation
   */

  const animatedOption = makeAnimated();

  /**
   * console log
   */

  //console.log(selectedUnit);
  //console.log(selectedItemsData);
  //console.log(addedItems);

  return (
    <div className="flex flex-col items-center w-full gap-10">
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10">
        <form method="post" className="w-full md:w-2/3">
          <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
            <h1 className="mb-4 text-center text-[22px]">Create PFI</h1>
            <Select
              options={customerOptions}
              value={selectedCustomerCode}
              onChange={(selectedOption) => {
                setSelectedCustomerCode(selectedOption);
                setFinalRequestData((prev) => ({
                  ...prev,
                  customerId: selectedOption ? selectedOption.value : "",
                }));
              }}
              isClearable
              className="mb-5"
              placeholder="Customer Code"
            />
            <input
              placeholder="PFI Number"
              type="number"
              name="PFINo"
              value={finalRequestData.PFINo}
              onChange={(event) => {
                setFinalRequestData((prev) => ({
                  ...prev,
                  PFINo: event.target.value,
                }));
              }}
              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
            />
            <Select
              options={itemsOptions}
              value={selectedItem}
              onChange={(selectedOption) => {
                setSelectedItem(selectedOption);

                // Reset cycle selection when item selection changes
                setSelectedUnit([]);

                setSelectedItemsData((prev) => ({
                  ...prev,
                  item: selectedOption
                    ? {
                        ...prev.item,
                        itemId: selectedOption.value,
                        itemName: selectedOption.label,
                      }
                    : { itemId: "", itemName: "", QTY: "" }, // Reset item data if selection is cleared
                }));

                // Fetch new unit data or reset it
                if (selectedOption) {
                  setItemId({ id: selectedOption.value });
                } else {
                  setUnitData([]); // Reset unit data if no item is selected
                }
              }}
              isClearable
              className="mb-5"
              placeholder="Item Description & Code"
            />

            <input
              placeholder="QTY"
              type="number"
              name="QTY"
              value={selectedItemsData.item.QTY}
              onChange={(event) => {
                setSelectedItemsData((prev) => ({
                  ...prev,
                  item: { ...prev.item, QTY: event.target.value },
                }));
              }}
              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
            />

            <Select
              options={cyclesOptions}
              value={selectedUnit}
              onChange={(selectedOpt) => {
                const programSelected = selectedOpt.some(
                  (opt) => opt.label === "program"
                );

                if (programSelected && selectedOpt.length > 0) {
                  setSelectedUnit([program]);
                  setSelectedItemsData((prev) => ({
                    ...prev,
                    unit: [program],
                  }));
                } else {
                  setSelectedUnit(selectedOpt);
                  setSelectedItemsData((prev) => ({
                    ...prev,
                    unit: selectedOpt,
                  }));
                }
              }}
              isMulti
              isOptionDisabled={(opt) => {
                const uniqueSelectedCycles = selectedUnit.some(
                  (opt) => opt.label !== "program"
                );

                const programChoice = selectedUnit.some(
                  (opt) => opt.label === "program"
                );

                if (uniqueSelectedCycles && opt.label === "program")
                  return true;

                if (programChoice && opt.label !== "program") return true;

                return false;
              }}
              components={animatedOption}
              closeMenuOnSelect={false}
              isClearable
              className="mb-5"
              placeholder="Number of Cycle"
            />

            <button
              disabled={isAddingItems}
              onClick={handleAddItems}
              className="bg-blue-900 text-white p-3 rounded transition-all duration-300 hover:bg-blue-500"
            >
              {isAddingItems ? (
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
                "Add Item"
              )}
            </button>
          </div>
        </form>

        <div className="bg-white p-4 wfull md:w-1/4 border shadow-md rounded-md">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <Box size={20} className="text-blue-700" />
            Selected Items
          </h1>
          <p className="mb-3 text-neutral-900 font-semibold text-[28px]">
            {addedItems.length}
          </p>

          {addedItems.length > 0 && (
            <form method="post" className="flex justify-center">
              <button
                className=" text-blue-900 px-3 py-2 rounded transition-all duration-300 hover:bg-blue-900 hover:text-white"
                disabled={isRequestingPFI}
                onClick={handleCreatePFI}
              >
                {isRequestingPFI ? (
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
                  "Confirm Items"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {addedItems.length > 0 && (
        <div className="w-full overflow-x-auto lg:overflow-x-visible">
          <table className="min-w-full divide-y divide-neutral-900 mt-2">
            <thead className="bg-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Item Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Unit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  SHPDate
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-800">
              {addedItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {item.item.itemName}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {item.unit
                      .slice()
                      .reverse()
                      .map((unit) => unit.label)
                      .join(", ")}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {item.unit
                      .slice()
                      .reverse()
                      .map((unit) =>
                        unit.label === "program"
                          ? unit.value
                              .map((date) => formateDateTwo(date.value))
                              .join(", ")
                          : formateDateTwo(unit.value)
                      )
                      .join(", ")}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {item.item.QTY}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
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
                            This action cannot be undone. This will archive this
                            PFI and store its data in the archive table.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteItem(index)}
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Pfir;

/**
 *  <Select
              options={unitDataOptions}
              value={selectedUnit}
              isMulti
              onChange={(selectedOptions) => {
                // Check if 'Program' is selected among the new options
                const programSelected = selectedOptions.some(
                  (option) => option.label === "Program"
                );

                if (programSelected && selectedOptions.length === 1) {
                  // If 'Program' is selected and it's the only selection, set it
                  setSelectedUnit(selectedOptions);
                } else {
                  // Otherwise, filter out 'Program' and allow multiple selections of individuals
                  setSelectedUnit(
                    selectedOptions.filter(
                      (option) => option.label !== "Program"
                    )
                  );
                }
              }}
              isOptionDisabled={(option) => {
                // Check if any individual option is already selected
                const anyIndividualSelected = selectedUnit.some(
                  (opt) => opt.label !== "Program"
                );

                // Disable 'Program' if any individual option is selected
                if (anyIndividualSelected && option.label === "Program") {
                  return true;
                }
                // Disable individual options if 'Program' is selected
                if (
                  selectedUnit.some((opt) => opt.label === "Program") &&
                  option.label !== "Program"
                ) {
                  return true;
                }
                return false;
              }}
              components={animatedOption}
              closeMenuOnSelect={false}
              isClearable
              className="mb-5"
              placeholder="Number of Cycle"
            />
 */
