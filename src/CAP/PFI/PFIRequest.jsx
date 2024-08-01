import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Users, Box, ArrowRight, Loader } from "lucide-react";
import Pfir from "@/forms/Pfir";
export function PFIRequest() {
  /**
   * useState hook to manage and update data
   * 1- customersList
   * 2- isLoadingCustomersList
   * 3- selectedCustomerCode
   * 4- items
   * 5- isLoadingItems
   * 6- itemDescAndCodeOptions
   * 7- selecteditem
   */

  const [customersList, setCustomersList] = useState([]);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  const customerCodeOptions = customersList.map((code) => ({
    label: code.customerCode,
    value: code.id,
  }));
  const [selectedCustomerCode, setSelectedCustomerCode] = useState(null);

  const [items, setItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const itemDescAndCodeOptions = items.map((item) => ({
    label: item.itemName,
    value: item.id,
  }));
  const [selectedItem, setSelectedItem] = useState(null);

  /**
   * useEffect functions to Fetch Data
   * 1- Fetch Customers
   * 2- Fetch items
   */

  useEffect(() => {
    async function fetchCustomers() {
      setIsLoadingCustomer(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/customer"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingCustomer(false);
          return;
        }

        setCustomersList(resData.data);
        setIsLoadingCustomer(false);
      } catch (error) {
        toast.error("Catch Block error");
        setIsLoadingCustomer(false);
        return;
      }
    }
    fetchCustomers();
  }, []);

  useEffect(() => {
    async function loadItems() {
      setIsLoadingItems(true);

      try {
        const response = await fetch(
          "https://benchmark-innovation-production.up.railway.app/api/items"
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingItems(false);
          return;
        }

        setItems(resData.data);
        setIsLoadingItems(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingItems(false);
        return;
      }
    }
    loadItems();
  }, []);

  //console.log(items);

  return (
    <section className="bg-[#f8fcff] flex flex-col p-10 ml-20 w-full gap-5">
      <div className="flex flex-col gap-3 md:flex-row justify-center md:justify-start items-center md:gap-12">
        <div>
          <h1 className="text-3xl text-neutral-900">Proforma Request</h1>
          <p className="text-md text-neutral-500 mt-2">
            Create a request for a PFI through the following form.
          </p>
        </div>

        <div className="bg-white p-2 border shadow-md rounded-md w-80">
          <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
            <Users size={20} className="text-blue-700" /> Total Customers
          </h1>
          <div className="mb-3 text-neutral-900 font-semibold text-[28px]">
            {isLoadingCustomer ? (
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
              customersList.length
            )}
          </div>
          <Link
            to="/create-account"
            className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
          >
            Manage Users <ArrowRight size={16} className="mt-1" />
          </Link>
        </div>

        <div className="bg-white p-2 border shadow-md rounded-md w-80">
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
        </div>
      </div>

      <div className="w-full p-6 border bg-neutral-100 rounded">
        <Pfir
          itemsOptions={itemDescAndCodeOptions}
          customerOptions={customerCodeOptions}
        />
      </div>
    </section>
  );
}

export default PFIRequest;
