import React, { useState } from 'react';
import ShowGeneralSummary from '../Dashboard/ShowGeneralSummary';
import { Row, Col } from 'react-bootstrap';
import useToken from '../Admin/useToken';
import MonthlySummary from '../Dashboard/MonthlySummary';
import Preloader from '../PreLoader';

const Home = () => {
    const { token } = useToken();
    const [loading, setLoading] = useState(true);

    setTimeout(() => {
        setLoading(false)
    }, 3000);

    return (
        <div>
            <Preloader loading={loading} />
            <h1 className="bg-secondary text-white text-center m-3"> GENERAL SUMMARY </h1>
            <ShowGeneralSummary token={token} />
            <h1 className="bg-secondary text-white text-center m-3"> MONTHLY SUMMARY </h1>
            <Row className="mx-1">
                <Col className="col-12 col-md-6 col-lg-3 mb-1">
                    <MonthlySummary type={1} token={token} link="/sales-order" />
                </Col>
                <Col className="col-12 col-md-6 col-lg-3 mb-1">
                    <MonthlySummary type={2} token={token} link="/purchase-order" />
                </Col>
                <Col className="col-12 col-md-6 col-lg-3 mb-1">
                    <MonthlySummary type={6} token={token} link="/invoice" />
                </Col>
                <Col className="col-12 col-md-6 col-lg-3 mb-1">
                    <MonthlySummary type={7} token={token} link="/bills" />
                </Col>
                <Col className="col-12 col-md-6 col-lg-6 mb-1">
                    <MonthlySummary type={8} token={token} link="/home" />
                </Col>
                <Col className="col-12 col-md-6 col-lg-3 mb-1">
                    <MonthlySummary type={5} token={token} link="/sales-returns" />
                </Col>
                <Col className="col-12 col-md-6 col-lg-3  mb-1">
                    <MonthlySummary type={4} token={token} link="/package" />
                </Col>
                <Col className="col-12 col-md-6 col-lg-3  mb-1">
                    <MonthlySummary type={3} token={token} link="/challan" />
                </Col>
            </Row>
        </div>
    );
};

export default Home;