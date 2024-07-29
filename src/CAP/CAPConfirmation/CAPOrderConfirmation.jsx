import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { ArrowRight, ShoppingBag, Loader, Box } from "lucide-react";

export function CAPOrderConfirmation() {
  /**
   * useState to manage data
   * 1- createdPO
   * 2- isLoadingCreatedPO
   * ---------------------
   * 3- poOptions
   * 4- selectedPO
   * 5- orderConfirmationData
   * 6- isConfirmingOrder
   *
   */

  const [createdPO, setCreatedPO] = useState([]);
  const [isLoadingCreatedPO, setIsLoadingCreatedPO] = useState(false);
  const poOptions = createdPO.map((po) => ({
    label: po.SERIAL,
    value: po.id,
  }));

  const [selectedPO, setSelectedPO] = useState(null);
  const [orderConfirmationData, setorderConfirmationData] = useState({
    POId: "",
    orderConfirmationNo: "",
  });
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);

  /**
   * useEffect fucntions to fetch data
   * 1- fetch createdPOs
   */

  useEffect(() => {
    async function fetchCreatedPOs() {
      setIsLoadingCreatedPO(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/po"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingCreatedPO(false);
          return;
        }

        setCreatedPO(resData.data);
        const poDataStorage = resData.data;
        localStorage.setItem("poData", poDataStorage);

        setIsLoadingCreatedPO(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingCreatedPO(false);
        return;
      }
    }
    fetchCreatedPOs();
  }, []);

  const poMemory = localStorage.getItem("poData");
  console.log(poMemory);

  /**
   * Sending data to the APIs
   * 1- handleConfirmCAPOrder
   */

  const handleConfirmCAPOrder = async (event) => {
    event.preventDefault();
    setIsConfirmingOrder(true);

    const finalData = {
      ...orderConfirmationData,
      orderConfirmationNo: parseInt(
        orderConfirmationData.orderConfirmationNo,
        10
      ),
    };
    try {
      const response = await fetch(
        "https://benchmark-innovation-production.up.railway.app/api/cap-confirmation",
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
        setIsConfirmingOrder(false);
        return;
      }

      toast.success("PO Created Succefully");

      setorderConfirmationData({
        POId: "",
        orderConfirmationNo: "",
      });
      setSelectedPO(null);
      setIsConfirmingOrder(false);
    } catch (error) {
      toast.error(error.message);
      setIsConfirmingOrder(false);
      return;
    }
  };

  /**
   * Animations
   * 1- Select animation
   */

  const animatedOption = makeAnimated();

  console.log(orderConfirmationData);

  return (
    <section className="bg-[#F5F5F5] flex flex-col p-10 ml-20 w-full gap-5">
      <div className="flex flex-col gap-3 md:flex-row justify-center md:justify-start items-center md:gap-12">
        <div>
          <h1 className="text-3xl text-neutral-900">CAP Order Confirmation</h1>
          <p className="text-md text-neutral-500 mt-2">
            Confirm PO orders for the requested POs through the following form.
          </p>
        </div>

        <div className="bg-white p-2 border shadow-md rounded-md w-80">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <ShoppingBag size={20} className="text-blue-700" /> Total PO
          </h1>
          <div className="mb-3 text-neutral-900 font-semibold text-[28px]">
            {isLoadingCreatedPO ? (
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
              createdPO.length
            )}
          </div>
          <Link
            to="/CAP-po-review"
            className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
          >
            Review POs <ArrowRight size={16} className="mt-1" />
          </Link>
        </div>
      </div>

      <div className="w-full border p-6 border-neutral-500/50 bg-neutral-100 rounded">
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10">
          <form method="post" className="w-full md:w-2/3">
            <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
              <h1 className="mb-4 text-center text-[22px]">Create PO</h1>
              <Select
                options={poOptions}
                value={selectedPO}
                onChange={(selectedOption) => {
                  setSelectedPO(selectedOption);
                  setorderConfirmationData((prev) => ({
                    ...prev,
                    POId: selectedOption ? selectedOption.value : "",
                  }));
                }}
                components={animatedOption}
                isClearable
                className="mb-5"
                placeholder="Select PO"
              />

              <input
                placeholder="Order Confirmation Number"
                type="number"
                name="orderConfirmationNo"
                value={orderConfirmationData.orderConfirmationNo}
                onChange={(event) => {
                  setorderConfirmationData((prev) => ({
                    ...prev,
                    orderConfirmationNo: event.target.value,
                  }));
                }}
                className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
              />

              <button
                disabled={isConfirmingOrder}
                onClick={handleConfirmCAPOrder}
                className="bg-blue-900 text-white p-3 rounded transition-all duration-300 hover:bg-blue-500"
              >
                {isConfirmingOrder ? (
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
                  "Confirm Order"
                )}
              </button>
            </div>
          </form>

          <div className="bg-white p-4 wfull md:w-1/4 border shadow-md rounded-md">
            <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
              <Box size={20} className="text-blue-700" />
              Selected POs
            </h1>
            <p className="mb-3 text-neutral-900 font-semibold text-[28px]">
              hey...
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </section>
  );
}

export default CAPOrderConfirmation;
