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

const SocialMediaBgv = ({ className, rest, socialMediaCheckData, reloadData }) => {
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

  const _sendSocialMediaVerification = async (data) => {
    let apiUrl = dynamicUrl.uploadEvidenceUrl;

    console.log(apiUrl, data, 'SocialMedia', case_id);

    const bgvResponse = await bgvApi(apiUrl, data, 'SocialMedia', case_id);
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
          componentStatus: socialMediaCheckData === 'N.A.' ? '' : socialMediaCheckData.componentStatus,
          statusDescription: socialMediaCheckData === 'N.A.' ? '' : socialMediaCheckData.statusDescription,
          facebookEvidence: '',
          twitterEvidence: '',
          instagramEvidence: '',
          linkedInEvidence: ''
        }}
        validationSchema={Yup.object().shape({
          componentStatus: Yup.string()
            .min(0, Constants.VerificationCommon.InvalidDefault)
            .oneOf(evidenceUploadStatusOptionsArray, Constants.VerificationCommon.InvalidDefault)
            .required(Constants.VerificationCommon.RequiredDefault),
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
            socialMediaEvidence: {
              facebookEvidence: values.facebookEvidence,
              twitterEvidence: values.twitterEvidence,
              instagramEvidence: values.instagramEvidence,
              linkedInEvidence: values.linkedInEvidence
            },
            componentStatus: values.componentStatus,
            statusDescription: values.statusDescription
          };

          if (values.facebookEvidence === '')
            combinedValues.socialMediaEvidence.facebookEvidence = socialMediaCheckData.socialMediaEvidence.facebookEvidence;
          if (values.twitterEvidence === '')
            combinedValues.socialMediaEvidence.twitterEvidence = socialMediaCheckData.socialMediaEvidence.twitterEvidence;
          if (values.instagramEvidence === '')
            combinedValues.socialMediaEvidence.instagramEvidence = socialMediaCheckData.socialMediaEvidence.instagramEvidence;
          if (values.linkedInEvidence === '')
            combinedValues.socialMediaEvidence.linkedInEvidence = socialMediaCheckData.socialMediaEvidence.linkedInEvidence;

          // file present or not
          let filePresent = document.getElementById('facebookEvidence').files[0];
          if (
            (!filePresent && !combinedValues.socialMediaEvidence.facebookEvidence) ||
            combinedValues.socialMediaEvidence.facebookEvidence === ''
          ) {
            sweetAlertHandler(bgvAlerts.noFilesPresent);
            hideLoader();
          } else {
            let allFilesData = [];
            const fileNameArray = ['facebookEvidence', 'twitterEvidence', 'instagramEvidence', 'linkedInEvidence'];

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
              _sendSocialMediaVerification(combinedValues);
            } else {
              if (areFilesInvalid(allFilesData) !== 0) {
                sweetAlertHandler(bgvAlerts.invalidFilesPresent);
              } else {
                _sendSocialMediaVerification(combinedValues);
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
                    <label>Facebook Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.facebookEvidence && errors.facebookEvidence}
                      name="facebookEvidence"
                      id="facebookEvidence"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.facebookEvidence}
                    />
                    {socialMediaCheckData !== 'N.A.' &&
                    socialMediaCheckData.socialMediaEvidence.facebookEvidence !== '' &&
                    socialMediaCheckData.socialMediaEvidence.facebookEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a href={socialMediaCheckData.socialMediaEvidence.facebookEvidenceURL} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.facebookEvidence && errors.facebookEvidence && (
                      <small className="text-danger form-text">{errors.facebookEvidence}</small>
                    )}
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={3}>
                    <label>Twitter evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.twitterEvidence && errors.twitterEvidence}
                      name="twitterEvidence"
                      id="twitterEvidence"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.twitterEvidence}
                    />
                    {socialMediaCheckData !== 'N.A.' &&
                    socialMediaCheckData.socialMediaEvidence.twitterEvidence !== '' &&
                    socialMediaCheckData.socialMediaEvidence.twitterEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a href={socialMediaCheckData.socialMediaEvidence.twitterEvidenceURL} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.twitterEvidence && errors.twitterEvidence && (
                      <small className="text-danger form-text">{errors.twitterEvidence}</small>
                    )}
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={3}>
                    <label>Instagram Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.instagramEvidence && errors.instagramEvidence}
                      name="instagramEvidence"
                      id="instagramEvidence"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.instagramEvidence}
                    />
                    {socialMediaCheckData !== 'N.A.' &&
                    socialMediaCheckData.socialMediaEvidence.instagramEvidence !== '' &&
                    socialMediaCheckData.socialMediaEvidence.instagramEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a href={socialMediaCheckData.socialMediaEvidence.instagramEvidenceURL} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.instagramEvidence && errors.instagramEvidence && (
                      <small className="text-danger form-text">{errors.instagramEvidence}</small>
                    )}
                  </Col>
                </Row>

                <Row className="my-3">
                  <Col sm={3}>
                    <label>LinkedIn Evidence</label>
                  </Col>
                  <Col sm={9}>
                    <input
                      className="form-control"
                      error={touched.linkedInEvidence && errors.linkedInEvidence}
                      name="linkedInEvidence"
                      id="linkedInEvidence"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="file"
                      value={values.linkedInEvidence}
                    />
                    {socialMediaCheckData !== 'N.A.' &&
                    socialMediaCheckData.socialMediaEvidence.linkedInEvidence !== '' &&
                    socialMediaCheckData.socialMediaEvidence.linkedInEvidenceURL ? (
                      <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                        <a href={socialMediaCheckData.socialMediaEvidence.linkedInEvidenceURL} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </small>
                    ) : (
                      <small className="text-warning form-text">No file uploaded yet</small>
                    )}
                    {touched.linkedInEvidence && errors.linkedInEvidence && (
                      <small className="text-danger form-text">{errors.linkedInEvidence}</small>
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

export default SocialMediaBgv;
