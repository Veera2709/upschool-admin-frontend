import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-draggable-multi-select';
import ReactTags from 'react-tag-autocomplete';
import * as Yup from 'yup';
import { Row, Col } from 'react-bootstrap';

import dynamicUrl from '../../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../../helper/useFullPageLoader';
import { SessionStorage } from '../../../../../util/SessionStorage';
import { useHistory } from 'react-router-dom';
import BasicSpinner from '../../../../../helper/BasicSpinner';
import * as Constants from '../../../../../helper/constants';

const EditQuestionsCategory = ({ editQuestionCategoryID, setIsOpenEditQuestionCategory }) => {

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [questionCategoryTitleErr, setQuestionCategoryTitleErr] = useState(false);
    const [questionCategoryTitleErrMessage, setQuestionCategoryTitleErrMessage] = useState('');
    const [previousData, setPreviousData] = useState([]);

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    useEffect(() => {

        setIsLoading(true);
        showLoader();

        const payload = {
            category_id: editQuestionCategoryID
        };

        console.log(payload);

        axios
            .post(
                dynamicUrl.fetchIndividualCategory,
                { data: payload },
                {
                    headers: { Authorization: SessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {

                console.log(response.data.Items[0]);
                hideLoader();

                if (response.data.Items[0]) {

                    setPreviousData(response.data.Items[0]);
                    setIsLoading(false);
                } else {

                    setIsOpenEditQuestionCategory(true);
                    setIsLoading(false);
                }

            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    setIsOpenEditQuestionCategory(false);
                    hideLoader();

                    if (error.response.data === 'Invalid Token') {

                        sessionStorage.clear();
                        localStorage.clear();

                        history.push('/auth/signin-1');
                        window.location.reload();

                    } else {

                        setIsLoading(false);
                        sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });

                    }


                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                    setIsLoading(false);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                    setIsLoading(false);
                }
            });

    }, []);

    return (

        <div>

            {isLoading ? (
                <BasicSpinner />
            ) : (

                <>
                    {previousData.length === 0 ? (<></>) : (

                        <>
                            {console.log(previousData.subject_title)}
                            <React.Fragment>
                                < Formik

                                    initialValues={
                                        {
                                            questionCategory: previousData.category_name,
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
                                                category_id: editQuestionCategoryID,
                                                category_name: values.questionCategory
                                            }
                                        };

                                        console.log('form Data: ', formData);

                                        axios
                                            .post(
                                                dynamicUrl.updateQuestionCategory,
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
                                                    setIsOpenEditQuestionCategory(false);

                                                    MySwal.fire({
                                                        type: 'success',
                                                        title: 'Question Category updated successfully!',
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
                    )}
                </>
            )}

        </div>


    )
}

export default EditQuestionsCategory