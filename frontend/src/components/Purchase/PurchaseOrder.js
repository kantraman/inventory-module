import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal} from 'react-bootstrap';
import Logout from '../Admin/logout';
import PickList from '../PickList/PickList';
import { intializePurchaseOrder, intializeVendor } from '../PickList/intializeProperties';
import { getPurchaseOrderDetails, getVendors, showPurchaseOrderForm } from './loadDataPurchase';
import PreLoader from '../PreLoader';
import ItemSelector from '../Items/ItemSelector';
import {formatDate} from '../../utility'
import { validatePurchaseOrder } from './validatePurchaseEntry';

const PurchaseOrder = () => {
    const initValues = {
        purchaseOrderID: "",
        vendorID: "",
        companyName: "",
        addressLine1: "",
        refNo: "",
        status: "Draft",
        orderDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        expectedDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
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
    const [plVendor, setPlVendor] = useState({});
    const [plPurchaseOrder, setPlPurchaseOrder] = useState({});
    
    //To show preloader
    const [loading, setLoading] = useState(true);
    
    const loadPicklistProps = async (token) => {
        let vendorList = await intializeVendor(token);
        setPlVendor(vendorList);
        let purchaseOrderList = await intializePurchaseOrder(token);
        setPlPurchaseOrder(purchaseOrderList);
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
        let validationErrors = validatePurchaseOrder(postValues);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0 )
            insertPurchaseOrder();
    }

    //Load vendor details
    const loadVendorDetails = async (vendor) => {
        const vendorDetails = await getVendors(token, vendor[0]);
        const postData = { ...postValues, ...vendorDetails };
        setPostValues(postData);
    }

    //Load purchase order details
    const loadPODetails = async (purchaseOrder) => {
        const poDetails = await getPurchaseOrderDetails(purchaseOrder[0], token);
        const postData = {
            purchaseOrderID: poDetails.purchaseOrderID,
            vendorID: poDetails.vendorID,
            companyName: poDetails.vendorDetails[0].companyName,
            addressLine1: poDetails.vendorDetails[0].addressLine1,
            status: poDetails.status,
            refNo: poDetails.refNo,
            orderDate: poDetails.orderDate.substring(0, 10),
            expectedDate: poDetails.expectedDate.substring(0, 10),
            items: poDetails.items
        };
        if (postData.status !== "Draft") {
            window.alert("Already " + postData.status + " purchase order, only status can be updated.");
        }
        setPostValues(postData);
    }

    //Posting form data to API
    const insertPurchaseOrder = async () => {
        const purchaseOrderID = postValues.purchaseOrderID;
        const vendorID = postValues.vendorID;
        const orderDate = postValues.orderDate;
        const status = postValues.status;
        const items = postValues.items;
        const expectedDate = postValues.expectedDate;
        const refNo = postValues.refNo;

        let apiURL = "/api/purchase/purchase-order";
        var response = "";
        let formValues = {
            vendorID, orderDate, expectedDate, refNo, status, items
        };
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }
        if (purchaseOrderID !== "") {
            apiURL = `/api/purchase/purchase-order/${purchaseOrderID}/update`;
            response = await axios.put(apiURL, formValues, options);
        } else {
            response = await axios.post(apiURL, formValues, options);
        }
        if (response.status === 401)
            Logout();
        if (response.data.status === "Success") {
            setModalText({
                header: "Purchase Order",
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
            <div className="text-center fs-1 mb-1 formHead">PURCHASE ORDER</div>
            <div className="d-flex flex-row align-items-baseline">
                <Button variant="primary" onClick={() => setPostValues(initValues)}>New Purchase Order</Button>
                &emsp;
                <Form.Label>Select Purchase Order</Form.Label>
                <PickList title={plPurchaseOrder.title} rowHeaders={plPurchaseOrder.rowHeaders} search={plPurchaseOrder.search}
                    data={plPurchaseOrder.data} onSelect={loadPODetails} />
                &emsp;
                {(postValues.purchaseOrderID)
                    ? <Button variant="primary" onClick={() => showPurchaseOrderForm(token, postValues.purchaseOrderID) }>View Purchase Order</Button>
                    :""
                }
            </div>
            <Row>
            <Form.Group className="col-md-6 mb-1" controlId="formOrderDate">
                    <Form.Label>Order Date</Form.Label>
                    <Form.Control type="date" name="orderDate" value={postValues.orderDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.orderDate}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formExpectedDate">
                    <Form.Label>Expected Delivery Date</Form.Label>
                    <Form.Control type="date" name="expectedDate" value={postValues.expectedDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.expectedDate}</Form.Text>
                </Form.Group>
            <Form.Group className="col-md-6 mb-1" controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={postValues.status} onChange={handleChange} >
                        <option value="">--Select--</option>
                        <option value="Draft">Draft</option>
                        <option value="Issued">Issued</option>
                        <option value="Received">Received</option>
                        <option value="Cancelled">Cancelled</option>
                    </Form.Select>
                    <Form.Text className="text-danger">{errorValues.status}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formVendor">
                    <Form.Label>Select Vendor</Form.Label>
                    <PickList title={plVendor.title} rowHeaders={plVendor.rowHeaders} search={plVendor.search}
                        data={plVendor.data} onSelect={loadVendorDetails} />
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="companyName" value={postValues.companyName} onChange={handleChange} placeholder="Company Name" disabled/>
                    <Form.Text className="text-danger">{errorValues.companyName}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formAddressLine1">
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control type="text" name="addressLine1" value={postValues.addressLine1} onChange={handleChange} placeholder="Address Line 1" disabled/>
                    <Form.Text className="text-danger">{errorValues.addressLine1}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formRefNo">
                    <Form.Label>Reference No.</Form.Label>
                    <Form.Control type="text" name="refNo" value={postValues.refNo} onChange={handleChange} placeholder="Reference No." />
                    <Form.Text className="text-danger">{errorValues.refNo}</Form.Text>
                </Form.Group>
                
            </Row>
            <Form.Group className="mb-1" controlId="formItems">
                <ItemSelector token={token} postValues={postValues} setPostValues={setPostValues} mode="P" />
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

export default PurchaseOrder;