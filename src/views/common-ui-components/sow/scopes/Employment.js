import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form, ButtonGroup, ToggleButton, Collapse } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import * as Constants from '../../../../helper/constants';
import { Formik } from 'formik';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { bgvApi, fetchCaseCompDetails } from '../bgv-api/BgvApi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { isEmptyObject, GetYearDifference, splitWithDelimitter } from '../../../../util/utils';
import { getUrl } from '../bgv-api/getUrl';
import { bgvAlerts } from '../bgv-api/bgvAlerts';
import EmploymentBgv from './verifications/EmploymentBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const Employment = ({ className, rest, newUpload }) => {
  let [employmentData, setEmploymentData] = useState({});
  const [chooseFresher, setChooseFresher] = useState('No');
  const [employed, setEmployed] = useState('No');
  let { case_id } = useParams();
  const [isDisabled, setIsDisabled] = useState(true);
  const [disabled, setDisabled] = useState(false);
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

  const _sendEmploymentInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(employmentData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'Employment', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'Employment', case_id);
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

  const _fetchCaseEmployment = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'Employment');
    console.log('employment caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setEmploymentData("N.A.") : setEmploymentData(caseData);
      if (isEmptyObject(caseData)) {
        setEmploymentData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setEmployed(caseData.employmentDetailOne.currEmployed);
        setChooseFresher(caseData.employmentDetailOne.fresher);
        setEmploymentData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseEmployment();
    } else {
      setEmploymentData('N.A.');
    }
  }, [loadAgain]);

  useEffect(() => {
    chooseFresher === 'Yes' ? setDisabled(true) : setDisabled(false);
  }, [chooseFresher]);

  const validationSchema = Yup.object().shape({
    // fresher: Yup.string().oneOf(['yes', 'no'], 'please confirm that you are fresher or not!'),
    // currEmployed: Yup.string().oneOf(['yes', 'no'], 'please confirm that you are employed or not!'),
    currEmpName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currEmpNameAlphabets)
      .min(2, Constants.Employment.NameIsTooShort)
      .max(50, Constants.Employment.NameIsTooLong)
      .required(Constants.Employment.currEmpNameRequired),
    currLocation: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currLocationSpecial)
      .min(2, Constants.Employment.LocationTooShort)
      .max(50, Constants.Employment.LocationTooLong)
      .required(Constants.Employment.currLocationRequired),
    currCity: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currCityAlphabets)
      .min(2, Constants.Employment.CityIsTooShort)
      .max(50, Constants.Employment.CityIsTooLong)
      .required(Constants.Employment.currCityRequired),
    currTelNo: Yup.string()
      .min(10, Constants.AddressForm.validPermPhone)
      .max(10, Constants.AddressForm.validPermPhone)
      .required(Constants.Employment.currTelNoRequired),
    currJobtitle: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currJobtitleAlphabets)
      .min(2, Constants.Employment.JobTitleIsTooShort)
      .max(50, Constants.Employment.JobTitleIsTooLong)
      .required(Constants.Employment.currJobtitleRequired),
    currEmpCode: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currEmpCodeSpecial)
      .required(Constants.Employment.currEmpCodeRequired),
    currEmpCtc: Yup.string()
      .min(3, Constants.Employment.currEmpCtcTooShort)
      .max(10, Constants.Employment.currEmpCtcTooLong)
      .required(Constants.Employment.currEmpCtcRequired),
    currJoinDate: Yup.string().required(Constants.Employment.currJoinDateRequired),
    currRelieving: Yup.string().required(Constants.Employment.currRelievingRequired),
    currEmpPeriod: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.noSepcial)
      .required(Constants.Employment.currEmpPeriodRequired),
    currEmpLeavingReason: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currEmpLeavingReasonSpecial)
      .min(10, Constants.Employment.reasonTooShort)
      .max(50, Constants.Employment.reasonTooLong)
      .required(Constants.Employment.currEmpLeavingReasonRequired),
    currManagerDetails: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.onlyAlphabets)
      .min(2, Constants.Employment.managerDetailsTooShort)
      .max(50, Constants.Employment.managerDetailsTooLong)
      .required(Constants.Employment.currManagerDetailsRequired),
    currManagerPhone: Yup.string()
      .min(10, Constants.AddressForm.validPermPhone)
      .max(10, Constants.AddressForm.validPermPhone)
      .required(Constants.Employment.currManagerPhoneRequired),
    currManagerEmail: Yup.string().email(Constants.Employment.validEmail).required(Constants.Employment.currManagerEmailRequired),
    currHrName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.onlyAlphabets)
      .min(2, Constants.Employment.hrNameTooShort)
      .max(50, Constants.Employment.hrNameTooLong)
      .required(Constants.Employment.currHrNameRequired),
    currHrEmail: Yup.string().email(Constants.Employment.validEmail).required(Constants.Employment.currHrEmailRequired),

    currEmpNameTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currEmpNameAlphabets)
      .min(2, Constants.Employment.NameIsTooShort)
      .max(50, Constants.Employment.NameIsTooLong),
    currLocationTwo: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currLocationSpecial)
      .min(2, Constants.Employment.LocationTooShort)
      .max(50, Constants.Employment.LocationTooLong),
    currCityTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currCityAlphabets)
      .min(2, Constants.Employment.CityIsTooShort)
      .max(50, Constants.Employment.CityIsTooLong),
    currTelNoTwo: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone),
    currJobtitleTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currJobtitleAlphabets)
      .min(2, Constants.Employment.JobTitleIsTooShort)
      .max(50, Constants.Employment.JobTitleIsTooLong),
    currEmpCodeTwo: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currEmpCodeSpecial),
    currEmpCtcTwo: Yup.string().min(3, Constants.Employment.currEmpCtcTooShort).max(10, Constants.Employment.currEmpCtcTooLong),
    currJoinDateTwo: Yup.string(),
    currRelievingTwo: Yup.string(),
    currEmpPeriodTwo: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.noSepcial),
    currEmpLeavingReasonTwo: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currEmpLeavingReasonSpecial)
      .min(10, Constants.Employment.reasonTooShort)
      .max(50, Constants.Employment.reasonTooLong),
    currManagerDetailsTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.onlyAlphabets)
      .min(2, Constants.Employment.managerDetailsTooShort)
      .max(50, Constants.Employment.managerDetailsTooLong),
    currManagerPhoneTwo: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone),
    currManagerEmailTwo: Yup.string().email(Constants.Employment.validEmail),
    currHrNameTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.onlyAlphabets)
      .min(2, Constants.Employment.hrNameTooShort)
      .max(50, Constants.Employment.hrNameTooLong),
    currHrEmailTwo: Yup.string().email(Constants.Employment.validEmail),

    currEmpNameThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currEmpNameAlphabets)
      .min(2, Constants.Employment.NameIsTooShort)
      .max(50, Constants.Employment.NameIsTooLong),
    currLocationThree: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currLocationSpecial)
      .min(2, Constants.Employment.LocationTooShort)
      .max(50, Constants.Employment.LocationTooLong),
    currCityThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currCityAlphabets)
      .min(2, Constants.Employment.CityIsTooShort)
      .max(50, Constants.Employment.CityIsTooLong),
    currTelNoThree: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone),
    currJobtitleThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currJobtitleAlphabets)
      .min(2, Constants.Employment.JobTitleIsTooShort)
      .max(50, Constants.Employment.JobTitleIsTooLong),
    currEmpCodeThree: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currEmpCodeSpecial),
    currEmpCtcThree: Yup.string().min(3, Constants.Employment.currEmpCtcTooShort).max(10, Constants.Employment.currEmpCtcTooLong),
    currJoinDateThree: Yup.string(),
    currRelievingThree: Yup.string(),
    currEmpPeriodThree: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.noSepcial),
    currEmpLeavingReasonThree: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currEmpLeavingReasonSpecial)
      .min(10, Constants.Employment.reasonTooShort)
      .max(50, Constants.Employment.reasonTooLong),
    currManagerDetailsThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.onlyAlphabets)
      .min(2, Constants.Employment.managerDetailsTooShort)
      .max(50, Constants.Employment.managerDetailsTooLong),
    currManagerPhoneThree: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone),
    currManagerEmailThree: Yup.string().email(Constants.Employment.validEmail),
    currHrNameThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.onlyAlphabets)
      .min(2, Constants.Employment.hrNameTooShort)
      .max(50, Constants.Employment.hrNameTooLong),
    currHrEmailThree: Yup.string().email(Constants.Employment.validEmail)
  });
  const validationSchemaDisabled = Yup.object().shape({
    // fresher: Yup.string().oneOf(['yes', 'no'], 'please confirm that you are fresher or not!'),
    // currEmployed: Yup.string().oneOf(['yes', 'no'], 'please confirm that you are employed or not!'),
    currEmpName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currEmpNameAlphabets)
      .min(2, Constants.Employment.NameIsTooShort)
      .max(50, Constants.Employment.NameIsTooLong),
    currLocation: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currLocationSpecial)
      .min(2, Constants.Employment.LocationTooShort)
      .max(50, Constants.Employment.LocationTooLong),
    currCity: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currCityAlphabets)
      .min(2, Constants.Employment.CityIsTooShort)
      .max(50, Constants.Employment.CityIsTooLong),
    currTelNo: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone),
    currJobtitle: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currJobtitleAlphabets)
      .min(2, Constants.Employment.JobTitleIsTooShort)
      .max(50, Constants.Employment.JobTitleIsTooLong),
    currEmpCode: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currEmpCodeSpecial),
    currEmpCtc: Yup.string().min(3, Constants.Employment.currEmpCtcTooShort).max(10, Constants.Employment.currEmpCtcTooLong),
    currJoinDate: Yup.string(),
    currRelieving: Yup.string(),
    currEmpPeriod: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.noSepcial),
    currEmpLeavingReason: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currEmpLeavingReasonSpecial)
      .min(10, Constants.Employment.reasonTooShort)
      .max(50, Constants.Employment.reasonTooLong),
    currManagerDetails: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.onlyAlphabets)
      .min(2, Constants.Employment.managerDetailsTooShort)
      .max(50, Constants.Employment.managerDetailsTooLong),
    currManagerPhone: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone),
    currManagerEmail: Yup.string().email(Constants.Employment.validEmail),
    currHrName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.onlyAlphabets)
      .min(2, Constants.Employment.hrNameTooShort)
      .max(50, Constants.Employment.hrNameTooLong),
    currHrEmail: Yup.string().email(Constants.Employment.validEmail),

    currEmpNameTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currEmpNameAlphabets)
      .min(2, Constants.Employment.NameIsTooShort)
      .max(50, Constants.Employment.NameIsTooLong),
    currLocationTwo: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currLocationSpecial)
      .min(2, Constants.Employment.LocationTooShort)
      .max(50, Constants.Employment.LocationTooLong),
    currCityTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currCityAlphabets)
      .min(2, Constants.Employment.CityIsTooShort)
      .max(50, Constants.Employment.CityIsTooLong),
    currTelNoTwo: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone),
    currJobtitleTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currJobtitleAlphabets)
      .min(2, Constants.Employment.JobTitleIsTooShort)
      .max(50, Constants.Employment.JobTitleIsTooLong),
    currEmpCodeTwo: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currEmpCodeSpecial),
    currEmpCtcTwo: Yup.string().min(3, Constants.Employment.currEmpCtcTooShort).max(10, Constants.Employment.currEmpCtcTooLong),
    currJoinDateTwo: Yup.string(),
    currRelievingTwo: Yup.string(),
    currEmpPeriodTwo: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.noSepcial),
    currEmpLeavingReasonTwo: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currEmpLeavingReasonSpecial)
      .min(10, Constants.Employment.reasonTooShort)
      .max(50, Constants.Employment.reasonTooLong),
    currManagerDetailsTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.onlyAlphabets)
      .min(2, Constants.Employment.managerDetailsTooShort)
      .max(50, Constants.Employment.managerDetailsTooLong),
    currManagerPhoneTwo: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone),
    currManagerEmailTwo: Yup.string().email(Constants.Employment.validEmail),
    currHrNameTwo: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.onlyAlphabets)
      .min(2, Constants.Employment.hrNameTooShort)
      .max(50, Constants.Employment.hrNameTooLong),
    currHrEmailTwo: Yup.string().email(Constants.Employment.validEmail),

    currEmpNameThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currEmpNameAlphabets)
      .min(2, Constants.Employment.NameIsTooShort)
      .max(50, Constants.Employment.NameIsTooLong),
    currLocationThree: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currLocationSpecial)
      .min(2, Constants.Employment.LocationTooShort)
      .max(50, Constants.Employment.LocationTooLong),
    currCityThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currCityAlphabets)
      .min(2, Constants.Employment.CityIsTooShort)
      .max(50, Constants.Employment.CityIsTooLong),
    currTelNoThree: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone),
    currJobtitleThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.currJobtitleAlphabets)
      .min(2, Constants.Employment.JobTitleIsTooShort)
      .max(50, Constants.Employment.JobTitleIsTooLong),
    currEmpCodeThree: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currEmpCodeSpecial),
    currEmpCtcThree: Yup.string().min(3, Constants.Employment.currEmpCtcTooShort).max(10, Constants.Employment.currEmpCtcTooLong),
    currJoinDateThree: Yup.string(),
    currRelievingThree: Yup.string(),
    currEmpPeriodThree: Yup.string().matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.noSepcial),
    currEmpLeavingReasonThree: Yup.string()
      .matches(Constants.Common.AlphaNumaricRegex, Constants.Employment.currEmpLeavingReasonSpecial)
      .min(10, Constants.Employment.reasonTooShort)
      .max(50, Constants.Employment.reasonTooLong),
    currManagerDetailsThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.onlyAlphabets)
      .min(2, Constants.Employment.managerDetailsTooShort)
      .max(50, Constants.Employment.managerDetailsTooLong),
    currManagerPhoneThree: Yup.string().min(10, Constants.AddressForm.validPermPhone).max(10, Constants.AddressForm.validPermPhone),
    currManagerEmailThree: Yup.string().email(Constants.Employment.validEmail),
    currHrNameThree: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.Employment.onlyAlphabets)
      .min(2, Constants.Employment.hrNameTooShort)
      .max(50, Constants.Employment.hrNameTooLong),
    currHrEmailThree: Yup.string().email(Constants.Employment.validEmail)
  });

  return isEmptyObject(employmentData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          // currEmployed: employmentData === "N.A." ? false : employmentData.currEmployed === true || employmentData.currEmployed === false ? employmentData.currEmployed : false,
          fresher:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.fresher,
          currEmployed:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currEmployed,
          currEmpName:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currEmpName,
          currLocation:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currLocation,
          currCity:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currCity,
          currTelNo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currTelNo,
          currJobtitle:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currJobtitle,
          currEmpCode:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currEmpCode,
          currEmpCtc:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currEmpCtc,
          currJoinDate:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currJoinDate,
          currRelieving:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currRelieving,
          currEmpPeriod:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currEmpPeriod,
          currEmpLeavingReason:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currEmpLeavingReason,
          currManagerDetails:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currManagerDetails,
          currManagerPhone:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currManagerPhone,
          currManagerEmail:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currManagerEmail,
          currHrName:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currHrName,
          currHrEmail:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailOne) || disabled === true
              ? ''
              : employmentData.employmentDetailOne.currHrEmail,
          currEmpOfferLetter1: '',
          currEmpSalarySlip1: '',
          currEmpReleivingLetter1: '',

          currEmpNameTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currEmpName,
          currLocationTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currLocation,
          currCityTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currCity,
          currTelNoTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currTelNo,
          currJobtitleTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currJobtitle,
          currEmpCodeTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currEmpCode,
          currEmpCtcTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currEmpCtc,
          currJoinDateTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currJoinDate,
          currRelievingTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currRelieving,
          currEmpPeriodTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currEmpPeriod,
          currEmpLeavingReasonTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currEmpLeavingReason,
          currManagerDetailsTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currManagerDetails,
          currManagerPhoneTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currManagerPhone,
          currManagerEmailTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currManagerEmail,
          currHrNameTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currHrName,
          currHrEmailTwo:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailTwo) || disabled === true
              ? ''
              : employmentData.employmentDetailTwo.currHrEmail,
          currEmpOfferLetter2: '',
          currEmpSalarySlip2: '',
          currEmpReleivingLetter2: '',

          currEmpNameThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currEmpName,
          currLocationThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currLocation,
          currCityThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currCity,
          currTelNoThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currTelNo,
          currJobtitleThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currJobtitle,
          currEmpCodeThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currEmpCode,
          currEmpCtcThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currEmpCtc,
          currJoinDateThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currJoinDate,
          currRelievingThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currRelieving,
          currEmpPeriodThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currEmpPeriod,
          currEmpLeavingReasonThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currEmpLeavingReason,
          currManagerDetailsThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currManagerDetails,
          currManagerPhoneThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currManagerPhone,
          currManagerEmailThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currManagerEmail,
          currHrNameThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currHrName,
          currHrEmailThree:
            employmentData === 'N.A.' || isEmptyObject(employmentData.employmentDetailThree) || disabled === true
              ? ''
              : employmentData.employmentDetailThree.currHrEmail,
          currEmpOfferLetter3: '',
          currEmpSalarySlip3: '',
          currEmpReleivingLetter3: ''
        }}
        validationSchema={disabled === true ? validationSchemaDisabled : validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);

          let ageDiff = GetYearDifference(splitWithDelimitter(values.currRelieving, '-'), splitWithDelimitter(values.currJoinDate, '-'));
          let ageDiff2 = 1;
          let ageDiff3 = 1;
          if (values.currRelievingTwo && values.currJoinDateTwo) {
            ageDiff2 = GetYearDifference(
              splitWithDelimitter(values.currRelievingTwo, '-'),
              splitWithDelimitter(values.currJoinDateTwo, '-')
            );
          }
          if (values.currRelievingThree && values.currJoinDateThree) {
            ageDiff3 = GetYearDifference(
              splitWithDelimitter(values.currRelievingThree, '-'),
              splitWithDelimitter(values.currJoinDateThree, '-')
            );
          }
          console.log('ageDiff1', ageDiff);
          console.log('ageDiff2', ageDiff2);
          console.log('ageDiff3', ageDiff3);
          if (ageDiff <= 0 || ageDiff2 <= 0 || ageDiff3 <= 0) {
            sweetAlertHandler(bgvAlerts.joinDateReleivingDateMismatch);
          } else {
            const combinedValues = {
              employmentDetailOne: {
                fresher: chooseFresher,
                currEmployed: employed,
                currEmpName: values.currEmpName,
                currLocation: values.currLocation,
                currCity: values.currCity,
                currTelNo: values.currTelNo,
                currJobtitle: values.currJobtitle,
                currEmpCode: values.currEmpCode,
                currEmpCtc: values.currEmpCtc,
                currJoinDate: values.currJoinDate,
                currRelieving: values.currRelieving,
                currEmpPeriod: values.currEmpPeriod,
                currEmpLeavingReason: values.currEmpLeavingReason,
                currManagerDetails: values.currManagerDetails,
                currManagerPhone: values.currManagerPhone,
                currManagerEmail: values.currManagerEmail,
                currHrName: values.currHrName,
                currHrEmail: values.currHrEmail,
                currEmpOfferLetter: values.currEmpOfferLetter1,
                currEmpSalarySlip: values.currEmpSalarySlip1,
                currEmpReleivingLetter: values.currEmpReleivingLetter1
              },
              employmentDetailTwo: {
                currEmpName: values.currEmpNameTwo,
                currLocation: values.currLocationTwo,
                currCity: values.currCityTwo,
                currTelNo: values.currTelNoTwo,
                currJobtitle: values.currJobtitleTwo,
                currEmpCode: values.currEmpCodeTwo,
                currEmpCtc: values.currEmpCtcTwo,
                currJoinDate: values.currJoinDateTwo,
                currRelieving: values.currRelievingTwo,
                currEmpPeriod: values.currEmpPeriodTwo,
                currEmpLeavingReason: values.currEmpLeavingReasonTwo,
                currManagerDetails: values.currManagerDetailsTwo,
                currManagerPhone: values.currManagerPhoneTwo,
                currManagerEmail: values.currManagerEmailTwo,
                currHrName: values.currHrNameTwo,
                currHrEmail: values.currHrEmailTwo,
                currEmpOfferLetter: values.currEmpOfferLetter2,
                currEmpSalarySlip: values.currEmpSalarySlip2,
                currEmpReleivingLetter: values.currEmpReleivingLetter2
              },
              employmentDetailThree: {
                currEmpName: values.currEmpNameThree,
                currLocation: values.currLocationThree,
                currCity: values.currCityThree,
                currTelNo: values.currTelNoThree,
                currJobtitle: values.currJobtitleThree,
                currEmpCode: values.currEmpCodeThree,
                currEmpCtc: values.currEmpCtcThree,
                currJoinDate: values.currJoinDateThree,
                currRelieving: values.currRelievingThree,
                currEmpPeriod: values.currEmpPeriodThree,
                currEmpLeavingReason: values.currEmpLeavingReasonThree,
                currManagerDetails: values.currManagerDetailsThree,
                currManagerPhone: values.currManagerPhoneThree,
                currManagerEmail: values.currManagerEmailThree,
                currHrName: values.currHrNameThree,
                currHrEmail: values.currHrEmailThree,
                currEmpOfferLetter: values.currEmpOfferLetter3,
                currEmpSalarySlip: values.currEmpSalarySlip3,
                currEmpReleivingLetter: values.currEmpReleivingLetter3
              }
            };

            if (
              combinedValues.employmentDetailTwo.currEmpName === '' ||
              combinedValues.employmentDetailTwo.currLocation === '' ||
              combinedValues.employmentDetailTwo.currCity === '' ||
              combinedValues.employmentDetailTwo.currTelNo === '' ||
              combinedValues.employmentDetailTwo.currJobtitle === '' ||
              combinedValues.employmentDetailTwo.currEmpCode === '' ||
              combinedValues.employmentDetailTwo.currEmpCtc === '' ||
              combinedValues.employmentDetailTwo.currJoinDate === '' ||
              combinedValues.employmentDetailTwo.currRelieving === '' ||
              combinedValues.employmentDetailTwo.currEmpPeriod === '' ||
              combinedValues.employmentDetailTwo.currEmpLeavingReason === '' ||
              combinedValues.employmentDetailTwo.currManagerDetails === '' ||
              combinedValues.employmentDetailTwo.currManagerPhone === '' ||
              combinedValues.employmentDetailTwo.currManagerEmail === ''
            ) {
              combinedValues.employmentDetailTwo = {};
            }

            if (
              combinedValues.employmentDetailThree.currEmpName === '' ||
              combinedValues.employmentDetailThree.currLocation === '' ||
              combinedValues.employmentDetailThree.currCity === '' ||
              combinedValues.employmentDetailThree.currTelNo === '' ||
              combinedValues.employmentDetailThree.currJobtitle === '' ||
              combinedValues.employmentDetailThree.currEmpCode === '' ||
              combinedValues.employmentDetailThree.currEmpCtc === '' ||
              combinedValues.employmentDetailThree.currJoinDate === '' ||
              combinedValues.employmentDetailThree.currRelieving === '' ||
              combinedValues.employmentDetailThree.currEmpPeriod === '' ||
              combinedValues.employmentDetailThree.currEmpLeavingReason === '' ||
              combinedValues.employmentDetailThree.currManagerDetails === '' ||
              combinedValues.employmentDetailThree.currManagerPhone === '' ||
              combinedValues.employmentDetailThree.currManagerEmail === ''
            ) {
              combinedValues.employmentDetailThree = {};
            }

            let allFilesData = [];
            const fileNameArray = [
              'currEmpOfferLetter1',
              'currEmpSalarySlip1',
              'currEmpReleivingLetter1',
              'currEmpOfferLetter2',
              'currEmpSalarySlip2',
              'currEmpReleivingLetter2',
              'currEmpOfferLetter3',
              'currEmpSalarySlip3',
              'currEmpReleivingLetter3'
            ];

            fileNameArray.forEach((fileName) => {
              let selectedFile = document.getElementById(fileName).files[0];
              console.log('File is here!');
              console.log('selectedFile: ', selectedFile);
              if (selectedFile) {
                allFilesData.push(selectedFile);
              }
            });

            console.log(allFilesData);

            if (allFilesData.length === 0) {
              console.log(combinedValues);
              showLoader();
              _sendEmploymentInfo(combinedValues);
            } else {
              if (areFilesInvalid(allFilesData) !== 0) {
                sweetAlertHandler(bgvAlerts.invalidFilesPresent);
              } else {
                console.log(combinedValues);
                showLoader();
                _sendEmploymentInfo(combinedValues);
              }
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
                  <h5>Employment 1</h5>
                  <hr />
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Fresher</label>
                    </Col>
                    <Col sm={9}>
                      <div className="row">
                        {Constants.Employment.YesNo.map((radio, idx) => (
                          <>
                            <div className="col-md-3">
                              <div className="row profile-view-radio-button-view">
                                <Form.Check
                                  key={idx}
                                  id={`radio-fresher-${idx}`}
                                  error={touched.fresher && errors.fresher}
                                  type="radio"
                                  variant={'outline-primary'}
                                  name="radio-fresher"
                                  value={radio.value}
                                  checked={chooseFresher === radio.value}
                                  onChange={(e) => setChooseFresher(e.currentTarget.value)}
                                  // className='ml-3 col-md-6'
                                />
                                <Form.Label className="profile-view-question" id={`radio-fresher-${idx}`}>
                                  {radio.label}
                                </Form.Label>
                              </div>
                            </div>
                          </>
                        ))}
                      </div>
                      {touched.fresher && errors.fresher && <small className="text-danger form-text">{errors.fresher}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Are you currently employed?</label>
                    </Col>
                    <Col sm={9}>
                      <div className="row">
                        {Constants.Employment.YesNo.map((radio, idx) => (
                          <>
                            <div className="col-md-3">
                              <div className="row profile-view-radio-button-view">
                                <Form.Check
                                  key={idx}
                                  id={`radio-employ-1-${idx}`}
                                  error={touched.currEmployed && errors.currEmployed}
                                  type="radio"
                                  variant={'outline-primary'}
                                  name="radio-employ-1"
                                  value={radio.value}
                                  checked={employed === radio.value}
                                  onChange={(e) => setEmployed(e.currentTarget.value)}
                                  disabled={disabled === true}
                                />
                                <Form.Label className="profile-view-question" id={`radio-employ-1-${idx}`}>
                                  {radio.label}
                                </Form.Label>
                              </div>
                            </div>
                          </>
                        ))}
                      </div>
                      {touched.currEmployed && errors.currEmployed && (
                        <small className="text-danger form-text">{errors.currEmployed}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Name of the employer</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currEmpName && errors.currEmpName}
                        name="currEmpName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.currEmpName}
                        disabled={disabled === true}
                      />
                      {touched.currEmpName && errors.currEmpName && <small className="text-danger form-text">{errors.currEmpName}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Location</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currLocation && errors.currLocation}
                        name="currLocation"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.currLocation}
                        disabled={disabled === true}
                      />
                      {touched.currLocation && errors.currLocation && (
                        <small className="text-danger form-text">{errors.currLocation}</small>
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
                        error={touched.currCity && errors.currCity}
                        name="currCity"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.currCity}
                        disabled={disabled === true}
                      />
                      {touched.currCity && errors.currCity && <small className="text-danger form-text">{errors.currCity}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Telephone No</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currTelNo && errors.currTelNo}
                        name="currTelNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        value={values.currTelNo}
                        disabled={disabled === true}
                      />
                      {touched.currTelNo && errors.currTelNo && <small className="text-danger form-text">{errors.currTelNo}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Job Title</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currJobtitle && errors.currJobtitle}
                        name="currJobtitle"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.currJobtitle}
                        disabled={disabled === true}
                      />
                      {touched.currJobtitle && errors.currJobtitle && (
                        <small className="text-danger form-text">{errors.currJobtitle}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Employee Code</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currEmpCode && errors.currEmpCode}
                        name="currEmpCode"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.currEmpCode}
                        disabled={disabled === true}
                      />
                      {touched.currEmpCode && errors.currEmpCode && <small className="text-danger form-text">{errors.currEmpCode}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Last Drawn Salary</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currEmpCtc && errors.currEmpCtc}
                        name="currEmpCtc"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        value={values.currEmpCtc}
                        disabled={disabled === true}
                      />
                      {touched.currEmpCtc && errors.currEmpCtc && <small className="text-danger form-text">{errors.currEmpCtc}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Joining Date</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currJoinDate && errors.currJoinDate}
                        name="currJoinDate"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        value={values.currJoinDate}
                        disabled={disabled === true}
                      />
                      {touched.currJoinDate && errors.currJoinDate && (
                        <small className="text-danger form-text">{errors.currJoinDate}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Releiving Date</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currRelieving && errors.currRelieving}
                        name="currRelieving"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        value={values.currRelieving}
                        disabled={disabled === true}
                      />
                      {touched.currRelieving && errors.currRelieving && (
                        <small className="text-danger form-text">{errors.currRelieving}</small>
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Period of employment</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currEmpPeriod && errors.currEmpPeriod}
                        name="currEmpPeriod"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.currEmpPeriod}
                        disabled={disabled === true}
                      />
                      {touched.currEmpPeriod && errors.currEmpPeriod && (
                        <small className="text-danger form-text">{errors.currEmpPeriod}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Reason for leaving</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currEmpLeavingReason && errors.currEmpLeavingReason}
                        name="currEmpLeavingReason"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.currEmpLeavingReason}
                        disabled={disabled === true}
                      />
                      {touched.currEmpLeavingReason && errors.currEmpLeavingReason && (
                        <small className="text-danger form-text">{errors.currEmpLeavingReason}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Manager name and designation</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currManagerDetails && errors.currManagerDetails}
                        name="currManagerDetails"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.currManagerDetails}
                        disabled={disabled === true}
                      />
                      {touched.currManagerDetails && errors.currManagerDetails && (
                        <small className="text-danger form-text">{errors.currManagerDetails}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Manager phone</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currManagerPhone && errors.currManagerPhone}
                        name="currManagerPhone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        value={values.currManagerPhone}
                        disabled={disabled === true}
                      />
                      {touched.currManagerPhone && errors.currManagerPhone && (
                        <small className="text-danger form-text">{errors.currManagerPhone}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Manager email</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currManagerEmail && errors.currManagerEmail}
                        name="currManagerEmail"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.currManagerEmail}
                        disabled={disabled === true}
                      />
                      {touched.currManagerEmail && errors.currManagerEmail && (
                        <small className="text-danger form-text">{errors.currManagerEmail}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>HR Name</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currHrName && errors.currHrName}
                        name="currHrName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.currHrName}
                        disabled={disabled === true}
                      />
                      {touched.currHrName && errors.currHrName && <small className="text-danger form-text">{errors.currHrName}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>HR Email</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currHrEmail && errors.currHrEmail}
                        name="currHrEmail"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.currHrEmail}
                        disabled={disabled === true}
                      />
                      {touched.currHrEmail && errors.currHrEmail && <small className="text-danger form-text">{errors.currHrEmail}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Offer letter</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currEmpOfferLetter1 && errors.currEmpOfferLetter1}
                        name="currEmpOfferLetter1"
                        id="currEmpOfferLetter1"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.currEmpOfferLetter1}
                        disabled={disabled === true}
                      />
                      {employmentData !== 'N.A.' &&
                      employmentData.employmentDetailOne.currEmpOfferLetter !== '' &&
                      employmentData.employmentDetailOne.currEmpOfferLetterURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={employmentData.employmentDetailOne.currEmpOfferLetterURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.currEmpOfferLetter1 && errors.currEmpOfferLetter1 && (
                        <small className="text-danger form-text">{errors.currEmpOfferLetter1}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Current salary slip</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currEmpSalarySlip1 && errors.currEmpSalarySlip1}
                        name="currEmpSalarySlip1"
                        id="currEmpSalarySlip1"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.currEmpSalarySlip1}
                        disabled={disabled === true}
                      />
                      {employmentData !== 'N.A.' &&
                      employmentData.employmentDetailOne.currEmpSalarySlip !== '' &&
                      employmentData.employmentDetailOne.currEmpSalarySlipURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={employmentData.employmentDetailOne.currEmpSalarySlipURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.currEmpSalarySlip1 && errors.currEmpSalarySlip1 && (
                        <small className="text-danger form-text">{errors.currEmpSalarySlip1}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Releiving letter</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.currEmpReleivingLetter1 && errors.currEmpReleivingLetter1}
                        name="currEmpReleivingLetter1"
                        id="currEmpReleivingLetter1"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.currEmpReleivingLetter1}
                        disabled={disabled === true}
                      />
                      {employmentData !== 'N.A.' &&
                      employmentData.employmentDetailOne.currEmpReleivingLetter !== '' &&
                      employmentData.employmentDetailOne.currEmpReleivingLetterURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={employmentData.employmentDetailOne.currEmpReleivingLetterURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.currEmpReleivingLetter1 && errors.currEmpReleivingLetter1 && (
                        <small className="text-danger form-text">{errors.currEmpReleivingLetter1}</small>
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
                      <h5>Employment 2</h5>
                      <hr />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Name of the employer</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpNameTwo && errors.currEmpNameTwo}
                            name="currEmpNameTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currEmpNameTwo}
                            disabled={disabled === true}
                          />
                          {touched.currEmpNameTwo && errors.currEmpNameTwo && (
                            <small className="text-danger form-text">{errors.currEmpNameTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Location</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currLocationTwo && errors.currLocationTwo}
                            name="currLocationTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currLocationTwo}
                            disabled={disabled === true}
                          />
                          {touched.currLocationTwo && errors.currLocationTwo && (
                            <small className="text-danger form-text">{errors.currLocationTwo}</small>
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
                            error={touched.currCityTwo && errors.currCityTwo}
                            name="currCityTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currCityTwo}
                            disabled={disabled === true}
                          />
                          {touched.currCityTwo && errors.currCityTwo && (
                            <small className="text-danger form-text">{errors.currCityTwo}</small>
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
                            error={touched.currTelNoTwo && errors.currTelNoTwo}
                            name="currTelNoTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.currTelNoTwo}
                            disabled={disabled === true}
                          />
                          {touched.currTelNoTwo && errors.currTelNoTwo && (
                            <small className="text-danger form-text">{errors.currTelNoTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Job Title</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currJobtitleTwo && errors.currJobtitleTwo}
                            name="currJobtitleTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currJobtitleTwo}
                            disabled={disabled === true}
                          />
                          {touched.currJobtitleTwo && errors.currJobtitleTwo && (
                            <small className="text-danger form-text">{errors.currJobtitleTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Employee Code</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpCodeTwo && errors.currEmpCodeTwo}
                            name="currEmpCodeTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currEmpCodeTwo}
                            disabled={disabled === true}
                          />
                          {touched.currEmpCodeTwo && errors.currEmpCodeTwo && (
                            <small className="text-danger form-text">{errors.currEmpCodeTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Last Drawn Salary</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpCtcTwo && errors.currEmpCtcTwo}
                            name="currEmpCtcTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.currEmpCtcTwo}
                            disabled={disabled === true}
                          />
                          {touched.currEmpCtcTwo && errors.currEmpCtcTwo && (
                            <small className="text-danger form-text">{errors.currEmpCtcTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Joining Date</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currJoinDateTwo && errors.currJoinDateTwo}
                            name="currJoinDateTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="date"
                            value={values.currJoinDateTwo}
                            disabled={disabled === true}
                          />
                          {touched.currJoinDateTwo && errors.currJoinDateTwo && (
                            <small className="text-danger form-text">{errors.currJoinDateTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Releiving Date</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currRelievingTwo && errors.currRelievingTwo}
                            name="currRelievingTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="date"
                            value={values.currRelievingTwo}
                            disabled={disabled === true}
                          />
                          {touched.currRelievingTwo && errors.currRelievingTwo && (
                            <small className="text-danger form-text">{errors.currRelievingTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Period of employment</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpPeriodTwo && errors.currEmpPeriodTwo}
                            name="currEmpPeriodTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currEmpPeriodTwo}
                            disabled={disabled === true}
                          />
                          {touched.currEmpPeriodTwo && errors.currEmpPeriodTwo && (
                            <small className="text-danger form-text">{errors.currEmpPeriodTwo}</small>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Reason for leaving</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpLeavingReasonTwo && errors.currEmpLeavingReasonTwo}
                            name="currEmpLeavingReasonTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currEmpLeavingReasonTwo}
                            disabled={disabled === true}
                          />
                          {touched.currEmpLeavingReasonTwo && errors.currEmpLeavingReasonTwo && (
                            <small className="text-danger form-text">{errors.currEmpLeavingReasonTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Manager name and designation</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currManagerDetailsTwo && errors.currManagerDetailsTwo}
                            name="currManagerDetailsTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currManagerDetailsTwo}
                            disabled={disabled === true}
                          />
                          {touched.currManagerDetailsTwo && errors.currManagerDetailsTwo && (
                            <small className="text-danger form-text">{errors.currManagerDetailsTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Manager phone</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currManagerPhoneTwo && errors.currManagerPhoneTwo}
                            name="currManagerPhoneTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.currManagerPhoneTwo}
                            disabled={disabled === true}
                          />
                          {touched.currManagerPhoneTwo && errors.currManagerPhoneTwo && (
                            <small className="text-danger form-text">{errors.currManagerPhoneTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Manager email</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currManagerEmailTwo && errors.currManagerEmailTwo}
                            name="currManagerEmailTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currManagerEmailTwo}
                            disabled={disabled === true}
                          />
                          {touched.currManagerEmailTwo && errors.currManagerEmailTwo && (
                            <small className="text-danger form-text">{errors.currManagerEmailTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>HR Name</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currHrNameTwo && errors.currHrNameTwo}
                            name="currHrNameTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currHrNameTwo}
                            disabled={disabled === true}
                          />
                          {touched.currHrNameTwo && errors.currHrNameTwo && (
                            <small className="text-danger form-text">{errors.currHrNameTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>HR Email</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currHrEmailTwo && errors.currHrEmailTwo}
                            name="currHrEmailTwo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currHrEmailTwo}
                            disabled={disabled === true}
                          />
                          {touched.currHrEmailTwo && errors.currHrEmailTwo && (
                            <small className="text-danger form-text">{errors.currHrEmailTwo}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Offer letter</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpOfferLetter2 && errors.currEmpOfferLetter2}
                            name="currEmpOfferLetter2"
                            id="currEmpOfferLetter2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.currEmpOfferLetter2}
                            disabled={disabled === true}
                          />
                          {employmentData !== 'N.A.' &&
                          employmentData.employmentDetailTwo.currEmpOfferLetter !== '' &&
                          employmentData.employmentDetailTwo.currEmpOfferLetterURL ? (
                            <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                              <a href={employmentData.employmentDetailTwo.currEmpOfferLetterURL} target="_blank" rel="noopener noreferrer">
                                {Constants.Common.ViewExistingFile}
                              </a>
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.currEmpOfferLetter2 && errors.currEmpOfferLetter2 && (
                            <small className="text-danger form-text">{errors.currEmpOfferLetter2}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Current salary slip</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpSalarySlip2 && errors.currEmpSalarySlip2}
                            name="currEmpSalarySlip2"
                            id="currEmpSalarySlip2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.currEmpSalarySlip2}
                            disabled={disabled === true}
                          />
                          {employmentData !== 'N.A.' &&
                          employmentData.employmentDetailTwo.currEmpSalarySlip !== '' &&
                          employmentData.employmentDetailTwo.currEmpSalarySlipURL ? (
                            <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                              <a href={employmentData.employmentDetailTwo.currEmpSalarySlipURL} target="_blank" rel="noopener noreferrer">
                                {Constants.Common.ViewExistingFile}
                              </a>
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.currEmpSalarySlip2 && errors.currEmpSalarySlip2 && (
                            <small className="text-danger form-text">{errors.currEmpSalarySlip2}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Releiving letter</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpReleivingLetter2 && errors.currEmpReleivingLetter2}
                            name="currEmpReleivingLetter2"
                            id="currEmpReleivingLetter2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.currEmpReleivingLetter2}
                            disabled={disabled === true}
                          />
                          {employmentData !== 'N.A.' &&
                          employmentData.employmentDetailTwo.currEmpReleivingLetter !== '' &&
                          employmentData.employmentDetailTwo.currEmpReleivingLetterURL ? (
                            <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                              <a
                                href={employmentData.employmentDetailTwo.currEmpReleivingLetterURL}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {Constants.Common.ViewExistingFile}
                              </a>
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.currEmpReleivingLetter2 && errors.currEmpReleivingLetter2 && (
                            <small className="text-danger form-text">{errors.currEmpReleivingLetter2}</small>
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
                      <h5>Employment 3</h5>
                      <hr />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Name of the employer</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpNameThree && errors.currEmpNameThree}
                            name="currEmpNameThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currEmpNameThree}
                            disabled={disabled === true}
                          />
                          {touched.currEmpNameThree && errors.currEmpNameThree && (
                            <small className="text-danger form-text">{errors.currEmpNameThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Location</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currLocationThree && errors.currLocationThree}
                            name="currLocationThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currLocationThree}
                            disabled={disabled === true}
                          />
                          {touched.currLocationThree && errors.currLocationThree && (
                            <small className="text-danger form-text">{errors.currLocationThree}</small>
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
                            error={touched.currCityThree && errors.currCityThree}
                            name="currCityThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currCityThree}
                            disabled={disabled === true}
                          />
                          {touched.currCityThree && errors.currCityThree && (
                            <small className="text-danger form-text">{errors.currCityThree}</small>
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
                            error={touched.currTelNoThree && errors.currTelNoThree}
                            name="currTelNoThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.currTelNoThree}
                            disabled={disabled === true}
                          />
                          {touched.currTelNoThree && errors.currTelNoThree && (
                            <small className="text-danger form-text">{errors.currTelNoThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Job Title</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currJobtitleThree && errors.currJobtitleThree}
                            name="currJobtitleThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currJobtitleThree}
                            disabled={disabled === true}
                          />
                          {touched.currJobtitleThree && errors.currJobtitleThree && (
                            <small className="text-danger form-text">{errors.currJobtitleThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Employee Code</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpCodeThree && errors.currEmpCodeThree}
                            name="currEmpCodeThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currEmpCodeThree}
                            disabled={disabled === true}
                          />
                          {touched.currEmpCodeThree && errors.currEmpCodeThree && (
                            <small className="text-danger form-text">{errors.currEmpCodeThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Last Drawn Salary</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpCtcThree && errors.currEmpCtcThree}
                            name="currEmpCtcThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.currEmpCtcThree}
                            disabled={disabled === true}
                          />
                          {touched.currEmpCtcThree && errors.currEmpCtcThree && (
                            <small className="text-danger form-text">{errors.currEmpCtcThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Joining Date</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currJoinDateThree && errors.currJoinDateThree}
                            name="currJoinDateThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="date"
                            value={values.currJoinDateThree}
                            disabled={disabled === true}
                          />
                          {touched.currJoinDateThree && errors.currJoinDateThree && (
                            <small className="text-danger form-text">{errors.currJoinDateThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Releiving Date</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currRelievingThree && errors.currRelievingThree}
                            name="currRelievingThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="date"
                            value={values.currRelievingThree}
                            disabled={disabled === true}
                          />
                          {touched.currRelievingThree && errors.currRelievingThree && (
                            <small className="text-danger form-text">{errors.currRelievingThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Period of employment</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpPeriodThree && errors.currEmpPeriodThree}
                            name="currEmpPeriodThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currEmpPeriodThree}
                            disabled={disabled === true}
                          />
                          {touched.currEmpPeriodThree && errors.currEmpPeriodThree && (
                            <small className="text-danger form-text">{errors.currEmpPeriodThree}</small>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={6}>
                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Reason for leaving</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpLeavingReasonThree && errors.currEmpLeavingReasonThree}
                            name="currEmpLeavingReasonThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currEmpLeavingReasonThree}
                            disabled={disabled === true}
                          />
                          {touched.currEmpLeavingReasonThree && errors.currEmpLeavingReasonThree && (
                            <small className="text-danger form-text">{errors.currEmpLeavingReasonThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Manager name and designation</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currManagerDetailsThree && errors.currManagerDetailsThree}
                            name="currManagerDetailsThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currManagerDetailsThree}
                            disabled={disabled === true}
                          />
                          {touched.currManagerDetailsThree && errors.currManagerDetailsThree && (
                            <small className="text-danger form-text">{errors.currManagerDetailsThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Manager phone</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currManagerPhoneThree && errors.currManagerPhoneThree}
                            name="currManagerPhoneThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            type="number"
                            value={values.currManagerPhoneThree}
                            disabled={disabled === true}
                          />
                          {touched.currManagerPhoneThree && errors.currManagerPhoneThree && (
                            <small className="text-danger form-text">{errors.currManagerPhoneThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Manager email</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currManagerEmailThree && errors.currManagerEmailThree}
                            name="currManagerEmailThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currManagerEmailThree}
                            disabled={disabled === true}
                          />
                          {touched.currManagerEmailThree && errors.currManagerEmailThree && (
                            <small className="text-danger form-text">{errors.currManagerEmailThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>HR Name</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currHrNameThree && errors.currHrNameThree}
                            name="currHrNameThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currHrNameThree}
                            disabled={disabled === true}
                          />
                          {touched.currHrNameThree && errors.currHrNameThree && (
                            <small className="text-danger form-text">{errors.currHrNameThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>HR Email</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currHrEmailThree && errors.currHrEmailThree}
                            name="currHrEmailThree"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.currHrEmailThree}
                            disabled={disabled === true}
                          />
                          {touched.currHrEmailThree && errors.currHrEmailThree && (
                            <small className="text-danger form-text">{errors.currHrEmailThree}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Offer letter</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpOfferLetter3 && errors.currEmpOfferLetter3}
                            name="currEmpOfferLetter3"
                            id="currEmpOfferLetter3"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.currEmpOfferLetter3}
                            disabled={disabled === true}
                          />
                          {employmentData !== 'N.A.' &&
                          employmentData.employmentDetailThree.currEmpOfferLetter !== '' &&
                          employmentData.employmentDetailThree.currEmpOfferLetterURL ? (
                            <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                              <a
                                href={employmentData.employmentDetailThree.currEmpOfferLetterURL}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {Constants.Common.ViewExistingFile}
                              </a>
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.currEmpOfferLetter3 && errors.currEmpOfferLetter3 && (
                            <small className="text-danger form-text">{errors.currEmpOfferLetter3}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Current salary slip</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpSalarySlip3 && errors.currEmpSalarySlip3}
                            name="currEmpSalarySlip3"
                            id="currEmpSalarySlip3"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.currEmpSalarySlip3}
                            disabled={disabled === true}
                          />
                          {employmentData !== 'N.A.' &&
                          employmentData.employmentDetailThree.currEmpSalarySlip !== '' &&
                          employmentData.employmentDetailThree.currEmpSalarySlipURL ? (
                            <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                              <a href={employmentData.employmentDetailThree.currEmpSalarySlipURL} target="_blank" rel="noopener noreferrer">
                                {Constants.Common.ViewExistingFile}
                              </a>
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.currEmpSalarySlip3 && errors.currEmpSalarySlip3 && (
                            <small className="text-danger form-text">{errors.currEmpSalarySlip3}</small>
                          )}
                        </Col>
                      </Row>

                      <Row className="my-3">
                        <Col sm={3}>
                          <label>Releiving letter</label>
                        </Col>
                        <Col sm={9}>
                          <input
                            className="form-control"
                            error={touched.currEmpReleivingLetter3 && errors.currEmpReleivingLetter3}
                            name="currEmpReleivingLetter3"
                            id="currEmpReleivingLetter3"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="file"
                            value={values.currEmpReleivingLetter3}
                            disabled={disabled === true}
                          />
                          {employmentData !== 'N.A.' &&
                          employmentData.employmentDetailThree.currEmpReleivingLetter !== '' &&
                          employmentData.employmentDetailThree.currEmpReleivingLetterURL ? (
                            <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                              <a
                                href={employmentData.employmentDetailThree.currEmpReleivingLetterURL}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {Constants.Common.ViewExistingFile}
                              </a>
                            </small>
                          ) : (
                            newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                          )}
                          {touched.currEmpReleivingLetter3 && errors.currEmpReleivingLetter3 && (
                            <small className="text-danger form-text">{errors.currEmpReleivingLetter3}</small>
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
        <EmploymentBgv employmentData={employmentData} reloadData={handleDataChange} />
      ) : null}
    </React.Fragment>
  );
};

export default Employment;
