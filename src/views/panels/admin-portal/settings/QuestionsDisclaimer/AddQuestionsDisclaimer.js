import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import useFullPageLoader from '../../../../../helper/useFullPageLoader';
import dynamicUrl from '../../../../../helper/dynamicUrls';
import * as Constants from '../../../../../helper/constants';

const AddQuestionDisclaimer = ({ setIsOpenAddQuestionDisclaimer }) => {

    const MySwal = withReactContent(Swal);

    const history = useHistory();
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [questionDisclaimerLabelErr, setQuestionDisclaimerLabelErr] = useState(false);
    const [questionDisclaimerLabelErrMessage, setQuestionDisclaimerLabelErrMessage] = useState('');

    return (

        <>
            <React.Fragment>

                < Formik

                    initialValues={
                        {
                            questionDisclaimer: "",
                            questionDisclaimerLabel: "",
                            submit: null
                        }
                    }
                    validationSchema={
                        Yup.object().shape({
                            questionDisclaimer: Yup.string()
                                .trim()
                                .min(2, Constants.AddQuestionDisclaimer.QuestionDisclaimerTooShort)
                                .required(Constants.AddQuestionDisclaimer.QuestionDisclaimerRequired),
                            questionDisclaimerLabel: Yup.string()
                                .trim()
                                .min(2, Constants.AddQuestionDisclaimer.QuestionDisclaimerLabelTooShort)
                                .max(32, Constants.AddQuestionDisclaimer.QuestionDisclaimerLabelTooLong)
                                .required(Constants.AddQuestionDisclaimer.QuestionDisclaimerLabelRequired),
                        })
                    }
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                        setStatus({ success: true });
                        setSubmitting(true);
                        showLoader(true);

                        console.log("Submit clicked");

                        const formData = {
                            data: {
                                disclaimer: values.questionDisclaimer,
                                disclaimer_label: values.questionDisclaimerLabel
                            }
                        };

                        console.log('form Data: ', formData);

                        axios
                            .post(
                                dynamicUrl.addQuestionDisclaimer,
                                formData,
                                {
                                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                                }
                            )
                            .then((response) => {

                                console.log({ response });

                                let result = response.status === 200;
                                hideLoader();

                                if (result) {

                                    console.log('inside res edit');
                                    hideLoader();
                                    setIsOpenAddQuestionDisclaimer(false);

                                    MySwal.fire({
                                        type: 'success',
                                        title: 'Question Disclaimer added successfully!',
                                        icon: 'success',
                                    }).then((willDelete) => {
                                        window.location.reload();
                                    });

                                } else {

                                    console.log('else res');
                                    hideLoader();
                                    // Request made and server responded
                                    setQuestionDisclaimerLabelErr(true);
                                    setQuestionDisclaimerLabelErrMessage("err");
                                    // window.location.reload();


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

                                        setQuestionDisclaimerLabelErr(true);
                                        setQuestionDisclaimerLabelErrMessage(error.response.data);
                                    }


                                } else if (error.request) {
                                    // The request was made but no response was received
                                    console.log(error.request);
                                    hideLoader();
                                    setQuestionDisclaimerLabelErr(true);
                                    setQuestionDisclaimerLabelErrMessage(error.request);
                                } else {
                                    // Something happened in setting up the request that triggered an Error
                                    console.log('Error', error.message);
                                    hideLoader();
                                    setQuestionDisclaimerLabelErr(true);
                                    setQuestionDisclaimerLabelErrMessage(error.request);

                                }
                            })


                    }}>

                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit} >

                            <Row>

                                <Col>
                                    <Row>
                                        <Col xs={6}>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="questionDisclaimerLabel">
                                                    <small className="text-danger">* </small>Question Disclaimer Label
                                                </label>
                                                <input
                                                    className="form-control"
                                                    error={touched.questionDisclaimerLabel && errors.questionDisclaimerLabel}
                                                    name="questionDisclaimerLabel"
                                                    onBlur={handleBlur}
                                                    // onChange={handleChange}
                                                    type="text"
                                                    value={values.questionDisclaimerLabel}
                                                    onChange={(e) => {
                                                        handleChange("questionDisclaimerLabel")(e);
                                                        setQuestionDisclaimerLabelErr(false);
                                                    }}

                                                />

                                                {touched.questionDisclaimerLabel && errors.questionDisclaimerLabel && <small className="text-danger form-text">{errors.questionDisclaimerLabel}</small>}

                                                {questionDisclaimerLabelErr && questionDisclaimerLabelErrMessage &&
                                                    <small className="text-danger form-text">{questionDisclaimerLabelErrMessage}</small>
                                                }
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="questionDisclaimer">
                                                    <small className="text-danger">* </small>Question Disclaimer
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    error={touched.questionDisclaimer && errors.questionDisclaimer}
                                                    name="questionDisclaimer"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.questionDisclaimer}
                                                    rows="8"
                                                    placeholder="Enter your comment"
                                                />
                                            </div>
                                            {touched.questionDisclaimer && errors.questionDisclaimer && (
                                                <small className="text-danger form-text">{errors.questionDisclaimer}</small>
                                            )}
                                        </Col>
                                    </Row>

                                    {loader}
                                    <br />
                                    <hr />
                                    <Row>
                                        <Col></Col>
                                        <Col>
                                            <Row>
                                                <Col xs={6}></Col>
                                                <Col xs={6}>
                                                    <button
                                                        color="success"
                                                        disabled={isSubmitting}
                                                        type="submit"
                                                        className="btn-block btn-rounded btn btn-success btn-large"
                                                    >Submit
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>

                        </form>
                    )
                    }
                </Formik>

            </React.Fragment>
        </>

    )

}

export default AddQuestionDisclaimer