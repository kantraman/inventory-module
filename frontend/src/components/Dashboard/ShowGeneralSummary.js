import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import useToken from '../Admin/useToken';
import { getGeneralSummary } from './loadDashboardData';
import './Dashboard.css';

const ShowGeneralSummary = () => {
    const [details, setDetails] = useState([]);
    const { token } = useToken()

    const loadDetails = async () => {
        let genSummary = await getGeneralSummary(token);
        setDetails(genSummary);
    }
        

    useEffect( () => {
        loadDetails();
    }, []);
    
    if (Object.keys(details).length > 3)
        return (
            <Row className="dashBox">
                <ShowTile itemName = "Inventory Items" itemNum = {details.items} bgColor="#D32D41" />
                <ShowTile itemName="Item Groups" itemNum={details.itemGroups} bgColor="#1C4E80" />
                <ShowTile itemName="Customers" itemNum={details.customers} bgColor="#6AB187" />
                <ShowTile itemName = "Vendors" itemNum = {details.vendors} bgColor="#DBAE58" />
            </Row>
        );
    else
        return "";

};

const ShowTile = ({
    itemName,
    itemNum,
    bgColor
}) => {
    return (
        <div style={{backgroundColor: bgColor}} className="col-lg-2 col-md-3 col-sm-5 p-3 sumTile">
            <h1>{itemNum}</h1>
            <h4>{itemName}</h4>
        </div>
    )
}

export default ShowGeneralSummary;