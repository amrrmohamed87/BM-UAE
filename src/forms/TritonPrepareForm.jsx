import { useTritonPrepare } from "@/hooks/useTritonPrepare";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Box } from "lucide-react";

export const TritonPrepareForm = () => {
  return (
    <div className="flex flex-col items-center w-full gap-10">
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10">
        <form method="post" className="w-full md:w-2/3">
          <div className="flex flex-col gap-6 bg-white rounded shadow border p-4 w-full">
            <h1 className="text-center text-xl font-semiBold">
              Traceability Entry
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 place-content-start gap-3">
              <input
                type="date"
                className="w-full px-2 py-1.5 border rounded-md"
              />
              <input
                type="number"
                placeholder="Commercial Invoice #"
                className="w-full pl-2 py-1.5 border rounded-md"
              />
            </div>

            <input
              type="number"
              placeholder="Master AWB #"
              className="w-full border rounded-md pl-2 py-1.5"
            />

            <Select placeholder="Items" />

            <Select placeholder="Customer - CAP ID" />

            <div className="grid grid-cols-1 md:grid-cols-2 place-content-start gap-3">
              <input
                type="number"
                placeholder="QTY"
                className="w-full px-2 py-1.5 border rounded-md"
              />
              <input
                type="number"
                placeholder="AWB #"
                className="w-full pl-2 py-1.5 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 place-content-start gap-3">
              <input
                type="number"
                placeholder="Kit #"
                className="w-full px-2 py-1.5 border rounded-md"
              />
              <input
                type="number"
                placeholder="Basic Value"
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
