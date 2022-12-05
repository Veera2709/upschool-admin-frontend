import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button, Alert, Card } from 'react-bootstrap';

import * as Yup from 'yup';
import { Formik } from 'formik';

// import useAuth from '../../../hooks/useAuth';
// import useScriptRef from '../../../hooks/useScriptRef';

import jwt from 'jwt-decode';

import upschoolLogo from '../../../assets/images/UpSchoolSVG.svg';
import { SessionStorage } from '../../../util/SessionStorage';
import dynamicUrl from '../../../helper/dynamicUrls';
import useFullPageLoader from '../../../helper/useFullPageLoader';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

const LoginWithOTP = ({ className, handleLogin, ...rest }) => {

    let history = useHistory();

    const [otpSent, setOtpSent] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const [userEmail, setUserEmail] = useState('');

    const handleSignIn = () => {

        sessionStorage.clear();
        localStorage.clear();

        history.push('/auth/signin-1');
        handleLogin();
    }

    return (
        <>
            <React.Fragment>
                <Breadcrumb />
                <div className="auth-wrapper">
                    <div className="auth-content text-center">
                        <Card className="borderless">
                            <Card.Body>
                                <img width={70} src={upschoolLogo} alt="" className="img-fluid mb-4" />
                                {/* <h3 color='blue'>UpSchool</h3> */}

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

                                            <p onClick={() => {
                                                handleSignIn();
                                            }} style={{ cursor: 'pointer' }} className="mb-0 text-muted f-w-400">
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

                                                            SessionStorage.setItem('user_jwt', response.data[0].jwt);
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
                                                            setOtpSent(true);
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

                                </>

                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </React.Fragment>

        </>
    )

};

export default LoginWithOTP;
