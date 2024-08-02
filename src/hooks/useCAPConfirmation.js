import { formatDate } from "@/utils/formatDate";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useCAPConfirmation = (pageType) => {
    /**
     * ? useState to manage data
     */

    const [confirmedOrders, setConfirmedOreder] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    //!--------------------------------
    const [uniqueCustomerNameOptions, setUniqueCustomerNameOptions] = useState([]);
    const [uniqueCustomerNameQueue, setUniqueCustomerNameQueue] = useState("");
  
    const [uniqueCAPIDOptions, setUniqueCAPIDOptions] = useState([]);
    const [uniqueCAPIDQueue, setUniqueCAPIDQueue] = useState("");

    const [uniqueOrderConfirmationNoOptions, setUniqueOrderConfirmationNoOptions] = useState([]);
    const [uniqueOrderConfirmationNoQueue, setUniqueOrderConfirmationNoQueue] = useState("");
  
    const [uniqueDateOptions, setUniqueDateOptions] = useState([]);
    const [uniqueDateQueue, setUniqueDateQueue] = useState("");
    //!--------------------------------
    const [uniqueArchivedCustomerNameOptions, setUniqueArchivedCustomerNameOptions] = useState([]);
    const [uniqueArchivedCustomerNameQueue, setUniqueArchivedCustomerNameQueue] = useState("");
  
    const [uniqueArchivedCAPIDOptions, setUniqueArchivedCAPIDOptions] = useState([]);
    const [uniqueArchivedCAPIDQueue, setUniqueArchivedCAPIDQueue] = useState("");

    const [uniqueArchivedOrderConfirmationNoOptions, setUniqueArchivedOrderConfirmationNoOptions] = useState([]);
    const [uniqueArchivedOrderConfirmationNoQueue, setUniqueArchivedOrderConfirmationNoQueue] = useState("");
  
    const [uniqueArchivedDateOptions, setUniqueArchivedDateOptions] = useState([]);
    const [uniqueArchivedDateQueue, setUniqueArchivedDateQueue] = useState("");
    //!--------------------------------

    //?--------------------------------
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedRows, setSelectedRows] = useState([]);

    const [archivedOrders, setArchivedOrders] = useState([]);
    const [isLoadingArchivedOrders, setIsLoadingArchivedOrders] = useState(false);

    const [isDeletingOrder, setIsDeletingOrder] = useState(false);
    const [isArchivingOrder, setIsArchivingOrder] = useState(false);
    const [isRestoringOrder, setIsRestoringOrder] = useState(false);

    const [capInvoiceData, setCAPInvoiceData] = useState({
        capInvoiceNo: "",
      });
      const [swiftData, setSwiftData] = useState({
        swiftNo: "",
      });
    const [isSwift, setIsSwift] = useState(false);
    const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

    const [filterOrders, setFilterOrders] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);

    /**
     * ? functions
     * 1- formatDate
     */

    const date = formatDate;

    /**
     * * useEfect to handle the fetch functions
     * 1- fetch confirmedOrders
     * 2- fetch archivedOrders
     */

    useEffect(() => {
        if (pageType === 'reviewOrders') {
            async function fetchConfirmedOrders() {
                setIsLoadingOrders(true);
                try {
                    const response = await fetch('https://benchmark-innovation-production.up.railway.app/api/cap-confirmation');
                    const resData = await response.json();

                    if (!response.ok) {
                        toast.error(resData.message);
                        setIsLoadingOrders(false);
                        return;
                    }

                    setConfirmedOreder(resData.data);

                    
                    // TODO -> unique Options for filtering purposes
                    const uniqueCustomerNames = [
                        ...new Set(resData.data.flatMap((order) => order.PO.PFI.map((pfi) => pfi.Customer.customerName)))
                    ].map((customer) => ({
                        label:customer,
                        value: customer
                    }));
                    setUniqueCustomerNameOptions(uniqueCustomerNames);

                    const uniqueCAPID = [
                        ...new Set(resData.data.flatMap((order) => order.PO.PFI.map((pfi) => pfi.Customer.customerCapIdNo.toString())))
                    ].map((customer) => ({
                        label: customer,
                        value: customer,
                    }));
                    setUniqueCAPIDOptions(uniqueCAPID);

                    const uniqueOrderConfirmationNo = [
                        ...new Set(resData.data.map((order) => order.orderConfirmationNo.toString()))
                    ].map((orderNumber) => ({
                        label: orderNumber,
                        value: orderNumber
                    }));
                    setUniqueOrderConfirmationNoOptions(uniqueOrderConfirmationNo);

                    const uniqueOrderDate = [
                        ...new Set(resData.data.map((order) => date(order.createdAt) ))
                    ].map((orderData) => ({
                        label: orderData,
                        value: orderData
                    }));
                    setUniqueDateOptions(uniqueOrderDate);

                    setIsLoadingOrders(false);
                } catch (error) {
                    toast.error(error.message);
                    setIsLoadingOrders(false);
                    return;
                }
            }
            fetchConfirmedOrders();
        }
    }, [reloadTable])

    useEffect(() => {
        if (pageType === 'archivedOrders') {
            async function fetchArchivedOrders() {
                setIsLoadingArchivedOrders(true);
                try {
                    const response = await fetch('https://benchmark-innovation-production.up.railway.app/api/cap-confirmation/archive');
                    const resData = await response.json();

                    if (!response.ok) {
                        toast.error(resData.message);
                        setIsLoadingArchivedOrders(false);
                        return;
                    }

                    setArchivedOrders(resData.data);
                    // TODO --> unique options for filtering purposes
                    const uniqueCustomerNames = [
                        ...new Set(resData.data.flatMap((order) => order.PO.PFI.map((pfi) => pfi.Customer.customerName)))
                    ].map((customer) => ({
                        label:customer,
                        value: customer
                    }));
                    setUniqueArchivedCustomerNameOptions(uniqueCustomerNames);

                    const uniqueCAPID = [
                        ...new Set(resData.data.flatMap((order) => order.PO.PFI.map((pfi) => pfi.Customer.customerCapIdNo.toString())))
                    ].map((customer) => ({
                        label: customer,
                        value: customer,
                    }));
                    setUniqueArchivedCAPIDOptions(uniqueCAPID);

                    const uniqueOrderConfirmationNo = [
                        ...new Set(resData.data.map((order) => order.orderConfirmationNo.toString()))
                    ].map((orderNumber) => ({
                        label: orderNumber,
                        value: orderNumber
                    }));
                    setUniqueArchivedOrderConfirmationNoOptions(uniqueOrderConfirmationNo);

                    const uniqueOrderDate = [
                        ...new Set(resData.data.map((order) => date(order.createdAt) ))
                    ].map((orderData) => ({
                        label: orderData,
                        value: orderData
                    }));
                    setUniqueArchivedDateOptions(uniqueOrderDate);

                    setIsLoadingArchivedOrders(false);
                } catch (error) {
                    toast.error(error.message);
                    setIsLoadingArchivedOrders(false);
                    return;
                }
            }
            fetchArchivedOrders();
        }
    }, [reloadTable])

    console.log(archivedOrders)

    return {
        confirmedOrders,
        isLoadingOrders,
        selectedRows,
        setSelectedRows,
        reloadTable,
        setReloadTable,
        filterOrders,
        setFilterOrders,
        isDeletingOrder,
        setIsDeletingOrder,
        isArchivingOrder,
        setIsArchivingOrder,
        capInvoiceData,
        setCAPInvoiceData,
        swiftData,
        setSwiftData,
        isCreatingInvoice,
        setIsCreatingInvoice,
        isSwift,
        setIsSwift,
        //?--------
        uniqueCustomerNameOptions,
        uniqueCustomerNameQueue,
        setUniqueCustomerNameQueue,
        uniqueCAPIDOptions,
        uniqueCAPIDQueue,
        setUniqueCAPIDQueue,
        uniqueOrderConfirmationNoOptions,
        uniqueOrderConfirmationNoQueue,
        setUniqueOrderConfirmationNoQueue,
        uniqueDateOptions,
        uniqueDateQueue,
        setUniqueDateQueue,
        date,
        //?--------------
        //!--------------
        rowsPerPage,
        setRowsPerPage,
        currentPage,
        setCurrentPage,
        //!--------------
        archivedOrders,
        isLoadingArchivedOrders,
        isRestoringOrder,
        setIsRestoringOrder,
        //?--------------
        uniqueArchivedCustomerNameOptions,
        uniqueArchivedCustomerNameQueue,
        setUniqueArchivedCustomerNameQueue,
        uniqueArchivedCAPIDOptions,
        uniqueArchivedCAPIDQueue,
        setUniqueArchivedCAPIDQueue,
        uniqueArchivedOrderConfirmationNoOptions,
        uniqueArchivedOrderConfirmationNoQueue,
        setUniqueArchivedOrderConfirmationNoQueue,
        uniqueArchivedDateOptions,
        uniqueArchivedDateQueue,
        setUniqueArchivedDateQueue,
        //?---------------
    }
}
