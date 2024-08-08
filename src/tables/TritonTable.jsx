import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, ListChecks, PenBox } from "lucide-react";

export const TritonTable = ({
  cols,
  isLoadingState,
  fetchedData,
  currentData,
  selectedRows,
  handleCheckboxChange,
  formatDate,
}) => {
  return (
    <div className="flex flex-col w-full my-6 bg-white border shadow rounded-lg p-4">
      {isLoadingState ? (
        <h1 className="text-center text-[24px] mt-8 flex items-center gap-2 justify-center">
          Please Wait Orders Are Loading
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
      ) : fetchedData.length <= 0 ? (
        <h1 className="text-center text-[24px] mt-8">NO ORDERS FOUND.</h1>
      ) : (
        <div className="overflow-x-auto lg:overflow-x-visible">
          <table className="min-w-full divide-y divide-neutral-400 mt-2">
            <thead className="bg-gray-200">
              <tr>
                {cols.map((col, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-400">
              {currentData.length > 0 &&
                currentData.map((order, index) => {
                  const { CAPOrder } = order || {};
                  const { PO } = CAPOrder || {};
                  const { PFI } = PO || {};

                  const customerNames = (PFI || [])
                    .flatMap((pfi) => pfi.Customer?.customerName || [])
                    .join(", ");
                  const customerCapIdNos = (PFI || [])
                    .flatMap((pfi) => pfi.Customer?.customerCapIdNo || [])
                    .join(", ");
                  const itemCodes = (PFI || [])
                    .flatMap((pfi) =>
                      (pfi.PFIItems || []).map(
                        (item) => item.Items?.code || "N/A"
                      )
                    )
                    .join(", ");
                  const itemDescs = (PFI || [])
                    .flatMap((pfi) =>
                      (pfi.PFIItems || []).map(
                        (item) => item.Items?.desc || "N/A"
                      )
                    )
                    .join(", ");
                  const cycleLabels = (PFI || [])
                    .flatMap((pfi) =>
                      (pfi.PFIItems || []).flatMap((item) =>
                        (item.Items?.Cycles || []).map(
                          (cycle) => cycle.label || "N/A"
                        )
                      )
                    )
                    .join(", ");
                  const cycleDates = (PFI || [])
                    .flatMap((pfi) =>
                      (pfi.PFIItems || []).flatMap((item) =>
                        (item.Items?.Cycles || []).map(
                          (cycle) => formatDate(cycle.SHPDate) || "N/A"
                        )
                      )
                    )
                    .join(", ");

                  return (
                    <tr
                      key={index}
                      className={`transition-all duration-150 hover:bg-gray-100 ${
                        selectedRows.includes(order)
                          ? "bg-neutral-300"
                          : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                        <label className="relative flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            onChange={(event) =>
                              handleCheckboxChange(event, order)
                            }
                            checked={selectedRows.includes(order)}
                            className="sr-only"
                          />
                          <div
                            className={`w-6 h-6 ${
                              selectedRows.includes(order)
                                ? "bg-blue-900"
                                : "bg-white"
                            } border rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 checked:bg-blue-600 checked:border-blue-600 hover:bg-blue-100 hover:border-blue-300`}
                          >
                            {selectedRows.includes(order) && (
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
                        {customerNames}
                      </td>
                      <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                        {customerCapIdNos}
                      </td>
                      <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                        {itemCodes}
                      </td>
                      <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                        {itemDescs}
                      </td>
                      <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                        {cycleLabels}
                      </td>
                      <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                        {cycleDates}
                      </td>
                      {cols.includes("Action") && (
                        <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <button>
                                  <PenBox size={18} className="text-blue-500" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[900px]">
                                <DialogHeader>
                                  <DialogTitle>Edit PFI</DialogTitle>
                                  <DialogDescription>
                                    Make changes to your Request here. Click
                                    save when you're done.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <form method="patch">
                                    <button className="px-5 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500">
                                      Save Changes
                                    </button>
                                  </form>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TritonTable;
