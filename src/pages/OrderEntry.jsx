import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../CSS/Select.css";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import PFI from "@/forms/PFI";
import POCreation from "@/forms/POCreation";

export function OrderEntry() {
  /**
   * Animations
   * 1- Select animation
   */

  /**
   * Console.log
   */
  //console.log(requestPFIForm);
  //console.log(items);
  //console.log(itemId.id);
  //console.log(cyclesPerItem);

  return (
    <section className="flex flex-col p-8 ml-20 w-full gap-5">
      <h1 className="text-4xl text-neutral-900">Ordering and Supply chain</h1>

      {/* <div className="w-full flex flex-col gap-6 border bg-neutral-100 rounded p-4 mb-20">
        <div className="flex flex-col md:flex-row items-center gap-16 w-full">
          <form method="post" className="w-1/2">
            <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
              <h1 className="mb-4 text-center text-[22px]">Request PFI</h1>
              <Select
                options={customerCodeOptions}
                value={selectedCustomerCode}
                onChange={(selectedOption) => {
                  setSelectedCustomerCode(selectedOption);
                  setRequestPFIForm((prev) => ({
                    ...prev,
                    customerId: selectedOption ? selectedOption.value : "",
                  }));
                }}
                isClearable
                className="mb-5"
                placeholder="Customer Code"
              />
              <Select
                options={itemDescAndCodeOptions}
                value={selectedItem}
                onChange={(selectedOption) => {
                  setSelectedItem(selectedOption);
                  setRequestPFIForm((prev) => ({
                    ...prev,
                    itemId: selectedOption ? selectedOption.value : "",
                  }));
                  setItemId({ id: selectedOption ? selectedOption.value : "" });
                }}
                isClearable
                className="mb-5"
                placeholder="Item Description & Code"
              />
              <input
                placeholder="QTY"
                type="number"
                name="QTY"
                value={requestPFIForm.QTY}
                onChange={handleRequestPFIChange}
                className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
              />
              <Select
                options={cyclesOptions}
                value={selectedCycles}
                components={animatedOption}
                closeMenuOnSelect={false}
                isMulti
                onChange={(selectedOption) => {
                  setSelectedCycles(selectedOption);
                  setRequestPFIForm((prev) => ({
                    ...prev,
                    noOfCycle: selectedOption
                      ? selectedOption.map((option) => option.value)
                      : [],
                  }));
                }}
                isClearable
                className="mb-5"
                placeholder="Number of Cycle"
              />
              <button
                disabled={isRequesttingPFI}
                onClick={handleRequestPFI}
                className="bg-blue-900 text-white p-3 rounded transition-all duration-300 hover:bg-blue-500"
              >
                {isRequesttingPFI ? (
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
                  "Request PFI"
                )}
              </button>
            </div>
          </form>

          <form method="post" className="w-1/2">
            <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-full">
              <h1 className="mb-4 text-center text-[22px]">Final PFI</h1>
              <Select
                options={customerCodeOptions}
                isClearable
                className="mb-5"
                placeholder="Customer Code"
              />
              <Select
                options={itemDescAndCodeOptions}
                isClearable
                className="mb-5"
                placeholder="Item Description & Code"
              />
              <input
                placeholder="QTY"
                type="number"
                name="QTY"
                className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
              />
              <Select
                options={cyclesOptions}
                components={animatedOption}
                closeMenuOnSelect={false}
                isMulti
                isClearable
                className="mb-5"
                placeholder="Number of Cycle"
              />
              <button className="bg-blue-900 text-white p-3 rounded transition-all duration-300 hover:bg-blue-500">
                Request Final PFI
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col w-full bg-white border shadow rounded-lg p-3 overflow-x-auto">
          <button
            onClick={() => {
              setRequestTableFilter(!requestTableFilter);
            }}
            className="flex justify-center items-center gap-1 w-[110px] px-3 py-1 bg-blue-900 text-white rounded-md transition-all duration-300 hover:bg-blue-500"
          >
            Filter
            <motion.span
              animate={{ rotate: requestTableFilter ? -180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <ChevronDown size={20} />
            </motion.span>
          </button>

          <AnimatePresence>
            {requestTableFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                style={{ overflow: "hidden" }}
                className="flex justify-between gap-6 mt-4"
              >
                <Select
                  options={uniqueCustomerCodeOptions}
                  value={uniqueCustomerCodeOptions.find(
                    (option) => option.value === customerCodeQueue
                  )}
                  onChange={(option) => {
                    setCustomerCodeQueue(option && option.value);
                  }}
                  isClearable
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="Code"
                />
                <Select
                  options={uniqueItemOptions}
                  value={uniqueItemOptions.find(
                    (option) => option.value === itemQueue
                  )}
                  onChange={(option) => {
                    setItemQueue(option && option.value);
                  }}
                  isClearable
                  className="w-full custom-select"
                  classNamePrefix="reac-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  placeholder="Item"
                />
                <Select
                  options={uniquePFISerialOptions}
                  value={uniquePFISerialOptions.find(
                    (option) => option.value === pfiSerialQueue
                  )}
                  onChange={(option) => {
                    setPFISerialQueue(option && option.value);
                  }}
                  isClearable
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

          {isLoadingRequestedPFI ? (
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
          ) : requestedPFI.length <= 0 ? (
            <h1 className="text-center text-[24px] mt-8">
              NO PFIs FOUND, PLEASE TRY AGAIN LATER
            </h1>
          ) : (
            <table className="min-w-full divide-y divide-neutral-900 mt-2">
              <thead className="bg-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    Customer Code
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
                    PFI - Serial
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    QTY
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3  text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    Cycles
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-800 tracking-wider"
                  >
                    Creation Date
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
                {currentRequestedPFIData.map((pfi, index) => (
                  <tr key={index}>
                    <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                      {pfi.Customer.customerCode}
                    </td>
                    <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                      {pfi.Items.itemName}
                    </td>
                    <td className="px-4 py-6  whitespace-normal break-words text-sm font-medium text-gray-900">
                      {pfi.SERIAL}
                    </td>
                    <td className="px-4 py-6 text-center whitespace-normal break-words text-sm font-medium text-gray-900">
                      {pfi.QTY}
                    </td>
                    <td className="px-4 py-6 text-center whitespace-normal break-words text-sm font-medium text-gray-900">
                      {pfi.noOfCycle}
                    </td>
                    <td className="px-4 py-6 text-center whitespace-normal break-words text-sm font-medium text-gray-900">
                      {formateDate(pfi.createdAt)}
                    </td>
                    <td className="px-4 py-6 whitespace-normal break-words text-sm font-medium text-gray-900">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() =>
                              setPFIId({
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
                              This action cannot be undone. This will
                              permanently delete this Customer and remove its
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() =>
                                setPFIId({
                                  id: "",
                                })
                              }
                            >
                              Cancel
                            </AlertDialogCancel>
                            <form method="delete">
                              <AlertDialogAction
                                disabled={isDeletingPFIRequest}
                                onClick={handleDeleteRequestedPFI}
                              >
                                {isDeletingPFIRequest ? (
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
                                  "Confirm"
                                )}
                              </AlertDialogAction>
                            </form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <RequestedPFIPagination />
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-6 border bg-neutral-100 rounded p-4 mb-40">
        <Tabs defaultValue="poCreate" className="w-[560px]">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="poCreate">PO - Creation</TabsTrigger>
            <TabsTrigger value="confirm">CAP - Confirmation</TabsTrigger>
          </TabsList>
          <TabsContent value="poCreate">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Create PO</CardTitle>
                <CardDescription>
                  Create PO for the requested PFI here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <form method="post">
                  <div className="flex flex-col">
                    <input
                      placeholder="PFI - Number"
                      type="number"
                      className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                    />
                    <Select
                      components={animatedOption}
                      closeMenuOnSelect={false}
                      isMulti
                      isClearable
                      className="mb-5"
                      placeholder="Requested - PFI"
                    />
                    <input
                      placeholder="Price"
                      type="number"
                      className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                    />
                    <input
                      placeholder="Shipping Fees"
                      type="number"
                      className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                    />
                    <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                      Request PFI
                    </button>
                  </div>
                </form>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="confirm">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-[22px]">CAP Confirmation</CardTitle>
                <CardDescription>
                  Confirm your PO through the following forms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <form>
                  <div className="flex flex-col p-4">
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
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col w-full bg-white border shadow rounded-lg p-2 overflow-x-auto">
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
      </div> */}

      <div className="w-full p-4">
        <Tabs defaultValue="pfi" className="w-full">
          <TabsList className="grid w-[64%] grid-cols-4 p-1 bg-neutral-200">
            <TabsTrigger value="pfi">PFI - Requests</TabsTrigger>
            <TabsTrigger value="po">PO - Creation</TabsTrigger>
            <TabsTrigger value="triton">Triton - Invoice</TabsTrigger>
            <TabsTrigger value="uae">UAE - Annual Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="pfi">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>PFI Request and Confirmation</CardTitle>
                <CardDescription>
                  Create PFI requests and Final PFI through the following forms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <PFI />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="po">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>PO Creation</CardTitle>
                <CardDescription>
                  Create PO for the Requested PFIs and confirm the PO through
                  the following forms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <POCreation />
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="triton">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Triton Invoices</CardTitle>
                <CardDescription>
                  Create Triton Invoices here through the following forms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col md:flex-row justify-between w-full">
                  <form>
                    <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-[400px]">
                      <h1 className="mb-4 text-center text-[22px]">
                        Triton Invoice
                      </h1>
                      <input
                        placeholder="Commercial Invoice - ID"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <input
                        placeholder="Commercial Invoice Value / Item"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <input
                        placeholder="AWB - ID"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <Select
                        placeholder="QTY"
                        className="w-full mb-3 rounded h-[30px] md:h-[35px] lg:h-[40px]  border-gray-400 focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex flex-col items-start">
                        <label
                          htmlFor="shipDate"
                          className="mb-1 text-neutral-600"
                        >
                          Ship - Date
                        </label>
                        <input
                          id="shipDate"
                          type="date"
                          className="w-full mb-2 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <label
                          htmlFor="arrivalDate"
                          className="mb-1 text-neutral-600"
                        >
                          Arrival - Date
                        </label>
                        <input
                          id="arrivalDate"
                          type="date"
                          className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                        />
                      </div>
                      <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                        Create Triton Invoice
                      </button>
                    </div>
                  </form>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="uae">
            <Card>
              <CardHeader>
                <CardTitle>UAE</CardTitle>
                <CardDescription>UAE invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2"></CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* <h1 className="text-4xl text-neutral-900">Initial Table</h1>
      <div className="w-full bg-white rounded p-4"></div>

      <div className="w-full border bg-neutral-100 rounded p-4">
        <Tabs defaultValue="cap" className="w-[1000px]">
          <TabsList className="grid w-1/2 grid-cols-3 bg-white">
            <TabsTrigger value="cap">CAP - Requests</TabsTrigger>
            <TabsTrigger value="triton">Triton - Invoices</TabsTrigger>
            <TabsTrigger value="uae">UAE - Annual Subscription</TabsTrigger>
          </TabsList>
          <TabsContent value="cap">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>CAP Request and Orders</CardTitle>
                <CardDescription>
                  Create CAP requests and orders through the following forms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col md:flex-row justify-between w-full">
                  <form method="post">
                    <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-[400px]">
                      <h1 className="mb-4 text-center text-[22px]">
                        Request PFI
                      </h1>
                      <Select
                        options={customerCodeOptions}
                        value={selectedCustomerCode}
                        onChange={(selectedOption) => {
                          setSelectedCustomerCode(selectedOption);
                          setRequestPFIForm((prev) => ({
                            ...prev,
                            customerCode: selectedOption
                              ? selectedOption.value
                              : "",
                          }));
                        }}
                        isClearable
                        className="mb-5"
                        placeholder="Customer Code"
                      />
                      <Select
                        className="mb-5"
                        placeholder="Item Description & Code"
                      />
                      <input
                        placeholder="QTY"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <Select
                        options={QTYOfPFIRequestOptions}
                        value={selectedQTYPFIRequest}
                        components={animatedOption}
                        closeMenuOnSelect={false}
                        isMulti
                        onChange={(selectedOption) => {
                          setSelectedQTYPFIRequest(selectedOption);
                          setRequestPFIForm((prev) => ({
                            ...prev,
                            QTY: selectedOption ? selectedOption.value : "",
                          }));
                        }}
                        isClearable
                        className="mb-5"
                        placeholder="Number of Cycle"
                      />
                      <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                        Request PFI
                      </button>
                    </div>
                  </form>

                  <form>
                    <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-[400px]">
                      <h1 className="mb-4 text-center text-[22px]">
                        CAP Order Confirmation
                      </h1>
                      <Select className="mb-5" placeholder="PO - ID" />
                      <input
                        placeholder="Order Confirmation Number"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                        Confirm Order
                      </button>
                    </div>
                  </form>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="triton">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Triton Invoices</CardTitle>
                <CardDescription>
                  Create Triton Invoices here through the following forms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col md:flex-row justify-between w-full">
                  <form>
                    <div className="flex flex-col bg-neutral-50 rounded shadow border p-4 w-[400px]">
                      <h1 className="mb-4 text-center text-[22px]">
                        Triton Invoice
                      </h1>
                      <input
                        placeholder="Commercial Invoice - ID"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <input
                        placeholder="Commercial Invoice Value / Item"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <input
                        placeholder="AWB - ID"
                        type="number"
                        className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                      />
                      <Select
                        placeholder="QTY"
                        className="w-full mb-3 rounded h-[30px] md:h-[35px] lg:h-[40px]  border-gray-400 focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex flex-col items-start">
                        <label
                          htmlFor="shipDate"
                          className="mb-1 text-neutral-600"
                        >
                          Ship - Date
                        </label>
                        <input
                          id="shipDate"
                          type="date"
                          className="w-full mb-2 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <label
                          htmlFor="arrivalDate"
                          className="mb-1 text-neutral-600"
                        >
                          Arrival - Date
                        </label>
                        <input
                          id="arrivalDate"
                          type="date"
                          className="w-full mb-5 rounded h-[30px] md:h-[35px] lg:h-[40px] border border-gray-400 focus:outline-none focus:border-blue-500 pl-2 md:pl-3 pr-3"
                        />
                      </div>
                      <button className="bg-blue-900 p-2 text-white rounded transition-all duration-300 hover:bg-blue-500">
                        Create Triton Invoice
                      </button>
                    </div>
                  </form>
                </div>
              </CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="uae">
            <Card>
              <CardHeader>
                <CardTitle>UAE</CardTitle>
                <CardDescription>UAE invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2"></CardContent>
              <CardFooter></CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div> */}
    </section>
  );
}

export default OrderEntry;
