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

//Monthly Summary
export const getMonthlySummary = async (token, type) => {
    let apiURL = "";
    switch (type) {
        case 1: //SalesOrders
            apiURL = "/api/dashboard/salesorder-summary";
            break;
        case 2: //Purchase Orders
            apiURL = "/api/dashboard/purchaseorder-summary";
            break;
        case 3: //Delivery Challan Summary
            apiURL = "/api/dashboard/deliverychallan-summary";
            break;
        case 4: //Package Summary
            apiURL = "/api/dashboard/package-summary";
            break;
        case 5: //Sales Return Summary
            apiURL = "/api/dashboard/salesreturn-summary";
            break;
        case 6: //Invoice Summary
            apiURL = "/api/dashboard/invoice-summary";
            break;
        case 7: //Bill Summary
            apiURL = "/api/dashboard/bill-summary";
            break;
        case 8: //Rec Pay Inv Adj Summary
            apiURL = "/api/dashboard/inv-adj-rec-pay";
            break;
        default:
            break;
    }
    const response = await axios.get(apiURL, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    return items;
};
