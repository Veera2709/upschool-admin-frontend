import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, Collapse } from 'react-bootstrap';
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
import AddressBgv from './verifications/AddressBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const Address = ({ className, rest, newUpload }) => {
  const [addressData, setAddressData] = useState({});
  let { case_id } = useParams();
  const [isDisabled, setIsDisabled] = useState(true);
  const [submitButtonActive, setSubmitButtonActive] = useState(true);
  const [editClientButInsert, setEditClientButInsert] = useState(false);
  const [intermediateAddressOne, setIntermediateAddressOne] = useState(false);
  const [intermediateAddressTwo, setIntermediateAddressTwo] = useState(false);
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

  const _sendAddress = async (data) => {
    let { apiUrl, payloadData } = await getUrl(addressData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'Address', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'Address', case_id);
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
        if (newUpload) {
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

  const _fetchCaseAddress = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'Address');
    console.log('address caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching component data');
    } else {
      // isEmptyObject(caseData) ? setAddressData("N.A.") : setAddressData(caseData);
      if (isEmptyObject(caseData)) {
        setAddressData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setAddressData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseAddress();
    } else {
      setAddressData('N.A.');
    }
  }, [loadAgain]);

  const validationSchema = Yup.object().shape({
    curAddress: Yup.string()
      .min(10, Constants.AddressForm.curAddressTooShort)
      .max(100, Constants.AddressForm.curAddressTooLong)
      .required(Constants.AddressForm.curAddressRequired),
    curLandMark: Yup.string()
      .min(10, Constants.AddressForm.curLandMarkTooShort)
      .max(50, Constants.AddressForm.curLandMarkTooLong)
      .required(Constants.AddressForm.curLandMarkRequired),
    curCity: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.AddressForm.curCityTooShort)
      .max(50, Constants.AddressForm.curCityTooLong)
      .required(Constants.AddressForm.curCityRequired),
    curState: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.AddressForm.curStateTooShort)
      .max(50, Constants.AddressForm.curStateTooLong)
      .required(Constants.AddressForm.curStateRequired),
    curStayPeriod: Yup.string()
      .min(2, Constants.AddressForm.curStayPeriodTooShort)
      .max(50, Constants.AddressForm.curStayPeriodTooLong)
      .required(Constants.AddressForm.curStayPeriodRequired),
    curCountry: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.AddressForm.curCountryTooShort)
      .max(50, Constants.AddressForm.curCountryTooLong)
      .required(Constants.AddressForm.curCountryRequired),
    curPostalCode: Yup.string()
      .matches(Constants.AddressForm.postalCodeRegex, Constants.AddressForm.valiedPostalCode)
      .min(2, Constants.AddressForm.curPostalCodeTooShort)
      .max(50, Constants.AddressForm.curPostalCodeTooLong)
      .required(Constants.AddressForm.curPostalCodeRequired),
    curProofType: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.AddressForm.valiedProofType)
      .min(2, Constants.AddressForm.curProofTypeTooShort)
      .max(50, Constants.AddressForm.curProofTypeTooLong)
      .required(Constants.AddressForm.curProofTypeRequired),
    curPhoneNo: Yup.string()
      .min(10, Constants.AddressForm.validPermPhone)
      .max(10, Constants.AddressForm.validPermPhone)
      .required(Constants.AddressForm.curPhoneNoRequired),

    permAddress: Yup.string()
      .min(10, Constants.AddressForm.permAddressTooShort)
      .max(100, Constants.AddressForm.permAddressTooLong)
      .required(Constants.AddressForm.permAddressRequired),
    permLandMark: Yup.string()
      .min(10, Constants.AddressForm.permLandMarkTooShort)
      .max(50, Constants.AddressForm.permLandMarkTooLong)
      .required(Constants.AddressForm.permLandMarkRequired),
    permCity: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.AddressForm.permCityTooShort)
      .max(50, Constants.AddressForm.permCityTooLong)
      .required(Constants.AddressForm.permCityRequired),
    permState: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.AddressForm.permStateTooShort)
      .max(50, Constants.AddressForm.permStateTooLong)
      .required(Constants.AddressForm.permStateRequired),
    permStayPeriod: Yup.string()
      .min(2, Constants.AddressForm.permStayPeriodTooShort)
      .max(50, Constants.AddressForm.permStayPeriodTooLong)
      .required(Constants.AddressForm.permStayPeriodRequired),
    permCountry: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.AddressForm.permCountryTooShort)
      .max(50, Constants.AddressForm.permCountryTooLong)
      .required(Constants.AddressForm.permCountryRequired),
    permPostalCode: Yup.string()
      .matches(Constants.AddressForm.postalCodeRegex, Constants.AddressForm.valiedPostalCode)
      .min(2, Constants.AddressForm.permPostalCodeTooShort)
      .max(50, Constants.AddressForm.permPostalCodeTooLong)
      .required(Constants.AddressForm.permPostalCodeRequired),
    permProofType: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.AddressForm.valiedProofType)
      .min(2, Constants.AddressForm.curProofTypeTooShort)
      .max(50, Constants.AddressForm.curProofTypeTooLong)
      .required(Constants.AddressForm.permProofTypeRequired),
    permPhoneNo: Yup.string()
      .min(10, Constants.AddressForm.validPermPhone)
      .max(10, Constants.AddressForm.validPermPhone)
      .required(Constants.AddressForm.permPhoneRequired),

    interAddress1: Yup.string().min(10, Constants.AddressForm.permAddressTooShort).max(100, Constants.AddressForm.permAddressTooLong),
    interLandMark1: Yup.string().min(10, Constants.AddressForm.permLandMarkTooShort).max(50, Constants.AddressForm.permLandMarkTooLong),
    interCity1: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.AddressForm.permCityTooShort)
      .max(50, Constants.AddressForm.permCityTooLong),
    interState1: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.AddressForm.permStateTooShort)
      .max(50, Constants.AddressForm.permStateTooLong),
    interStayPeriod1: Yup.string()
      .min(2, Constants.AddressForm.permStayPeriodTooShort)
      .max(50, Constants.AddressForm.permStayPeriodTooLong),
    interCountry1: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.AddressForm.permCountryTooShort)
      .max(50, Constants.AddressForm.permCountryTooLong),
    interPostalCode1: Yup.string()
      .matches(Constants.AddressForm.postalCodeRegex, Constants.AddressForm.valiedPostalCode)
      .min(2, Constants.AddressForm.permPostalCodeTooShort)
      .max(50, Constants.AddressForm.permPostalCodeTooLong),
    interProofType1: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.AddressForm.valiedProofType)
      .min(2, Constants.AddressForm.curProofTypeTooShort)
      .max(50, Constants.AddressForm.curProofTypeTooLong),
    interPhoneNo1: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone),

    interAddress2: Yup.string().min(10, Constants.AddressForm.permAddressTooShort).max(100, Constants.AddressForm.permAddressTooLong),
    interLandMark2: Yup.string().min(10, Constants.AddressForm.permLandMarkTooShort).max(50, Constants.AddressForm.permLandMarkTooLong),
    interCity2: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.AddressForm.permCityTooShort)
      .max(50, Constants.AddressForm.permCityTooLong),
    interState2: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.AddressForm.permStateTooShort)
      .max(50, Constants.AddressForm.permStateTooLong),
    interStayPeriod2: Yup.string()
      .min(2, Constants.AddressForm.permStayPeriodTooShort)
      .max(50, Constants.AddressForm.permStayPeriodTooLong),
    interCountry2: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.BasicDetailsForm.validCity)
      .min(2, Constants.AddressForm.permCountryTooShort)
      .max(50, Constants.AddressForm.permCountryTooLong),
    interPostalCode2: Yup.string()
      .matches(Constants.AddressForm.postalCodeRegex, Constants.AddressForm.valiedPostalCode)
      .min(2, Constants.AddressForm.permPostalCodeTooShort)
      .max(50, Constants.AddressForm.permPostalCodeTooLong),
    interProofType2: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.AddressForm.valiedProofType)
      .min(2, Constants.AddressForm.curProofTypeTooShort)
      .max(50, Constants.AddressForm.curProofTypeTooLong),
    interPhoneNo2: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone)
  });

  return isEmptyObject(addressData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          curAddress: addressData === 'N.A.' || isEmptyObject(addressData.currentAddress) ? '' : addressData.currentAddress.address,
          curLandMark: addressData === 'N.A.' || isEmptyObject(addressData.currentAddress) ? '' : addressData.currentAddress.landMark,
          curCity: addressData === 'N.A.' || isEmptyObject(addressData.currentAddress) ? '' : addressData.currentAddress.city,
          curState: addressData === 'N.A.' || isEmptyObject(addressData.currentAddress) ? '' : addressData.currentAddress.state,
          curStayPeriod: addressData === 'N.A.' || isEmptyObject(addressData.currentAddress) ? '' : addressData.currentAddress.stayPeriod,
          curCountry: addressData === 'N.A.' || isEmptyObject(addressData.currentAddress) ? '' : addressData.currentAddress.country,
          curPostalCode: addressData === 'N.A.' || isEmptyObject(addressData.currentAddress) ? '' : addressData.currentAddress.postalCode,
          curProofType: addressData === 'N.A.' || isEmptyObject(addressData.currentAddress) ? '' : addressData.currentAddress.proofType,
          addressProof1: '',
          curPhoneNo: addressData === 'N.A.' || isEmptyObject(addressData.currentAddress) ? '' : addressData.currentAddress.phoneNo,

          permAddress: addressData === 'N.A.' || isEmptyObject(addressData.permanentAddress) ? '' : addressData.permanentAddress.address,
          permLandMark: addressData === 'N.A.' || isEmptyObject(addressData.permanentAddress) ? '' : addressData.permanentAddress.landMark,
          permCity: addressData === 'N.A.' || isEmptyObject(addressData.permanentAddress) ? '' : addressData.permanentAddress.city,
          permState: addressData === 'N.A.' || isEmptyObject(addressData.permanentAddress) ? '' : addressData.permanentAddress.state,
          permStayPeriod:
            addressData === 'N.A.' || isEmptyObject(addressData.permanentAddress) ? '' : addressData.permanentAddress.stayPeriod,
          permCountry: addressData === 'N.A.' || isEmptyObject(addressData.permanentAddress) ? '' : addressData.permanentAddress.country,
          permPostalCode:
            addressData === 'N.A.' || isEmptyObject(addressData.permanentAddress) ? '' : addressData.permanentAddress.postalCode,
          permProofType:
            addressData === 'N.A.' || isEmptyObject(addressData.permanentAddress) ? '' : addressData.permanentAddress.proofType,
          addressProof2: '',
          permPhoneNo: addressData === 'N.A.' || isEmptyObject(addressData.permanentAddress) ? '' : addressData.permanentAddress.phoneNo,

          interAddress1:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressOne) ? '' : addressData.intermediateAddressOne.address,
          interLandMark1:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressOne) ? '' : addressData.intermediateAddressOne.landMark,
          interCity1:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressOne) ? '' : addressData.intermediateAddressOne.city,
          interState1:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressOne) ? '' : addressData.intermediateAddressOne.state,
          interStayPeriod1:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressOne)
              ? ''
              : addressData.intermediateAddressOne.stayPeriod,
          interCountry1:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressOne) ? '' : addressData.intermediateAddressOne.country,
          interPostalCode1:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressOne)
              ? ''
              : addressData.intermediateAddressOne.postalCode,
          interProofType1:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressOne) ? '' : addressData.intermediateAddressOne.proofType,
          addressProof3: '',
          interPhoneNo1:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressOne) ? '' : addressData.intermediateAddressOne.phoneNo,

          interAddress2:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressTwo) ? '' : addressData.intermediateAddressTwo.address,
          interLandMark2:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressTwo) ? '' : addressData.intermediateAddressTwo.landMark,
          interCity2:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressTwo) ? '' : addressData.intermediateAddressTwo.city,
          interState2:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressTwo) ? '' : addressData.intermediateAddressTwo.state,
          interStayPeriod2:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressTwo)
              ? ''
              : addressData.intermediateAddressTwo.stayPeriod,
          interCountry2:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressTwo) ? '' : addressData.intermediateAddressTwo.country,
          interPostalCode2:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressTwo)
              ? ''
              : addressData.intermediateAddressTwo.postalCode,
          interProofType2:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressTwo) ? '' : addressData.intermediateAddressTwo.proofType,
          addressProof4: '',
          interPhoneNo2:
            addressData === 'N.A.' || isEmptyObject(addressData.intermediateAddressTwo) ? '' : addressData.intermediateAddressTwo.phoneNo
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          console.log('Submitting');

          const combinedValues = {
            currentAddress: {
              address: values.curAddress,
              landMark: values.curLandMark,
              city: values.curCity,
              state: values.curState,
              stayPeriod: values.curStayPeriod,
              country: values.curCountry,
              postalCode: values.curPostalCode,
              proofType: values.curProofType,
              addressProof: values.addressProof1,
              phoneNo: values.curPhoneNo
            },
            permanentAddress: {
              address: values.permAddress,
              landMark: values.permLandMark,
              city: values.permCity,
              state: values.permState,
              stayPeriod: values.permStayPeriod,
              country: values.permCountry,
              postalCode: values.permPostalCode,
              proofType: values.permProofType,
              addressProof: values.addressProof2,
              phoneNo: values.permPhoneNo
            },
            intermediateAddressOne: {
              address: values.interAddress1,
              landMark: values.interLandMark1,
              city: values.interCity1,
              state: values.interState1,
              stayPeriod: values.interStayPeriod1,
              country: values.interCountry1,
              postalCode: values.interPostalCode1,
              proofType: values.interProofType1,
              addressProof: values.addressProof3,
              phoneNo: values.interPhoneNo1
            },
            intermediateAddressTwo: {
              address: values.interAddress2,
              landMark: values.interLandMark2,
              city: values.interCity2,
              state: values.interState2,
              stayPeriod: values.interStayPeriod2,
              country: values.interCountry2,
              postalCode: values.interPostalCode2,
              proofType: values.interProofType2,
              addressProof: values.addressProof4,
              phoneNo: values.interPhoneNo2
            }
          };

          if (
            combinedValues.currentAddress.address === '' ||
            combinedValues.currentAddress.landMark === '' ||
            combinedValues.currentAddress.city === '' ||
            combinedValues.currentAddress.state === '' ||
            combinedValues.currentAddress.stayPeriod === '' ||
            combinedValues.currentAddress.country === '' ||
            combinedValues.currentAddress.postalCode === '' ||
            combinedValues.currentAddress.proofType === '' ||
            combinedValues.currentAddress.phoneNo === ''
          ) {
            combinedValues.currentAddress = {};
          }

          if (
            combinedValues.permanentAddress.address === '' ||
            combinedValues.permanentAddress.landMark === '' ||
            combinedValues.permanentAddress.city === '' ||
            combinedValues.permanentAddress.state === '' ||
            combinedValues.permanentAddress.stayPeriod === '' ||
            combinedValues.permanentAddress.country === '' ||
            combinedValues.permanentAddress.postalCode === '' ||
            combinedValues.permanentAddress.proofType === '' ||
            combinedValues.permanentAddress.phoneNo === ''
          ) {
            combinedValues.permanentAddress = {};
          }

          if (
            combinedValues.intermediateAddressOne.address === '' ||
            combinedValues.intermediateAddressOne.landMark === '' ||
            combinedValues.intermediateAddressOne.city === '' ||
            combinedValues.intermediateAddressOne.state === '' ||
            combinedValues.intermediateAddressOne.stayPeriod === '' ||
            combinedValues.intermediateAddressOne.country === '' ||
            combinedValues.intermediateAddressOne.postalCode === '' ||
            combinedValues.intermediateAddressOne.proofType === '' ||
            combinedValues.intermediateAddressOne.phoneNo === ''
          ) {
            combinedValues.intermediateAddressOne = {};
          }

          if (
            combinedValues.intermediateAddressTwo.address === '' ||
            combinedValues.intermediateAddressTwo.landMark === '' ||
            combinedValues.intermediateAddressTwo.city === '' ||
            combinedValues.intermediateAddressTwo.state === '' ||
            combinedValues.intermediateAddressTwo.stayPeriod === '' ||
            combinedValues.intermediateAddressTwo.country === '' ||
            combinedValues.intermediateAddressTwo.postalCode === '' ||
            combinedValues.intermediateAddressTwo.proofType === '' ||
            combinedValues.intermediateAddressTwo.phoneNo === ''
          ) {
            combinedValues.intermediateAddressTwo = {};
          }

          console.log('combinedValues', combinedValues);

          let allFilesData = [];
          const fileNameArray = ['addressProof1', 'addressProof2', 'addressProof3', 'addressProof4'];

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
            _sendAddress(combinedValues);
          } else {
            if (areFilesInvalid(allFilesData) !== 0) {
              sweetAlertHandler(bgvAlerts.invalidFilesPresent);
            } else {
              showLoader();
              _sendAddress(combinedValues);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <Form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <fieldset disabled={isDisabled}>
              <Row>
                <Col sm={12}>
                  <br />
                  <h5>Address Details</h5>
                  <hr />
                </Col>
              </Row>

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
                        error={touched.curAddress && errors.curAddress}
                        name="curAddress"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.curAddress}
                      />
                      {touched.curAddress && errors.curAddress ? (
                        <small className="text-danger form-text">{errors.curAddress}</small>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Landmark</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.curLandMark && errors.curLandMark}
                        name="curLandMark"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.curLandMark}
                      />
                      {touched.curLandMark && errors.curLandMark ? (
                        <small className="text-danger form-text">{errors.curLandMark}</small>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>City</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.curCity && errors.curCity}
                        name="curCity"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.curCity}
                      />
                      {touched.curCity && errors.curCity ? <small className="text-danger form-text">{errors.curCity}</small> : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>State</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.curState && errors.curState}
                        name="curState"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.curState}
                      />
                      {touched.curState && errors.curState ? <small className="text-danger form-text">{errors.curState}</small> : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Country</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.curCountry && errors.curCountry}
                        name="curCountry"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.curCountry}
                      />
                      {touched.curCountry && errors.curCountry ? (
                        <small className="text-danger form-text">{errors.curCountry}</small>
                      ) : null}
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
                        error={touched.curStayPeriod && errors.curStayPeriod}
                        name="curStayPeriod"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.curStayPeriod}
                      />
                      {touched.curStayPeriod && errors.curStayPeriod ? (
                        <small className="text-danger form-text">{errors.curStayPeriod}</small>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Postal code</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.curPostalCode && errors.curPostalCode}
                        name="curPostalCode"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        value={values.curPostalCode}
                      />
                      {touched.curPostalCode && errors.curPostalCode ? (
                        <small className="text-danger form-text">{errors.curPostalCode}</small>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Proof type</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.curProofType && errors.curProofType}
                        name="curProofType"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.curProofType}
                      />
                      {touched.curProofType && errors.curProofType ? (
                        <small className="text-danger form-text">{errors.curProofType}</small>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Contact number</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.curPhoneNo && errors.curPhoneNo}
                        name="curPhoneNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        value={values.curPhoneNo}
                      />
                      {touched.curPhoneNo && errors.curPhoneNo ? (
                        <small className="text-danger form-text">{errors.curPhoneNo}</small>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Address proof</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        // error={touched.addressProof1 && errors.addressProof1}
                        name="addressProof1"
                        id="addressProof1"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.addressProof1}
                      />
                      {addressData !== 'N.A.' &&
                        addressData.currentAddress.addressProof !== '' &&
                        addressData.currentAddress.addressProofURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={addressData.currentAddress.addressProofURL} target="_blank" rel="noopener noreferrer">
                            View existing image
                          </a>
                        </small>
                      ) : (
                        <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.addressProof1 && errors.addressProof1 ? (
                        <small className="text-danger form-text">{errors.addressProof1}</small>
                      ) : null}
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* Prev Address */}
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
                        error={touched.permAddress && errors.permAddress}
                        name="permAddress"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.permAddress}
                      />
                      {touched.permAddress && errors.permAddress ? (
                        <small className="text-danger form-text">{errors.permAddress}</small>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Landmark</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permLandMark && errors.permLandMark}
                        name="permLandMark"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.permLandMark}
                      />
                      {touched.permLandMark && errors.permLandMark ? (
                        <small className="text-danger form-text">{errors.permLandMark}</small>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>City</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permCity && errors.permCity}
                        name="permCity"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.permCity}
                      />
                      {touched.permCity && errors.permCity ? <small className="text-danger form-text">{errors.permCity}</small> : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>State</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permState && errors.permState}
                        name="permState"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.permState}
                      />
                      {touched.permState && errors.permState ? <small className="text-danger form-text">{errors.permState}</small> : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Country</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permCountry && errors.permCountry}
                        name="permCountry"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.permCountry}
                      />
                      {touched.permCountry && errors.permCountry ? (
                        <small className="text-danger form-text">{errors.permCountry}</small>
                      ) : null}
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
                        error={touched.permStayPeriod && errors.permStayPeriod}
                        name="permStayPeriod"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.permStayPeriod}
                      />
                      {touched.permStayPeriod && errors.permStayPeriod ? (
                        <small className="text-danger form-text">{errors.permStayPeriod}</small>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Postal code</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        type="number"
                        error={touched.permPostalCode && errors.permPostalCode}
                        name="permPostalCode"
                        value={values.permPostalCode}
                        onBlur={handleBlur}
                        onChange={handleChange}

                      />
                      {touched.permPostalCode && errors.permPostalCode ? (
                        <small className="text-danger form-text">{errors.permPostalCode}</small>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Proof type</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permProofType && errors.permProofType}
                        name="permProofType"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.permProofType}
                      />
                      {touched.permProofType && errors.permProofType ? (
                        <small className="text-danger form-text">{errors.permProofType}</small>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Contact number</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.permPhoneNo && errors.permPhoneNo}
                        name="permPhoneNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        value={values.permPhoneNo}

                      />
                      {touched.permPhoneNo && errors.permPhoneNo ? (
                        <small className="text-danger form-text">{errors.permPhoneNo}</small>
                      ) : null}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Address proof</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        // error={touched.addressProof2 && errors.addressProof2}
                        name="addressProof2"
                        id="addressProof2"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.addressProof2}
                      />
                      {addressData !== 'N.A.' &&
                        addressData.permanentAddress.addressProof !== '' &&
                        addressData.permanentAddress.addressProofURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={addressData.permanentAddress.addressProofURL} target="_blank" rel="noopener noreferrer">
                            View existing image
                          </a>
                        </small>
                      ) : (
                        <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.addressProof2 && errors.addressProof2 ? (
                        <small className="text-danger form-text">{errors.addressProof2}</small>
                      ) : null}
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col sm={11}></Col>
                <Col sm={1}>
                  {intermediateAddressOne ? (
                    <>
                      <Button
                        className="btn-block"
                        variant="outline-danger"
                        onClick={() => setIntermediateAddressOne(!intermediateAddressOne)}
                      >
                        <i className="feather icon-minus mx-1" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="btn-block"
                        variant="outline-primary"
                        onClick={() => setIntermediateAddressOne(!intermediateAddressOne)}
                      >
                        <i className="feather icon-plus mx-1" />
                      </Button>
                    </>
                  )}
                </Col>
              </Row>

              {/* Intermediate Address 1 */}
              <Collapse in={intermediateAddressOne}>
                <div id="basic-collapse">
                  <Row>
                    <Col sm={12}>
                      <br />
                      <h6>Intermediate Address 1</h6>
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
                            error={touched.interAddress1 && errors.interAddress1}
                            name="interAddress1"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interAddress1}
                          />
                          {touched.interAddress1 && errors.interAddress1 ? (
                            <small className="text-danger form-text">{errors.interAddress1}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Landmark</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.interLandMark1 && errors.interLandMark1}
                            name="interLandMark1"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interLandMark1}
                          />
                          {touched.interLandMark1 && errors.interLandMark1 ? (
                            <small className="text-danger form-text">{errors.interLandMark1}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>City</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.interCity1 && errors.interCity1}
                            name="interCity1"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interCity1}
                          />
                          {touched.interCity1 && errors.interCity1 ? (
                            <small className="text-danger form-text">{errors.interCity1}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>State</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.interState1 && errors.interState1}
                            name="interState1"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interState1}
                          />
                          {touched.interState1 && errors.interState1 ? (
                            <small className="text-danger form-text">{errors.interState1}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Country</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.interCountry1 && errors.interCountry1}
                            name="interCountry1"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interCountry1}
                          />
                          {touched.interCountry1 && errors.interCountry1 ? (
                            <small className="text-danger form-text">{errors.interCountry1}</small>
                          ) : null}
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
                            error={touched.interStayPeriod1 && errors.interStayPeriod1}
                            name="interStayPeriod1"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interStayPeriod1}
                          />
                          {touched.interStayPeriod1 && errors.interStayPeriod1 ? (
                            <small className="text-danger form-text">{errors.interStayPeriod1}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Postal code</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            type="number"
                            error={touched.interPostalCode1 && errors.interPostalCode1}
                            name="interPostalCode1"
                            value={values.interPostalCode1}
                            onBlur={handleBlur}
                            onChange={handleChange}

                          />
                          {touched.interPostalCode1 && errors.interPostalCode1 ? (
                            <small className="text-danger form-text">{errors.interPostalCode1}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Proof type</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.interProofType1 && errors.interProofType1}
                            name="interProofType1"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interProofType1}
                          />
                          {touched.interProofType1 && errors.interProofType1 ? (
                            <small className="text-danger form-text">{errors.interProofType1}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Contact number</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.interPhoneNo1 && errors.interPhoneNo1}
                            name="interPhoneNo1"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.interPhoneNo1}

                          />
                          {touched.interPhoneNo1 && errors.interPhoneNo1 ? (
                            <small className="text-danger form-text">{errors.interPhoneNo1}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Address proof</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            // error={touched.addressProof3 && errors.addressProof3}
                            name="addressProof3"
                            id="addressProof3"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.addressProof3}
                          />
                          {addressData !== 'N.A.' &&
                            addressData.intermediateAddressOne.addressProof !== '' &&
                            addressData.intermediateAddressOne.addressProofURL ? (
                            <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                              <a href={addressData.intermediateAddressOne.addressProofURL} target="_blank" rel="noopener noreferrer">
                                {Constants.Common.ViewExistingFile}
                              </a>
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.addressProof3 && errors.addressProof3 ? (
                            <small className="text-danger form-text">{errors.addressProof3}</small>
                          ) : null}
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={11}></Col>
                    <Col sm={1}>
                      {intermediateAddressTwo ? (
                        <>
                          <Button
                            className="btn-block"
                            variant="outline-danger"
                            onClick={() => setIntermediateAddressTwo(!intermediateAddressTwo)}
                          >
                            <i className="feather icon-minus mx-1" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className="btn-block"
                            variant="outline-primary"
                            onClick={() => setIntermediateAddressTwo(!intermediateAddressTwo)}
                          >
                            <i className="feather icon-plus mx-1" />
                          </Button>
                        </>
                      )}
                    </Col>
                  </Row>
                </div>
              </Collapse>

              {/* Intermediate Address 2 */}
              <Collapse in={intermediateAddressTwo}>
                <div id="basic-collapse">
                  <Row>
                    <Col sm={12}>
                      <br />
                      <h6>Intermediate Address 2</h6>
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
                            error={touched.interAddress2 && errors.interAddress2}
                            name="interAddress2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interAddress2}
                          />
                          {touched.interAddress2 && errors.interAddress2 ? (
                            <small className="text-danger form-text">{errors.interAddress2}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Landmark</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.interLandMark2 && errors.interLandMark2}
                            name="interLandMark2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interLandMark2}
                          />
                          {touched.interLandMark2 && errors.interLandMark2 ? (
                            <small className="text-danger form-text">{errors.interLandMark2}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>City</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.interCity2 && errors.interCity2}
                            name="interCity2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interCity2}
                          />
                          {touched.interCity2 && errors.interCity2 ? (
                            <small className="text-danger form-text">{errors.interCity2}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>State</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.interState2 && errors.interState2}
                            name="interState2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interState2}
                          />
                          {touched.interState2 && errors.interState2 ? (
                            <small className="text-danger form-text">{errors.interState2}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Country</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.interCountry2 && errors.interCountry2}
                            name="interCountry2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interCountry2}
                          />
                          {touched.interCountry2 && errors.interCountry2 ? (
                            <small className="text-danger form-text">{errors.interCountry2}</small>
                          ) : null}
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
                            error={touched.interStayPeriod2 && errors.interStayPeriod2}
                            name="interStayPeriod2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interStayPeriod2}
                          />
                          {touched.interStayPeriod2 && errors.interStayPeriod2 ? (
                            <small className="text-danger form-text">{errors.interStayPeriod2}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Postal code</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            type="number"
                            error={touched.interPostalCode2 && errors.interPostalCode2}
                            name="interPostalCode2"
                            value={values.interPostalCode2}
                            onBlur={handleBlur}
                            onChange={handleChange}

                          />
                          {touched.interPostalCode2 && errors.interPostalCode2 ? (
                            <small className="text-danger form-text">{errors.interPostalCode2}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Proof type</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.interProofType2 && errors.interProofType2}
                            name="interProofType2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.interProofType2}
                          />
                          {touched.interProofType2 && errors.interProofType2 ? (
                            <small className="text-danger form-text">{errors.interProofType2}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Contact number</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.interPhoneNo2 && errors.interPhoneNo2}
                            name="interPhoneNo2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.interPhoneNo2}

                          />
                          {touched.interPhoneNo2 && errors.interPhoneNo2 ? (
                            <small className="text-danger form-text">{errors.interPhoneNo2}</small>
                          ) : null}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Address proof</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            // error={touched.addressProof4 && errors.addressProof4}
                            name="addressProof4"
                            id="addressProof4"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.addressProof4}
                          />
                          {addressData !== 'N.A.' &&
                            addressData.intermediateAddressTwo.addressProof !== '' &&
                            addressData.intermediateAddressTwo.addressProofURL ? (
                            <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                              <a href={addressData.intermediateAddressTwo.addressProofURL} target="_blank" rel="noopener noreferrer">
                                {Constants.Common.ViewExistingFile}
                              </a>
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.addressProof4 && errors.addressProof4 ? (
                            <small className="text-danger form-text">{errors.addressProof4}</small>
                          ) : null}
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
          </Form>
        )}
      </Formik>
      {sessionStorage.getItem('user_category') === 'Operation Supervisor' ||
        sessionStorage.getItem('user_category') === 'Operation Team' ? (
        <AddressBgv addressData={addressData} reloadData={handleDataChange} />
      ) : null}
      {loader}
    </React.Fragment>
  );
};

export default Address;
