import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
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
import CriminalBgv from './verifications/CriminalBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const Criminal = ({ className, rest, newUpload }) => {
  let [criminalData, setCriminalData] = useState({});
  let { case_id } = useParams();
  const [isDisabled, setIsDisabled] = useState(true);
  const [submitButtonActive, setSubmitButtonActive] = useState(true);
  const [editClientButInsert, setEditClientButInsert] = useState(false);
  const [loadAgain, setLoadAgain] = useState(false);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [sameAsPrimaryAddress, setSameAsPrimaryAddress] = useState(false);
  const permCrimAddressRef = useRef('');
  const permCrimLandMarkRef = useRef('');
  const permCrimCityRef = useRef('');
  const permCrimStateRef = useRef('');
  const permCrimStayPeriodRef = useRef('');
  const permCrimCountryRef = useRef('');
  const permCrimPostalCodeRef = useRef('');
  const permCrimProofTypeRef = useRef('');
  const permCrimAddressProofRef = useRef('');
  const permCrimPhoneNoRef = useRef('');

  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  const _sendCriminalInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(criminalData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'Criminal', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'Criminal', case_id);
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

  const _fetchCaseCriminal = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'Criminal');
    console.log('criminal caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setCriminalData("N.A.") : setCriminalData(caseData);
      if (isEmptyObject(caseData)) {
        setCriminalData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setCriminalData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  const handlesetSameAsPrimaryAddress = () => {
    setSameAsPrimaryAddress(!sameAsPrimaryAddress);
    setCriminalData({
      curCrimAddress: permCrimAddressRef.current.value,
      curCrimLandMark: permCrimLandMarkRef.current.value,
      curCrimCity: permCrimCityRef.current.value,
      curCrimState: permCrimStateRef.current.value,
      curCrimStayPeriod: permCrimStayPeriodRef.current.value,
      curCrimCountry: permCrimCountryRef.current.value,
      curCrimPostalCode: permCrimPostalCodeRef.current.value,
      curCrimProofType: permCrimProofTypeRef.current.value,
      curCrimAddressProof: permCrimAddressProofRef.current.value,
      curCrimPhoneNo: permCrimPhoneNoRef.current.value,

      permCrimAddress: permCrimAddressRef.current.value,
      permCrimLandMark: permCrimLandMarkRef.current.value,
      permCrimCity: permCrimCityRef.current.value,
      permCrimState: permCrimStateRef.current.value,
      permCrimStayPeriod: permCrimStayPeriodRef.current.value,
      permCrimCountry: permCrimCountryRef.current.value,
      permCrimPostalCode: permCrimPostalCodeRef.current.value,
      permCrimProofType: permCrimProofTypeRef.current.value,
      permCrimAddressProof: permCrimAddressProofRef.current.value,
      permCrimPhoneNo: permCrimPhoneNoRef.current.value
    });
  };

  const handlesetNotSameAsPrimaryAddress = () => setSameAsPrimaryAddress(false);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseCriminal();
    } else {
      setCriminalData('N.A.');
    }
  }, [loadAgain]);

  return isEmptyObject(criminalData) ? null : (
    <React.Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={{
          curCrimAddress: criminalData === 'N.A.' ? '' : criminalData.curCrimAddress,
          curCrimLandMark: criminalData === 'N.A.' ? '' : criminalData.curCrimLandMark,
          curCrimCity: criminalData === 'N.A.' ? '' : criminalData.curCrimCity,
          curCrimState: criminalData === 'N.A.' ? '' : criminalData.curCrimState,
          curCrimStayPeriod: criminalData === 'N.A.' ? '' : criminalData.curCrimStayPeriod,
          curCrimCountry: criminalData === 'N.A.' ? '' : criminalData.curCrimCountry,
          curCrimPostalCode: criminalData === 'N.A.' ? '' : criminalData.curCrimPostalCode,
          curCrimProofType: criminalData === 'N.A.' ? '' : criminalData.curCrimProofType,
          curCrimAddressProof: criminalData === 'N.A.' ? '' : '',
          curCrimPhoneNo: criminalData === 'N.A.' ? '' : criminalData.curCrimPhoneNo,

          permCrimAddress: criminalData === 'N.A.' ? '' : criminalData.permCrimAddress,
          permCrimLandMark: criminalData === 'N.A.' ? '' : criminalData.permCrimLandMark,
          permCrimCity: criminalData === 'N.A.' ? '' : criminalData.permCrimCity,
          permCrimState: criminalData === 'N.A.' ? '' : criminalData.permCrimState,
          permCrimStayPeriod: criminalData === 'N.A.' ? '' : criminalData.permCrimStayPeriod,
          permCrimCountry: criminalData === 'N.A.' ? '' : criminalData.permCrimCountry,
          permCrimPostalCode: criminalData === 'N.A.' ? '' : criminalData.permCrimPostalCode,
          permCrimProofType: criminalData === 'N.A.' ? '' : criminalData.permCrimProofType,
          permCrimAddressProof: criminalData === 'N.A.' ? '' : '',
          permCrimPhoneNo: criminalData === 'N.A.' ? '' : criminalData.permCrimPhoneNo
        }}
        validationSchema={Yup.object().shape({
          curCrimAddress: Yup.string().min(10, Constants.AddressForm.curAddressTooShort).max(100, Constants.AddressForm.curAddressTooLong),
          curCrimLandMark: Yup.string()
            .min(10, Constants.AddressForm.curLandMarkTooShort)
            .max(50, Constants.AddressForm.curLandMarkTooLong),
          curCrimCity: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.AddressForm.validCity)
            .min(2, Constants.AddressForm.curCityTooShort)
            .max(50, Constants.AddressForm.curCityTooLong),
          curCrimState: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.AddressForm.validState)
            .min(2, Constants.AddressForm.curStateTooShort)
            .max(50, Constants.AddressForm.curStateTooLong),
          curCrimStayPeriod: Yup.string()
            .min(2, Constants.AddressForm.curStayPeriodTooShort)
            .max(50, Constants.AddressForm.curStayPeriodTooLong),
          curCrimCountry: Yup.string()
            .matches(Constants.Common.alphabetsRegex, Constants.AddressForm.validContry)
            .min(2, Constants.AddressForm.curCountryTooShort)
            .max(50, Constants.AddressForm.curCountryTooLong),
          curCrimPostalCode: Yup.string()
            .matches(Constants.AddressForm.postalCodeRegex, Constants.AddressForm.valiedPostalCode)
            .min(2, Constants.AddressForm.curPostalCodeTooShort)
            .max(50, Constants.AddressForm.curPostalCodeTooLong),
          curCrimProofType: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.AddressForm.validProofType)
            .min(2, Constants.AddressForm.curProofTypeTooShort)
            .max(50, Constants.AddressForm.curProofTypeTooLong),
          curCrimPhoneNo: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone),
          curCrimAddressProof: '',

          permCrimAddress: Yup.string()
            .min(10, Constants.AddressForm.permAddressTooShort)
            .max(100, Constants.AddressForm.permAddressTooLong)
            .required(Constants.AddressForm.permAddressRequired),
          permCrimLandMark: Yup.string()
            .min(10, Constants.AddressForm.permLandMarkTooShort)
            .max(50, Constants.AddressForm.permLandMarkTooLong)
            .required(Constants.AddressForm.permLandMarkRequired),
          permCrimCity: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.AddressForm.validCity)
            .min(2, Constants.AddressForm.permCityTooShort)
            .max(50, Constants.AddressForm.permCityTooLong)
            .required(Constants.AddressForm.permCityRequired),
          permCrimState: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.AddressForm.validState)
            .min(2, Constants.AddressForm.permStateTooShort)
            .max(50, Constants.AddressForm.permStateTooLong)
            .required(Constants.AddressForm.permStateRequired),
          permCrimStayPeriod: Yup.string()
            .min(2, Constants.AddressForm.permStayPeriodTooShort)
            .max(50, Constants.AddressForm.permStayPeriodTooLong)
            .required(Constants.AddressForm.permStayPeriodRequired),
          permCrimCountry: Yup.string()
            .matches(Constants.Common.alphabetsRegex, Constants.AddressForm.validContry)
            .min(2, Constants.AddressForm.permCountryTooShort)
            .max(50, Constants.AddressForm.permCountryTooLong)
            .required(Constants.AddressForm.permCountryRequired),
          permCrimPostalCode: Yup.string()
            .matches(Constants.AddressForm.postalCodeRegex, Constants.AddressForm.valiedPostalCode)
            .min(2, Constants.AddressForm.permPostalCodeTooShort)
            .max(50, Constants.AddressForm.permPostalCodeTooLong)
            .required(Constants.AddressForm.permPostalCodeRequired),
          permCrimProofType: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.AddressForm.validProofType)
            .min(2, Constants.AddressForm.curProofTypeTooShort)
            .max(50, Constants.AddressForm.curProofTypeTooLong)
            .required(Constants.AddressForm.permProofTypeRequired),
          permCrimPhoneNo: Yup.string()
            .min(10, Constants.AddressForm.validPermPhone)
            .max(10, Constants.AddressForm.validPermPhone)
            .required(Constants.AddressForm.permPhoneRequired),
          permCrimAddressProof: ''
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          const formData = {
            curCrimAddress: sameAsPrimaryAddress === true ? values.permCrimAddress : values.curCrimAddress,
            curCrimLandMark: sameAsPrimaryAddress === true ? values.permCrimLandMark : values.curCrimLandMark,
            curCrimCity: sameAsPrimaryAddress === true ? values.permCrimCity : values.curCrimCity,
            curCrimState: sameAsPrimaryAddress === true ? values.permCrimState : values.curCrimState,
            curCrimStayPeriod: sameAsPrimaryAddress === true ? values.permCrimStayPeriod : values.curCrimStayPeriod,
            curCrimCountry: sameAsPrimaryAddress === true ? values.permCrimCountry : values.curCrimCountry,
            curCrimPostalCode: sameAsPrimaryAddress === true ? values.permCrimPostalCode : values.curCrimPostalCode,
            curCrimProofType: sameAsPrimaryAddress === true ? values.permCrimProofType : values.curCrimProofType,
            curCrimAddressProof: sameAsPrimaryAddress === true ? values.permCrimAddressProof : values.curCrimAddressProof,
            curCrimPhoneNo: sameAsPrimaryAddress === true ? values.permCrimPhoneNo : values.curCrimPhoneNo,

            permCrimAddress: values.permCrimAddress,
            permCrimLandMark: values.permCrimLandMark,
            permCrimCity: values.permCrimCity,
            permCrimState: values.permCrimState,
            permCrimStayPeriod: values.permCrimStayPeriod,
            permCrimCountry: values.permCrimCountry,
            permCrimPostalCode: values.permCrimPostalCode,
            permCrimProofType: values.permCrimProofType,
            permCrimAddressProof: values.permCrimAddressProof,
            permCrimPhoneNo: values.permCrimPhoneNo
          };

          let allFilesData = [];
          const fileNameArray = ['curCrimAddressProof', 'permCrimAddressProof'];

          fileNameArray.forEach((fileName) => {
            let selectedFile = document.getElementById(fileName).files[0];
            console.log('File is here!');
            console.log(selectedFile);
            if (selectedFile) {
              allFilesData.push(selectedFile);
            }
          });

          if (allFilesData.length === 0) {
            showLoader();
            _sendCriminalInfo(formData);
          } else {
            if (areFilesInvalid(allFilesData) !== 0) {
              sweetAlertHandler(bgvAlerts.invalidFilesPresent);
            } else {
              showLoader();
              _sendCriminalInfo(formData);
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
                  <h5>Criminal</h5>
                  <hr />
                </Col>
              </Row>

              {/* perm Address */}
              <Row>
                <Col sm={12}>
                  <br />
                  <h6>Permanent Address</h6>
                  <br />
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Address</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permCrimAddress && errors.permCrimAddress}
                        name="permCrimAddress"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        ref={permCrimAddressRef}
                        value={values.permCrimAddress}
                      />
                      {touched.permCrimAddress && errors.permCrimAddress && (
                        <small className="text-danger form-text">{errors.permCrimAddress}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Landmark</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permCrimLandMark && errors.permCrimLandMark}
                        name="permCrimLandMark"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        ref={permCrimLandMarkRef}
                        value={values.permCrimLandMark}
                      />
                      {touched.permCrimLandMark && errors.permCrimLandMark && (
                        <small className="text-danger form-text">{errors.permCrimLandMark}</small>
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
                        error={touched.permCrimCity && errors.permCrimCity}
                        name="permCrimCity"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        ref={permCrimCityRef}
                        value={values.permCrimCity}
                      />
                      {touched.permCrimCity && errors.permCrimCity && (
                        <small className="text-danger form-text">{errors.permCrimCity}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>State</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permCrimState && errors.permCrimState}
                        name="permCrimState"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        ref={permCrimStateRef}
                        value={values.permCrimState}
                      />
                      {touched.permCrimState && errors.permCrimState && (
                        <small className="text-danger form-text">{errors.permCrimState}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Country</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permCrimCountry && errors.permCrimCountry}
                        name="permCrimCountry"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        ref={permCrimCountryRef}
                        value={values.permCrimCountry}
                      />
                      {touched.permCrimCountry && errors.permCrimCountry && (
                        <small className="text-danger form-text">{errors.permCrimCountry}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Stay period</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permCrimStayPeriod && errors.permCrimStayPeriod}
                        name="permCrimStayPeriod"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        ref={permCrimStayPeriodRef}
                        value={values.permCrimStayPeriod}
                      />
                      {touched.permCrimStayPeriod && errors.permCrimStayPeriod && (
                        <small className="text-danger form-text">{errors.permCrimStayPeriod}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Postal code</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permCrimPostalCode && errors.permCrimPostalCode}
                        name="permCrimPostalCode"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        ref={permCrimPostalCodeRef}
                        value={values.permCrimPostalCode}
                      />
                      {touched.permCrimPostalCode && errors.permCrimPostalCode && (
                        <small className="text-danger form-text">{errors.permCrimPostalCode}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Proof type</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permCrimProofType && errors.permCrimProofType}
                        name="permCrimProofType"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        ref={permCrimProofTypeRef}
                        value={values.permCrimProofType}
                      />
                      {touched.permCrimProofType && errors.permCrimProofType && (
                        <small className="text-danger form-text">{errors.permCrimProofType}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Mobile/Phone Number</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                        name="permCrimPhoneNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        ref={permCrimPhoneNoRef}
                        value={values.permCrimPhoneNo}
                      />
                      {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                        <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Address proof</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permCrimAddressProof && errors.permCrimAddressProof}
                        name="permCrimAddressProof"
                        id="permCrimAddressProof"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        ref={permCrimAddressProofRef}
                        value={values.permCrimAddressProof}
                      />
                      {criminalData !== 'N.A.' && criminalData.permCrimAddressProof !== '' && criminalData.permCrimAddressProofURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={criminalData.permCrimAddressProofURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.permCrimAddressProof && errors.permCrimAddressProof && (
                        <small className="text-danger form-text">{errors.permCrimAddressProof}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* <Form.Check type='checkbox' id={`default-checkbox`} label={`Same as Primary Address`} checked={sameAsPrimaryAddress} onChange={handlesetSameAsPrimaryAddress} /> */}

              {
                <>
                  <Row>
                    <Col sm={12}>
                      <br />
                      <h6>Current Address</h6>
                      <br />
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Address</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.curCrimAddress && errors.curCrimAddress}
                            name="curCrimAddress"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.curCrimAddress}
                          />
                          {touched.curCrimAddress && errors.curCrimAddress && (
                            <small className="text-danger form-text">{errors.curCrimAddress}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Landmark</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.curCrimLandMark && errors.curCrimLandMark}
                            name="curCrimLandMark"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.curCrimLandMark}
                          />
                          {touched.curCrimLandMark && errors.curCrimLandMark && (
                            <small className="text-danger form-text">{errors.curCrimLandMark}</small>
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
                            error={touched.curCrimCity && errors.curCrimCity}
                            name="curCrimCity"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.curCrimCity}
                          />
                          {touched.curCrimCity && errors.curCrimCity && (
                            <small className="text-danger form-text">{errors.curCrimCity}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>State</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.curCrimState && errors.curCrimState}
                            name="curCrimState"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.curCrimState}
                          />
                          {touched.curCrimState && errors.curCrimState && (
                            <small className="text-danger form-text">{errors.curCrimState}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Country</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.curCrimCountry && errors.curCrimCountry}
                            name="curCrimCountry"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.curCrimCountry}
                          />
                          {touched.curCrimCountry && errors.curCrimCountry && (
                            <small className="text-danger form-text">{errors.curCrimCountry}</small>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Stay period</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.curCrimStayPeriod && errors.curCrimStayPeriod}
                            name="curCrimStayPeriod"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.curCrimStayPeriod}
                          />
                          {touched.curCrimStayPeriod && errors.curCrimStayPeriod && (
                            <small className="text-danger form-text">{errors.curCrimStayPeriod}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Postal code</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.curCrimPostalCode && errors.curCrimPostalCode}
                            name="curCrimPostalCode"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.curCrimPostalCode}
                          />
                          {touched.curCrimPostalCode && errors.curCrimPostalCode && (
                            <small className="text-danger form-text">{errors.curCrimPostalCode}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Proof type</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.curCrimProofType && errors.curCrimProofType}
                            name="curCrimProofType"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.curCrimProofType}
                          />
                          {touched.curCrimProofType && errors.curCrimProofType && (
                            <small className="text-danger form-text">{errors.curCrimProofType}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Mobile/Phone Number</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.curCrimPhoneNo && errors.curCrimPhoneNo}
                            name="curCrimPhoneNo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.curCrimPhoneNo}
                          />
                          {touched.curCrimPhoneNo && errors.curCrimPhoneNo && (
                            <small className="text-danger form-text">{errors.curCrimPhoneNo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Address proof</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.curCrimAddressProof && errors.curCrimAddressProof}
                            name="curCrimAddressProof"
                            id="curCrimAddressProof"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.curCrimAddressProof}
                          />
                          {criminalData !== 'N.A.' && criminalData.curCrimAddressProof !== '' && criminalData.curCrimAddressProofURL ? (
                            <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                              <a href={criminalData.curCrimAddressProofURL} target="_blank" rel="noopener noreferrer">
                                {Constants.Common.ViewExistingFile}
                              </a>
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.curCrimAddressProof && errors.curCrimAddressProof && (
                            <small className="text-danger form-text">{errors.curCrimAddressProof}</small>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              }

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
        <CriminalBgv criminalData={criminalData} reloadData={handleDataChange} />
      ) : null}
    </React.Fragment>
  );
};

export default Criminal;
