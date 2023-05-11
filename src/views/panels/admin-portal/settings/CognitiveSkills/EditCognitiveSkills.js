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

const EditQuestionsCategory = ({ editCognitiveSkillsID, setIsOpenEditCognitiveSkills }) => {

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [cognitiveSkillsTitleErr, setCognitiveSkillsTitleErr] = useState(false);
    const [cognitiveSkillsTitleErrMessage, setCognitiveSkillsTitleErrMessage] = useState('');
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
            cognitive_id: editCognitiveSkillsID
        };

        console.log(payload);

        axios
            .post(
                dynamicUrl.fetchIndividualCognitiveSkill,
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

                    setIsOpenEditCognitiveSkills(true);
                    setIsLoading(false);
                }

            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    setIsOpenEditCognitiveSkills(false);
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
                                            CognitiveSkills: previousData.cognitive_name,
                                            submit: null
                                        }
                                    }
                                    validationSchema={
                                        Yup.object().shape({
                                            CognitiveSkills: Yup.string()
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
                                                cognitive_id: editCognitiveSkillsID,
                                                cognitive_name: values.CognitiveSkills
                                            }
                                        };

                                        console.log('form Data: ', formData);

                                        axios
                                            .post(
                                                dynamicUrl.updateCognitiveSkill,
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
                                                    setIsOpenEditCognitiveSkills(false);

                                                    MySwal.fire({
                                                        type: 'success',
                                                        title: 'Cognitive Skills updated successfully!',
                                                        icon: 'success',
                                                    }).then((willDelete) => {
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
                                                                <label className="floating-label" htmlFor="CognitiveSkills">
                                                                    <small className="text-danger">* </small>Questions Category
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.CognitiveSkills && errors.CognitiveSkills}
                                                                    name="CognitiveSkills"
                                                                    onBlur={handleBlur}
                                                                    // onChange={handleChange}
                                                                    type="text"
                                                                    value={values.CognitiveSkills}
                                                                    onChange={(e) => {
                                                                        handleChange("CognitiveSkills")(e);
                                                                        setCognitiveSkillsTitleErr(false);
                                                                    }}

                                                                />

                                                                {touched.CognitiveSkills && errors.CognitiveSkills && <small className="text-danger form-text">{errors.CognitiveSkills}</small>}

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
                    )}
                </>
            )}

        </div>


    )
}

export default EditQuestionsCategory