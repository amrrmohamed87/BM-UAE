import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useCAPInvoice = (pageType) => {
    /**
     * ? useState hook to manage data
     */

    const [capInvoices, setCAPInvoices] = useState([]);
    const [isLoadingCAPInvoices, setIsLoadingCAPInvoices] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);

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
        filterInvoices,
        setFilterInvoices,
        isDeletingInvoice,
        setIsDeletingInvoice,
        isArchivingInvoice,
        setIsArchivingInvoice,
        //Archive states
        archivedInvoices,
        isLoadingArchivedInvoices,
        isRestoringInvoice,
        setIsRestoringInvoice,
    }

}