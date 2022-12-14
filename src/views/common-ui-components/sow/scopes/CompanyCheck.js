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
import CompanyCheckBgv from './verifications/CompanyCheckBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import * as Constants from '../../../../helper/constants';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const CompanyCheck = ({ className, rest, newUpload }) => {
  const [companyCheckData, setCompanyCheckData] = useState({});
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

  const _sendCompanyCheckInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(companyCheckData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'CompanyCheck', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'CompanyCheck', case_id);
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

  const _fetchCaseCompanyCheck = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'CompanyCheck');
    console.log('company caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setCompanyCheckData("N.A.") : setCompanyCheckData(caseData);
      if (isEmptyObject(caseData)) {
        setCompanyCheckData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setCompanyCheckData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseCompanyCheck();
    } else {
      setCompanyCheckData('N.A.');
    }
  }, [loadAgain]);

  return isEmptyObject(companyCheckData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          companyName: companyCheckData === 'N.A.' ? '' : companyCheckData.companyName,
          companyWebsite: companyCheckData === 'N.A.' ? '' : companyCheckData.companyWebsite,
          companyCheckFile: ''
        }}
        validationSchema={Yup.object().shape({
          companyName: Yup.string()
            .matches(Constants.Common.UserNameRegex, Constants.CompanyCheckForm.validCompanyName)
            .min(2, Constants.CompanyCheckForm.companyNameTooShort)
            .max(50, Constants.CompanyCheckForm.companyNameTooLong)
            .required(Constants.CompanyCheckForm.companyNameRequired),
          companyWebsite: Yup.string()
            .matches(Constants.Common.WebsiteRegex, Constants.CompanyCheckForm.validCompanyWebsite)
            .min(2, Constants.CompanyCheckForm.companyWebsiteTooShort)
            .max(50, Constants.CompanyCheckForm.companyWebsiteTooLong)
            .required(Constants.CompanyCheckForm.companyWebsiteRequired)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          console.log('Submitting');

          let allFilesData = [];
          const fileNameArray = ['companyCheckFile'];

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
            _sendCompanyCheckInfo(values);
            showLoader();
          } else {
            if (areFilesInvalid(allFilesData) !== 0) {
              sweetAlertHandler(bgvAlerts.invalidFilesPresent);
            } else {
              _sendCompanyCheckInfo(values);
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
                  <h5>Company Check</h5>
                  <hr />
                </Col>
              </Row>

              <Row>
                <Col sm={3}></Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Company Name</label>
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
                      <label>Company Website</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.companyWebsite && errors.companyWebsite}
                        name="companyWebsite"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.companyWebsite}
                      />
                      {touched.companyWebsite && errors.companyWebsite && (
                        <small className="text-danger form-text">{errors.companyWebsite}</small>
                      )}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Incorporation certificate</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.companyCheckFile && errors.companyCheckFile}
                        name="companyCheckFile"
                        id="companyCheckFile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.companyCheckFile}
                      />
                      {companyCheckData !== 'N.A.' && companyCheckData.companyCheckFile !== '' && companyCheckData.companyCheckFileURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={companyCheckData.companyCheckFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.companyCheckFile && errors.companyCheckFile && (
                        <small className="text-danger form-text">{errors.companyCheckFile}</small>
                      )}
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
        <CompanyCheckBgv companyCheckData={companyCheckData} reloadData={handleDataChange} />
      ) : null}
    </React.Fragment>
  );
};

export default CompanyCheck;
