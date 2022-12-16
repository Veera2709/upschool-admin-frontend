import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, Collapse } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import * as Constants from '../../../../../helper/constants';
import { bgvStatus, bgvStatusValues } from '../../bgv-api/dbMapping';
import { bgvApi } from '../../bgv-api/BgvApi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { statusArray } from '../../../../../util/names';
import dynamicUrl from '../../../../../helper/dynamicUrls';
import { bgvAlerts } from '../../bgv-api/bgvAlerts';
import { isEmptyObject, areFilesInvalid } from '../../../../../util/utils';

import { evidenceUploadStatusOptions, evidenceUploadStatusOptionsArray } from '../../../../../helper/selectOptions';
import useFullPageLoader from '../../../../../helper/useFullPageLoader';

const AddressBgv = ({ className, rest, addressData, reloadData }) => {
  let { case_id } = useParams();
  const [accordionKey, setAccordionKey] = useState(1);
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  const _sendAddressVerification = async (data) => {
    let apiUrl = dynamicUrl.uploadEvidenceUrl;

    console.log(apiUrl, data, 'Address', case_id);

    const bgvResponse = await bgvApi(apiUrl, data, 'Address', case_id);
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
          currAddressRemarks:
            addressData === 'N.A.' || isEmptyObject(addressData.currentAddressEvidence) ? '' : addressData.currentAddressEvidence.remarks,
          evidenceFile1: '',
          currAddressRespondantName:
            addressData === 'N.A.' || isEmptyObject(addressData.currentAddressEvidence)
              ? ''
              : addressData.currentAddressEvidence.respondantName,
          currAddressCompletedDate:
            addressData === 'N.A.' || isEmptyObject(addressData.currentAddressEvidence)
              ? ''
              : addressData.currentAddressEvidence.completedDate,

          permAddressRemarks:
            addressData === 'N.A.' || isEmptyObject(addressData.permanentAddressEvidence)
              ? ''
              : addressData.permanentAddressEvidence.remarks,
          evidenceFile2: '',
          permAddressRespondantName:
            addressData === 'N.A.' || isEmptyObject(addressData.permanentAddressEvidence)
              ? ''
              : addressData.permanentAddressEvidence.respondantName,
          permAddressCompletedDate:
            addressData === 'N.A.' || isEmptyObject(addressData.permanentAddressEvidence)
              ? ''
              : addressData.permanentAddressEvidence.completedDate,

          interAddressRemarks1:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressOneEvidence)
              ? ''
              : addressData.intermediateAddressOneEvidence.remarks,
          evidenceFile3: '',
          interAddressRespondantName1:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressOneEvidence)
              ? ''
              : addressData.intermediateAddressOneEvidence.respondantName,
          interAddressCompletedDate1:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressOneEvidence)
              ? ''
              : addressData.intermediateAddressOneEvidence.completedDate,

          interAddressRemarks2:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressTwoEvidence)
              ? ''
              : addressData.intermediateAddressTwoEvidence.remarks,
          evidenceFile4: '',
          interAddressRespondantName2:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressTwoEvidence)
              ? ''
              : addressData.intermediateAddressTwoEvidence.respondantName,
          interAddressCompletedDate2:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressTwoEvidence)
              ? ''
              : addressData.intermediateAddressTwoEvidence.completedDate,

          statusDescription: addressData === 'N.A.' || isEmptyObject(addressData) ? '' : addressData.statusDescription,
          componentStatus: addressData === 'N.A.' || isEmptyObject(addressData) ? '' : addressData.componentStatus
        }}
        validationSchema={Yup.object().shape({
          currAddressRemarks: Yup.string()
            .min(2, Constants.VerificationCommon.RemarkTooShort)
            .max(200, Constants.VerificationCommon.RemarkTooLong)
            .required(Constants.VerificationCommon.RemarkRequired),
          currAddressRespondantName: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.VerificationCommon.RespondentNameInvalid)
            .min(2, Constants.VerificationCommon.RespondentNameTooShort)
            .max(50, Constants.VerificationCommon.RespondentNameTooLong)
            .required(Constants.VerificationCommon.RespondentNameRequired),
          currAddressCompletedDate: Yup.string().required(Constants.VerificationCommon.CompletedDateRequired),
          permAddressRemarks: Yup.string()
            .min(2, Constants.VerificationCommon.RemarkTooShort)
            .max(200, Constants.VerificationCommon.RemarkTooLong)
            .required(Constants.VerificationCommon.RemarkRequired),
          permAddressRespondantName: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.VerificationCommon.RespondentNameInvalid)
            .min(2, Constants.VerificationCommon.RespondentNameTooShort)
            .max(50, Constants.VerificationCommon.RespondentNameTooLong)
            .required(Constants.VerificationCommon.RespondentNameRequired),
          permAddressCompletedDate: Yup.string().required(Constants.VerificationCommon.CompletedDateRequired),
          interAddressRemarks1: Yup.string()
            .min(2, Constants.VerificationCommon.RemarkTooShort)
            .max(200, Constants.VerificationCommon.RemarkTooLong),
          interAddressRespondantName1: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.VerificationCommon.RespondentNameInvalid)
            .min(2, Constants.VerificationCommon.RespondentNameTooShort)
            .max(50, Constants.VerificationCommon.RespondentNameTooLong),
          interAddressCompletedDate1: Yup.string(),
          interAddressRemarks2: Yup.string()
            .min(2, Constants.VerificationCommon.RemarkTooShort)
            .max(200, Constants.VerificationCommon.RemarkTooLong),
          interAddressRespondantName2: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.VerificationCommon.RespondentNameInvalid)
            .min(2, Constants.VerificationCommon.RespondentNameTooShort)
            .max(50, Constants.VerificationCommon.RespondentNameTooLong),
          interAddressCompletedDate2: Yup.string(),
          statusDescription: Yup.string()
            .min(2, Constants.VerificationCommon.StatusDescriptionTooShort)
            .max(200, Constants.VerificationCommon.StatusDescriptionTooLong)
            .required(Constants.VerificationCommon.StatusDescriptionRequired),
          componentStatus: Yup.string()
            .min(0, Constants.VerificationCommon.InvalidDefault)
            .oneOf(evidenceUploadStatusOptionsArray, Constants.VerificationCommon.InvalidDefault)
            .required(Constants.VerificationCommon.ChangeStatusRequired)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          showLoader();
          console.log(values);
          console.log('Submitting');

          const combinedValues = {
            currentAddressEvidence: {
              remarks: values.currAddressRemarks,
              evidenceFile: values.evidenceFile1,
              respondantName: values.currAddressRespondantName,
              completedDate: values.currAddressCompletedDate
            },
            permanentAddressEvidence: {
              remarks: values.permAddressRemarks,
              evidenceFile: values.evidenceFile2,
              respondantName: values.permAddressRespondantName,
              completedDate: values.permAddressCompletedDate
            },
            intermediateAddressOneEvidence: {
              remarks: values.interAddressRemarks1,
              evidenceFile: values.evidenceFile3,
              respondantName: values.interAddressRespondantName1,
              completedDate: values.interAddressCompletedDate1
            },
            intermediateAddressTwoEvidence: {
              remarks: values.interAddressRemarks2,
              evidenceFile: values.evidenceFile4,
              respondantName: values.interAddressRespondantName2,
              completedDate: values.interAddressCompletedDate2
            },
            statusDescription: values.statusDescription,
            componentStatus: values.componentStatus
          };

          if (values.evidenceFile1 === '')
            addressData.currentAddressEvidence.evidenceFile
              ? (combinedValues.currentAddressEvidence.evidenceFile = addressData.currentAddressEvidence.evidenceFile)
              : (combinedValues.currentAddressEvidence = {});
          if (values.evidenceFile2 === '')
            addressData.permanentAddressEvidence.evidenceFile
              ? (combinedValues.permanentAddressEvidence.evidenceFile = addressData.permanentAddressEvidence.evidenceFile)
              : (combinedValues.permanentAddressEvidence = {});
          if (values.evidenceFile3 === '')
            addressData.intermediateAddressOneEvidence.evidenceFile
              ? (combinedValues.intermediateAddressOneEvidence.evidenceFile = addressData.intermediateAddressOneEvidence.evidenceFile)
              : (combinedValues.intermediateAddressOneEvidence = {});
          if (values.evidenceFile4 === '')
            addressData.intermediateAddressTwoEvidence.evidenceFile
              ? (combinedValues.intermediateAddressTwoEvidence.evidenceFile = addressData.intermediateAddressTwoEvidence.evidenceFile)
              : (combinedValues.intermediateAddressTwoEvidence = {});

          console.log(combinedValues);

          let filePresent = document.getElementById('evidenceFile1').files[0];
          if (
            (!filePresent && !combinedValues.currentAddressEvidence.evidenceFile) ||
            combinedValues.currentAddressEvidence.evidenceFile === ''
          ) {
            sweetAlertHandler(bgvAlerts.noFilesPresent);
            hideLoader();
          } else {
            let allFilesData = [];
            const fileNameArray = ['evidenceFile1', 'evidenceFile2', 'evidenceFile3', 'evidenceFile4'];

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
              _sendAddressVerification(combinedValues);
            } else {
              if (areFilesInvalid(allFilesData) !== 0) {
                sweetAlertHandler(bgvAlerts.invalidFilesPresent);
              } else {
                _sendAddressVerification(combinedValues);
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
                        Current Address
                      </Link>
                    </Card.Title>
                  </Card.Header>
                  <Collapse in={accordionKey === 1}>
                    <div id="accordion1">
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
                                  error={touched.currAddressRemarks && errors.currAddressRemarks}
                                  name="currAddressRemarks"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.currAddressRemarks}
                                  rows="8"
                                />
                                {touched.currAddressRemarks && errors.currAddressRemarks && (
                                  <small className="text-danger form-text">{errors.currAddressRemarks}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Current Address Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.evidenceFile1 && errors.evidenceFile1}
                                  name="evidenceFile1"
                                  id="evidenceFile1"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.evidenceFile1}
                                />
                                {addressData !== 'N.A.' &&
                                addressData.currentAddressEvidence.evidenceFile !== '' &&
                                addressData.currentAddressEvidence.evidenceFileURL ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a href={addressData.currentAddressEvidence.evidenceFileURL} target="_blank" rel="noopener noreferrer">
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.evidenceFile1 && errors.evidenceFile1 && (
                                  <small className="text-danger form-text">{errors.evidenceFile1}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Respondant Name</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.currAddressRespondantName && errors.currAddressRespondantName}
                                  name="currAddressRespondantName"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.currAddressRespondantName}
                                />
                                {touched.currAddressRespondantName && errors.currAddressRespondantName && (
                                  <small className="text-danger form-text">{errors.currAddressRespondantName}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Completed Date</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.currAddressCompletedDate && errors.currAddressCompletedDate}
                                  name="currAddressCompletedDate"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="date"
                                  value={values.currAddressCompletedDate}
                                />
                                {touched.currAddressCompletedDate && errors.currAddressCompletedDate && (
                                  <small className="text-danger form-text">{errors.currAddressCompletedDate}</small>
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
                        onClick={() => setAccordionKey(accordionKey !== 2 ? 2 : 0)}
                        aria-controls="accordion1"
                        aria-expanded={accordionKey === 2}
                      >
                        Permanent Address
                      </Link>
                    </Card.Title>
                  </Card.Header>
                  <Collapse in={accordionKey === 2}>
                    <div id="accordion1">
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
                                  error={touched.permAddressRemarks && errors.permAddressRemarks}
                                  name="permAddressRemarks"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.permAddressRemarks}
                                  rows="8"
                                />
                                {touched.permAddressRemarks && errors.permAddressRemarks && (
                                  <small className="text-danger form-text">{errors.permAddressRemarks}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Permanent Address Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.evidenceFile2 && errors.evidenceFile2}
                                  name="evidenceFile2"
                                  id="evidenceFile2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.evidenceFile2}
                                />
                                {addressData !== 'N.A.' &&
                                addressData.permanentAddressEvidence.evidenceFile !== '' &&
                                addressData.permanentAddressEvidence.evidenceFileURL ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a
                                      href={addressData.permanentAddressEvidence.evidenceFileURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.evidenceFile2 && errors.evidenceFile2 && (
                                  <small className="text-danger form-text">{errors.evidenceFile2}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Respondant Name</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.permAddressRespondantName && errors.permAddressRespondantName}
                                  name="permAddressRespondantName"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.permAddressRespondantName}
                                />
                                {touched.permAddressRespondantName && errors.permAddressRespondantName && (
                                  <small className="text-danger form-text">{errors.permAddressRespondantName}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Completed Date</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.permAddressCompletedDate && errors.permAddressCompletedDate}
                                  name="permAddressCompletedDate"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="date"
                                  value={values.permAddressCompletedDate}
                                />
                                {touched.permAddressCompletedDate && errors.permAddressCompletedDate && (
                                  <small className="text-danger form-text">{errors.permAddressCompletedDate}</small>
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
                        aria-controls="accordion1"
                        aria-expanded={accordionKey === 3}
                      >
                        Intermediate Address #1
                      </Link>
                    </Card.Title>
                  </Card.Header>
                  <Collapse in={accordionKey === 3}>
                    <div id="accordion1">
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
                                  error={touched.interAddressRemarks1 && errors.interAddressRemarks1}
                                  name="interAddressRemarks1"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.interAddressRemarks1}
                                  rows="8"
                                />
                                {touched.interAddressRemarks1 && errors.interAddressRemarks1 && (
                                  <small className="text-danger form-text">{errors.interAddressRemarks1}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Intermediate Address 1 Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.evidenceFile3 && errors.evidenceFile3}
                                  name="evidenceFile3"
                                  id="evidenceFile3"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.evidenceFile3}
                                />
                                {addressData !== 'N.A.' &&
                                addressData.intermediateAddressOneEvidence.evidenceFile !== '' &&
                                addressData.intermediateAddressOneEvidence.evidenceFileURL ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a
                                      href={addressData.intermediateAddressOneEvidence.evidenceFileURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.evidenceFile3 && errors.evidenceFile3 && (
                                  <small className="text-danger form-text">{errors.evidenceFile3}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Respondant Name</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.interAddressRespondantName1 && errors.interAddressRespondantName1}
                                  name="interAddressRespondantName1"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.interAddressRespondantName1}
                                />
                                {touched.interAddressRespondantName1 && errors.interAddressRespondantName1 && (
                                  <small className="text-danger form-text">{errors.interAddressRespondantName1}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Completed Date</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.interAddressCompletedDate1 && errors.interAddressCompletedDate1}
                                  name="interAddressCompletedDate1"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="date"
                                  value={values.interAddressCompletedDate1}
                                />
                                {touched.interAddressCompletedDate1 && errors.interAddressCompletedDate1 && (
                                  <small className="text-danger form-text">{errors.interAddressCompletedDate1}</small>
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
                        onClick={() => setAccordionKey(accordionKey !== 4 ? 4 : 0)}
                        aria-controls="accordion2"
                        aria-expanded={accordionKey === 4}
                      >
                        Intermediate Address #2
                      </Link>
                    </Card.Title>
                  </Card.Header>
                  <Collapse in={accordionKey === 4}>
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
                                  error={touched.interAddressRemarks2 && errors.interAddressRemarks2}
                                  name="interAddressRemarks2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.interAddressRemarks2}
                                  rows="8"
                                />
                                {touched.interAddressRemarks2 && errors.interAddressRemarks2 && (
                                  <small className="text-danger form-text">{errors.interAddressRemarks2}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Intermediate Address 2 Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.evidenceFile4 && errors.evidenceFile4}
                                  name="evidenceFile4"
                                  id="evidenceFile4"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.evidenceFile4}
                                />
                                {addressData !== 'N.A.' &&
                                addressData.intermediateAddressTwoEvidence.evidenceFile !== '' &&
                                addressData.intermediateAddressTwoEvidence.evidenceFileURL ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a
                                      href={addressData.intermediateAddressTwoEvidence.evidenceFileURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.evidenceFile4 && errors.evidenceFile4 && (
                                  <small className="text-danger form-text">{errors.evidenceFile4}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Respondant Name</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.interAddressRespondantName2 && errors.interAddressRespondantName2}
                                  name="interAddressRespondantName2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.interAddressRespondantName2}
                                />
                                {touched.interAddressRespondantName2 && errors.interAddressRespondantName2 && (
                                  <small className="text-danger form-text">{errors.interAddressRespondantName2}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Completed Date</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.interAddressCompletedDate2 && errors.interAddressCompletedDate2}
                                  name="interAddressCompletedDate2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="date"
                                  value={values.interAddressCompletedDate2}
                                />
                                {touched.interAddressCompletedDate2 && errors.interAddressCompletedDate2 && (
                                  <small className="text-danger form-text">{errors.interAddressCompletedDate2}</small>
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

            <hr />
            <br />

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

export default AddressBgv;
