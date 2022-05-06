import axios from "axios";
import Logout from "../Admin/logout";

const handleResponse = (response) => {
    if (response.status === 401)
        Logout();
    let items = [];
    if (Array.isArray(response.data))
        items = response.data;
    return items;
}

export const getItemGroups = async (token) => {
    const response = await axios.get("/api/inventory/item-groups/A", {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    return items;
}

export const getItemGroupByID = async (token, groupID) => {
    const response = await axios.get(`/api/inventory/item-groups/${groupID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    return items[0];
}

export const getItemByGroups = async (token, groupID) => {
    const response = await axios.get(`/api/inventory/allitems4group/${groupID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    return items;
}

export const getItemDetails = async (token, itemID) => {
    const response = await axios.get(`/api/inventory/item/${itemID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = handleResponse(response);
    
    return items[0];
}

export const getItemStock = async (token, itemID) => {
    const response = await axios.get(`/api/inventory/item-stock/${itemID}`, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    let items = response.data;
    
    if (items.stockOnHand)
        return "Stock : " + items.stockOnHand;
    else
        return "";
}