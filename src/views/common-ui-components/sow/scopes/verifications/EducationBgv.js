import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, Collapse, Modal, Alert } from 'react-bootstrap';
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
import { DropzoneComponent } from 'react-dropzone-component';
import { useForm } from 'react-hook-form';

import { evidenceUploadStatusOptions, evidenceUploadStatusOptionsArray } from '../../../../../helper/selectOptions';
import useFullPageLoader from '../../../../../helper/useFullPageLoader';
import InitiateEmail from '../verification-email';

const EducationBgv = ({ className, rest, educationData, reloadData }) => {
  let { case_id } = useParams();
  const [accordionKey, setAccordionKey] = useState(1);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [isEmailModalOne, setIsEmailModalOne] = useState(false);
  const [isEmailModalTwo, setIsEmailModalTwo] = useState(false);
  const [isEmailModalThree, setIsEmailModalThree] = useState(false);
  const [componentName, setComponentName] = useState('');

  const { register, handleSubmit } = useForm();

  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  const djsConfig = {
    addRemoveLinks: true,
    acceptedFiles: 'image/jpeg,image/png,image/gif',
    autoProcessQueue: false,
    uploadprogress: 100
  };

  const config = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: true,
    postUrl: '/sendAttachment'
  };

  const eventHandlers = (file) => {
    // init: (dz) => (this.dropzone = dz), console.log(file);
  };

  const _sendEducationVerification = async (data) => {
    let apiUrl = dynamicUrl.uploadEvidenceUrl;

    console.log(apiUrl, data, 'Education', case_id);

    const bgvResponse = await bgvApi(apiUrl, data, 'Education', case_id);
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
          componentStatus: educationData === 'N.A.' || isEmptyObject(educationData) ? '' : educationData.componentStatus,
          statusDescription: educationData === 'N.A.' || isEmptyObject(educationData) ? '' : educationData.statusDescription,
          educationRemarks1:
            educationData === 'N.A.' || isEmptyObject(educationData.educationEvidenceOne)
              ? ''
              : educationData.educationEvidenceOne.educationRemarks,
          educationEvidence1: '',
          educationRemarks2:
            educationData === 'N.A.' || isEmptyObject(educationData.educationEvidenceTwo)
              ? ''
              : educationData.educationEvidenceTwo.educationRemarks,
          educationEvidence2: '',
          educationRemarks3:
            educationData === 'N.A.' || isEmptyObject(educationData.educationEvidenceThree)
              ? ''
              : educationData.educationEvidenceThree.educationRemarks,
          educationEvidence3: ''
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
            educationEvidenceOne: {
              educationRemarks: values.educationRemarks1,
              educationEvidence: values.educationEvidence1
            },
            educationEvidenceTwo: {
              educationRemarks: values.educationRemarks2,
              educationEvidence: values.educationEvidence2
            },
            educationEvidenceThree: {
              educationRemarks: values.educationRemarks3,
              educationEvidence: values.educationEvidence3
            },
            componentStatus: values.componentStatus,
            statusDescription: values.statusDescription
          };

          if (values.educationEvidence1 === '')
            educationData.educationEvidenceOne.educationEvidence
              ? (combinedValues.educationEvidenceOne.educationEvidence = educationData.educationEvidenceOne.educationEvidence)
              : (combinedValues.educationEvidenceOne = {});
          if (values.educationEvidence2 === '')
            educationData.educationEvidenceTwo.educationEvidence
              ? (combinedValues.educationEvidenceTwo.educationEvidence = educationData.educationEvidenceTwo.educationEvidence)
              : (combinedValues.educationEvidenceTwo = {});
          if (values.educationEvidence3 === '')
            educationData.educationEvidenceThree.educationEvidence
              ? (combinedValues.educationEvidenceThree.educationEvidence = educationData.educationEvidenceThree.educationEvidence)
              : (combinedValues.educationEvidenceThree = {});

          console.log(combinedValues);

          // file present or not
          let filePresent = document.getElementById('educationEvidence1').files[0];
          if (
            (!filePresent && !combinedValues.educationEvidenceOne.educationEvidence) ||
            combinedValues.educationEvidenceOne.educationEvidence === ''
          ) {
            sweetAlertHandler(bgvAlerts.noFilesPresent);
            hideLoader();
          } else {
            let allFilesData = [];
            const fileNameArray = ['educationEvidence1', 'educationEvidence2', 'educationEvidence3'];

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
              _sendEducationVerification(combinedValues);
            } else {
              if (areFilesInvalid(allFilesData) !== 0) {
                sweetAlertHandler(bgvAlerts.invalidFilesPresent);
              } else {
                _sendEducationVerification(combinedValues);
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
                        Education Verification #1
                      </Link>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                          setComponentName('Education1');
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
                                    error={touched.educationRemarks1 && errors.educationRemarks1}
                                    name="educationRemarks1"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.educationRemarks1}
                                    rows="8"
                                  />
                                  {touched.educationRemarks1 && errors.educationRemarks1 && (
                                    <small className="text-danger form-text">{errors.educationRemarks1}</small>
                                  )}
                                </Col>
                              </Row>
                            </Col>
                            <Col sm={6}>
                              <Row className="my-3">
                                <Col sm={3}>
                                  <label>Education Evidence</label>
                                </Col>
                                <Col sm={9}>
                                  <input
                                    className="form-control"
                                    error={touched.educationEvidence1 && errors.educationEvidence1}
                                    name="educationEvidence1"
                                    id="educationEvidence1"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="file"
                                    value={values.educationEvidence1}
                                  />
                                  {educationData !== 'N.A.' &&
                                  educationData.educationEvidenceOne.educationEvidence !== '' &&
                                  educationData.educationEvidenceOne.educationEvidenceURL ? (
                                    <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                      <a
                                        href={educationData.educationEvidenceOne.educationEvidenceURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View
                                      </a>
                                    </small>
                                  ) : (
                                    <small className="text-warning form-text">No file uploaded yet</small>
                                  )}
                                  {touched.educationEvidence1 && errors.educationEvidence1 && (
                                    <small className="text-danger form-text">{errors.educationEvidence1}</small>
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
                        Education Verification #2
                      </Link>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                          setComponentName('Education2');
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
                                  error={touched.educationRemarks2 && errors.educationRemarks2}
                                  name="educationRemarks2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.educationRemarks2}
                                  rows="8"
                                />
                                {touched.educationRemarks2 && errors.educationRemarks2 && (
                                  <small className="text-danger form-text">{errors.educationRemarks2}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Education Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.educationEvidence2 && errors.educationEvidence2}
                                  name="educationEvidence2"
                                  id="educationEvidence2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.educationEvidence2}
                                />
                                {educationData !== 'N.A.' &&
                                educationData.educationEvidenceTwo.educationEvidence !== '' &&
                                educationData.educationEvidenceTwo.educationEvidenceURL ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a
                                      href={educationData.educationEvidenceTwo.educationEvidenceURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.educationEvidence2 && errors.educationEvidence2 && (
                                  <small className="text-danger form-text">{errors.educationEvidence2}</small>
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
                        Education Verification #3
                      </Link>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                          setComponentName('Education3');
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
                                  error={touched.educationRemarks3 && errors.educationRemarks3}
                                  name="educationRemarks3"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.educationRemarks3}
                                  rows="8"
                                />
                                {touched.educationRemarks3 && errors.educationRemarks3 && (
                                  <small className="text-danger form-text">{errors.educationRemarks3}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Education Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.educationEvidence3 && errors.educationEvidence3}
                                  name="educationEvidence3"
                                  id="educationEvidence3"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.educationEvidence3}
                                />
                                {educationData !== 'N.A.' &&
                                educationData.educationEvidenceThree.educationEvidence !== '' &&
                                educationData.educationEvidenceThree.educationEvidenceURL ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a
                                      href={educationData.educationEvidenceThree.educationEvidenceURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.educationEvidence3 && errors.educationEvidence3 && (
                                  <small className="text-danger form-text">{errors.educationEvidence3}</small>
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

export default EducationBgv;
