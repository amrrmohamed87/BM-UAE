import { formatDate } from "@/utils/formatDate";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useTritonPrepare = (pageType) => {
    /**
     * useState hook to manage data
     */

    const [plannedSHPDate, setPlannedSHPDate] = useState({
        date: "",
    })
    const [searchDate, setSearchDate] = useState('');
    const [plannedSHPDateItems, setPlannedSHPDateItems] = useState([]);
    const [isLoadindPlannedSHPDateItems, setIsLoadingPlannedSHPDateItems] = useState(false);

    const [uniqueDateOptions, setUniqueDateOptions] = useState([]);
    const [uniqueDateQueue, setUniqueDateQueue] = useState('');
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);
    const [isDeletingTritonPrepare, setIsDeletingTritonPrepare] = useState(false);
    const [isArchivingTritonPrepare, setIsArchivingTritonPrepare] = useState(false);
    const [isRestoringTritonPrepare, setIsRestoringTritonPrepare] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);

    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [staticData, setStaticData] = useState({
        plannedSHPDate: "",
        comInvoice: "",
        masterAWB: "",
    });

   const [tritonSavedData, setTritonSavedData] = useState([]);
   const [isLoadingTritonSavedData, setIsLoadingTritonSavedData] = useState(false);
    

    const [tritonPreparedData, setTritonPreparedData] = useState([]);
    const [isLoadingTritonPreparedData, setIsLoadingTritonPreparedData] = useState(false);

    const [filterTritonPrepare, setFilterTritonPrepare] = useState(false);
    

    const [tritonPreparedArchivedData, setTritonPreparedArchivedData] = useState([]);
    const [isLoadingTritonPreparedArchivedData, setIsLoadingTritonPreparedArchivedData] = useState(false);

    const date = formatDate;
   
    useEffect(() => {
        if (searchDate) {
            async function fetchItemsPerData() {
                setIsLoadingPlannedSHPDateItems(true);

                try {
                    const response = await fetch(`https://benchmark-innovation-production.up.railway.app/api/triton-order/items/${searchDate}`);
                    const resData = await response.json();

                    if (!response.ok) {
                        toast.error(resData.message);
                        setIsLoadingPlannedSHPDateItems(false);
                        return;
                    }

                    setPlannedSHPDateItems(resData.data);

                    const uniqueDates = [
                        ... new Set(
                            resData.data.flatMap(order => order.CAPOrder.PO.PFI)
                            .flatMap(pfi => pfi.PFIItems)
                            .flatMap(item => item.Items.Cycles)
                            .map((cycle) => cycle.SHPDate)
                        )
                    ].map((cycle) => ({
                        label: date(cycle),
                        value: date(cycle)
                    }))
                    setUniqueDateOptions(uniqueDates);

                    setIsLoadingPlannedSHPDateItems(false);
                } catch (error) {
                    toast.error(error.message);
                    setIsLoadingPlannedSHPDateItems(false);
                    return;
                }
            }
            fetchItemsPerData();
        }
    }, [searchDate, reloadTable]);

    useEffect(() => {
        async function fetchSavedTriton() {
            setIsLoadingTritonSavedData(true);

            try {
                const response = await fetch('https://benchmark-innovation-production.up.railway.app/api/triton-saving');
                const resData = await response.json();
                
                if (!response.ok) {
                    toast.error(resData.message);
                    setIsLoadingTritonSavedData(false);
                    return;
                }

                setTritonSavedData(resData.data);

                //TODO -- Unique data

                setIsLoadingTritonSavedData(false);
            } catch (error) {
                toast.error(error.message);
                setIsLoadingTritonSavedData(false);
                return;
            }
        }
        fetchSavedTriton()
    }, [reloadTable])

    console.log(tritonSavedData)

    

    return {
        plannedSHPDate,
        setPlannedSHPDate,
        setSearchDate,
        //?---------------
        plannedSHPDateItems,
        isLoadindPlannedSHPDateItems,
        uniqueDateOptions,
        uniqueDateQueue,
        setUniqueDateQueue,
        date,
        rowsPerPage,
        setRowsPerPage,
        currentPage,
        setCurrentPage,
        //?--------------------
        
        
        staticData,
        setStaticData,
      
        
        isSavingOrder,
        setIsSavingOrder,
        //?--------------------
        tritonPreparedData,
        isLoadingTritonPreparedData,
        //?--------------------
        tritonPreparedArchivedData,
        isLoadingTritonPreparedArchivedData,
        //?--------------------
        filterTritonPrepare,
        setFilterTritonPrepare,
        isDeletingTritonPrepare,
        setIsDeletingTritonPrepare,
        isArchivingTritonPrepare,
        setIsArchivingTritonPrepare,
        isRestoringTritonPrepare,
        setIsRestoringTritonPrepare,
        reloadTable,
        setReloadTable,
        selectedRows,
        setSelectedRows,
        //?---------------------
       
    }
}