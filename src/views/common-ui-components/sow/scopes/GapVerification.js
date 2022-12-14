import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
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
import GapVerificationBgv from './verifications/GapVerificationBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const GapVerification = ({ className, rest, newUpload }) => {
  const [gapCheckData, setGapCheckData] = useState({});
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

  const _sendGapVerificationInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(gapCheckData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'GapVerification', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'GapVerification', case_id);
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

  const _fetchCaseGapCheck = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'GapVerification');
    console.log('gap caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setGapCheckData("N.A.") : setGapCheckData(caseData);
      if (!isEmptyObject(caseData)) {
        console.log('CASE DATA', caseData);
        console.log('gapType', caseData.gapType);
        setGapCheckData({ ...caseData });
      } else {
        setGapCheckData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseGapCheck();
    } else {
      setGapCheckData('N.A.');
    }
  }, [loadAgain]);

  return !isEmptyObject(gapCheckData) ? (
    <React.Fragment>
      <Formik
        initialValues={{
          gapType: gapCheckData === 'N.A.' || isEmptyObject(gapCheckData) ? '' : gapCheckData.gapType,
          gapPeriod: gapCheckData === 'N.A.' || isEmptyObject(gapCheckData) ? '' : gapCheckData.gapPeriod,
          gapReason: gapCheckData === 'N.A.' || isEmptyObject(gapCheckData) ? '' : gapCheckData.gapReason
        }}
        validationSchema={Yup.object().shape({
          gapType: Yup.string().required(Constants.GapVerificationForm.GapTypeRequired),
          gapPeriod: Yup.string()
            .min(2, Constants.GapVerificationForm.GapPeriodTooShort)
            .max(20, Constants.GapVerificationForm.GapPeriodTooLong)
            .required(Constants.GapVerificationForm.GapPeriodRequired),
          gapReason: Yup.string()
            .min(2, Constants.GapVerificationForm.GapReasonTooShort)
            .max(50, Constants.GapVerificationForm.GapReasonTooLong)
            .required(Constants.GapVerificationForm.GapReasonRequired)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          console.log('Submitting');

          showLoader();
          _sendGapVerificationInfo(values);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <fieldset disabled={isDisabled}>
              <Row>
                <Col sm={12}>
                  <br />
                  <h5>Gap Verification</h5>
                  <hr />
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Type</label>
                    </Col>
                    <Col sm={9}>
                      <select
                        className="form-control"
                        error={touched.gapType && errors.gapType}
                        name="gapType"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.gapType}
                      >
                        {Constants.GapVerificationForm.GapType.map((type, i) => (
                          <option keys={i} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {touched.gapType && errors.gapType && <small className="text-danger form-text">{errors.gapType}</small>}
                    </Col>
                  </Row>

                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Period of gap</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.gapPeriod && errors.gapPeriod}
                        name="gapPeriod"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.gapPeriod}
                      />
                      {touched.gapPeriod && errors.gapPeriod && <small className="text-danger form-text">{errors.gapPeriod}</small>}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Reason for gap</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.gapReason && errors.gapReason}
                        name="gapReason"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.gapReason}
                      />
                      {touched.gapReason && errors.gapReason && <small className="text-danger form-text">{errors.gapReason}</small>}
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
        <GapVerificationBgv gapCheckData={gapCheckData} reloadData={handleDataChange} />
      ) : null}
    </React.Fragment>
  ) : null;
};

export default GapVerification;
