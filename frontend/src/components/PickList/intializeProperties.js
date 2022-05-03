import { getItemByGroups } from "../Items/loadItems";
import {
    getAllBills,
    getAllPurchaseOrders,
    getAllVendorCreditNotes,
    getVendors
} from "../Purchase/loadDataPurchase";
import {
    getAllSalesOrders,
    getCustomers,
    getAllPackages,
    getAllDeliveryChallan,
    getAllInvoice,
    getAllSalesReturns,
    getAllCreditNotes
} from "../Sales/loadDataSales";

//Customer
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

//Inventory items
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

//Sales Order
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

//Packages
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

//Delivery Challan
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

//Invoices
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

//Sales Returns
export const intializeSalesReturns = async (token, status="") => {
    const details = {};
    details.data = await getAllSalesReturns(token, status);
    details.title = "SALES RETURNS";
    details.rowHeaders = ["ID", "Status", "Date", "Cust. ID", "Customer Name",
        "Address", "Reason", "Invoice ID"];
    details.search = [{
        title: "Name",
        field: "customerName"
    }, {
        title: "Address",
        field: "addressLine1"
    }]
    return details;
}

//Credit Notes
export const intializeCreditNote = async (token, status="") => {
    const details = {};
    details.data = await getAllCreditNotes(token, status);
    details.title = "CREDIT NOTES";
    details.rowHeaders = ["ID", "Status", "Date", "Ref. No.", "Cust. ID",
        "Customer Name", "Address", "Amount", "Sales Return ID", "Invoice ID"];
    details.search = [{
        title: "Name",
        field: "customerName"
    }, {
        title: "Address",
        field: "addressLine1"
    }]
    return details;
}

//Vendor
export const intializeVendor = async (token) => {
    const details = {};
    details.data = await getVendors(token);
    details.title = "VENDORS";
    details.rowHeaders = ["ID", "Goods/Services", "Name", "POC Name",
        "Address1", "Address2", "Address3", "City", "State",
        "PIN", "Country", "Email", "POC Email", "Phone No. 1",
        "Phone No. 2", "POC Contact No.", "Website"];
    details.search = [{
        title: "Name",
        field: "companyName"
    }, {
        title: "POC Name",
        field: "pocName"
    }]
    return details;
}

//Purchase Order
export const intializePurchaseOrder = async (token, status="") => {
    const details = {};
    details.data = await getAllPurchaseOrders(token, status);
    details.title = "PURCHASE ORDERS";
    details.rowHeaders = ["ID", "Status", "Vendor ID", "Company Name",
        "Address", "Order Date", "Exp. Delivery"];
    details.search = [{
        title: "Name",
        field: "companyName"
    }, {
        title: "Address",
        field: "addressLine1"
    }]
    return details;
}

//Bill
export const intializeBills = async (token, status="") => {
    const details = {};
    details.data = await getAllBills(token, status);
    details.title = "BILLS";
    details.rowHeaders = ["ID", "Ref. No.", "Status", "Vendor ID", "Company Name",
        "Address", "Bill Date", "Due date", "PO ID"];
    details.search = [{
        title: "Name",
        field: "companyName"
    }, {
        title: "Address",
        field: "addressLine1"
    }]
    return details;
}

//Vendor Credit Notes
export const intializeVendorCreditNote = async (token, status="") => {
    const details = {};
    details.data = await getAllVendorCreditNotes(token, status);
    details.title = "CREDIT NOTES";
    details.rowHeaders = ["ID", "Status", "Date", "Ref. No.", "Vendor ID",
        "Company Name", "Address", "Amount", "Other Charges", "Discount"];
    details.search = [{
        title: "Name",
        field: "customerName"
    }, {
        title: "Address",
        field: "addressLine1"
    }]
    return details;
}

