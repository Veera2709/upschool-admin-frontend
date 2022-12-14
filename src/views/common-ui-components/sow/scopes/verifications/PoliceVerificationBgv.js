import React from 'react';
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
import { areFilesInvalid } from '../../../../../util/utils';

import { evidenceUploadStatusOptions, evidenceUploadStatusOptionsArray } from '../../../../../helper/selectOptions';
import useFullPageLoader from '../../../../../helper/useFullPageLoader';

const PoliceVerificationBgv = ({ className, rest, policeVerificationData, reloadData }) => {
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

  const _sendPoliceVerification = async (data) => {
    let apiUrl = dynamicUrl.uploadEvidenceUrl;

    console.log(apiUrl, data, 'PoliceVerification', case_id);

    const bgvResponse = await bgvApi(apiUrl, data, 'PoliceVerification', case_id);
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
          componentStatus: policeVerificationData === 'N.A.' ? '' : policeVerificationData.componentStatus,
          statusDescription: policeVerificationData === 'N.A.' ? '' : policeVerificationData.statusDescription,
          policeVerificationEvidence: '',
          challanEvidence: ''
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
            policeVerificationEvidence: {
              policeVerificationEvidence: values.policeVerificationEvidence,
              challanEvidence: values.challanEvidence
            },
            componentStatus: values.componentStatus,
            statusDescription: values.statusDescription
          };

          if (values.policeVerificationEvidence === '')
            combinedValues.policeVerificationEvidence.policeVerificationEvidence =
              policeVerificationData.policeVerificationEvidence.policeVerificationEvidence;
          if (values.challanEvidence === '')
            combinedValues.policeVerificationEvidence.challanEvidence = policeVerificationData.policeVerificationEvidence.challanEvidence;

          // file present or not
          let filePresent = document.getElementById('policeVerificationEvidence').files[0];
          let filePresent2 = document.getElementById('challanEvidence').files[0];
          if (
            (!filePresent && !combinedValues.policeVerificationEvidence.policeVerificationEvidence) ||
            combinedValues.policeVerificationEvidence.policeVerificationEvidence === '' ||
            (!filePresent2 && !combinedValues.policeVerificationEvidence.challanEvidence) ||
            combinedValues.policeVerificationEvidence.challanEvidence === ''
          ) {
            sweetAlertHandler(bgvAlerts.noFilesPresent);
            hideLoader();
          } else {
            let allFilesData = [];
            const fileNameArray = ['challanEvidence', 'policeVerificationEvidence'];

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
              _sendPoliceVerification(combinedValues);
              console.log(combinedValues);
            } else {
              if (areFilesInvalid(allFilesData) !== 0) {
                sweetAlertHandler(bgvAlerts.invalidFilesPresent);
              } else {
                _sendPoliceVerification(combinedValues);
                console.log(combinedValues);
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
                    <label>Challan Upload</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.challanEvidence && errors.challanEvidence}
                      name="challanEvidence"
                      id="challanEvidence"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.challanEvidence}
                    />
                    {policeVerificationData !== 'N.A.' &&
                    policeVerificationData.policeVerificationEvidence.challanEvidence !== '' &&
                    policeVerificationData.policeVerificationEvidence.challanEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a
                          href={policeVerificationData.policeVerificationEvidence.challanEvidenceURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.challanEvidence && errors.challanEvidence && (
                      <small className="text-danger form-text">{errors.challanEvidence}</small>
                    )}
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={3}>
                    <label>Police Verification Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.policeVerificationEvidence && errors.policeVerificationEvidence}
                      name="policeVerificationEvidence"
                      id="policeVerificationEvidence"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.policeVerificationEvidence}
                    />
                    {policeVerificationData !== 'N.A.' &&
                    policeVerificationData.policeVerificationEvidence.policeVerificationEvidence !== '' &&
                    policeVerificationData.policeVerificationEvidence.policeVerificationEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a
                          href={policeVerificationData.policeVerificationEvidence.policeVerificationEvidenceURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.policeVerificationEvidence && errors.policeVerificationEvidence && (
                      <small className="text-danger form-text">{errors.policeVerificationEvidence}</small>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>

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

export default PoliceVerificationBgv;
