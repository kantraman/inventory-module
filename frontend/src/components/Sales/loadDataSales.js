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

export const getSalesOrderDetails = async (salesOrderID, token) => {
    const response = await axios.get(`/api/sales/sales-order/${salesOrderID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    
    let items = handleResponse(response);
    return items[0];
}

export const getAllSalesOrders = async (token) => {
    const allSalesOrders = [];
    const response = await axios.get("/api/sales/sales-order/A", {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    
    items.forEach((item) => {
        let salesOrder = {
            salesOrderID: item.salesOrderID,
            status: item.status,
            customerID: item.customerID,
            customerName: item.custDetails[0].customerName,
            addressLine1: item.custDetails[0].addressLine1,
            orderDate: item.orderDate.substring(0, 10)
        };
        allSalesOrders.push(salesOrder);
    })
    
    return allSalesOrders;
}