import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';


const PaymentsRecTab = ({tab1, tab2}) => {
    return (
        <Tabs defaultActiveKey="dataEntry" id="uncontrolled-tab-example" className="mb-3 formHeadPill" variant="pills" >
            <Tab eventKey="dataEntry" title="Data Entry">
                {tab1}
            </Tab>
            <Tab eventKey="view" title="View">
                {tab2}
            </Tab>
        </Tabs>
    );
};

export default PaymentsRecTab;