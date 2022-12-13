import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import MESSAGES from '../../../../helper/messages';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { defaultPostApi } from '../../../common-ui-components/sow/bgv-api/BgvApi';
import { bgvAlerts } from '../../../common-ui-components/sow/bgv-api/bgvAlerts';
import { areFilesInvalidBulkUpload, isEmptyObject } from '../../../../util/utils';

import * as Yup from 'yup';
import { Formik } from 'formik';

import { bulkUpload } from './case-bulk-upload-api/bulkUpload';
import useFullPageLoader from '../../../../helper/useFullPageLoader';

const UploadCase = ({ className, ...rest }) => {

  const schoolNameRef = useRef('');
  const [schoolName_ID, setSchoolName_ID] = useState({});
  const [schoolID, setSchoolID] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  useEffect(() => {

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

          let responseData = response.data;
          setSchoolName_ID(responseData);
          hideLoader();

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
          // setStatus({ success: false });
          // setErrors({ submit: error.response.data });
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

          if (uploadResponse2.status === 200) {
            sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.FilesUploaded });
            hideLoader();
            setDisableButton(false);
          } else {
            hideLoader();
            setDisableButton(false);
          }
        }
      } else {
        console.log('No files uploaded');
        sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.FilesUploaded });
        hideLoader();
        setDisableButton(false);
      }
    }
  };

  return (

    <>
      {isEmptyObject(schoolName_ID) ? <></> : (
        <>

          <React.Fragment>
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
                    showLoader();

                    let excelFile = document.getElementById('excelFileUploadUrl').files[0];

                    const filteredResult = schoolName_ID.Items.find((e) => e.school_name == schoolNameRef.current.value);

                    console.log(filteredResult.school_id);

                    let sendData = {
                      school_id: '',
                      ExcelFile: ''
                    }

                    if (excelFile) {

                      sendData.school_id = filteredResult.school_id;
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
                              <select
                                className="form-control"
                                error={touched.schoolName && errors.schoolName}
                                name="schoolName"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="text"
                                ref={schoolNameRef}
                                value={values.schoolName}
                              >

                                {schoolName_ID.Items.map((schoolData) => {

                                  return <option key={schoolData.school_id}>
                                    {schoolData.school_name}
                                  </option>

                                })}

                              </select>
                              {touched.schoolName && errors.schoolName && (
                                <small className="text-danger form-text">{errors.schoolName}</small>
                              )}
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
                              <Button className="btn-block" color="success" size="large" type="submit" variant="success" disabled={disableButton === true}>
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

export default UploadCase;