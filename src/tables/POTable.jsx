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
import { Edit, Loader, Printer } from "lucide-react";

export const POTable = ({
  isLoadingState,
  fetchedData,
  currentData,
  selectedRows,
  handleCheckboxChange,
  formatDate,
  handlePrintPO,
}) => {
  return (
    <div className="flex flex-col w-full my-6 bg-white border shadow rounded-lg p-4">
      {isLoadingState ? (
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
      ) : fetchedData.length <= 0 ? (
        <h1 className="text-center text-[24px] mt-8">NO POs FOUND.</h1>
      ) : (
        <div className="overflow-x-auto lg:overflow-x-visible">
          <table className="min-w-full divide-y divide-neutral-900 mt-2">
            <thead className="bg-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  POs
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
                  CAP - Id
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Serial
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Created At
                </th>
                {fetchedData.some((po) => !po.isDeleted) && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-800">
              {currentData.map((po, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-150 hover:bg-gray-100 ${
                    selectedRows.includes(po) ? "bg-neutral-300" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={(event) => handleCheckboxChange(event, po)}
                        checked={selectedRows.includes(po)}
                        className="sr-only"
                      />
                      <div className="w-6 h-6 bg-white border rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 checked:bg-blue-600 checked:border-blue-600 hover:bg-blue-100 hover:border-blue-300">
                        {selectedRows.includes(po) && (
                          <svg
                            className="w-4 h-4 text-black"
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
                    {po.PFI.length > 1
                      ? po.PFI.map((pfi) => pfi.Customer.customerName).join(
                          ", "
                        )
                      : po.PFI.map((pfi) => pfi.Customer.customerName)}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {po.PFI.length > 1
                      ? po.PFI.map((pfi) => pfi.Customer.customerCapIdNo).join(
                          ", "
                        )
                      : po.PFI.map((pfi) => pfi.Customer.customerCapIdNo)}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {po.SERIAL}
                  </td>
                  <td className="px-4 py-6 whitespace-normal text-sm font-medium text-gray-900">
                    {formatDate(po.createdAt)}
                  </td>
                  {!po.isDeleted && (
                    <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button>
                              <Printer size={18} className="text-red-500" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will archive
                                this PFI and store its data in the archive
                                table.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction onClick={handlePrintPO}>
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button>
                              <Edit size={18} className="text-blue-500" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will archive
                                this PFI and store its data in the archive
                                table.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction>Confirm</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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

export default POTable;
