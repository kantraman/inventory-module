import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal} from 'react-bootstrap';
import Logout from '../Admin/logout';
import { validateCustomerEntry } from './validateSalesEntry';
import PickList from '../PickList/PickList';
import { intializeCustomer } from '../PickList/intializeProperties';
import { getSpecificCustomer } from './loadDataSales';
import PreLoader from '../PreLoader';
import ItemSelector from '../Items/ItemSelector';
import {formatDate} from '../../utility'

const SalesOrder = () => {
    const initValues = {
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
    
    //To show preloader
    const [loading, setLoading] = useState(true);
    
    const loadPicklistProps = async (token) => {
        let customersList = await intializeCustomer(token);
        setPlCustomerProps(customersList);
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
        let validationErrors = validateCustomerEntry(postValues);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0)
            insertCustomer();
    }

    //Load customer details
    const loadCustDetails = async (customer) => {
        const custDetails = await getSpecificCustomer(customer[0], token);
        setPostValues({ ...postValues, ...custDetails });
    }

    //Posting form data to API
    const insertCustomer = async () => {
        const customerID = postValues.customerID;
        const title = postValues.title;
        const customerName = postValues.customerName;
        const customerType = postValues.customerType;
        const addressLine1 = postValues.addressLine1;
        const addressLine2 = postValues.addressLine2;
        const addressLine3 = postValues.addressLine3;
        const city = postValues.city;
        const state = postValues.state;
        const pincode = postValues.pincode;
        const country = postValues.country;
        const emailID = postValues.emailID;
        const contactNo1 = postValues.contactNo1;
        const contactNo2 = postValues.contactNo2;
        const website = postValues.website;

        let apiURL = "/api/sales/customer";
        var response = "";
        let formValues = {
            title, customerName, customerType, addressLine1, addressLine2, addressLine3,
            city, state, pincode, country, emailID, contactNo1, contactNo2, website
        };
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }
        if (customerID !== "") {
            apiURL = `/api/sales/customer/${customerID}/update`;
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
            </div>
            <Row>
            <Form.Group className="col-md-6 mb-3" controlId="formOrderDate">
                    <Form.Label>Order Date</Form.Label>
                    <Form.Control type="date" name="orderDate" value={postValues.orderDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.orderDate}</Form.Text>
                </Form.Group>
            <Form.Group className="col-md-6 mb-3" controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={postValues.status} onChange={handleChange} >
                        <option value="">--Select--</option>
                        <option value="Draft">Draft</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Closed">Closed</option>
                    </Form.Select>
                    <Form.Text className="text-danger">{errorValues.status}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formName">
                    <Form.Label>Select Customer</Form.Label>
                    <PickList title={plCustomerProps.title} rowHeaders={plCustomerProps.rowHeaders} search={plCustomerProps.search}
                        data={plCustomerProps.data} onSelect={loadCustDetails} />
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="customerName" value={postValues.customerName} onChange={handleChange} placeholder="Customer Name" />
                    <Form.Text className="text-danger">{errorValues.customerName}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formAddressLine1">
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control type="text" name="addressLine1" value={postValues.addressLine1} onChange={handleChange} placeholder="Address Line 1" />
                    <Form.Text className="text-danger">{errorValues.addressLine1}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formAddressLine2">
                    <Form.Label>Address Line 2</Form.Label>
                    <Form.Control type="text" name="addressLine2" value={postValues.addressLine2} onChange={handleChange} placeholder="Address Line 2" />
                    <Form.Text className="text-danger">{errorValues.addressLine2}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formAddressLine3">
                    <Form.Label>Address Line 3</Form.Label>
                    <Form.Control type="text" name="addressLine3" value={postValues.addressLine3} onChange={handleChange} placeholder="Address Line 3" />
                    <Form.Text className="text-danger">{errorValues.addressLine3}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" name="city" value={postValues.city} onChange={handleChange} placeholder="City" />
                    <Form.Text className="text-danger">{errorValues.city}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formState">
                    <Form.Label>State</Form.Label>
                    <Form.Control type="text" name="state" value={postValues.state} onChange={handleChange} placeholder="State" />
                    <Form.Text className="text-danger">{errorValues.state}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formCountry">
                    <Form.Label>Country</Form.Label>
                    <Form.Control type="text" name="country" value={postValues.country} onChange={handleChange} placeholder="Country" />
                    <Form.Text className="text-danger">{errorValues.country}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formPincode">
                    <Form.Label>Pin Code</Form.Label>
                    <Form.Control type="number" name="pincode" value={postValues.pincode} onChange={handleChange} placeholder="Pin Code" />
                    <Form.Text className="text-danger">{errorValues.pincode}</Form.Text>
                </Form.Group>
                
            </Row>
            <ItemSelector token={token} postValues={postValues} setPostValues={setPostValues} mode="S" />
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