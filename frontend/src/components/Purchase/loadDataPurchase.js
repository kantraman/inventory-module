import axios from "axios";
import Logout from "../Admin/logout";
import { formatNum, formatDateFromDB } from "../../utility";

const handleResponse = (response) => {
    if (response.status === 401)
        Logout();
    let items = [];
    
    if (Array.isArray(response.data))
        return response.data;
    else
        return items;
};

//Vendor
export const getVendors = async (token, vendorID = "A") => {
    const response = await axios.get(`/api/purchase/vendor/${vendorID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    if (vendorID === "A")
        return items;
    else
        return items[0];
};

//Purchase Order
export const getPurchaseOrderDetails = async (purchaseOrderID, token) => {
    const response = await axios.get(`/api/purchase/purchase-order/${purchaseOrderID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    
    let items = handleResponse(response);
    return items[0];
};

export const getAllPurchaseOrders = async (token, status="") => {
    const allPurchaseOrders = [];
    const response = await axios.get("/api/purchase/purchase-order/A", {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    
    items.forEach((item) => {
        let purchaseOrder = {
            purchaseOrderID: item.purchaseOrderID,
            status: item.status,
            vendorID: item.vendorID,
            companyName: item.vendorDetails[0].companyName,
            addressLine1: item.vendorDetails[0].addressLine1,
            orderDate: formatDateFromDB(item.orderDate),
            expectedDate: formatDateFromDB(item.expectedDate)
        };
        if (status !== "") {
            if (item.status === status)
                allPurchaseOrders.push(purchaseOrder);
        } else {
            allPurchaseOrders.push(purchaseOrder);
        }
    })
    
    return allPurchaseOrders;
};

export const showPurchaseOrderForm = async (token, purchaseOrderID) => {
    const response = await axios.get(`/api/purchase/po-form/${purchaseOrderID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        },
        responseType: 'blob',
        timeout: 30000
    });
    if (response.headers["content-type"] === "application/pdf") {
        const blob = await response.data;
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        URL.revokeObjectURL(url);
    } else if (response.headers["content-type"] === "application/json") {
        if (response.data.status)
            window.alert(response.data.message);
    } else {
        window.alert("An error occured while getting data.");
    }
            
};

