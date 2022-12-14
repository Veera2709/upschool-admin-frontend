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
import { isEmptyObject } from '../../../../../util/utils';
import { areFilesInvalid } from '../../../../../util/utils';

import { evidenceUploadStatusOptions, evidenceUploadStatusOptionsArray } from '../../../../../helper/selectOptions';
import useFullPageLoader from '../../../../../helper/useFullPageLoader';

const CriminalBgv = ({ className, rest, criminalData, reloadData }) => {
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

  const _sendCriminalVerification = async (data) => {
    let apiUrl = dynamicUrl.uploadEvidenceUrl;
    console.log(apiUrl, data, 'Criminal', case_id);

    const bgvResponse = await bgvApi(apiUrl, data, 'Criminal', case_id);
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
          componentStatus: criminalData === 'N.A.' ? '' : criminalData.componentStatus,
          statusDescription: criminalData === 'N.A.' ? '' : criminalData.statusDescription,
          currAddressCompletedDate:
            criminalData === 'N.A.' || isEmptyObject(criminalData.addressEvidence)
              ? ''
              : criminalData.addressEvidence.currAddressCompletedDate,
          permAddressCompletedDate:
            criminalData === 'N.A.' || isEmptyObject(criminalData.addressEvidence)
              ? ''
              : criminalData.addressEvidence.permAddressCompletedDate,
          currentAddressEvidence: '',
          permanentAddressEvidence: ''
        }}
        validationSchema={Yup.object().shape({
          currAddressCompletedDate: Yup.string(),
          permAddressCompletedDate: Yup.string().required(Constants.VerificationCommon.CompletedDateRequired),
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

          let combinedValues = {
            addressEvidence: {
              currAddressCompletedDate: values.currAddressCompletedDate,
              permAddressCompletedDate: values.permAddressCompletedDate,
              currentAddressEvidence: values.currentAddressEvidence,
              permanentAddressEvidence: values.permanentAddressEvidence
            },
            componentStatus: values.componentStatus,
            statusDescription: values.statusDescription
          };

          console.log(values);

          if (values.currentAddressEvidence === '')
            combinedValues.addressEvidence.currentAddressEvidence = criminalData.addressEvidence.currentAddressEvidence
              ? criminalData.addressEvidence.currentAddressEvidence
              : '';
          if (values.permanentAddressEvidence === '')
            combinedValues.addressEvidence.permanentAddressEvidence = criminalData.addressEvidence.permanentAddressEvidence
              ? criminalData.addressEvidence.permanentAddressEvidence
              : '';

          // file present or not
          let filePresent = document.getElementById('permanentAddressEvidence').files[0];
          if (
            (!filePresent && !combinedValues.addressEvidence.permanentAddressEvidence) ||
            combinedValues.addressEvidence.permanentAddressEvidence === ''
          ) {
            sweetAlertHandler(bgvAlerts.noFilesPresent);
            hideLoader();
          } else {
            let allFilesData = [];
            const fileNameArray = ['currentAddressEvidence', 'permanentAddressEvidence'];

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
              _sendCriminalVerification(combinedValues);
            } else {
              if (areFilesInvalid(allFilesData) !== 0) {
                sweetAlertHandler(bgvAlerts.invalidFilesPresent);
              } else {
                _sendCriminalVerification(combinedValues);
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
                        onClick={() => setAccordionKey(accordionKey !== 2 ? 2 : 0)}
                        aria-controls="accordion2"
                        aria-expanded={accordionKey === 2}
                      >
                        Permanent Address
                      </Link>
                    </Card.Title>
                  </Card.Header>
                  <Collapse in={accordionKey === 2}>
                    <div id="accordion2">
                      <Card.Body>
                        <Row>
                          <Col sm={6}>
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
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Permanent Address Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.permanentAddressEvidence && errors.permanentAddressEvidence}
                                  name="permanentAddressEvidence"
                                  id="permanentAddressEvidence"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.permanentAddressEvidence}
                                />
                                {criminalData !== 'N.A.' &&
                                criminalData.addressEvidence.permanentAddressEvidence &&
                                criminalData.addressEvidence.permanentAddressEvidenceURL !== '' ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a
                                      href={criminalData.addressEvidence.permanentAddressEvidenceURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.permanentAddressEvidence && errors.permanentAddressEvidence && (
                                  <small className="text-danger form-text">{errors.permanentAddressEvidence}</small>
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
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Current Address Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.currentAddressEvidence && errors.currentAddressEvidence}
                                  name="currentAddressEvidence"
                                  id="currentAddressEvidence"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.currentAddressEvidence}
                                />
                                {criminalData !== 'N.A.' &&
                                criminalData.addressEvidence.currentAddressEvidence &&
                                criminalData.addressEvidence.currentAddressEvidenceURL !== '' ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a
                                      href={criminalData.addressEvidence.currentAddressEvidenceURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.currentAddressEvidence && errors.currentAddressEvidence && (
                                  <small className="text-danger form-text">{errors.currentAddressEvidence}</small>
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

export default CriminalBgv;
