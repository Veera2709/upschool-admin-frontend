import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import dynamicUrl from "../../../../helper/dynamicUrls";
import MESSAGES from '../../../../helper/messages';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import * as Constants from '../../../../config/constant';
import BasicSpinner from '../../../../helper/BasicSpinner';

const QuizConfiguration = ({ className, rest, id }) => {

    let history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [previousDataPreQuiz, setPreviousDataPreQuiz] = useState([]);
    const [previousDataPostQuiz, setPreviousDataPostQuiz] = useState([]);
    const [_radioL2MandatoryPre, _setRadioL2MandatoryPre] = useState(false);
    const [_radioReadDigicardPre, _setRadioReadDigicardPre] = useState(false);
    const [_radioTopicSelection, _setRadioTopicSelection] = useState(false);
    const [_radioRecommendTeachersPre, _setRadioRecommendTeachersPre] = useState(true);

    const [_radioReadDigicardPost, _setRadioReadDigicardPost] = useState(false);
    const [_radioRecommendTeachersPost, _setRadioRecommendTeachersPost] = useState(false);

    const [selectedL2MandatoryPre, setSlectedL2MandatoryPre] = useState('No');
    const [selectedReadDigicardPre, setSlectedReadDigicardPre] = useState('No');
    const [selectedRecommendTeachersPre, setSlectedRecommendTeachersPre] = useState('No');
    const [selectedTopicSelection, setSlectedTopicSelection] = useState('No');

    const [selectedReadDigicardPost, setSlectedReadDigicardPost] = useState('No');
    const [selectedRecommendTeachersPost, setSlectedRecommendTeachersPost] = useState('No');

    const [selectedTestMode, SetSelectedTestMode] = useState()
    const [selectedTestType, SetSelectedTestType] = useState()

    const [isTestModeErr, setTestModeErr] = useState(false);
    const [isTestTypeErr, setTestTypeErr] = useState(false);

    const [ispreviousCommonData, setIsPreviousCommonData] = useState([])

    const [isTestMode, setIsTestMode] = useState([
        { value: 'Easy', label: 'Easy' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Hard', label: 'Hard' },
    ])

    const [isTestType, setIsTestType] = useState([
        { value: 'Automated', label: 'Automated' },
        { value: 'Express', label: 'Express' },
        { value: 'Manual', label: 'Manual' },
        { value: 'Default', label: 'Default' },
    ])

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const handleL2MandatoryPre = () => {

        _setRadioL2MandatoryPre(!_radioL2MandatoryPre);
        _radioL2MandatoryPre === true ? setSlectedL2MandatoryPre('No') : setSlectedL2MandatoryPre('Yes');
    }

    const handleTopicSelection = () => {

        _setRadioTopicSelection(!_radioTopicSelection);
        _radioTopicSelection === true ? setSlectedTopicSelection('No') : setSlectedTopicSelection('Yes');
    }

    const handleReadDigicardPre = (e) => {

        _setRadioReadDigicardPre(!_radioReadDigicardPre);
        _radioReadDigicardPre === true ? setSlectedReadDigicardPre('No') : setSlectedReadDigicardPre('Yes');
    }

    const handleReadDigicardPost = (e) => {

        _setRadioReadDigicardPost(!_radioReadDigicardPost);
        _radioReadDigicardPost === true ? setSlectedReadDigicardPost('No') : setSlectedReadDigicardPost('Yes');
    }

    const handleRecommendTeachersPre = (e) => {

        console.log("T");
        _setRadioRecommendTeachersPre(!_radioRecommendTeachersPre);
        _radioRecommendTeachersPre === true ? setSlectedRecommendTeachersPre('No') : setSlectedRecommendTeachersPre('Yes');
    }

    const handleRecommendTeachersPost = (e) => {

        _setRadioRecommendTeachersPost(!_radioRecommendTeachersPost);
        _radioRecommendTeachersPost === true ? setSlectedRecommendTeachersPost('No') : setSlectedRecommendTeachersPost('Yes');
    }


    const schemaValues = (_radioRecommendTeachersPost === false && _radioRecommendTeachersPre === true) ? {
        passPercentageL1Pre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        passPercentageL2Pre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!'),
        minStudentsPre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!'),
        noOfAttemptsPre: Yup.string()
            .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
            .required('Field is required/Invalid Number!'),
        passPercentageL1Post: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        percentageOfStudentsPre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        passPercentageL2Post: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        passPercentageL3Post: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        minStudentsPost: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!'),
        noOfAttemptsPost: Yup.string()
            .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
            .required('Field is required/Invalid Number!')
    } : (_radioRecommendTeachersPre === false && _radioRecommendTeachersPost === true) ? {
        passPercentageL1Pre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        passPercentageL2Pre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!'),
        minStudentsPre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!'),
        noOfAttemptsPre: Yup.string()
            .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
            .required('Field is required/Invalid Number!'),
        passPercentageL1Post: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        passPercentageL2Post: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        passPercentageL3Post: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        minStudentsPost: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!'),
        noOfAttemptsPost: Yup.string()
            .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
            .required('Field is required/Invalid Number!'),
        percentageOfStudentsPost: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
    } : (_radioRecommendTeachersPost === true && _radioRecommendTeachersPre === true) ? {
        passPercentageL1Pre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        passPercentageL2Pre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!'),
        minStudentsPre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!'),
        noOfAttemptsPre: Yup.string()
            .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
            .required('Field is required/Invalid Number!'),
        passPercentageL1Post: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        percentageOfStudentsPre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        passPercentageL2Post: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        passPercentageL3Post: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        minStudentsPost: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!'),
        noOfAttemptsPost: Yup.string()
            .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
            .required('Field is required/Invalid Number!'),
        percentageOfStudentsPost: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
    } : {
        passPercentageL1Pre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        passPercentageL2Pre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!'),
        minStudentsPre: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!'),
        noOfAttemptsPre: Yup.string()
            .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
            .required('Field is required/Invalid Number!'),
        passPercentageL1Post: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        passPercentageL2Post: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        passPercentageL3Post: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!')
            .min(1, 'Field is required!'),
        minStudentsPost: Yup.string()
            .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
            .required('Field is required/Invalid Percentage!'),
        noOfAttemptsPost: Yup.string()
            .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
            .required('Field is required/Invalid Number!'),
        min_no_of_questions: Yup.number()
            .required('Field is required!'),
    }

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
                console.log({ response });
                console.log(response.data.Items[0]);
                console.log(response.status === 200);
                let result = response.status === 200;
                hideLoader();
                if (result) {

                    console.log('inside res initial data', response.data);

                    let previousDataPreQuiz = response.data.Items[0].school_quiz_config.pre_learning;
                    let previousCommonData = response.data.Items[0].school_quiz_config;
                    let previousDataPostQuiz = response.data.Items[0].school_quiz_config.post_learning;
                    console.log(previousDataPreQuiz);
                    console.log("previousCommonData", previousCommonData);
                    console.log(previousDataPostQuiz.pass_pct_quiz_l3);
                    console.log(previousDataPostQuiz.pct_of_student_for_focus);

                    const radioValueL2MandatoryPre = previousDataPreQuiz.l2_mandatory === 'Yes' ? true : false;
                    const radioValueReadDigicardPre = previousDataPreQuiz.read_digicard_mandatory === 'Yes' ? true : false;
                    const radioValueRecommendTeachersPre = previousDataPreQuiz.recommend_teacher_on_focus_area === 'Yes' ? true : false;
                    const radioValueReadDigicardPost = previousDataPostQuiz.read_digicard_mandatory === 'Yes' ? true : false;
                    const radioValueRecommendTeachersPost = previousDataPostQuiz.recommend_teacher_on_focus_area === 'Yes' ? true : false;
                    const topicSelectionRadioValue = previousCommonData.topic_selection === 'Yes' ? true : false;


                    _setRadioTopicSelection(topicSelectionRadioValue)
                    _setRadioL2MandatoryPre(radioValueL2MandatoryPre);
                    _setRadioReadDigicardPre(radioValueReadDigicardPre);
                    _setRadioRecommendTeachersPre(radioValueRecommendTeachersPre);
                    _setRadioReadDigicardPost(radioValueReadDigicardPost);
                    _setRadioRecommendTeachersPost(radioValueRecommendTeachersPost);

                    setSlectedL2MandatoryPre(previousDataPreQuiz.l2_mandatory);
                    setSlectedReadDigicardPre(previousDataPreQuiz.read_digicard_mandatory);
                    setSlectedRecommendTeachersPre(previousDataPreQuiz.recommend_teacher_on_focus_area);

                    setSlectedReadDigicardPost(previousDataPostQuiz.read_digicard_mandatory);
                    setSlectedRecommendTeachersPost(previousDataPostQuiz.recommend_teacher_on_focus_area);


                    SetSelectedTestMode(previousCommonData.test_mode);
                    SetSelectedTestType(previousCommonData.test_type);
                    setSlectedTopicSelection(previousCommonData.topic_selection);

                    setIsPreviousCommonData(previousCommonData)
                    setPreviousDataPreQuiz(previousDataPreQuiz);
                    setPreviousDataPostQuiz(previousDataPostQuiz);
                    setIsLoading(false);
                } else {
                    console.log('else res');
                    hideLoader();
                    // Request made and server responded
                    // setStatus({ success: false });
                    // setErrors({ submit: 'Error in generating OTP' });
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
                    }
                    // setStatus({ success: false });
                    // setErrors({ submit: error.response.data });
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                    hideLoader();
                    setIsLoading(false);
                } else {
                    // Something happened in setting up the request that triggered an Error
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

                                    <Formik
                                        initialValues={{
                                            passPercentageL1Pre: previousDataPreQuiz.pass_pct_quiz_l1 === '' ? '' : previousDataPreQuiz.pass_pct_quiz_l1,
                                            passPercentageL2Pre: previousDataPreQuiz.pass_pct_quiz_l2 === '' ? '' : previousDataPreQuiz.pass_pct_quiz_l2,
                                            minStudentsPre: previousDataPreQuiz.pct_of_student_for_reteach === '' ? '' : previousDataPreQuiz.pct_of_student_for_reteach,
                                            noOfAttemptsPre: previousDataPreQuiz.no_of_attempt_to_unlock === '' ? '' : previousDataPreQuiz.no_of_attempt_to_unlock,
                                            percentageOfStudentsPre: previousDataPreQuiz.pct_of_student_for_focus === '' ? '' : previousDataPreQuiz.pct_of_student_for_focus,
                                            passPercentageL1Post: previousDataPostQuiz.pass_pct_quiz_l1 === '' ? '' : previousDataPostQuiz.pass_pct_quiz_l1,
                                            passPercentageL2Post: previousDataPostQuiz.pass_pct_quiz_l2 === '' ? '' : previousDataPostQuiz.pass_pct_quiz_l2,
                                            passPercentageL3Post: previousDataPostQuiz.pass_pct_quiz_l3 === '' ? '' : previousDataPostQuiz.pass_pct_quiz_l3,
                                            minStudentsPost: previousDataPostQuiz.pct_of_student_for_reteach === '' ? '' : previousDataPostQuiz.pct_of_student_for_reteach,
                                            noOfAttemptsPost: previousDataPostQuiz.no_of_attempt_to_unlock === '' ? '' : previousDataPostQuiz.no_of_attempt_to_unlock,
                                            percentageOfStudentsPost: previousDataPostQuiz.pct_of_student_for_focus === '' ? '' : previousDataPostQuiz.pct_of_student_for_focus,
                                            submit: null,
                                            min_no_of_questions: ispreviousCommonData.min_no_of_questions === '' ? '' : ispreviousCommonData.min_no_of_questions
                                        }}
                                        validationSchema={Yup.object().shape(schemaValues)}
                                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                            setStatus({ success: true });
                                            setSubmitting(true);

                                            if (selectedTestMode === '' || selectedTestMode === undefined || selectedTestMode === null|| selectedTestMode === 'Select...') {
                                                setTestModeErr(true)
                                            } else if (selectedTestType === '' || selectedTestType === undefined || selectedTestType === null|| selectedTestType === 'Select...') {
                                                setTestTypeErr(true)
                                            } else {
                                                const formData = {
                                                    data: {
                                                        school_id: id,
                                                        school_quiz_config: {
                                                            pre_learning: {
                                                                pass_pct_quiz_l1: values.passPercentageL1Pre,
                                                                pass_pct_quiz_l2: values.passPercentageL2Pre,
                                                                pct_of_student_for_reteach: values.minStudentsPre,
                                                                no_of_attempt_to_unlock: values.noOfAttemptsPre,
                                                                l2_mandatory: selectedL2MandatoryPre,
                                                                read_digicard_mandatory: selectedReadDigicardPre,
                                                                recommend_teacher_on_focus_area: selectedRecommendTeachersPre,
                                                                pct_of_student_for_focus: selectedRecommendTeachersPre === 'Yes' ? values.percentageOfStudentsPre : '',
                                                            },
                                                            post_learning: {
                                                                pass_pct_quiz_l1: values.passPercentageL1Post,
                                                                pass_pct_quiz_l2: values.passPercentageL2Post,
                                                                pass_pct_quiz_l3: values.passPercentageL3Post,
                                                                pct_of_student_for_reteach: values.minStudentsPost,
                                                                no_of_attempt_to_unlock: values.noOfAttemptsPost,
                                                                read_digicard_mandatory: selectedReadDigicardPost,
                                                                recommend_teacher_on_focus_area: selectedRecommendTeachersPost,
                                                                pct_of_student_for_focus: selectedRecommendTeachersPost === 'Yes' ? values.percentageOfStudentsPost : '',
                                                            },
                                                            test_mode: selectedTestMode,
                                                            min_no_of_questions: values.min_no_of_questions,
                                                            test_type: selectedTestType,
                                                            topic_selection: selectedTopicSelection
                                                        }
                                                    }
                                                }

                                                console.log(formData);

                                                axios
                                                    .post(
                                                        dynamicUrl.setQuizConfiguration,
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
                                                                    text: MESSAGES.SUCCESS.UpdatingQuizConfiguration,
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
                                            }




                                        }}
                                    >
                                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                                            <form noValidate onSubmit={handleSubmit} className={className} {...rest}>

                                                <Card.Title>
                                                    Common
                                                </Card.Title>
                                                <hr />
                                                <Row>
                                                    <Col>
                                                        <div className="form-group fill">
                                                            <label className="floating-label" >
                                                                <small className="text-danger">* </small>
                                                                Test Mode
                                                            </label>
                                                            <select
                                                                className="form-control"

                                                                name="test_mode"
                                                                onBlur={handleBlur}
                                                                type="text"
                                                                value={selectedTestMode}
                                                                onChange={(e) => {
                                                                    SetSelectedTestMode(e.target.value);
                                                                    setTestModeErr(false);
                                                                }}
                                                            >
                                                                <option>
                                                                    Select...
                                                                </option>
                                                                {isTestMode.map((optionsData) => {

                                                                    return <option
                                                                        value={optionsData.value}
                                                                        key={optionsData.value}
                                                                    >
                                                                        {optionsData.value}
                                                                    </option>
                                                                })}
                                                            </select>
                                                        </div>
                                                        {isTestModeErr && (
                                                            <small style={{ color: 'red' }}>Field is required!</small>
                                                        )}
                                                    </Col>
                                                    <Col>
                                                        <div className="form-group fill">
                                                            <label className="floating-label" >
                                                                <small className="text-danger">* </small>
                                                                Test Type
                                                            </label>
                                                            <select
                                                                className="form-control"
                                                                error={touched.test_type && errors.test_type}
                                                                name="test_type"
                                                                onBlur={handleBlur}
                                                                type="text"
                                                                value={selectedTestType}
                                                                onChange={(e) => {
                                                                    SetSelectedTestType(e.target.value);
                                                                    setTestTypeErr(false)
                                                                }}
                                                            >
                                                                <option>
                                                                    Select...
                                                                </option>
                                                                {isTestType.map((optionsData) => {

                                                                    return <option
                                                                        value={optionsData.value}
                                                                        key={optionsData.value}
                                                                    >
                                                                        {optionsData.value}
                                                                    </option>
                                                                })}
                                                            </select>
                                                        </div>
                                                        {isTestTypeErr && (
                                                            <small style={{ color: 'red' }}>Field is required!</small>
                                                        )}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Minimum Number Of Questions
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            error={touched.min_no_of_questions && errors.min_no_of_questions}
                                                            label="min_no_of_questions"
                                                            name="min_no_of_questions"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            type="number"
                                                            value={values.min_no_of_questions}
                                                            placeholder="Minimum Number Of Questions"
                                                        />
                                                        {touched.min_no_of_questions && errors.min_no_of_questions && <small className="text-danger form-text">{errors.min_no_of_questions}</small>}

                                                    </Col>
                                                    <Col style={{ display: 'flex', gap: '55px', marginTop: 'auto' }}>
                                                        <label className="floating-label">
                                                            <small className="text-danger"></small>Topic Selection?
                                                        </label>
                                                        <div className="row profile-view-radio-button-view">
                                                            <Form.Check
                                                                id={`radio-Topic_selection`}
                                                                // label="Yes"
                                                                error={touched.Topic_selection && errors.Topic_selection}
                                                                type="switch"
                                                                variant={'outline-primary'}
                                                                name="radio-Topic_selection"
                                                                checked={_radioTopicSelection}
                                                                onChange={() => handleTopicSelection()}
                                                            // className='ml-3 col-md-6'
                                                            />
                                                            <Form.Label className="profile-view-question" id={`radio-Topic_selection`}>
                                                                {_radioTopicSelection === true ? 'Yes' : 'No'}
                                                            </Form.Label>
                                                        </div>

                                                    </Col>
                                                </Row>
                                                <br />
                                                <Card.Title>
                                                    Pre-level
                                                </Card.Title>
                                                <hr />
                                                <Row>
                                                    <Col>
                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Pass Percentage for Quiz Level -1
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            error={touched.passPercentageL1Pre && errors.passPercentageL1Pre}
                                                            label="passPercentageL1Pre"
                                                            name="passPercentageL1Pre"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            type="number"
                                                            value={values.passPercentageL1Pre}
                                                        // placeholder="To clear the Quiz"
                                                        />

                                                        {touched.passPercentageL1Pre && errors.passPercentageL1Pre && <small className="text-danger form-text">{errors.passPercentageL1Pre}</small>}
                                                    </Col>

                                                    <Col>
                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Pass Percentage for Quiz Level -2
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            error={touched.passPercentageL2Pre && errors.passPercentageL2Pre}
                                                            label="passPercentageL2Pre"
                                                            name="passPercentageL2Pre"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            type="number"
                                                            value={values.passPercentageL2Pre}
                                                        // placeholder="To clear the Quiz"
                                                        />

                                                        {touched.passPercentageL2Pre && errors.passPercentageL2Pre && <small className="text-danger form-text">{errors.passPercentageL2Pre}</small>}
                                                    </Col>

                                                </Row>

                                                <br />
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
                                                                    value={values.minStudentsPre}
                                                                // placeholder="To clear the Quiz"
                                                                />
                                                                {touched.minStudentsPre && errors.minStudentsPre && <small className="text-danger form-text">{errors.minStudentsPre}</small>}
                                                            </div>
                                                        </OverlayTrigger>

                                                    </Col>
                                                    <Col>

                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                                <Tooltip id={`tooltip-top`}
                                                                    style={{ zIndex: 1151, fontSize: '10px' }}
                                                                >
                                                                    After unlocking from Need Attention
                                                                </Tooltip>}>
                                                            <div className="form-group fill">

                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>
                                                                    No. of attempts
                                                                </label>

                                                                <input
                                                                    className="form-control"
                                                                    error={touched.noOfAttemptsPre && errors.noOfAttemptsPre}
                                                                    label="noOfAttemptsPre"
                                                                    name="noOfAttemptsPre"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    type="number"
                                                                    // placeholder="After unlocking from Need Attention"
                                                                    value={values.noOfAttemptsPre}
                                                                />

                                                                {touched.noOfAttemptsPre && errors.noOfAttemptsPre && <small className="text-danger form-text">{errors.noOfAttemptsPre}</small>}
                                                            </div>
                                                        </OverlayTrigger>

                                                    </Col>
                                                </Row>

                                                <br />
                                                <Row>
                                                    <Col xs={6}>
                                                        <Row>
                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>Is Level 2 Mandatory?
                                                                </label>
                                                            </Col>
                                                            <Col xs={3}>
                                                                <div className="row profile-view-radio-button-view">
                                                                    <Form.Check
                                                                        id={`radio-l2Mandatory`}
                                                                        // label="Yes"
                                                                        error={touched.l2Mandatory && errors.l2Mandatory}
                                                                        type="switch"
                                                                        variant={'outline-primary'}
                                                                        name="radio-l2Mandatory"
                                                                        checked={_radioL2MandatoryPre}
                                                                        onChange={() => handleL2MandatoryPre()}
                                                                    // className='ml-3 col-md-6'
                                                                    />
                                                                    <Form.Label className="profile-view-question" id={`radio-l2Mandatory`}>
                                                                        {_radioL2MandatoryPre === true ? 'Yes' : 'No'}
                                                                    </Form.Label>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                    <Col xs={6}>
                                                        <Row>
                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>Is reading a Digicard Mandatory?
                                                                </label>
                                                            </Col>
                                                            <Col xs={3}>
                                                                <div className="row profile-view-radio-button-view">
                                                                    <Form.Check
                                                                        id={`radio-readDigicardPre`}
                                                                        // label="Yes"
                                                                        error={touched.readDigicardPre && errors.readDigicardPre}
                                                                        type="switch"
                                                                        variant={'outline-primary'}
                                                                        name="radio-readDigicardPre"
                                                                        checked={_radioReadDigicardPre}
                                                                        onChange={(e) => handleReadDigicardPre(e)}
                                                                    // className='ml-3 col-md-6'
                                                                    />
                                                                    <Form.Label className="profile-view-question" id={`radio-readDigicardPre`}>
                                                                        {_radioReadDigicardPre === true ? 'Yes' : 'No'}
                                                                    </Form.Label>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Col>


                                                </Row>

                                                <br />
                                                <Row>
                                                    <Col xs={6}>

                                                        {/* <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                                <Tooltip id={`tooltip-top`}
                                                                    style={{ zIndex: 1151, fontSize: '10px' }}
                                                                >
                                                                    Based on classroom pre assesement results
                                                                </Tooltip>}> */}
                                                        <Row>
                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>Recommend teachers on focus areas?
                                                                </label>
                                                            </Col>
                                                            <Col xs={3}>
                                                                <div className="row profile-view-radio-button-view">
                                                                    <Form.Check
                                                                        id={`radio-recommendTeachersPre1`}
                                                                        error={touched.recommendTeachersPre && errors.recommendTeachersPre}
                                                                        type="switch"
                                                                        variant={'outline-primary'}
                                                                        name="radio-recommendTeachersPre1"
                                                                        checked={_radioRecommendTeachersPre}
                                                                        onChange={(e) => {
                                                                            setFieldValue('percentageOfStudentsPre', '');
                                                                            handleRecommendTeachersPre(e);
                                                                        }}
                                                                    />
                                                                    <Form.Label className="profile-view-question" id={`radio-recommendTeachersPre1`}>
                                                                        {_radioRecommendTeachersPre === true ? 'Yes' : 'No'}
                                                                    </Form.Label>
                                                                </div>
                                                            </Col>


                                                        </Row>
                                                        {/* </OverlayTrigger> */}

                                                    </Col>
                                                </Row>

                                                <br />
                                                <Row>
                                                    <Col xs={6}>
                                                        {
                                                            _radioRecommendTeachersPre === true && (
                                                                <Row>
                                                                    <Col>

                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            overlay={
                                                                                <Tooltip id={`tooltip-top`}
                                                                                    style={{ zIndex: 1151, fontSize: '10px' }}
                                                                                >
                                                                                    For generating focus points of Concepts in reports based on classroom pre-assesement results
                                                                                </Tooltip>}>
                                                                            <div className="form-group fill">

                                                                                <label className="floating-label">
                                                                                    <small className="text-danger">* </small>Percentage of Students
                                                                                </label>

                                                                                <input
                                                                                    className="form-control"
                                                                                    error={touched.percentageOfStudentsPre && errors.percentageOfStudentsPre}
                                                                                    label="percentageOfStudentsPre"
                                                                                    name="percentageOfStudentsPre"
                                                                                    onBlur={handleBlur}
                                                                                    onChange={handleChange}
                                                                                    type="number"
                                                                                    // placeholder="After unlocking from Need Attention"
                                                                                    value={values.percentageOfStudentsPre}
                                                                                />

                                                                                {touched.percentageOfStudentsPre && errors.percentageOfStudentsPre && <small className="text-danger form-text">{errors.percentageOfStudentsPre}</small>}

                                                                            </div>
                                                                        </OverlayTrigger>


                                                                    </Col>
                                                                </Row>
                                                            )}
                                                    </Col>
                                                </Row>

                                                <br />
                                                <Card.Title>
                                                    Post-level
                                                </Card.Title>
                                                <hr />

                                                <Row>
                                                    <Col>
                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Pass Percentage for Quiz Level -1
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            error={touched.passPercentageL1Post && errors.passPercentageL1Post}
                                                            label="passPercentageL1Post"
                                                            name="passPercentageL1Post"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            type="number"
                                                            value={values.passPercentageL1Post}
                                                        // placeholder="To clear the Quiz"
                                                        />

                                                        {touched.passPercentageL1Post && errors.passPercentageL1Post && <small className="text-danger form-text">{errors.passPercentageL1Post}</small>}
                                                    </Col>

                                                    <Col>
                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Pass Percentage for Quiz Level -2
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            error={touched.passPercentageL2Post && errors.passPercentageL2Post}
                                                            label="passPercentageL2Post"
                                                            name="passPercentageL2Post"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            type="number"
                                                            value={values.passPercentageL2Post}
                                                        // placeholder="To clear the Quiz"
                                                        />

                                                        {touched.passPercentageL2Post && errors.passPercentageL2Post && <small className="text-danger form-text">{errors.passPercentageL2Post}</small>}
                                                    </Col>

                                                </Row>

                                                <br />
                                                <Row>
                                                    <Col xs={6}>
                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Pass Percentage for Quiz Level -3
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            error={touched.passPercentageL3Post && errors.passPercentageL3Post}
                                                            label="passPercentageL3Post"
                                                            name="passPercentageL3Post"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            type="number"
                                                            value={values.passPercentageL3Post}
                                                        // placeholder="To clear the Quiz"
                                                        />

                                                        {touched.passPercentageL3Post && errors.passPercentageL3Post && <small className="text-danger form-text">{errors.passPercentageL3Post}</small>}
                                                    </Col>

                                                    <Col xs={6}>

                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                                <Tooltip id={`tooltip-top`}
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
                                                                    error={touched.minStudentsPost && errors.minStudentsPost}
                                                                    label="minStudentsPost"
                                                                    name="minStudentsPost"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    type="number"
                                                                    value={values.minStudentsPost}
                                                                // placeholder="To clear the Quiz"
                                                                />

                                                                {touched.minStudentsPost && errors.minStudentsPost && <small className="text-danger form-text">{errors.minStudentsPost}</small>}

                                                            </div>
                                                        </OverlayTrigger>
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>

                                                    <Col xs={6}>

                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                                <Tooltip id={`tooltip-top`}
                                                                    style={{ zIndex: 1151, fontSize: '10px' }}
                                                                >
                                                                    After unlocking from Need Attention
                                                                </Tooltip>}>
                                                            <div className="form-group fill">

                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>
                                                                    No. of attempts
                                                                </label>

                                                                <input
                                                                    className="form-control"
                                                                    error={touched.noOfAttemptsPost && errors.noOfAttemptsPost}
                                                                    label="noOfAttemptsPost"
                                                                    name="noOfAttemptsPost"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    type="number"
                                                                    // placeholder="After unlocking from Need Attention"
                                                                    value={values.noOfAttemptsPost}
                                                                />

                                                                {touched.noOfAttemptsPost && errors.noOfAttemptsPost && <small className="text-danger form-text">{errors.noOfAttemptsPost}</small>}
                                                            </div>
                                                        </OverlayTrigger>


                                                    </Col>

                                                </Row>

                                                <br />
                                                <Row>

                                                    <Col xs={6}>
                                                        <Row >
                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>Is reading a Digicard Mandatory?
                                                                </label>
                                                            </Col>
                                                            <Col xs={3}>
                                                                <div className="row profile-view-radio-button-view">
                                                                    <Form.Check
                                                                        id={`radio-readDigicardPost`}
                                                                        // label="Yes"
                                                                        error={touched.readDigicardPost && errors.readDigicardPost}
                                                                        type="switch"
                                                                        variant={'outline-primary'}
                                                                        name="radio-readDigicardPost"
                                                                        checked={_radioReadDigicardPost}
                                                                        onChange={(e) => handleReadDigicardPost(e)}
                                                                    // className='ml-3 col-md-6'
                                                                    />
                                                                    <Form.Label className="profile-view-question" id={`radio-readDigicardPost`}>
                                                                        {_radioReadDigicardPost === true ? 'Yes' : 'No'}
                                                                    </Form.Label>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                    <Col xs={6}>

                                                        {/* <OverlayTrigger
                                                            placement="top"
                                                            overlay={
                                                                <Tooltip id={`tooltip-top`}
                                                                    style={{ zIndex: 1151, fontSize: '10px' }}
                                                                >
                                                                    Based on classroom post-assesement results
                                                                </Tooltip>}> */}

                                                        <Row>
                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>Recommend teachers on focus areas?
                                                                </label>
                                                            </Col>
                                                            <Col xs={3}>
                                                                <div className="row profile-view-radio-button-view">
                                                                    <Form.Check
                                                                        id={`radio-recommendTeachersPost`}
                                                                        // label="Yes"
                                                                        error={touched.recommendTeachersPost && errors.recommendTeachersPost}
                                                                        type="switch"
                                                                        variant={'outline-primary'}
                                                                        name="radio-recommendTeachersPost"
                                                                        checked={_radioRecommendTeachersPost}
                                                                        onChange={(e) => {
                                                                            setFieldValue('percentageOfStudentsPost', "");
                                                                            handleRecommendTeachersPost(e);
                                                                        }}
                                                                    // className='ml-3 col-md-6'
                                                                    />
                                                                    <Form.Label className="profile-view-question" id={`radio-recommendTeachersPost`}>
                                                                        {_radioRecommendTeachersPost === true ? 'Yes' : 'No'}
                                                                    </Form.Label>
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        {/* </OverlayTrigger> */}


                                                    </Col>
                                                </Row>

                                                <br />
                                                <Row>
                                                    <Col xs={6}></Col>
                                                    <Col xs={6}>
                                                        {
                                                            _radioRecommendTeachersPost === true && (
                                                                <Row>

                                                                    <OverlayTrigger
                                                                        placement="top"
                                                                        overlay={
                                                                            <Tooltip
                                                                                id={`tooltip-top`}
                                                                                style={{ zIndex: 1151, fontSize: '10px' }}
                                                                            >
                                                                                For generating focus points of Concepts in reports based on classroom post-assesement results
                                                                            </Tooltip>}>

                                                                        <Col>
                                                                            <label className="floating-label">
                                                                                <small className="text-danger">* </small>Percentage of Students
                                                                            </label>

                                                                            <input
                                                                                className="form-control"
                                                                                error={touched.percentageOfStudentsPost && errors.percentageOfStudentsPost}
                                                                                label="percentageOfStudentsPost"
                                                                                name="percentageOfStudentsPost"
                                                                                onBlur={handleBlur}
                                                                                onChange={handleChange}
                                                                                type="number"
                                                                                // placeholder="After unlocking from Need Attention"
                                                                                value={values.percentageOfStudentsPost}
                                                                            />

                                                                            {touched.percentageOfStudentsPost && errors.percentageOfStudentsPost && <small className="text-danger form-text">{errors.percentageOfStudentsPost}</small>}
                                                                        </Col>
                                                                    </OverlayTrigger>
                                                                </Row>
                                                            )}
                                                    </Col>
                                                </Row>

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
        </div>


    );

}

export default QuizConfiguration