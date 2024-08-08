import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const handleCreateMethods = async (apiEndPoint, data, toastSuccessMsg) => {
    try {
        const response = await fetch(apiEndPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        const resData = await response.json();

        if (!response.ok) {
            toast.error(resData.message);
            return false;
        }

        toast.success(toastSuccessMsg);
        return true;
    } catch (error) {
        toast.error(error.message);
        return false;
    }
}