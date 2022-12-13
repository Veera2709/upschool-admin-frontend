import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import * as Constants from '../../../../helper/constants';
import { SessionStorage } from '../../../../util/SessionStorage';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { bgvApi, fetchCaseCompDetails } from '../bgv-api/BgvApi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CountryOptions from '../../../../helper/CountryOptions';
import { arrow_keys_handler, handleArrowKey, isEmptyObject, GetYearDifference, splitWithDelimitter } from '../../../../util/utils';
import { getUrl } from '../bgv-api/getUrl';
import { bgvAlerts } from '../bgv-api/bgvAlerts';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { aadharNumberAction } from '../../../../store/aadharNumberAction';
import { caseDetailsAction } from '../../../../store/caseDetailsAction';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
// import BasicDetailsBgv from './verifications/BasicDetailsBgv';

const BasicDetails = ({ className, rest, newUpload }) => {
  const dispatch = useDispatch();
  const [basicDetailsData, setBasicDetailsData] = useState({});
  const aadharRef = useRef('');
  const panRef = useRef('');
  let { case_id } = useParams();
  const [isDisabled, setIsDisabled] = useState(true);
  const [submitButtonActive, setSubmitButtonActive] = useState(true);
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  const _sendBasicInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(basicDetailsData, data, newUpload);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'BasicDetails', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'BasicDetails', case_id);
    console.log('bgv Response', bgvResponse);

    if (bgvResponse.Error) {
      if (newUpload) {
        sweetAlertHandler(bgvAlerts.compInsertError);
      } else {
        sweetAlertHandler(bgvAlerts.compUpdateError);
      }
    } else {
      hideLoader();
      let caseID = bgvResponse.data;
      SessionStorage.setItem('case_id', caseID);
      console.log('aadharRef: ', aadharRef.current.value);
      if (newUpload) {
        SessionStorage.setItem('empName', data.firstName + data.lastName);
        SessionStorage.setItem('empDob', data.empDob);
        SessionStorage.setItem('empFatherName', data.empFatherName);
        SessionStorage.setItem('empAadharNo', data.empAadharNo);
        SessionStorage.setItem('empPanNo', data.empPanNo);
        sweetAlertHandler(bgvAlerts.compInsertSuccess);
      } else {
        sweetAlertHandler(bgvAlerts.compUpdateSuccess);
      }
    }
  };

  const _fetchCaseBasicDetails = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'BasicDetails');
    console.log('caseDataABC', caseData);
    // dispatch(caseDetailsAction(caseData));
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      isEmptyObject(caseData) ? setBasicDetailsData('N.A.') : setBasicDetailsData(caseData);
      if (!newUpload) {
        dispatch(caseDetailsAction(caseData));
      } else {
        return null;
      }
    }
  };

  useLayoutEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseBasicDetails();
    } else {
      setBasicDetailsData('N.A.');
      SessionStorage.removeItem('case_id');
      SessionStorage.removeItem('empName');
      SessionStorage.removeItem('empDob');
      SessionStorage.removeItem('empFatherName');
      SessionStorage.removeItem('empAadharNo');
      SessionStorage.removeItem('empPanNo');
    }
    console.log('newUpload: ', newUpload);
  }, []);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validFirstName)
      .min(2, Constants.BasicDetailsForm.firstNameTooShort)
      .max(50, Constants.BasicDetailsForm.firstNameTooLong)
      .required(Constants.BasicDetailsForm.firstNameRequired),
    lastName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validLastName)
      .min(1, Constants.BasicDetailsForm.lastNameTooShort)
      .max(50, Constants.BasicDetailsForm.lastNameTooLong)
      .required(Constants.BasicDetailsForm.lastNameRequired),
    empGender: Yup.string().required('Required'),
    // empPhone: Yup.string().matches(Constants.BasicDetailsForm.phonRegex, Constants.BasicDetailsForm.valiedPhoneNumber).required(Constants.BasicDetailsForm.empPhoneRequired),
    empPhone: Yup.string()
      .min(10, Constants.BasicDetailsForm.valiedPhoneNumber)
      .max(10, Constants.BasicDetailsForm.valiedPhoneNumber)
      .required(Constants.BasicDetailsForm.empPhoneRequired),
    empEmail: Yup.string().email(Constants.BasicDetailsForm.ValidEmail).max(255).required(Constants.BasicDetailsForm.empEmailRequired),
    empDob: Yup.string().required(Constants.BasicDetailsForm.empDobRequired),
    empFatherName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validFatherName)
      .min(2, Constants.BasicDetailsForm.empFatherNameTooShort)
      .max(50, Constants.BasicDetailsForm.empFatherNameTooLong)
      .required(Constants.BasicDetailsForm.empFatherNameRequired),
    empAadharNo: Yup.string()
      .min(12, Constants.BasicDetailsForm.validAadhar)
      .max(12, Constants.BasicDetailsForm.validAadhar)
      .required(Constants.BasicDetailsForm.empAadharNoRequired),
    empPanNo: Yup.string()
      .matches(Constants.Common.PanRegex, Constants.BasicDetailsForm.validPanNumber)
      .min(10, Constants.BasicDetailsForm.validPanNumber)
      .max(10, Constants.BasicDetailsForm.validPanNumber)
      .required(Constants.BasicDetailsForm.empPanNoRequired),
    empLandmark: Yup.string()
      .min(2, Constants.BasicDetailsForm.landmarkTooShort)
      .max(50, Constants.BasicDetailsForm.landmarkTooLong)
      .required(Constants.BasicDetailsForm.empLandmarkRequired),
    empCity: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.BasicDetailsForm.cityTooShort)
      .max(50, Constants.BasicDetailsForm.cityTooShort)
      .required(Constants.BasicDetailsForm.empCityRequired),
    empState: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validState)
      .min(2, Constants.BasicDetailsForm.stateTooShort)
      .max(50, Constants.BasicDetailsForm.stateTooLong)
      .required(Constants.BasicDetailsForm.empStateRequired),
    empBirthCountry: Yup.string().required(Constants.BasicDetailsForm.empBirthCountryRequired),
    empCitizenship: Yup.string().required(Constants.BasicDetailsForm.empCitizenshipRequired),
    empJoiningDate: Yup.string().required(Constants.BasicDetailsForm.empJoiningDateRequired),
    consentCheckbox: Yup.bool().oneOf([true], Constants.BasicDetailsForm.consentCheckboxRequired)
  });

  return isEmptyObject(basicDetailsData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          firstName: basicDetailsData === 'N.A.' ? '' : basicDetailsData.firstName,
          lastName: basicDetailsData === 'N.A.' ? '' : basicDetailsData.lastName,
          empGender: basicDetailsData === 'N.A.' ? 'Male' : basicDetailsData.empGender,
          empPhone: basicDetailsData === 'N.A.' ? '' : basicDetailsData.empPhone,
          empEmail: basicDetailsData === 'N.A.' ? '' : basicDetailsData.empEmail,
          empDob: basicDetailsData === 'N.A.' ? '' : basicDetailsData.empDob,
          empFatherName: basicDetailsData === 'N.A.' ? '' : basicDetailsData.empFatherName,
          empAadharNo: basicDetailsData === 'N.A.' ? '' : basicDetailsData.empAadharNo,
          empPanNo: basicDetailsData === 'N.A.' ? '' : basicDetailsData.empPanNo,
          empLandmark: basicDetailsData === 'N.A.' ? '' : basicDetailsData.empLandmark,
          empCity: basicDetailsData === 'N.A.' ? '' : basicDetailsData.empCity,
          empState: basicDetailsData === 'N.A.' ? '' : basicDetailsData.empState,
          empBirthCountry: basicDetailsData === 'N.A.' ? '' : basicDetailsData.empBirthCountry,
          empCitizenship: basicDetailsData === 'N.A.' ? '' : basicDetailsData.empCitizenship,
          empJoiningDate: basicDetailsData === 'N.A.' ? '' : basicDetailsData.empJoiningDate,
          consentCheckbox:
            basicDetailsData === 'N.A.'
              ? false
              : basicDetailsData.consentCheckbox === true || basicDetailsData.consentCheckbox === false
              ? basicDetailsData.consentCheckbox
              : false
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          console.log('Submitting');
          console.log('aadharRef: ', aadharRef.current.value);
          dispatch(aadharNumberAction(aadharRef.current.value));
          // calculating age
          let ageDiff = GetYearDifference(splitWithDelimitter(values.empJoiningDate, '-'), splitWithDelimitter(values.empDob, '-'));
          console.log('ageDiff', ageDiff);
          if (ageDiff <= 18) {
            sweetAlertHandler(bgvAlerts.inappropriateAge);
          } else {
            showLoader();
            _sendBasicInfo(values);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <fieldset disabled={isDisabled}>
              <Row>
                <Col sm={12}>
                  <br />
                  <h5>Basic Details</h5>
                  <hr />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>First Name</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.firstName && errors.firstName}
                        name="firstName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.firstName}
                      />
                      {touched.firstName && errors.firstName && <small className="text-danger form-text">{errors.firstName}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Last Name</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.lastName && errors.lastName}
                        name="lastName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.lastName}
                      />
                      {touched.lastName && errors.lastName && <small className="text-danger form-text">{errors.lastName}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Gender</label>
                    </Col>
                    <Col sm={9}>
                      <select
                        className="form-control"
                        error={touched.empGender && errors.empGender}
                        name="empGender"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.empGender}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {touched.empGender && errors.empGender && <small className="text-danger form-text">{errors.empGender}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Phone</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.empPhone && errors.empPhone}
                        name="empPhone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        value={values.empPhone}
                      />
                      {touched.empPhone && errors.empPhone && <small className="text-danger form-text">{errors.empPhone}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Email</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.empEmail && errors.empEmail}
                        name="empEmail"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.empEmail}
                      />
                      {touched.empEmail && errors.empEmail && <small className="text-danger form-text">{errors.empEmail}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Date of birth</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.empDob && errors.empDob}
                        name="empDob"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        value={values.empDob}
                      />
                      {touched.empDob && errors.empDob && <small className="text-danger form-text">{errors.empDob}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Father's Name</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.empFatherName && errors.empFatherName}
                        name="empFatherName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.empFatherName}
                      />
                      {touched.empFatherName && errors.empFatherName && (
                        <small className="text-danger form-text">{errors.empFatherName}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Aadhar No</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.empAadharNo && errors.empAadharNo}
                        name="empAadharNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        value={values.empAadharNo}
                        ref={aadharRef}
                      />
                      {touched.empAadharNo && errors.empAadharNo && <small className="text-danger form-text">{errors.empAadharNo}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Pan No</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.empPanNo && errors.empPanNo}
                        name="empPanNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="string"
                        value={values.empPanNo}
                        ref={panRef}
                      />
                      {touched.empPanNo && errors.empPanNo && <small className="text-danger form-text">{errors.empPanNo}</small>}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Landmark</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.empLandmark && errors.empLandmark}
                        name="empLandmark"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.empLandmark}
                      />
                      {touched.empLandmark && errors.empLandmark && <small className="text-danger form-text">{errors.empLandmark}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>City</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.empCity && errors.empCity}
                        name="empCity"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.empCity}
                      />
                      {touched.empCity && errors.empCity && <small className="text-danger form-text">{errors.empCity}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>State</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.empState && errors.empState}
                        name="empState"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.empState}
                      />
                      {touched.empState && errors.empState && <small className="text-danger form-text">{errors.empState}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Country of birth</label>
                    </Col>
                    <Col sm={9}>
                      <select
                        className="form-control"
                        error={touched.empBirthCountry && errors.empBirthCountry}
                        name="empBirthCountry"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.empBirthCountry}
                      >
                        <CountryOptions />
                      </select>
                      {touched.empBirthCountry && errors.empBirthCountry && (
                        <small className="text-danger form-text">{errors.empBirthCountry}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Citizenship</label>
                    </Col>
                    <Col sm={9}>
                      <select
                        className="form-control"
                        error={touched.empCitizenship && errors.empCitizenship}
                        name="empCitizenship"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.empCitizenship}
                      >
                        <CountryOptions />
                      </select>
                      {touched.empCitizenship && errors.empCitizenship && (
                        <small className="text-danger form-text">{errors.empCitizenship}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Date of joining</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.empJoiningDate && errors.empJoiningDate}
                        name="empJoiningDate"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        value={values.empJoiningDate}
                      />
                      {touched.empJoiningDate && errors.empJoiningDate && (
                        <small className="text-danger form-text">{errors.empJoiningDate}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={1}>
                      <input
                        className=""
                        error={touched.consentCheckbox && errors.consentCheckbox}
                        name="consentCheckbox"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="checkbox"
                        value={values.consentCheckbox}
                        checked={values.consentCheckbox === true}
                      />
                    </Col>
                    <Col sm={11}>
                      <label style={{ fontSize: '10px' }}>
                        I, hereby authorize all corportations, former employees, credit agencies, educational institutions, law enforcement
                        agencies, city , state, country and federal courts and military services to release information about my background
                        including but not limited to information about my employment, education, credit history, driving records, general
                        public records to the person or company with which the form has been filled or their assiged agents thereof. My
                        consent, below releases the aforesaid parties ot the company or the individuals releasing the information from any
                        liability whatsoever in collecting and disseminating the information obtained. Further, in accordance with the host
                        nation laws regarding the release of information, the Data Protection Privacy Act, the European Privacy Act and
                        others, I authorize the transmittal and release of information to FactoVerify and my employer in any country.
                      </label>
                      {touched.consentCheckbox && errors.consentCheckbox && (
                        <small className="text-danger form-text">{errors.consentCheckbox}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
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
      {/* {sessionStorage.getItem("user_category") === "Operation Supervisor" || sessionStorage.getItem("user_category") === "Operation Team" ? <BasicDetailsBgv basicDetailsData={basicDetailsData}  /> : null} */}
    </React.Fragment>
  );
};

export default BasicDetails;
