import { useTritonPrepare } from "@/hooks/useTritonPrepare";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Box, Search, SearchCheck } from "lucide-react";

export const TritonPrepareForm = ({
  plannedSHPDate,
  setPlannedSHPDate,
  setSearchDate,
  itemsOptions,
  selectedItems,
  setSelectedItems,
  itemsData,
  setItemsData,
  setStaticData,
  staticData,
  CustomersOptions,
  selectedCustomer,
  setSelectedCustomer,
  selectedItemId,
  setSelectedItemId,
  customerOptions,
  setCustomerOptions,
  //itemsss,
}) => {
  const handleStaticChange = (event) => {
    const { name, value } = event.target;
    setStaticData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDynamicDataChange = (event) => {
    const { name, value } = event.target;
    setItemsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="flex flex-col items-center w-full gap-10">
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10">
        <form method="post" className="w-full md:w-2/3">
          <div className="flex flex-col gap-6 bg-white rounded shadow border p-4 w-full">
            <h1 className="text-center text-xl font-semiBold">
              Traceability Entry
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 place-content-start gap-3">
              <div className="flex items-center border rounded-md">
                <input
                  type="date"
                  value={plannedSHPDate.date}
                  onChange={(event) => {
                    setPlannedSHPDate((prev) => ({
                      ...prev,
                      date: event.target.value,
                    }));
                    setStaticData((prev) => ({
                      ...prev,
                      plannedSHPDate: event.target.value,
                    }));
                  }}
                  className="w-full px-3 py-1.5 border-none focus:outline-none focus:border-transparent"
                />
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    setSearchDate(plannedSHPDate.date);
                  }}
                >
                  <Search
                    size={18}
                    className="mr-2 hover:text-green-500 transition-all duration-200"
                  />
                </button>
              </div>
              <input
                type="number"
                placeholder="Commercial Invoice #"
                name="comInvoice"
                value={staticData.comInvoice}
                onChange={handleStaticChange}
                className="w-full pl-2 py-1.5 border rounded-md"
              />
            </div>

            <input
              type="text"
              placeholder="Master AWB #"
              name="masterAWB"
              value={staticData.masterAWB}
              onChange={handleStaticChange}
              className="w-full border rounded-md pl-2 py-1.5"
            />

            <div className="flex justify-center w-1/2">
              <hr className="border-2" />
            </div>

            <Select
              options={itemsOptions}
              value={selectedItems}
              onChange={(option) => {
                setSelectedItems(option);
                setItemsData((prev) => ({
                  ...prev,
                  itemId: option ? option.value : "",
                  unit: option ? option.unit : "",
                }));
                setSelectedItemId(option && option.value);
              }}
              isClearable
              placeholder="Items"
            />

            <Select
              options={CustomersOptions}
              value={selectedCustomer}
              onChange={(option) => {
                setSelectedCustomer(option);
                setItemsData((prev) => ({
                  ...prev,
                  customerId: option ? option.value : "",
                }));
              }}
              isClearable
              placeholder="Customer - CAP ID"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 place-content-start gap-3">
              <input
                type="number"
                placeholder="QTY"
                name="quantity"
                value={itemsData.quantity}
                onChange={handleDynamicDataChange}
                className="w-full px-2 py-1.5 border rounded-md"
              />
              <input
                type="number"
                placeholder="AWB #"
                name="AWB"
                value={itemsData.AWB}
                onChange={handleDynamicDataChange}
                className="w-full pl-2 py-1.5 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 place-content-start gap-3">
              <input
                type="number"
                placeholder="Kit #"
                name="kitNo"
                value={itemsData.kitNo}
                onChange={handleDynamicDataChange}
                className="w-full px-2 py-1.5 border rounded-md"
              />
              <input
                type="number"
                placeholder="Basic Value"
                name="basicUnitPrice"
                value={itemsData.basicUnitPrice}
                onChange={handleDynamicDataChange}
                className="w-full pl-2 py-1.5 border rounded-md"
              />
            </div>

            <button className="bg-blue-900 text-white p-3 rounded transition-all duration-300 hover:bg-blue-500">
              Add Item
            </button>
          </div>
        </form>

        <div className="bg-white p-4 wfull md:w-1/4 border shadow-md rounded-md">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <Box size={20} className="text-blue-700" />
            Selected Items
          </h1>
          <p className="mb-3 text-neutral-900 font-semibold text-[28px]">
            added Items Length
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-auto lg:overflow-x-visible"></div>
    </div>
  );
};

export default TritonPrepareForm;
