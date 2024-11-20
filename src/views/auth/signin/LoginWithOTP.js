import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { Row, Col, Button, Alert, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import * as Yup from 'yup';
import { Formik } from 'formik';
import jwt from 'jwt-decode';

import upschoolLogo from '../../../assets/images/UpSchoolSVG.svg';
import { SessionStorage } from '../../../util/SessionStorage';
import dynamicUrl from '../../../helper/dynamicUrls';
import useFullPageLoader from '../../../helper/useFullPageLoader';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import * as Constants from '../../../config/constant';

const LoginWithOTP = ({ className, handleLogin, ...rest }) => {

    let history = useHistory();

    const [otpSent, setOtpSent] = useState(false);
    const [createOrResetPassword, setCreateOrResetPassword] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const [userEmail, setUserEmail] = useState('');

    const [eyeValueNewPass, setEyeValueNewPass] = useState('feather icon-eye-off');
    const [typeValueNewPass, setTypeValueNewPass] = useState('password');
    const [eyeValueConfirmPass, setEyeValueConfirmPass] = useState('feather icon-eye-off');
    const [typeValueConfirmPass, setTypeValueConfirmPass] = useState('password');

    const handleSignIn = () => {

        sessionStorage.clear();
        localStorage.clear();

        history.push('/auth/signin-1');
        // handleLogin();
    }

    const handleHideShowNewPassword = () => {
        typeValueNewPass === 'password' ? setTypeValueNewPass('text') : setTypeValueNewPass('password');
        eyeValueNewPass === 'feather icon-eye-off' ? setEyeValueNewPass('feather icon-eye') : setEyeValueNewPass('feather icon-eye-off');
    }

    const handleHideShowConfirmPassword = () => {
        typeValueConfirmPass === 'password' ? setTypeValueConfirmPass('text') : setTypeValueConfirmPass('password');
        eyeValueConfirmPass === 'feather icon-eye-off' ? setEyeValueConfirmPass('feather icon-eye') : setEyeValueConfirmPass('feather icon-eye-off');
    }

    useEffect(() => {

        sessionStorage.clear();

        localStorage.clear();

    }, []);

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
                                    {otpSent === false && createOrResetPassword === false && (

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
                                                                    user_email: formData.user_email.toLowerCase(),
                                                                    otpSubject: 'otpLogin'
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
                                                            {touched.email && errors.email &&
                                                                <small
                                                                    style={{ textAlign: 'initial' }}
                                                                    class="text-danger form-text">
                                                                    {errors.email}
                                                                </small>}
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
                                                                user_email: userEmail.toLowerCase()
                                                            }
                                                        },
                                                        {
                                                            headers: { Authorization: sessionStorage.getItem('user_jwt') }
                                                        }
                                                    )
                                                    .then((response) => {
                                                        console.log({ response });
                                                        hideLoader();

                                                        if (response.data[0].isFirstTimeLogin === 'Yes') {
                                                            SessionStorage.setItem('user_jwt', response.data[0].jwt);
                                                            SessionStorage.setItem('user_access_role', JSON.stringify(response.data[0].user_role));

                                                            setOtpSent(false);
                                                            setCreateOrResetPassword(true);
                                                        } else {

                                                            // alert(JSON.stringify(response));
                                                            let user_data = jwt(response.data[0].jwt);

                                                            if (user_data.length !== 0) {

                                                                SessionStorage.setItem('user_jwt', response.data[0].jwt);
                                                                SessionStorage.setItem('user_access_role', JSON.stringify(response.data[0].user_role));
                                                                history.push('/admin-portal/admin-dashboard');
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
                                                        {touched.user_otp && errors.user_otp &&
                                                            <small
                                                                style={{ textAlign: 'initial' }}
                                                                class="text-danger form-text">
                                                                {errors.user_otp}
                                                            </small>}
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

                                    {createOrResetPassword === true && (

                                        <Formik

                                            initialValues={{
                                                newPassword: '',
                                                confirmPassword: '',
                                                submit: null
                                            }}

                                            validationSchema={Yup.object().shape({

                                                newPassword: Yup.string()
                                                    .max(20, 'New Password is too long!')
                                                    .min(8, 'New Password is too short!')
                                                    .required("New Password is required!")
                                                    .matches(
                                                        Constants.Common.PasswordRegex,
                                                        "Must be a combination of varied characters like: uppercase, lowercase, numbers and symbols with no white spaces!"
                                                    ),
                                                confirmPassword: Yup.string().when("newPassword", {
                                                    is: val => (val && val.length > 0 ? true : false),
                                                    then: Yup.string().oneOf(
                                                        [Yup.ref("newPassword")],
                                                        "Confirm Password must be same as New Password!"
                                                    )
                                                })

                                            })}

                                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                                setStatus({ success: true });
                                                setSubmitting(true);

                                                showLoader();

                                                const formData = {
                                                    user_email: userEmail,
                                                    new_password: values.newPassword,
                                                    confirm_password: values.confirmPassword
                                                };

                                                console.log("formData", formData);

                                                axios
                                                    .post(
                                                        dynamicUrl.resetOrCreatePassword,
                                                        {
                                                            data: {

                                                                user_email: userEmail,
                                                                new_password: values.newPassword,
                                                                confirm_password: values.confirmPassword

                                                            }
                                                        },
                                                        {
                                                            headers: {
                                                                Authorization: sessionStorage.getItem('user_jwt')
                                                            }
                                                        }
                                                    )
                                                    .then((response) => {
                                                        console.log({ response });
                                                        hideLoader();

                                                        // alert(JSON.stringify(response));
                                                        let result = response.status;

                                                        if (result === 200) {

                                                            const MySwal = withReactContent(Swal);
                                                            MySwal.fire({
                                                                title: 'Success',
                                                                icon: 'success',
                                                                text: 'Password updated successfully!',
                                                                type: 'success'
                                                            }).then((willDelete) => {
                                                                sessionStorage.clear();
                                                                localStorage.clear();
                                                                history.push('/auth/signin-1');
                                                            });

                                                        }
                                                    })
                                                    .catch((error) => {
                                                        if (error.response) {
                                                            hideLoader();
                                                            // Request made and server responded
                                                            console.log(error.response.data);
                                                            setStatus({ success: false });
                                                            setErrors({ submit: error.response.data });
                                                            setCreateOrResetPassword(true);
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

                                                    <h5 style={{ textAlign: 'initial' }}>Create Password</h5>
                                                    <p style={{ textAlign: 'initial' }}>Please, create password as it doesn't exist!</p>
                                                    <hr />

                                                    <div className="form-group mb-3">
                                                        <Row>
                                                            <label
                                                                style={{ textAlign: 'initial' }}
                                                                className="floating-label" >
                                                                <small className="text-danger">* </small>
                                                                New Password
                                                            </label>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.newPassword && errors.newPassword}
                                                                    label="New Password"
                                                                    name="newPassword"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    type={typeValueNewPass}
                                                                    value={values.newPassword}
                                                                    placeholder="New Password"
                                                                />
                                                            </Col>
                                                            {/* <Col xs={1}> */}
                                                            <Link
                                                                to="#"
                                                                onClick={handleHideShowNewPassword}>
                                                                <i
                                                                    style={{
                                                                        position: 'absolute',
                                                                        marginTop: '10px',
                                                                        marginLeft: '-40px'
                                                                    }}
                                                                    className={eyeValueNewPass} />
                                                            </Link>
                                                            {/* </Col> */}
                                                        </Row>
                                                        {touched.newPassword && errors.newPassword &&
                                                            <small
                                                                style={{ textAlign: 'initial' }}
                                                                className="text-danger form-text">{errors.newPassword}
                                                            </small>}
                                                    </div>

                                                    <div className="form-group mb-3">
                                                        <Row>
                                                            <label className="floating-label" >
                                                                <small
                                                                    style={{ textAlign: 'initial' }}
                                                                    className="text-danger">* </small>
                                                                Confirm Password
                                                            </label>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.confirmPassword && errors.confirmPassword}
                                                                    label="Confirm Password"
                                                                    name="confirmPassword"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    type={typeValueConfirmPass}
                                                                    value={values.confirmPassword}
                                                                    placeholder="Confirm Password"
                                                                />
                                                            </Col>
                                                            {/* <Col xs={1}> */}
                                                            <Link
                                                                to="#"
                                                                onClick={handleHideShowConfirmPassword}>
                                                                <i
                                                                    style={{
                                                                        position: 'absolute',
                                                                        marginTop: '10px',
                                                                        marginLeft: '-40px'
                                                                    }}
                                                                    className={eyeValueConfirmPass} />
                                                            </Link>
                                                            {/* </Col> */}

                                                        </Row>
                                                        {touched.confirmPassword && errors.confirmPassword &&
                                                            <small
                                                                style={{ textAlign: 'initial' }}
                                                                className="text-danger form-text">
                                                                {errors.confirmPassword}
                                                            </small>}
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