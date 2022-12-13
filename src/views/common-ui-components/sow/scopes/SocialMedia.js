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
import SocialMediaBgv from './verifications/SocialMediaBgv';
import { handleDisabling } from '../bgv-api/bgvHelpers';
import { areFilesInvalid } from '../../../../util/utils';
import * as Constants from '../../../../helper/constants';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const SocialMedia = ({ className, rest, newUpload }) => {
  const [socialMediaCheckData, setSocialMediaCheckData] = useState({});
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

  const _sendSocialMediaInfo = async (data) => {
    let { apiUrl, payloadData } = await getUrl(socialMediaCheckData, data, newUpload, editClientButInsert);
    console.log(data);

    if (newUpload) {
      case_id = sessionStorage.getItem('case_id');
      if (case_id === null) {
        case_id = '';
      }
    }

    console.log(apiUrl, payloadData, 'SocialMedia', case_id);

    const bgvResponse = await bgvApi(apiUrl, payloadData, 'SocialMedia', case_id);
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

  const _fetchCaseSocialMediaCheck = async () => {
    const caseData = await fetchCaseCompDetails(dynamicUrl.fetchIndivCaseUrl, case_id, 'SocialMedia');
    console.log('social media caseData', caseData);
    if (caseData === 'Error') {
      alert('Error while fetching components');
    } else {
      // isEmptyObject(caseData) ? setSocialMediaCheckData("N.A.") : setSocialMediaCheckData(caseData);
      if (isEmptyObject(caseData)) {
        setSocialMediaCheckData('N.A.');
        if (sessionStorage.getItem('user_category') === 'Client') {
          setIsDisabled(false);
          setSubmitButtonActive(true);
          setEditClientButInsert(true);
        }
      } else {
        setSocialMediaCheckData(caseData);
      }
    }
  };

  const handleDataChange = () => setLoadAgain(!loadAgain);

  useEffect(() => {
    setIsDisabled(handleDisabling(newUpload));
    setSubmitButtonActive(!handleDisabling(newUpload));
    if (!newUpload) {
      _fetchCaseSocialMediaCheck();
    } else {
      setSocialMediaCheckData('N.A.');
    }
  }, [loadAgain]);

  return isEmptyObject(socialMediaCheckData) ? null : (
    <React.Fragment>
      <Formik
        initialValues={{
          faceBook: socialMediaCheckData === 'N.A.' ? '' : socialMediaCheckData.faceBook,
          twitter: socialMediaCheckData === 'N.A.' ? '' : socialMediaCheckData.twitter,
          instagram: socialMediaCheckData === 'N.A.' ? '' : socialMediaCheckData.instagram,
          linkedIn: socialMediaCheckData === 'N.A.' ? '' : socialMediaCheckData.linkedIn
        }}
        validationSchema={Yup.object().shape({
          faceBook: Yup.string().required(Constants.SocialMedia.faceBookRequired),
          twitter: Yup.string().required(Constants.SocialMedia.twitterRequired),
          instagram: Yup.string().required(Constants.SocialMedia.instagramRequired),
          linkedIn: Yup.string().required(Constants.SocialMedia.linkedInRequired)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          console.log('Submitting');
          showLoader();
          _sendSocialMediaInfo(values);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <fieldset disabled={isDisabled}>
              <Row>
                <Col sm={12}>
                  <br />
                  <h5>Social Media</h5>
                  <hr />
                </Col>
              </Row>

              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Facebook</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.faceBook && errors.faceBook}
                        name="faceBook"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.faceBook}
                      />
                      {touched.faceBook && errors.faceBook && <small className="text-danger form-text">{errors.faceBook}</small>}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Twitter</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.twitter && errors.twitter}
                        name="twitter"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.twitter}
                      />
                      {touched.twitter && errors.twitter && <small className="text-danger form-text">{errors.twitter}</small>}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>Instagram</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.instagram && errors.instagram}
                        name="instagram"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.instagram}
                      />
                      {touched.instagram && errors.instagram && <small className="text-danger form-text">{errors.instagram}</small>}
                    </Col>
                  </Row>
                </Col>
                <Col sm={6}>
                  <Row className="my-3">
                    <Col sm={3}>
                      <label>LinkedIn</label>
                    </Col>
                    <Col sm={9}>
                      <input
                        className="form-control"
                        error={touched.linkedIn && errors.linkedIn}
                        name="linkedIn"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.linkedIn}
                      />
                      {touched.linkedIn && errors.linkedIn && <small className="text-danger form-text">{errors.linkedIn}</small>}
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
        <SocialMediaBgv socialMediaCheckData={socialMediaCheckData} reloadData={handleDataChange} />
      ) : null}
    </React.Fragment>
  );
};

export default SocialMedia;
