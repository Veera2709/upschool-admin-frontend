import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Collapse } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import * as Constants from '../../../../helper/constants';
import { Formik } from 'formik';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { bgvApi, fetchCaseCompDetails } from '../bgv-api/BgvApi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { isEmptyObject } from '../../../../util/utils';
import { getUrl } from '../bgv-api/getUrl';
import { bgvAlerts } from '../bgv-api/bgvAlerts';
import ReferenceBgv from './verifications/ReferenceBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import { contactRelationshipOptions, contactRelationshipOptionsArray } from '../../../../helper/selectOptions';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const Reference = ({ className, rest, newUpload }) => {
  const [referenceData, setReferenceData] = useState({});
  let { case_id } = useParams();
  const [isDisabled, setIsDisabled] = useState(true);
  const [submitButtonActive, setSubmitButtonActive] = useState(true);
  const [editClientButInsert, setEditClientButInsert] = useState(false);

  const [moreDetailsOne, setMoreDetailsOne] = useState(false);
  const [moreDetailsTwo, setMoreDetailsTwo] = useState(false);

  const [loadAgain, setLoadAgain] = useState(false);

  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  const _sendReferenceInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(referenceData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'Reference', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'Reference', case_id);
    console.log('bgv Response', bgvResponse);

    if (bgvResponse.Error) {
      if (newUpload) {
        sweetAlertHandler(bgvAlerts.compInsertError);
        hideLoader();
      } else {
        sweetAlertHandler(bgvAlerts.compUpdateError);
        hideLoader();
      }
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
        if (newUpload || editClientButInsert) {
          sweetAlertHandler(bgvAlerts.compInsertSuccess);
          setLoadAgain(!loadAgain);
          hideLoader();
        } else {
          sweetAlertHandler(bgvAlerts.compUpdateSuccess);
          setLoadAgain(!loadAgain);
          hideLoader();
        }
      } else {
        console.log('No files uploaded');
        if (newUpload || editClientButInsert) {
          sweetAlertHandler(bgvAlerts.compInsertSuccess);
          setLoadAgain(!loadAgain);
          hideLoader();
        } else {
          sweetAlertHandler(bgvAlerts.compUpdateSuccess);
          setLoadAgain(!loadAgain);
          hideLoader();
        }
      }
    }
  };

  const _fetchCaseReferenceTest = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'Reference');
    console.log('reference caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setReferenceData("N.A.") : setReferenceData(caseData);
      if (isEmptyObject(caseData)) {
        setReferenceData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setReferenceData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseReferenceTest();
    } else {
      setReferenceData('N.A.');
    }
  }, [loadAgain]);

  return isEmptyObject(referenceData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          respondentName:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailOne)
              ? ''
              : referenceData.referenceDetailOne.respondentName,
          respondentEmail:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailOne)
              ? ''
              : referenceData.referenceDetailOne.respondentEmail,
          designation:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailOne) ? '' : referenceData.referenceDetailOne.designation,
          organizationName:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailOne)
              ? ''
              : referenceData.referenceDetailOne.organizationName,
          contactDetails:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailOne)
              ? ''
              : referenceData.referenceDetailOne.contactDetails,
          contactRelationship:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailOne)
              ? ''
              : referenceData.referenceDetailOne.contactRelationship,

          respondentNameTwo:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailTwo)
              ? ''
              : referenceData.referenceDetailTwo.respondentName,
          respondentEmailTwo:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailTwo)
              ? ''
              : referenceData.referenceDetailTwo.respondentEmail,
          designationTwo:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailTwo) ? '' : referenceData.referenceDetailTwo.designation,
          organizationNameTwo:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailTwo)
              ? ''
              : referenceData.referenceDetailTwo.organizationName,
          contactDetailsTwo:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailTwo)
              ? ''
              : referenceData.referenceDetailTwo.contactDetails,
          contactRelationshipTwo:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailTwo)
              ? ''
              : referenceData.referenceDetailTwo.contactRelationship,

          respondentNameThree:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailThree)
              ? ''
              : referenceData.referenceDetailThree.respondentName,
          respondentEmailThree:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailThree)
              ? ''
              : referenceData.referenceDetailThree.respondentEmail,
          designationThree:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailThree)
              ? ''
              : referenceData.referenceDetailThree.designation,
          organizationNameThree:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailThree)
              ? ''
              : referenceData.referenceDetailThree.organizationName,
          contactDetailsThree:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailThree)
              ? ''
              : referenceData.referenceDetailThree.contactDetails,
          contactRelationshipThree:
            referenceData === 'N.A.' || isEmptyObject(referenceData.referenceDetailThree)
              ? ''
              : referenceData.referenceDetailThree.contactRelationship
        }}
        validationSchema={Yup.object().shape({
          respondentName: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.Reference.RespondentNameAlphabets)
            .min(2, Constants.Reference.RespondentNameTooShort)
            .max(50, Constants.Reference.RespondentNameTooLong)
            .required(Constants.Reference.RespondentNameRequired),
          respondentEmail: Yup.string()
            .email(Constants.Reference.RespondantEmailValid)
            .max(255)
            .required(Constants.Reference.RespondantEmailRequired),
          designation: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.Reference.DesignationAlphabets)
            .min(2, Constants.Reference.DesignationTooShort)
            .max(50, Constants.Reference.DesignationTooLong)
            .required(Constants.Reference.DesignationRequired),
          organizationName: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.Reference.OrganizationNamemustAlphabets)
            .min(2, Constants.Reference.OrganizationNameTooShort)
            .max(50, Constants.Reference.OrganizationNameTooLong)
            .required(Constants.Reference.OrganizationNameRequired),
          contactDetails: Yup.string()
            .min(10, Constants.Reference.ContactDetailsInvalid)
            .max(10, Constants.Reference.ContactDetailsInvalid)
            .required(Constants.Reference.ContactDetailsRequired),
          contactRelationship: Yup.string()
            .min(0, Constants.Reference.ContactRelationshipInvalid)
            .oneOf(contactRelationshipOptionsArray, Constants.Reference.ContactRelationshipInvalid)
            .required(Constants.Reference.ContactRelationshipRequired),

          respondentNameTwo: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.Reference.RespondentNameAlphabets)
            .min(2, Constants.Reference.RespondentNameTooShort)
            .max(50, Constants.Reference.RespondentNameTooLong),
          respondentEmailTwo: Yup.string().email(Constants.Reference.RespondantEmailValid).max(255),
          designationTwo: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.Reference.DesignationAlphabets)
            .min(2, Constants.Reference.DesignationTooShort)
            .max(50, Constants.Reference.DesignationTooLong),
          organizationNameTwo: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.Reference.OrganizationNamemustAlphabets)
            .min(2, Constants.Reference.OrganizationNameTooShort)
            .max(50, Constants.Reference.OrganizationNameTooLong),
          contactDetailsTwo: Yup.string()
            .min(10, Constants.Reference.ContactDetailsInvalid)
            .max(10, Constants.Reference.ContactDetailsInvalid),
          contactRelationshipTwo: Yup.string()
            .min(0, Constants.Reference.ContactRelationshipInvalid)
            .oneOf(contactRelationshipOptionsArray, Constants.Reference.ContactRelationshipInvalid),

          respondentNameThree: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.Reference.RespondentNameAlphabets)
            .min(2, Constants.Reference.RespondentNameTooShort)
            .max(50, Constants.Reference.RespondentNameTooLong),
          respondentEmailThree: Yup.string().email(Constants.Reference.RespondantEmailValid),
          designationThree: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.Reference.DesignationAlphabets)
            .min(2, Constants.Reference.DesignationTooShort)
            .max(50, Constants.Reference.DesignationTooLong),
          organizationNameThree: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.Reference.OrganizationNamemustAlphabets)
            .min(2, Constants.Reference.OrganizationNameTooShort)
            .max(50, Constants.Reference.OrganizationNameTooLong),
          contactDetailsThree: Yup.string()
            .min(10, Constants.Reference.ContactDetailsInvalid)
            .max(10, Constants.Reference.ContactDetailsInvalid),
          contactRelationshipThree: Yup.string()
            .min(0, Constants.Reference.ContactRelationshipInvalid)
            .oneOf(contactRelationshipOptionsArray, Constants.Reference.ContactRelationshipInvalid)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);

          const combinedValues = {
            referenceDetailOne: {
              respondentName: values.respondentName,
              respondentEmail: values.respondentEmail,
              designation: values.designation,
              organizationName: values.organizationName,
              contactDetails: values.contactDetails,
              contactRelationship: values.contactRelationship
            },
            referenceDetailTwo: {
              respondentName: values.respondentNameTwo,
              respondentEmail: values.respondentEmailTwo,
              designation: values.designationTwo,
              organizationName: values.organizationNameTwo,
              contactDetails: values.contactDetailsTwo,
              contactRelationship: values.contactRelationshipTwo
            },
            referenceDetailThree: {
              respondentName: values.respondentNameThree,
              respondentEmail: values.respondentEmailThree,
              designation: values.designationThree,
              organizationName: values.organizationNameThree,
              contactDetails: values.contactDetailsThree,
              contactRelationship: values.contactRelationshipThree
            }
          };

          if (
            combinedValues.referenceDetailTwo.respondentName === '' ||
            combinedValues.referenceDetailTwo.respondentEmail === '' ||
            combinedValues.referenceDetailTwo.designation === '' ||
            combinedValues.referenceDetailTwo.organizationName === '' ||
            combinedValues.referenceDetailTwo.contactDetails === '' ||
            combinedValues.referenceDetailTwo.contactRelationship === ''
          ) {
            combinedValues.referenceDetailTwo = {};
          }

          if (
            combinedValues.referenceDetailThree.respondentName === '' ||
            combinedValues.referenceDetailThree.respondentEmail === '' ||
            combinedValues.referenceDetailThree.designation === '' ||
            combinedValues.referenceDetailThree.organizationName === '' ||
            combinedValues.referenceDetailThree.contactDetails === '' ||
            combinedValues.referenceDetailThree.contactRelationship === ''
          ) {
            combinedValues.referenceDetailThree = {};
          }

          showLoader();
          console.log(combinedValues);
          _sendReferenceInfo(combinedValues);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <fieldset disabled={isDisabled}>
              <Row>
                <Col sm={12}>
                  <br />
                  <h5>Reference 1</h5>
                  <hr />
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Respondent Name</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.respondentName && errors.respondentName}
                        name="respondentName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.respondentName}
                      />
                      {touched.respondentName && errors.respondentName && (
                        <small className="text-danger form-text">{errors.respondentName}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Respondent Email</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.respondentEmail && errors.respondentEmail}
                        name="respondentEmail"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="email"
                        value={values.respondentEmail}
                      />
                      {touched.respondentEmail && errors.respondentEmail && (
                        <small className="text-danger form-text">{errors.respondentEmail}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Designation</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.designation && errors.designation}
                        name="designation"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.designation}
                      />
                      {touched.designation && errors.designation && <small className="text-danger form-text">{errors.designation}</small>}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Organization Name</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.organizationName && errors.organizationName}
                        name="organizationName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.organizationName}
                      />
                      {touched.organizationName && errors.organizationName && (
                        <small className="text-danger form-text">{errors.organizationName}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Contact Number</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.contactDetails && errors.contactDetails}
                        name="contactDetails"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        value={values.contactDetails}
                      />
                      {touched.contactDetails && errors.contactDetails && (
                        <small className="text-danger form-text">{errors.contactDetails}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Contact Relationship</label>
                    </Col>
                    <Col sm={9}>
                      <select
                        className="form-control"
                        error={touched.contactRelationship && errors.contactRelationship}
                        name="contactRelationship"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.contactRelationship}
                      >
                        {contactRelationshipOptions.map((ele, i) => {
                          return (
                            <option key={i} value={ele.value}>
                              {ele.label}
                            </option>
                          );
                        })}
                      </select>
                      {touched.contactRelationship && errors.contactRelationship && (
                        <small className="text-danger form-text">{errors.contactRelationship}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={11}></Col>
                <Col sm={1}>
                  {moreDetailsOne ? (
                    <>
                      <Button className="btn-block" variant="outline-danger" onClick={() => setMoreDetailsOne(!moreDetailsOne)}>
                        <i className="feather icon-minus mx-1" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="btn-block" variant="outline-primary" onClick={() => setMoreDetailsOne(!moreDetailsOne)}>
                        <i className="feather icon-plus mx-1" />
                      </Button>
                    </>
                  )}
                </Col>
              </Row>

              <Collapse in={moreDetailsOne}>
                <div id="basic-collapse">
                  <Row>
                    <Col sm={12}>
                      <br />
                      <h5>Reference 2</h5>
                      <hr />
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Respondent Name</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.respondentNameTwo && errors.respondentNameTwo}
                            name="respondentNameTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.respondentNameTwo}
                          />
                          {touched.respondentNameTwo && errors.respondentNameTwo && (
                            <small className="text-danger form-text">{errors.respondentNameTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Respondent Email</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.respondentEmailTwo && errors.respondentEmailTwo}
                            name="respondentEmailTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="email"
                            value={values.respondentEmailTwo}
                          />
                          {touched.respondentEmailTwo && errors.respondentEmailTwo && (
                            <small className="text-danger form-text">{errors.respondentEmailTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Designation</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.designationTwo && errors.designationTwo}
                            name="designationTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.designationTwo}
                          />
                          {touched.designationTwo && errors.designationTwo && (
                            <small className="text-danger form-text">{errors.designationTwo}</small>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Organization Name</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.organizationNameTwo && errors.organizationNameTwo}
                            name="organizationNameTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.organizationNameTwo}
                          />
                          {touched.organizationNameTwo && errors.organizationNameTwo && (
                            <small className="text-danger form-text">{errors.organizationNameTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Contact Number</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.contactDetailsTwo && errors.contactDetailsTwo}
                            name="contactDetailsTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.contactDetailsTwo}
                          />
                          {touched.contactDetailsTwo && errors.contactDetailsTwo && (
                            <small className="text-danger form-text">{errors.contactDetailsTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Contact Relationship</label>
                        </Col>
                        <Col sm={9}>
                          <select
                            className="form-control"
                            error={touched.contactRelationshipTwo && errors.contactRelationshipTwo}
                            name="contactRelationshipTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.contactRelationshipTwo}
                          >
                            {contactRelationshipOptions.map((ele, i) => {
                              return (
                                <option key={i} value={ele.value}>
                                  {ele.label}
                                </option>
                              );
                            })}
                          </select>
                          {touched.contactRelationshipTwo && errors.contactRelationshipTwo && (
                            <small className="text-danger form-text">{errors.contactRelationshipTwo}</small>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={11}></Col>
                    <Col sm={1}>
                      {moreDetailsTwo ? (
                        <>
                          <Button className="btn-block" variant="outline-danger" onClick={() => setMoreDetailsTwo(!moreDetailsTwo)}>
                            <i className="feather icon-minus mx-1" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button className="btn-block" variant="outline-primary" onClick={() => setMoreDetailsTwo(!moreDetailsTwo)}>
                            <i className="feather icon-plus mx-1" />
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>
                </div>
              </Collapse>
              <Collapse in={moreDetailsTwo}>
                <div id="basic-collapse">
                  <Row>
                    <Col sm={12}>
                      <br />
                      <h5>Reference 3</h5>
                      <hr />
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Respondent Name</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.respondentNameThree && errors.respondentNameThree}
                            name="respondentNameThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.respondentNameThree}
                          />
                          {touched.respondentNameThree && errors.respondentNameThree && (
                            <small className="text-danger form-text">{errors.respondentNameThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Respondent Email</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.respondentEmailThree && errors.respondentEmailThree}
                            name="respondentEmailThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="email"
                            value={values.respondentEmailThree}
                          />
                          {touched.respondentEmailThree && errors.respondentEmailThree && (
                            <small className="text-danger form-text">{errors.respondentEmailThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Designation</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.designationThree && errors.designationThree}
                            name="designationThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.designationThree}
                          />
                          {touched.designationThree && errors.designationThree && (
                            <small className="text-danger form-text">{errors.designationThree}</small>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Organization Name</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.organizationNameThree && errors.organizationNameThree}
                            name="organizationNameThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.organizationNameThree}
                          />
                          {touched.organizationNameThree && errors.organizationNameThree && (
                            <small className="text-danger form-text">{errors.organizationNameThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Contact Number</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.contactDetailsThree && errors.contactDetailsThree}
                            name="contactDetailsThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.contactDetailsThree}
                          />
                          {touched.contactDetailsThree && errors.contactDetailsThree && (
                            <small className="text-danger form-text">{errors.contactDetailsThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Contact Relationship</label>
                        </Col>
                        <Col sm={9}>
                          <select
                            className="form-control"
                            error={touched.contactRelationshipThree && errors.contactRelationshipThree}
                            name="contactRelationshipThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.contactRelationshipThree}
                          >
                            {contactRelationshipOptions.map((ele, i) => {
                              return (
                                <option key={i} value={ele.value}>
                                  {ele.label}
                                </option>
                              );
                            })}
                          </select>
                          {touched.contactRelationshipThree && errors.contactRelationshipThree && (
                            <small className="text-danger form-text">{errors.contactRelationshipThree}</small>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Collapse>

              {/* Submit button */}
              {submitButtonActive && (
                <>
                  <Row className="my-3">
                    <Col sm={4}></Col>
                    <Col sm={4}>
                      <Button className="btn-block" color="success" size="large" type="submit" variant="success">
                        Submit
                      </Button>
                    </Col>
                    <Col sm={4}></Col>
                  </Row>
                </>
              )}
            </fieldset>
          </form>
        )}
      </Formik>
      {loader}
      {sessionStorage.getItem('user_category') === 'Operation Supervisor' ||
      sessionStorage.getItem('user_category') === 'Operation Team' ? (
        <ReferenceBgv referenceData={referenceData} reloadData={handleDataChange} />
      ) : null}
    </React.Fragment>
  );
};

export default Reference;
