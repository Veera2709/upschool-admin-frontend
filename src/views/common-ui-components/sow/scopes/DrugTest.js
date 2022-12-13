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
import DrugTestBgv from './verifications/DrugTestBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import * as Constants from '../../../../helper/constants';
import { panelArray } from '../../../../util/names';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const DrugTest = ({ className, rest, newUpload }) => {
  const [drugCheckData, setDrugCheckData] = useState({});
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

  const _sendDrugTestInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(drugCheckData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'DrugTest', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'DrugTest', case_id);
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

  const _fetchCaseDrugTest = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'DrugTest');
    console.log('drug test caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setDrugCheckData("N.A.") : setDrugCheckData(caseData);
      if (isEmptyObject(caseData)) {
        setDrugCheckData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setDrugCheckData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseDrugTest();
    } else {
      setDrugCheckData('N.A.');
    }
  }, [loadAgain]);

  return isEmptyObject(drugCheckData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          panelSelect: drugCheckData === 'N.A.' ? '' : drugCheckData.panelSelect,
          lipidProfileFile: ''
        }}
        validationSchema={Yup.object().shape({
          panelSelect: Yup.string()
            .min(0, Constants.Common.InvalidPanel)
            .oneOf(panelArray, Constants.Common.InvalidPanel)
            .required(Constants.Common.InvalidPanel)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          console.log('Submitting');

          let allFilesData = [];
          const fileNameArray = ['lipidProfileFile'];

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
            _sendDrugTestInfo(values);
          } else {
            if (areFilesInvalid(allFilesData) !== 0) {
              sweetAlertHandler(bgvAlerts.invalidFilesPresent);
            } else {
              showLoader();
              _sendDrugTestInfo(values);
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
                  <h5>Drug Test</h5>
                  <hr />
                </Col>
              </Row>

              <Row>
                <Col sm={3}></Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Panel</label>
                    </Col>
                    <Col sm={9}>
                      <select
                        className="form-control"
                        error={touched.panelSelect && errors.panelSelect}
                        name="panelSelect"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.panelSelect}
                      >
                        <option value="">Select a panel</option>
                        <option value="3 panel">3 panel</option>
                        <option value="6 panel">6 panel</option>
                        <option value="9 panel">9 panel</option>
                      </select>
                      {touched.panelSelect && errors.panelSelect ? (
                        <small className="text-danger form-text">{errors.panelSelect}</small>
                      ) : null}
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Lipid Profile</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.lipidProfileFile && errors.lipidProfileFile}
                        name="lipidProfileFile"
                        id="lipidProfileFile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="file"
                        value={values.lipidProfileFile}
                      />
                      {drugCheckData !== 'N.A.' && drugCheckData.lipidProfileFile !== '' && drugCheckData.lipidProfileFileURL ? (
                        <small style={{ cursor: 'pointer' }} className="text-primary form-text">
                          <a href={drugCheckData.lipidProfileFileURL} target="_blank" rel="noopener noreferrer">
                            {Constants.Common.ViewExistingFile}
                          </a>
                        </small>
                      ) : (
                        newUpload && editClientButInsert && <small className="text-warning form-text">No file uploaded yet</small>
                      )}
                      {touched.lipidProfileFile && errors.lipidProfileFile && (
                        <small className="text-danger form-text">{errors.lipidProfileFile}</small>
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
        <DrugTestBgv drugCheckData={drugCheckData} reloadData={handleDataChange} />
      ) : null}
    </React.Fragment>
  );
};

export default DrugTest;
