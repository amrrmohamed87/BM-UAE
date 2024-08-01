import { formatDate } from "@/utils/formatDate";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useCAPConfirmation = (pageType) => {
    /**
     * ? useState to manage data
     */

    const [confirmedOrders, setConfirmedOreder] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);

    const [archivedOrders, setArchivedOrders] = useState([]);
    const [isLoadingArchivedOrders, setIsLoadingArchivedOrders] = useState(false);

    const [isDeletingOrder, setIsDeletingOrder] = useState(false);
    const [isArchivingOrder, setIsArchivingOrder] = useState(false);
    const [isRestoringOrder, setIsRestoringOrder] = useState(false);

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

    console.log(confirmedOrders)

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
        isCreatingInvoice,
        setIsCreatingInvoice,
        isSwift,
        setIsSwift,
        archivedOrders,
        isLoadingArchivedOrders,
        isRestoringOrder,
        setIsRestoringOrder,
    }
}
