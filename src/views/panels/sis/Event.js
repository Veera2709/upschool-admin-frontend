import React from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';

import interview from '../../../assets/images/pages/interview.svg';
import festival from '../../../assets/images/pages/festival.svg';
import baseball from '../../../assets/images/pages/baseball.svg';

const Event = () => {
  return (
    <React.Fragment>
      <Row className="btn-page">
        <Col sm={12}>
          <Card>
            <Card.Header>
              <h5>Event</h5>
            </Card.Header>
          </Card>
        </Col>

        <Col lg={4} md={6} sm={12}>
          <Card>
            <Card.Body>
              <div className="text-center">
                <img src={interview} alt="event" className="img-fluid wid-100 mb-2" />
                <h5>
                  Ivaculus infotech & solutions <br />
                  <span className="my-2 badge badge-success">Placement</span>
                </h5>
              </div>
              <Table responsive size="sm" className="able-sm mb-0">
                <tbody>
                  <tr>
                    <th>Location</th>
                    <td> : Mumbai</td>
                  </tr>
                  <tr>
                    <th>Result</th>
                    <td> : 60% Minimum</td>
                  </tr>
                  <tr>
                    <th>Stipend</th>
                    <td> : Max 10000</td>
                  </tr>
                  <tr>
                    <th>Package</th>
                    <td> : 2.5 Lacs</td>
                  </tr>
                  <tr>
                    <th>Requirement</th>
                    <td className="text-wrap"> : 30 Android Developer</td>
                  </tr>
                  <tr>
                    <th>Organized By</th>
                    <td> : IIRC</td>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <td className="text-wrap"> : 06/11/2016 to 06/11/2016</td>
                  </tr>
                  <tr>
                    <th>Attachment</th>
                    <td className="text-wrap"> : 29 IVACULUS INFOTECH.pdf</td>
                  </tr>
                </tbody>
              </Table>
              <button className="btn btn-primary mr-2">Interested</button>
              <button className="btn btn-danger mt-md-0 mt-2">Not Interested</button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Card>
            <Card.Body>
              <div className="text-center">
                <img src={festival} alt="event" className="img-fluid wid-100 mb-2" />
                <h5>
                  Echo Green Arts <br />
                  <span className="my-2 badge badge-danger">Festival</span>
                </h5>
              </div>
              <Table responsive size="sm" className="able-sm mb-0">
                <tbody>
                  <tr>
                    <th>Location</th>
                    <td> : Thane</td>
                  </tr>
                  <tr>
                    <th>Result</th>
                    <td> : 60% Minimum</td>
                  </tr>
                  <tr>
                    <th>Stipend</th>
                    <td> : Max 10000</td>
                  </tr>
                  <tr>
                    <th>Package</th>
                    <td> : 2.5 Lacs</td>
                  </tr>
                  <tr>
                    <th>Requirement</th>
                    <td className="text-wrap"> : min age 15</td>
                  </tr>
                  <tr>
                    <th>Organized By</th>
                    <td> : BSCSB</td>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <td className="text-wrap"> : 06/11/2016 to 06/11/2016</td>
                  </tr>
                  <tr>
                    <th>Attachment</th>
                    <td className="text-wrap"> : 29 Rules &amp; Regulation.pdf</td>
                  </tr>
                </tbody>
              </Table>
              <button className="btn btn-primary mr-2">Participate</button>
              <button className="btn btn-danger mt-md-0 mt-2">Not Interested</button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Card>
            <Card.Body>
              <div className="text-center">
                <img src={baseball} alt="event" className="img-fluid wid-100 mb-2" />
                <h5>
                  Globle Sports Day <br />
                  <span className="my-2 badge badge-warning">Sports</span>
                </h5>
              </div>
              <Table responsive size="sm" className="able-sm mb-0">
                <tbody>
                  <tr>
                    <th>Location</th>
                    <td> : Mumbai</td>
                  </tr>
                  <tr>
                    <th>Result</th>
                    <td> : 60% Minimum</td>
                  </tr>
                  <tr>
                    <th>Stipend</th>
                    <td> : Max 10000</td>
                  </tr>
                  <tr>
                    <th>Package</th>
                    <td> : 2.5 Lacs</td>
                  </tr>
                  <tr>
                    <th>Requirement</th>
                    <td className="text-wrap"> : 30 Android Developer</td>
                  </tr>
                  <tr>
                    <th>Organized By</th>
                    <td> : IIRC</td>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <td className="text-wrap"> : 06/11/2016 to 06/11/2016</td>
                  </tr>
                  <tr>
                    <th>Attachment</th>
                    <td className="text-wrap"> : 29 IVACULUS INFOTECH.pdf</td>
                  </tr>
                </tbody>
              </Table>
              <button className="btn btn-primary mr-2">Participate</button>
              <button className="btn btn-danger mt-md-0 mt-2">Not Interested</button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Card>
            <Card.Body>
              <div className="text-center">
                <img src={festival} alt="event" className="img-fluid wid-100 mb-2" />
                <h5>
                  Echo Green Arts <br />
                  <span className="my-2 badge badge-danger">Festival</span>
                </h5>
              </div>
              <Table responsive size="sm" className="able-sm mb-0">
                <tbody>
                  <tr>
                    <th>Location</th>
                    <td> : Thane</td>
                  </tr>
                  <tr>
                    <th>Result</th>
                    <td> : 60% Minimum</td>
                  </tr>
                  <tr>
                    <th>Stipend</th>
                    <td> : Max 10000</td>
                  </tr>
                  <tr>
                    <th>Package</th>
                    <td> : 2.5 Lacs</td>
                  </tr>
                  <tr>
                    <th>Requirement</th>
                    <td className="text-wrap"> : min age 15</td>
                  </tr>
                  <tr>
                    <th>Organized By</th>
                    <td> : BSCSB</td>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <td className="text-wrap"> : 06/11/2016 to 06/11/2016</td>
                  </tr>
                  <tr>
                    <th>Attachment</th>
                    <td className="text-wrap"> : 29 Rules &amp; Regulation.pdf</td>
                  </tr>
                </tbody>
              </Table>
              <button className="btn btn-primary mr-2">Participate</button>
              <button className="btn btn-danger mt-md-0 mt-2">Not Interested</button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Card>
            <Card.Body>
              <div className="text-center">
                <img src={baseball} alt="event" className="img-fluid wid-100 mb-2" />
                <h5>
                  Globle Sports Day <br />
                  <span className="my-2 badge badge-warning">Sports</span>
                </h5>
              </div>
              <Table responsive size="sm" className="able-sm mb-0">
                <tbody>
                  <tr>
                    <th>Location</th>
                    <td> : Mumbai</td>
                  </tr>
                  <tr>
                    <th>Result</th>
                    <td> : 60% Minimum</td>
                  </tr>
                  <tr>
                    <th>Stipend</th>
                    <td> : Max 10000</td>
                  </tr>
                  <tr>
                    <th>Package</th>
                    <td> : 2.5 Lacs</td>
                  </tr>
                  <tr>
                    <th>Requirement</th>
                    <td className="text-wrap"> : 30 Android Developer</td>
                  </tr>
                  <tr>
                    <th>Organized By</th>
                    <td> : IIRC</td>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <td className="text-wrap"> : 06/11/2016 to 06/11/2016</td>
                  </tr>
                  <tr>
                    <th>Attachment</th>
                    <td className="text-wrap"> : 29 IVACULUS INFOTECH.pdf</td>
                  </tr>
                </tbody>
              </Table>
              <button className="btn btn-primary mr-2">Participate</button>
              <button className="btn btn-danger mt-md-0 mt-2">Not Interested</button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Card>
            <Card.Body>
              <div className="text-center">
                <img src={interview} alt="event" className="img-fluid wid-100 mb-2" />
                <h5>
                  Ivaculus infotech & solutions <br />
                  <span className="my-2 badge badge-success">Placement</span>
                </h5>
              </div>
              <Table responsive size="sm" className="able-sm mb-0">
                <tbody>
                  <tr>
                    <th>Location</th>
                    <td> : Mumbai</td>
                  </tr>
                  <tr>
                    <th>Result</th>
                    <td> : 60% Minimum</td>
                  </tr>
                  <tr>
                    <th>Stipend</th>
                    <td> : Max 10000</td>
                  </tr>
                  <tr>
                    <th>Package</th>
                    <td> : 2.5 Lacs</td>
                  </tr>
                  <tr>
                    <th>Requirement</th>
                    <td className="text-wrap"> : 30 Android Developer</td>
                  </tr>
                  <tr>
                    <th>Organized By</th>
                    <td> : IIRC</td>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <td className="text-wrap"> : 06/11/2016 to 06/11/2016</td>
                  </tr>
                  <tr>
                    <th>Attachment</th>
                    <td className="text-wrap"> : 29 IVACULUS INFOTECH.pdf</td>
                  </tr>
                </tbody>
              </Table>
              <button className="btn btn-primary mr-2">Interested</button>
              <button className="btn btn-danger mt-md-0 mt-2">Not Interested</button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Event;
