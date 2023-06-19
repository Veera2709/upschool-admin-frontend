import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-select';

import MESSAGES from '../../../../helper/messages';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { defaultPostApi } from '../../../common-ui-components/sow/bgv-api/BgvApi';
import { bgvAlerts } from '../../../common-ui-components/sow/bgv-api/bgvAlerts';
import { areFilesInvalidBulkUpload, isEmptyObject } from '../../../../util/utils';
import { bulkUpload } from './user-bulk-upload-api/bulkUpload';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { isEmptyArray } from '../../../../util/utils';


const UsersBulkUpload = ({ className, ...rest }) => {

  const history = useHistory();
  const schoolNameRef = useRef('');
  const [schoolName_ID, setSchoolName_ID] = useState({});
  const [disableButton, setDisableButton] = useState(false);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [displayHeader, setDisplayHeader] = useState(true);
  const displayHeading = sessionStorage.getItem('user_type');
  const threadLinks = document.getElementsByClassName('page-header');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [schoolMandatoryErr, setSchoolMandatoryErr] = useState(false);

  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  useEffect(() => {

    const validateJWT = sessionStorage.getItem('user_jwt');

    if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

      sessionStorage.clear();
      localStorage.clear();

      history.push('/auth/signin-1');
      window.location.reload();

    } else {

      axios
        .post(
          dynamicUrl.fetchSchoolIdNames,
          {
            data: {}
          },
          {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
          }
        )
        .then((response) => {

          console.log({ response });
          console.log(response.status);
          console.log(response.data);

          console.log(response.status === 200);
          let result = response.status === 200;

          if (result) {
            console.log('inside res');

            if (response.length === 0) {
              Swal.fire({
                title: 'No Users Available',
                text: 'There is no data to display.',
                icon: 'warning',
                confirmButtonText: 'OK'
              }).then(() => {
                window.history.back();
              });
            }

            let tempCategoryArr = [];
            (response.data.Items.map(e => { tempCategoryArr.push({ value: e.school_id, label: e.school_name }) }));
            isEmptyArray(tempCategoryArr) ? setSchoolName_ID([]) : setSchoolName_ID(tempCategoryArr);

            hideLoader();

            console.log(threadLinks);
            console.log(threadLinks.length);

            if (threadLinks.length === 2) {

              setDisplayHeader(false);

            } else {

              setDisplayHeader(true);
            }

          } else {

            console.log('else res');
            hideLoader();
            // Request made and server responded
            // setStatus({ success: false });
            // setErrors({ submit: 'Error in generating OTP' });
          }
        })
        .catch((error) => {
          if (error.response) {
            hideLoader();
            // Request made and server responded
            console.log(error.response.data);

            if (error.response.data === 'Invalid Token') {

              sessionStorage.clear();
              localStorage.clear();

              history.push('/auth/signin-1');
              window.location.reload();

            } else {
              console.log(error.response.data);
            }

          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
            hideLoader();
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            hideLoader();
          }
        });

    }

  }, []);

  const _uploadBulk = async (data) => {
    console.log('Values', data);
    const uploadResponse = await bulkUpload(dynamicUrl.getUserBulkuploadUrl, data);
    console.log('Upload Response: ', uploadResponse);

    if (uploadResponse.Error) {
      sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.FilesUploading });
    } else {
      let uploadParams = uploadResponse.data.fileUploadUrl;

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

        // API calling here
        let filePaths = uploadResponse.data.filePath;

        console.log('filePaths', filePaths);

        if (Array.isArray(filePaths)) {
          let bulkUploadPayload = {
            data: {
              excelFileName: filePaths[0].excelFilePath
            }
          };

          console.log('bulkUploadPayload', bulkUploadPayload);

          const uploadResponse2 = await defaultPostApi(dynamicUrl.bulkUsersUpload, bulkUploadPayload);

          console.log(uploadResponse2.status);
          console.log(uploadResponse2.data);

          if (uploadResponse2.status === 200) {

            if (uploadResponse2.data.length === 0) {

              sweetAlertHandler({
                // title: MESSAGES.TTTLES.Goodjob,
                type: 'success',
                text: MESSAGES.SUCCESS.FilesUploaded
              });
              hideLoader();
              setDisableButton(false);

            } else {

              sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.WARNINGS.PleaseCheckYourEmailForErrorRecords });
              hideLoader();
              setDisableButton(false);
            }

          } else {
            hideLoader();
            setDisableButton(false);
          }
        }
      } else {
        console.log('No files uploaded');
        sweetAlertHandler({
          // title: MESSAGES.TTTLES.Goodjob, 
          type: 'success',
          text: MESSAGES.SUCCESS.FilesUploaded
        });
        hideLoader();
        setDisableButton(false);
      }
    }
  };

  const getSelectedSchoolDetails = (e) => {
    console.log('School ID', e.value);
    setSelectedSchoolId(e.value);
  }

  return (

    <>
      {isEmptyObject(schoolName_ID) ? <></> : (
        <>

          <React.Fragment>

            {
              displayHeader && (
                <div className="page-header">
                  <div className="page-block">
                    <div className="row align-items-center">
                      <div className="col-md-12">
                        <div className="page-header-title">
                          <h5 className="m-b-10">{displayHeading}</h5>
                        </div><ul className="breadcrumb  ">
                          <li className="breadcrumb-item  ">
                            <a href="/upschool/admin-portal/admin-dashboard">
                              <i className="feather icon-home">
                              </i>
                            </a>
                          </li>
                          <li className="breadcrumb-item  ">Users</li>
                          <li className="breadcrumb-item  ">{displayHeading}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            <Card>

              <Card.Body>
                <Formik

                  initialValues={{
                    schoolName: '',
                    excelFileUploadUrl: '',
                    submit: null
                  }}

                  validationSchema={Yup.object().shape({})}

                  onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                    setSubmitting(true);

                    let excelFile = document.getElementById('excelFileUploadUrl').files[0];

                    console.log(selectedSchoolId);

                    if (selectedSchoolId === "" || selectedSchoolId === 'undefined' || selectedSchoolId === undefined) {
                      setSchoolMandatoryErr(true);
                    } else {

                      showLoader();
                      const filteredResult = schoolName_ID.find((e) => e.value === selectedSchoolId);

                      console.log(filteredResult);
                      console.log(schoolName_ID);

                      let sendData = {
                        school_id: '',
                        ExcelFile: ''
                      }

                      if (excelFile) {

                        sendData.school_id = filteredResult.value;
                        sendData.ExcelFile = excelFile.name;

                        console.log('Submitting', sendData);

                        if (areFilesInvalidBulkUpload([excelFile]) !== 0) {
                          sweetAlertHandler(bgvAlerts.invalidFilesPresentBulkUpload);
                          hideLoader();
                        } else {
                          showLoader();
                          setDisableButton(true);
                          _uploadBulk(sendData);
                        }
                      } else {
                        sweetAlertHandler(bgvAlerts.noFilesPresentBulkUpload);
                        hideLoader();
                      }
                    }


                  }}
                >
                  {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
                      <Row>
                        <Col sm={4}></Col>
                        <Col sm={4}>

                          <Row className="my-3">
                            <Col sm={12}>
                              <label>School</label>
                            </Col>
                            <Col sm={12}>

                              <Select
                                name="schoolName"
                                options={schoolName_ID}
                                className="basic-multi-select"
                                classNamePrefix="Select"
                                onChange={(event) => {
                                  setSchoolMandatoryErr(false)
                                  getSelectedSchoolDetails(event)
                                }}
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                              />

                              {touched.schoolName && errors.schoolName && (
                                <small className="text-danger form-text">{errors.schoolName}</small>
                              )}

                              {
                                schoolMandatoryErr === true && (
                                  <small className="text-danger form-text">{'School is required'}</small>
                                )
                              }
                            </Col>
                          </Row>

                          <Row className="my-3">
                            <Col sm={12}>
                              <label>Excel File</label>
                            </Col>
                            <Col sm={12}>
                              <input
                                className="form-control"
                                error={touched.excelFileUploadUrl && errors.excelFileUploadUrl}
                                name="excelFileUploadUrl"
                                id="excelFileUploadUrl"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="file"
                                value={values.excelFileUploadUrl}
                              />
                              {touched.excelFileUploadUrl && errors.excelFileUploadUrl && (
                                <small className="text-danger form-text">{errors.excelFileUploadUrl}</small>
                              )}
                            </Col>
                          </Row>

                          {loader}

                          <Row className="my-3">
                            <Col sm={12}>
                              <Button
                                className="btn-block"
                                color="success"
                                size="large"
                                type="submit"
                                variant="success"
                                disabled={disableButton === true}
                              >
                                Upload
                              </Button>
                            </Col>
                          </Row>

                        </Col>
                        <Col sm={4}></Col>
                      </Row>
                    </form>
                  )}
                </Formik>
              </Card.Body>
            </Card>


          </React.Fragment>
        </>
      )}
    </>
  );
};

export default UsersBulkUpload;
