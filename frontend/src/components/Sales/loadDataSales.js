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

export const getCustomers = async (token) => {
    const response = await axios.get("/api/sales/customer/A", {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    return items;
};

export const getSpecificCustomer = async (custID, token) => {
    const response = await axios.get(`/api/sales/customer/${custID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    return items[0];
};

export const getSalesOrderDetails = async (salesOrderID, token) => {
    const response = await axios.get(`/api/sales/sales-order/${salesOrderID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    
    let items = handleResponse(response);
    return items[0];
};

export const getAllSalesOrders = async (token, status="") => {
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
        if (status !== "") {
            if (item.status === status)
                allSalesOrders.push(salesOrder);
        } else {
            allSalesOrders.push(salesOrder);
        }
    })
    
    return allSalesOrders;
};

export const showSalesOrderForm = async (token, salesOrderID) => {
    const response = await axios.get(`/api/sales//so-form/${salesOrderID}`, {
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

export const getAllPackages = async (token, status="") => {
    const allPackages = [];
    const response = await axios.get("/api/sales/package/A", {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    items.forEach((item) => {
        let packages = {
            packageID: item.packageID,
            status: item.status,
            packageDate: item.packageDate.substring(0, 10),
            customerID: item.customerID,
            customerName: item.custDetails[0].customerName,
            addressLine1: item.custDetails[0].addressLine1,
            salesOrderID: item.salesOrderID
        };
        if (status !== "") {
            if (item.status === status)
                allPackages.push(packages);
        } else {
            allPackages.push(packages);
        }
    })
    
    return allPackages;
};

export const getPackageDetails = async (packageID, token) => {
    const response = await axios.get(`/api/sales/package/${packageID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    return items[0];
};

export const getAllDeliveryChallan = async (token, status="") => {
    const allChallans = [];
    const response = await axios.get("/api/sales/challan/A", {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
  
    items.forEach((item) => {
        let challans = {
            challanID: item.challanID,
            status: item.status,
            challanDate: item.challanDate.substring(0, 10),
            challanType: item.challanType,
            customerID: item.customerID,
            customerName: item.custDetails[0].customerName,
            addressLine1: item.custDetails[0].addressLine1,
        };
        if (status !== "") {
            if (item.status === status)
                allChallans.push(challans);
        } else {
            allChallans.push(challans);
        }
    })
    
    return allChallans;
};

export const getChallanDetails = async (challanID, token) => {
    const response = await axios.get(`/api/sales/challan/${challanID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    return items[0];
};

export const getAllInvoice = async (token, status="") => {
    const allInvoices = [];
    const response = await axios.get("/api/sales/invoice/A", {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
  
    items.forEach((item) => {
        let invoice = {
            invoiceID: item.invoiceID,
            status: item.status,
            invoiceDate: item.invoiceDate.substring(0, 10),
            dueDate: item.dueDate.substring(0, 10),
            customerID: item.customerID,
            customerName: item.custDetails[0].customerName,
            addressLine1: item.custDetails[0].addressLine1,
            salesOrderID: (item.salesOrderID === 0) ? "" : item.salesOrderID
        };
        if (status !== "") {
            if (item.status === status)
                allInvoices.push(invoice);
        } else {
            allInvoices.push(invoice);
        }
    })
    
    return allInvoices;
};

export const getInvoiceDetails = async (invoiceID, token) => {
    const response = await axios.get(`/api/sales/invoice/${invoiceID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    return items[0];
};

export const showInvoiceForm = async (token, invoiceID) => {
    const response = await axios.get(`/api/sales/view-invoice/${invoiceID}`, {
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
