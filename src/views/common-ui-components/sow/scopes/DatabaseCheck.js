import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import DatabaseCheckBgv from './verifications/DatabaseCheckBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import * as Constants from '../../../../helper/constants';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const DatabaseCheck = ({ className, rest, newUpload }) => {
  const [databaseCheckData, setDatabaseCheckData] = useState({});
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

  const _sendDBCheckInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(databaseCheckData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'DatabaseCheck', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'DatabaseCheck', case_id);
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

  const _fetchCaseDBCheck = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'DatabaseCheck');
    console.log('db check caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setDatabaseCheckData("N.A.") : setDatabaseCheckData(caseData);
      if (isEmptyObject(caseData)) {
        setDatabaseCheckData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setDatabaseCheckData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseDBCheck();
    } else {
      setDatabaseCheckData('N.A.');
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
      .required(Constants.DirectorShipCheckForm.nameRequired)
  });

  useEffect(() => {}, [basicDetails.Id]);

  return isEmptyObject(databaseCheckData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          empName: databaseCheckData === 'N.A.' ? '' : databaseCheckData.empName,
          empDob: databaseCheckData === 'N.A.' ? '' : databaseCheckData.empDob,
          empFatherName: databaseCheckData === 'N.A.' ? '' : databaseCheckData.empFatherName,
          dbVerificationFile: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          showLoader();
          console.log(values);
          console.log('Submitting');

          let allFilesData = [];
          const fileNameArray = ['dbVerificationFile'];

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
            _sendDBCheckInfo(values);
          } else {
            if (areFilesInvalid(allFilesData) !== 0) {
              sweetAlertHandler(bgvAlerts.invalidFilesPresent);
            } else {
              showLoader();
              _sendDBCheckInfo(values);
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
                  <h5>Database Check</h5>
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
                </Col>

                <Col sm={6}>
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
                </Col>

                <Col sm={6}>
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
                      <label>Upload Aadhar / Pan</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.dbVerificationFile && errors.dbVerificationFile}
                        name="dbVerificationFile"
                        id="dbVerificationFile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.dbVerificationFile}
                      />
                      {databaseCheckData !== 'N.A.' &&
                      databaseCheckData.dbVerificationFile !== '' &&
                      databaseCheckData.dbVerificationFileURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={databaseCheckData.dbVerificationFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.dbVerificationFile && errors.dbVerificationFile && (
                        <small className="text-danger form-text">{errors.dbVerificationFile}</small>
                      )}
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
        <DatabaseCheckBgv databaseCheckData={databaseCheckData} reloadData={handleDataChange} />
      ) : null}
    </React.Fragment>
  );
};

export default DatabaseCheck;
