import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
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

const IdentificationBgv = ({ className, rest, idCheckData, reloadData }) => {
  let { case_id } = useParams();
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  const _sendIdVerification = async (data) => {
    let apiUrl = dynamicUrl.uploadEvidenceUrl;

    console.log(apiUrl, data, 'Identification', case_id);

    const bgvResponse = await bgvApi(apiUrl, data, 'Identification', case_id);
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
          componentStatus: idCheckData === 'N.A.' ? '' : idCheckData.componentStatus,
          statusDescription: idCheckData === 'N.A.' ? '' : idCheckData.statusDescription,
          aadharEvidence: '',
          panEvidence: '',
          voterIdEvidence: '',
          passportEvidence: '',
          drivingLicenceEvidence: '',
          rcBookEvidence: ''
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

          let combinedValues = {
            identificationEvidence: {
              aadharEvidence: values.aadharEvidence,
              panEvidence: values.panEvidence,
              voterIdEvidence: values.voterIdEvidence,
              passportEvidence: values.passportEvidence,
              drivingLicenceEvidence: values.drivingLicenceEvidence,
              rcBookEvidence: values.rcBookEvidence
            },
            componentStatus: values.componentStatus,
            statusDescription: values.statusDescription
          };

          if (values.aadharEvidence === '')
            combinedValues.identificationEvidence.aadharEvidence = idCheckData.identificationEvidence.aadharEvidence
              ? idCheckData.identificationEvidence.aadharEvidence
              : '';
          if (values.panEvidence === '')
            combinedValues.identificationEvidence.panEvidence = idCheckData.identificationEvidence.panEvidence
              ? idCheckData.identificationEvidence.panEvidence
              : '';
          if (values.voterIdEvidence === '')
            combinedValues.identificationEvidence.voterIdEvidence = idCheckData.identificationEvidence.voterIdEvidence
              ? idCheckData.identificationEvidence.voterIdEvidence
              : '';
          if (values.passportEvidence === '')
            combinedValues.identificationEvidence.passportEvidence = idCheckData.identificationEvidence.passportEvidence
              ? idCheckData.identificationEvidence.passportEvidence
              : '';
          if (values.drivingLicenceEvidence === '')
            combinedValues.identificationEvidence.drivingLicenceEvidence = idCheckData.identificationEvidence.drivingLicenceEvidence
              ? idCheckData.identificationEvidence.drivingLicenceEvidence
              : '';
          if (values.rcBookEvidence === '')
            combinedValues.identificationEvidence.rcBookEvidence = idCheckData.identificationEvidence.rcBookEvidence
              ? idCheckData.identificationEvidence.rcBookEvidence
              : '';

          // file present or not
          let filePresentAadhar = document.getElementById('aadharEvidence').files[0];
          let filePresentPan = document.getElementById('panEvidence').files[0];
          if (
            (!filePresentAadhar && !combinedValues.identificationEvidence.aadharEvidence) ||
            combinedValues.identificationEvidence.aadharEvidence === '' ||
            (!filePresentPan && !combinedValues.identificationEvidence.panEvidence) ||
            combinedValues.identificationEvidence.panEvidence === ''
          ) {
            sweetAlertHandler(bgvAlerts.noFilesPresent);
            hideLoader();
          } else {
            let allFilesData = [];
            const fileNameArray = [
              'aadharEvidence',
              'panEvidence',
              'voterIdEvidence',
              'passportEvidence',
              'drivingLicenceEvidence',
              'rcBookEvidence'
            ];

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
              _sendIdVerification(combinedValues);
            } else {
              if (areFilesInvalid(allFilesData) !== 0) {
                sweetAlertHandler(bgvAlerts.invalidFilesPresent);
                hideLoader();
              } else {
                _sendIdVerification(combinedValues);
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

                <Row className="my-3">
                  <Col sm={3}>
                    <label>Aadhar Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.aadharEvidence && errors.aadharEvidence}
                      name="aadharEvidence"
                      id="aadharEvidence"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.aadharEvidence}
                    />
                    {idCheckData !== 'N.A.' &&
                    idCheckData.identificationEvidence.aadharEvidence !== '' &&
                    idCheckData.identificationEvidence.aadharEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a href={idCheckData.identificationEvidence.aadharEvidenceURL} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.aadharEvidence && errors.aadharEvidence && (
                      <small className="text-danger form-text">{errors.aadharEvidence}</small>
                    )}
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={3}>
                    <label>Pan Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.panEvidence && errors.panEvidence}
                      name="panEvidence"
                      id="panEvidence"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.panEvidence}
                    />
                    {idCheckData !== 'N.A.' &&
                    idCheckData.identificationEvidence.panEvidence !== '' &&
                    idCheckData.identificationEvidence.panEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a href={idCheckData.identificationEvidence.panEvidenceURL} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.panEvidence && errors.panEvidence && <small className="text-danger form-text">{errors.panEvidence}</small>}
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={3}>
                    <label>Passport Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.passportEvidence && errors.passportEvidence}
                      name="passportEvidence"
                      id="passportEvidence"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.passportEvidence}
                    />
                    {idCheckData !== 'N.A.' &&
                    idCheckData.identificationEvidence.passportEvidence !== '' &&
                    idCheckData.identificationEvidence.passportEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a href={idCheckData.identificationEvidence.passportEvidenceURL} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.passportEvidence && errors.passportEvidence && (
                      <small className="text-danger form-text">{errors.passportEvidence}</small>
                    )}
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={3}>
                    <label>Driving License Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.drivingLicenceEvidence && errors.drivingLicenceEvidence}
                      name="drivingLicenceEvidence"
                      id="drivingLicenceEvidence"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.drivingLicenceEvidence}
                    />
                    {idCheckData !== 'N.A.' &&
                    idCheckData.identificationEvidence.drivingLicenceEvidence !== '' &&
                    idCheckData.identificationEvidence.drivingLicenceEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a href={idCheckData.identificationEvidence.drivingLicenceEvidenceURL} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.drivingLicenceEvidence && errors.drivingLicenceEvidence && (
                      <small className="text-danger form-text">{errors.drivingLicenceEvidence}</small>
                    )}
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={3}>
                    <label>Voter Id Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.voterIdEvidence && errors.voterIdEvidence}
                      name="voterIdEvidence"
                      id="voterIdEvidence"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.voterIdEvidence}
                    />
                    {idCheckData !== 'N.A.' &&
                    idCheckData.identificationEvidence.voterIdEvidence !== '' &&
                    idCheckData.identificationEvidence.voterIdEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a href={idCheckData.identificationEvidence.voterIdEvidenceURL} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.voterIdEvidence && errors.voterIdEvidence && (
                      <small className="text-danger form-text">{errors.voterIdEvidence}</small>
                    )}
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={3}>
                    <label>RC Book Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.rcBookEvidence && errors.rcBookEvidence}
                      name="rcBookEvidence"
                      id="rcBookEvidence"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.rcBookEvidence}
                    />
                    {idCheckData !== 'N.A.' &&
                    idCheckData.identificationEvidence.rcBookEvidence !== '' &&
                    idCheckData.identificationEvidence.rcBookEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a href={idCheckData.identificationEvidence.rcBookEvidenceURL} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.rcBookEvidence && errors.rcBookEvidence && (
                      <small className="text-danger form-text">{errors.rcBookEvidence}</small>
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

export default IdentificationBgv;
