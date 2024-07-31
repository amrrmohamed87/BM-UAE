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
import { Loader, ListChecks } from "lucide-react";

export const PFITable = ({
  isLoadingState,
  fetchedData,
  currentData,
  selectedRows,
  handleCheckboxChange,
  handleUpdatePFI,
  isLoadingSinglePFI,
  pfiData,
  setPFIRequestId,
  isUpdatingPFI,
  updatedData,
  setUpdatedData,
  formateDate,
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
        <h1 className="text-center text-[24px] mt-8">NO PFIs FOUND.</h1>
      ) : (
        <div className="overflow-x-auto lg:overflow-x-visible">
          <table className="min-w-full divide-y divide-neutral-400 mt-2">
            <thead className="bg-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  PFIs
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
                  Quote #
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
                  Unit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  SHPDate
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
                  SHP - Fees
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  PFI - Value
                </th>
                {fetchedData.some((pfi) => !pfi.isDeleted) && (
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
              {currentData.map((pfi, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-150 hover:bg-gray-100 ${
                    selectedRows.includes(pfi) ? "bg-neutral-300" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={(event) => handleCheckboxChange(event, pfi)}
                        checked={selectedRows.includes(pfi)}
                        className="sr-only"
                      />
                      <div
                        className={`w-6 h-6 ${
                          selectedRows.includes(pfi)
                            ? "bg-blue-900"
                            : "bg-white"
                        } border rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 checked:bg-blue-600 checked:border-blue-600 hover:bg-blue-100 hover:border-blue-300`}
                      >
                        {selectedRows.includes(pfi) && (
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
                    {pfi.Customer.customerCapIdNo}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {pfi.PFINo}
                  </td>
                  <td className="px-4 py-6 whitespace-normal text-sm font-medium text-gray-900">
                    <ul className="list-decimal pl-5">
                      {pfi.PFIItems.map((item, index) => (
                        <li key={index}>{item.Items.itemName}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    <ol className="list-decimal pl-5">
                      {pfi.PFIItems.map((item, index) =>
                        item.program.length > 0 ? (
                          <li key={`program-${index}`}>Program</li>
                        ) : item.unit.length > 0 ? (
                          item.unit.map((u, idx) => (
                            <li key={`unit-${index}-${idx}`}>{u.label}</li>
                          ))
                        ) : (
                          <li key={`empty-${index}`}>No Data</li>
                        )
                      )}
                    </ol>
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {pfi.PFIItems.map((item, index) =>
                      item.program.length > 0 ? (
                        item.program.map((p, idx) => (
                          <div key={`date-prog-${index}-${idx}`}>
                            {formateDate(p.SHPDate)}
                          </div>
                        ))
                      ) : item.unit.length > 0 ? (
                        item.unit.map((u, idx) => (
                          <div key={`date-unit-${index}-${idx}`}>
                            {formateDate(u.SHPDate)}
                          </div>
                        ))
                      ) : (
                        <div key={`date-empty-${index}`}>No Date</div>
                      )
                    )}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {pfi.PFIItems.map((item) => item.quantity).join(", ")}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {pfi.PFIItems.map((item, index) => (
                      <ul key={index}>
                        <li>{`$ ${item.SHPFees}`}</li>
                      </ul>
                    ))}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {pfi.PFIItems.map((item, index) => (
                      <ul key={index}>
                        <li>{`$ ${item.price}`}</li>
                      </ul>
                    ))}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {pfi.PFIItems.map((item, index) => (
                      <ul key={index}>
                        <li>{`$ ${item.total}`}</li>
                      </ul>
                    ))}
                  </td>
                  <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                    {`$ ${pfi.PFIValue}`}
                  </td>
                  {!pfi.isDeleted && (
                    <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                      <div className="flex gap-2">
                        <Dialog
                          onClose={() => {
                            setPFIRequestId({
                              id: "",
                            });
                          }}
                        >
                          <DialogTrigger asChild>
                            <button
                              onClick={() => {
                                setPFIRequestId({
                                  id: pfi.id,
                                });
                              }}
                            >
                              <ListChecks size={18} className="text-blue-500" />
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
                            {isLoadingSinglePFI ? (
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
                              pfiData && (
                                <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
                                  <input
                                    placeholder="PFI - Number"
                                    type="number"
                                    name="PFINo"
                                    value={updatedData.PFINo || ""}
                                    className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                                    onChange={(e) =>
                                      setUpdatedData((prev) => ({
                                        ...prev,
                                        PFINo: e.target.value,
                                      }))
                                    }
                                  />
                                  <div>
                                    {pfiData.PFIItems && (
                                      <div className="grid grid-cols-2 gap-8 place-content-center">
                                        {pfiData.PFIItems.map((item, index) => (
                                          <div
                                            key={index}
                                            className=" bg-neutral-100 shadow border p-3 rounded-md flex flex-col justify-center"
                                          >
                                            <h1 className="text-center mb-2">
                                              {item.Items.itemName}
                                            </h1>
                                            <input
                                              type="number"
                                              name="PFIValue"
                                              value={updatedData.PFIValue || ""}
                                              onChange={(e) =>
                                                setUpdatedData((prev) => ({
                                                  ...prev,
                                                  PFIValue: parseInt(
                                                    e.target.value,
                                                    10
                                                  ),
                                                }))
                                              }
                                              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            )}

                            <DialogFooter>
                              <form method="patch">
                                <button
                                  disabled={isUpdatingPFI}
                                  onClick={handleUpdatePFI}
                                  className="px-5 py-2 bg-blue-900 rounded-md text-white transition-all duration-300 hover:bg-blue-500"
                                >
                                  {isUpdatingPFI ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{
                                        repeat: Infinity,
                                        duration: 1,
                                        ease: "linear",
                                      }}
                                      style={{
                                        display: "inline-block",
                                      }}
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

export default PFITable;
