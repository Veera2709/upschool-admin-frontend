import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Formik } from 'formik';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import dynamicUrl from "../../../../helper/dynamicUrls";
import MESSAGES from '../../../../helper/messages';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import BasicSpinner from '../../../../helper/BasicSpinner';
import { validationForSuccessCriteria } from "./validation";

const TestConfiguration = ({ className, rest, id }) => {
    let history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [previousDataTest, setPreviousDataTest] = useState([]);

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const fetchIndividualSchoolDetails = () => {
        axios
            .post(
                dynamicUrl.fetchIndividualSchool,
                {
                    data: {
                        school_id: id,
                    }
                },
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {
                console.log(response.data.Items[0]);
                let result = response.status === 200;
                hideLoader();
                if (result) {
                    console.log('test_config', response.data.Items[0].test_config);
                    let previousDataTest = response.data.Items[0].test_config;
                    console.log(previousDataTest);
                    setPreviousDataTest(previousDataTest);
                    setIsLoading(false);
                } else {
                    hideLoader();
                }
            })
            .catch((error) => {
                if (error.response) {
                    hideLoader();
                    if (error.response.data === 'Invalid Token') {
                        sessionStorage.clear();
                        localStorage.clear();
                        history.push('/auth/signin-1');
                        window.location.reload();
                    }
                } else if (error.request) {
                    console.log(error.request);
                    hideLoader();
                    setIsLoading(false);
                } else {
                    console.log('Error', error.message);
                    hideLoader();
                    setIsLoading(false);
                }
            });
    }

    useEffect(() => {
        setIsLoading(true);
        fetchIndividualSchoolDetails();
    }, []);

    return (

        <div>
            {
                isLoading ? (
                    <BasicSpinner />
                ) : (
                    <>
                        <React.Fragment>

                            <Card>

                                <Card.Body>
                                    <Card.Title>
                                        Test Configuration
                                    </Card.Title>
                                    <Formik
                                        initialValues={{
                                            minStudentsPre: previousDataTest.pct_of_student_for_reteach === '' ? '' : previousDataTest.pct_of_student_for_reteach,
                                            class_Percentage: previousDataTest.class_percentage === '' ? '' : previousDataTest.class_percentage,
                                        }}
                                        validationSchema={validationForSuccessCriteria}
                                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                            setStatus({ success: true });
                                            setSubmitting(true);
                                            const formData = {
                                                data: {
                                                    school_id: id,
                                                    test_config: {
                                                        pct_of_student_for_reteach: values.minStudentsPre,
                                                        class_percentage: values.class_Percentage,
                                                    }
                                                }
                                            }
                                             await axios
                                                .post(
                                                    dynamicUrl.setTestConfiguration,
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
                                                        if (response.status === 200) {

                                                            const MySwal = withReactContent(Swal);
                                                            MySwal.fire({
                                                                // title: MESSAGES.TTTLES.Goodjob,
                                                                type: 'success',
                                                                text: MESSAGES.SUCCESS.UpdatingPostQuizConfiguration,
                                                                icon: 'success',
                                                            }).then((willDelete) => {
                                                                window.location.reload();
                                                            });

                                                        } else {
                                                            setStatus({ success: false });
                                                            setErrors({ submit: 'Error in Editing School' });
                                                        }
                                                    } else {
                                                        console.log('else res');
                                                        setStatus({ success: false });
                                                        setErrors({ submit: 'Error in Editing School' });
                                                    }
                                                })
                                                .catch((error) => {
                                                    if (error.response) {

                                                        hideLoader();
                                                        // Request made and server responded
                                                        console.log(error.response.data);

                                                        if (error.response.data === "Invalid Token") {

                                                            sessionStorage.clear();
                                                            localStorage.clear();

                                                            history.push('/auth/signin-1');
                                                            window.location.reload();
                                                        } else {
                                                            setStatus({ success: false });
                                                            setErrors({ submit: error.response.data });
                                                        }



                                                    } else if (error.request) {
                                                        // The request was made but no response was received
                                                        console.log(error.request);
                                                        hideLoader();
                                                    } else {
                                                        // Something happened in setting up the request that triggered an Error
                                                        console.log('Error', error.message);
                                                        hideLoader();
                                                    }
                                                })
                                        }}
                                    >
                                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                                            <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
                                                <div id='CommonConfiguration'>
                                                    <Card.Title>
                                                        Success Criteria
                                                    </Card.Title>
                                                    <Row>
                                                        <Col xs={6}>
                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={
                                                                    <Tooltip
                                                                        id={`tooltip-top`}
                                                                        style={{ zIndex: 1151, fontSize: '10px' }}
                                                                    >
                                                                        So that the teacher will get recommendations of Concepts to re-teach
                                                                    </Tooltip>}>
                                                                <div className="form-group fill">
                                                                    <label className="floating-label">
                                                                        <small className="text-danger">* </small>
                                                                        Percentage of students to clear the quiz
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        error={touched.minStudentsPre && errors.minStudentsPre}
                                                                        label="minStudentsPre"
                                                                        name="minStudentsPre"
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        onWheel={(e) => e.target.blur()}
                                                                        value={values.minStudentsPre}
                                                                    />
                                                                    {touched.minStudentsPre && errors.minStudentsPre && <small className="text-danger form-text">{errors.minStudentsPre}</small>}
                                                                </div>
                                                            </OverlayTrigger>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <label className="floating-label">
                                                                {/* <small className="text-danger">* </small> */}
                                                                Class Percentage
                                                            </label>
                                                            <input
                                                                className="form-control"
                                                                error={touched.class_Percentage && errors.class_Percentage}
                                                                label="class_Percentage"
                                                                name="class_Percentage"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                type="number"
                                                                onWheel={(e) => e.target.blur()}
                                                                value={values.class_Percentage}
                                                            />

                                                            {touched.class_Percentage && errors.class_Percentage && <small className="text-danger form-text">{errors.class_Percentage}</small>}
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                </div>
                                                <Row className="my-3">
                                                    <Col> </Col>
                                                    <Col> </Col>
                                                    <Col xs={2}>
                                                        <Button
                                                            className="btn-block"
                                                            color="success"
                                                            size="small"
                                                            type="submit"
                                                            variant="success">
                                                            Submit
                                                        </Button>
                                                    </Col>
                                                </Row>

                                            </form>

                                        )}
                                    </Formik>

                                </Card.Body>
                            </Card>
                        </React.Fragment>
                    </>
                )
            }
        </div >
    );
}

export default TestConfiguration