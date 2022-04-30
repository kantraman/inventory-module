import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal } from 'react-bootstrap';
import Logout from '../Admin/logout';
import { validateVendorEntry } from './validatePurchaseEntry';
import PickList from '../PickList/PickList';
import { intializeVendor } from '../PickList/intializeProperties';
import CountrySelector from '../CountrySelector';
import { getVendors } from './loadDataPurchase';

const Vendor = () => {
    const initValues = {
        vendorID: "",
        companyName: "",
        goodsServices: "",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        emailID: "",
        contactNo1: "",
        contactNo2: "",
        website: "",
        pocName: "",
        pocEmail: "",
        pocContactNo: ""
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
    const [plProps, setPlProps] = useState({});
    
    const loadPicklistProps = async (token) => {
        let vendorList = await intializeVendor(token);
        setPlProps(vendorList);
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
        let validationErrors = validateVendorEntry(postValues);
        setErrorValues(validationErrors);
        if (Object.keys(validationErrors).length === 0)
            insertVendor();
    }

    //Load vendor details
    const loadVendorDetails = async (vendor) => {
        const vendorDetails = await getVendors(token, vendor[0]);
        setPostValues(vendorDetails);
    }

    //Posting form data to API
    const insertVendor = async () => {
        const vendorID = postValues.vendorID;
        const goodsServices = postValues.goodsServices;
        const companyName = postValues.companyName;
        const pocName = postValues.pocName;
        const pocEmail = postValues.pocEmail;
        const pocContactNo = postValues.pocContactNo;
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

        let apiURL = "/api/purchase/vendor";
        var response = "";
        let formValues = {
            companyName, goodsServices, addressLine1, addressLine2, addressLine3,
            city, state, pincode, country, emailID, contactNo1, contactNo2, website,
            pocName, pocEmail, pocContactNo
        };
        let options = {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        }
        if (vendorID !== "") {
            apiURL = `/api/purchase/vendor/${vendorID}/update`;
            response = await axios.put(apiURL, formValues, options);
        } else {
            response = await axios.post(apiURL, formValues, options);
        }
        if (response.status === 401)
            Logout();
        if (response.data.status === "Success") {
            setModalText({
                header: "Vendor",
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
            <div className="text-center fs-1 mb-1 formHead">VENDOR</div>
            <div className="d-flex flex-row align-items-baseline">
                    <Button variant="primary" onClick={() => setPostValues(initValues)}>New Customer</Button>
                &emsp;
                    <Form.Label>Select Vendor</Form.Label>
                <PickList title={plProps.title} rowHeaders={plProps.rowHeaders} search={plProps.search}
                        data={plProps.data} onSelect={loadVendorDetails} />
            </div>
            <Row>
                <Form.Group className="col-md-6 mb-3" controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="companyName" value={postValues.companyName} onChange={handleChange} placeholder="Company Name" />
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
                <CountrySelector value={postValues.country} onChange={handleChange} errorMessage={ errorValues.country }/>
                <Form.Group className="col-md-6 mb-3" controlId="formPincode">
                    <Form.Label>Pin Code</Form.Label>
                    <Form.Control type="number" name="pincode" value={postValues.pincode} onChange={handleChange} placeholder="Pin Code" />
                    <Form.Text className="text-danger">{errorValues.pincode}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formPhone1">
                    <Form.Label>Phone No. 1</Form.Label>
                    <Form.Control type="number" name="contactNo1" value={postValues.contactNo1} onChange={handleChange} placeholder="Phone No. 1" />
                    <Form.Text className="text-danger">{errorValues.contactNo1}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formPhone2">
                    <Form.Label>Phone No. 2</Form.Label>
                    <Form.Control type="number" name="contactNo2" value={postValues.contactNo2} onChange={handleChange} placeholder="Phone No. 2" />
                    <Form.Text className="text-danger">{errorValues.contactNo2}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formEmail">
                    <Form.Label>Email ID</Form.Label>
                    <Form.Control type="email" name="emailID" value={postValues.emailID} onChange={handleChange} placeholder="xyz@abc.com" />
                    <Form.Text className="text-danger">{errorValues.emailID}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formWebsite">
                    <Form.Label>Website</Form.Label>
                    <Form.Control type="text" name="website" value={postValues.website} onChange={handleChange} placeholder="https://www.abc.com" />
                    <Form.Text className="text-danger">{errorValues.website}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formGoods">
                    <Form.Label>Goods / Services</Form.Label>
                    <Form.Control type="text" name="goodsServices" value={postValues.goodsServices} onChange={handleChange} placeholder="Goods / Services" />
                    <Form.Text className="text-danger">{errorValues.goodsServices}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formPOCName">
                    <Form.Label>Point of Contact Name</Form.Label>
                    <Form.Control type="text" name="pocName" value={postValues.pocName} onChange={handleChange} placeholder="POC Name" />
                    <Form.Text className="text-danger">{errorValues.goodsServices}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formPOCEmail">
                    <Form.Label>Point of Contact Email ID</Form.Label>
                    <Form.Control type="email" name="pocEmail" value={postValues.pocEmail} onChange={handleChange} placeholder="POC Email ID" />
                    <Form.Text className="text-danger">{errorValues.pocEmail}</Form.Text>
                </Form.Group>
                <Form.Group className="col-md-6 mb-3" controlId="formPOCContactNo">
                    <Form.Label>Point of Contact Contact No.</Form.Label>
                    <Form.Control type="text" name="pocContactNo" value={postValues.pocContactNo} onChange={handleChange} placeholder="POC Contact No." />
                    <Form.Text className="text-danger">{errorValues.pocContactNo}</Form.Text>
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

export default Vendor;