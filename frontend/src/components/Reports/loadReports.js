import axios from "axios";

const getReport = async (apiURL, token, contenType, setLoading) => {
    const response = await axios.get(apiURL, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        },
        responseType: 'blob',
        timeout: 0
    });
    if (response.headers["content-type"] === contenType) {
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
    setLoading(false);
}

//Inventory Summary
export const showInventorySummary = async (token, setLoading, export2Excel = false) => {
    let apiURL = "/api/reports/inventory-summary";
    let contenType = "application/pdf";

    if (export2Excel) {
        apiURL = "/api/reports/export-inventory-summary";
        contenType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    getReport(apiURL, token, contenType, setLoading);
};

//Product Sales Report
export const showProductSalesReport = async (
    token,
    fromDate,
    toDate,
    setLoading,
    export2Excel = false
) => {
    let apiURL = "/api/reports/product-sales";
    let contenType = "application/pdf";

    if (export2Excel) {
        apiURL = "/api/reports/export-product-sales";
        contenType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }
    apiURL += `?fromDate=${fromDate}&toDate=${toDate}`

    getReport(apiURL, token, contenType, setLoading);
};

//Sales by Customer Report
export const showCustomerSalesReport = async (
    token,
    fromDate,
    toDate,
    setLoading,
    export2Excel = false
) => {
    let apiURL = "/api/reports/customer-sales";
    let contenType = "application/pdf";

    if (export2Excel) {
        apiURL = "/api/reports/export-customer-sales";
        contenType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }
    apiURL += `?fromDate=${fromDate}&toDate=${toDate}`

    getReport(apiURL, token, contenType, setLoading);
   
};

//Inventory Aging Summary
export const showInventoryAgingSummary = async (token, setLoading, export2Excel = false) => {
    let apiURL = "/api/reports/inventory-aging";
    let contenType = "application/pdf";

    if (export2Excel) {
        apiURL = "/api/reports/export-inventory-aging";
        contenType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    getReport(apiURL, token, contenType, setLoading);
};
