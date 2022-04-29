import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Table, Row, Button} from 'react-bootstrap';
import Logout from '../Admin/logout';
import PickList from '../PickList/PickList';
import { getItemDetails, getItemGroups } from '../Items/loadItems';
import { intializeItems } from '../PickList/intializeProperties';
import { formatDate, formatNum, formatDateFromDB } from '../../utility';

const SalesOrderDatewise = () => {
    const initValues = {
        fromDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        toDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        groupID: "",
        itemID: "",
        itemName: ""
    }
    const { token } = useToken();
    //Set initial dates
    const [postValues, setPostValues] = useState(initValues);
    const [errorValues, setErrorValues] = useState({});
    const [itemGroups, setItemGroups] = useState([]);
    const [details, setDetails] = useState([]);
    //Picklist 
    const [plItems, setPlItems] = useState({});
    const loadPicklistProps = async (token) => {
        const itemGroups = await getItemGroups(token);
        setItemGroups(itemGroups);
    }
    useEffect(() => loadPicklistProps(token), []);

    //To handle item group change
    const handleItemGrpChange = async (event) => {
        const { name, value } = event.target;
        setPostValues({ ...postValues, [name]: value });
        let itemList = await intializeItems(value, token);
        setPlItems(itemList);
    }

    //Input values to itemDetails
    function handleChange(event) {
        const { name, value } = event.target;
        setPostValues({ ...postValues, [name]: value });
    }

    //Load item details
    const loadItemDetails = async (item) => {
        const itemDetails = await getItemDetails(token, item[0]);
        postValues.itemID = itemDetails.itemID;
        postValues.itemName = itemDetails.itemName;
        setPostValues({ ...postValues });
    }


    //Validate Dates
    const validateDates = () => {
        let fromDate = postValues.fromDate;
        let toDate = postValues.toDate;
        let isValid = true;
        let validationErrors = {};

        if (!postValues.fromDate)
            validationErrors.fromDate = "From date is required";
        if (!postValues.toDate)
            validationErrors.toDate = "To date is required";
        if (isNaN(new Date(fromDate).getTime())) {
            isValid = false;
            validationErrors.fromDate = "Invalid from Date";
        }
        if (isNaN(new Date(toDate).getTime())) {
            isValid = false;
            validationErrors.toDate = "Invalid to Date";
        }
        if (isValid) {
            if (new Date(fromDate) > new Date(toDate)) {
                validationErrors.fromDate = "From date cannot be greater than to date";
            }
        }
        
        return validationErrors;
    }

    const getDetails = async () => {
        let fromDate = postValues.fromDate;
        let toDate = postValues.toDate;
        let item = postValues.itemID;
        let validationErrors = validateDates();
        setErrorValues(validationErrors);
        setDetails([]);
        if (Object.keys(validationErrors).length !== 0)
            return 0;
        try {
            let apiURL = "/api/sales/sales-order";
            apiURL += "?fromDate=" + fromDate + "&toDate=" + toDate;
            if (item !== "")
                apiURL += "&item=" + item;
            let options = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            }
            let response = await axios.get(apiURL, options);
            if (response.status === 401)
                Logout();
            if (Array.isArray(response.data))
                setDetails(response.data);
            else
                window.alert(response.data.message);
        } catch (err) {
            window.alert("An error occurred while getting data.");
        }
    }

    return (
        <Form className="mx-auto col-lg-8 col-md-10 col-sm-12 p-3 formBg">
            <div className="text-center fs-3 mb-1 formHead">VIEW SALES ORDERS DATEWISE</div>
            <Row>
                <Form.Group className="col-md-6 mb-2" controlId="formFromDate">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control type="date" name="fromDate" value={postValues.fromDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.fromDate}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-2" controlId="formToDate">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control type="date" name="toDate" value={postValues.toDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.toDate}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6  mb-3" controlId="formItemGroup">
                    <Form.Label>Item Group</Form.Label>
                    <Form.Select name="groupID" value={postValues.groupID} onChange={handleItemGrpChange} >
                        <option value="">--Select--</option>
                        {itemGroups.map(item => <option value={item.ID} key={item.ID}>{item["Group Name"]}</option>)}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formItem">
                    <Form.Label>Select Item</Form.Label>
                    <PickList title={plItems.title} rowHeaders={plItems.rowHeaders} search={plItems.search}
                        data={plItems.data} onSelect={loadItemDetails} />
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formItemID">
                    <Form.Label>Item ID</Form.Label>
                    <Form.Control type="text" name="itemID" value={postValues.itemID} placeholder="Item ID" disabled />
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formItemName">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control type="text" name="itemName" value={postValues.itemName} placeholder="Item Name" disabled />
                </Form.Group>
            </Row>
            <Button type="button" onClick={getDetails}>View</Button> &emsp;
                
            <div style={{ overflow: "auto", "whiteSpace": 'nowrap' }}>
                <ShowDetails details={details} />
            </div>
        </Form>
    );
};

const ShowDetails = ({ details }) => {
    if (!details)
        return ("");
    if (details.length === 0)
        return ("");
    
    return (
        <>
            <Table style={{ "whiteSpace": 'nowrap' }} hover variant="dark" responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Cust.ID</th>
                        <th>Customer Name</th>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Tax</th>
                        <th className="text-end">Quantity</th>
                        <th className="text-end">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        details.map(item => {
                            return (
                                <tr key={item.salesOrderID}>
                                    <td>{item.salesOrderID}</td>
                                    <td>{item.status}</td>
                                    <td>{formatDateFromDB(item.orderDate)}</td>
                                    <td>{item.customerID}</td>
                                    <td>{item.custDetails[0].customerName}</td>
                                    <td>{item.items.itemID}</td>
                                    <td>{item.items.itemName}</td>
                                    <td className="text-end">{formatNum(item.items.price)}</td>
                                    <td className="text-end">{formatNum(item.items.tax)}</td>
                                    <td className="text-end">{item.items.quantity}</td>
                                    <td className="text-end">{formatNum(item.items.total)}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        </>
    )
}

export default SalesOrderDatewise;