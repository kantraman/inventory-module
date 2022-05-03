import React, {useState} from 'react';
import { Offcanvas, Button, Nav, NavDropdown } from 'react-bootstrap';
import "./NavBar.css";

const NavBar = ({ visible }) => {
    const [show, setShow] = useState(false);
    //Offcanvas
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    if (!visible)
        return (<div></div>);
    return (
        <div>
            <div className="d-grid">
                <Button variant="primary" onClick={handleShow} className='d-flex align-items-center ml-4'>
                    &#9776;&emsp;Navigation
                </Button>
            </div>
            <Offcanvas show={show} onHide={handleClose} className="bg-dark text-light">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Navigation</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="nav myNav flex-column">
                        <NavDropdown title="Inventory" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/item-group">Item Group</NavDropdown.Item>
                            <NavDropdown.Item href="/item">Item</NavDropdown.Item>
                            <NavDropdown.Item href="/inv-adjustment">Inventory Adjustment</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Sales" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/customer">Customer</NavDropdown.Item>
                            <NavDropdown.Item href="/sales-order">Sales Order</NavDropdown.Item>
                            <NavDropdown.Item href="/view-so">Sales Order List</NavDropdown.Item>
                            <NavDropdown.Item href="/package">Package</NavDropdown.Item>
                            <NavDropdown.Item href="/challan">Delivery Challan</NavDropdown.Item>
                            <NavDropdown.Item href="/invoice">Invoice</NavDropdown.Item>
                            <NavDropdown.Item href="/payments-rec">Payments Received</NavDropdown.Item>
                            <NavDropdown.Item href="/sales-returns">Sales Returns</NavDropdown.Item>
                            <NavDropdown.Item href="/credit-note">Credit Note</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Purchase" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/vendor">Vendor</NavDropdown.Item>
                            <NavDropdown.Item href="/purchase-order">Purchase Order</NavDropdown.Item>
                            <NavDropdown.Item href="/bills">Bill</NavDropdown.Item>
                            <NavDropdown.Item href="/bill-payment">Bill Payment</NavDropdown.Item>
                            <NavDropdown.Item href="/vendor-credit">Vendor Credit Note</NavDropdown.Item>
                        </NavDropdown>
                        
                        <Nav.Link href="/Logout">Log Out</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default NavBar;