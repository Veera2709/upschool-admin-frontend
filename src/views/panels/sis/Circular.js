import React from 'react';
import { Row, Col, Card, Table, Tab, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Circular = () => {
  return (
    <React.Fragment>
      <Row className="btn-page">
        <Col sm={12}>
          <Card>
            <Card.Header>
              <div className="nav nav-pills" role="tablist">
                <Link to="#" className="nav-link active">
                  2018 - 19
                </Link>
                <Link to="#" className="nav-link">
                  2017 - 18
                </Link>
                <Link to="#" className="nav-link">
                  2016 - 17
                </Link>
                <Link to="#" className="nav-link">
                  2015 - 16
                </Link>
                <Link to="#" className="nav-link">
                  2014 - 15
                </Link>
                <Link to="#" className="nav-link">
                  2013 - 14
                </Link>
                <Link to="#" className="nav-link">
                  2012 - 13
                </Link>
                <Link to="#" className="nav-link">
                  2011 - 12
                </Link>
              </div>
            </Card.Header>
          </Card>
        </Col>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <h5>CIRCULAR : 2018-19 </h5>
            </Card.Header>
            <Card.Body>
              <Tab.Container id="left-tabs-example" defaultActiveKey="gn">
                <Row>
                  <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="gn">General Notices</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="en">Exam Notices</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="sn">Seat No</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="sa">Seating Arrangement</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="fr">Results</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col sm={9}>
                    <Tab.Content>
                      <Tab.Pane eventKey="gn">
                        <h5>General Notices : 2018-19</h5>
                        <hr />
                        <Table bordered responsive>
                          <tbody>
                            <tr>
                              <th>Date</th>
                              <th>Description</th>
                            </tr>
                            <tr>
                              <td>20/05/2019</td>
                              <td>
                                <Link to="#">Ph D Fee Notice 2019-20</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>02/05/2019</td>
                              <td>
                                <Link to="#">09-2019 - Time Duration for Exit Application</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>25/04/2019</td>
                              <td>
                                <Link to="#">FEE NOTICE for 1st Term Academic Year 2019-20</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>19/02/2019</td>
                              <td>
                                <Link to="#">35-2019 Revised rules and Regulation for usage of Auditurium etc.</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>14/02/2019</td>
                              <td>
                                <Link to="#">36-2019 B.U.Patel Scholarship Scheme 2018-19</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>08/01/2019</td>
                              <td>
                                <Link to="#">Ph. D. Fee Extension Notice</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>11/12/2018</td>
                              <td>
                                <Link to="#">Fees Notice for (4, 6, 8, 10 Sem) 2018-19</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>25/10/2018</td>
                              <td>
                                <Link to="#">2nd Term Fees Notice</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>05/10/2018</td>
                              <td>
                                <Link to="#"> Electroal Literacy Club</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>11/09/2018</td>
                              <td>
                                <Link to="#"> Circular - 03-2018 Migration Certificates</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>06/09/2018</td>
                              <td>
                                <Link to="#"> 19/2018, Appointment of I/c. Director Management (SRIMCA)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>31/08/2018</td>
                              <td>
                                <Link to="#">1st Term MBNC Fees Notice</Link>
                              </td>
                            </tr>
                            <tr>
                              <td rowSpan="6">28/08/2018</td>
                              <td>
                                <Link to="#">Literary Club</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Media and Press Club</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Music Club</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Theater Club</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Dance Club</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Community Social service Club</Link>
                              </td>
                            </tr>
                            <tr>
                              <td rowSpan="9">09/08/2018</td>
                              <td>
                                <Link to="#">International Collaboration Cell</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Entrepreneurship Development & Startup Cell</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Anti-Ragging</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Committee Against Sexual Harassment</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Grievance Redressal Committee</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Women Cell</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Academic Development Cell</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Data Collection Committee</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Training & Placement Cell </Link>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Tab.Pane>
                      <Tab.Pane eventKey="en">
                        <h5>Exam Notices : 2018-19</h5>
                        <hr />
                        <Table bordered responsive>
                          <tbody>
                            <tr>
                              <th>Date</th>
                              <th>Description</th>
                            </tr>
                            <tr>
                              <td>30/07/2019</td>
                              <td>
                                <Link to="#">Internal CIE Improvement Application Date Extended 3 Aug 2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>22/07/2019</td>
                              <td>
                                <Link to="#">Re Assessment-Result-Summer-2019-Examination</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>15/07/2019</td>
                              <td>
                                <Link to="#">Schedule of Winter 2019 Examination</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>03/07/2019</td>
                              <td>
                                <Link to="#">Re Assessment Result - Diploma Programmes - Summer 2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>25/06/2019</td>
                              <td>
                                <Link to="#">Re Checking Result - Round-III - Summer 2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td rowSpan="2">24/06/2019</td>
                              <td>
                                <Link to="#">ReChecking Round-1-Result Notification-Summer2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">ReChecking Round-2-Result Notification-Summer2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>21/06/2019</td>
                              <td>
                                <Link to="#">Re Checking - Round-III - 24 June 2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>20/06/2019</td>
                              <td>
                                <h5>OVERALL STUDENT DETAIN LIST</h5>
                                <Table bordered responsive>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <Link to="#">B. Arch</Link>
                                      </td>
                                      <td>
                                        <Link to="#">B. Des.</Link>
                                      </td>
                                      <td>
                                        <Link to="#">B.C.A (Hons)</Link>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Link to="#">B.Com</Link>
                                      </td>
                                      <td>
                                        <Link to="#">B.I.D</Link>
                                      </td>
                                      <td>
                                        <Link to="#">B.Pharm</Link>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Link to="#">B.Sc. (Chemistry)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">B.Sc. (Microbiology)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">B.Tech (Automobile)</Link>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Link to="#">B.Tech (Chemical)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">B.Tech (Civil)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">B.Tech (EC)</Link>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Link to="#">B.Tech (ICT)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">B.Tech (IT)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">B.Tech (Mechanical)</Link>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Link to="#">BBA</Link>
                                      </td>
                                      <td>
                                        <Link to="#">BCA (Honors)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">BCA</Link>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Link to="#">Diploma (CE)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">Diploma (Chemical)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">Diploma (Civil)</Link>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Link to="#">Diploma (IT)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">Diploma (ME)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">Integrated M.Sc. (Biotechnology)</Link>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Link to="#">Integrated M.Sc. (IT)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">Integrated M.Sc. (Mathematics)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">Integrated M.Sc. (Microbiology)</Link>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Link to="#">M. Com</Link>
                                      </td>
                                      <td>
                                        <Link to="#">M.Com (Integrated)</Link>
                                      </td>
                                      <td>
                                        <Link to="#">M.Sc. (Industrial Chemistry)</Link>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <Link to="#">MBA (Integrated)-OLD</Link>
                                      </td>
                                      <td>
                                        <Link to="#">MBA</Link>
                                      </td>
                                      <td>
                                        <Link to="#">MCA (Integrated)</Link>
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </td>
                            </tr>
                            <tr>
                              <td>14/06/2019</td>
                              <td>
                                <Link to="#">ReChecking Schedule Summer2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>04/06/2019</td>
                              <td>
                                <Link to="#">UFM Result Exam - Summer 2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>25/05/2019</td>
                              <td>
                                <Link to="#">UFM - Schedule - Summer 2019 Examination - 4 June 2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>30/04/2019</td>
                              <td>
                                <Link to="#">Online Exam Batch Details of Sem 6 UTU Common Subject Soft Skills on 1.5.2019.</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>25/04/2019</td>
                              <td>
                                <Link to="#">Exam Form Withdrawal - Phase 2 Exams - Summer 2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>15/04/2019</td>
                              <td>
                                <Link to="#">Exam Form Withdrawn - Summer 2019 - Phase1 - Examination</Link>
                              </td>
                            </tr>
                            <tr>
                              <td rowSpan="2">22/03/2019</td>
                              <td>
                                <Link to="#">Summer 2019 - Exam Form - Date-Extended-12-18 March 2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Summer 2019 - Exam Form-Date-Extended-19-25 March 2019 - With Penalty</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>01/03/2019</td>
                              <td>
                                <Link to="#">Exam Form Filling Schedule -Summer 2019 (1-11-March-2019)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>26/02/2019</td>
                              <td>
                                <Link to="#">Online Exam Form - Student Guidelines - Procedure</Link>
                              </td>
                            </tr>
                            <tr>
                              <td rowSpan="2">21/02/2019</td>
                              <td>
                                <Link to="#">Grade Change - Notification -Winter 2018</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Re Checking Result - Round 4 - Winter 2018 - Exam</Link>
                              </td>
                            </tr>
                            <tr>
                              <td rowSpan="3">16/02/2019</td>
                              <td>
                                <Link to="#">UFM - Result Notification -Winter 2018</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Re Checking - Round 3 - Result Notification - Winter 2018</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Re Checking Schedule - Round 4 - Winter 2018</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>11/02/2019</td>
                              <td>
                                <Link to="#">Re - Assessment - Result - Winter 2018</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>06/02/2019</td>
                              <td>
                                <Link to="#">Re Checking Schedule - Round 3 - 14 Feb 2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>24/01/2019</td>
                              <td>
                                <Link to="#">Summer 2019 - Examination Schedule</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>23/01/2019</td>
                              <td>
                                <Link to="#">Re Checking Round - 2 - Result Notification - 2018</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>16/01/2019</td>
                              <td>
                                <Link to="#">Re Checking Schedule - Round2- Winter2018-Exam - 21 Jan 2019</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>13/12/2018</td>
                              <td>
                                <Link to="#">17 December 18 - Winter18 - Exam-Centres-Student Notice</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>12/12/2018</td>
                              <td>
                                <Link to="#">Exam Form Withdrawn - Winter 2018 - Phase3</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>30/11/2018</td>
                              <td>
                                <Link to="#">UFM Result Winter 2018 Exam Phase 1-2</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>26/11/2018</td>
                              <td>
                                <Link to="#">Re Checking - Ph1-2 Winter 2018 Exam Result</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>22/11/2018</td>
                              <td>
                                <Link to="#">UFM - Meeting On - 27 Nov 2018 - Case-1 t o12</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>17/11/2018</td>
                              <td>
                                <Link to="#">Re Checking Schedule - Ph1 - Winter2018 Exam</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>29/10/2018</td>
                              <td>
                                <Link to="#">Re Schedule Online Exam BBA - BCom - BCom CA- I.MCom - Sem1 - 1 Nov 2018</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>17/10/2018</td>
                              <td>
                                <Link to="#">Exam Form Withdraw - Win2018 Exam-Phase2</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>15/09/2018</td>
                              <td>
                                <Link to="#">Winter 2018 Regular ATKT - Odd Sem Exam Form Filling Schedule</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>13/08/2018</td>
                              <td>
                                <Link to="#">Notice - Online Exam Fees - Date Exended-till- 19 Aug 2018</Link>
                              </td>
                            </tr>
                            <tr>
                              <td rowSpan="3">17/07/2018</td>
                              <td>
                                <Link to="#">Online Examination Form Filling Schedule - ATKT (AllCourses) and Nursing - Winter2018</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Online ExamForm - Student Guidelines - Procedure</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Examination Schedule - Winter2018</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>09/07/2018</td>
                              <td>
                                <Link to="#">Re Assessment Result Summer2018 - Examination</Link>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Tab.Pane>
                      <Tab.Pane eventKey="sn">
                        <h5>Student Seat No</h5>
                        <hr />
                        <Table bordered responsive size="sm">
                          <tbody>
                            <tr>
                              <td>
                                <Link to="#">B. Arch</Link>
                              </td>
                              <td>
                                <Link to="#">B. Des.</Link>
                              </td>
                              <td>
                                <Link to="#">B.C.A (Hons)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">B.Com</Link>
                              </td>
                              <td>
                                <Link to="#">B.I.D</Link>
                              </td>
                              <td>
                                <Link to="#">B.Pharm</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">B.Sc. (Chemistry)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Sc. (Microbiology)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (Automobile)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">B.Tech (Chemical)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (Civil)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (EC)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">B.Tech (ICT)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (IT)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (Mechanical)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">BBA</Link>
                              </td>
                              <td>
                                <Link to="#">BCA (Honors)</Link>
                              </td>
                              <td>
                                <Link to="#">BCA</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Diploma (CE)</Link>
                              </td>
                              <td>
                                <Link to="#">Diploma (Chemical)</Link>
                              </td>
                              <td>
                                <Link to="#">Diploma (Civil)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Diploma (IT)</Link>
                              </td>
                              <td>
                                <Link to="#">Diploma (ME)</Link>
                              </td>
                              <td>
                                <Link to="#">Integrated M.Sc. (Biotechnology)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Integrated M.Sc. (IT)</Link>
                              </td>
                              <td>
                                <Link to="#">Integrated M.Sc. (Mathematics)</Link>
                              </td>
                              <td>
                                <Link to="#">Integrated M.Sc. (Microbiology)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">M. Com</Link>
                              </td>
                              <td>
                                <Link to="#">M.Com (Integrated)</Link>
                              </td>
                              <td>
                                <Link to="#">M.Sc. (Industrial Chemistry)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">MBA (Integrated)-OLD</Link>
                              </td>
                              <td>
                                <Link to="#">MBA</Link>
                              </td>
                              <td>
                                <Link to="#">MCA (Integrated)</Link>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Tab.Pane>
                      <Tab.Pane eventKey="sa">
                        <h5>Seating Arrangement</h5>
                        <hr />
                        <Table bordered responsive size="sm">
                          <tbody>
                            <tr>
                              <td>
                                <Link to="#">B. Arch</Link>
                              </td>
                              <td>
                                <Link to="#">B. Des.</Link>
                              </td>
                              <td>
                                <Link to="#">B.C.A (Hons)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">B.Com</Link>
                              </td>
                              <td>
                                <Link to="#">B.I.D</Link>
                              </td>
                              <td>
                                <Link to="#">B.Pharm</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">B.Sc. (Chemistry)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Sc. (Microbiology)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (Automobile)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">B.Tech (Chemical)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (Civil)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (EC)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">B.Tech (ICT)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (IT)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (Mechanical)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">BBA</Link>
                              </td>
                              <td>
                                <Link to="#">BCA (Honors)</Link>
                              </td>
                              <td>
                                <Link to="#">BCA</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Diploma (CE)</Link>
                              </td>
                              <td>
                                <Link to="#">Diploma (Chemical)</Link>
                              </td>
                              <td>
                                <Link to="#">Diploma (Civil)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Diploma (IT)</Link>
                              </td>
                              <td>
                                <Link to="#">Diploma (ME)</Link>
                              </td>
                              <td>
                                <Link to="#">Integrated M.Sc. (Biotechnology)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Integrated M.Sc. (IT)</Link>
                              </td>
                              <td>
                                <Link to="#">Integrated M.Sc. (Mathematics)</Link>
                              </td>
                              <td>
                                <Link to="#">Integrated M.Sc. (Microbiology)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">M. Com</Link>
                              </td>
                              <td>
                                <Link to="#">M.Com (Integrated)</Link>
                              </td>
                              <td>
                                <Link to="#">M.Sc. (Industrial Chemistry)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">MBA (Integrated)-OLD</Link>
                              </td>
                              <td>
                                <Link to="#">MBA</Link>
                              </td>
                              <td>
                                <Link to="#">MCA (Integrated)</Link>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Tab.Pane>
                      <Tab.Pane eventKey="fr">
                        <h5>Student Result</h5>
                        <hr />
                        <Table bordered responsive size="sm">
                          <tbody>
                            <tr>
                              <td>
                                <Link to="#">B. Arch</Link>
                              </td>
                              <td>
                                <Link to="#">B. Des.</Link>
                              </td>
                              <td>
                                <Link to="#">B.C.A (Hons)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">B.Com</Link>
                              </td>
                              <td>
                                <Link to="#">B.I.D</Link>
                              </td>
                              <td>
                                <Link to="#">B.Pharm</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">B.Sc. (Chemistry)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Sc. (Microbiology)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (Automobile)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">B.Tech (Chemical)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (Civil)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (EC)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">B.Tech (ICT)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (IT)</Link>
                              </td>
                              <td>
                                <Link to="#">B.Tech (Mechanical)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">BBA</Link>
                              </td>
                              <td>
                                <Link to="#">BCA (Honors)</Link>
                              </td>
                              <td>
                                <Link to="#">BCA</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Diploma (CE)</Link>
                              </td>
                              <td>
                                <Link to="#">Diploma (Chemical)</Link>
                              </td>
                              <td>
                                <Link to="#">Diploma (Civil)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Diploma (IT)</Link>
                              </td>
                              <td>
                                <Link to="#">Diploma (ME)</Link>
                              </td>
                              <td>
                                <Link to="#">Integrated M.Sc. (Biotechnology)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">Integrated M.Sc. (IT)</Link>
                              </td>
                              <td>
                                <Link to="#">Integrated M.Sc. (Mathematics)</Link>
                              </td>
                              <td>
                                <Link to="#">Integrated M.Sc. (Microbiology)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">M. Com</Link>
                              </td>
                              <td>
                                <Link to="#">M.Com (Integrated)</Link>
                              </td>
                              <td>
                                <Link to="#">M.Sc. (Industrial Chemistry)</Link>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Link to="#">MBA (Integrated)-OLD</Link>
                              </td>
                              <td>
                                <Link to="#">MBA</Link>
                              </td>
                              <td>
                                <Link to="#">MCA (Integrated)</Link>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Circular;
