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
import {
  evidenceUploadStatusOptions,
  evidenceUploadStatusOptionsArray,
  foundNotFoundOptions,
  foundNotFoundOptionsArray
} from '../../../../../helper/selectOptions';
import useFullPageLoader from '../../../../../helper/useFullPageLoader';

const DatabaseCheckBgv = ({ className, rest, databaseCheckData, reloadData }) => {
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

  const _sendDbVerification = async (data) => {
    let apiUrl = dynamicUrl.uploadEvidenceUrl;

    console.log(apiUrl, data, 'DatabaseCheck', case_id);

    const bgvResponse = await bgvApi(apiUrl, data, 'DatabaseCheck', case_id);
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
          componentStatus: databaseCheckData === 'N.A.' ? '' : databaseCheckData.componentStatus,
          statusDescription: databaseCheckData === 'N.A.' ? '' : databaseCheckData.statusDescription,

          indiaSpecific: isEmptyObject(databaseCheckData.dbVerificationEvidence)
            ? ''
            : databaseCheckData.dbVerificationEvidence.indiaSpecific,
          global: isEmptyObject(databaseCheckData.dbVerificationEvidence) ? '' : databaseCheckData.dbVerificationEvidence.global,
          webAndMedia: isEmptyObject(databaseCheckData.dbVerificationEvidence) ? '' : databaseCheckData.dbVerificationEvidence.webAndMedia,

          dbVerificationEvidenceFile: ''
        }}
        validationSchema={Yup.object().shape({
          indiaSpecific: Yup.string()
            .min(0, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .oneOf(foundNotFoundOptionsArray, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .required(Constants.VerificationCommon.CommonInvalidOptionRequired),
          global: Yup.string()
            .min(0, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .oneOf(foundNotFoundOptionsArray, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .required(Constants.VerificationCommon.CommonInvalidOptionRequired),
          webAndMedia: Yup.string()
            .min(0, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .oneOf(foundNotFoundOptionsArray, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .required(Constants.VerificationCommon.CommonInvalidOptionRequired),
          componentStatus: Yup.string()
            .min(0, Constants.VerificationCommon.StatusDescriptionInvalid)
            .oneOf(evidenceUploadStatusOptionsArray, Constants.VerificationCommon.StatusDescriptionInvalid)
            .required(Constants.VerificationCommon.StatusDescriptionRequired),
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
            dbVerificationEvidence: {
              indiaSpecific: values.indiaSpecific,
              global: values.global,
              webAndMedia: values.webAndMedia,
              dbVerificationEvidenceFile: values.dbVerificationEvidenceFile
            },
            componentStatus: values.componentStatus,
            statusDescription: values.statusDescription
          };

          if (values.dbVerificationEvidenceFile === '')
            combinedValues.dbVerificationEvidence.dbVerificationEvidenceFile =
              databaseCheckData.dbVerificationEvidence.dbVerificationEvidenceFile;

          // file present or not
          let filePresent = document.getElementById('dbVerificationEvidenceFile').files[0];
          if (
            (!filePresent && !combinedValues.dbVerificationEvidence.dbVerificationEvidenceFile) ||
            combinedValues.dbVerificationEvidence.dbVerificationEvidenceFile === ''
          ) {
            sweetAlertHandler(bgvAlerts.noFilesPresent);
            hideLoader();
          } else {
            let allFilesData = [];
            const fileNameArray = ['dbVerificationEvidenceFile'];

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
              _sendDbVerification(combinedValues);
            } else {
              if (areFilesInvalid(allFilesData) !== 0) {
                sweetAlertHandler(bgvAlerts.invalidFilesPresent);
              } else {
                _sendDbVerification(combinedValues);
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

            <Row className="my-3">
              <Col sm={3}>
                <label>India specific</label>
              </Col>
              <Col sm={9}>
                <select
                  className="form-control"
                  error={touched.indiaSpecific && errors.indiaSpecific}
                  name="indiaSpecific"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.indiaSpecific}
                  id="indiaSpecific"
                  type="select"
                >
                  {foundNotFoundOptions.map((ele, i) => {
                    return (
                      <option key={i} value={ele.value}>
                        {ele.label}
                      </option>
                    );
                  })}
                </select>
                {touched.indiaSpecific && errors.indiaSpecific && <small className="text-danger form-text">{errors.indiaSpecific}</small>}
              </Col>
            </Row>

            <Row className="my-3">
              <Col sm={3}>
                <label>Global</label>
              </Col>
              <Col sm={9}>
                <select
                  className="form-control"
                  error={touched.global && errors.global}
                  name="global"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.global}
                  id="global"
                  type="select"
                >
                  {foundNotFoundOptions.map((ele, i) => {
                    return (
                      <option key={i} value={ele.value}>
                        {ele.label}
                      </option>
                    );
                  })}
                </select>
                {touched.global && errors.global && <small className="text-danger form-text">{errors.global}</small>}
              </Col>
            </Row>

            <Row className="my-3">
              <Col sm={3}>
                <label>Web and Media</label>
              </Col>
              <Col sm={9}>
                <select
                  className="form-control"
                  error={touched.webAndMedia && errors.webAndMedia}
                  name="webAndMedia"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.webAndMedia}
                  id="webAndMedia"
                  type="select"
                >
                  {foundNotFoundOptions.map((ele, i) => {
                    return (
                      <option key={i} value={ele.value}>
                        {ele.label}
                      </option>
                    );
                  })}
                </select>
                {touched.webAndMedia && errors.webAndMedia && <small className="text-danger form-text">{errors.webAndMedia}</small>}
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
                    <label>Database Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.dbVerificationEvidenceFile && errors.dbVerificationEvidenceFile}
                      name="dbVerificationEvidenceFile"
                      id="dbVerificationEvidenceFile"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.dbVerificationEvidenceFile}
                    />
                    {databaseCheckData !== 'N.A.' &&
                    databaseCheckData.dbVerificationEvidence.dbVerificationEvidenceFile &&
                    databaseCheckData.dbVerificationEvidence.dbVerificationEvidenceURL !== '' ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a
                          href={databaseCheckData.dbVerificationEvidence.dbVerificationEvidenceURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.dbVerificationEvidenceFile && errors.dbVerificationEvidenceFile && (
                      <small className="text-danger form-text">{errors.dbVerificationEvidenceFile}</small>
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

export default DatabaseCheckBgv;
