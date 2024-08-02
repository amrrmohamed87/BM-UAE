import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useTritonPrepare = (pageType) => {
    /**
     * useState hook to manage data
     */

    const [plannedSHPDateItems, setPlannedSHPDateItems] = useState([]);
    const [isLoadindPlannedSHPDateItems, setIsLoadingPlannedSHPDateItems] = useState(false);

    const [tritonPreparedData, setTritonPreparedData] = useState([]);
    const [isLoadingTritonPreparedData, setIsLoadingTritonPreparedData] = useState(false);

    const [filterTritonPrepare, setFilterTritonPrepare] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isDeletingTritonPrepare, setIsDeletingTritonPrepare] = useState(false);
    const [isArchivingTritonPrepare, setIsArchivingTritonPrepare] = useState(false);
    const [isRestoringTritonPrepare, setIsRestoringTritonPrepare] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);

    const [tritonPreparedArchivedData, setTritonPreparedArchivedData] = useState([]);
    const [isLoadingTritonPreparedArchivedData, setIsLoadingTritonPreparedArchivedData] = useState(false);



    return {
        plannedSHPDateItems,
        isLoadindPlannedSHPDateItems,
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
        setSelectedRows
        //?---------------------

    }
}