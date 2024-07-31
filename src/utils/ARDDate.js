import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const handleArchiveRestoreOrDeleteData = async (
  data, 
  apiEndPoint,
  setIsLoadingState, 
  setReloadtable, 
  reloadTable, 
  setSelectedRows
) => {
  setIsLoadingState(true);

  if (data.ids.length === 0) {
    toast.error("Nothing been selected for the operation");
    setIsLoadingState(false);
    return;
  }

    try {
      const response = await fetch(apiEndPoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const resData = await response.json();


      console.log(resData.message)
      if (!response.ok) {
        toast.error(resData.message);
        setIsLoadingState(false);
        return 
      }
  
      toast.success(resData.message);
      setReloadtable(!reloadTable);
      setSelectedRows([]);
      setIsLoadingState(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoadingState(false);
      return 
    }
  };
  