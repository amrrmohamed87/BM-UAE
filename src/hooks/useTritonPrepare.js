import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useTritonPrepare = (pageType) => {
    /**
     * useState hook to manage data
     */

    const [plannedSHPDateItems, setPlannedSHPDateItems] = useState([]);
    const [isLoadindPlannedSHPDateItems, setIsLoadingPlannedSHPDateItems] = useState(false);


    return {
        plannedSHPDateItems,
        isLoadindPlannedSHPDateItems
    }
}