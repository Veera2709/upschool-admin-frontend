import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import lineChart from './chart/line-chart';
import ApexCharts from 'apexcharts';
import useInterval from 'react-useinterval';

import Deposit from './history-trading/Deposit';
import Withdraw from './history-trading/Withdraw';

const Trading = () => {
  const [data, setData] = useState([]);
  const [latestDate, setLatestDate] = useState(new Date('11 Feb 2017 GMT').getTime());

  const dataProvider = (baseval) => {
    const yrange = { min: 10, max: 90 };
    const newDate = latestDate + 86400000;
    const newData = {
      x: newDate,
      y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    };

    setLatestDate(newDate);

    const latestData = [...data, newData];

    const newSeries = [
      {
        ...lineChart.series,
        data: latestData
      }
    ];

    setData(latestData);

    ApexCharts.exec(`line-chart`, 'updateSeries', newSeries);
  };

  useEffect(() => {
    let i = 0;
    let baseval = new Date('11 Feb 2017 GMT').getTime();
    const count = 10;
    const yrange = { min: 10, max: 90 };

    let newData = [];
    let newDate;

    while (i < count) {
      const x = baseval;
      const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      newData = [...newData, { x, y }];
      newDate = baseval;
      baseval += 86400000;
      i++;
    }
    setLatestDate(newDate);
    setData(newData);
  }, [setLatestDate, setData]);

  useInterval(dataProvider, 2000, latestDate);

  return (
    <React.Fragment>
      <Row className="btn-page">
        <Col xl={3} lg={12}>
          <Card className="task-board-left">
            <Card.Header>
              <h5>Market</h5>
            </Card.Header>
            <Card.Body className="card-body">
              <div className="input-group mb-0">
                <input type="text" className="form-control add_task_todo" placeholder="Search here..." required="" />
                <div className="input-group-append">
                  <button className="btn waves-effect waves-light btn-primary btn-msg-send" type="button">
                    <i className="fas fa-search" />
                  </button>
                </div>
              </div>
            </Card.Body>
            <ul className="list-group list-group-flush">
              <li className="list-group-item border-top-0">
                <div className="float-right">231.65</div>
                <div className="d-flex align-items-center">
                  {' '}
                  <i className="f-24 m-r-10 fab fa-bitcoin text-c-yellow" /> Bitcoin{' '}
                </div>
              </li>
              <li className="list-group-item">
                <div className="float-right">113.05</div>
                <div className="d-flex align-items-center">
                  {' '}
                  <i className="f-24 m-r-10 fab fa-cloudsmith text-c-green" />
                  DASH{' '}
                </div>
              </li>
              <li className="list-group-item">
                <div className="float-right">341.22</div>
                <div className="d-flex align-items-center">
                  {' '}
                  <i className="f-24 m-r-10 fab fa-ethereum text-c-red" />
                  Litecoin{' '}
                </div>
              </li>
              <li className="list-group-item">
                <div className="float-right">241.68</div>
                <div className="d-flex align-items-center">
                  <i className="f-24 m-r-10 fab fa-asymmetrik text-c-blue" />
                  NEO
                </div>
              </li>
              <li className="list-group-item">
                <div className="float-right">231.65</div>
                <div className="d-flex align-items-center">
                  {' '}
                  <i className="f-24 m-r-10 fab fa-bitcoin text-c-yellow" /> ANC{' '}
                </div>
              </li>
              <li className="list-group-item">
                <div className="float-right">113.05</div>
                <div className="d-flex align-items-center">
                  {' '}
                  <i className="f-24 m-r-10 fab fa-cloudsmith text-c-green" />
                  ARK{' '}
                </div>
              </li>
              <li className="list-group-item">
                <div className="float-right">341.22</div>
                <div className="d-flex align-items-center">
                  {' '}
                  <i className="f-24 m-r-10 fab fa-ethereum text-c-red" />
                  BTA{' '}
                </div>
              </li>
              <li className="list-group-item">
                <div className="float-right">241.68</div>
                <div className="d-flex align-items-center">
                  <i className="f-24 m-r-10 fab fa-asymmetrik text-c-blue" />
                  ETH
                </div>
              </li>
              <li className="list-group-item">
                <div className="float-right">113.05</div>
                <div className="d-flex align-items-center">
                  {' '}
                  <i className="f-24 m-r-10 fab fa-cloudsmith text-c-green" />
                  NEO{' '}
                </div>
              </li>
              <li className="list-group-item">
                <div className="float-right">341.22</div>
                <div className="d-flex align-items-center">
                  {' '}
                  <i className="f-24 m-r-10 fab fa-ethereum text-c-red" />
                  XMR{' '}
                </div>
              </li>
              <li className="list-group-item border-bottom-0">
                <div className="float-right">241.68</div>
                <div className="d-flex align-items-center">
                  <i className="f-24 m-r-10 fab fa-asymmetrik text-c-blue" />
                  XRP
                </div>
              </li>
            </ul>
          </Card>
        </Col>
        <Col xl={9} lg={12}>
          <Card>
            <Card.Header>
              <h5>Trading Chart </h5>
            </Card.Header>
            <Card.Body>
              <Chart {...lineChart} />
            </Card.Body>
          </Card>
          <Deposit />
          <Withdraw />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Trading;
