export const PFITables = ({
  filterChange,
  filterTable,
  loading,
  data,
  loadingMessage,
  childern,
}) => {
  return (
    <div className="flex flex-col w-full my-6 bg-white border shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={filterChange}
          className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
        >
          Filter
          <motion.span
            animate={{ rotate: filterTable ? -180 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <ChevronDown size={20} />
          </motion.span>
        </button>

        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex justify-center items-center gap-1 px-10 py-2 bg-green-500 text-white rounded-md transition-all duration-300 hover:bg-green-900">
                DownLoad <Download size={18} />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Download Data</DialogTitle>
                <DialogDescription className="mt-2">
                  Please select your preferred format to download the data:
                  Excel or PDF.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="mt-4">
                <button className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-emerald-700 text-white rounded-md transition-all duration-300 hover:bg-emerald-900">
                  Excel
                </button>
                <button className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-red-700 text-white rounded-md transition-all duration-300 hover:bg-red-900">
                  PDF
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <AnimatePresence>
        {filterTable && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            style={{ overflow: "hidden" }}
            className="flex justify-between gap-6 mt-4"
          >
            {childern}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <h1 className="text-center text-[24px] mt-8 flex items-center gap-2 justify-center">
          Please Wait Archived PFIs Are Loading
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
      ) : data.length <= 0 ? (
        <h1 className="text-center text-[24px] mt-8">{loadingMessage}</h1>
      ) : (
        <table className="min-w-full divide-y divide-neutral-900 mt-2">
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
                Serial
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
              <th
                scope="col"
                className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-800">
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
                    <div className="w-6 h-6 bg-white border rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 checked:bg-blue-600 checked:border-blue-600 hover:bg-blue-100 hover:border-blue-300">
                      {selectedRows.includes(pfi) && (
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
                  {pfi.Customer.customerCapIdNo}
                </td>
                <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                  {pfi.SERIAL}
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
                <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                  <div className="flex gap-2">hi</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination />
    </div>
  );
};
