import axios from 'axios';
import React, { useState } from 'react';
import useToken from '../Admin/useToken';
import { Form, Row, Button, Modal } from 'react-bootstrap';
import Logout from '../Admin/logout';

const ItemGroup = () => {
    const initValues = {
        groupName: ""
    };
    const { token } = useToken();
    //Manage Form Field Values
    const [postValues, setPostValues] = useState(initValues);

    //Modal properties
    const [show, setShow] = useState(false);
    const [modalText, setModalText] = useState({ header: "", body: "" });
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    //Input values to postValues
    function handleChange(event) {
        const { name, value } = event.target;
        setPostValues({ ...postValues, [name]: value });
    }

    //Manage form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        if (postValues.groupName !== "")
            insertItemGroup();
    }

    //Posting form data to API
    const insertItemGroup = async () => {
        const groupName = postValues.groupName;
        
        const response = await axios.post("/api/inventory/item-group", {
            groupName
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        });
        if (response.status === 401)
           Logout();    
        if (response.data.status === "Success") {
            setModalText({
                header: "Item Group",
                body: "Item group successfully inserted"
            });
            setPostValues(initValues);
        } else {
            setModalText({
                header: "Error",
                body: "An unexpected error occured. Please try again!"
            });
        }
        handleShow();
    }

    return (
        <Form className="mx-auto col-lg-6 col-md-8 col-sm-10 p-3 formBg" onSubmit={handleSubmit}>
            <div className="text-center fs-1 mb-1 formHead">ITEM GROUP</div>
            <Row>
                <Form.Group className="col-md-6 mb-3" controlId="formGroupName">
                    <Form.Label>Group Name</Form.Label>
                    <Form.Control type="text" name="groupName" value={postValues.groupName} onChange={handleChange} placeholder="Group Name" />
                </Form.Group>
            </Row>
            <div className="mb-4">
                <Button variant="primary" type="submit" >Submit</Button>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{ modalText.header }</Modal.Title>
                </Modal.Header>
                <Modal.Body>{ modalText.body }</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form>
    );
};


export default ItemGroup;