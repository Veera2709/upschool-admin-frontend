import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Tab, Nav } from 'react-bootstrap';
import BasicDetails from './scopes/BasicDetails';
import Education from './scopes/Education';
import Address from './scopes/Address';
import Employment from './scopes/Employment';
import DatabaseCheck from './scopes/DatabaseCheck';
import DrugTest from './scopes/DrugTest';
import CreditCheck from './scopes/CreditCheck';
import Criminal from './scopes/Criminal';
import Identification from './scopes/Identification';
import Reference from './scopes/Reference';
import GapVerification from './scopes/GapVerification';
import SocialMedia from './scopes/SocialMedia';
import PoliceVerification from './scopes/PoliceVerification';
import CompanyCheck from './scopes/CompanyCheck';
import DirectorshipCheck from './scopes/DirectorshipCheck';
import CvValidation from './scopes/CvValidation';
import CaseVerifiers from './scopes/verifier-details/CaseVerifiers';
import CibilCheck from './scopes/CibilCheck';

import { fetchComponents } from './bgv-api/fetchComponents';
import dynamicUrl from '../../../helper/dynamicUrls';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import MESSAGES from '../../../helper/messages';
import { componentNames } from '../../../util/names';
import { isEmptyObject } from '../../../util/utils';
import { defaultPostApi, fetchCaseCompDetails } from './bgv-api/BgvApi';
import { caseDetailsActionTemp } from '../../../store/caseDetailsAction';

const ComponentVerticalTabs = ({ user_client_id, newUpload }) => {
  const dispatch = useDispatch();
  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  const [stepData, setStepData] = useState([]);
  console.log('stepData', stepData);

  const { case_id } = useParams();

  const _fetchCaseComponents = async () => {
    console.log('fetchCaseComponents called');

    if (sessionStorage.getItem('user_category') === 'Operation Team') {
      let payload = {
        data: {
          case_id: case_id
        }
      };
      const opsComponents = await defaultPostApi(dynamicUrl.fetchOperationalUserComponent, payload);
      if (opsComponents.Error) {
        sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.ComponentFetching });
      } else {
        console.log('opsComponents', opsComponents.data);
        if (opsComponents.data) {
          let testData = opsComponents.data;
          testData.unshift('BasicDetails');
          console.log('testdata', testData);
          console.log('testdata Length', testData.length);

          setStepData(testData);
        } else {
          console.log('No components found');
        }
      }
    } else {
      const clientComponents = await fetchComponents(dynamicUrl.fetchClientComponent, user_client_id);
      if (clientComponents.Error) {
        sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.ComponentFetching });
      } else {
        console.log('clientComponents', clientComponents.data);
        if (clientComponents.data) {
          let testData = clientComponents.data;
          // testData.unshift("Identification");
          testData.unshift('BasicDetails');
          console.log('testdata', testData);
          console.log('testdata Length', testData.length);
          setStepData(testData);
        } else {
          console.log('No components found');
        }
      }
    }
  };

  useEffect(() => {
    _fetchCaseComponents();
  }, []);

  return isEmptyObject(stepData) ? null : (
    <>
      {!newUpload && user_client_id && sessionStorage.getItem('user_category') !== 'Operation Team' && (
        <CaseVerifiers case_id={case_id} client_components={stepData} />
      )}
      <Card>
        <Card.Header>
          <Card.Title as="h5">Case BGV</Card.Title>
        </Card.Header>
        <Card.Body>
          <Tab.Container defaultActiveKey="BasicDetails">
            <Row>
              <Col sm={2}>
                <Nav variant="pills" className="flex-column">
                  {stepData.map((ele, i) => {
                    return (
                      <>
                        <Nav.Item
                          key={i}
                          onClick={() => {
                            dispatch(caseDetailsActionTemp());
                          }}
                        >
                          <Nav.Link eventKey={ele}>{componentNames[ele]}</Nav.Link>
                        </Nav.Item>
                      </>
                    );
                  })}
                  {/* <Nav.Item>
                    <Nav.Link eventKey="Education">EDUCATION</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Address">ADDRESS</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="CompanyCheck">COMPANY CHECK</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Criminal">CRIMINAL</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="CreditCheck">CREDIT CHECK</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="CvValidation">CV VALIDATION</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="DatabaseCheck">DATABASE CHECK</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="DirectorshipCheck">DIRECTORSHIP CHECK</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="DrugTest">DRUG TEST</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Employment">EMPLOYMENT</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="GapVerification">GAP VERIFICATION</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Identification">IDENTIFICATION</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="PoliceVerification">POLICE VERIFICATION</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Reference">REFERENCE</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="SocialMedia">SOCIAL MEDIA</Nav.Link>
                  </Nav.Item> */}
                </Nav>
              </Col>
              <Col sm={1}></Col>
              <Col sm={8}>
                <Tab.Content>
                  {stepData.map((ele) => {
                    switch (ele) {
                      case 'BasicDetails':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <BasicDetails newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'Identification':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <Identification newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'Education':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <Education newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'Address':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <Address newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'Employment':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <Employment newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'CreditCheck':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <CreditCheck newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'CibilCheck':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <CibilCheck newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'Criminal':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <Criminal newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'DatabaseCheck':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <DatabaseCheck newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'DrugTest':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <DrugTest newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'Reference':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <Reference newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'GapVerification':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <GapVerification newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'SocialMedia':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <SocialMedia newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'PoliceVerification':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <PoliceVerification newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'CompanyCheck':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <CompanyCheck newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'DirectorshipCheck':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <DirectorshipCheck newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      case 'CvValidation':
                        return (
                          <>
                            <Tab.Pane eventKey={ele}>
                              <CvValidation newUpload={newUpload} />
                            </Tab.Pane>
                          </>
                        );

                      default:
                        break;
                    }
                    return null;
                  })}
                  {/* <Tab.Pane eventKey="BasicDetails">
                    <BasicDetails />
                  </Tab.Pane>
                  <Tab.Pane eventKey="Education">
                    <Education />
                  </Tab.Pane>
                  <Tab.Pane eventKey="Address">
                    <Address />
                  </Tab.Pane>
                  <Tab.Pane eventKey="CompanyCheck">
                    <CompanyCheck />
                  </Tab.Pane>
                  <Tab.Pane eventKey="Criminal">
                    <Criminal />
                  </Tab.Pane>
                  <Tab.Pane eventKey="CreditCheck">
                    <CreditCheck />
                  </Tab.Pane>
                  <Tab.Pane eventKey="CvValidation">
                    <CvValidation />
                  </Tab.Pane>
                  <Tab.Pane eventKey="DatabaseCheck">
                    <DatabaseCheck />
                  </Tab.Pane>
                  <Tab.Pane eventKey="DirectorshipCheck">
                    <DirectorshipCheck />
                  </Tab.Pane>
                  <Tab.Pane eventKey="DrugTest">
                    <DrugTest />
                  </Tab.Pane>
                  <Tab.Pane eventKey="Employment">
                    <Employment />
                  </Tab.Pane>
                  <Tab.Pane eventKey="GapVerification">
                    <GapVerification />
                  </Tab.Pane>
                  <Tab.Pane eventKey="Identification">
                    <Identification />
                  </Tab.Pane>
                  <Tab.Pane eventKey="PoliceVerification">
                    <PoliceVerification />
                  </Tab.Pane>
                  <Tab.Pane eventKey="Reference">
                    <Reference />
                  </Tab.Pane>
                  <Tab.Pane eventKey="SocialMedia">
                    <SocialMedia />
                  </Tab.Pane> */}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Card.Body>
      </Card>
    </>
  );
};

export default ComponentVerticalTabs;
