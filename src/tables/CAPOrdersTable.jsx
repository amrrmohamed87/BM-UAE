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

export const CAPOrdersTable = ({
  isLoadingState,
  fetchedData,
  currentData,
  selectedRows,
  handleCheckboxChange,
  formatDate,
}) => {
  console.log(fetchedData);
  console.log(currentData);
  return (
    <div className="flex flex-col w-full my-6 bg-white border shadow rounded-lg p-4">
      {isLoadingState ? (
        <h1 className="text-center text-[24px] mt-8 flex items-center gap-2 justify-center">
          Please Wait CAP Orders Are Loading
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
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Orders
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Customer Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  CAP ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Order Confirmarion #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Issue Date
                </th>
                {fetchedData.some((orders) => !orders.isDeleted) && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-400">
              {currentData.map((order, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-150 hover:bg-gray-100 ${
                    selectedRows.includes(order) ? "bg-neutral-300" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={(event) => handleCheckboxChange(event, order)}
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
                    {order.PO.PFI.length > 1
                      ? order.PO.PFI.map(
                          (pfi) => pfi.Customer.customerName
                        ).join(", ")
                      : order.PO.PFI.map((pfi) => pfi.Customer.customerName)}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {order.PO.PFI.length > 1
                      ? order.PO.PFI.map(
                          (pfi) => pfi.Customer.customerCapIdNo
                        ).join(", ")
                      : order.PO.PFI.map((pfi) => pfi.Customer.customerCapIdNo)}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {order.orderConfirmationNo}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {formatDate(order.createdAt)}
                  </td>
                  {!order.isDeleted && (
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
                                Make changes to your Request here. Click save
                                when you're done.
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CAPOrdersTable;
