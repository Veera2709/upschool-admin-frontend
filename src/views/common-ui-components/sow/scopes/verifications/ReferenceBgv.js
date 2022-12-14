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

import {
  YesNoOptions,
  YesNoArray,
  evidenceUploadStatusOptions,
  evidenceUploadStatusOptionsArray
} from '../../../../../helper/selectOptions';
import useFullPageLoader from '../../../../../helper/useFullPageLoader';

const ReferenceBgv = ({ className, rest, referenceData, reloadData }) => {
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

  const _sendReferenceVerification = async (data) => {
    let apiUrl = dynamicUrl.uploadEvidenceUrl;

    console.log(apiUrl, data, 'Reference', case_id);

    const bgvResponse = await bgvApi(apiUrl, data, 'Reference', case_id);
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
          associationPeriod1:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceOne)
              ? ''
              : referenceData.referenceEvidenceOne.associationPeriod,
          professionalCompetence1:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceOne)
              ? ''
              : referenceData.referenceEvidenceOne.professionalCompetence,
          strength1:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceOne)
              ? ''
              : referenceData.referenceEvidenceOne.strength,
          areasToImprove1:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceOne)
              ? ''
              : referenceData.referenceEvidenceOne.areasToImprove,
          jobRecommendation1:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceOne)
              ? ''
              : referenceData.referenceEvidenceOne.jobRecommendation,
          additionalComments1:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceOne)
              ? ''
              : referenceData.referenceEvidenceOne.additionalComments,
          referenceEvidenceFile1: '',

          associationPeriod2:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceTwo)
              ? ''
              : referenceData.referenceEvidenceTwo.associationPeriod,
          professionalCompetence2:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceTwo)
              ? ''
              : referenceData.referenceEvidenceTwo.professionalCompetence,
          strength2:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceTwo)
              ? ''
              : referenceData.referenceEvidenceTwo.strength,
          areasToImprove2:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceTwo)
              ? ''
              : referenceData.referenceEvidenceTwo.areasToImprove,
          jobRecommendation2:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceTwo)
              ? ''
              : referenceData.referenceEvidenceTwo.jobRecommendation,
          additionalComments2:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceTwo)
              ? ''
              : referenceData.referenceEvidenceTwo.additionalComments,
          referenceEvidenceFile2: '',

          associationPeriod3:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceThree)
              ? ''
              : referenceData.referenceEvidenceThree.associationPeriod,
          professionalCompetence3:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceThree)
              ? ''
              : referenceData.referenceEvidenceThree.professionalCompetence,
          strength3:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceThree)
              ? ''
              : referenceData.referenceEvidenceThree.strength,
          areasToImprove3:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceThree)
              ? ''
              : referenceData.referenceEvidenceThree.areasToImprove,
          jobRecommendation3:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceThree)
              ? ''
              : referenceData.referenceEvidenceThree.jobRecommendation,
          additionalComments3:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceEvidenceThree)
              ? ''
              : referenceData.referenceEvidenceThree.additionalComments,
          referenceEvidenceFile3: '',

          componentStatus: referenceData === 'N.A.' ? '' : referenceData.componentStatus,
          statusDescription: referenceData === 'N.A.' ? '' : referenceData.statusDescription
        }}
        validationSchema={Yup.object().shape({
          associationPeriod1: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong)
            .required(Constants.ReferenceVerification.associationPeriodRequired),
          professionalCompetence1: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong)
            .required(Constants.ReferenceVerification.professionalCompetenceRequired),
          strength1: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong)
            .required(Constants.ReferenceVerification.strengthRequired),
          areasToImprove1: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong)
            .required(Constants.ReferenceVerification.areasToImproveRequired),
          jobRecommendation1: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong)
            .oneOf(YesNoArray, Constants.VerificationCommon.InvalidDefault)
            .required(Constants.ReferenceVerification.jobRecommendationRequired),
          additionalComments1: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong)
            .required(Constants.ReferenceVerification.additionalCommentsRequired),

          associationPeriod2: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong),
          professionalCompetence2: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong),
          strength2: Yup.string().min(2, Constants.VerificationCommon.CommonTooShort).max(200, Constants.VerificationCommon.CommonTooLong),
          areasToImprove2: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong),
          jobRecommendation2: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong)
            .oneOf(YesNoArray, Constants.VerificationCommon.InvalidDefault),
          // .required(Constants.VerificationCommon.RequiredDefault),
          additionalComments2: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong),

          associationPeriod3: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong),
          professionalCompetence3: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong),
          strength3: Yup.string().min(2, Constants.VerificationCommon.CommonTooShort).max(200, Constants.VerificationCommon.CommonTooLong),
          areasToImprove3: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong),
          jobRecommendation3: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong)
            .oneOf(YesNoArray, Constants.VerificationCommon.InvalidDefault),
          // .required(Constants.VerificationCommon.RequiredDefault),
          additionalComments3: Yup.string()
            .min(2, Constants.VerificationCommon.CommonTooShort)
            .max(200, Constants.VerificationCommon.CommonTooLong),

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
            referenceEvidenceOne: {
              associationPeriod: values.associationPeriod1,
              professionalCompetence: values.professionalCompetence1,
              strength: values.strength1,
              areasToImprove: values.areasToImprove1,
              jobRecommendation: values.jobRecommendation1,
              additionalComments: values.additionalComments1,
              referenceEvidenceFile: values.referenceEvidenceFile1
            },
            referenceEvidenceTwo: {
              associationPeriod: values.associationPeriod2,
              professionalCompetence: values.professionalCompetence2,
              strength: values.strength2,
              areasToImprove: values.areasToImprove2,
              jobRecommendation: values.jobRecommendation2,
              additionalComments: values.additionalComments2,
              referenceEvidenceFile: values.referenceEvidenceFile2
            },
            referenceEvidenceThree: {
              associationPeriod: values.associationPeriod3,
              professionalCompetence: values.professionalCompetence3,
              strength: values.strength3,
              areasToImprove: values.areasToImprove3,
              jobRecommendation: values.jobRecommendation3,
              additionalComments: values.additionalComments3,
              referenceEvidenceFile: values.referenceEvidenceFile3
            },
            componentStatus: values.componentStatus,
            statusDescription: values.statusDescription
          };

          if (values.referenceEvidenceFile1 === '')
            referenceData.referenceEvidenceOne.referenceEvidenceFile
              ? (combinedValues.referenceEvidenceOne.referenceEvidenceFile = referenceData.referenceEvidenceOne.referenceEvidenceFile)
              : (combinedValues.referenceEvidenceOne = {});
          if (values.referenceEvidenceFile2 === '')
            referenceData.referenceEvidenceTwo.referenceEvidenceFile
              ? (combinedValues.referenceEvidenceTwo.referenceEvidenceFile = referenceData.referenceEvidenceTwo.referenceEvidenceFile)
              : (combinedValues.referenceEvidenceTwo = {});
          if (values.referenceEvidenceFile3 === '')
            referenceData.referenceEvidenceThree.referenceEvidenceFile
              ? (combinedValues.referenceEvidenceThree.referenceEvidenceFile = referenceData.referenceEvidenceThree.referenceEvidenceFile)
              : (combinedValues.referenceEvidenceThree = {});

          // if (
          //   combinedValues.referenceEvidenceTwo.associationPeriod === '' ||
          //   combinedValues.referenceEvidenceTwo.professionalCompetence === '' ||
          //   combinedValues.referenceEvidenceTwo.strength === '' ||
          //   combinedValues.referenceEvidenceTwo.areasToImprove === '' ||
          //   combinedValues.referenceEvidenceTwo.jobRecommendation === '' ||
          //   combinedValues.referenceEvidenceTwo.additionalComments === ''
          // ) {
          //   combinedValues.referenceEvidenceTwo = {};
          // }

          // if (
          //   combinedValues.referenceEvidenceThree.associationPeriod === '' ||
          //   combinedValues.referenceEvidenceThree.professionalCompetence === '' ||
          //   combinedValues.referenceEvidenceThree.strength === '' ||
          //   combinedValues.referenceEvidenceThree.areasToImprove === '' ||
          //   combinedValues.referenceEvidenceThree.jobRecommendation === '' ||
          //   combinedValues.referenceEvidenceThree.additionalComments === ''
          // ) {
          //   combinedValues.referenceEvidenceThree = {};
          // }

          console.log(combinedValues);

          // file present or not
          let filePresent = document.getElementById('referenceEvidenceFile1').files[0];
          if (
            (!filePresent && !combinedValues.referenceEvidenceOne.referenceEvidenceFile) ||
            combinedValues.referenceEvidenceOne.referenceEvidenceFile === ''
          ) {
            sweetAlertHandler(bgvAlerts.noFilesPresent);
            hideLoader();
          } else {
            let allFilesData = [];
            const fileNameArray = ['referenceEvidenceFile1', 'referenceEvidenceFile2', 'referenceEvidenceFile3'];

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
              _sendReferenceVerification(combinedValues);
            } else {
              if (areFilesInvalid(allFilesData) !== 0) {
                sweetAlertHandler(bgvAlerts.invalidFilesPresent);
                hideLoader();
              } else {
                _sendReferenceVerification(combinedValues);
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
                        Reference Verification #1
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
                                <label>Period of association</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.associationPeriod1 && errors.associationPeriod1}
                                  name="associationPeriod1"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.associationPeriod1}
                                />
                                {touched.associationPeriod1 && errors.associationPeriod1 && (
                                  <small className="text-danger form-text">{errors.associationPeriod1}</small>
                                )}
                              </Col>
                            </Row>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Professional competence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.professionalCompetence1 && errors.professionalCompetence1}
                                  name="professionalCompetence1"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.professionalCompetence1}
                                />
                                {touched.professionalCompetence1 && errors.professionalCompetence1 && (
                                  <small className="text-danger form-text">{errors.professionalCompetence1}</small>
                                )}
                              </Col>
                            </Row>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Strength</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.strength1 && errors.strength1}
                                  name="strength1"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.strength1}
                                />
                                {touched.strength1 && errors.strength1 && (
                                  <small className="text-danger form-text">{errors.strength1}</small>
                                )}
                              </Col>
                            </Row>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Areas to improve</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.areasToImprove1 && errors.areasToImprove1}
                                  name="areasToImprove1"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.areasToImprove1}
                                />
                                {touched.areasToImprove1 && errors.areasToImprove1 && (
                                  <small className="text-danger form-text">{errors.areasToImprove1}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Recommended for job</label>
                              </Col>
                              <Col sm={9}>
                                <select
                                  className="form-control"
                                  error={touched.jobRecommendation1 && errors.jobRecommendation1}
                                  name="jobRecommendation1"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.jobRecommendation1}
                                >
                                  {YesNoOptions.map((ele, i) => {
                                    return (
                                      <option key={i} value={ele.value}>
                                        {ele.label}
                                      </option>
                                    );
                                  })}
                                </select>
                                {touched.jobRecommendation1 && errors.jobRecommendation1 && (
                                  <small className="text-danger form-text">{errors.jobRecommendation1}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Additional comments</label>
                              </Col>
                              <Col sm={9}>
                                <textarea
                                  className="form-control"
                                  error={touched.additionalComments1 && errors.additionalComments1}
                                  name="additionalComments1"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.additionalComments1}
                                  rows="8"
                                />
                                {touched.additionalComments1 && errors.additionalComments1 && (
                                  <small className="text-danger form-text">{errors.additionalComments1}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Reference Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.referenceEvidenceFile1 && errors.referenceEvidenceFile1}
                                  name="referenceEvidenceFile1"
                                  id="referenceEvidenceFile1"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.referenceEvidenceFile1}
                                />
                                {referenceData !== 'N.A.' &&
                                referenceData.referenceEvidenceOne.referenceEvidenceFile !== '' &&
                                referenceData.referenceEvidenceOne.referenceEvidenceOneURL ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a
                                      href={referenceData.referenceEvidenceOne.referenceEvidenceOneURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.referenceEvidenceFile1 && errors.referenceEvidenceFile1 && (
                                  <small className="text-danger form-text">{errors.referenceEvidenceFile1}</small>
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
                        aria-controls="accordion2"
                        aria-expanded={accordionKey === 2}
                      >
                        Reference Verification #2
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
                                <label>Period of association</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.associationPeriod2 && errors.associationPeriod2}
                                  name="associationPeriod2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.associationPeriod2}
                                />
                                {touched.associationPeriod2 && errors.associationPeriod2 && (
                                  <small className="text-danger form-text">{errors.associationPeriod2}</small>
                                )}
                              </Col>
                            </Row>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Professional competence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.professionalCompetence2 && errors.professionalCompetence2}
                                  name="professionalCompetence2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.professionalCompetence2}
                                />
                                {touched.professionalCompetence2 && errors.professionalCompetence2 && (
                                  <small className="text-danger form-text">{errors.professionalCompetence2}</small>
                                )}
                              </Col>
                            </Row>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Strength</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.strength2 && errors.strength2}
                                  name="strength2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.strength2}
                                />
                                {touched.strength2 && errors.strength2 && (
                                  <small className="text-danger form-text">{errors.strength2}</small>
                                )}
                              </Col>
                            </Row>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Areas to improve</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.areasToImprove2 && errors.areasToImprove2}
                                  name="areasToImprove2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.areasToImprove2}
                                />
                                {touched.areasToImprove2 && errors.areasToImprove2 && (
                                  <small className="text-danger form-text">{errors.areasToImprove2}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Recommended for job</label>
                              </Col>
                              <Col sm={9}>
                                <select
                                  className="form-control"
                                  error={touched.jobRecommendation2 && errors.jobRecommendation2}
                                  name="jobRecommendation2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.jobRecommendation2}
                                >
                                  {YesNoOptions.map((ele, i) => {
                                    return (
                                      <option key={i} value={ele.value}>
                                        {ele.label}
                                      </option>
                                    );
                                  })}
                                </select>
                                {touched.jobRecommendation2 && errors.jobRecommendation2 && (
                                  <small className="text-danger form-text">{errors.jobRecommendation2}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Additional comments</label>
                              </Col>
                              <Col sm={9}>
                                <textarea
                                  className="form-control"
                                  error={touched.additionalComments2 && errors.additionalComments2}
                                  name="additionalComments2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.additionalComments2}
                                  rows="8"
                                />
                                {touched.additionalComments2 && errors.additionalComments2 && (
                                  <small className="text-danger form-text">{errors.additionalComments2}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Reference Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.referenceEvidenceFile2 && errors.referenceEvidenceFile2}
                                  name="referenceEvidenceFile2"
                                  id="referenceEvidenceFile2"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.referenceEvidenceFile2}
                                />
                                {referenceData !== 'N.A.' &&
                                referenceData.referenceEvidenceTwo.referenceEvidenceFile !== '' &&
                                referenceData.referenceEvidenceTwo.referenceEvidenceTwoURL ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a
                                      href={referenceData.referenceEvidenceTwo.referenceEvidenceTwoURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.referenceEvidenceFile2 && errors.referenceEvidenceFile2 && (
                                  <small className="text-danger form-text">{errors.referenceEvidenceFile2}</small>
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
                        Reference Verification #3
                      </Link>
                    </Card.Title>
                  </Card.Header>
                  <Collapse in={accordionKey === 3}>
                    <div id="accordion3">
                      <Card.Body>
                        <Row>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Period of association</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.associationPeriod3 && errors.associationPeriod3}
                                  name="associationPeriod3"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.associationPeriod3}
                                />
                                {touched.associationPeriod3 && errors.associationPeriod3 && (
                                  <small className="text-danger form-text">{errors.associationPeriod3}</small>
                                )}
                              </Col>
                            </Row>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Professional competence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.professionalCompetence3 && errors.professionalCompetence3}
                                  name="professionalCompetence3"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.professionalCompetence3}
                                />
                                {touched.professionalCompetence3 && errors.professionalCompetence3 && (
                                  <small className="text-danger form-text">{errors.professionalCompetence3}</small>
                                )}
                              </Col>
                            </Row>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Strength</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.strength3 && errors.strength3}
                                  name="strength3"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.strength3}
                                />
                                {touched.strength3 && errors.strength3 && (
                                  <small className="text-danger form-text">{errors.strength3}</small>
                                )}
                              </Col>
                            </Row>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Areas to improve</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.areasToImprove3 && errors.areasToImprove3}
                                  name="areasToImprove3"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.areasToImprove3}
                                />
                                {touched.areasToImprove3 && errors.areasToImprove3 && (
                                  <small className="text-danger form-text">{errors.areasToImprove3}</small>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col sm={6}>
                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Recommended for job</label>
                              </Col>
                              <Col sm={9}>
                                <select
                                  className="form-control"
                                  error={touched.jobRecommendation3 && errors.jobRecommendation3}
                                  name="jobRecommendation3"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.jobRecommendation3}
                                >
                                  {YesNoOptions.map((ele, i) => {
                                    return (
                                      <option key={i} value={ele.value}>
                                        {ele.label}
                                      </option>
                                    );
                                  })}
                                </select>
                                {touched.jobRecommendation3 && errors.jobRecommendation3 && (
                                  <small className="text-danger form-text">{errors.jobRecommendation3}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Additional comments</label>
                              </Col>
                              <Col sm={9}>
                                <textarea
                                  className="form-control"
                                  error={touched.additionalComments3 && errors.additionalComments3}
                                  name="additionalComments3"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="text"
                                  value={values.additionalComments3}
                                  rows="8"
                                />
                                {touched.additionalComments3 && errors.additionalComments3 && (
                                  <small className="text-danger form-text">{errors.additionalComments3}</small>
                                )}
                              </Col>
                            </Row>

                            <Row className="my-3">
                              <Col sm={3}>
                                <label>Reference Evidence</label>
                              </Col>
                              <Col sm={9}>
                                <input
                                  className="form-control"
                                  error={touched.referenceEvidenceFile3 && errors.referenceEvidenceFile3}
                                  name="referenceEvidenceFile3"
                                  id="referenceEvidenceFile3"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  type="file"
                                  value={values.referenceEvidenceFile3}
                                />
                                {referenceData !== 'N.A.' &&
                                referenceData.referenceEvidenceThree.referenceEvidenceFile !== '' &&
                                referenceData.referenceEvidenceThree.referenceEvidenceThreeURL ? (
                                  <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                                    <a
                                      href={referenceData.referenceEvidenceThree.referenceEvidenceThreeURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View
                                    </a>
                                  </small>
                                ) : (
                                  <small className="text-warning form-text">No file uploaded yet</small>
                                )}
                                {touched.referenceEvidenceFile3 && errors.referenceEvidenceFile3 && (
                                  <small className="text-danger form-text">{errors.referenceEvidenceFile3}</small>
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

export default ReferenceBgv;
