import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal} from 'react-bootstrap';
import Logout from '../Admin/logout';
import { validateSalesOrder } from './validateSalesEntry';
import PickList from '../PickList/PickList';
import { intializeCustomer, intializeSalesOrder } from '../PickList/intializeProperties';
import { getSalesOrderDetails, getSpecificCustomer } from './loadDataSales';
import PreLoader from '../PreLoader';
import ItemSelector from '../Items/ItemSelector';
import {formatDate} from '../../utility'

const SalesOrder = () => {
    const initValues = {
        salesOrderID: "",
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
        status: "",
        orderDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
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
    
    //To show preloader
    const [loading, setLoading] = useState(true);
    
    const loadPicklistProps = async (token) => {
        let customersList = await intializeCustomer(token);
        setPlCustomerProps(customersList);
        let salesOrderList = await intializeSalesOrder(token);
        setPlSalesOrder(salesOrderList);
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
        let validationErrors = validateSalesOrder(postValues);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0)
            insertSalesOrder();
    }

    //Load customer details
    const loadCustDetails = async (customer) => {
        const custDetails = await getSpecificCustomer(customer[0], token);
        const postData = { ...postValues, ...custDetails };
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
            status: soDetails.status,
            orderDate: soDetails.orderDate.substring(0, 10),
            items: soDetails.items
        };
        setPostValues(postData);
    }

    //Posting form data to API
    const insertSalesOrder = async () => {
        const salesOrderID = postValues.salesOrderID;
        const customerID = postValues.customerID;
        const orderDate = postValues.orderDate;
        const status = postValues.status;
        const items = postValues.items;

        let apiURL = "/api/sales/sales-order";
        var response = "";
        let formValues = {
            customerID, orderDate, status, items
        };
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }
        if (salesOrderID !== "") {
            apiURL = `/api/sales/sales-order/${salesOrderID}/update`;
            response = await axios.put(apiURL, formValues, options);
        } else {
            response = await axios.post(apiURL, formValues, options);
        }
        if (response.status === 401)
            Logout();
        if (response.data.status === "Success") {
            setModalText({
                header: "Customer",
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
            <PreLoader loading = { loading }/>
            <div className="text-center fs-1 mb-1 formHead">SALES ORDER</div>
            <div className="d-flex flex-row align-items-baseline">
                <Button variant="primary" onClick={() => setPostValues(initValues)}>New Sales Order</Button>
                &emsp;
                <Form.Label>Select SalesOrder</Form.Label>
                <PickList title={plSalesOrder.title} rowHeaders={plSalesOrder.rowHeaders} search={plSalesOrder.search}
                        data={plSalesOrder.data} onSelect={loadSODetails} />
            </div>
            <Row>
            <Form.Group className="col-md-6 mb-1" controlId="formOrderDate">
                    <Form.Label>Order Date</Form.Label>
                    <Form.Control type="date" name="orderDate" value={postValues.orderDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.orderDate}</Form.Text>
                </Form.Group>
            <Form.Group className="col-md-6 mb-1" controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={postValues.status} onChange={handleChange} >
                        <option value="">--Select--</option>
                        <option value="Draft">Draft</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Closed">Closed</option>
                        <option value="Void">Void</option>
                    </Form.Select>
                    <Form.Text className="text-danger">{errorValues.status}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formName">
                    <Form.Label>Select Customer</Form.Label>
                    <PickList title={plCustomerProps.title} rowHeaders={plCustomerProps.rowHeaders} search={plCustomerProps.search}
                        data={plCustomerProps.data} onSelect={loadCustDetails} />
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="customerName" value={postValues.customerName} onChange={handleChange} placeholder="Customer Name" disabled/>
                    <Form.Text className="text-danger">{errorValues.customerName}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formAddressLine1">
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control type="text" name="addressLine1" value={postValues.addressLine1} onChange={handleChange} placeholder="Address Line 1" disabled/>
                    <Form.Text className="text-danger">{errorValues.addressLine1}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formAddressLine2">
                    <Form.Label>Address Line 2</Form.Label>
                    <Form.Control type="text" name="addressLine2" value={postValues.addressLine2} onChange={handleChange} placeholder="Address Line 2" disabled/>
                    <Form.Text className="text-danger">{errorValues.addressLine2}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formAddressLine3">
                    <Form.Label>Address Line 3</Form.Label>
                    <Form.Control type="text" name="addressLine3" value={postValues.addressLine3} onChange={handleChange} placeholder="Address Line 3" disabled/>
                    <Form.Text className="text-danger">{errorValues.addressLine3}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" name="city" value={postValues.city} onChange={handleChange} placeholder="City" disabled/>
                    <Form.Text className="text-danger">{errorValues.city}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formState">
                    <Form.Label>State</Form.Label>
                    <Form.Control type="text" name="state" value={postValues.state} onChange={handleChange} placeholder="State" disabled/>
                    <Form.Text className="text-danger">{errorValues.state}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formCountry">
                    <Form.Label>Country</Form.Label>
                    <Form.Control type="text" name="country" value={postValues.country} onChange={handleChange} placeholder="Country" disabled/>
                    <Form.Text className="text-danger">{errorValues.country}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formPincode">
                    <Form.Label>Pin Code</Form.Label>
                    <Form.Control type="number" name="pincode" value={postValues.pincode} onChange={handleChange} placeholder="Pin Code" disabled/>
                    <Form.Text className="text-danger">{errorValues.pincode}</Form.Text>
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

export default SalesOrder;