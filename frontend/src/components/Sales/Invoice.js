import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal} from 'react-bootstrap';
import Logout from '../Admin/logout';
import { validateInvoice } from './validateSalesEntry';
import PickList from '../PickList/PickList';
import { intializeCustomer, intializeSalesOrder, intializeInvoice } from '../PickList/intializeProperties';
import { getSpecificCustomer, getSalesOrderDetails, getInvoiceDetails, showInvoiceForm } from './loadDataSales';
import PreLoader from '../PreLoader';
import ItemSelector from '../Items/ItemSelector';
import { formatDate } from '../../utility';

const Invoice = () => {
    const initValues = {
        invoiceID: "",
        salesOrderID: "0",
        customerID: "",
        title: "",
        customerName: "",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        status: "Draft",
        invoiceDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        dueDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")), 
        otherCharges: "0.00",
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
    const [plCustomerProps, setPlCustomerProps] = useState({});
    const [plSalesOrder, setPlSalesOrder] = useState({});
    const [plInvoice, setPlInvoice] = useState({});
    
    //To show preloader
    const [loading, setLoading] = useState(true);
    
    const loadPicklistProps = async (token) => {
        let customersList = await intializeCustomer(token);
        setPlCustomerProps(customersList);
        let salesOrderList = await intializeSalesOrder(token, "Confirmed");
        setPlSalesOrder(salesOrderList);
        let invoiceList = await intializeInvoice(token);
        setPlInvoice(invoiceList);
        setLoading(false);
    }
    useEffect(() => loadPicklistProps(token), []);

    //Input values to postValues
    function handleChange(event) {
        const { name, value } = event.target;
        setPostValues({ ...postValues, [name]: value });
    }

    //Manage form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        let validationErrors = validateInvoice(postValues);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0)
            insertInvoice();
    }

    //Load Invoice details
    const loadInvoiceDetails = async (selInvoice) => {
        const invoice = await getInvoiceDetails(selInvoice[0], token);
        console.log(invoice);
        const postData = {
            invoiceID: invoice.invoiceID,
            salesOrderID: invoice.salesOrderID,
            customerID: invoice.customerID,
            title: invoice.custDetails[0].title,
            customerName: invoice.custDetails[0].customerName,
            addressLine1: invoice.custDetails[0].addressLine1,
            addressLine2: invoice.custDetails[0].addressLine2,
            addressLine3: invoice.custDetails[0].addressLine3,
            city: invoice.custDetails[0].city,
            state: invoice.custDetails[0].state,
            pincode: invoice.custDetails[0].pincode,
            country: invoice.custDetails[0].country,
            status: invoice.status,
            invoiceDate: invoice.invoiceDate.substring(0, 10),
            dueDate: invoice.dueDate.substring(0, 10),
            otherCharges: invoice.otherCharges,
            items: invoice.items
        };
        setPostValues(postData);
        window.alert("Only Invoice Status can be updated.");
    }

    //Load customer details
    const loadCustDetails = async (customer) => {
        const custDetails = await getSpecificCustomer(customer[0], token);
        const postData = { ...postValues, ...custDetails };
        postData.salesOrderID = "0";
        postData.items = [];
        postData.customerName = postData.title + " " + postData.customerName;
        setPostValues(postData);
    }

    //Load sales order details
    const loadSODetails = async (salesOrder) => {
        const soDetails = await getSalesOrderDetails(salesOrder[0], token);
        const postData = {
            salesOrderID: soDetails.salesOrderID,
            customerID: soDetails.customerID,
            title: soDetails.custDetails[0].title,
            customerName: soDetails.custDetails[0].customerName,
            addressLine1: soDetails.custDetails[0].addressLine1,
            addressLine2: soDetails.custDetails[0].addressLine2,
            addressLine3: soDetails.custDetails[0].addressLine3,
            city: soDetails.custDetails[0].city,
            state: soDetails.custDetails[0].state,
            pincode: soDetails.custDetails[0].pincode,
            country: soDetails.custDetails[0].country,
            items: soDetails.items
        };
        setPostValues({ ...postValues, ...postData });
    }

    //Posting form data to API
    const insertInvoice = async () => {
        const invoiceID = postValues.invoiceID;
        const salesOrderID = postValues.salesOrderID;
        const customerID = postValues.customerID;
        const otherCharges = postValues.otherCharges;
        const invoiceDate = postValues.invoiceDate;
        const status = postValues.status;
        const items = postValues.items;
        const dueDate = postValues.dueDate;

        let apiURL = "/api/sales/invoice";
        var response = "";
        let formValues = {
            salesOrderID, customerID, invoiceDate, dueDate, otherCharges, status, items
        };
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }
        if (invoiceID !== "") {
            apiURL = `/api/sales/invoice/${invoiceID}/update`;
            response = await axios.put(apiURL, formValues, options);
        } else {
            response = await axios.post(apiURL, formValues, options);
        }
        if (response.status === 401)
            Logout();
        if (response.data.status === "Success") {
            setModalText({
                header: "Invoice",
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
            <div className="text-center fs-1 mb-1 formHead">INVOICE</div>
            <div className="d-flex flex-row align-items-baseline">
                <Button variant="primary" onClick={() => setPostValues(initValues)}>New Invoice</Button>
                &emsp;
                <Form.Label>Select Invoice</Form.Label>
                <PickList title={plInvoice.title} rowHeaders={plInvoice.rowHeaders} search={plInvoice.search}
                    data={plInvoice.data} onSelect={loadInvoiceDetails} />
                 &emsp;
                {(postValues.invoiceID)
                    ? <Button variant="primary" onClick={() => showInvoiceForm(token, postValues.invoiceID) }>View Invoice</Button>
                    :""
                }
            </div>
            <Row>
                <Form.Group className="col-md-6 mb-1" controlId="formInvoiceDate">
                    <Form.Label>Invoice Date</Form.Label>
                    <Form.Control type="date" name="invoiceDate" value={postValues.invoiceDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.invoiceDate}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formDueDate">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control type="date" name="dueDate" value={postValues.dueDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.dueDate}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={postValues.status} onChange={handleChange} >
                        <option value="">--Select--</option>
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Paid">Paid</option>
                        <option value="Due">Due</option>
                        <option value="Void">Void</option>
                    </Form.Select>
                    <Form.Text className="text-danger">{errorValues.status}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formSO">
                    <Form.Label>Select Sales Order</Form.Label>
                    <PickList title={plSalesOrder.title} rowHeaders={plSalesOrder.rowHeaders} search={plSalesOrder.search}
                        data={plSalesOrder.data} onSelect={loadSODetails} />
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formCustomer">
                    <Form.Label>Select Customer</Form.Label>
                    <PickList title={plCustomerProps.title} rowHeaders={plCustomerProps.rowHeaders} search={plCustomerProps.search}
                        data={plCustomerProps.data} onSelect={loadCustDetails} />
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
                <Form.Group className="col-md-6 mb-1" controlId="formAddressLine2">
                    <Form.Label>Address Line 2</Form.Label>
                    <Form.Control type="text" name="addressLine2" value={postValues.addressLine2} onChange={handleChange} placeholder="Address Line 2" disabled />
                    <Form.Text className="text-danger">{errorValues.addressLine2}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formAddressLine3">
                    <Form.Label>Address Line 3</Form.Label>
                    <Form.Control type="text" name="addressLine3" value={postValues.addressLine3} onChange={handleChange} placeholder="Address Line 3" disabled />
                    <Form.Text className="text-danger">{errorValues.addressLine3}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" name="city" value={postValues.city} onChange={handleChange} placeholder="City" disabled />
                    <Form.Text className="text-danger">{errorValues.city}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formState">
                    <Form.Label>State</Form.Label>
                    <Form.Control type="text" name="state" value={postValues.state} onChange={handleChange} placeholder="State" disabled />
                    <Form.Text className="text-danger">{errorValues.state}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formCountry">
                    <Form.Label>Country</Form.Label>
                    <Form.Control type="text" name="country" value={postValues.country} onChange={handleChange} placeholder="Country" disabled />
                    <Form.Text className="text-danger">{errorValues.country}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formPincode">
                    <Form.Label>Pin Code</Form.Label>
                    <Form.Control type="number" name="pincode" value={postValues.pincode} onChange={handleChange} placeholder="Pin Code" disabled />
                    <Form.Text className="text-danger">{errorValues.pincode}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formOther">
                    <Form.Label>Other Charges</Form.Label>
                    <Form.Control type="number" name="otherCharges" value={postValues.otherCharges} onChange={handleChange} placeholder="otherCharges" />
                    <Form.Text className="text-danger">{errorValues.otherCharges}</Form.Text>
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

export default Invoice;