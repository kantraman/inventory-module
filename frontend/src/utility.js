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
