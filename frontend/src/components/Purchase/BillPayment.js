import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal} from 'react-bootstrap';
import Logout from '../Admin/logout';
import PickList from '../PickList/PickList';
import { intializeBills } from '../PickList/intializeProperties';
import PreLoader from '../PreLoader';
import { formatDate, formatNum } from '../../utility';
import { getBillDetails } from './loadDataPurchase';
import { validatePayments } from './validatePurchaseEntry';

const BillPayment = () => {
    const initValues = {
        billID: "",
        vendorID: "",
        companyName: "",
        refNo: "",
        paymentDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        amount: "0.00",
        otherCharges: "0.00",
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
    const [plBill, setPlBill] = useState({});
    
    //To show preloader
    const [loading, setLoading] = useState(true);
    
    const loadPicklistProps = async (token) => {
        let billList = await intializeBills(token, ["Open", "Partially Paid", "Due"]);
        setPlBill(billList);
        setLoading(false);
    }
    useEffect(() => loadPicklistProps(token), []);

    //Input values to postValues
    function handleChange(event) {
        const { name, value } = event.target;
        setPostValues({ ...postValues, [name]: value });
    }

    //Load bill details
    const loadBillDetails = async (selBill) => {
        const bill = await getBillDetails(selBill[0], token);
        
        const postData = {
            billID: bill.billID,
            vendorID: bill.vendorID,
            companyName: bill.vendorDetails[0].companyName,
            amount: getbillTotal(bill)
        };
        setPostValues({ ...postValues, ...postData });
    }

    //Calculate bill total
    const getbillTotal = (bill) => {
        let total = 0;
        let grandTotal = 0;
        bill.items.forEach(item => {
            total += Number(item.total);
        });
        grandTotal = Number(bill.otherCharges) + total - Number(bill.discount);
        return formatNum(grandTotal);
    }

    //Manage form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        let validationErrors = validatePayments(postValues);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0)
            insertBillPayment();
    }

    //Posting form data to API
    const insertBillPayment = async () => {
        const billID = postValues.billID;
        const vendorID = postValues.vendorID;
        const refNo = postValues.refNo;
        const paymentDate = postValues.paymentDate;
        const notes = postValues.notes;
        const modeOfPayment = postValues.modeOfPayment;
        const amount = postValues.amount;
        const otherCharges = postValues.otherCharges

        let apiURL = "/api/purchase/bill-payment";
        var response = "";
        let formValues = {
            billID, vendorID, refNo, paymentDate, notes, modeOfPayment, amount, otherCharges
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
                header: "Bill Payment",
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
            <div className="text-center fs-1 mb-1 formHead">BILL PAYMENT</div>
            <div className="d-flex flex-row align-items-baseline">
                <Button variant="primary" onClick={() => setPostValues(initValues)}>New</Button>
            </div>
            <Row>
                <Form.Group className="col-md-6 mb-1" controlId="formDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="paymentDate" value={postValues.paymentDate} onChange={handleChange} />
                    <Form.Text className="text-danger">{errorValues.paymentDate}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formBillID">
                    <Form.Label>Select Bill</Form.Label>
                    <PickList title={plBill.title} rowHeaders={plBill.rowHeaders} search={plBill.search}
                        data={plBill.data} onSelect={loadBillDetails} />
                </Form.Group>
                <Form.Group className="col-md-6 mb-1" controlId="formMode">
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
                <Form.Group className="col-md-6 mb-1" controlId="formRefNo">
                    <Form.Label>Reference No.</Form.Label>
                    <Form.Control type="text" name="refNo" value={postValues.refNo} onChange={handleChange} placeholder="Reference No." />
                    <Form.Text className="text-danger">{errorValues.refNo}</Form.Text>
                </Form.Group>
               
                <Form.Group className="col-md-6 mb-1" controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="companyName" value={postValues.companyName} onChange={handleChange} placeholder="Company Name" disabled />
                    <Form.Text className="text-danger">{errorValues.customerName}</Form.Text>
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
                    <Form.Label>Other Charges</Form.Label>
                    <Form.Control type="text" name="otherCharges" value={postValues.otherCharges} onChange={handleChange} placeholder="Bank Charges" />
                    <Form.Text className="text-danger">{errorValues.otherCharges}</Form.Text>
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

export default BillPayment;