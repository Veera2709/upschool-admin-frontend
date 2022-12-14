import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
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
import IdentificationBgv from './verifications/IdentificationBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';

import useFullPageLoader from '../../../../helper/useFullPageLoader';

const Identification = ({ className, rest, newUpload }) => {
  const [idCheckData, setIdCheckData] = useState({});
  let { case_id } = useParams();
  const [isDisabled, setIsDisabled] = useState(true);
  const [submitButtonActive, setSubmitButtonActive] = useState(true);
  const [editClientButInsert, setEditClientButInsert] = useState(false);
  const [loadAgain, setLoadAgain] = useState(false);
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const basicDetails = useSelector((state) => state?.caseDetailsData);

  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  const _sendIdInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(idCheckData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'Identification', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'Identification', case_id);
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

  const _fetchCaseIdTest = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'Identification');
    console.log('id caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setIdCheckData("N.A.") : setIdCheckData(caseData);
      if (isEmptyObject(caseData)) {
        setIdCheckData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setIdCheckData(caseData);
      }
    }
  };

  const aadharNumber = useSelector((state) => state.aadharNumber.state);

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseIdTest();
    } else {
      setIdCheckData('N.A.');
    }
  }, [loadAgain]);
  // https://www.geeksforgeeks.org/javascript-ternary-operator/

  useEffect(() => {}, [basicDetails.Id]);

  return isEmptyObject(idCheckData) ? null : (
    <>
      <Formik
        initialValues={{
          aadharNameOnCard: idCheckData === 'N.A.' ? '' : idCheckData.aadharNameOnCard,
          aadharDob: idCheckData === 'N.A.' ? '' : idCheckData.aadharDob,
          aadharNo: idCheckData === 'N.A.' ? '' : idCheckData.aadharNo,
          aadharFile: '',

          panNameOnCard: idCheckData === 'N.A.' ? '' : idCheckData.panNameOnCard,
          panDob: idCheckData === 'N.A.' ? '' : idCheckData.panDob,
          panNo: idCheckData === 'N.A.' ? '' : idCheckData.panNo,
          panFile: '',

          passportNameOnCard: idCheckData === 'N.A.' ? '' : idCheckData.passportNameOnCard,
          passportDob: idCheckData === 'N.A.' ? '' : idCheckData.passportDob,
          passportNo: idCheckData === 'N.A.' ? '' : idCheckData.passportNo,
          passportFile: '',

          driverLicenseNameOnCard: idCheckData === 'N.A.' ? '' : idCheckData.driverLicenseNameOnCard,
          driverLicenseDob: idCheckData === 'N.A.' ? '' : idCheckData.driverLicenseDob,
          driverLicenseNo: idCheckData === 'N.A.' ? '' : idCheckData.driverLicenseNo,
          driverLicenseFile: '',

          voterIdNameOnCard: idCheckData === 'N.A.' ? '' : idCheckData.voterIdNameOnCard,
          voterIdDob: idCheckData === 'N.A.' ? '' : idCheckData.voterIdDob,
          voterIdNo: idCheckData === 'N.A.' ? '' : idCheckData.voterIdNo,
          voterIdFile: '',

          rcBookNameOnCard: idCheckData === 'N.A.' ? '' : idCheckData.rcBookNameOnCard,
          rcBookDob: idCheckData === 'N.A.' ? '' : idCheckData.rcBookDob,
          rcBookNo: idCheckData === 'N.A.' ? '' : idCheckData.rcBookNo,
          rcBookFile: ''
        }}
        validationSchema={Yup.object().shape({
          aadharNameOnCard: Yup.string()
            .min(2, Constants.IdentificationForm.AadharNameTooShort)
            .max(50, Constants.IdentificationForm.AadharNameTooLong)
            .required(Constants.IdentificationForm.AadharNameRequired),
          aadharDob: Yup.string().required(Constants.IdentificationForm.AadharDobRequired),
          aadharNo: Yup.string()
            .min(12, Constants.IdentificationForm.ValidAadhar)
            .max(12, Constants.IdentificationForm.ValidAadhar)
            .required(Constants.IdentificationForm.AadharNoIsRequired),
          aadharFile: '',
          panNameOnCard: Yup.string()
            .min(2, Constants.IdentificationForm.PanNameTooShort)
            .max(50, Constants.IdentificationForm.PanNameTooLong)
            .required(Constants.IdentificationForm.PanNameRequired),
          panDob: Yup.string().required(Constants.IdentificationForm.PanDobRequired),
          panNo: Yup.string()
            .matches(Constants.Common.PanRegex, Constants.IdentificationForm.ValidPan)
            .max(12, Constants.IdentificationForm.ValidPan)
            .required(Constants.IdentificationForm.PanNumberIsRequired),
          panFile: '',
          passportNameOnCard: Yup.string()
            .min(2, Constants.IdentificationForm.PassportNameTooShort)
            .max(50, Constants.IdentificationForm.PassportNameTooLong),
          // .required(Constants.IdentificationForm.PassportNameRequired),
          // passportDob: Yup.string().required(Constants.IdentificationForm.PassportDobRequired),
          passportNo: Yup.string().matches(Constants.Common.PassportRegex, Constants.IdentificationForm.ValidPassport),
          passportFile: '',
          driverLicenseNameOnCard: Yup.string()
            .min(2, Constants.IdentificationForm.DlNameTooShort)
            .max(50, Constants.IdentificationForm.DlNameTooLong),
          // .required(Constants.IdentificationForm.DlNameRequired),
          // driverLicenseDob: Yup.string().required(Constants.IdentificationForm.DlDobRequired),
          driverLicenseNo: Yup.string().matches(Constants.Common.DLregex, Constants.IdentificationForm.ValidDL),
          driverLicenseFile: '',
          voterIdNameOnCard: Yup.string()
            .min(2, Constants.IdentificationForm.VoterIdNameTooShort)
            .max(50, Constants.IdentificationForm.VoterIdNameTooLong),
          // .required(Constants.IdentificationForm.VoterIdNameRequired),
          // voterIdDob: Yup.string().required(Constants.IdentificationForm.VoterIdDobRequired),
          voterIdNo: Yup.string().matches(Constants.Common.VoterIdRegex, Constants.IdentificationForm.ValidVoterId),
          voterIdFile: '',
          rcBookNameOnCard: Yup.string()
            .min(2, Constants.IdentificationForm.RCBookNameTooShort)
            .max(50, Constants.IdentificationForm.RCBookNameTooLong),
          // .required(Constants.IdentificationForm.RCBookNameRequired),
          // rcBookDob: Yup.string().required(Constants.IdentificationForm.RCBookDobRequired),
          rcBookNo: Yup.string()
          .matches(Constants.Common._RcBookRegex, Constants.IdentificationForm.ValidRcBook)
          ,
          rcBookFile: ''
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);

          console.log(values);
          console.log('Submitting');

          let mandatoryFilesData = [];
          const mandatoryFileNameArray = ['aadharFile', 'panFile'];

          mandatoryFileNameArray.forEach((mandatoryFileName) => {
            let selectedMandatoryFile = document.getElementById(mandatoryFileName).files[0];
            console.log('File is here!');
            console.log(selectedMandatoryFile);
            if (selectedMandatoryFile) {
              mandatoryFilesData.push(selectedMandatoryFile);
            }
          });

          console.log(mandatoryFilesData);

          let allFilesData = [];
          const fileNameArray = ['aadharFile', 'panFile', 'passportFile', 'driverLicenseFile', 'voterIdFile', 'rcBookFile'];

          fileNameArray.forEach((fileName) => {
            let selectedFile = document.getElementById(fileName).files[0];
            console.log('File is here!');
            console.log(selectedFile);
            if (selectedFile) {
              allFilesData.push(selectedFile);
            }
          });

          console.log(allFilesData);

          if (mandatoryFilesData.length !== mandatoryFileNameArray.length) {
            showLoader();
            sweetAlertHandler(bgvAlerts.uploadMandatoryFiles);
            hideLoader();
            // _sendIdInfo(values);
          } else {
            if (areFilesInvalid(allFilesData) !== 0) {
              sweetAlertHandler(bgvAlerts.invalidFilesPresent);
            } else {
              showLoader();
              _sendIdInfo(values);
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
                  <h5>Identification</h5>
                  <hr />
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <span className="my-2 badge badge-info">Aadhar</span>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Name on Card</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.aadharNameOnCard && errors.aadharNameOnCard}
                        name="aadharNameOnCard"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.aadharNameOnCard}
                      />
                      {touched.aadharNameOnCard && errors.aadharNameOnCard && (
                        <small className="text-danger form-text">{errors.aadharNameOnCard}</small>
                      )}
                    </Col>
                  </Row>
                </Col>

                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Employee DOB</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.aadharDob && errors.aadharDob}
                        name="aadharDob"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        value={values.aadharDob}
                      />
                      {touched.aadharDob && errors.aadharDob && <small className="text-danger form-text">{errors.aadharDob}</small>}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Aadhar No</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.aadharNo && errors.aadharNo}
                        name="aadharNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        value={values.aadharNo}
                      />
                      {touched.aadharNo && errors.aadharNo && <small className="text-danger form-text">{errors.aadharNo}</small>}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Aadhar file upload</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.aadharFile && errors.aadharFile}
                        name="aadharFile"
                        id="aadharFile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.aadharFile}
                      />
                      {idCheckData !== 'N.A.' && idCheckData.aadharFile !== '' && idCheckData.aadharFileURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={idCheckData.aadharFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.aadharFile && errors.aadharFile && <small className="text-danger form-text">{errors.aadharFile}</small>}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <span className="my-2 badge badge-info">PAN</span>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Name on Card</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.panNameOnCard && errors.panNameOnCard}
                        name="panNameOnCard"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.panNameOnCard}
                      />
                      {touched.panNameOnCard && errors.panNameOnCard && (
                        <small className="text-danger form-text">{errors.panNameOnCard}</small>
                      )}
                    </Col>
                  </Row>
                </Col>

                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Employee DOB</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.panDob && errors.panDob}
                        name="panDob"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        value={values.panDob}
                      />
                      {touched.panDob && errors.panDob && <small className="text-danger form-text">{errors.panDob}</small>}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>PAN No</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.panNo && errors.panNo}
                        name="panNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.panNo}
                      />
                      {touched.panNo && errors.panNo && <small className="text-danger form-text">{errors.panNo}</small>}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>PAN file upload</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.panFile && errors.panFile}
                        name="panFile"
                        id="panFile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.panFile}
                      />
                      {idCheckData !== 'N.A.' && idCheckData.panFile !== '' && idCheckData.panFileURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={idCheckData.panFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.panFile && errors.panFile && <small className="text-danger form-text">{errors.panFile}</small>}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <span className="my-2 badge badge-info">Passport</span>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Name on Card</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.passportNameOnCard && errors.passportNameOnCard}
                        name="passportNameOnCard"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.passportNameOnCard}
                      />
                      {touched.passportNameOnCard && errors.passportNameOnCard && (
                        <small className="text-danger form-text">{errors.passportNameOnCard}</small>
                      )}
                    </Col>
                  </Row>
                </Col>

                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Employee DOB</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.passportDob && errors.passportDob}
                        name="passportDob"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        value={values.passportDob}
                      />
                      {touched.passportDob && errors.passportDob && <small className="text-danger form-text">{errors.passportDob}</small>}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Passport No</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.passportNo && errors.passportNo}
                        name="passportNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.passportNo}
                      />
                      {touched.passportNo && errors.passportNo && <small className="text-danger form-text">{errors.passportNo}</small>}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Passport file upload</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.passportFile && errors.passportFile}
                        name="passportFile"
                        id="passportFile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.passportFile}
                      />
                      {idCheckData !== 'N.A.' && idCheckData.passportFile !== '' && idCheckData.passportFileURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={idCheckData.passportFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.passportFile && errors.passportFile && (
                        <small className="text-danger form-text">{errors.passportFile}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <span className="my-2 badge badge-info">Driver license</span>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Name on Card</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.driverLicenseNameOnCard && errors.driverLicenseNameOnCard}
                        name="driverLicenseNameOnCard"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.driverLicenseNameOnCard}
                      />
                      {touched.driverLicenseNameOnCard && errors.driverLicenseNameOnCard && (
                        <small className="text-danger form-text">{errors.driverLicenseNameOnCard}</small>
                      )}
                    </Col>
                  </Row>
                </Col>

                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Employee DOB</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.driverLicenseDob && errors.driverLicenseDob}
                        name="driverLicenseDob"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        value={values.driverLicenseDob}
                      />
                      {touched.driverLicenseDob && errors.driverLicenseDob && (
                        <small className="text-danger form-text">{errors.driverLicenseDob}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>DL No</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.driverLicenseNo && errors.driverLicenseNo}
                        name="driverLicenseNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.driverLicenseNo}
                      />
                      {touched.driverLicenseNo && errors.driverLicenseNo && (
                        <small className="text-danger form-text">{errors.driverLicenseNo}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Driver license file upload</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.driverLicenseFile && errors.driverLicenseFile}
                        name="driverLicenseFile"
                        id="driverLicenseFile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.driverLicenseFile}
                      />
                      {idCheckData !== 'N.A.' && idCheckData.driverLicenseFile !== '' && idCheckData.driverLicenseFileURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={idCheckData.driverLicenseFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.driverLicenseFile && errors.driverLicenseFile && (
                        <small className="text-danger form-text">{errors.driverLicenseFile}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <span className="my-2 badge badge-info">Voter ID</span>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Name on Card</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.voterIdNameOnCard && errors.voterIdNameOnCard}
                        name="voterIdNameOnCard"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.voterIdNameOnCard}
                      />
                      {touched.voterIdNameOnCard && errors.voterIdNameOnCard && (
                        <small className="text-danger form-text">{errors.voterIdNameOnCard}</small>
                      )}
                    </Col>
                  </Row>
                </Col>

                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Employee DOB</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.voterIdDob && errors.voterIdDob}
                        name="voterIdDob"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        value={values.voterIdDob}
                      />
                      {touched.voterIdDob && errors.voterIdDob && <small className="text-danger form-text">{errors.voterIdDob}</small>}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Voter ID No</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.voterIdNo && errors.voterIdNo}
                        name="voterIdNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.voterIdNo}
                      />
                      {touched.voterIdNo && errors.voterIdNo && <small className="text-danger form-text">{errors.voterIdNo}</small>}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Voter ID file upload</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.voterIdFile && errors.voterIdFile}
                        name="voterIdFile"
                        id="voterIdFile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.voterIdFile}
                      />
                      {idCheckData !== 'N.A.' && idCheckData.voterIdFile !== '' && idCheckData.voterIdFileURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={idCheckData.voterIdFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.voterIdFile && errors.voterIdFile && <small className="text-danger form-text">{errors.voterIdFile}</small>}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <span className="my-2 badge badge-info">RC Book</span>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Name on Card</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.rcBookNameOnCard && errors.rcBookNameOnCard}
                        name="rcBookNameOnCard"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.rcBookNameOnCard}
                      />
                      {touched.rcBookNameOnCard && errors.rcBookNameOnCard && (
                        <small className="text-danger form-text">{errors.rcBookNameOnCard}</small>
                      )}
                    </Col>
                  </Row>
                </Col>

                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Employee DOB</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.rcBookDob && errors.rcBookDob}
                        name="rcBookDob"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        value={values.rcBookDob}
                      />
                      {touched.rcBookDob && errors.rcBookDob && <small className="text-danger form-text">{errors.rcBookDob}</small>}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>RC Book No</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.rcBookNo && errors.rcBookNo}
                        name="rcBookNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.rcBookNo}
                      />
                      {touched.rcBookNo && errors.rcBookNo && <small className="text-danger form-text">{errors.rcBookNo}</small>}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>RC book file upload</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.rcBookFile && errors.rcBookFile}
                        name="rcBookFile"
                        id="rcBookFile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.rcBookFile}
                      />
                      {idCheckData !== 'N.A.' && idCheckData.rcBookFile !== '' && idCheckData.rcBookFileURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={idCheckData.rcBookFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.rcBookFile && errors.rcBookFile && <small className="text-danger form-text">{errors.rcBookFile}</small>}
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
      {sessionStorage.getItem('user_category') === 'Operation Supervisor' ||
      sessionStorage.getItem('user_category') === 'Operation Team' ? (
        <IdentificationBgv idCheckData={idCheckData} reloadData={handleDataChange} />
      ) : null}
    </>
  );
};

export default Identification;
