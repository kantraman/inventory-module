import React, { useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button } from 'react-bootstrap';
import { showInventorySummary } from './loadReports';
import Preloader from '../PreLoader';

const ReportViewer = () => {
    const initValues = {
        type: ""
    }
    const { token } = useToken();
    //Manage form values
    const [formValues, setFormValues] = useState(initValues);
    const [loading, setLoading] = useState(false);

    //Handle change of form values
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    }

    //View Report 
    const viewReport = () => {
        let type = formValues.type;
        setLoading(true);
        switch (type) {
            case "I":
                showInventorySummary(token, setLoading);
                break;
            default:
                break;
        }
    }

    //export Report 
    const exportReport = () => {
        let type = formValues.type;
        setLoading(true);
        switch (type) {
            case "I":
                showInventorySummary(token, setLoading, true);
                break;
            default:
                break;
        }
    }

    return (
        <Form className="mx-auto col-lg-6 col-md-8 col-sm-10 p-3 formBg">
            <Preloader loading={loading} />
            <Row>
                <Form.Group className="col-md-6 mb-1" controlId="formStatus">
                    <Form.Label>Report Type</Form.Label>
                    <Form.Select name="type" value={formValues.type} onChange={handleChange} >
                        <option value="">--Select--</option>
                        <option value="I">Inventory Summary</option>
                        <option value="A">Inventory Aging Summary</option>
                        <option value="S">Product Sales Report</option>
                        <option value="C">Sales by items/customer</option>
                    </Form.Select>
                </Form.Group>
            </Row>
            <Button onClick={viewReport}>View</Button> &emsp;
            <Button onClick={exportReport}>Export</Button>
        </Form>
    );
};

export default ReportViewer;