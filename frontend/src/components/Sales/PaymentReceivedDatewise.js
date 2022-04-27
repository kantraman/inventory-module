import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Table, Row, Button} from 'react-bootstrap';
import Logout from '../Admin/logout';
import PickList from '../PickList/PickList';
import { getSpecificCustomer } from './loadDataSales';
import { intializeCustomer } from '../PickList/intializeProperties';
import { formatDate, formatNum } from '../../utility';

const PaymentReceivedDatewise = () => {
    const initValues = {
        fromDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        toDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        customerID: "",
        customerName: ""
    }
    const { token } = useToken();
    //Set initial dates
    const [postValues, setPostValues] = useState(initValues);
    const [errorValues, setErrorValues] = useState({});
    const [details, setDetails] = useState([]);
    //Picklist 
    const [plProps, setPlProps] = useState({});
    const loadPicklistProps = async (token) => {
        let customersList = await intializeCustomer(token);
        setPlProps(customersList);
    }
    useEffect(() => loadPicklistProps(token), []);

    //Input values to itemDetails
    function handleChange(event) {
        const { name, value } = event.target;
        setPostValues({ ...postValues, [name]: value });
    }

    //Load customer details
    const loadCustomerDetails = async (customer) => {
        const itemDetails = await getSpecificCustomer(customer[0], token);
        postValues.customerID = itemDetails.customerID;
        postValues.customerName = itemDetails.customerName;
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
        let customerID = postValues.customerID;
        let validationErrors = validateDates();
        setErrorValues(validationErrors);
        setDetails([]);
        if (Object.keys(validationErrors).length !== 0)
            return 0;
        try {
            let apiURL = "/api/sales/payments-rec";
            apiURL += "?fromDate=" + fromDate + "&toDate=" + toDate;
            if (customerID !== "")
                apiURL += "&id=" + customerID;
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
                <Form.Group className="col-md-6 mb-3" controlId="formItem">
                    <Form.Label>Select Customer</Form.Label>
                    <PickList title={plProps.title} rowHeaders={plProps.rowHeaders} search={plProps.search}
                        data={plProps.data} onSelect={loadCustomerDetails} />
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formCustomerID">
                    <Form.Label>Customer ID</Form.Label>
                    <Form.Control type="text" name="customerID" value={postValues.customerID} placeholder="Customer ID" disabled />
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formCustomerName">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control type="text" name="customerName" value={postValues.customerName} placeholder="Customer Name" disabled />
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
                        <th>Date</th>
                        <th>Cust.ID</th>
                        <th>Customer Name</th>
                        <th>Invoice ID</th>
                        <th>Mode of payment</th>
                        <th className="text-end">Amount</th>
                        <th className="text-end">Bank Charges</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        details.map(item => {
                            return (
                                <tr key={item.paymentRecID}>
                                    <td>{item.paymentRecID}</td>
                                    <td>{item.paymentRecDate.toString().substring(0, 10)}</td>
                                    <td>{item.customerID}</td>
                                    <td>{item.custDetails[0].customerName}</td>
                                    <td>{item.invoiceID}</td>
                                    <td>{item.modeOfPayment}</td>
                                    <td className="text-end">{formatNum(item.amount)}</td>
                                    <td className="text-end">{formatNum(item.bankCharges)}</td>
                                    <td>{item.notes}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        </>
    )
}

export default PaymentReceivedDatewise;