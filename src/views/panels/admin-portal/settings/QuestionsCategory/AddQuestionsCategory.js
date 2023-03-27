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

const AddQuestionCategory = ({ setIsOpenAddQuestionCategory }) => {

    const MySwal = withReactContent(Swal);

    const history = useHistory();
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [questionCategoryTitleErr, setQuestionCategoryTitleErr] = useState(false);
    const [questionCategoryTitleErrMessage, setQuestionCategoryTitleErrMessage] = useState('');

    return (

        <>
            <React.Fragment>

                < Formik

                    initialValues={
                        {
                            questionCategory: "",
                            submit: null
                        }
                    }
                    validationSchema={
                        Yup.object().shape({
                            questionCategory: Yup.string()
                                .trim()
                                .min(2, Constants.AddQuestionCategory.QuestionCategoryTooShort)
                                .max(32, Constants.AddQuestionCategory.QuestionCategoryTooLong)
                                .required(Constants.AddQuestionCategory.QuestionCategoryRequired)
                        })
                    }
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                        setStatus({ success: true });
                        setSubmitting(true);
                        showLoader(true);

                        console.log("Submit clicked");

                        const formData = {
                            data: {
                                category_name: values.questionCategory
                            }
                        };

                        console.log('form Data: ', formData);

                        axios
                            .post(
                                dynamicUrl.addQuestionCategory,
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
                                    setIsOpenAddQuestionCategory(false);

                                    MySwal.fire({
                                        type: 'success',
                                        title: 'Question Category added successfully!',
                                        icon: 'success',
                                    }).then((willDelete) => {
                                        window.location.reload();
                                    });

                                } else {

                                    console.log('else res');
                                    hideLoader();
                                    // Request made and server responded
                                    setQuestionCategoryTitleErr(true);
                                    setQuestionCategoryTitleErrMessage("err");
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

                                        setQuestionCategoryTitleErr(true);
                                        setQuestionCategoryTitleErrMessage(error.response.data);
                                    }


                                } else if (error.request) {
                                    // The request was made but no response was received
                                    console.log(error.request);
                                    hideLoader();
                                    setQuestionCategoryTitleErr(true);
                                    setQuestionCategoryTitleErrMessage(error.request);
                                } else {
                                    // Something happened in setting up the request that triggered an Error
                                    console.log('Error', error.message);
                                    hideLoader();
                                    setQuestionCategoryTitleErr(true);
                                    setQuestionCategoryTitleErrMessage(error.request);

                                }
                            })


                    }}>

                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                        <form noValidate onSubmit={handleSubmit} >

                            <Row>

                                <Col>
                                    <Row>
                                        <Col>

                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="questionCategory">
                                                    <small className="text-danger">* </small>Questions Category
                                                </label>
                                                <input
                                                    className="form-control"
                                                    error={touched.questionCategory && errors.questionCategory}
                                                    name="questionCategory"
                                                    onBlur={handleBlur}
                                                    // onChange={handleChange}
                                                    type="text"
                                                    value={values.questionCategory}
                                                    onChange={(e) => {
                                                        handleChange("questionCategory")(e);
                                                        setQuestionCategoryTitleErr(false);
                                                    }}

                                                />

                                                {touched.questionCategory && errors.questionCategory && <small className="text-danger form-text">{errors.questionCategory}</small>}

                                                {questionCategoryTitleErr && questionCategoryTitleErrMessage &&
                                                    <small className="text-danger form-text">{questionCategoryTitleErrMessage}</small>
                                                }
                                            </div>
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

export default AddQuestionCategory