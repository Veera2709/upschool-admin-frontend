import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, Collapse, Modal } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import * as Constants from '../../../../../helper/constants';
import { bgvStatus, bgvStatusValues } from '../../bgv-api/dbMapping';
import { bgvApi, defaultPostApi } from '../../bgv-api/BgvApi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { statusArray } from '../../../../../util/names';
import dynamicUrl from '../../../../../helper/dynamicUrls';
import { bgvAlerts } from '../../bgv-api/bgvAlerts';
import { isEmptyObject } from '../../../../../util/utils';
import { areFilesInvalid } from '../../../../../util/utils';

import { evidenceUploadStatusOptions, evidenceUploadStatusOptionsArray } from '../../../../../helper/selectOptions';
import useFullPageLoader from '../../../../../helper/useFullPageLoader';
import InitiateEmail from '../verification-email';

const EmploymentBgv = ({ className, rest, employmentData, reloadData }) => {
  let { case_id } = useParams();
  const [accordionKey, setAccordionKey] = useState(1);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [isEmailModalOne, setIsEmailModalOne] = useState(false);
  const [isEmailModalTwo, setIsEmailModalTwo] = useState(false);
  const [isEmailModalThree, setIsEmailModalThree] = useState(false);
  const [componentName, setComponentName] = useState('');

  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  const _sendEmploymentVerification = async (data) => {
    let apiUrl = dynamicUrl.uploadEvidenceUrl;

    console.log(apiUrl, data, 'Employment', case_id);

    const bgvResponse = await bgvApi(apiUrl, data, 'Employment', case_id);
    console.log('bgv Response', bgvResponse);

    if (bgvResponse.Error) {
      sweetAlertHandler(bgvAlerts.verificationFailed);
      hideLoader();
    } else {
      let uploadParams = bgvResponse.data;

      if (Array.isArray(uploadParams)) {
        for (let index = 0; index < uploadParams.length; index++) {
          let keyNameArr = Object.keys(uploadParams[index]);
          let keyName = keyNameArr[0];
          console.log('KeyName', keyName);

          let blobField = document.getElementById(keyName).files[0];
          console.log({
            blobField
          });

          let tempObj = uploadParams[index];

          let result = await fetch(tempObj[keyName], {
            method: 'PUT',
            body: blobField
          });

          console.log({
            result
          });
        }
        sweetAlertHandler(bgvAlerts.verificationSuccess);
        reloadData();
        hideLoader();
      } else {
        console.log('No files uploaded');
        sweetAlertHandler(bgvAlerts.verificationSuccess);
        reloadData();
        hideLoader();
      }
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          componentStatus: employmentData === 'N.A.' ? '' : employmentData.componentStatus,
          statusDescription: employmentData === 'N.A.' ? '' : employmentData.statusDescription,
          employmentRemarks1:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentEvidenceOne)
              ? ''
              : employmentData.employmentEvidenceOne.employmentRemarks,
          employmentRemarks2:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentEvidenceTwo)
              ? ''
              : employmentData.employmentEvidenceTwo.employmentRemarks,
          employmentRemarks3:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentEvidenceThree)
              ? ''
              : employmentData.employmentEvidenceThree.employmentRemarks,
          employmentEvidence1: '',
          employmentEvidence2: '',
          employmentEvidence3: ''
        }}
        validationSchema={Yup.object().shape({
          componentStatus: Yup.string()
            .min(0, Constants.VerificationCommon.InvalidDefault)
            .oneOf(evidenceUploadStatusOptionsArray, Constants.VerificationCommon.InvalidDefault)
            .required(Constants.VerificationCommon.ChangeStatusRequired),
          statusDescription: Yup.string()
            .min(2, Constants.VerificationCommon.StatusDescriptionTooShort)
            .max(200, Constants.VerificationCommon.StatusDescriptionTooLong)
            .required(Constants.VerificationCommon.StatusDescriptionRequired)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          showLoader();
          console.log(values);
          console.log('Submitting');

          const combinedValues = {
            employmentEvidenceOne: {
              employmentRemarks: values.employmentRemarks1,
              employmentEvidence: values.employmentEvidence1
            },
            employmentEvidenceTwo: {
              employmentRemarks: values.employmentRemarks2,
              employmentEvidence: values.employmentEvidence2
            },
            employmentEvidenceThree: {
              employmentRemarks: values.employmentRemarks3,
              employmentEvidence: values.employmentEvidence3
            },
            componentStatus: values.componentStatus,
            statusDescription: values.statusDescription
          };

          if (values.employmentEvidence1 === '')
            employmentData.employmentEvidenceOne.employmentEvidence
              ? (combinedValues.employmentEvidenceOne.employmentEvidence = employmentData.employmentEvidenceOne.employmentEvidence)
              : (combinedValues.employmentEvidenceOne = {});
          if (values.employmentEvidence2 === '')
            employmentData.employmentEvidenceTwo.employmentEvidence
              ? (combinedValues.employmentEvidenceTwo.employmentEvidence = employmentData.employmentEvidenceTwo.employmentEvidence)
              : (combinedValues.employmentEvidenceTwo = {});
          if (values.employmentEvidence3 === '')
            employmentData.employmentEvidenceThree.employmentEvidence
              ? (combinedValues.employmentEvidenceThree.employmentEvidence = employmentData.employmentEvidenceThree.employmentEvidence)
              : (combinedValues.employmentEvidenceThree = {});

          console.log(combinedValues);

          // file present or not
          let filePresent = document.getElementById('employmentEvidence1').files[0];
          if (
            (!filePresent && !combinedValues.employmentEvidenceOne.employmentEvidence) ||
            combinedValues.employmentEvidenceOne.employmentEvidence === ''
          ) {
            sweetAlertHandler(bgvAlerts.noFilesPresent);
            hideLoader();
          } else {
            let allFilesData = [];
            const fileNameArray = ['employmentEvidence1', 'employmentEvidence2', 'employmentEvidence3'];

            fileNameArray.forEach((fileName) => {
              let selectedFile = document.getElementById(fileName).files[0];
              console.log('File is here!');
              console.log(selectedFile);
              if (selectedFile) {
                allFilesData.push(selectedFile);
              }
            });

            console.log(allFilesData);

            if (allFilesData.length === 0) {
              _sendEmploymentVerification(combinedValues);
            } else {
              if (areFilesInvalid(allFilesData) !== 0) {
                sweetAlertHandler(bgvAlerts.invalidFilesPresent);
              } else {
                _sendEmploymentVerification(combinedValues);
              }
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <Row>
              <Col sm={12}>
                <br />
                <h5>Verification</h5>
                <hr />
              </Col>
            </Row>

            <Row>
              <Col sm={12} className="accordion">
                <Card className="mt-2">
                  <Card.Header>
                    <Card.Title as="h5">
                      <Link
                        to="#"
                        onClick={() => setAccordionKey(accordionKey !== 1 ? 1 : 0)}
                        aria-controls="accordion1"
                        aria-expanded={accordionKey === 1}
                      >
                        Employment Verification #1
                      </Link>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                          setComponentName('Employment1');
                          setIsEmailModalOne(true);
                        }}
                      >
                        Initiate Email
                      </Button>
                      <Modal centered show={isEmailModalOne} onHide={() => setIsEmailModalOne(false)}>
                        <Modal.Header closeButton>
                          <Modal.Title as="h5">Initiate Email</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <InitiateEmail componentName={componentName} />
                        </Modal.Body>
                      </Modal>
                    </Card.Title>
                  </Card.Header>
                  <Collapse in={accordionKey === 1}>
                    <div id="accordion1">
                      <Card.Body>
                        <Card.Text>
                          <Row>
                            <Col sm={6}>
                              <Row className="my-3">
                                <Col sm={3}>
                                  <label>Remarks</label>
                                </Col>
                                <Col sm={9}>
                                  <textarea
                                    className="form-control"
                                    error={touched.employmentRemarks1 && errors.employmentRemarks1}
                                    name="employmentRemarks1"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.employmentRemarks1}
                                    rows="8"
                                  />
                                  {touched.employmentRemarks1 && errors.employmentRemarks1 && (
                                    <small className="text-danger form-text">{errors.employmentRemarks1}</small>
                                  )}
                                </Col>
                              </Row>
                            </Col>
                            <Col sm={6}>
                              <Row className="my-3">
                                <Col sm={3}>
                                  <label>Employment Evidence</label>
                                </Col>
                                <Col sm={9}>
                                  <input
                                    className="form-control"
                                    error={touched.employmentEvidence1 && errors.employmentEvidence1}
                                    name="employmentEvidence1"
                                    id="employmentEvidence1"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="file"
                                    value={values.employmentEvidence1}
                                  />
                                  {employmentData !== 'N.A.' &&
                                  employmentData.employmentEvidenceOne.employmentEvidence !== '' &&
                                  employmentData.employmentEvidenceOne.employmentEvidenceURL ? (
                                    <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                      <a
                                        href={employmentData.employmentEvidenceOne.employmentEvidenceURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View
                                      </a>
                                    </small>
                                  ) : (
                                    <small className="text-warning form-text">No file uploaded yet</small>
                                  )}
                                  {touched.employmentEvidence1 && errors.employmentEvidence1 && (
                                    <small className="text-danger form-text">{errors.employmentEvidence1}</small>
                                  )}
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Card.Text>
                      </Card.Body>
                    </div>
                  </Collapse>
                </Card>
                <Card className="mt-2">
                  <Card.Header>
                    <Card.Title as="h5">
                      <Link
                        to="#"
                        onClick={() => setAccordionKey(accordionKey !== 2 ? 2 : 0)}
                        aria-controls="accordion2"
                        aria-expanded={accordionKey === 2}
                      >
                        Employment Verification #2
                      </Link>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                          setComponentName('Employment2');
                          setIsEmailModalTwo(true);
                        }}
                      >
                        Initiate Email
                      </Button>
                      <Modal centered show={isEmailModalTwo} onHide={() => setIsEmailModalTwo(false)}>
                        <Modal.Header closeButton>
                          <Modal.Title as="h5">Initiate Email</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <InitiateEmail componentName={componentName} />
                        </Modal.Body>
                      </Modal>
                    </Card.Title>
                  </Card.Header>
                  <Collapse in={accordionKey === 2}>
                    <div id="accordion2">
                      <Card.Body>
                        <Row>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Remarks</label>
                              </Col>
                              <Col sm={9}>
                                <textarea
                                  className="form-control"
                                  error={touched.employmentRemarks2 && errors.employmentRemarks2}
                                  name="employmentRemarks2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.employmentRemarks2}
                                  rows="8"
                                />
                                {touched.employmentRemarks2 && errors.employmentRemarks2 && (
                                  <small className="text-danger form-text">{errors.employmentRemarks2}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Employment Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.employmentEvidence2 && errors.employmentEvidence2}
                                  name="employmentEvidence2"
                                  id="employmentEvidence2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.employmentEvidence2}
                                />
                                {employmentData !== 'N.A.' &&
                                employmentData.employmentEvidenceTwo.employmentEvidence !== '' &&
                                employmentData.employmentEvidenceTwo.employmentEvidenceURL ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a
                                      href={employmentData.employmentEvidenceTwo.employmentEvidenceURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.employmentEvidence2 && errors.employmentEvidence2 && (
                                  <small className="text-danger form-text">{errors.employmentEvidence2}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Card.Body>
                    </div>
                  </Collapse>
                </Card>
                <Card className="mt-2">
                  <Card.Header>
                    <Card.Title as="h5">
                      <Link
                        to="#"
                        onClick={() => setAccordionKey(accordionKey !== 3 ? 3 : 0)}
                        aria-controls="accordion3"
                        aria-expanded={accordionKey === 3}
                      >
                        Employment Verification #3
                      </Link>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                          setComponentName('Employment3');
                          setIsEmailModalThree(true);
                        }}
                      >
                        Initiate Email
                      </Button>
                      <Modal centered show={isEmailModalThree} onHide={() => setIsEmailModalThree(false)}>
                        <Modal.Header closeButton>
                          <Modal.Title as="h5">Initiate Email</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <InitiateEmail componentName={componentName} />
                        </Modal.Body>
                      </Modal>
                    </Card.Title>
                  </Card.Header>
                  <Collapse in={accordionKey === 3}>
                    <div id="accordion3">
                      <Card.Body>
                        <Row>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Remarks</label>
                              </Col>
                              <Col sm={9}>
                                <textarea
                                  className="form-control"
                                  error={touched.employmentRemarks3 && errors.employmentRemarks3}
                                  name="employmentRemarks3"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.employmentRemarks3}
                                  rows="8"
                                />
                                {touched.employmentRemarks3 && errors.employmentRemarks3 && (
                                  <small className="text-danger form-text">{errors.employmentRemarks3}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Employment Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.employmentEvidence3 && errors.employmentEvidence3}
                                  name="employmentEvidence3"
                                  id="employmentEvidence3"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.employmentEvidence3}
                                />
                                {employmentData !== 'N.A.' &&
                                employmentData.employmentEvidenceThree.employmentEvidence !== '' &&
                                employmentData.employmentEvidenceThree.employmentEvidenceURL ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a
                                      href={employmentData.employmentEvidenceThree.employmentEvidenceURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.employmentEvidence3 && errors.employmentEvidence3 && (
                                  <small className="text-danger form-text">{errors.employmentEvidence3}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Card.Body>
                    </div>
                  </Collapse>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col sm={6}>
                <Row className="my-3">
                  <Col sm={3}>
                    <label>Verification Comment</label>
                  </Col>
                  <Col sm={9}>
                    <textarea
                      className="form-control"
                      error={touched.statusDescription && errors.statusDescription}
                      name="statusDescription"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.statusDescription}
                      rows="8"
                      placeholder="Enter your comment"
                    />
                    {touched.statusDescription && errors.statusDescription && (
                      <small className="text-danger form-text">{errors.statusDescription}</small>
                    )}
                  </Col>
                </Row>
              </Col>
              <Col sm={6}>
                <Row className="my-3">
                  <Col sm={3}>
                    <label>Change Status</label>
                  </Col>
                  <Col sm={9}>
                    <select
                      className="form-control"
                      error={touched.componentStatus && errors.componentStatus}
                      name="componentStatus"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.componentStatus}
                      id="componentStatus"
                      type="select"
                    >
                      {evidenceUploadStatusOptions.map((ele, i) => {
                        return (
                          <option key={i} value={ele.value}>
                            {ele.label}
                          </option>
                        );
                      })}
                    </select>
                    {touched.componentStatus && errors.componentStatus && (
                      <small className="text-danger form-text">{errors.componentStatus}</small>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* Submit button */}
            <Row className="my-3">
              <Col sm={4}></Col>
              <Col sm={4}>
                <Button className="btn-block" color="info" size="large" type="submit" variant="info">
                  Verify
                </Button>
              </Col>
              <Col sm={4}></Col>
            </Row>
          </form>
        )}
      </Formik>
      {loader}
    </>
  );
};

export default EmploymentBgv;
