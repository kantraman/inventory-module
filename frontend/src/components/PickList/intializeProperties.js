import { getItemByGroups } from "../Items/loadItems";
import {
    getAllSalesOrders,
    getCustomers,
    getAllPackages,
    getAllDeliveryChallan,
    getAllInvoice
} from "../Sales/loadDataSales";

export const intializeCustomer = async (token) => {
    const details = {};
    details.data = await getCustomers(token);
    details.title = "CUSTOMERS";
    details.rowHeaders = ["ID", "Title", "Name", "Type",
        "Address1", "Address2", "Address3", "City", "State",
        "PIN", "Country", "Email", "Phone No. 1", "Phone No. 2", "Website"];
    details.search = [{
        title: "Name",
        field: "customerName"
    }, {
        title: "Address Line 1",
        field: "addressLine1"
    }]
    return details;
}

export const intializeItems = async (groupID, token) => {
    const details = {};
    details.data = await getItemByGroups(token, groupID);
    details.title = "ITEMS";
    details.rowHeaders = ["ID", "Name", "Brand", "SP", "CP", "Descr.",
        "Unit", "Dimensions", "Weight", "Manufacturer",
        "Opening Stock", "Reorder Point", "Pref. Vendor"];
    details.search = [{
        title: "Name",
        field: "itemName"
    }, {
        title: "Brand",
        field: "brand"
    }]
    return details;
}

export const intializeSalesOrder = async (token, status="") => {
    const details = {};
    details.data = await getAllSalesOrders(token, status);
    details.title = "SALES ORDERS";
    details.rowHeaders = ["ID", "Status", "Cust. ID", "Customer Name", "Address", "Order Date"];
    details.search = [{
        title: "Name",
        field: "customerName"
    }, {
        title: "Address",
        field: "addressLine1"
    }]
    return details;
}

export const intializePackage = async (token, status="") => {
    const details = {};
    details.data = await getAllPackages(token, status);
    details.title = "PACKAGES";
    details.rowHeaders = ["ID", "Status", "Pkg Date", "Cust. ID", "Customer Name", "Address", "SO ID"];
    details.search = [{
        title: "Name",
        field: "customerName"
    }, {
        title: "Address",
        field: "addressLine1"
    }]
    return details;
}

export const intializeDeliveryChallan = async (token, status="") => {
    const details = {};
    details.data = await getAllDeliveryChallan(token, status);
    details.title = "DELIVERY CHALLANS";
    details.rowHeaders = ["ID", "Status", "Date", "Type", "Cust. ID", "Customer Name", "Address"];
    details.search = [{
        title: "Name",
        field: "customerName"
    }, {
        title: "Address",
        field: "addressLine1"
    }]
    return details;
}

export const intializeInvoice = async (token, status="") => {
    const details = {};
    details.data = await getAllInvoice(token, status);
    details.title = "INVOICES";
    details.rowHeaders = ["ID", "Status", "Date", "Due Date", "Cust. ID", "Customer Name", "Address", "SO ID"];
    details.search = [{
        title: "Name",
        field: "customerName"
    }, {
        title: "Address",
        field: "addressLine1"
    }]
    return details;
}