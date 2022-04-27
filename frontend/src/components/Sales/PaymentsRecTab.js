import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import PaymentReceived from './PaymentsReceived';
import PaymentReceivedDatewise from './PaymentReceivedDatewise';

const PaymentsRecTab = () => {
    return (
        <Tabs defaultActiveKey="dataEntry" id="uncontrolled-tab-example" className="mb-3 formHeadPill" variant="pills" >
            <Tab eventKey="dataEntry" title="Data Entry">
                <PaymentReceived />
            </Tab>
            <Tab eventKey="view" title="View">
                <PaymentReceivedDatewise />
            </Tab>
        </Tabs>
    );
};

export default PaymentsRecTab;