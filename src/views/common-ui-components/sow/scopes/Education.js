import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Collapse } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import * as Constants from '../../../../helper/constants';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { bgvApi, fetchCaseCompDetails } from '../bgv-api/BgvApi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { isEmptyObject } from '../../../../util/utils';
import { getUrl } from '../bgv-api/getUrl';
import { bgvAlerts } from '../bgv-api/bgvAlerts';
import EducationBgv from './verifications/EducationBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const Education = ({ className, rest, newUpload }) => {
  const [educationData, setEducationData] = useState({});
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

  const _sendEducationInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(educationData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'Education', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'Education', case_id);
    console.log('bgv Response', bgvResponse);

    if (bgvResponse.Error) {
      if (newUpload) {
        hideLoader();
        sweetAlertHandler(bgvAlerts.compInsertError);
      } else {
        hideLoader();
        sweetAlertHandler(bgvAlerts.compUpdateError);
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

          console.log({ tempObj });

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

  const _fetchCaseEducation = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'Education');
    console.log('education caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setEducationData("N.A.") : setEducationData(caseData);
      if (isEmptyObject(caseData)) {
        setEducationData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setEducationData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseEducation();
    } else {
      setEducationData('N.A.');
    }
  }, [loadAgain]);

  const validationSchema = Yup.object().shape({
    collegeName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.EducationForm.validCollegeName)
      .min(2, Constants.EducationForm.collegeNameTooShort)
      .max(50, Constants.EducationForm.collegeNameTooLong)
      .required(Constants.EducationForm.collegeNameRequired),
    univName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.EducationForm.validUniName)
      .min(2, Constants.EducationForm.univNameTooShort)
      .max(50, Constants.EducationForm.univNameTooLong)
      .required(Constants.EducationForm.univNameRequired),
    instEmail: Yup.string().email(Constants.EducationForm.validEmail).required(Constants.EducationForm.validEmail),
    city: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.EducationForm.validCity)
      .min(2, Constants.EducationForm.cityTooShort)
      .max(50, Constants.EducationForm.cityTooLong)
      .required(Constants.EducationForm.cityRequired),
    postalCode: Yup.string()
      .matches(Constants.EducationForm.postalCodeRegex, Constants.EducationForm.valiedPostalCode)
      .required(Constants.EducationForm.postalCodeRequired),
    telNo: Yup.string()
      .min(10, Constants.BasicDetailsForm.valiedPhoneNumber)
      .max(10, Constants.BasicDetailsForm.valiedPhoneNumber)
      .required(Constants.EducationForm.telNoRequired),
    qualification: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.EducationForm.validQualification)
      .min(2, Constants.EducationForm.qualificationTooShort)
      .max(50, Constants.EducationForm.qualificationTooLong)
      .required(Constants.EducationForm.qualificationRequired),
    studyPeriod: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.EducationForm.validStudyPeriod)
      .max(50, 'Too Long!')
      .required(Constants.EducationForm.studyPeriodRequired),
    rollNo: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.EducationForm.validrollNo)
      .required(Constants.EducationForm.rollNoRequired),
    percentage: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.EducationForm.validPercentage)
      .required(Constants.EducationForm.percentageRequired),

    collegeNameTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.EducationForm.validCollegeName)
      .min(2, Constants.EducationForm.collegeNameTooShort)
      .max(50, Constants.EducationForm.collegeNameTooLong),
    univNameTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.EducationForm.validUniName)
      .min(2, Constants.EducationForm.collegeNameTooShort)
      .max(50, Constants.EducationForm.collegeNameTooLong),
    instEmailTwo: Yup.string().email(Constants.EducationForm.validEmail),
    cityTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.EducationForm.validCity)
      .min(2, Constants.EducationForm.cityTooShort)
      .max(50, Constants.EducationForm.cityTooLong),
    postalCodeTwo: Yup.string().matches(Constants.EducationForm.postalCodeRegex, Constants.EducationForm.valiedPostalCode),
    telNoTwo: Yup.string().min(10, Constants.BasicDetailsForm.valiedPhoneNumber).max(10, Constants.BasicDetailsForm.valiedPhoneNumber),
    qualificationTwo: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.EducationForm.validQualification)
      .min(2, Constants.EducationForm.qualificationTooShort)
      .max(50, Constants.EducationForm.qualificationTooLong),
    studyPeriodTwo: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.EducationForm.validStudyPeriod).max(50, 'Too Long!'),
    rollNoTwo: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.EducationForm.validrollNo),
    percentageTwo: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.EducationForm.validPercentage),

    collegeNameThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.EducationForm.validCollegeName)
      .min(2, Constants.EducationForm.collegeNameTooShort)
      .max(50, Constants.EducationForm.collegeNameTooLong),
    univNameThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.EducationForm.validUniName)
      .min(2, Constants.EducationForm.collegeNameTooShort)
      .max(50, Constants.EducationForm.collegeNameTooLong),
    instEmailThree: Yup.string().email(Constants.EducationForm.validEmail),
    cityThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.EducationForm.validCity)
      .min(2, Constants.EducationForm.cityTooShort)
      .max(50, Constants.EducationForm.cityTooLong),
    postalCodeThree: Yup.string().matches(Constants.EducationForm.postalCodeRegex, Constants.EducationForm.valiedPostalCode),
    telNoThree: Yup.string().min(10, Constants.BasicDetailsForm.valiedPhoneNumber).max(10, Constants.BasicDetailsForm.valiedPhoneNumber),
    qualificationThree: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.EducationForm.validQualification)
      .min(2, Constants.EducationForm.qualificationTooShort)
      .max(50, Constants.EducationForm.qualificationTooLong),
    studyPeriodThree: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.EducationForm.validStudyPeriod)
      .max(50, 'Too Long!'),
    rollNoThree: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.EducationForm.validrollNo),
    percentageThree: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.EducationForm.validPercentage)
  });

  return isEmptyObject(educationData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          collegeName:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailOne) ? '' : educationData.educationDetailOne.collegeName,
          univName:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailOne) ? '' : educationData.educationDetailOne.univName,
          instEmail:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailOne) ? '' : educationData.educationDetailOne.instEmail,
          city: educationData === 'N.A.' || isEmptyObject(educationData.educationDetailOne) ? '' : educationData.educationDetailOne.city,
          postalCode:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailOne) ? '' : educationData.educationDetailOne.postalCode,
          telNo: educationData === 'N.A.' || isEmptyObject(educationData.educationDetailOne) ? '' : educationData.educationDetailOne.telNo,
          qualification:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailOne)
              ? ''
              : educationData.educationDetailOne.qualification,
          studyPeriod:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailOne) ? '' : educationData.educationDetailOne.studyPeriod,
          rollNo:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailOne) ? '' : educationData.educationDetailOne.rollNo,
          percentage:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailOne) ? '' : educationData.educationDetailOne.percentage,
          marksheetFile1: '',
          certificateFile1: '',

          collegeNameTwo:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailTwo) ? '' : educationData.educationDetailTwo.collegeName,
          univNameTwo:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailTwo) ? '' : educationData.educationDetailTwo.univName,
          instEmailTwo:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailTwo) ? '' : educationData.educationDetailTwo.instEmail,
          cityTwo: educationData === 'N.A.' || isEmptyObject(educationData.educationDetailTwo) ? '' : educationData.educationDetailTwo.city,
          postalCodeTwo:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailTwo) ? '' : educationData.educationDetailTwo.postalCode,
          telNoTwo:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailTwo) ? '' : educationData.educationDetailTwo.telNo,
          qualificationTwo:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailTwo)
              ? ''
              : educationData.educationDetailTwo.qualification,
          studyPeriodTwo:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailTwo) ? '' : educationData.educationDetailTwo.studyPeriod,
          rollNoTwo:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailTwo) ? '' : educationData.educationDetailTwo.rollNo,
          percentageTwo:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailTwo) ? '' : educationData.educationDetailTwo.percentage,
          marksheetFile2: '',
          certificateFile2: '',

          collegeNameThree:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailThree)
              ? ''
              : educationData.educationDetailThree.collegeName,
          univNameThree:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailThree)
              ? ''
              : educationData.educationDetailThree.univName,
          instEmailThree:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailThree)
              ? ''
              : educationData.educationDetailThree.instEmail,
          cityThree:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailThree) ? '' : educationData.educationDetailThree.city,
          postalCodeThree:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailThree)
              ? ''
              : educationData.educationDetailThree.postalCode,
          telNoThree:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailThree) ? '' : educationData.educationDetailThree.telNo,
          qualificationThree:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailThree)
              ? ''
              : educationData.educationDetailThree.qualification,
          studyPeriodThree:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailThree)
              ? ''
              : educationData.educationDetailThree.studyPeriod,
          rollNoThree:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailThree) ? '' : educationData.educationDetailThree.rollNo,
          percentageThree:
            educationData === 'N.A.' || isEmptyObject(educationData.educationDetailThree)
              ? ''
              : educationData.educationDetailThree.percentage,
          marksheetFile3: '',
          certificateFile3: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          console.log('Submitting');

          const combinedValues = {
            educationDetailOne: {
              collegeName: values.collegeName,
              univName: values.univName,
              instEmail: values.instEmail,
              city: values.city,
              postalCode: values.postalCode,
              telNo: values.telNo,
              qualification: values.qualification,
              studyPeriod: values.studyPeriod,
              rollNo: values.rollNo,
              percentage: values.percentage,
              marksheetFile: values.marksheetFile1,
              certificateFile: values.certificateFile1
            },
            educationDetailTwo: {
              collegeName: values.collegeNameTwo,
              univName: values.univNameTwo,
              instEmail: values.instEmailTwo,
              city: values.cityTwo,
              postalCode: values.postalCodeTwo,
              telNo: values.telNoTwo,
              qualification: values.qualificationTwo,
              studyPeriod: values.studyPeriodTwo,
              rollNo: values.rollNoTwo,
              percentage: values.percentageTwo,
              marksheetFile: values.marksheetFile2,
              certificateFile: values.certificateFile2
            },
            educationDetailThree: {
              collegeName: values.collegeNameThree,
              univName: values.univNameThree,
              instEmail: values.instEmailThree,
              city: values.cityThree,
              postalCode: values.postalCodeThree,
              telNo: values.telNoThree,
              qualification: values.qualificationThree,
              studyPeriod: values.studyPeriodThree,
              rollNo: values.rollNoThree,
              percentage: values.percentageThree,
              marksheetFile: values.marksheetFile3,
              certificateFile: values.certificateFile3
            }
          };

          if (
            combinedValues.educationDetailOne.collegeName === '' ||
            combinedValues.educationDetailOne.univName === '' ||
            combinedValues.educationDetailOne.city === '' ||
            combinedValues.educationDetailOne.postalCode === '' ||
            combinedValues.educationDetailOne.telNo === '' ||
            combinedValues.educationDetailOne.qualification === '' ||
            combinedValues.educationDetailOne.studyPeriod === '' ||
            combinedValues.educationDetailOne.rollNo === '' ||
            combinedValues.educationDetailOne.percentage === ''
          ) {
            combinedValues.educationDetailOne = {};
          }

          if (
            combinedValues.educationDetailTwo.collegeName === '' ||
            combinedValues.educationDetailTwo.univName === '' ||
            combinedValues.educationDetailTwo.city === '' ||
            combinedValues.educationDetailTwo.postalCode === '' ||
            combinedValues.educationDetailTwo.telNo === '' ||
            combinedValues.educationDetailTwo.qualification === '' ||
            combinedValues.educationDetailTwo.studyPeriod === '' ||
            combinedValues.educationDetailTwo.rollNo === '' ||
            combinedValues.educationDetailTwo.percentage === ''
          ) {
            combinedValues.educationDetailTwo = {};
          }

          if (
            combinedValues.educationDetailThree.collegeName === '' ||
            combinedValues.educationDetailThree.univName === '' ||
            combinedValues.educationDetailThree.city === '' ||
            combinedValues.educationDetailThree.postalCode === '' ||
            combinedValues.educationDetailThree.telNo === '' ||
            combinedValues.educationDetailThree.qualification === '' ||
            combinedValues.educationDetailThree.studyPeriod === '' ||
            combinedValues.educationDetailThree.rollNo === '' ||
            combinedValues.educationDetailThree.percentage === ''
          ) {
            combinedValues.educationDetailThree = {};
          }

          let allFilesData = [];
          const fileNameArray = [
            'marksheetFile1',
            'certificateFile1',
            'marksheetFile2',
            'certificateFile2',
            'marksheetFile3',
            'certificateFile3'
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
            console.log(combinedValues);
            showLoader();
            _sendEducationInfo(combinedValues);
          } else {
            if (areFilesInvalid(allFilesData) !== 0) {
              sweetAlertHandler(bgvAlerts.invalidFilesPresent);
            } else {
              console.log(combinedValues);
              showLoader();
              _sendEducationInfo(combinedValues);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <fieldset disabled={isDisabled}>
              <Row>
                <Col sm={12}>
                  <br />
                  <h5>Education 1</h5>
                  <hr />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>College Name</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.collegeName && errors.collegeName}
                        name="collegeName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.collegeName}
                      />
                      {touched.collegeName && errors.collegeName && <small className="text-danger form-text">{errors.collegeName}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>University Name</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.univName && errors.univName}
                        name="univName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.univName}
                      />
                      {touched.univName && errors.univName && <small className="text-danger form-text">{errors.univName}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Institution Email</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.instEmail && errors.instEmail}
                        name="instEmail"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="email"
                        value={values.instEmail}
                      />
                      {touched.instEmail && errors.instEmail && <small className="text-danger form-text">{errors.instEmail}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>City</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.city && errors.city}
                        name="city"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.city}
                      />
                      {touched.city && errors.city && <small className="text-danger form-text">{errors.city}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Postal Code</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.postalCode && errors.postalCode}
                        name="postalCode"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        value={values.postalCode}
                      />
                      {touched.postalCode && errors.postalCode && <small className="text-danger form-text">{errors.postalCode}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Telephone No</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.telNo && errors.telNo}
                        name="telNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        value={values.telNo}
                      />
                      {touched.telNo && errors.telNo && <small className="text-danger form-text">{errors.telNo}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Qualification</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.qualification && errors.qualification}
                        name="qualification"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.qualification}
                      />
                      {touched.qualification && errors.qualification && (
                        <small className="text-danger form-text">{errors.qualification}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Study Period</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.studyPeriod && errors.studyPeriod}
                        name="studyPeriod"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.studyPeriod}
                      />
                      {touched.studyPeriod && errors.studyPeriod && <small className="text-danger form-text">{errors.studyPeriod}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Roll No / Student Id</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.rollNo && errors.rollNo}
                        name="rollNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.rollNo}
                      />
                      {touched.rollNo && errors.rollNo && <small className="text-danger form-text">{errors.rollNo}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Class / Division / Percentage</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.percentage && errors.percentage}
                        name="percentage"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.percentage}
                      />
                      {touched.percentage && errors.percentage && <small className="text-danger form-text">{errors.percentage}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Attach corresponding marksheet</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.marksheetFile1 && errors.marksheetFile1}
                        name="marksheetFile1"
                        id="marksheetFile1"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.marksheetFile1}
                      />
                      {educationData !== 'N.A.' &&
                      educationData.educationDetailOne.marksheetFile !== '' &&
                      educationData.educationDetailOne.marksheetFileURL ? (
                        <small
                          style={{ cursor: 'pointer' }}
                          // onClick={() => downloadFile(educationData.marksheetFile1)}
                          className="text-primary form-text"
                        >
                          <a href={educationData.educationDetailOne.marksheetFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                          {/* Download existing image */}
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.marksheetFile1 && errors.marksheetFile1 && (
                        <small className="text-danger form-text">{errors.marksheetFile1}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Attach corresponding certificate</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.certificateFile1 && errors.certificateFile1}
                        name="certificateFile1"
                        id="certificateFile1"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.certificateFile1}
                      />
                      {educationData !== 'N.A.' &&
                      educationData.educationDetailOne.certificateFile !== '' &&
                      educationData.educationDetailOne.certificateFileURL !== '' ? (
                        <small
                          style={{ cursor: 'pointer' }}
                          // onClick={() => downloadFile(educationData.certificateFile1)}
                          className="text-primary form-text"
                        >
                          <a href={educationData.educationDetailOne.certificateFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                          {/* Download existing image */}
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.certificateFile1 && errors.certificateFile1 && (
                        <small className="text-danger form-text">{errors.certificateFile1}</small>
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
                      <h5>Education 2</h5>
                      <hr />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>College Name</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.collegeNameTwo && errors.collegeNameTwo}
                            name="collegeNameTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.collegeNameTwo}
                          />
                          {touched.collegeNameTwo && errors.collegeNameTwo && (
                            <small className="text-danger form-text">{errors.collegeNameTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>University Name</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.univNameTwo && errors.univNameTwo}
                            name="univNameTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.univNameTwo}
                          />
                          {touched.univNameTwo && errors.univNameTwo && (
                            <small className="text-danger form-text">{errors.univNameTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Institution Email</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.instEmailTwo && errors.instEmailTwo}
                            name="instEmailTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="email"
                            value={values.instEmailTwo}
                          />
                          {touched.instEmailTwo && errors.instEmailTwo && (
                            <small className="text-danger form-text">{errors.instEmailTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>City</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.cityTwo && errors.cityTwo}
                            name="cityTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.cityTwo}
                          />
                          {touched.cityTwo && errors.cityTwo && <small className="text-danger form-text">{errors.cityTwo}</small>}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Postal Code</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.postalCodeTwo && errors.postalCodeTwo}
                            name="postalCodeTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.postalCodeTwo}
                          />
                          {touched.postalCodeTwo && errors.postalCodeTwo && (
                            <small className="text-danger form-text">{errors.postalCodeTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Telephone No</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.telNoTwo && errors.telNoTwo}
                            name="telNoTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.telNoTwo}
                          />
                          {touched.telNoTwo && errors.telNoTwo && <small className="text-danger form-text">{errors.telNoTwo}</small>}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Qualification</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.qualificationTwo && errors.qualificationTwo}
                            name="qualificationTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.qualificationTwo}
                          />
                          {touched.qualificationTwo && errors.qualificationTwo && (
                            <small className="text-danger form-text">{errors.qualificationTwo}</small>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Study Period</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.studyPeriodTwo && errors.studyPeriodTwo}
                            name="studyPeriodTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.studyPeriodTwo}
                          />
                          {touched.studyPeriodTwo && errors.studyPeriodTwo && (
                            <small className="text-danger form-text">{errors.studyPeriodTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Roll No / Student Id</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.rollNoTwo && errors.rollNoTwo}
                            name="rollNoTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.rollNoTwo}
                          />
                          {touched.rollNoTwo && errors.rollNoTwo && <small className="text-danger form-text">{errors.rollNoTwo}</small>}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Class / Division / Percentage</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.percentageTwo && errors.percentageTwo}
                            name="percentageTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.percentageTwo}
                          />
                          {touched.percentageTwo && errors.percentageTwo && (
                            <small className="text-danger form-text">{errors.percentageTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Attach corresponding marksheet</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.marksheetFile2 && errors.marksheetFile2}
                            name="marksheetFile2"
                            id="marksheetFile2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.marksheetFile2}
                          />
                          {educationData !== 'N.A.' &&
                          educationData.educationDetailTwo.marksheetFile !== '' &&
                          educationData.educationDetailTwo.marksheetFileURL ? (
                            <small
                              style={{ cursor: 'pointer' }}
                              // onClick={() => downloadFile(educationData.marksheetFile2)}
                              className="text-primary form-text"
                            >
                              <a href={educationData.educationDetailTwo.marksheetFileURL} target="_blank" rel="noopener noreferrer">
                                {Constants.Common.ViewExistingFile}
                              </a>
                              {/* Download existing image */}
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.marksheetFile2 && errors.marksheetFile2 && (
                            <small className="text-danger form-text">{errors.marksheetFile2}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Attach corresponding certificate</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.certificateFile2 && errors.certificateFile2}
                            name="certificateFile2"
                            id="certificateFile2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.certificateFile2}
                          />
                          {educationData !== 'N.A.' &&
                          educationData.educationDetailTwo.certificateFile !== '' &&
                          educationData.educationDetailTwo.certificateFileURL ? (
                            <small
                              style={{ cursor: 'pointer' }}
                              // onClick={() => downloadFile(educationData.certificateFile2)}
                              className="text-primary form-text"
                            >
                              <a href={educationData.educationDetailTwo.certificateFileURL} target="_blank" rel="noopener noreferrer">
                                {Constants.Common.ViewExistingFile}
                              </a>
                              {/* Download existing image */}
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.certificateFile2 && errors.certificateFile2 && (
                            <small className="text-danger form-text">{errors.certificateFile2}</small>
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
                      <h5>Education 3</h5>
                      <hr />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>College Name</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.collegeNameThree && errors.collegeNameThree}
                            name="collegeNameThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.collegeNameThree}
                          />
                          {touched.collegeNameThree && errors.collegeNameThree && (
                            <small className="text-danger form-text">{errors.collegeNameThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>University Name</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.univNameThree && errors.univNameThree}
                            name="univNameThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.univNameThree}
                          />
                          {touched.univNameThree && errors.univNameThree && (
                            <small className="text-danger form-text">{errors.univNameThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Institution Email</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.instEmailThree && errors.instEmailThree}
                            name="instEmailThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="email"
                            value={values.instEmailThree}
                          />
                          {touched.instEmailThree && errors.instEmailThree && (
                            <small className="text-danger form-text">{errors.instEmailThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>City</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.cityThree && errors.cityThree}
                            name="cityThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.cityThree}
                          />
                          {touched.cityThree && errors.cityThree && <small className="text-danger form-text">{errors.cityThree}</small>}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Postal Code</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.postalCodeThree && errors.postalCodeThree}
                            name="postalCodeThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.postalCodeThree}
                          />
                          {touched.postalCodeThree && errors.postalCodeThree && (
                            <small className="text-danger form-text">{errors.postalCodeThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Telephone No</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.telNoThree && errors.telNoThree}
                            name="telNoThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.telNoThree}
                          />
                          {touched.telNoThree && errors.telNoThree && <small className="text-danger form-text">{errors.telNoThree}</small>}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Qualification</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.qualificationThree && errors.qualificationThree}
                            name="qualificationThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.qualificationThree}
                          />
                          {touched.qualificationThree && errors.qualificationThree && (
                            <small className="text-danger form-text">{errors.qualificationThree}</small>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Study Period</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.studyPeriodThree && errors.studyPeriodThree}
                            name="studyPeriodThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.studyPeriodThree}
                          />
                          {touched.studyPeriodThree && errors.studyPeriodThree && (
                            <small className="text-danger form-text">{errors.studyPeriodThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Roll No / Student Id</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.rollNoThree && errors.rollNoThree}
                            name="rollNoThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.rollNoThree}
                          />
                          {touched.rollNoThree && errors.rollNoThree && (
                            <small className="text-danger form-text">{errors.rollNoThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Class / Division / Percentage</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.percentageThree && errors.percentageThree}
                            name="percentageThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.percentageThree}
                          />
                          {touched.percentageThree && errors.percentageThree && (
                            <small className="text-danger form-text">{errors.percentageThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Attach corresponding marksheet</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.marksheetFile3 && errors.marksheetFile3}
                            name="marksheetFile3"
                            id="marksheetFile3"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.marksheetFile3}
                          />
                          {educationData !== 'N.A.' &&
                          educationData.educationDetailThree.marksheetFile !== '' &&
                          educationData.educationDetailThree.marksheetFileURL ? (
                            <small
                              style={{ cursor: 'pointer' }}
                              // onClick={() => downloadFile(educationData.marksheetFile3)}
                              className="text-primary form-text"
                            >
                              <a href={educationData.educationDetailThree.marksheetFileURL} target="_blank" rel="noopener noreferrer">
                                {Constants.Common.ViewExistingFile}
                              </a>
                              {/* Download existing image */}
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.marksheetFile3 && errors.marksheetFile3 && (
                            <small className="text-danger form-text">{errors.marksheetFile3}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Attach corresponding certificate</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.certificateFile3 && errors.certificateFile3}
                            name="certificateFile3"
                            id="certificateFile3"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.certificateFile3}
                          />
                          {educationData !== 'N.A.' &&
                          educationData.educationDetailThree.certificateFile !== '' &&
                          educationData.educationDetailThree.certificateFileURL ? (
                            <small
                              style={{ cursor: 'pointer' }}
                              // onClick={() => downloadFile(educationData.certificateFile3)}
                              className="text-primary form-text"
                            >
                              <a href={educationData.educationDetailThree.certificateFileURL} target="_blank" rel="noopener noreferrer">
                                {Constants.Common.ViewExistingFile}
                              </a>
                              {/* Download existing image */}
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.certificateFile3 && errors.certificateFile3 && (
                            <small className="text-danger form-text">{errors.certificateFile3}</small>
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
        <EducationBgv educationData={educationData} reloadData={handleDataChange} />
      ) : null}
    </React.Fragment>
  );
};

export default Education;
