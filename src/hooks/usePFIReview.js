import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const usePFIReview = (pageType) => {
     /**
      * useState hook to manage data
      */

  const [requestedPFIs, setRequestedPFIs] = useState([]);
  const [isLoadingRequestedPFIs, setIsLoadingRequestedPFIs] = useState(false);

  const [uniqueCAPIDOptions, setUniqueCAPIDOptions] = useState([]);
  const [uniqueCAPIDQueue, setUniqueCAPIDQueue] = useState("");

  const [uniquePFINoOptions, setUniquePFINoOptions] = useState([]);
  const [uniquePFINoQueue, setUniquePFINoQueue] = useState("");

  const [uniqueSERIALOptions, setUniqueSERIALOptions] = useState([]);
  const [uniqueSERIALQueue, setUniqueSERIALQueue] = useState("");

  const [uniqueItemsOptions, setUniqueItemsOptions] = useState([]);
  const [uniqueItemsQueue, setUniqueItemsQueue] = useState("");

  const [filterRequestedPFITable, setFilterRequestedPFITable] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const [pfiRequestId, setPFIRequestId] = useState({
    id: "",
  });
  const [isArchivingPFIRequest, setIsArchivingPFIRequest] = useState(false);

  const [pfiData, setPFIDate] = useState([]);
  const [isLoadingSinglePFI, setIsLoadingSinglePFI] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    PFINo: "",
    PFIValue: "",
  })

  const [reloadTable, setIsReloadTable] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const [isUpdatingPFI, setIsUpdatingPFI] = useState(false);

  const [isCreatingPO, setIsCreatingPO] = useState(false);

  const [isDeletingPFI, setIsDeletingPFI] = useState(false);

  const [archivePFI, setArchivePFI] = useState([]);
  const [isLoadingArchivePFI, setIsLoadingArchivePFI] = useState(false);
  const [isRestoringPFIs, setIsRestoringPFIs] = useState(false);

  const [uniqueArchivedCAPIDOptions, setUniqueArchivedCAPIDOptions] = useState([]);
  const [uniqueArchivedCAPIDQueue, setUniqueArchivedCAPIDQueue] = useState("");

  const [uniqueArchivedPFINoOptions, setUniqueArchivedPFINoOptions] = useState([]);
  const [uniqueArchivedPFINoQueue, setUniqueArchivedPFINoQueue] = useState("");

  const [uniqueArchivedItemsOptions, setUniqueArchivedItemsOptions] = useState([]);
  const [uniqueArchivedItemsQueue, setUniqueArchivedItemsQueue] = useState("");

  //------------------
  

  /**
   * useEffect fucntions to fetch data
   * 1- fetch requestesPFIs
   * 2- fetch pfiData
   * 3- fetch archivedPFIs
   */

  useEffect(() => {
    if (pageType === 'reviewPFI') {
      async function fetchRequestedPFIs() {
        setIsLoadingRequestedPFIs(true);
  
        try {
          const response = await fetch(
            "https://benchmark-innovation-production.up.railway.app/api/pfi"
          );
          const resData = await response.json();
  
          if (!response.ok) {
            toast.error(resData.message);
            setIsLoadingRequestedPFIs(false);
            return;
          }
  
          setRequestedPFIs(resData.data);
  
          const uniqueCAPID = [
            ...new Set(resData.data.map((cap) => cap.Customer.customerCapIdNo)),
          ].map((cap) => ({
            label: cap,
            value: cap,
          }));
          setUniqueCAPIDOptions(uniqueCAPID);
  
          const uniquePFINo = [
            ...new Set(resData.data.map((pfi) => pfi.PFINo)),
          ].map((PFINo) => ({
            label: PFINo,
            value: PFINo,
          }));
          setUniquePFINoOptions(uniquePFINo);
  
          const uniqueSERIAL = [
            ...new Set(resData.data.map((serial) => serial.SERIAL)),
          ].map((serial) => ({
            label: serial,
            value: serial,
          }));
          setUniqueSERIALOptions(uniqueSERIAL);
  
          const uniqueItems = [
            ...new Set(
              resData.data.flatMap((item) =>
                item.PFIItems.map((itemName) => itemName.Items.itemName)
              )
            ),
          ].map((items) => ({
            label: items,
            value: items,
          }));
          setUniqueItemsOptions(uniqueItems);
  
          setIsLoadingRequestedPFIs(false);
        } catch (error) {
          toast.error(error.message);
          setIsLoadingRequestedPFIs(false);
          return;
        }
      }
      fetchRequestedPFIs();
    }
  }, [reloadTable]);

  useEffect(() => {
    async function loadPFIDate() {
      setIsLoadingSinglePFI(true);

      try {
        const response = await fetch(
          `https://benchmark-innovation-production.up.railway.app/api/pfi/${pfiRequestId.id}`
        );
        const resData = await response.json();

        if (!response.ok) {
          toast.error(resData.message);
          setIsLoadingSinglePFI(false);
          return;
        }

        setPFIDate(resData);
        setUpdatedData({
          PFINo: resData.PFINo,
          PFIValue: resData.PFIValue,
        })
        setIsLoadingSinglePFI(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoadingSinglePFI(false);
        return;
      }
    }
    if (pfiRequestId.id) {
      loadPFIDate();
    }
  }, [pfiRequestId]);


  useEffect(() => {
    if (pageType === 'archivePFI') {
      async function loadArchivePFI() {
        setIsLoadingArchivePFI(true);
  
        try {
          const response = await fetch(
            "https://benchmark-innovation-production.up.railway.app/api/pfi/archive"
          );
          const resData = await response.json();
  
          if (!response.ok) {
            toast.error(resData.message);
            setIsLoadingArchivePFI(false);
            return;
          }
  
          setArchivePFI(resData.data);
  
          const uniqueCAPID = [
            ...new Set(resData.data.map((cap) => cap.Customer.customerCapIdNo)),
          ].map((cap) => ({
            label: cap,
            value: cap,
          }));
          setUniqueArchivedCAPIDOptions(uniqueCAPID);
  
          const uniquePFINo = [
            ...new Set(resData.data.map((pfi) => pfi.PFINo)),
          ].map((PFINo) => ({
            label: PFINo,
            value: PFINo,
          }));
          setUniqueArchivedPFINoOptions(uniquePFINo);
  
          const uniqueItems = [
            ...new Set(
              resData.data.flatMap((item) =>
                item.PFIItems.map((itemName) => itemName.Items.itemName)
              )
            ),
          ].map((items) => ({
            label: items,
            value: items,
          }));
          setUniqueArchivedItemsOptions(uniqueItems);
  
          setIsLoadingArchivePFI(false);
        } catch (error) {
          toast.error(error.message);
          setIsLoadingArchivePFI(false);
          return;
        }
      }
      loadArchivePFI();
    }
  }, [reloadTable]);


  return {
    requestedPFIs,
    isLoadingRequestedPFIs,
    uniqueCAPIDOptions,
    uniqueCAPIDQueue,
    setUniqueCAPIDQueue,
    uniquePFINoOptions,
    uniquePFINoQueue,
    setUniquePFINoQueue,
    uniqueSERIALOptions,
    uniqueSERIALQueue,
    setUniqueSERIALQueue,
    uniqueItemsOptions,
    uniqueItemsQueue,
    setUniqueItemsQueue,
    filterRequestedPFITable,
    setFilterRequestedPFITable,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    pfiRequestId,
    setPFIRequestId,
    isArchivingPFIRequest,
    setIsArchivingPFIRequest,
    pfiData,
    setPFIDate,
    isLoadingSinglePFI,
    setIsLoadingSinglePFI,
    reloadTable,
    setIsReloadTable,
    selectedRows,
    setSelectedRows,
    isUpdatingPFI,
    setIsUpdatingPFI,
    updatedData, 
    setUpdatedData,
    isCreatingPO,
    setIsCreatingPO,
    isDeletingPFI,
    setIsDeletingPFI,
    archivePFI,
    isLoadingArchivePFI,
    isRestoringPFIs,
    setIsRestoringPFIs,
    uniqueArchivedCAPIDOptions,
    uniqueArchivedCAPIDQueue,
    uniqueArchivedItemsOptions,
    uniqueArchivedItemsQueue,
    uniqueArchivedPFINoOptions,
    uniqueArchivedPFINoQueue,
    setUniqueArchivedCAPIDOptions,
    setUniqueArchivedCAPIDQueue,
    setUniqueArchivedItemsOptions,
    setUniqueArchivedItemsQueue,
    setUniqueArchivedPFINoOptions,
    setUniqueArchivedPFINoQueue
  };

}