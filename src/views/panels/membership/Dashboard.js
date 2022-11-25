import React from 'react';
import Chart from 'react-apexcharts';
import { Row, Col, Card } from 'react-bootstrap';

import collectedChart from './chart/collected-chart';
import transaction1 from './chart/transaction-1';
import transaction2 from './chart/transaction-2';
import saleChart from './chart/sale-chart';

const Dashboard = () => {
  return (
    <React.Fragment>
      <Row>
        <Col sm={3}>
          <Card className="bg-c-blue text-white widget-visitor-card borderless">
            <Card.Body className="text-center">
              <h2 className="text-white">18</h2>
              <h6 className="text-white">Registered Users</h6>
              <i className="feather icon-user-plus" />
            </Card.Body>
          </Card>
        </Col>
        <Col sm={3}>
          <Card className="bg-c-green text-white widget-visitor-card borderless">
            <Card.Body className="text-center">
              <h2 className="text-white">14</h2>
              <h6 className="text-white">Active Users</h6>
              <i className="feather icon-user-check" />
            </Card.Body>
          </Card>
        </Col>
        <Col sm={3}>
          <Card className="bg-c-yellow text-white widget-visitor-card borderless">
            <Card.Body className="text-center">
              <h2 className="text-white">1</h2>
              <h6 className="text-white">Pending Users</h6>
              <i className="feather icon-user-minus" />
            </Card.Body>
          </Card>
        </Col>
        <Col sm={3}>
          <Card className="bg-c-red text-white widget-visitor-card borderless">
            <Card.Body className="text-center">
              <h2 className="text-white">16</h2>
              <h6 className="text-white">Active Memberships</h6>
              <i className="feather icon-users" />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8} md={7}>
          <Card>
            <Card.Header>
              <h5>Total collected all time</h5>
            </Card.Header>
            <Card.Body>
              <Chart {...collectedChart} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={5}>
          <Card>
            <Card.Body>
              <h6>This Month</h6>
              <Row className="mt-3">
                <Col sm={6}>
                  <span className="d-block text-uppercase">Amount</span>
                  <h3 className="mt-3 mb-3">$2,144</h3>
                  <Chart {...transaction1} />
                </Col>
                <Col sm={6}>
                  <span className="d-block text-uppercase">Sales</span>
                  <h3 className="mt-3 mb-3">100</h3>
                  <Chart {...transaction2} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={12}>
          <Card>
            <Card.Header>
              <h5>Sales by membership</h5>
            </Card.Header>
            <Card.Body>
              <Chart {...saleChart} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Dashboard;
