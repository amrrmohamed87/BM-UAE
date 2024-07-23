import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { ArrowRight, ShoppingBag, Loader, Box } from "lucide-react";
export function POCreation() {
  /**
   * useState to manage data
   * 1- requestedPFIs
   * 2- isLoadingRequestedPFIs
   * ---------------------
   * 3- pfiOptions
   * 4- selectedPFI
   * 5- poData
   * 6- isCreatingPO
   *
   */

  const [requestedPFIs, setRequestedPFIs] = useState([]);
  const [isLoadingRequestedPFIs, setIsLoadingRequestedPFIs] = useState(false);

  const pfiOptions = requestedPFIs.map((option) => ({
    label: option.PFIName,
    value: option.id,
  }));
  const [selectedPFI, setSelectedPFI] = useState([""]);

  const [poData, setPOData] = useState({
    PFIId: [],
  });
  const [isCreatingPO, setIsCreatingPO] = useState(false);

  /**
   * useEffect fucntions to fetch data
   * 1- fetch requestesPFIs
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

        setIsLoadingRequestedPFIs(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingRequestedPFIs(false);
        return;
      }
    }
    fetchRequestedPFIs();
  }, []);

  /**
   * Sending data to the APIs
   * 1- handleCreatPO
   */

  const handleCreatPO = async (event) => {
    event.preventDefault();
    setIsCreatingPO(true);

    try {
      const response = await fetch(
        "https://benchmark-innovation-production.up.railway.app/api/po",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(poData),
        }
      );
      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.message);
        setIsCreatingPO(false);
        return;
      }

      toast.success("PO Created Succefully");

      setPOData({
        PFIId: [],
      });
      setSelectedPFI([]);
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

  console.log(requestedPFIs);

  return (
    <section className="bg-[#F5F5F5] flex flex-col p-10 ml-20 w-full gap-5">
      <div className="flex flex-col gap-3 md:flex-row justify-center md:justify-start items-center md:gap-12">
        <div>
          <h1 className="text-3xl text-neutral-900">PO Creation</h1>
          <p className="text-md text-neutral-500 mt-2">
            Create PO for the requested PFIs through the following form.
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
            to="/CAP-pfi-review"
            className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
          >
            Review PFIs <ArrowRight size={16} className="mt-1" />
          </Link>
        </div>
      </div>
      <div className="w-full border p-6 border-neutral-500/50 bg-neutral-100 rounded">
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10">
          <form method="post" className="w-full md:w-2/3">
            <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
              <h1 className="mb-4 text-center text-[22px]">Create PO</h1>
              <Select
                options={pfiOptions}
                value={selectedPFI}
                onChange={(selectedOption) => {
                  setSelectedPFI(selectedOption);
                  setPOData((prev) => ({
                    ...prev,
                    PFIId: selectedOption
                      ? selectedOption.map((opt) => opt.value)
                      : [],
                  }));
                }}
                isMulti
                components={animatedOption}
                closeMenuOnSelect={false}
                isClearable
                className="mb-5"
                placeholder="Select PFIs"
              />
              <button
                disabled={isCreatingPO}
                onClick={handleCreatPO}
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

          <div className="bg-white p-4 wfull md:w-1/4 border shadow-md rounded-md">
            <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
              <Box size={20} className="text-blue-700" />
              Selected PFIs
            </h1>
            <p className="mb-3 text-neutral-900 font-semibold text-[28px]">
              {poData.PFIId.length}
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}

export default POCreation;
