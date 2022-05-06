import axios from "axios";

export const showInventorySummary = async (token, setLoading, export2Excel = false) => {
    let apiURL = "/api/reports/inventory-summary";
    let contenType = "application/pdf";

    if (export2Excel) {
        apiURL = "/api/reports/export-inventory-summary";
        contenType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

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
};
