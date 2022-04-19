import axios from "axios";
import Logout from "../Admin/logout";

const handleResponse = (response) => {
    if (response.status === 401)
        Logout();
    let items = [];
    if (Array.isArray(response.data))
        items = response.data;
    return items;
}

export const getCustomers = async (token) => {
    const response = await axios.get("/api/sales/customer/A", {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    return items;
}

export const getSpecificCustomer = async (custID, token) => {
    const response = await axios.get(`/api/sales/customer/${custID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    return items[0];
}