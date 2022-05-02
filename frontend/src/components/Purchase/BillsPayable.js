import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal} from 'react-bootstrap';
import Logout from '../Admin/logout';
import { validateBills } from './validatePurchaseEntry';
import PickList from '../PickList/PickList';
import { intializeVendor, intializePurchaseOrder, intializeBills } from '../PickList/intializeProperties';
import { getBillDetails, getVendors, getPurchaseOrderDetails} from './loadDataPurchase';
import PreLoader from '../PreLoader';
import ItemSelector from '../Items/ItemSelector';
import { formatDate, formatNum } from '../../utility';

const Bill = () => {
    const initValues = {
        billID: "",
        purchaseOrderID: "0",
        vendorID: "",
        companyName: "",
        refNo: "",
        status: "Draft",
        billDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        dueDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")), 
        otherCharges: "0.00",
        discount: "0.00",
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
    const [plBill, setPlBill] = useState({});
    
    //To show preloader
    const [loading, setLoading] = useState(true);
    
    const loadPicklistProps = async (token) => {
        let vendorList = await intializeVendor(token);
        setPlVendor(vendorList);
        let purchaseOrderList = await intializePurchaseOrder(token, ["Issued", "Received"]);
        setPlPurchaseOrder(purchaseOrderList);
        let invoiceList = await intializeBills(token);
        setPlBill(invoiceList);
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
        let validationErrors = validateBills(postValues);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0)
            insertBill();
    }

    //Load Bill details
    const loadBillDetails = async (selBill) => {
        const bill = await getBillDetails(selBill[0], token);
      
        const postData = {
            billID: bill.billID,
            refNo: bill.refNo,
            purchaseOrderID: bill.purchaseOrderID,
            vendorID: bill.vendorID,
            companyName: bill.vendorDetails[0].companyName,
            status: bill.status,
            billDate: bill.billDate.substring(0, 10),
            dueDate: bill.dueDate.substring(0, 10),
            otherCharges: formatNum(bill.otherCharges),
            discount: formatNum(bill.discount),
            items: bill.items
        };
        setPostValues(postData);
        window.alert("Only bill status can be updated.");
    }

    //Load vendor details
    const loadVendorDetails = async (vendor) => {
        const vendorDetails = await getVendors(token, vendor[0]);
        const postData = { ...postValues, ...vendorDetails };
        postData.purchaseOrderID = "0";
        postData.items = [];
        setPostValues(postData);
    }

    //Load purchase order details
    const loadPODetails = async (purchaseOrder) => {
        const poDetails = await getPurchaseOrderDetails(purchaseOrder[0], token);
        const postData = {
            purchaseOrderID: poDetails.purchaseOrderID,
            vendorID: poDetails.vendorID,
            companyName: poDetails.vendorDetails[0].companyName,
            items: poDetails.items
        };
        setPostValues({ ...postValues, ...postData });
    }

    //Posting form data to API
    const insertBill = async () => {
        const billID = postValues.billID;
        const purchaseOrderID = postValues.purchaseOrderID;
        const vendorID = postValues.vendorID;
        const otherCharges = postValues.otherCharges;
        const discount = postValues.discount;
        const billDate = postValues.billDate;
        const refNo = postValues.refNo;
        const status = postValues.status;
        const items = postValues.items;
        const dueDate = postValues.dueDate;

        let apiURL = "/api/purchase/bill";
        var response = "";
        let formValues = {
            purchaseOrderID, vendorID, billDate, dueDate, otherCharges,
            discount, refNo, status, items
        };
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }
        if (billID !== "") {
            apiURL = `/api/purchase/bill/${billID}/update`;
            response = await axios.put(apiURL, formValues, options);
        } else {
            response = await axios.post(apiURL, formValues, options);
        }
        if (response.status === 401)
            Logout();
        if (response.data.status === "Success") {
            setModalText({
                header: "Bills",
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
            <div className="text-center fs-1 mb-1 formHead">BILLS</div>
            <div className="d-flex flex-row align-items-baseline">
                <Button variant="primary" onClick={() => setPostValues(initValues)}>New Bill</Button>
                &emsp;
                <Form.Label>Select Bill</Form.Label>
                <PickList title={plBill.title} rowHeaders={plBill.rowHeaders} search={plBill.search}
                    data={plBill.data} onSelect={loadBillDetails} />
            </div>
            <Row>
                <Form.Group className="col-md-6 mb-1" controlId="formDate">
                    <Form.Label>Bill Date</Form.Label>
                    <Form.Control type="date" name="billDate" value={postValues.billDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.billDate}</Form.Text>
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
                        <option value="Open">Open</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Paid">Paid</option>
                        <option value="Due">Due</option>
                        <option value="Void">Void</option>
                    </Form.Select>
                    <Form.Text className="text-danger">{errorValues.status}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formRef">
                    <Form.Label>Reference No.</Form.Label>
                    <Form.Control type="text" name="refNo" value={postValues.refNo} onChange={handleChange} placeholder="Reference No." />
                    <Form.Text className="text-danger">{errorValues.refNo}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formPO">
                    <Form.Label>Select Purchase Order</Form.Label>
                    <PickList title={plPurchaseOrder.title} rowHeaders={plPurchaseOrder.rowHeaders} search={plPurchaseOrder.search}
                        data={plPurchaseOrder.data} onSelect={loadPODetails} />
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formVendor">
                    <Form.Label>Select Vendor</Form.Label>
                    <PickList title={plVendor.title} rowHeaders={plVendor.rowHeaders} search={plVendor.search}
                        data={plVendor.data} onSelect={loadVendorDetails} />
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="companyName" value={postValues.companyName} onChange={handleChange} placeholder="Company Name" disabled />
                    <Form.Text className="text-danger">{errorValues.companyName}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formOther">
                    <Form.Label>Other Charges</Form.Label>
                    <Form.Control type="number" name="otherCharges" value={postValues.otherCharges} onChange={handleChange} placeholder="Other Charges" />
                    <Form.Text className="text-danger">{errorValues.otherCharges}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formDiscount">
                    <Form.Label>Discount</Form.Label>
                    <Form.Control type="number" name="discount" value={postValues.discount} onChange={handleChange} placeholder="Discount" />
                    <Form.Text className="text-danger">{errorValues.discount}</Form.Text>
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

export default Bill;