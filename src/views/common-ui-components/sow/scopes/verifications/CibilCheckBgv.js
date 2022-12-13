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

const CibilCheckBgv = ({ className, rest, cibilCheckData, reloadData }) => {
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

  const _sendCibilCheckVerification = async (data) => {
    let apiUrl = dynamicUrl.uploadEvidenceUrl;

    console.log(apiUrl, data, 'CibilCheck', case_id);

    const bgvResponse = await bgvApi(apiUrl, data, 'CibilCheck', case_id);
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
          componentStatus: cibilCheckData === 'N.A.' ? '' : cibilCheckData.componentStatus,
          statusDescription: cibilCheckData === 'N.A.' ? '' : cibilCheckData.statusDescription,
          completionDate: isEmptyObject(cibilCheckData.cibilCheckEvidence) ? '' : cibilCheckData.cibilCheckEvidence.completionDate,
          cibilCheckEvidenceFile: ''
        }}
        validationSchema={Yup.object().shape({
          componentStatus: Yup.string()
            .min(0, Constants.VerificationCommon.InvalidDefault)
            .oneOf(evidenceUploadStatusOptionsArray, Constants.VerificationCommon.InvalidDefault)
            .required(Constants.VerificationCommon.ChangeStatusRequired),
          statusDescription: Yup.string()
            .min(2, Constants.VerificationCommon.StatusDescriptionTooShort)
            .max(200, Constants.VerificationCommon.StatusDescriptionTooLong)
            .required(Constants.VerificationCommon.StatusDescriptionRequired),
          completionDate: Yup.string().required(Constants.VerificationCommon.CompletedDateRequired)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          showLoader();
          console.log(values);
          console.log('Submitting');

          let combinedValues = {
            cibilCheckEvidence: { cibilCheckEvidenceFile: values.cibilCheckEvidenceFile, completionDate: values.completionDate },
            componentStatus: values.componentStatus,
            statusDescription: values.statusDescription
          };

          if (values.cibilCheckEvidenceFile === '')
            combinedValues.cibilCheckEvidence.cibilCheckEvidenceFile = cibilCheckData.cibilCheckEvidence.cibilCheckEvidenceFile;

          console.log(combinedValues);

          // file present or not
          let filePresent = document.getElementById('cibilCheckEvidenceFile').files[0];
          console.log(filePresent);
          if (!filePresent && !combinedValues.cibilCheckEvidence.evidenceFile && combinedValues.cibilCheckEvidence.evidenceFile === '') {
            sweetAlertHandler(bgvAlerts.noFilesPresent);
            hideLoader();
          } else {
            let allFilesData = [];
            const fileNameArray = ['cibilCheckEvidenceFile'];

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
              _sendCibilCheckVerification(combinedValues);
            } else {
              if (areFilesInvalid(allFilesData) !== 0) {
                sweetAlertHandler(bgvAlerts.invalidFilesPresent);
              } else {
                _sendCibilCheckVerification(combinedValues);
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
                    <label>Completion Date</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.completionDate && errors.completionDate}
                      name="completionDate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.completionDate}
                      id="completionDate"
                      type="date"
                    />
                    {touched.completionDate && errors.completionDate && (
                      <small className="text-danger form-text">{errors.completionDate}</small>
                    )}
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={3}>
                    <label>Cibil Check Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.cibilCheckEvidenceFile && errors.cibilCheckEvidenceFile}
                      name="cibilCheckEvidenceFile"
                      id="cibilCheckEvidenceFile"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.cibilCheckEvidenceFile}
                    />
                    {cibilCheckData !== 'N.A.' &&
                    cibilCheckData.cibilCheckEvidence.cibilCheckEvidenceFile !== '' &&
                    cibilCheckData.cibilCheckEvidence.cibilCheckEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a href={cibilCheckData.cibilCheckEvidence.cibilCheckEvidenceURL} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.cibilCheckEvidenceFile && errors.cibilCheckEvidenceFile && (
                      <small className="text-danger form-text">{errors.cibilCheckEvidenceFile}</small>
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

export default CibilCheckBgv;
