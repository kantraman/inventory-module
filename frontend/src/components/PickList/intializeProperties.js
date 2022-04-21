import { getItemByGroups } from "../Items/loadItems";
import { getAllSalesOrders, getCustomers, getSalesOrders } from "../Sales/loadDataSales";

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

export const intializeSalesOrder = async (token) => {
    const details = {};
    details.data = await getAllSalesOrders(token);
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