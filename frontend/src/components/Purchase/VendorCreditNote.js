import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal} from 'react-bootstrap';
import Logout from '../Admin/logout';
import { validateVendorCreditNote } from './validatePurchaseEntry';
import PickList from '../PickList/PickList';
import { intializeVendor, intializeVendorCreditNote } from '../PickList/intializeProperties';
import { getVendorCreditNoteDetails, getVendors } from './loadDataPurchase'
import PreLoader from '../PreLoader';
import { formatDate, formatNum } from '../../utility';
import ItemSelector from '../Items/ItemSelector';
 
const VendorCreditNote = () => {
    const initValues = {
        creditNoteID: "",
        vendorID: "",
        companyName: "",
        status: "Draft",
        refNo: "",
        creditNoteDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        amount: "0.00",
        discount: "0.00",
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
    const [plCreditNote, setPlCreditNote] = useState({});
    const [plVendor, setPlVendor] = useState({});
    
    //To show preloader
    const [loading, setLoading] = useState(true);
    
    const loadPicklistProps = async (token) => {
        let creditNoteList = await intializeVendorCreditNote(token);
        setPlCreditNote(creditNoteList);
        let vendorList = await intializeVendor(token);
        setPlVendor(vendorList);
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
        let validationErrors = validateVendorCreditNote(postValues);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0)
            insertCreditNote();
    }

    //Load credit note details
    const loadCreditNote = async (selCreditNote) => {
        const creditNote = await getVendorCreditNoteDetails(selCreditNote[0], token);
        const postData = {
            creditNoteID: creditNote.creditNoteID,
            vendorID: creditNote.vendorID,
            companyName: creditNote.vendorDetails[0].companyName,
            status: creditNote.status,
            refNo: creditNote.refNo,
            creditNoteDate: creditNote.creditNoteDate.substring(0, 10),
            amount: formatNum(creditNote.amount),
            otherCharges: formatNum(creditNote.otherCharges),
            discount: formatNum(creditNote.discount),
            items: creditNote.items
        }
        if (postData.status !== "Draft")
            window.alert("Only status can be updated.");
        setPostValues(postData);
    }

     //Load vendor details
     const loadVendorDetails = async (vendor) => {
        const vendorDetails = await getVendors(token, vendor[0]);
        const postData = { ...postValues, ...vendorDetails };
        postData.purchaseOrderID = "0";
        postData.items = [];
        setPostValues(postData);
    }
    
    //Posting form data to API
    const insertCreditNote = async () => {
        const creditNoteID = postValues.creditNoteID;
        const vendorID = postValues.vendorID;
        const refNo = postValues.refNo;
        const creditNoteDate = postValues.creditNoteDate;
        const status = postValues.status;
        const amount = postValues.amount;
        const otherCharges = postValues.otherCharges;
        const discount = postValues.discount;
        const items = postValues.items;
       
        let apiURL = "/api/purchase/vendor-credit";
        var response = "";
        let formValues = {
            vendorID, creditNoteDate, refNo, status, amount, otherCharges, discount, items
        };
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }
        if (creditNoteID !== "") {
            apiURL = `/api/purchase/vendor-credit/${creditNoteID}/update`;
            response = await axios.put(apiURL, formValues, options);
        } else {
            response = await axios.post(apiURL, formValues, options);
        }
        if (response.status === 401)
            Logout();
        if (response.data.status === "Success") {
            setModalText({
                header: "Vendor Credit Note",
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
            <div className="text-center fs-1 mb-1 formHead">VENDOR CREDIT NOTE</div>
            <div className="d-flex flex-row align-items-baseline">
                <Button variant="primary" onClick={() => setPostValues(initValues)}>New Credit Note</Button>
                &emsp;
                Select Credit Note
                <PickList title={plCreditNote.title} rowHeaders={plCreditNote.rowHeaders} search={plCreditNote.search}
                        data={plCreditNote.data} onSelect={loadCreditNote} />
                
            </div>
            <Row>
                <Form.Group className="col-md-6 mb-1" controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="creditNoteDate" value={postValues.creditNoteDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.creditNoteDate}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={postValues.status} onChange={handleChange} >
                        <option value="">--Select--</option>
                        <option value="Draft">Draft</option>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
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
                    <Form.Control type="text" name="companyName" value={postValues.companyName} onChange={handleChange} placeholder="Company Name" disabled />
                    <Form.Text className="text-danger">{errorValues.companyName}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formRefNo">
                    <Form.Label>Reference No.</Form.Label>
                    <Form.Control type="text" name="refNo" value={postValues.refNo} onChange={handleChange} placeholder="Reference No."/>
                    <Form.Text className="text-danger">{errorValues.refNo}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control type="number" name="amount" value={postValues.amount} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.amount}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formOthers">
                    <Form.Label>Other Charges</Form.Label>
                    <Form.Control type="number" name="otherCharges" value={postValues.otherCharges} onChange={handleChange} placeholder="Other Charges"/>
                    <Form.Text className="text-danger">{errorValues.otherCharges}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formDiscount">
                    <Form.Label>Discount</Form.Label>
                    <Form.Control type="number" name="discount" value={postValues.discount} onChange={handleChange} placeholder="Discount"/>
                    <Form.Text className="text-danger">{errorValues.discount}</Form.Text>
                </Form.Group>
            </Row>
            <Form.Group controlId="formItems">
                <ItemSelector token={token} mode="P" postValues={postValues} setPostValues={setPostValues} />
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

export default VendorCreditNote;