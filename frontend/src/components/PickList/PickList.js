import React, { useState } from 'react';
import { Form, Row, Button, Modal, Table } from 'react-bootstrap';

const PickList = ({
    title,
    rowHeaders,
    search,
    data,
    onSelect
}) => {
    const initValues = {
        search1: "",
        search2: ""
    }
    //Set data
    const [searchValues, setSearchValues] = useState(initValues);
    const [details, setDetails] = useState([]);
    //Modal properties
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setSearchValues(initValues);
        setDetails([]);
    };
    const handleShow = () => setShow(true);

    //Input values to searchValues
    function handleChange(event) {
        const { name, value } = event.target;
        setSearchValues({ ...searchValues, [name]: value });
    }
    
    //Show search result
    const showResult = () => {
        let filter = {};
        let search1 = "^" + searchValues.search1;
        let search2 = "^" + searchValues.search2;
        
        if (searchValues.search1 !== "")
            filter[search[0].field] = new RegExp(search1, "i");
        if (searchValues.search2 !== "")
            filter[search[1].field] = new RegExp(search2, "i");
            
        let ds = data.filter(function (item) {
            for (var key in filter) {
                if (item[key] === undefined || !filter[key].test(item[key]))
                    return false;
            }
            return true;
        });
        setDetails(ds);
        if (ds.length === 0)
            window.alert("No records found.");
    }
    //Pass selected row data
    const select = (event) => {
        const target = event.target.parentNode;
        let cols = [];
        if (target) {
            var cells = target.getElementsByTagName("td");
            for (var i = 0; i < cells.length; i++) 
                cols.push(cells[i].innerHTML);
            }
        onSelect(cols);
        handleClose();
    }
    if (title === undefined)
        return (<div></div>)
    return (
        <div>
            <Button variant="primary" onClick={handleShow}>...</Button>
            <Modal show={show} onHide={handleClose} fullscreen={true}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-secondary">
                    <Row>
                        <Form.Group className="col-md-6 mb-2" controlId="formSearch1">
                            <Form.Label className="text-white">{search[0].title}</Form.Label>
                            <Form.Control type="text" name="search1" value={searchValues.search1} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-2" controlId="formSearch1">
                            <Form.Label className="text-white">{search[1].title}</Form.Label>
                            <Form.Control type="text" name="search2" value={searchValues.search2} onChange={handleChange}
                                style={search[1].title === "" ? { "display": "none" } : { "display": "block" }} />
                        </Form.Group>
                    </Row>
                    <Button variant="primary" onClick={showResult}>Search</Button> <br />
                    <Table variant="dark" style={{ "whiteSpace": 'nowrap'}} hover responsive>
                        <thead>
                            <tr>
                                {
                                    rowHeaders.map(
                                        (item, index) => {
                                            return (<th key={index}>{item}</th>)
                                        }
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody style={{cursor:"pointer"}}>
                            {
                                details.map((item, index) => {
                                    let objValues = Object.values(item);
                                    return (
                                        <tr key={index} onClick={select}>
                                            {
                                                objValues.map(
                                                    (value, index) => <td key={index}>{value}</td>
                                                )
                                            }
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PickList;