import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Alert } from 'react-bootstrap';

import * as Yup from 'yup';
import { Formik } from 'formik';

import { defaultPostApi } from '../../bgv-api/BgvApi';
import dynamicUrl from '../../../../../helper/dynamicUrls';
import { isEmptyArray } from '../../../../../util/utils';
import { useParams } from 'react-router-dom';
import MESSAGES from '../../../../../helper/messages';
import * as Constants from '../../../../../helper/constants';

const InitiateEmail = ({ className, rest, componentName }) => {
  let { case_id } = useParams();
  const [btnLoader, setBtnLoader] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  console.log('Component Name', componentName);

  useEffect(() => {
    setEmailSent(false);
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          emailRecipients: ''
        }}
        validationSchema={Yup.object().shape({
          emailRecipients: Yup.string().required(Constants.EmailInitiation.EmailsRequired)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setBtnLoader(true);
            // let emailAttachments = document.getElementById('emailAttachmentFiles').files;
            let emailAttachments = document.getElementById('emailAttachmentFiles').files;
            console.log(emailAttachments);

            if (isEmptyArray(emailAttachments)) {
              let emailPayload = {
                data: {
                  component_name: componentName,
                  case_id: case_id,
                  emailRecipients: values.emailRecipients,
                  emailAttachments: []
                }
              };
              console.log(emailPayload);
              const sendEmailApiResponse = await defaultPostApi(dynamicUrl.sendMailToClientHR, emailPayload);
              console.log(sendEmailApiResponse);
              if (sendEmailApiResponse.data === 200) {
                setStatus({ success: true });
                setSubmitting(true);
                setBtnLoader(false);
                setEmailSent(true);
              }
            } else {
              let filesArray = [];

              // looping
              for (var attachment of emailAttachments) {
                filesArray.push(attachment.name);
              }

              let payload = { data: { filesArray: filesArray } };
              console.log('payload', payload);

              const apiResponse = await defaultPostApi(dynamicUrl.convertToSignedUrl, payload);
              console.log('Response', apiResponse);

              if (apiResponse.Error) {
                console.error(Error);
                setStatus({ success: false });
                setErrors({ submit: Error.message });
                setSubmitting(false);
                setBtnLoader(false);
              } else {
                if (!isEmptyArray(apiResponse.data)) {
                  let uploadParams = apiResponse.data;
                  console.log({ uploadParams });

                  // blob
                  for (let index = 0; index < uploadParams.length; index++) {
                    let blobField = document.getElementById('emailAttachmentFiles').files[index];
                    console.log({
                      blobField
                    });

                    let fileData = uploadParams[index];

                    console.log({ fileData });

                    let result = await fetch(fileData, {
                      method: 'PUT',
                      body: blobField
                    });

                    console.log({
                      result
                    });
                  }

                  let emailPayload = {
                    data: {
                      component_name: componentName,
                      case_id: case_id,
                      emailRecipients: values.emailRecipients,
                      emailAttachments: apiResponse.data
                    }
                  };
                  console.log(emailPayload);
                  const sendEmailApiResponse = await defaultPostApi(dynamicUrl.sendMailToClientHR, emailPayload);
                  console.log(sendEmailApiResponse);
                  if (sendEmailApiResponse.data === 200) {
                    setStatus({ success: true });
                    setSubmitting(true);
                    setBtnLoader(false);
                    setEmailSent(true);
                  }
                }
              }
            }
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
            setBtnLoader(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <div className="form-group mb-4">
              <textarea
                className="form-control"
                error={touched.emailRecipients && errors.emailRecipients}
                label="emailRecipients"
                name="emailRecipients"
                id="emailRecipients"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.emailRecipients}
                placeholder="Enter recipients (comma seperated)"
                rows="6"
              />
              {touched.emailRecipients && errors.emailRecipients && (
                <small className="text-danger form-text">{errors.emailRecipients}</small>
              )}
            </div>

            <div className="form-group mb-4">
              <input
                className="form-control"
                error={touched.emailAttachmentFiles && errors.emailAttachmentFiles}
                label="emailAttachmentFiles"
                name="emailAttachmentFiles"
                id="emailAttachmentFiles"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.emailAttachmentFiles}
                type="file"
                multiple
              />
              {touched.emailAttachmentFiles && errors.emailAttachmentFiles && (
                <small class="text-danger form-text">{errors.emailAttachmentFiles}</small>
              )}
            </div>

            {/* <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig} /> */}

            {errors.submit && (
              <div className="form-group mb-4">
                <Alert variant="danger">{errors.submit}</Alert>
              </div>
            )}

            {errors.submit && (
              <div className="form-group mb-4">
                <Alert variant="danger">{errors.submit}</Alert>
              </div>
            )}

            {emailSent && (
              <div className="form-group mb-4">
                <Alert variant="success">{MESSAGES.SUCCESS.EmailSentSuccessfully}</Alert>
              </div>
            )}

            <Row>
              <Col mt={2}>
                {btnLoader ? (
                  <>
                    <Button className="btn-block" color="primary" size="large" variant="primary" disabled>
                      <span className="spinner-border spinner-border-sm mr-1" role="status" />
                      Loading...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="btn-block" color="primary" disabled={isSubmitting} size="large" type="submit" variant="primary">
                      Initiate Email
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </form>
        )}
      </Formik>
    </>
  );
};

export default InitiateEmail;
