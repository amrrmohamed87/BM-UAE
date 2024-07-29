import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { ArrowRight, ShoppingBag, Loader, Box } from "lucide-react";

export function CAPInvoice() {
  /**
   * useState to manage data
   * 1- confirmedCAPOrders
   * 2- isLoadingConfirmedCAPOrders
   * ---------------------
   * 3- capConfirmedOrdersOptions
   * 4- selectedOrder
   * 5- capInvoiceData
   * 6- swiftData
   * 7- isPaying
   * 8- isCreatingCAPInvoice
   *
   */

  const [confirmedCAPOrders, setConfirmedCAPOrders] = useState([]);
  const [isLoadingConfirmedCAPOrders, setIsLoadingConfirmedCAPOrders] =
    useState(false);
  const capConfirmedOrdersOptions = confirmedCAPOrders.map((order) => ({
    label: order.orderConfirmationNo,
    value: order.id,
  }));

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [capInvoiceData, setCAPInvoiceData] = useState({
    CAPOrderId: "",
    capInvoiceNo: "",
  });
  const [swiftData, setSwiftData] = useState({
    swiftNo: "",
  });
  const [isPaying, setIsPaying] = useState(false);
  const [isCreatingCAPInvoice, setIsCreatingCAPInvoice] = useState(false);

  /**
   * useEffect fucntions to fetch data
   * 1- fetch createdPOs
   */

  useEffect(() => {
    async function fetchCreatedPOs() {
      setIsLoadingConfirmedCAPOrders(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/cap-confirmation"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingConfirmedCAPOrders(false);
          return;
        }

        setConfirmedCAPOrders(resData.data);

        setIsLoadingConfirmedCAPOrders(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingConfirmedCAPOrders(false);
        return;
      }
    }
    fetchCreatedPOs();
  }, []);

  /**
   * Sending data to the APIs
   * 1- handleCreateInvoice
   */

  const handleCreateInvoice = async (event) => {
    event.preventDefault();
    setIsCreatingCAPInvoice(true);

    const finalData = {
      ...capInvoiceData,

      swiftNo: swiftData.swiftNo ? swiftData.swiftNo : "",
    };

    console.log(finalData);

    try {
      const response = await fetch(
        "https://benchmark-innovation-production.up.railway.app/api/cap-invoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        }
      );
      const resData = await response.json();

      console.log(resData.message);

      if (!response.ok) {
        toast.error(resData.message);
        setIsCreatingCAPInvoice(false);
        return;
      }

      toast.success("Invoice Created Succefully");

      setCAPInvoiceData({
        CAPOrderId: "",
        capInvoiceNo: "",
      });
      setSwiftData({
        swiftNo: "",
      });
      setSelectedOrder(null);
      setIsPaying(false);
      setIsCreatingCAPInvoice(false);
    } catch (error) {
      toast.error(error.message);
      setIsCreatingCAPInvoice(false);
      return;
    }
  };

  /**
   * Animations
   * 1- Select animation
   */

  const animatedOption = makeAnimated();

  return (
    <section className="bg-[#F5F5F5] flex flex-col p-10 ml-20 w-full gap-5">
      <div className="flex flex-col gap-3 md:flex-row justify-center md:justify-start items-center md:gap-12">
        <div>
          <h1 className="text-3xl text-neutral-900">CAP Invoice</h1>
          <p className="text-md text-neutral-500 mt-2">
            Create Invoices for the confirmed CAP orders through the following
            form.
          </p>
        </div>

        <div className="bg-white p-2 border shadow-md rounded-md w-80">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <ShoppingBag size={20} className="text-blue-700" /> Total Orders
          </h1>
          <div className="mb-3 text-neutral-900 font-semibold text-[28px]">
            {isLoadingConfirmedCAPOrders ? (
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
              confirmedCAPOrders.length
            )}
          </div>
          <Link
            to="/CAP-cap-review"
            className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
          >
            Review CAP Orders <ArrowRight size={16} className="mt-1" />
          </Link>
        </div>
      </div>

      <div className="w-full border p-6 border-neutral-500/50 bg-neutral-100 rounded">
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10">
          <form method="post" className="w-full md:w-2/3">
            <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
              <h1 className="mb-4 text-center text-[22px]">Create Invoice</h1>
              <Select
                options={capConfirmedOrdersOptions}
                value={selectedOrder}
                onChange={(selectedOption) => {
                  setSelectedOrder(selectedOption);
                  setCAPInvoiceData((prev) => ({
                    ...prev,
                    CAPOrderId: selectedOption ? selectedOption.value : "",
                  }));
                }}
                components={animatedOption}
                isClearable
                className="mb-5"
                placeholder="Select Confirmed CAP Order"
              />

              <input
                placeholder="CAP Invoice Number"
                type="number"
                name="Cap Invoice Number"
                value={capInvoiceData.capInvoiceNo}
                onChange={(event) => {
                  setCAPInvoiceData((prev) => ({
                    ...prev,
                    capInvoiceNo: event.target.value,
                  }));
                }}
                className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
              />

              <div>
                <button
                  className="text-[18px] mb-2 transition-all duration-300 hover:text-blue-500"
                  type="button"
                  onClick={() => setIsPaying(!isPaying)}
                >
                  Swift
                </button>
              </div>

              <AnimatePresence>
                {isPaying && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ overflow: "hidden" }}
                  >
                    <input
                      placeholder="Swift Number"
                      type="number"
                      name="Swift Number"
                      value={swiftData.swiftNo}
                      onChange={(event) => {
                        setSwiftData((prev) => ({
                          ...prev,
                          swiftNo: event.target.value,
                        }));
                      }}
                      className="w-full p-1 mb-4 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                disabled={isCreatingCAPInvoice}
                onClick={handleCreateInvoice}
                className="bg-blue-900 text-white p-3 rounded transition-all duration-300 hover:bg-blue-500"
              >
                {isCreatingCAPInvoice ? (
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
                  "Confirm Invoice"
                )}
              </button>
            </div>
          </form>

          <div className="bg-white p-4 wfull md:w-1/4 border shadow-md rounded-md">
            <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
              <Box size={20} className="text-blue-700" />
              Selected Orders
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

export default CAPInvoice;
