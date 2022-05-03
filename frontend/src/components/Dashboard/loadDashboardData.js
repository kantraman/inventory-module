import axios from "axios";
import Logout from "../Admin/logout";

const handleResponse = (response) => {
    if (response.status === 401)
        Logout();
    let items = [];
    
    if (Array.isArray(response.data))
        return response.data;
    else
        return items;
};

//General Summary
export const getGeneralSummary = async (token) => {
    const response = await axios.get("/api/dashboard/general-summary", {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = response.data;
    return items;
};
