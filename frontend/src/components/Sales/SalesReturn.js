import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal} from 'react-bootstrap';
import Logout from '../Admin/logout';
import { validateSalesReturns } from './validateSalesEntry';
import PickList from '../PickList/PickList';
import { intializeInvoice, intializeSalesReturns } from '../PickList/intializeProperties';
import { getInvoiceDetails, getSalesReturnsDetails } from './loadDataSales';
import PreLoader from '../PreLoader';
import ItemSelector from '../Items/ItemSelector';
import { formatDate } from '../../utility';
 
const SalesReturn = () => {
    const initValues = {
        salesReturnID: "",
        invoiceID: "",
        customerID: "",
        customerName: "",
        addressLine1: "",
        status: "Draft",
        receivedDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        reason: "",
        items: []
    };
    const { token } = useToken();
    //Manage Form Field Values
    const [postValues, setPostValues] = useState(initValues);
    
    //Manage Error Values
    const [errorValues, setErrorValues] = useState({});

    //Modal properties
    const [show, setShow] = useState(false);
    const [modalText, setModalText] = useState({ header: "", body: "" });
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Picklist properties
    const [plSalesReturns, setPlSalesReturns] = useState({});
    const [plInvoice, setPlInvoice] = useState({});
    
    //To show preloader
    const [loading, setLoading] = useState(true);
    
    const loadPicklistProps = async (token) => {
        let invoiceList = await intializeInvoice(token);
        setPlInvoice(invoiceList);
        let salesReturnsList = await intializeSalesReturns(token);
        setPlSalesReturns(salesReturnsList);
        setLoading(false);
    }
    useEffect(() => loadPicklistProps(token), []);

    //Input values to postValues
    function handleChange(event) {
        const { name, value } = event.target;
        setPostValues({ ...postValues, [name]: value });
    }

    //Manage form submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        let returnItems = "";
        if(postValues.invoiceID !== "")
            returnItems = await getInvoiceDetails(postValues.invoiceID, token);
        let validationErrors = validateSalesReturns(postValues, returnItems.items);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0 && postValues.salesReturnID !== "NU")
            insertSalesReturns();
    }

    //Load Invoice details
    const loadInvoiceDetails = async (selInvoice) => {
        const invoice = await getInvoiceDetails(selInvoice[0], token);
        const postData = {
            invoiceID: invoice.invoiceID,
            customerID: invoice.customerID,
            customerName: invoice.custDetails[0].customerName,
            addressLine1: invoice.custDetails[0].addressLine1,
            items: invoice.items
        };
        setPostValues({ ...postValues, ...postData });
    }

    //Load Sales Returns details
    const loadSalesReturns = async (selSalsReturns) => {
        const salesReturns = await getSalesReturnsDetails(selSalsReturns[0], token);
        const postData = {
            salesReturnID: salesReturns.salesReturnID,
            receivedDate: salesReturns.receivedDate.substring(0, 10),
            invoiceID: salesReturns.invoiceID,
            customerID: salesReturns.customerID,
            customerName: salesReturns.custDetails[0].customerName,
            addressLine1: salesReturns.custDetails[0].addressLine1,
            status: salesReturns.status,
            items: salesReturns.items,
            reason: salesReturns.reason
        };
        if (postData.status !== "Draft") {
            window.alert("Already " + postData.status.toLowerCase() + " sales return cannot be edited.");
            postData.salesReturnID = "NU";
        } else {
            window.alert("Only status can be updated.");
        }
        setPostValues(postData);
    }

    //Posting form data to API
    const insertSalesReturns = async () => {
        
        const salesReturnID = postValues.salesReturnID;
        const customerID = postValues.customerID;
        const invoiceID = postValues.invoiceID;
        const reason = postValues.reason;
        const receivedDate = postValues.receivedDate;
        const status = postValues.status;
        const items = postValues.items;
       
        let apiURL = "/api/sales/sales-return";
        var response = "";
        let formValues = {
            invoiceID, customerID, receivedDate, reason, status, items
        };
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }
        if (salesReturnID !== "") {
            apiURL = `/api/sales/sales-return/${salesReturnID}/update`;
            response = await axios.put(apiURL, formValues, options);
        } else {
            response = await axios.post(apiURL, formValues, options);
        }
        if (response.status === 401)
            Logout();
        if (response.data.status === "Success") {
            setModalText({
                header: "Sales Return",
                body: "Operation completed successfully"
            });
            setPostValues(initValues);
        } else {
            setModalText({
                header: "Error",
                body: "An unexpected error occured. Please try again!"
            });
        }
        handleShow();
        loadPicklistProps(token);
    }

    return (
        <Form className="mx-auto col-lg-6 col-md-8 col-sm-10 p-3 formBg" onSubmit={handleSubmit}>
            <PreLoader loading={loading} />
            <div className="text-center fs-1 mb-1 formHead">SALES RETURNS</div>
            <div className="d-flex flex-row align-items-baseline">
                <Button variant="primary" onClick={() => setPostValues(initValues)}>New Sales Returns</Button>
                &emsp;
                <Form.Label>Select Sales Returns</Form.Label>
                    <PickList title={plSalesReturns.title} rowHeaders={plSalesReturns.rowHeaders} search={plSalesReturns.search}
                        data={plSalesReturns.data} onSelect={loadSalesReturns} />
                
            </div>
            <Row>
                <Form.Group className="col-md-6 mb-1" controlId="formReceivedDate">
                    <Form.Label>Received Date</Form.Label>
                    <Form.Control type="date" name="receivedDate" value={postValues.receivedDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.receivedDate}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={postValues.status} onChange={handleChange} >
                        <option value="">--Select--</option>
                        <option value="Draft">Draft</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Declined">Declined</option>
                    </Form.Select>
                    <Form.Text className="text-danger">{errorValues.status}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formInvoice">
                    <Form.Label>Select Invoice</Form.Label>
                    <PickList title={plInvoice.title} rowHeaders={plInvoice.rowHeaders} search={plInvoice.search}
                        data={plInvoice.data} onSelect={loadInvoiceDetails} />
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="customerName" value={postValues.customerName} onChange={handleChange} placeholder="Customer Name" disabled />
                    <Form.Text className="text-danger">{errorValues.customerName}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formAddressLine1">
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control type="text" name="addressLine1" value={postValues.addressLine1} onChange={handleChange} placeholder="Address Line 1" disabled />
                    <Form.Text className="text-danger">{errorValues.addressLine1}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formReason">
                    <Form.Label>Reason</Form.Label>
                    <Form.Control type="text" name="reason" value={postValues.reason} onChange={handleChange} placeholder="Reason"/>
                    <Form.Text className="text-danger">{errorValues.reason}</Form.Text>
                </Form.Group>
            </Row>
            <Form.Group className="mb-1" controlId="formItems">
                <ItemSelector token={token} postValues={postValues} setPostValues={setPostValues} mode="S" />
                <Form.Text className="text-danger">{errorValues.items}</Form.Text>
            </Form.Group>
            <div className="d-grid mb-4">
                <Button variant="primary" type="submit" >Submit</Button>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalText.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalText.body}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form>
    );
};

export default SalesReturn;