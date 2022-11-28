import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button, Alert } from 'react-bootstrap';

import * as Yup from 'yup';
import { Formik } from 'formik';

// import useAuth from '../../../hooks/useAuth';
// import useScriptRef from '../../../hooks/useScriptRef';

import jwt from 'jwt-decode';

import { SessionStorage } from '../../../util/SessionStorage';
import dynamicUrl from '../../../helper/dynamicUrls';
import useFullPageLoader from '../../../helper/useFullPageLoader';

const Login = ({ className, ...rest }) => {

  let history = useHistory();
  const [toggle, setToggle] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const [userEmail, setUserEmail] = useState('');

  const handleLoginWithOTP = () => setToggle(!toggle);

  return (
    <React.Fragment>

      {toggle === false ? (
        <>
          <Formik
            initialValues={{
              email: '',
              password: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().max(255).required('Email/Username is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

              setStatus({ success: true });
              setSubmitting(true);

              showLoader();

              const formData = { user_email: values.email.trim().toLowerCase(), user_password: values.password };
              axios
                .post(
                  dynamicUrl.login,
                  {
                    data: {
                      user_email: formData.user_email,
                      user_password: formData.user_password
                    }
                  },
                  {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                  }
                )
                .then((response) => {
                  console.log({ response });
                  hideLoader();

                  // alert(JSON.stringify(response));
                  let user_data = jwt(response.data[0].jwt);

                  if (user_data.length !== 0) {
                    SessionStorage.setItem('user_jwt', response.data[0].jwt);

                    if (response.data[0].jwt === sessionStorage.getItem('user_jwt')) {

                      history.push('/admin-portal/admin-dashboard');
                      window.location.reload();

                    } else {

                      history.push('/auth/signin-1');
                      window.location.reload();

                    }

                  }
                })
                .catch((error) => {
                  if (error.response) {
                    hideLoader();
                    // Request made and server responded
                    console.log(error.response.data);
                    setStatus({ success: false });
                    setErrors({ submit: error.response.data });
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


            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
                <div className="form-group mb-3">
                  <input
                    className="form-control"
                    error={touched.email && errors.email}
                    label="Email Address / Username"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="email"
                    value={values.email}
                    placeholder="Email Id/Username"
                  />
                  {touched.email && errors.email && <small class="text-danger form-text">{errors.email}</small>}
                </div>
                <div className="form-group mb-4">
                  <input
                    className="form-control"
                    error={touched.password && errors.password}
                    label="Password"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.password}
                    placeholder="Password"
                  />
                  {touched.password && errors.password && <small class="text-danger form-text">{errors.password}</small>}
                </div>

                {errors.submit && (
                  <Col sm={12}>
                    <Alert variant="danger">{errors.submit}</Alert>
                  </Col>
                )}

                {loader}

                <Row>
                  <Col mt={2}>
                    <Button className="btn-block" color="primary" disabled={isSubmitting} size="large" type="submit" variant="primary">
                      Signin
                    </Button>
                  </Col>
                </Row>

              </form>
            )}
          </Formik>

          <hr />

          <p onClick={handleLoginWithOTP} style={{ cursor: 'pointer' }} className="mb-0 text-muted f-w-400">
            Login with OTP
          </p>
        </>
      ) : (
        <>

          {otpSent === false && (

            <>
              < Formik
                initialValues={{
                  email: '',
                  submit: null
                }}
                validationSchema={
                  Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                  })
                }
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                  setStatus({ success: true });
                  setSubmitting(true);

                  showLoader();

                  const formData = { user_email: values.email.trim().toLowerCase() };
                  axios
                    .post(
                      dynamicUrl.loginWithOTP,
                      {
                        data: {
                          user_email: formData.user_email,
                        }
                      },
                      {
                        headers: { Authorization: sessionStorage.getItem('user_jwt') }
                      }
                    )
                    .then((response) => {
                      console.log({ response });

                      console.log(response.status);

                      console.log(response.status === 200);

                      let result = response.status === 200;
                      hideLoader();

                      if (result) {

                        console.log('inside res');
                        setUserEmail(values.email);
                        setOtpSent(true);

                        // SessionStorage.setItem('user_jwt', response.data[0].jwt);

                      } else {

                        console.log('else res');

                        hideLoader();
                        // Request made and server responded
                        setStatus({ success: false });
                        setErrors({ submit: 'Error in generating OTP' });

                      }
                    })
                    .catch((error) => {
                      if (error.response) {
                        hideLoader();
                        // Request made and server responded
                        console.log(error.response.data);
                        setStatus({ success: false });
                        setErrors({ submit: error.response.data });
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

                }}
              >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                  <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
                    <div className="form-group mb-3">
                      <input
                        className="form-control"
                        error={touched.email && errors.email}
                        label="Email Address"
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="email"
                        value={values.email}
                        placeholder="Email Id"
                      />
                      {touched.email && errors.email && <small class="text-danger form-text">{errors.email}</small>}
                    </div>

                    {errors.submit && (
                      <Col sm={12}>
                        <Alert variant="danger">{errors.submit}</Alert>
                      </Col>
                    )}

                    {loader}

                    <Row>
                      <Col mt={2}>
                        <Button className="btn-block" color="primary" disabled={isSubmitting} size="large" type="submit" variant="primary">
                          Generate OTP
                        </Button>
                      </Col>
                    </Row>

                  </form>
                )}
              </Formik >

              <hr />

              <p onClick={handleLoginWithOTP} style={{ cursor: 'pointer' }} className="mb-0 text-muted f-w-400">
                Back to Signin
              </p>
            </>

          )}

          {otpSent === true && (

            <Formik

              initialValues={{
                user_otp: '',
                submit: null
              }}

              validationSchema={Yup.object().shape({
                user_otp: Yup.string().max(255).required('OTP is required'),
              })}

              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                setStatus({ success: true });
                setSubmitting(true);

                showLoader();

                const formData = { user_otp: values.user_otp.trim() };
                axios
                  .post(
                    dynamicUrl.validateOTP,
                    {
                      data: {
                        entered_otp: formData.user_otp,
                        user_email: userEmail
                      }
                    },
                    {
                      headers: { Authorization: sessionStorage.getItem('user_jwt') }
                    }
                  )
                  .then((response) => {
                    console.log({ response });
                    hideLoader();

                    // alert(JSON.stringify(response));
                    let user_data = jwt(response.data[0].jwt);

                    if (user_data.length !== 0) {

                      history.push('/admin-portal/admin-dashboard');
                      window.location.reload();

                    }
                  })
                  .catch((error) => {
                    if (error.response) {
                      hideLoader();
                      // Request made and server responded
                      console.log(error.response.data);
                      setStatus({ success: false });
                      setErrors({ submit: error.response.data });
                      setOtpSent(false);
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

              }}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
                  <div className="form-group mb-3">
                    <input
                      className="form-control"
                      error={touched.user_otp && errors.user_otp}
                      label="OTP"
                      name="user_otp"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="user_otp"
                      value={values.user_otp}
                      placeholder="OTP"
                    />
                    {touched.user_otp && errors.user_otp && <small class="text-danger form-text">{errors.user_otp}</small>}
                  </div>

                  {errors.submit && (
                    <Col sm={12}>
                      <Alert variant="danger">{errors.submit}</Alert>
                    </Col>
                  )}

                  {loader}

                  <Row>
                    <Col mt={2}>
                      <Button className="btn-block" color="primary" disabled={isSubmitting} size="large" type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                  </Row>

                </form>
              )}
            </Formik>

          )}


          {/* </div> */}
        </>
      )}

    </React.Fragment >
  );
};

export default Login;
