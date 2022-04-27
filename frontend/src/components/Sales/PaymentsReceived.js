import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal} from 'react-bootstrap';
import Logout from '../Admin/logout';
import { validatePaymentsRec } from './validateSalesEntry';
import PickList from '../PickList/PickList';
import { intializeInvoice } from '../PickList/intializeProperties';
import { getInvoiceDetails } from './loadDataSales';
import PreLoader from '../PreLoader';
import { formatDate } from '../../utility';

const PaymentsReceived = () => {
    const initValues = {
        invoiceID: "",
        customerID: "",
        customerName: "",
        addressLine1: "",
        paymentRecDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        amount: "0.00",
        bankCharges: "0.00",
        modeOfPayment: "",
        notes: ""
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
    const [plInvoice, setPlInvoice] = useState({});
    
    //To show preloader
    const [loading, setLoading] = useState(true);
    
    const loadPicklistProps = async (token) => {
        let invoiceList = await intializeInvoice(token, ["Sent", "Partially Paid", "Due"]);
        setPlInvoice(invoiceList);
        setLoading(false);
    }
    useEffect(() => loadPicklistProps(token), []);

    //Input values to postValues
    function handleChange(event) {
        const { name, value } = event.target;
        setPostValues({ ...postValues, [name]: value });
    }

    //Load invoice details
    const loadInvoiceDetails = async (selInvoice) => {
        const invoice = await getInvoiceDetails(selInvoice[0], token);
        
        const postData = {
            invoiceID: invoice.invoiceID,
            customerID: invoice.customerID,
            customerName: invoice.custDetails[0].customerName,
            addressLine1: invoice.custDetails[0].addressLine1,
            amount: getInvoiceTotal(invoice)
        };
        setPostValues({ ...postValues, ...postData });
    }

    //Calculate invoice total
    const getInvoiceTotal = (invoice) => {
        let total = 0;
        let grandTotal = 0;
        invoice.items.forEach(item => {
            total += Number(item.total);
        });
        grandTotal = Number(invoice.otherCharges) + total;
        return grandTotal;
    }

    //Manage form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        let validationErrors = validatePaymentsRec(postValues);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0)
            insertPackage();
    }

    //Posting form data to API
    const insertPackage = async () => {
        const invoiceID = postValues.invoiceID;
        const customerID = postValues.customerID;
        const paymentRecDate = postValues.paymentRecDate;
        const notes = postValues.notes;
        const modeOfPayment = postValues.modeOfPayment;
        const amount = postValues.amount;
        const bankCharges = postValues.bankCharges

        let apiURL = "/api/sales/payments-rec";
        var response = "";
        let formValues = {
            customerID, invoiceID, paymentRecDate, notes, modeOfPayment, amount, bankCharges
        };
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }
        
        response = await axios.post(apiURL, formValues, options);
      
        if (response.status === 401)
            Logout();
        if (response.data.status === "Success") {
            setModalText({
                header: "Payments Received",
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
            <div className="text-center fs-1 mb-1 formHead">PAYMENTS RECEIVED</div>
            <div className="d-flex flex-row align-items-baseline">
                <Button variant="primary" onClick={() => setPostValues(initValues)}>New</Button>
            </div>
            <Row>
                <Form.Group className="col-md-6 mb-1" controlId="formPackageDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="paymentRecDate" value={postValues.paymentRecDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.paymentRecDate}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formStatus">
                    <Form.Label>Mode of Payment</Form.Label>
                    <Form.Select name="modeOfPayment" value={postValues.modeOfPayment} onChange={handleChange} >
                        <option value="">--Select--</option>
                        <option value="By Cash">By Cash</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Credit/Debit Card">Credit/Debit Card</option>
                        <option value="Digital Payment">Digital Payment</option>
                    </Form.Select>
                    <Form.Text className="text-danger">{errorValues.modeOfPayment}</Form.Text>
                </Form.Group>
                <Form.Group>
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
                <Form.Group className="col-md-6 mb-1" controlId="formNotes">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control type="text" name="notes" value={postValues.notes} onChange={handleChange} placeholder="Notes about payment" />
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control type="number" name="amount" value={postValues.amount} onChange={handleChange} placeholder="0.00" />
                    <Form.Text className="text-danger">{errorValues.amount}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formBankCharges">
                    <Form.Label>Bank Charges</Form.Label>
                    <Form.Control type="text" name="bankCharges" value={postValues.bankCharges} onChange={handleChange} placeholder="Bank Charges" />
                    <Form.Text className="text-danger">{errorValues.bankCharges}</Form.Text>
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

export default PaymentsReceived;