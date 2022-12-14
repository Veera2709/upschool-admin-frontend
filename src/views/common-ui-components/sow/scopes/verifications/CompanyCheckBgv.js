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

const CompanyCheckBgv = ({ className, rest, companyCheckData, reloadData }) => {
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

  const _sendCompanyCheckVerification = async (data) => {
    let apiUrl = dynamicUrl.uploadEvidenceUrl;

    console.log(apiUrl, data, 'CompanyCheck', case_id);

    const bgvResponse = await bgvApi(apiUrl, data, 'CompanyCheck', case_id);
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
          componentStatus: companyCheckData === 'N.A.' ? '' : companyCheckData.componentStatus,
          statusDescription: companyCheckData === 'N.A.' ? '' : companyCheckData.statusDescription,
          googleSearch:
            companyCheckData === 'N.A.' || isEmptyObject(companyCheckData.companyCheckEvidence)
              ? ''
              : companyCheckData.companyCheckEvidence.googleSearch,
          mca:
            companyCheckData === 'N.A.' || isEmptyObject(companyCheckData.companyCheckEvidence)
              ? ''
              : companyCheckData.companyCheckEvidence.mca,
          nasscomSearch:
            companyCheckData === 'N.A.' || isEmptyObject(companyCheckData.companyCheckEvidence)
              ? ''
              : companyCheckData.companyCheckEvidence.nasscomSearch,
          nseSearch:
            companyCheckData === 'N.A.' || isEmptyObject(companyCheckData.companyCheckEvidence)
              ? ''
              : companyCheckData.companyCheckEvidence.nseSearch,
          bseSearch:
            companyCheckData === 'N.A.' || isEmptyObject(companyCheckData.companyCheckEvidence)
              ? ''
              : companyCheckData.companyCheckEvidence.bseSearch,
          companyCheckEvidenceFile: ''
        }}
        validationSchema={Yup.object().shape({
          componentStatus: Yup.string()
            .min(0, Constants.VerificationCommon.StatusDescriptionInvalid)
            .oneOf(evidenceUploadStatusOptionsArray, Constants.VerificationCommon.StatusDescriptionInvalid)
            .required(Constants.VerificationCommon.StatusDescriptionRequired),
          googleSearch: Yup.string()
            .min(0, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .oneOf(foundNotFoundOptionsArray, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .required(Constants.VerificationCommon.CommonInvalidOptionRequired),
          mca: Yup.string()
            .min(0, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .oneOf(foundNotFoundOptionsArray, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .required(Constants.VerificationCommon.CommonInvalidOptionRequired),
          nasscomSearch: Yup.string()
            .min(0, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .oneOf(foundNotFoundOptionsArray, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .required(Constants.VerificationCommon.CommonInvalidOptionRequired),
          nseSearch: Yup.string()
            .min(0, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .oneOf(foundNotFoundOptionsArray, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .required(Constants.VerificationCommon.CommonInvalidOptionRequired),
          bseSearch: Yup.string()
            .min(0, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .oneOf(foundNotFoundOptionsArray, Constants.VerificationCommon.CommonInvalidOptionInvalid)
            .required(Constants.VerificationCommon.CommonInvalidOptionRequired),
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
            companyCheckEvidence: {
              companyCheckEvidenceFile: values.companyCheckEvidenceFile,
              googleSearch: values.googleSearch,
              mca: values.mca,
              nasscomSearch: values.nasscomSearch,
              nseSearch: values.nseSearch,
              bseSearch: values.bseSearch
            },
            componentStatus: values.componentStatus,
            statusDescription: values.statusDescription
          };

          if (values.companyCheckEvidenceFile === '')
            combinedValues.companyCheckEvidence.companyCheckEvidenceFile = companyCheckData.companyCheckEvidence.companyCheckEvidenceFile;

          // file present or not
          let filePresent = document.getElementById('companyCheckEvidenceFile').files[0];
          if (
            (!filePresent && !combinedValues.companyCheckEvidence.companyCheckEvidenceFile) ||
            combinedValues.companyCheckEvidence.companyCheckEvidenceFile === ''
          ) {
            sweetAlertHandler(bgvAlerts.noFilesPresent);
            hideLoader();
          } else {
            let allFilesData = [];
            const fileNameArray = ['companyCheckEvidenceFile'];

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
              _sendCompanyCheckVerification(combinedValues);
            } else {
              if (areFilesInvalid(allFilesData) !== 0) {
                sweetAlertHandler(bgvAlerts.invalidFilesPresent);
              } else {
                _sendCompanyCheckVerification(combinedValues);
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
                    <label>Google Search</label>
                  </Col>
                  <Col sm={9}>
                    <select
                      className="form-control"
                      error={touched.googleSearch && errors.googleSearch}
                      name="googleSearch"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.googleSearch}
                      id="googleSearch"
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
                    {touched.googleSearch && errors.googleSearch && <small className="text-danger form-text">{errors.googleSearch}</small>}
                  </Col>
                </Row>
                <Row className="my-3">
                  <Col sm={3}>
                    <label>MCA</label>
                  </Col>
                  <Col sm={9}>
                    <select
                      className="form-control"
                      error={touched.mca && errors.mca}
                      name="mca"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.mca}
                      id="mca"
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
                    {touched.mca && errors.mca && <small className="text-danger form-text">{errors.mca}</small>}
                  </Col>
                </Row>
                <Row className="my-3">
                  <Col sm={3}>
                    <label>NASSCOM Search</label>
                  </Col>
                  <Col sm={9}>
                    <select
                      className="form-control"
                      error={touched.nasscomSearch && errors.nasscomSearch}
                      name="nasscomSearch"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.nasscomSearch}
                      id="nasscomSearch"
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
                    {touched.nasscomSearch && errors.nasscomSearch && (
                      <small className="text-danger form-text">{errors.nasscomSearch}</small>
                    )}
                  </Col>
                </Row>
                <Row className="my-3">
                  <Col sm={3}>
                    <label>NSE Search</label>
                  </Col>
                  <Col sm={9}>
                    <select
                      className="form-control"
                      error={touched.nseSearch && errors.nseSearch}
                      name="nseSearch"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.nseSearch}
                      id="nseSearch"
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
                    {touched.nseSearch && errors.nseSearch && <small className="text-danger form-text">{errors.nseSearch}</small>}
                  </Col>
                </Row>
                <Row className="my-3">
                  <Col sm={3}>
                    <label>BSE Search</label>
                  </Col>
                  <Col sm={9}>
                    <select
                      className="form-control"
                      error={touched.bseSearch && errors.bseSearch}
                      name="bseSearch"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.bseSearch}
                      id="bseSearch"
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
                    {touched.bseSearch && errors.bseSearch && <small className="text-danger form-text">{errors.bseSearch}</small>}
                  </Col>
                </Row>
                <Row className="my-3">
                  <Col sm={3}>
                    <label>Company Check Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.companyCheckEvidenceFile && errors.companyCheckEvidenceFile}
                      name="companyCheckEvidenceFile"
                      id="companyCheckEvidenceFile"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.companyCheckEvidenceFile}
                    />
                    {companyCheckData !== 'N.A.' &&
                    companyCheckData.companyCheckEvidence.companyCheckEvidenceFile !== '' &&
                    companyCheckData.companyCheckEvidence.companyCheckEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a href={companyCheckData.companyCheckEvidence.companyCheckEvidenceURL} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.companyCheckEvidenceFile && errors.companyCheckEvidenceFile && (
                      <small className="text-danger form-text">{errors.companyCheckEvidenceFile}</small>
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

export default CompanyCheckBgv;
