import { getCustomers } from "../Sales/loadDataSales";

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