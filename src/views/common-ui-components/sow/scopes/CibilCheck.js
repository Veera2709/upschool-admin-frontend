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
import CibilCheckBgv from './verifications/CibilCheckBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import * as Constants from '../../../../helper/constants';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const CibilCheck = ({ className, rest, newUpload }) => {
  const [cibilCheckData, setCibilCheckData] = useState({});
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

  const _sendCibilInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(cibilCheckData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'CibilCheck', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'CibilCheck', case_id);
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

  const _fetchCaseCibilCheck = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'CibilCheck');
    console.log('cibil caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setCibilCheckData("N.A.") : setCibilCheckData(caseData);
      if (isEmptyObject(caseData)) {
        setCibilCheckData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setCibilCheckData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseCibilCheck();
    } else {
      setCibilCheckData('N.A.');
    }
  }, [loadAgain]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.cibilCheckForm.nameAlphabets)
      .min(2, Constants.cibilCheckForm.nameTooShort)
      .max(50, Constants.cibilCheckForm.nameTooLong)
      .trim()
      .required(Constants.cibilCheckForm.nameRequired),
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

  return isEmptyObject(cibilCheckData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          name: cibilCheckData === 'N.A.' ? '' : cibilCheckData.name,
          fatherName: cibilCheckData === 'N.A.' ? '' : cibilCheckData.fatherName,
          dob: cibilCheckData === 'N.A.' ? '' : cibilCheckData.dob,
          panNo: cibilCheckData === 'N.A.' ? '' : cibilCheckData.panNo,
          cibilCheckFile: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          console.log('Submitting');

          let allFilesData = [];
          const fileNameArray = ['cibilCheckFile'];

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
            _sendCibilInfo(values);
            showLoader();
          } else {
            if (areFilesInvalid(allFilesData) !== 0) {
              sweetAlertHandler(bgvAlerts.invalidFilesPresent);
            } else {
              _sendCibilInfo(values);
              showLoader();
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
                  <h5>Cibil Check</h5>
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
                        error={touched.cibilCheckFile && errors.cibilCheckFile}
                        name="cibilCheckFile"
                        id="cibilCheckFile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.cibilCheckFile}
                      />
                      {cibilCheckData !== 'N.A.' && cibilCheckData.cibilCheckFile !== '' && cibilCheckData.cibilCheckFileURL !== '' ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={cibilCheckData.cibilCheckFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.cibilCheckFile && errors.cibilCheckFile && (
                        <small className="text-danger form-text">{errors.cibilCheckFile}</small>
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
        <CibilCheckBgv cibilCheckData={cibilCheckData} reloadData={handleDataChange} />
      ) : null}
      {loader}
    </React.Fragment>
  );
};

export default CibilCheck;
