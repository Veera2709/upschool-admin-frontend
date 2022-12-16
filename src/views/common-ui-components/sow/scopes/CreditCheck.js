import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { bgvApi, fetchCaseCompDetails } from '../bgv-api/BgvApi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { isEmptyObject } from '../../../../util/utils';
import { getUrl } from '../bgv-api/getUrl';
import { bgvAlerts } from '../bgv-api/bgvAlerts';
import CreditCheckBgv from './verifications/CreditCheckBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import * as Constants from '../../../../helper/constants';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const CreditCheck = ({ className, rest, newUpload }) => {
  const [creditCheckData, setCreditCheckData] = useState({});
  let { case_id } = useParams();
  const [isDisabled, setIsDisabled] = useState(true);
  const [submitButtonActive, setSubmitButtonActive] = useState(true);
  const [editClientButInsert, setEditClientButInsert] = useState(false);
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

  const _sendCreditInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(creditCheckData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'CreditCheck', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'CreditCheck', case_id);
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

  const _fetchCaseCreditCheck = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'CreditCheck');
    console.log('credit caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setCreditCheckData("N.A.") : setCreditCheckData(caseData);
      if (isEmptyObject(caseData)) {
        setCreditCheckData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setCreditCheckData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseCreditCheck();
    } else {
      setCreditCheckData('N.A.');
    }
  }, [loadAgain]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.creditCheckForm.nameAlphabets)
      .min(2, Constants.creditCheckForm.nameTooShort)
      .max(50, Constants.creditCheckForm.nameTooLong)
      .trim()
      .required(Constants.creditCheckForm.nameRequired),
    fatherName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validFatherName)
      .min(2, Constants.BasicDetailsForm.empFatherNameTooShort)
      .max(50, Constants.BasicDetailsForm.empFatherNameTooLong)
      .trim()
      .required(Constants.BasicDetailsForm.empFatherNameRequired),
    dob: Yup.string().required(Constants.BasicDetailsForm.empDobRequired),
    panNo: Yup.string()
      .matches(Constants.Common.PanRegex, Constants.BasicDetailsForm.validPanNumber)
      .min(10, Constants.BasicDetailsForm.validPanNumber)
      .max(10, Constants.BasicDetailsForm.validPanNumber)
      .required(Constants.BasicDetailsForm.empPanNoRequired)
  });

  return isEmptyObject(creditCheckData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          name: creditCheckData === 'N.A.' ? '' : creditCheckData.name,
          fatherName: creditCheckData === 'N.A.' ? '' : creditCheckData.fatherName,
          dob: creditCheckData === 'N.A.' ? '' : creditCheckData.dob,
          panNo: creditCheckData === 'N.A.' ? '' : creditCheckData.panNo,
          creditCheckFile: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          console.log('Submitting');

          let allFilesData = [];
          const fileNameArray = ['creditCheckFile'];

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
            showLoader();
            _sendCreditInfo(values);
          } else {
            if (areFilesInvalid(allFilesData) !== 0) {
              sweetAlertHandler(bgvAlerts.invalidFilesPresent);
            } else {
              showLoader();
              _sendCreditInfo(values);
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
                  <h5>Credit Check</h5>
                  <hr />
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Name</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.name && errors.name}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.name}
                      />
                      {touched.name && errors.name && <small className="text-danger form-text">{errors.name}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Father's Name</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.fatherName && errors.fatherName}
                        name="fatherName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.fatherName}
                      />
                      {touched.fatherName && errors.fatherName && <small className="text-danger form-text">{errors.fatherName}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Date of birth</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.dob && errors.dob}
                        name="dob"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        value={values.dob}
                      />
                      {touched.dob && errors.dob && <small className="text-danger form-text">{errors.dob}</small>}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Pan No</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.panNo && errors.panNo}
                        name="panNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="string"
                        value={values.panNo}
                      />
                      {touched.panNo && errors.panNo && <small className="text-danger form-text">{errors.panNo}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>PAN card upload</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.creditCheckFile && errors.creditCheckFile}
                        name="creditCheckFile"
                        id="creditCheckFile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.creditCheckFile}
                      />
                      {creditCheckData !== 'N.A.' && creditCheckData.creditCheckFile !== '' && creditCheckData.creditCheckFileURL !== '' ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={creditCheckData.creditCheckFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.creditCheckFile && errors.creditCheckFile && (
                        <small className="text-danger form-text">{errors.creditCheckFile}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col sm={3}></Col>
                <Col sm={3}></Col>
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
      {sessionStorage.getItem('user_category') === 'Operation Supervisor' ||
      sessionStorage.getItem('user_category') === 'Operation Team' ? (
        <CreditCheckBgv creditCheckData={creditCheckData} reloadData={handleDataChange} />
      ) : null}
      {loader}
    </React.Fragment>
  );
};

export default CreditCheck;
