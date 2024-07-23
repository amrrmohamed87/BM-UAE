import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  ListChecks,
  Loader,
  ShoppingBag,
  Trash,
} from "lucide-react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../../CSS/Select.css";

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
import { Link } from "react-router-dom";

export function PFIReview() {
  /**
   * useState hook to manage data
   * 1- requestedPFIs
   * 2- isLoadingRequestedPFIs
   * 3- uniqueCAPIDOptions
   * 4- uniqueCAPIDQueue
   * 5- uniqueSERIALOptions
   * 6- uniqueSERIALQueue
   * 7- uniqueItemsOptions
   * 8- uniqueItemsQueue
   * ------------------------
   * 9- filterRequestedPFITable
   * 10- rowsPerPage
   * 11- currentPage
   * ------------------------
   * 12- pfiRequestId
   * 13- isDeletingPFIRequest
   * -------------------------
   * 14- isLoadingSinglePFI
   * 15- pfiData
   * 16- reloadTable
   */

  const [requestedPFIs, setRequestedPFIs] = useState([]);
  const [isLoadingRequestedPFIs, setIsLoadingRequestedPFIs] = useState(false);

  const [uniqueCAPIDOptions, setUniqueCAPIDOptions] = useState([]);
  const [uniqueCAPIDQueue, setUniqueCAPIDQueue] = useState("");

  const [uniqueSERIALOptions, setUniqueSERIALOptions] = useState([]);
  const [uniqueSERIALQueue, setUniqueSERIALQueue] = useState("");

  const [uniqueItemsOptions, setUniqueItemsOptions] = useState([]);
  const [uniqueItemsQueue, setUniqueItemsQueue] = useState("");

  const [filterRequestedPFITable, setFilterRequestedPFITable] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const [pfiRequestId, setPFIRequestId] = useState({
    id: "",
  });
  const [isArchivingPFIRequest, setIsArchivingPFIRequest] = useState(false);

  const [pfiData, setPFIDate] = useState([]);
  const [isLoadingSinglePFI, setIsLoadingSinglePFI] = useState(false);

  const [reloadTable, setIsReloadTable] = useState(false);

  /**
   * useEffect fucntions to fetch data
   * 1- fetch requestesPFIs
   * 2- fetch pfiData
   */

  useEffect(() => {
    async function fetchRequestedPFIs() {
      setIsLoadingRequestedPFIs(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/pfi"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingRequestedPFIs(false);
          return;
        }

        setRequestedPFIs(resData.data);

        const uniqueCAPID = [
          ...new Set(resData.data.map((cap) => cap.Customer.customerCapIdNo)),
        ].map((cap) => ({
          label: cap,
          value: cap,
        }));
        setUniqueCAPIDOptions(uniqueCAPID);

        const uniqueSERIAL = [
          ...new Set(resData.data.map((serial) => serial.SERIAL)),
        ].map((serial) => ({
          label: serial,
          value: serial,
        }));
        setUniqueSERIALOptions(uniqueSERIAL);

        const uniqueItems = [
          ...new Set(
            resData.data.flatMap((item) =>
              item.PFIItems.map((itemName) => itemName.Items.itemName)
            )
          ),
        ].map((items) => ({
          label: items,
          value: items,
        }));
        setUniqueItemsOptions(uniqueItems);

        setIsLoadingRequestedPFIs(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingRequestedPFIs(false);
        return;
      }
    }
    fetchRequestedPFIs();
  }, [reloadTable]);

  useEffect(() => {
    async function loadPFIDate() {
      setIsLoadingSinglePFI(true);

      try {
        const response = await fetch(
          `https://benchmark-innovation-production.up.railway.app/api/pfi/${pfiRequestId.id}`
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingSinglePFI(false);
          return;
        }

        setPFIDate(resData);
        setIsLoadingSinglePFI(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingSinglePFI(false);
        return;
      }
    }
    if (pfiRequestId.id) {
      loadPFIDate();
    }
  }, [pfiRequestId]);

  /**
   * Function to Deal with APIs
   * 1- handleSoftDeleteRequestedPFI
   */

  const handleSoftDeleteRequestedPFI = async () => {
    setIsArchivingPFIRequest(true);

    try {
      const response = await fetch(
        `https://benchmark-innovation-production.up.railway.app/api/pfi/soft/${pfiRequestId.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.message);
        setIsArchivingPFIRequest(false);
        return;
      }

      toast.success("PFI Archived Successfully");

      setIsReloadTable(!reloadTable);
      setPFIRequestId({
        id: "",
      });
      setIsArchivingPFIRequest(false);
    } catch (error) {
      toast.error(error.message);
      setIsArchivingPFIRequest(false);
      return;
    }
  };

  /**
   * Functions and variables
   * 1- filteredPFIs
   * 2- totalPages
   * 3- currentData
   */

  const filteredPFIs = requestedPFIs.filter(
    (pfi) =>
      (!uniqueCAPIDQueue ||
        pfi.Customer.customerCapIdNo.toLowerCase() ===
          uniqueCAPIDQueue.toLowerCase()) &&
      (!uniqueItemsQueue ||
        pfi.PFIItems.map((item) => item.Items.itemName.toLowerCase()) ===
          uniqueItemsQueue.toLowerCase()) &&
      (!uniqueSERIALQueue ||
        pfi.SERIAL.toLowerCase() === uniqueSERIALQueue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPFIs.length / rowsPerPage);

  const currentData = filteredPFIs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const formateDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formateDateToUpdateInfo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  /**
   * handleOnChange functions
   * 1- handleRowsPerPage
   */

  function handleRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  }

  /**
   * Custome Components
   * 1- Pagination
   */

  const Pagination = () => {
    return (
      <div className="flex justify-end items-center gap-6 mt-6">
        <p>
          Rows per Page:
          <input
            type="number"
            value={rowsPerPage}
            onChange={handleRowsPerPage}
            className="w-12 pl-3 border-2 rounded-md"
          />
        </p>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <button
            className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-200 hover:bg-blue-600"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            <ChevronsLeft size={20} className="text-white" />
          </button>
          <button
            className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <ChevronRight size={20} className="text-white" />
          </button>
          <button
            className="px-2 py-1 rounded-md border-2 bg-blue-900 transition-all duration-300 hover:bg-blue-600"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            <ChevronsRight size={20} className="text-white" />
          </button>
        </div>
      </div>
    );
  };

  console.log(pfiData);

  return (
    <section className="bg-[#F5F5F5] flex flex-col p-10 ml-20 w-full gap-5">
      <div className="flex flex-col gap-3 md:flex-row justify-center md:justify-start items-center md:gap-12">
        <div>
          <h1 className="text-3xl text-neutral-900">Proforma Review</h1>
          <p className="text-md text-neutral-500 mt-2">
            Review all requested PFIs and edit them through the following table.
          </p>
        </div>

        <div className="bg-white p-2 border shadow-md rounded-md w-80">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <ShoppingBag size={20} className="text-blue-700" /> Total Requests
          </h1>
          <div className="mb-3 text-neutral-900 font-semibold text-[28px]">
            {isLoadingRequestedPFIs ? (
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
              requestedPFIs.length
            )}
          </div>
          <Link
            to="/CAP-pfi-request"
            className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
          >
            New Request <ArrowRight size={16} className="mt-1" />
          </Link>
        </div>

        {/* <div className="bg-white p-2 border shadow-md rounded-md w-80">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <Box size={20} className="text-blue-700" /> Items
          </h1>
          <div className="mb-3 text-neutral-900 font-semibold text-[28px]">
            {isLoadingItems ? (
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
              items.length
            )}
          </div>
          <Link
            to="/add-items"
            className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
          >
            Manage Items <ArrowRight size={16} className="mt-1" />
          </Link>
        </div> */}
      </div>

      <div className="flex flex-col w-full my-6 bg-white border shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              setFilterRequestedPFITable(!filterRequestedPFITable);
            }}
            className="flex justify-center items-center gap-1 w-[110px] px-3 py-2 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
          >
            Filter
            <motion.span
              animate={{ rotate: filterRequestedPFITable ? -180 : 0 }}
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
          {filterRequestedPFITable && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              style={{ overflow: "hidden" }}
              className="flex justify-between gap-6 mt-4"
            >
              <Select
                options={uniqueCAPIDOptions}
                value={uniqueCAPIDOptions.find(
                  (option) => option.value === uniqueCAPIDQueue
                )}
                onChange={(option) => {
                  setUniqueCAPIDQueue(option && option.value);
                }}
                isClearable
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="CAP - ID"
              />
              <Select
                options={uniqueItemsOptions}
                value={uniqueItemsOptions.find(
                  (option) => option.value === uniqueItemsQueue
                )}
                onChange={(option) => {
                  setUniqueItemsQueue(option && option.value);
                }}
                isClearable
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="Item Name"
              />
              <Select
                options={uniqueSERIALOptions}
                value={uniqueSERIALOptions.find(
                  (option) => option.value === uniqueSERIALQueue
                )}
                onChange={(option) => {
                  setUniqueSERIALQueue(option && option.value);
                }}
                isClearable
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="PFI - Serial"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoadingRequestedPFIs ? (
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
        ) : requestedPFIs.length <= 0 ? (
          <h1 className="text-center text-[24px] mt-8">NO PFIs FOUND.</h1>
        ) : (
          <table className="min-w-full divide-y divide-neutral-900 mt-2">
            <thead className="bg-gray-200">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  CAP - Id
                </th>
                <th
                  scope="col"
                  className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Serial
                </th>
                <th
                  scope="col"
                  className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                >
                  Item
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
                <tr key={index}>
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
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() =>
                              setPFIRequestId({
                                id: pfi.id,
                              })
                            }
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
                              This action cannot be undone. This will archive
                              this PFI and store its data in the archive table.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() =>
                                setPFIRequestId({
                                  id: "",
                                })
                              }
                            >
                              Cancel
                            </AlertDialogCancel>
                            <form method="delete">
                              <AlertDialogAction
                                disabled={isArchivingPFIRequest}
                                onClick={handleSoftDeleteRequestedPFI}
                              >
                                {isArchivingPFIRequest ? (
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
                                  "Archive"
                                )}
                              </AlertDialogAction>
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Dialog>
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
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit PFI</DialogTitle>
                            <DialogDescription>
                              Make changes to your Request here. Click save when
                              you're done.
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
                            <div className="grid gap-4 py-4">
                              <input
                                placeholder="PFI - Number"
                                type="number"
                                name="QTY"
                                className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                              />
                              <input
                                placeholder="SHP - Fees"
                                type="number"
                                name="QTY"
                                className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                              />
                              <input
                                placeholder="Price"
                                type="number"
                                name="QTY"
                                className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                              />
                            </div>
                          )}

                          <DialogFooter>
                            <button>Save changes</button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination />
      </div>
      <h1 className="text-center text-sm text-neutral-400 mb-2">
        @2024 ApexBuild, Benchmark - All rights reserved
      </h1>
      <ToastContainer />
    </section>
  );
}

export default PFIReview;
