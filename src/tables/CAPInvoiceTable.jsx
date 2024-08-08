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
  CircleAlert,
  CircleCheckBig,
  Info,
  Loader,
  PenBox,
} from "lucide-react";

export const CAPInvoiceTable = ({
  isLoadingState,
  fetchedData,
  currentData,
  selectedRows,
  handleCheckboxChange,
  singleInvoiceData,
  setSingleInvoiceData,
  setInvoiceId,
  isLoadingSingleInvoiceData,
  handleUpdateInvoice,
  isUpdatingInvoice,
}) => {
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
                  Inovices
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
                  Cap Invoice #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Swift #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Status
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-400">
              {currentData.map((invoice, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-150 hover:bg-gray-100 ${
                    selectedRows.includes(invoice)
                      ? "bg-neutral-300"
                      : "bg-white"
                  }`}
                >
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={(event) =>
                          handleCheckboxChange(event, invoice)
                        }
                        checked={selectedRows.includes(invoice)}
                        className="sr-only"
                      />
                      <div
                        className={`w-6 h-6 ${
                          selectedRows.includes(invoice)
                            ? "bg-blue-900"
                            : "bg-white"
                        } border rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 checked:bg-blue-600 checked:border-blue-600 hover:bg-blue-100 hover:border-blue-300`}
                      >
                        {selectedRows.includes(invoice) && (
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
                    {invoice.CAPOrder.PO.PFI.length > 1
                      ? invoice.CAPOrder.PO.PFI.map(
                          (pfi) => pfi.Customer.customerName
                        ).join(", ")
                      : invoice.CAPOrder.PO.PFI.map(
                          (pfi) => pfi.Customer.customerName
                        )}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {invoice.CAPOrder.PO.PFI.length > 1
                      ? invoice.CAPOrder.PO.PFI.map(
                          (pfi) => pfi.Customer.customerCapIdNo
                        ).join(", ")
                      : invoice.CAPOrder.PO.PFI.map(
                          (pfi) => pfi.Customer.customerCapIdNo
                        )}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {invoice.capInvoiceNo}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {invoice.swiftNo ? invoice.swiftNo : "###"}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {invoice.status === "TRANSFERRED" ? (
                      <p className="flex items-center gap-2">
                        <CircleCheckBig size={18} className="text-green-500" />{" "}
                        Transferred
                      </p>
                    ) : (
                      <p className="flex items-center gap-2">
                        <CircleAlert size={18} className="text-red-600" /> Not
                        Transferred
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => {
                              setInvoiceId({
                                id: invoice.id,
                              });
                            }}
                          >
                            <Info size={20} className="text-blue-500" />
                          </button>
                        </DialogTrigger>
                        <DialogContent
                          onClose={() => {
                            setInvoiceId({
                              id: "",
                            });
                            setSingleInvoiceData([]);
                          }}
                          className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[900px]"
                        >
                          <DialogHeader>
                            <DialogTitle className="text-center">
                              Invoice Details
                            </DialogTitle>
                            <DialogDescription className="text-center">
                              View CAP Invoice Details
                            </DialogDescription>
                          </DialogHeader>
                          {isLoadingSingleInvoiceData ? (
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
                            singleInvoiceData &&
                            singleInvoiceData.CAPOrder &&
                            singleInvoiceData.CAPOrder.PO &&
                            singleInvoiceData.CAPOrder.PO.PFI && (
                              <div className="flex flex-col gap-3 h-[500px] md:h-[600px] md:max-h-[600px] lg:h-[620px] lg:max-h-[650px] 2xl:h-[800px] xl:max-h-[800px] overflow-y-auto">
                                <h1 className="text-xl md:text-[22px] font-semibold">
                                  Orders Information
                                </h1>
                                <h1 className="text-center font-semibold">
                                  CAP Order Confirmation Number:{" "}
                                  <span className="text-neutral-700 font-normal">
                                    {
                                      singleInvoiceData.CAPOrder
                                        .orderConfirmationNo
                                    }
                                  </span>
                                </h1>

                                <div className="flex flex-col justify-start md:flex-row md:justify-center gap-2">
                                  <h1 className="font-semibold">
                                    CAP Invoice Number:{" "}
                                    <span className="text-neutral-700 font-normal">
                                      {singleInvoiceData.capInvoiceNo}
                                    </span>
                                  </h1>
                                  <h1 className="font-semibold">
                                    Swift Number:{" "}
                                    <span className="text-neutral-700 font-normal">
                                      {singleInvoiceData.swiftNo
                                        ? singleInvoiceData.swiftNo
                                        : "####"}
                                    </span>
                                  </h1>
                                  <h1 className="font-semibold">
                                    Status:{" "}
                                    <span className="text-neutral-700 font-normal">
                                      {singleInvoiceData.status}
                                    </span>
                                  </h1>
                                </div>
                                <div className=" grid grid-cols-1 md:grid-cols-2 gap-8 place-content-center">
                                  {singleInvoiceData.CAPOrder.PO.PFI.map(
                                    (pfi, index) => (
                                      <div
                                        key={index}
                                        className="bg-gray-100 rounded-lg shadow-md border p-5 grid grid-cols-1 gap-2"
                                      >
                                        <h1 className="font-semibold">
                                          Customer Name:{" "}
                                          <span className="text-neutral-700 font-normal">
                                            {pfi.Customer.customerName}
                                          </span>
                                        </h1>
                                        <h1 className="font-semibold">
                                          CAP ID:{" "}
                                          <span className="text-neutral-700 font-normal">
                                            {pfi.Customer.customerCapIdNo}
                                          </span>
                                        </h1>
                                        <h1 className="font-semibold">
                                          Quote #:{" "}
                                          <span className="text-neutral-700 font-normal">
                                            {pfi.PFINo}
                                          </span>
                                        </h1>
                                        <h1 className="font-semibold">
                                          Items Code:{" "}
                                          <span className="text-neutral-700 font-normal">
                                            {pfi.PFIItems.length > 1
                                              ? pfi.PFIItems.map(
                                                  (item) => item.Items.code
                                                ).join(", ")
                                              : pfi.PFIItems.map(
                                                  (item) => item.Items.code
                                                )}
                                          </span>
                                        </h1>
                                        <h1 className="font-semibold">
                                          Quantity:{" "}
                                          <span className="text-neutral-700 font-normal">
                                            {pfi.PFIItems.length > 1
                                              ? pfi.PFIItems.map(
                                                  (item) => item.quantity
                                                ).join(", ")
                                              : pfi.PFIItems.map(
                                                  (item) => item.quantity
                                                )}
                                          </span>
                                        </h1>
                                        <h1 className="font-semibold">
                                          Total:{" "}
                                          <span className="text-neutral-700 font-normal">
                                            {pfi.PFIItems.length > 1
                                              ? pfi.PFIItems.map(
                                                  (item) => `$ ${item.total}`
                                                ).join(", ")
                                              : pfi.PFIItems.map(
                                                  (item) => `$ ${item.total}`
                                                )}
                                          </span>
                                        </h1>

                                        <h1 className="font-semibold">
                                          PFI Value:{" "}
                                          <span className="text-neutral-700 font-normal">
                                            {`$ ${pfi.PFIValue}`}
                                          </span>
                                        </h1>
                                      </div>
                                    )
                                  )}
                                </div>

                                <div className="flex justify-center">
                                  <hr className="border w-1/2" />
                                </div>
                              </div>
                            )
                          )}
                        </DialogContent>
                      </Dialog>
                      {!invoice.isDeleted && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              onClick={() => {
                                setInvoiceId({
                                  id: invoice.id,
                                });
                              }}
                            >
                              {isUpdatingInvoice ? (
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
                              ) : (
                                <PenBox size={18} className="text-blue-500" />
                              )}
                            </button>
                          </DialogTrigger>
                          <DialogContent
                            onClose={() => {
                              setInvoiceId({
                                id: "",
                              });
                              setSingleInvoiceData([]);
                            }}
                            className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[900px]"
                          >
                            <DialogHeader>
                              <DialogTitle className="text-center">
                                Edit Invoice
                              </DialogTitle>
                              <DialogDescription className="text-center">
                                Make changes to your Invoice here. Click save
                                when you're done.
                              </DialogDescription>
                            </DialogHeader>

                            {isLoadingSingleInvoiceData ? (
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
                              singleInvoiceData && (
                                <div className="flex flex-col gap-3 justify-center">
                                  <input
                                    type="number"
                                    name="capInvoiceNo"
                                    className="w-full py-2 pl-2 pr-2 border rounded-md"
                                    placeholder="Cap Invoice Number"
                                    value={singleInvoiceData.capInvoiceNo || ""}
                                    onChange={(event) =>
                                      setSingleInvoiceData((prev) => ({
                                        ...prev,
                                        capInvoiceNo: event.target.value,
                                      }))
                                    }
                                  />
                                  <input
                                    type="number"
                                    name="swiftNo"
                                    className="w-full py-2 pl-2 pr-2 border rounded-md"
                                    placeholder="Swift Number"
                                    value={singleInvoiceData.swiftNo || ""}
                                    onChange={(event) =>
                                      setSingleInvoiceData((prev) => ({
                                        ...prev,
                                        swiftNo: event.target.value,
                                      }))
                                    }
                                  />
                                </div>
                              )
                            )}
                            <DialogFooter>
                              <form method="patch">
                                <button
                                  disabled={isUpdatingInvoice}
                                  onClick={handleUpdateInvoice}
                                  className="px-5 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500"
                                >
                                  {isUpdatingInvoice ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{
                                        repeat: Infinity,
                                        duration: 1,
                                        ease: "linear",
                                      }}
                                      style={{ display: "inline-block" }}
                                    >
                                      <Loader
                                        className="text-black"
                                        size={24}
                                      />
                                    </motion.div>
                                  ) : (
                                    "Save Changes"
                                  )}
                                </button>
                              </form>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CAPInvoiceTable;
