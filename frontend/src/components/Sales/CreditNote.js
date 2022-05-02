import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal} from 'react-bootstrap';
import Logout from '../Admin/logout';
import { validateCreditNote } from './validateSalesEntry';
import PickList from '../PickList/PickList';
import { intializeSalesReturns, intializeCreditNote } from '../PickList/intializeProperties';
import { getSalesReturnsDetails, getCreditNoteDetails } from './loadDataSales';
import PreLoader from '../PreLoader';
import { formatDate, formatNum } from '../../utility';
 
const CreditNote = () => {
    const initValues = {
        creditNoteID: "",
        salesReturnID: "",
        invoiceID: "",
        customerID: "",
        customerName: "",
        addressLine1: "",
        status: "Draft",
        refNo: "",
        creditNoteDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        amount: "0.00",
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
    const [plCreditNote, setPlCreditNote] = useState({});
    
    //To show preloader
    const [loading, setLoading] = useState(true);
    
    const loadPicklistProps = async (token) => {
        let creditNoeList = await intializeCreditNote(token);
        setPlCreditNote(creditNoeList);
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
        let validationErrors = validateCreditNote(postValues);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0)
            insertCreditNote();
    }

    //Load credit note details
    const loadCreditNote = async (selCreditNote) => {
        const creditNote = await getCreditNoteDetails(selCreditNote[0], token);
        const postData = {
            creditNoteID: creditNote.creditNoteID,
            salesReturnID: creditNote.salesReturnID,
            invoiceID: creditNote.invoiceID,
            customerID: creditNote.customerID,
            customerName: creditNote.custDetails[0].customerName,
            addressLine1: creditNote.custDetails[0].addressLine1,
            status: creditNote.status,
            refNo: creditNote.refNo,
            creditNoteDate: creditNote.creditNoteDate.substring(0, 10),
            amount:  formatNum(creditNote.amount)
        }
        if (postData.status !== "Draft")
            window.alert("Only status can be updated.");
        setPostValues(postData);
    }
    
    //Load Sales Returns details
    const loadSalesReturns = async (selSalsReturns) => {
        const salesReturns = await getSalesReturnsDetails(selSalsReturns[0], token);
        const postData = {
            salesReturnID: salesReturns.salesReturnID,
            invoiceID: salesReturns.invoiceID,
            customerID: salesReturns.customerID,
            customerName: salesReturns.custDetails[0].customerName,
            addressLine1: salesReturns.custDetails[0].addressLine1,
            amount: salesReturnTotal(salesReturns)
        };
        
        setPostValues({...postValues, ...postData });
    }

    //Calculate sales return total
    const salesReturnTotal = (salesReturns) => {
        let total = 0;
        salesReturns.items.forEach(item => {
            total += Number(item.total);
        });
        
        return formatNum(total);
    }

    //Posting form data to API
    const insertCreditNote = async () => {
        const creditNoteID = postValues.creditNoteID;
        const salesReturnID = postValues.salesReturnID;
        const customerID = postValues.customerID;
        const invoiceID = postValues.invoiceID;
        const refNo = postValues.refNo;
        const creditNoteDate = postValues.creditNoteDate;
        const status = postValues.status;
        const amount = postValues.amount;
       
        let apiURL = "/api/sales/credit-note";
        var response = "";
        let formValues = {
            salesReturnID, invoiceID, customerID, creditNoteDate, refNo, status, amount
        };
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }
        if (creditNoteID !== "") {
            apiURL = `/api/sales/credit-note/${creditNoteID}/update`;
            response = await axios.put(apiURL, formValues, options);
        } else {
            response = await axios.post(apiURL, formValues, options);
        }
        if (response.status === 401)
            Logout();
        if (response.data.status === "Success") {
            setModalText({
                header: "Credit Note",
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
            <div className="text-center fs-1 mb-1 formHead">CREDIT NOTE</div>
            <div className="d-flex flex-row align-items-baseline">
                <Button variant="primary" onClick={() => setPostValues(initValues)}>New Credit Note</Button>
                &emsp;
                Select Credit Note
                <PickList title={plCreditNote.title} rowHeaders={plCreditNote.rowHeaders} search={plCreditNote.search}
                        data={plCreditNote.data} onSelect={loadCreditNote} />
                
            </div>
            <Row>
                <Form.Group className="col-md-6 mb-1" controlId="formDate">
                    <Form.Label>Received Date</Form.Label>
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
                <Form.Group className="col-md-6 mb-1" controlId="formSalesReturns">
                    <Form.Label>Select Sales Returns</Form.Label>
                    <PickList title={plSalesReturns.title} rowHeaders={plSalesReturns.rowHeaders} search={plSalesReturns.search}
                        data={plSalesReturns.data} onSelect={loadSalesReturns} />
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
                <Form.Group className="col-md-6 mb-1" controlId="formRefNo">
                    <Form.Label>Reference No.</Form.Label>
                    <Form.Control type="text" name="refNo" value={postValues.refNo} onChange={handleChange} placeholder="Reference No."/>
                    <Form.Text className="text-danger">{errorValues.refNo}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control type="number" name="amount" value={postValues.amount} onChange={handleChange} placeholder="Amount"/>
                    <Form.Text className="text-danger">{errorValues.amount}</Form.Text>
                </Form.Group>
            </Row>
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

export default CreditNote;