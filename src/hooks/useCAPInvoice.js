import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useCAPInvoice = (pageType) => {
    /**
     * ? useState hook to manage data
     */

    const [capInvoices, setCAPInvoices] = useState([]);
    const [isLoadingCAPInvoices, setIsLoadingCAPInvoices] = useState(false);

    //!--------------------------------
    const [uniqueCustomerNameOptions, setUniqueCustomerNameOptions] = useState([]);
    const [uniqueCustomerNameQueue, setUniqueCustomerNameQueue] = useState("");
  
    const [uniqueCAPIDOptions, setUniqueCAPIDOptions] = useState([]);
    const [uniqueCAPIDQueue, setUniqueCAPIDQueue] = useState("");
    
    const [uniqueCapInvoiceNoOptions, setUniqueCapInvoiceNoOptions] = useState([]);
    const [uniqueCapInvoiceNoQueue, setUniqueCapInvoiceNoQueue] = useState("");

    const [uniqueStatusOptions, setUniqueStatusOptions] = useState([]);
    const [uniqueStatusQueue, setUniqueStatusQueue] = useState("");

    //!--------------------------------

    const [uniqueArchivedCustomerNameOptions, setUniqueArchivedCustomerNameOptions] = useState([]);
    const [uniqueArchivedCustomerNameQueue, setUniqueArchivedCustomerNameQueue] = useState("");
  
    const [uniqueArchivedCAPIDOptions, setUniqueArchivedCAPIDOptions] = useState([]);
    const [uniqueArchivedCAPIDQueue, setUniqueArchivedCAPIDQueue] = useState("");
    
    const [uniqueArchivedCapInvoiceNoOptions, setUniqueArchivedCapInvoiceNoOptions] = useState([]);
    const [uniqueArchivedCapInvoiceNoQueue, setUniqueArchivedCapInvoiceNoQueue] = useState("");

    const [uniqueArchivedStatusOptions, setUniqueArchivedStatusOptions] = useState([]);
    const [uniqueArchivedStatusQueue, setUniqueArchivedStatusQueue] = useState("");
    //!--------------------------------

    const [selectedRows, setSelectedRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    const [archivedInvoices, setArchivedInvoices] = useState([]);
    const [isLoadingArchivedInvoices, setIsLoadingArchivedInvoices] = useState(false);

    const [isDeletingInvoice, setIsDeletingInvoice] = useState(false);
    const [isArchivingInvoice, setIsArchivingInvoice] = useState(false);
    const [isRestoringInvoice, setIsRestoringInvoice] = useState(false);

    const [filterInvoices, setFilterInvoices] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    
    /**
     * * useEffect hook to fetch data
     * 1- fetch capInvoices
     */

    useEffect(() => {
        if (pageType === 'invoicesReview') {
            async function fetchCAPInvoices() {
                setIsLoadingCAPInvoices(true);
                try {
                    const response = await fetch('https://benchmark-innovation-production.up.railway.app/api/cap-invoice');
                    const resData = await response.json();

                    if (!response.ok) {
                        toast.error(resData.message);
                        setIsLoadingCAPInvoices(false);
                        return;
                    }

                    setCAPInvoices(resData.data);

                    // TODO --> unique options for filtering purposes
                    const uniqueCustomerNames = [
                        ...new Set(resData.data.flatMap((invoices) => invoices.CAPOrder.PO.PFI.map((pfi) => pfi.Customer.customerName)))
                    ].map((name) => ({
                        label: name,
                        value: name
                    }));
                    setUniqueCustomerNameOptions(uniqueCustomerNames);

                    const uniqueCapIds = [
                        ...new Set(resData.data.flatMap((invoices) => invoices.CAPOrder.PO.PFI.map((pfi) => pfi.Customer.customerCapIdNo.toString())))
                    ].map((cap) => ({
                        label: cap,
                        value: cap
                    }));
                    setUniqueCAPIDOptions(uniqueCapIds);

                    const uniqueCapInvoiceNumbers = [
                        ...new Set(resData.data.map((invoice) => invoice.capInvoiceNo))
                    ].map((invoiceNumber) => ({
                        label: invoiceNumber,
                        value: invoiceNumber
                    }));
                    setUniqueCapInvoiceNoOptions(uniqueCapInvoiceNumbers);

                    const uniqueStatus = [
                        ...new Set(resData.data.map((invoice) => invoice.status))
                    ].map((status) => ({
                        label: status,
                        value: status
                    }));
                    setUniqueStatusOptions(uniqueStatus);

                    setIsLoadingCAPInvoices(false);
                } catch (error) {
                    toast.error(error.message);
                    setIsLoadingCAPInvoices(false);
                    return;
                }
            }
            fetchCAPInvoices();
        }
    }, [reloadTable]);

    console.log(capInvoices)

    useEffect(() => {
        if (pageType === 'invoicesArchive') {
            async function fetchArchivedInvoices() {
                setIsLoadingArchivedInvoices(true);
                try {
                    const response = await fetch('https://benchmark-innovation-production.up.railway.app/api/cap-invoice/archive');
                    const resData = await response.json();

                    if (!response.ok) {
                        toast.error(resData.message);
                        setIsLoadingArchivedInvoices(false);
                        return;
                    }

                    setArchivedInvoices(resData.data);

                    // TODO --> unique options for filtering purposes
                    const uniqueCustomerNames = [
                        ...new Set(resData.data.flatMap((invoices) => invoices.CAPOrder.PO.PFI.map((pfi) => pfi.Customer.customerName)))
                    ].map((name) => ({
                        label: name,
                        value: name
                    }));
                    setUniqueArchivedCustomerNameOptions(uniqueCustomerNames);

                    const uniqueCapIds = [
                        ...new Set(resData.data.flatMap((invoices) => invoices.CAPOrder.PO.PFI.map((pfi) => pfi.Customer.customerCapIdNo.toString())))
                    ].map((cap) => ({
                        label: cap,
                        value: cap
                    }));
                    setUniqueArchivedCAPIDOptions(uniqueCapIds);

                    const uniqueCapInvoiceNumbers = [
                        ...new Set(resData.data.map((invoice) => invoice.capInvoiceNo))
                    ].map((invoiceNumber) => ({
                        label: invoiceNumber,
                        value: invoiceNumber
                    }));
                    setUniqueArchivedCapInvoiceNoOptions(uniqueCapInvoiceNumbers);

                    const uniqueStatus = [
                        ...new Set(resData.data.map((invoice) => invoice.status))
                    ].map((status) => ({
                        label: status,
                        value: status
                    }));
                    setUniqueArchivedStatusOptions(uniqueStatus);

                    setIsLoadingArchivedInvoices(false);
                } catch (error) {
                    toast.error(error.message);
                    setIsLoadingArchivedInvoices(false);
                    return;
                }
            }
            fetchArchivedInvoices();
        }
    }, [reloadTable]);


    return {
        capInvoices,
        isLoadingCAPInvoices,
        reloadTable,
        setReloadTable,
        selectedRows,
        setSelectedRows,
        rowsPerPage,
        setRowsPerPage,
        currentPage,
        setCurrentPage,
        filterInvoices,
        setFilterInvoices,
        isDeletingInvoice,
        setIsDeletingInvoice,
        isArchivingInvoice,
        setIsArchivingInvoice,
        //?----------------
        uniqueCustomerNameOptions,
        uniqueCustomerNameQueue,
        setUniqueCustomerNameQueue,
        uniqueCAPIDOptions,
        uniqueCAPIDQueue,
        setUniqueCAPIDQueue,
        uniqueCapInvoiceNoOptions,
        uniqueCapInvoiceNoQueue,
        setUniqueCapInvoiceNoQueue,
        uniqueStatusOptions,
        uniqueStatusQueue,
        setUniqueStatusQueue,
        //Archive states
        archivedInvoices,
        isLoadingArchivedInvoices,
        isRestoringInvoice,
        setIsRestoringInvoice,
    }

}