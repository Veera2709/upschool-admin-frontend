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

const AddCognitiveSkills = ({ setIsOpenAddCognitiveSkills }) => {

    const MySwal = withReactContent(Swal);

    const history = useHistory();
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [cognitiveSkillsTitleErr, setCognitiveSkillsTitleErr] = useState(false);
    const [cognitiveSkillsTitleErrMessage, setCognitiveSkillsTitleErrMessage] = useState('');

    return (

        <>
            <React.Fragment>
                < Formik

                    initialValues={
                        {
                            cognitiveSkills: "",
                            submit: null
                        }
                    }
                    validationSchema={
                        Yup.object().shape({
                            cognitiveSkills: Yup.string()
                                .trim()
                                .min(2, Constants.AddCognitiveSkills.CognitiveSkillsTooShort)
                                .max(32, Constants.AddCognitiveSkills.CognitiveSkillsTooLong)
                                .required(Constants.AddCognitiveSkills.CognitiveSkillsRequired)
                        })
                    }
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                        setStatus({ success: true });
                        setSubmitting(true);
                        showLoader(true);

                        console.log("Submit clicked");

                        const formData = {
                            data: {
                                cognitive_name: values.cognitiveSkills
                            }
                        };

                        console.log('form Data: ', formData);

                        axios
                            .post(
                                dynamicUrl.addCognitiveSkill,
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
                                    setIsOpenAddCognitiveSkills(false);

                                    MySwal.fire({
                                        type: 'success',
                                        title: 'Cognitive Skills added successfully!',
                                        icon: 'success',
                                    }).then((willDelete) => {
                                        console.log("REload : ")
                                        window.location.reload();
                                    });

                                } else {

                                    console.log('else res');
                                    hideLoader();
                                    // Request made and server responded
                                    setCognitiveSkillsTitleErr(true);
                                    setCognitiveSkillsTitleErrMessage("err");
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

                                        setCognitiveSkillsTitleErr(true);
                                        setCognitiveSkillsTitleErrMessage(error.response.data);
                                    }


                                } else if (error.request) {
                                    // The request was made but no response was received
                                    console.log(error.request);
                                    hideLoader();
                                    setCognitiveSkillsTitleErr(true);
                                    setCognitiveSkillsTitleErrMessage(error.request);
                                } else {
                                    // Something happened in setting up the request that triggered an Error
                                    console.log('Error', error.message);
                                    hideLoader();
                                    setCognitiveSkillsTitleErr(true);
                                    setCognitiveSkillsTitleErrMessage(error.request);

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
                                                <label className="floating-label" htmlFor="cognitiveSkills">
                                                    <small className="text-danger">* </small>Cognitive Skills
                                                </label>
                                                <input
                                                    className="form-control"
                                                    error={touched.cognitiveSkills && errors.cognitiveSkills}
                                                    name="cognitiveSkills"
                                                    onBlur={handleBlur}
                                                    // onChange={handleChange}
                                                    type="text"
                                                    value={values.cognitiveSkills}
                                                    onChange={(e) => {
                                                        handleChange("cognitiveSkills")(e);
                                                        setCognitiveSkillsTitleErr(false);
                                                    }}

                                                />

                                                {touched.cognitiveSkills && errors.cognitiveSkills && <small className="text-danger form-text">{errors.cognitiveSkills}</small>}

                                                {cognitiveSkillsTitleErr && cognitiveSkillsTitleErrMessage &&
                                                    <small className="text-danger form-text">{cognitiveSkillsTitleErrMessage}</small>
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

export default AddCognitiveSkills