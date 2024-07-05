import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Card, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Formik } from 'formik';
import axios from 'axios';
import Swal from 'sweetalert2';
import dynamicUrl from "../../../../helper/dynamicUrls";
import { SessionStorage } from "../../../../util/SessionStorage";
import { useHistory } from 'react-router-dom';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import BasicSpinner from '../../../../helper/BasicSpinner';
import { error } from "jquery";
import MESSAGES from '../../../../helper/messages';
import withReactContent from "sweetalert2-react-content";

const TeacherClassToggle = ({ className, rest, id }) => {

    let history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const [_radioPrequizTargetlearningFeature, _setRadioPrequizTargetlearningFeature] = useState(false);
    const [_radioPostquizTargetlearningFeature, _setRadioPostquizTargetlearningFeature] = useState(false);
    const [_radioAssesmentSummaryFeature, _setRadioAssesmentSummaryFeature] = useState(false);
    const [_radioChapterWisePerformanceFeature, _setRadioChapterWisePerformanceFeature] = useState(false);
    const [_radioComprehensivePerformanceAnalysisFeature, _setRadioComprehensivePerformanceAnalysisFeature] = useState(false);
    const [_radioActionRecommendationsFeature, _setRadioActionRecommendationsFeature] = useState(false);



    const [prequiz_targetlearning, setPrequiz_targetlearning] = useState('');
    const [postquiz_targetlearning, setPostquiz_targetlearning] = useState('');
    const [assessment_summary, setAssessment_summary] = useState('');
    const [chapterwise_performance, setChapterwise_performance] = useState('');
    const [comprehensive_performance_analysis, setPomprehensive_performance_analysis] = useState('');
    const [action_recomendations, setAction_recomendations] = useState('');

    // console.log(prequiz_targetlearning);



    const handlePrequizTargetlearning = (e) => {
        _setRadioPrequizTargetlearningFeature(!_radioPrequizTargetlearningFeature);
        _radioPrequizTargetlearningFeature === true ? setPrequiz_targetlearning('No') : setPrequiz_targetlearning('Yes');
    }
    const handlePostquizTargetlearning = (e) => {
        _setRadioPostquizTargetlearningFeature(!_radioPostquizTargetlearningFeature);
        _radioPostquizTargetlearningFeature === true ? setPostquiz_targetlearning('No') : setPostquiz_targetlearning('Yes');
    }
    const handleAssesmentSummary = (e) => {
        _setRadioAssesmentSummaryFeature(!_radioAssesmentSummaryFeature);
        _radioAssesmentSummaryFeature === true ? setAssessment_summary('No') : setAssessment_summary('Yes');
    }
    const handleChapterWisePerformance = (e) => {
        _setRadioChapterWisePerformanceFeature(!_radioChapterWisePerformanceFeature)
        _radioChapterWisePerformanceFeature === true ? setChapterwise_performance('No') : setChapterwise_performance('Yes');
    }
    const handleComprehensivePerformanceAnalysis = (e) => {
        _setRadioComprehensivePerformanceAnalysisFeature(!_radioComprehensivePerformanceAnalysisFeature)
        _radioComprehensivePerformanceAnalysisFeature === true ? setPomprehensive_performance_analysis('No') : setPomprehensive_performance_analysis('Yes');
    }
    const handleActionRecommendations = (e) => {
        _setRadioActionRecommendationsFeature(!_radioActionRecommendationsFeature)
        _radioActionRecommendationsFeature === true ? setAction_recomendations('No') : setAction_recomendations('Yes');
    }

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };



    const handleTeacherAccessAPI = () => {
        const formData = {
            data: {
                school_id: id,
                teacher_access: {
                    prequiz_targetlearning: prequiz_targetlearning,
                    postquiz_targetlearning: postquiz_targetlearning,
                    assessment_summary: assessment_summary,
                    chapterwise_performance: chapterwise_performance,
                    comprehensive_performance_analysis: comprehensive_performance_analysis,
                    action_recommendations: action_recomendations
                }
            }

        }

        axios.post(dynamicUrl.teacherAccess, formData, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
            .then((response) => {
                const result = response.data.Items;
                console.log('result', result);
                let modalstatusresult = response.status === 200;
                hideLoader();

                if (modalstatusresult) {

                    console.log('inside res edit');

                    if (response.status === 200) {

                        const MySwal = withReactContent(Swal);
                        MySwal.fire({
                            // title: MESSAGES.TTTLES.Goodjob,
                            type: 'success',
                            text: 'successfully updated',
                            icon: 'success',
                        }).then((willDelete) => {
                            window.location.reload();
                        });

                    } else {

                        // setStatus({ success: false });
                        // setErrors({ submit: 'Error in Editing School' });
                    }
                } else {

                    console.log('else res');

                    // setStatus({ success: false });
                    // setErrors({ submit: 'Error in Editing School' });
                }
            })
            .catch((err) => {
                console.log(err);
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
                        // setStatus({ success: false });
                        // setErrors({ submit: error.response.data });
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
    }


    const getSchoolData = () => {
        axios
            .post(dynamicUrl.fetchIndividualSchool,
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
                let result = response.status === 200;
                if (result) {
                    console.log('apidata', response.data.Items[0].teacher_access);
                    let teacherAccessData = response.data.Items[0].teacher_access
                    _setRadioPrequizTargetlearningFeature(teacherAccessData.prequiz_targetlearning === 'Yes' ? true : false)
                    _setRadioPostquizTargetlearningFeature(teacherAccessData.postquiz_targetlearning === 'Yes' ? true : false)
                    _setRadioAssesmentSummaryFeature(teacherAccessData.assessment_summary === 'Yes' ? true : false)
                    _setRadioChapterWisePerformanceFeature(teacherAccessData.chapterwise_performance === 'Yes' ? true : false)
                    _setRadioComprehensivePerformanceAnalysisFeature(teacherAccessData.comprehensive_performance_analysis === 'Yes' ? true : false)
                    _setRadioActionRecommendationsFeature(teacherAccessData.action_recommendations === 'Yes' ? true : false)
                } else {
                    console.log('else res');
                }

            })
            .catch((error) => {

            });
    }


    useEffect(() => {
        getSchoolData()
    }, [])

    return (

        <div>

            <>
                <Card>
                    <Card.Body>

                        <Formik
                            initialValues={{
                                submit: null
                            }}
                            
                        >
                            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                                <form noValidate onSubmit={handleSubmit} className={className} {...rest}>

                                    <br />

                                    <Row>
                                        <Col xs={6}>
                                            <Row>
                                                <Col>
                                                    <label className="floating-label">
                                                        <small className="text-danger"></small>
                                                        Target learning for Pre-quiz
                                                    </label>
                                                </Col>
                                                <Col xs={2}>
                                                    <div className="form-group fill">
                                                        <div className="row profile-view-radio-button-view">
                                                            <Form.Check
                                                                id={`radio-targetLearningPre`}
                                                                // label="Yes"
                                                                error={touched.recommendTeachersPre && errors.recommendTeachersPre}
                                                                type="switch"
                                                                variant={'outline-primary'}
                                                                name="radio-targetLearningPre"
                                                                checked={_radioPrequizTargetlearningFeature}
                                                                onChange={(e) => { handlePrequizTargetlearning(e) }}
                                                            />
                                                            <Form.Label className="profile-view-question" id={`radio-targetLearningPre`}>
                                                                {_radioPrequizTargetlearningFeature === true ? 'Yes' : 'No'}
                                                            </Form.Label>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Row>
                                                <Col>
                                                    <label className="floating-label">
                                                        <small className="text-danger"></small>
                                                        Target learning for Post-quiz
                                                    </label>
                                                </Col>
                                                <Col xs={2}>
                                                    <div className="form-group fill">
                                                        <div className="row profile-view-radio-button-view">
                                                            <Form.Check
                                                                id={`radio-targetLearningPost`}
                                                                // label="Yes"
                                                                error={touched.recommendTeachersPre && errors.recommendTeachersPre}
                                                                type="switch"
                                                                variant={'outline-primary'}
                                                                name="radio-targetLearningPost"
                                                                checked={_radioPostquizTargetlearningFeature}
                                                                onChange={(e) => { handlePostquizTargetlearning(e) }}
                                                            />
                                                            <Form.Label className="profile-view-question" id={`radio-targetLearningPost`}>
                                                                {_radioPostquizTargetlearningFeature === true ? 'Yes' : 'No'}
                                                            </Form.Label>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Row>
                                                <Col>
                                                    <label className="floating-label">
                                                        <small className="text-danger"></small>
                                                        Assesment Summary
                                                    </label>
                                                </Col>
                                                <Col xs={2}>
                                                    <div className="form-group fill">
                                                        <div className="row profile-view-radio-button-view">
                                                            <Form.Check
                                                                id={`radio-assesmentSummary`}
                                                                // label="Yes"
                                                                error={touched.recommendTeachersPre && errors.recommendTeachersPre}
                                                                type="switch"
                                                                variant={'outline-primary'}
                                                                name="radio-assesmentSummary"
                                                                checked={_radioAssesmentSummaryFeature}
                                                                onChange={(e) => { handleAssesmentSummary(e) }}
                                                            />
                                                            <Form.Label className="profile-view-question" id={`radio-assesmentSummary`}>
                                                                {_radioAssesmentSummaryFeature === true ? 'Yes' : 'No'}
                                                            </Form.Label>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Row>
                                                <Col>
                                                    <label className="floating-label">
                                                        <small className="text-danger"></small>
                                                        Chapter-wise Performance
                                                    </label>
                                                </Col>
                                                <Col xs={2}>
                                                    <div className="form-group fill">
                                                        <div className="row profile-view-radio-button-view">
                                                            <Form.Check
                                                                id={`radio-chapterWisePerformance`}
                                                                // label="Yes"
                                                                error={touched.recommendTeachersPre && errors.recommendTeachersPre}
                                                                type="switch"
                                                                variant={'outline-primary'}
                                                                name="radio-chapterWisePerformance"
                                                                checked={_radioChapterWisePerformanceFeature}
                                                                onChange={(e) => { handleChapterWisePerformance(e) }}
                                                            />
                                                            <Form.Label className="profile-view-question" id={`radio-chapterWisePerformance`}>
                                                                {_radioChapterWisePerformanceFeature === true ? 'Yes' : 'No'}
                                                            </Form.Label>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Row>
                                                <Col>
                                                    <label className="floating-label">
                                                        <small className="text-danger"></small>
                                                        Comprehensive Performance Analysis
                                                    </label>
                                                </Col>
                                                <Col xs={2}>
                                                    <div className="form-group fill">
                                                        <div className="row profile-view-radio-button-view">
                                                            <Form.Check
                                                                id={`radio-comprehensivePerformanceAnalysis`}
                                                                // label="Yes"
                                                                error={touched.recommendTeachersPre && errors.recommendTeachersPre}
                                                                type="switch"
                                                                variant={'outline-primary'}
                                                                name="radio-comprehensivePerformanceAnalysis"
                                                                checked={_radioComprehensivePerformanceAnalysisFeature}
                                                                onChange={(e) => { handleComprehensivePerformanceAnalysis(e) }}
                                                            />
                                                            <Form.Label className="profile-view-question" id={`radio-comprehensivePerformanceAnalysis`}>
                                                                {_radioComprehensivePerformanceAnalysisFeature === true ? 'Yes' : 'No'}
                                                            </Form.Label>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            <Row>
                                                <Col>
                                                    <label className="floating-label">
                                                        <small className="text-danger"></small>
                                                        Action And Recomendations
                                                    </label>
                                                </Col>
                                                <Col xs={2}>
                                                    <div className="form-group fill">
                                                        <div className="row profile-view-radio-button-view">
                                                            <Form.Check
                                                                id={`radio-actionAndRecomendations`}
                                                                // label="Yes"
                                                                error={touched.recommendTeachersPre && errors.recommendTeachersPre}
                                                                type="switch"
                                                                variant={'outline-primary'}
                                                                name="radio-actionAndRecomendations"
                                                                checked={_radioActionRecommendationsFeature}
                                                                onChange={(e) => { handleActionRecommendations(e) }}
                                                            />
                                                            <Form.Label className="profile-view-question" id={`radio-actionAndRecomendations`}>
                                                                {_radioActionRecommendationsFeature === true ? 'Yes' : 'No'}
                                                            </Form.Label>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {loader}
                                    <Row className="my-3">
                                        <Col> </Col>
                                        <Col> </Col>
                                        <Col xs={2}>
                                            <Button
                                                className="btn-block"
                                                color="success"
                                                size="small"
                                                type="submit"
                                                variant="success"
                                                onClick={() => { handleTeacherAccessAPI() }}
                                            >
                                                Submit
                                            </Button>
                                        </Col>
                                    </Row>
                                </form>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>
            </>
        </div>
    );
}

export default TeacherClassToggle