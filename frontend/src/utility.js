//Format date yyyy-mm-dd
export function formatDate(date) {
    date = date.toString();
    if (date.length === 10) {
        date = date.substring(6, 10) + "-"
            + date.substring(3, 5) + "-"
            + date.substring(0, 2);
    }
    
    return date;
}

export function formatNum(amount) {
    return Number(amount).toFixed(2);
}

export function formatDateFromDB(date) {
    date = date.toString().substring(0, 10);
    if (date.length === 10) {
        date = date.substring(8, 10) + "-"
            + date.substring(5, 7) + "-"
            + date.substring(0, 4);
    }
    
    return date;
}
