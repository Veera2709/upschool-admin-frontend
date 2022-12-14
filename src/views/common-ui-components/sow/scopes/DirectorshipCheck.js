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
import DirectorshipCheckBgv from './verifications/DirectorshipCheckBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import * as Constants from '../../../../helper/constants';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { useSelector } from 'react-redux';

const DirectorshipCheck = ({ className, rest, newUpload }) => {
  const [directorshipCheckData, setDirectorshipCheckData] = useState({});
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

  const _sendDirectorshipCheckInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(directorshipCheckData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'DirectorshipCheck', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'DirectorshipCheck', case_id);
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

  const _fetchCaseDirectorship = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'DirectorshipCheck');
    console.log('directorship caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setDirectorshipCheckData("N.A.") : setDirectorshipCheckData(caseData);
      if (isEmptyObject(caseData)) {
        setDirectorshipCheckData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setDirectorshipCheckData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseDirectorship();
    } else {
      setDirectorshipCheckData('N.A.');
    }
  }, [loadAgain]);

  const validationSchema = Yup.object().shape({
    empName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.DirectorShipCheckForm.validName)
      .min(2, Constants.DirectorShipCheckForm.nameTooShort)
      .max(50, Constants.DirectorShipCheckForm.nameTooLong)
      .required(Constants.DirectorShipCheckForm.nameRequired),
    empDob: Yup.string().required(Constants.DirectorShipCheckForm.dateRequired),
    empFatherName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.DirectorShipCheckForm.validName)
      .min(2, Constants.DirectorShipCheckForm.nameTooShort)
      .max(50, Constants.DirectorShipCheckForm.nameTooLong)
      .required(Constants.DirectorShipCheckForm.nameRequired),
    designation: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.DirectorShipCheckForm.validDesignation)
      .min(2, Constants.DirectorShipCheckForm.designationTooShort)
      .max(50, Constants.DirectorShipCheckForm.designationTooLong)
      .required(Constants.DirectorShipCheckForm.designationRequired),
    companyName: Yup.string()
      .matches(Constants.Common.UserNameRegex, Constants.DirectorShipCheckForm.validCompanyName)
      .min(2, Constants.DirectorShipCheckForm.companyNameTooShort)
      .max(50, Constants.DirectorShipCheckForm.companyNameTooLong)
      .required(Constants.DirectorShipCheckForm.companyNameRequired),
    address: Yup.string()
      .min(10, Constants.DirectorShipCheckForm.addressTooShort)
      .max(100, Constants.DirectorShipCheckForm.addressTooLong)
      .required(Constants.DirectorShipCheckForm.addressRequired)
  });

  useEffect(() => {}, [basicDetails.Id]);

  return isEmptyObject(directorshipCheckData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          empName: directorshipCheckData === 'N.A.' ? '' : directorshipCheckData.empName,
          empDob: directorshipCheckData === 'N.A.' ? '' : directorshipCheckData.empDob,
          empFatherName: directorshipCheckData === 'N.A.' ? '' : directorshipCheckData.empFatherName,
          designation: directorshipCheckData === 'N.A.' ? '' : directorshipCheckData.designation,
          companyName: directorshipCheckData === 'N.A.' ? '' : directorshipCheckData.companyName,
          address: directorshipCheckData === 'N.A.' ? '' : directorshipCheckData.address
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          showLoader();
          console.log(values);
          console.log('Submitting');
          _sendDirectorshipCheckInfo(values);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <fieldset disabled={isDisabled}>
              <Row>
                <Col sm={12}>
                  <br />
                  <h5>Directorship</h5>
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
                        error={touched.empName && errors.empName}
                        name="empName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.empName}
                      />
                      {touched.empName && errors.empName && <small className="text-danger form-text">{errors.empName}</small>}
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
                      <label>Employee DOB</label>
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
                </Col>
                <Col sm={6}>
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

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Company name</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.companyName && errors.companyName}
                        name="companyName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.companyName}
                      />
                      {touched.companyName && errors.companyName && <small className="text-danger form-text">{errors.companyName}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Address</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.address && errors.address}
                        name="address"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.address}
                      />
                      {touched.address && errors.address && <small className="text-danger form-text">{errors.address}</small>}
                    </Col>
                  </Row>
                </Col>
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
      {loader}
      {sessionStorage.getItem('user_category') === 'Operation Supervisor' ||
      sessionStorage.getItem('user_category') === 'Operation Team' ? (
        <DirectorshipCheckBgv directorshipCheckData={directorshipCheckData} reloadData={handleDataChange} />
      ) : null}
    </React.Fragment>
  );
};

export default DirectorshipCheck;
