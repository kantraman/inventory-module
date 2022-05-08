import React, { useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button } from 'react-bootstrap';
import { showInventorySummary, showProductSalesReport, showCustomerSalesReport, showInventoryAgingSummary } from './loadReports';
import Preloader from '../PreLoader';
import { formatDate } from '../../utility';

const ReportViewer = () => {
    const initValues = {
        type: "",
        fromDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK")),
        toDate: formatDate(new Date(Date.now()).toLocaleDateString("en-UK"))
    }
    const { token } = useToken();
    //Manage form values
    const [formValues, setFormValues] = useState(initValues);
    const [loading, setLoading] = useState(false);
    const [errorValues, setErrorValues] = useState({});

    //Handle change of form values
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    }

     //Validate Dates
     const validateDates = () => {
        let fromDate = formValues.fromDate;
        let toDate = formValues.toDate;
        let isValid = true;
        let validationErrors = {};

        if (!formValues.fromDate)
            validationErrors.fromDate = "From date is required";
        if (!formValues.toDate)
            validationErrors.toDate = "To date is required";
        if (isNaN(new Date(fromDate).getTime())) {
            isValid = false;
            validationErrors.fromDate = "Invalid from Date";
        }
        if (isNaN(new Date(toDate).getTime())) {
            isValid = false;
            validationErrors.toDate = "Invalid to Date";
        }
        if (isValid) {
            if (new Date(fromDate) > new Date(toDate)) {
                validationErrors.fromDate = "From date cannot be greater than to date";
            }
        }
        
        return validationErrors;
    }


    //View Report 
    const viewReport = () => {
        let type = formValues.type;
        let fromDate = formValues.fromDate;
        let toDate = formValues.toDate;
        let validationErrors = validateDates();
        setErrorValues(validationErrors);
        setLoading(true);
        switch (type) {
            case "I":
                showInventorySummary(token, setLoading);
                break;
            case "A":
                showInventoryAgingSummary(token, setLoading);
                break;
            case "S":
            case "SI":
                if (Object.keys(validationErrors).length === 0)
                    showProductSalesReport(token, fromDate, toDate, setLoading);
                break;
            case "SC":
                if (Object.keys(validationErrors).length === 0)
                    showCustomerSalesReport(token, fromDate, toDate, setLoading);
                break;
            default:
                break;
        }
    }

    //export Report 
    const exportReport = () => {
        let type = formValues.type;
        let fromDate = formValues.fromDate;
        let toDate = formValues.toDate;
        let validationErrors = validateDates();
        setErrorValues(validationErrors);
        setLoading(true);
        switch (type) {
            case "I":
                showInventorySummary(token, setLoading, true);
                break;
            case "A":
                showInventoryAgingSummary(token, setLoading, true);
                break;
            case "S":
            case "SI":
                if (Object.keys(validationErrors).length === 0)
                    showProductSalesReport(token, fromDate, toDate, setLoading, true);
                break;
            case "SC":
                if (Object.keys(validationErrors).length === 0)
                    showCustomerSalesReport(token, fromDate, toDate, setLoading, true);
                break;
           
            default:
                break;
        }
    }

    return (
        <Form className="mx-auto col-lg-6 col-md-8 col-sm-10 p-3 formBg">
            <Preloader loading={loading} />
            <div className="text-center fs-1 mb-1 formHead">REPORTS</div>
            <Row>
                <Form.Group className="col-md-6 mb-1" controlId="formStatus">
                    <Form.Label>Report Type</Form.Label>
                    <Form.Select name="type" value={formValues.type} onChange={handleChange} >
                        <option value="">--Select--</option>
                        <option value="I">Inventory Summary</option>
                        <option value="A">Inventory Aging Summary</option>
                        <option value="S">Product Sales Report</option>
                        <option value="SC">Sales by customer</option>
                        <option value="SI">Sales by item</option>
                    </Form.Select>
                </Form.Group>
                {
                    formValues.type !== "I" && formValues.type !== "A" ?
                    <>
                        <Form.Group className="col-md-6 mb-2" controlId="formFromDate">
                            <Form.Label>From Date</Form.Label>
                            <Form.Control type="date" name="fromDate" value={formValues.fromDate} onChange={handleChange} />
                            <Form.Text className="text-danger">{errorValues.fromDate}</Form.Text>
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-2" controlId="formToDate">
                            <Form.Label>To Date</Form.Label>
                            <Form.Control type="date" name="toDate" value={formValues.toDate} onChange={handleChange} />
                            <Form.Text className="text-danger">{errorValues.toDate}</Form.Text>
                        </Form.Group>
                    </> : null
                }
            </Row>
            <Button onClick={viewReport}>View</Button> &emsp;
            <Button onClick={exportReport}>Export</Button>
        </Form>
    );
};

export default ReportViewer;