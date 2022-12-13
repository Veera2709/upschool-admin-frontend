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
import PoliceVerificationBgv from './verifications/PoliceVerificationBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import * as Constants from '../../../../helper/constants';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { useSelector } from 'react-redux';
import { addressTypeOptions, addressTypeOptionsArray } from '../../../../helper/selectOptions';

const PoliceVerification = ({ className, rest, newUpload }) => {
  const [policeVerificationData, setPoliceVerificationData] = useState({});
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

  const _sendPoliceVerificationInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(policeVerificationData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'PoliceVerification', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'PoliceVerification', case_id);
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

  const _fetchCasePoliceVerification = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'PoliceVerification');
    console.log('police caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setPoliceVerificationData("N.A.") : setPoliceVerificationData(caseData);
      if (isEmptyObject(caseData)) {
        setPoliceVerificationData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setPoliceVerificationData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCasePoliceVerification();
    } else {
      setPoliceVerificationData('N.A.');
    }
  }, [loadAgain]);

  useEffect(() => {}, [basicDetails.Id]);

  return isEmptyObject(policeVerificationData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          aadharNo: policeVerificationData === 'N.A.' ? '' : policeVerificationData.aadharNo,
          addressType: policeVerificationData === 'N.A.' ? '' : policeVerificationData.addressType,
          completeAddress: policeVerificationData === 'N.A.' ? '' : policeVerificationData.completeAddress,
          periodOfStay: policeVerificationData === 'N.A.' ? '' : policeVerificationData.periodOfStay,
          rentalAgreementDriverLicence: '',
          passportSizePhoto: ''
        }}
        validationSchema={Yup.object().shape({
          aadharNo: Yup.string()
            .min(12, Constants.PoliceVerificationForm.ValidAadhar)
            .max(12, Constants.PoliceVerificationForm.ValidAadhar)
            .required(Constants.PoliceVerificationForm.AadharNoIsRequired),
          addressType: Yup.string()
            .min(0, Constants.PoliceVerificationForm.AddressTypeInvalid)
            .oneOf(addressTypeOptionsArray, Constants.PoliceVerificationForm.AddressTypeInvalid)
            .required(Constants.PoliceVerificationForm.AddressTypeRequired),
          completeAddress: Yup.string()
            .min(10, Constants.PoliceVerificationForm.AddressTooShort)
            .max(500, Constants.PoliceVerificationForm.AddressTooShort)
            .required(Constants.PoliceVerificationForm.AddressRequired),
          periodOfStay: Yup.string()
            .min(2, Constants.PoliceVerificationForm.PeriofOfStayTooShort)
            .max(50, Constants.PoliceVerificationForm.PeriofOfStayTooLong)
            .required(Constants.PoliceVerificationForm.PeriofOfStayRequired),
          rentalAgreementDriverLicence: '',
          passportSizePhoto: ''
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          console.log('Submitting');

          let allFilesData = [];
          const fileNameArray = ['rentalAgreementDriverLicence', 'passportSizePhoto'];

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
            _sendPoliceVerificationInfo(values);
            showLoader();
          } else {
            if (areFilesInvalid(allFilesData) !== 0) {
              sweetAlertHandler(bgvAlerts.invalidFilesPresent);
            } else {
              _sendPoliceVerificationInfo(values);
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
                  <h5>Police Verification</h5>
                  <hr />
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

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Address Type</label>
                    </Col>
                    <Col sm={9}>
                      <select
                        className="form-control"
                        error={touched.addressType && errors.addressType}
                        name="addressType"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.addressType}
                      >
                        {addressTypeOptions.map((ele, i) => {
                          return (
                            <option key={i} value={ele.value}>
                              {ele.label}
                            </option>
                          );
                        })}
                      </select>
                      {touched.addressType && errors.addressType && <small className="text-danger form-text">{errors.addressType}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Complete Address</label>
                    </Col>
                    <Col sm={9}>
                      <textarea
                        className="form-control"
                        error={touched.completeAddress && errors.completeAddress}
                        name="completeAddress"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.completeAddress}
                        rows="6"
                        autoComplete="off"
                      />
                      {touched.completeAddress && errors.completeAddress && (
                        <small className="text-danger form-text">{errors.completeAddress}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Period Of Stay</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.periodOfStay && errors.periodOfStay}
                        name="periodOfStay"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.periodOfStay}
                      />
                      {touched.periodOfStay && errors.periodOfStay && (
                        <small className="text-danger form-text">{errors.periodOfStay}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Upload rental agreement / driver's licence</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.rentalAgreementDriverLicence && errors.rentalAgreementDriverLicence}
                        name="rentalAgreementDriverLicence"
                        id="rentalAgreementDriverLicence"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.rentalAgreementDriverLicence}
                      />
                      {policeVerificationData !== 'N.A.' &&
                      policeVerificationData.lipidProfileFile !== '' &&
                      policeVerificationData.rentalAgreementDriverLicenceURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={policeVerificationData.rentalAgreementDriverLicenceURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                          {/* Download existing image */}
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.rentalAgreementDriverLicence && errors.rentalAgreementDriverLicence && (
                        <small className="text-danger form-text">{errors.rentalAgreementDriverLicence}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Upload passport size photo</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.passportSizePhoto && errors.passportSizePhoto}
                        name="passportSizePhoto"
                        id="passportSizePhoto"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.passportSizePhoto}
                      />
                      {policeVerificationData !== 'N.A.' &&
                      policeVerificationData.lipidProfileFile !== '' &&
                      policeVerificationData.passportSizePhotoURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={policeVerificationData.passportSizePhotoURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                          {/* Download existing image */}
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.passportSizePhoto && errors.passportSizePhoto && (
                        <small className="text-danger form-text">{errors.passportSizePhoto}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
                {/* <Col sm={3}></Col> */}
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
        <PoliceVerificationBgv policeVerificationData={policeVerificationData} reloadData={handleDataChange} />
      ) : null}
    </React.Fragment>
  );
};

export default PoliceVerification;
