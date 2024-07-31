import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const usePO = (pageType) => {
    /**
     * useState hook to manage data
     */

    const [createdPOs, setCreatedPOs] = useState([]);
    const [isLoadingCreatedPOs, setIsLoadingCreatedPOs] = useState(false);
  
    const [uniqueCustomerNameOptions, setUniqueCustomerNameOptions] = useState(
      []
    );
    const [uniqueCustomerNameQueue, setUniqueCustomerNameQueue] = useState("");
  
    const [uniqueCAPIDOptions, setUniqueCAPIDOptions] = useState([]);
    const [uniqueCAPIDQueue, setUniqueCAPIDQueue] = useState("");
  
    const [uniqueDateOptions, setUniqueDateOptions] = useState([]);
    const [uniqueDataQueue, setUniqueDataQueue] = useState("");
  
    const [filterCreatedPOTable, setFilterCreatedPOTable] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);

    const [isArchivingPO, setIsArchivingPO] = useState(false);
    const [isDeletingPO, setIsDeletingPO] = useState(false);
  
    const [orderConfirmationData, setorderConfirmationData] = useState({
      POId: "",
      orderConfirmationNo: "",
    });
  
    const [isConfirmingCapOrder, setIsConfirmingCapOrder] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const [archivedPOs, setArchivedPOs] = useState([]);
    const [isLoadingArchivedPOs, setIsLoadingArchivedPOs] = useState(false);

    const [uniqueArchivedCustomerNameOptions, setUniqueArchivedCustomerNameOptions] = useState(
        []
      );
      const [uniqueArchivedCustomerNameQueue, setUniqueArchivedCustomerNameQueue] = useState("");
    
      const [uniqueArchivedCAPIDOptions, setUniqueArchivedCAPIDOptions] = useState([]);
      const [uniqueArchivedCAPIDQueue, setUniqueArchivedCAPIDQueue] = useState("");
    
      const [uniqueArchivedDateOptions, setUniqueArchivedDateOptions] = useState([]);
      const [uniqueArchivedDataQueue, setUniqueArchivedDataQueue] = useState("");

      const [isRestoringPO, setIsRestoringPO] = useState(false);
  
    const [reloadTable, setReloadTable] = useState(false);


    /**
     * Functions
     * 1- formatDate
     */

    function formatDate(dateString) {
        if (!dateString) return "N/A";
    
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });
      }
      
    /**
     * useEffect to fetch data
     * 1- fetch createdPO
     * 2- fetch archivedPO
     */

    useEffect(() => {
        if (pageType === 'poReview') {
            async function fetchCreatedPOs() {
            setIsLoadingCreatedPOs(true);
    
            try {
                const response = await fetch(
                "https://benchmark-innovation-production.up.railway.app/api/po"
                );
                const resData = await response.json();
    
                if (!response.ok) {
                toast.error(resData.message);
                setIsLoadingCreatedPOs(false);
                return;
                }
    
                setCreatedPOs(resData.data);
    
                const uniqueCustomerName = [
                ...new Set(
                    resData.data.flatMap((po) =>
                    po.PFI.map((pfi) => pfi.Customer.customerName)
                    )
                ),
                ].map((customer) => ({
                label: customer,
                value: customer,
                }));
                setUniqueCustomerNameOptions(uniqueCustomerName);
    
                const uniqueCAPID = [
                ...new Set(
                    resData.data.flatMap((po) =>
                    po.PFI.map((pfi) => pfi.Customer.customerCapIdNo)
                    )
                ),
                ].map((cap) => ({
                label: cap,
                value: cap,
                }));
                setUniqueCAPIDOptions(uniqueCAPID);
    
                const uniqueDates = [
                ...new Set(resData.data.map((date) => formatDate(date.createdAt))),
                ].map((date) => ({
                label: date,
                value: date,
                }));
                setUniqueDateOptions(uniqueDates);
    
                setIsLoadingCreatedPOs(false);
            } catch (error) {
                toast.error(error.message);
                setIsLoadingCreatedPOs(false);
                return;
            }
            }
            fetchCreatedPOs();
        }
    }, [reloadTable]);

    useEffect(() => {
        if (pageType === 'poArchive') {
            async function fetchArchivedPOs() {
                setIsLoadingArchivedPOs(true);

                try {
                    const response = await fetch('https://benchmark-innovation-production.up.railway.app/api/po/archive');
                    const resData = await response.json();

                    if (!response.ok) {
                        toast.error(resData.message);
                        setIsLoadingArchivedPOs(false);
                        return;
                    }

                    setArchivedPOs(resData.data);

                    const uniqueCustomerName = [
                        ...new Set(
                            resData.data.flatMap((po) =>
                            po.PFI.map((pfi) => pfi.Customer.customerName)
                            )
                        ),
                        ].map((customer) => ({
                        label: customer,
                        value: customer,
                        }));
                        setUniqueArchivedCustomerNameOptions(uniqueCustomerName);
            
                        const uniqueCAPID = [
                        ...new Set(
                            resData.data.flatMap((po) =>
                            po.PFI.map((pfi) => pfi.Customer.customerCapIdNo)
                            )
                        ),
                        ].map((cap) => ({
                        label: cap,
                        value: cap,
                        }));
                        setUniqueArchivedCAPIDOptions(uniqueCAPID);
            
                        const uniqueDates = [
                        ...new Set(resData.data.map((date) => formatDate(date.createdAt))),
                        ].map((date) => ({
                        label: date,
                        value: date,
                        }));
                        setUniqueArchivedDateOptions(uniqueDates);

                    setIsLoadingArchivedPOs(false);
                } catch (error) {
                    toast.error(error.message);
                        setIsLoadingArchivedPOs(false);
                        return;
                }
            }
            fetchArchivedPOs()
        }
    }, [reloadTable])

  


  return {
    createdPOs,
    isLoadingCreatedPOs,
    uniqueCustomerNameOptions,
    setUniqueCustomerNameOptions,
    uniqueCustomerNameQueue,
    setUniqueCustomerNameQueue,
    uniqueCAPIDOptions,
    setUniqueCAPIDOptions,
    uniqueCAPIDQueue,
    setUniqueCAPIDQueue,
    uniqueDateOptions,
    setUniqueDateOptions,
    uniqueDataQueue,
    setUniqueDataQueue,
    filterCreatedPOTable,
    setFilterCreatedPOTable,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    orderConfirmationData,
    setorderConfirmationData,
    isConfirmingCapOrder,
    setIsConfirmingCapOrder,
    selectedRows,
    setSelectedRows,
    reloadTable,
    setReloadTable,
    formatDate,
    isArchivingPO,
    setIsArchivingPO,
    isDeletingPO,
    setIsDeletingPO,
    archivedPOs,
    isLoadingArchivedPOs,
    uniqueArchivedCustomerNameOptions,
    uniqueArchivedCustomerNameQueue,
    setUniqueArchivedCustomerNameQueue,
    uniqueArchivedCAPIDOptions,
    uniqueArchivedCAPIDQueue,
    setUniqueArchivedCAPIDQueue,
    uniqueArchivedDateOptions,
    uniqueArchivedDataQueue,
    setUniqueArchivedDataQueue,
    isRestoringPO,
    setIsRestoringPO
  }
}

