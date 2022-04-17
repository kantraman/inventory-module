import React, {useState} from 'react';
import { Offcanvas, Button, Nav, NavDropdown } from 'react-bootstrap';

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
                    <Nav className="nav flex-column">
                        <NavDropdown title="Inventory" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/item-group">Item Group</NavDropdown.Item>
                            <NavDropdown.Item href="/item">Item</NavDropdown.Item>
                            <NavDropdown.Item href="/inv-adjustment">Inventory Adjustment</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/Logout">Log Out</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default NavBar;