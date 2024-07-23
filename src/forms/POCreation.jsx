import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../CSS/Select.css";

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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader,
  Pen,
  Trash,
  ExternalLink,
  FileInput,
  Users,
  ArrowRight,
  Box,
} from "lucide-react";

export function POCreation() {
  /**
   * States to manage the data and rendering conditions
   * 1- createPOData
   * 2- isCreatingPO
   * 3- requestedPFIs
   * 4- isLoadingPFIs
   * 5- requestedPFIsOptions
   * 6- selectedPFI
   * ------------------
   * 7- po
   * 8- isLoadingPO
   *
   *
   *
   */

  const [createPOData, setCreatePOData] = useState({
    PFIId: "",
    PFINo: "",
    CAPPrice: "",
    SHPCost: "",
    quantity: "",
  });
  const [isCreatingPO, setIsCreatingPO] = useState(false);

  const [requestedPFIs, setRequestedPFIs] = useState([]);
  const [isLoadingPFIs, setIsLoadingPFIs] = useState(false);
  const requestedPFIsOptions = requestedPFIs.map((pfi) => ({
    label: pfi.SERIAL,
    value: pfi.id,
  }));
  const [selectedPFI, setSelectedPFI] = useState(null);

  const [po, setPO] = useState([]);
  const [isLoadingPO, setIsLoadingPO] = useState(false);

  const [poTableFilter, setPOTableFilter] = useState(false);

  /**
   * useEffect functions to Fetch Data
   * 1- Fetch requestedPFIs
   * 2- Fetch PO
   */

  useEffect(() => {
    async function loadAllRequestedPFIs() {
      setIsLoadingPFIs(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/pfi"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingPFIs(false);
          return;
        }

        setRequestedPFIs(resData.data);
        setIsLoadingPFIs(false);
      } catch (error) {
        toast.error(resData.message);
        setIsLoadingPFIs(false);
        return;
      }
    }
    loadAllRequestedPFIs();
  }, []);

  useEffect(() => {
    async function loadAllPO() {
      setIsLoadingPO(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/po"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingPO(false);
          return;
        }

        setPO(resData.data);

        setIsLoadingPO(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingPO(false);
        return;
      }
    }
    loadAllPO();
  }, []);

  console.log(po);

  /**
   * hanle onChange functions
   * 1- handleCreatePOChange
   */

  function handleCreatePOChange(event) {
    const { name, value } = event.target;
    setCreatePOData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /**
   * Sending Data to API
   * 1- handleCreatePO
   */

  const handleCreatePO = async (event) => {
    event.preventDefault();
    setIsCreatingPO(true);

    const finalData = {
      ...createPOData,
      PFINo: parseInt(createPOData.PFINo, 10),
      CAPPrice: parseInt(createPOData.CAPPrice, 10),
      SHPCost: parseInt(createPOData.SHPCost, 10),
      quantity: parseInt(createPOData.quantity, 10),
    };

    try {
      const response = await fetch(
        "https://benchmark-innovation-production.up.railway.app/api/po",
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
        setIsCreatingPO(false);
        return;
      }

      toast.success("PO Created Successfully");

      setCreatePOData({
        PFIId: "",
        PFINo: "",
        CAPPrice: "",
        SHPCost: "",
        quantity: "",
      });
      setSelectedPFI(null);
      setIsCreatingPO(false);
    } catch (error) {
      toast.error(error.message);
      setIsCreatingPO(false);
      return;
    }
  };

  /**
   * Animations
   * 1- Select animation
   */

  const animatedOption = makeAnimated();

  console.log(createPOData);

  return (
    <div className="w-full flex flex-col gap-6 border bg-neutral-100 rounded p-4">
      <div className="flex flex-col md:flex-row items-start gap-16 w-full">
        <form method="post" className="w-1/2">
          <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
            <h1 className="mb-4 text-center text-[22px]">Create PO</h1>
            <input
              placeholder="PFI - Number"
              type="number"
              name="PFINo"
              value={createPOData.PFINo}
              onChange={handleCreatePOChange}
              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
            />
            <Select
              options={requestedPFIsOptions}
              value={selectedPFI}
              onChange={(option) => {
                setSelectedPFI(option);
                setCreatePOData((prev) => ({
                  ...prev,
                  PFIId: option ? option.value : "",
                }));
              }}
              components={animatedOption}
              isClearable
              className="mb-5"
              placeholder="Requested - PFI"
            />
            <input
              placeholder="CAP - Price"
              type="number"
              name="CAPPrice"
              value={createPOData.CAPPrice}
              onChange={handleCreatePOChange}
              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
            />
            <input
              placeholder="SHP - Cost"
              type="number"
              name="SHPCost"
              value={createPOData.SHPCost}
              onChange={handleCreatePOChange}
              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
            />
            <input
              placeholder="QTY"
              type="number"
              name="quantity"
              value={createPOData.quantity}
              onChange={handleCreatePOChange}
              className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
            />
            <button
              disabled={isCreatingPO}
              onClick={handleCreatePO}
              className="bg-blue-900 text-white p-3 rounded transition-all duration-300 hover:bg-blue-500"
            >
              {isCreatingPO ? (
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
                "Create PO"
              )}
            </button>
          </div>
        </form>

        <form method="post" className="w-1/2">
          <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
            <h1 className="mb-4 text-center text-[22px]">Confirm PO</h1>
            <Select className="mb-6" placeholder="PO - ID" />
            <input
              placeholder="Order Confirmation Number"
              type="number"
              className="w-full mb-6 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
            />
            <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
              Confirm Order
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col w-full bg-white border shadow rounded-lg p-4 overflow-x-auto">
        <button
          onClick={() => {
            setPOTableFilter(!poTableFilter);
          }}
          className="flex justify-center items-center gap-1 w-[110px] px-3 py-1 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
        >
          Filter
          <motion.span
            animate={{ rotate: poTableFilter ? -180 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <ChevronDown size={20} />
          </motion.span>
        </button>

        <AnimatePresence>
          {poTableFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              style={{ overflow: "hidden" }}
              className="flex justify-between gap-6 mt-4"
            >
              <Select
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="Customer code"
              />
              <Select
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="Item"
              />
              <Select
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="QTY"
              />
              <Select
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="Cycle"
              />
              <Select
                className="w-full custom-select"
                classNamePrefix="reac-select"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                placeholder="PFI - ID"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <table className="min-w-full divide-y divide-neutral-900 mt-2">
          <thead className="bg-gray-200">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
              >
                Customer Code
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
                QTY
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
              >
                Cycle
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
              >
                PFI - ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-800"></tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default POCreation;
