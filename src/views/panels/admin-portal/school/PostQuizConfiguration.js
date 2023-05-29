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
import { commonValidationPost, AutomateValidation, ManulExpress, AutomateExpress, focusAreasAutomate, focusAreasManual, focusAreasAutomateExpress } from "./validation";

const PostQuizConfiguration = ({ className, rest, id }) => {

    let history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [previousDataPreQuiz, setPreviousDataPreQuiz] = useState([]);
    const [paperMatrixBasic, setPaperMatrixBasic] = useState();
    const [paperMatrixIntermediate, setPaperMatrixIntermediate] = useState();
    const [paperMatrixAdvanced, setPaperMatrixAdvanced] = useState();
    const [_radioL2MandatoryPre, _setRadioL2MandatoryPre] = useState(false);
    const [_radioReadDigicardPre, _setRadioReadDigicardPre] = useState(false);
    const [_radioTopicSelection, _setRadioTopicSelection] = useState(false);
    const [_radioRecommendTeachersPre, _setRadioRecommendTeachersPre] = useState(false);

    const [_radioAutomate, _setRadioAutomate] = useState(false);
    const [_radioExpress, _setRadioExpress] = useState(false);
    const [_radioManual, _setRadioManual] = useState(false);
    const [_radioConceptCompulsorialy, _setConceptCompulsorialy] = useState(false);
    const [_radioOnlineTest, _setOnlineTest] = useState(false);
    const [_radioPaperBased, _setPaperBased] = useState(false);
    const [_radioUnlockDigicard, _setRadioUnlockDigicard] = useState(false);
    const [_radioRandomizedQuestions, _setRadioRandomizedQuestions] = useState(false);
    const [_radioRandomizedOrder, _setRadioRandomizedOrder] = useState(false);
    const [_radioPermitChooseTopic, _setRadioPermitChooseTopic] = useState(false);

    const [radioAutomateSelected, setRadioAutomateSelected] = useState('Disabled');
    const [radioExpressSelected, setRadioExpressSelected] = useState('Disabled');
    const [radioManualSelected, setRadioManualSelected] = useState('Disabled');

    const [ConceptCompulsorialySelected, setConceptCompulsorialySelected] = useState('No');

    const [radioOnlineTestSelected, setRadioOnlineTestSelected] = useState('Disabled');
    const [radioPaperBasedSelected, setRadioPaperBasedSelected] = useState('Disabled');

    const [radioUnlockDigicardSelected, setRadioUnlockDigicardSelected] = useState('No');
    const [radioRandomizedQuestionsSelected, setRadioRandomizedQuestionsSelected] = useState('Disabled');
    const [radioRandomizedOrdersSelected, setRadioRandomizedOrderSelected] = useState('Disabled');

    const [_radioReadDigicardPost, _setRadioReadDigicardPost] = useState(false);
    const [_radioRecommendTeachersPost, _setRadioRecommendTeachersPost] = useState(false);

    const [selectedL2MandatoryPre, setSlectedL2MandatoryPre] = useState('No');
    const [selectedReadDigicardPre, setSlectedReadDigicardPre] = useState('No');
    const [selectedRecommendTeachersPre, setSlectedRecommendTeachersPre] = useState('No');
    const [selectedTopicSelection, setSlectedTopicSelection] = useState('No');
    const [permitTopicChoose, setPermitTopicChoose] = useState('No');

    const [selectedReadDigicardPost, setSlectedReadDigicardPost] = useState('No');
    const [selectedRecommendTeachersPost, setSlectedRecommendTeachersPost] = useState('No');

    const [selectedTestMode, SetSelectedTestMode] = useState()
    const [selectedTestType, SetSelectedTestType] = useState()

    const [isTestModeErr, setTestModeErr] = useState(false);
    const [isTestTypeErr, setTestTypeErr] = useState(false);

    const [noOptionInTestMode, setNoOptionInTestMode] = useState(false)
    const [automateErr, setAutomateErr] = useState(false)
    const [expManualErr, setExpManualErr] = useState(false)
    const [onlineErr, setOnlineErr] = useState(false)
    const [varientErr, setVarientErr] = useState(false)
    const [noOdrderQuizErr, setNoOdrderQuizErr] = useState(false)
    const [matrixCountErr, setMatrixCountErr] = useState(false)


    const [focusAreaErr, setFocusAreaErr] = useState(false);

    const [ispreviousCommonData, setIsPreviousCommonData] = useState([])

    const [isTestMode, setIsTestMode] = useState([
        { value: 'Less Difficult', label: 'Less Difficult' },
        { value: 'Moderatly Difficult', label: 'Moderatly Difficult' },
        { value: 'Highly Difficult', label: 'Highly Difficult' },
    ])



    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };



    const handleTopicSelection = () => {
        _setRadioTopicSelection(!_radioTopicSelection);
        _radioTopicSelection === true ? setSlectedTopicSelection('No') : setSlectedTopicSelection('Yes');
    }

    const handlePermitTopic = () => {
        _setRadioPermitChooseTopic(!_radioPermitChooseTopic);
        _radioPermitChooseTopic === true ? setPermitTopicChoose('No') : setPermitTopicChoose('Yes');
    }

    const handleReadDigicardPre = (e) => {
        _setRadioReadDigicardPre(!_radioReadDigicardPre);
        _radioReadDigicardPre === true ? setSlectedReadDigicardPre('No') : setSlectedReadDigicardPre('Yes');
    }

    const handleAutomate = (e) => {
        _setRadioAutomate(!_radioAutomate);
        _radioAutomate === true ? setRadioAutomateSelected('Disabled') : setRadioAutomateSelected('Enabled');
    }

    const handleExpress = (e) => {
        _setRadioExpress(!_radioExpress);
        _radioExpress === true ? setRadioExpressSelected('Disabled') : setRadioExpressSelected('Enabled');
    }

    const handleManual = (e) => {
        _setRadioManual(!_radioManual);
        _radioManual === true ? setRadioManualSelected('Disabled') : setRadioManualSelected('Enabled');
    }

    const handleconceptCompulsorialy = (e) => {
        _setConceptCompulsorialy(!_radioConceptCompulsorialy);
        _radioConceptCompulsorialy === true ? setConceptCompulsorialySelected('No') : setConceptCompulsorialySelected('Yes');
    }

    const handleOnlineTest = (e) => {
        _setOnlineTest(!_radioOnlineTest);
        _radioOnlineTest === true ? setRadioOnlineTestSelected('Disabled') : setRadioOnlineTestSelected('Enabled');
    }

    const handlePaperBased = (e) => {
        _setPaperBased(!_radioPaperBased);
        _radioPaperBased === true ? setRadioPaperBasedSelected('Disabled') : setRadioPaperBasedSelected('Enabled');
    }

    const handleUnlockDigicard = (e) => {
        _setRadioUnlockDigicard(!_radioUnlockDigicard);
        _radioUnlockDigicard === true ? setRadioUnlockDigicardSelected('No') : setRadioUnlockDigicardSelected('Yes');
    }

    const handleRecommendTeachersPre = (e) => {
        _setRadioRecommendTeachersPre(!_radioRecommendTeachersPre);
        _radioRecommendTeachersPre === true ? setSlectedRecommendTeachersPre('No') : setSlectedRecommendTeachersPre('Yes');
    }

    const handleRandomizedQuestions = (e) => {
        _setRadioRandomizedQuestions(!_radioRandomizedQuestions);
        _radioRandomizedQuestions === true ? setRadioRandomizedQuestionsSelected('Disabled') : setRadioRandomizedQuestionsSelected('Enabled');
    }

    const handleRandomizedOrder = (e) => {
        _setRadioRandomizedOrder(!_radioRandomizedOrder);
        _radioRandomizedOrder === true ? setRadioRandomizedOrderSelected('Disabled') : setRadioRandomizedOrderSelected('Enabled');
    }

    const validateValue = (e) => {
        console.log("validateValue",);
        if (e.target.value <= 0) {
            setNoOdrderQuizErr(true)
        } else {
            setNoOdrderQuizErr(false)
        }
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

                    console.log('post quiz configuration', response.data.Items[0].post_quiz_config);

                    let previousDataPreQuiz = response.data.Items[0].post_quiz_config;

                    console.log(previousDataPreQuiz);


                    const radioValueReadDigicardPre = previousDataPreQuiz.read_digicard_mandatory === 'Yes' ? true : false;
                    const radioValueRecommendTeachersPre = previousDataPreQuiz.recommend_teacher_on_focus_area === 'Yes' ? true : false;
                    const topicSelectionRadioValue = previousDataPreQuiz.topic_archive === 'Yes' ? true : false;
                    const unlockDigicard = previousDataPreQuiz.unlock_digicard_mandatory === 'Yes' ? true : false;


                    _setRadioReadDigicardPre(radioValueReadDigicardPre);
                    _setRadioTopicSelection(topicSelectionRadioValue);
                    _setRadioRecommendTeachersPre(radioValueRecommendTeachersPre);
                    _setRadioUnlockDigicard(unlockDigicard);

                    setSlectedReadDigicardPre(previousDataPreQuiz.read_digicard_mandatory);
                    setSlectedRecommendTeachersPre(previousDataPreQuiz.recommend_teacher_on_focus_area);
                    setSlectedTopicSelection(previousDataPreQuiz.topic_archive);
                    setRadioUnlockDigicardSelected(previousDataPreQuiz.unlock_digicard_mandatory);

                    //test mode
                    const onlineTest = previousDataPreQuiz.online_mode === "Enabled" ? true : false;
                    const offlineTest = previousDataPreQuiz.offline_mode === "Enabled" ? true : false;

                    _setOnlineTest(onlineTest);
                    _setPaperBased(offlineTest);

                    setRadioOnlineTestSelected(previousDataPreQuiz.online_mode);
                    setRadioPaperBasedSelected(previousDataPreQuiz.offline_mode);

                    //testMode
                    const automateType = previousDataPreQuiz.automated_type === "Enabled" ? true : false;
                    const expressType = previousDataPreQuiz.express_type === "Enabled" ? true : false;
                    const manualType = previousDataPreQuiz.manual_type === "Enabled" ? true : false;

                    _setRadioAutomate(automateType);
                    _setRadioExpress(expressType);
                    _setRadioManual(manualType)

                    setRadioAutomateSelected(previousDataPreQuiz.automated_type);
                    setRadioExpressSelected(previousDataPreQuiz.express_type);
                    setRadioManualSelected(previousDataPreQuiz.manual_type);

                    //test Difficult
                    SetSelectedTestMode(previousDataPreQuiz.test_level)

                    //Paper Varients
                    const questionVarient = previousDataPreQuiz.randomized_questions_varient === "Enabled" ? true : false;
                    const orderVarient = previousDataPreQuiz.randomized_order_varient === "Enabled" ? true : false;

                    _setRadioRandomizedQuestions(questionVarient);
                    _setRadioRandomizedOrder(orderVarient);

                    setRadioRandomizedQuestionsSelected(previousDataPreQuiz.randomized_questions_varient);
                    setRadioRandomizedOrderSelected(previousDataPreQuiz.randomized_order_varient);


                    //Matrix
                    setPreviousDataPreQuiz(previousDataPreQuiz);
                    setPaperMatrixBasic(previousDataPreQuiz.test_matrix.Basic)
                    setPaperMatrixIntermediate(previousDataPreQuiz.test_matrix.Intermediate)
                    setPaperMatrixAdvanced(previousDataPreQuiz.test_matrix.Advanced)

                    //Concept Compulsorialy
                    const conceptCompulsorialy = previousDataPreQuiz.concept_mandatory === 'Yes' ? true : false;
                    _setConceptCompulsorialy(conceptCompulsorialy)
                    setConceptCompulsorialySelected(previousDataPreQuiz.concept_mandatory)

                    //permit topic
                    var permitTopic = previousDataPreQuiz.choose_topic === 'Yes' ? true : false;
                    _setRadioPermitChooseTopic(permitTopic);
                    setPermitTopicChoose(previousDataPreQuiz.choose_topic)

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
                                    <Card.Title>
                                        Post Quiz Configuration
                                    </Card.Title>
                                    <Formik
                                        initialValues={{
                                            passPercentageL1Pre: previousDataPreQuiz.pass_pct_quiz_l1 === '' ? '' : previousDataPreQuiz.pass_pct_quiz_l1,
                                            passPercentageL2Pre: previousDataPreQuiz.pass_pct_quiz_l2 === '' ? '' : previousDataPreQuiz.pass_pct_quiz_l2,
                                            minStudentsPre: previousDataPreQuiz.pct_of_student_for_reteach === '' ? '' : previousDataPreQuiz.pct_of_student_for_reteach,
                                            noOfAttemptsPre: previousDataPreQuiz.no_of_attempt_to_unlock === '' ? '' : previousDataPreQuiz.no_of_attempt_to_unlock,
                                            percentageOfStudentsPre: previousDataPreQuiz.pct_of_student_for_focus === '' ? '' : previousDataPreQuiz.pct_of_student_for_focus,
                                            submit: null,
                                            classPercentageRep: previousDataPreQuiz.class_percentage_for_report === '' ? '' : previousDataPreQuiz.class_percentage_for_report,
                                            martix_basic: paperMatrixBasic === '' ? '' : paperMatrixBasic,
                                            martix_intermediate: paperMatrixIntermediate === '' ? '' : paperMatrixIntermediate,
                                            martix_advanced: paperMatrixAdvanced === '' ? '' : paperMatrixAdvanced,
                                            noOfTestPapers: previousDataPreQuiz.no_of_test === '' ? '' : previousDataPreQuiz.no_of_test,
                                            noOfWorksheets: previousDataPreQuiz.no_of_worksheet === '' ? '' : previousDataPreQuiz.no_of_worksheet,
                                            minNoQustionManual_express: previousDataPreQuiz.min_qn_at_topic_level === '' ? '' : previousDataPreQuiz.min_qn_at_topic_level,
                                            minNoQustionAutomate: previousDataPreQuiz.min_qn_at_chapter_level === '' ? '' : previousDataPreQuiz.min_qn_at_chapter_level,
                                            noOrderQuiz: previousDataPreQuiz.no_of_randomized_order === '' ? '' : previousDataPreQuiz.no_of_randomized_order,
                                            passPercentageL3Post: previousDataPreQuiz.pass_pct_quiz_l3 === '' ? '' : previousDataPreQuiz.pass_pct_quiz_l3,
                                        }}
                                        validationSchema={
                                            _radioAutomate === true && _radioExpress === false && _radioManual === false && _radioRecommendTeachersPre === false ?
                                                AutomateValidation : _radioRecommendTeachersPre === false && _radioAutomate === false && (_radioExpress === true || _radioManual === true) ?
                                                    ManulExpress : _radioRecommendTeachersPre === false && _radioAutomate === true && (_radioExpress === true || _radioManual === true) ?
                                                        AutomateExpress : _radioRecommendTeachersPre === true && _radioAutomate === true && _radioExpress === false && _radioManual === false ?
                                                            focusAreasAutomate : _radioRecommendTeachersPre === true && _radioAutomate === false && (_radioExpress === true || _radioManual === true) ?
                                                                focusAreasManual : _radioRecommendTeachersPre === true && _radioAutomate === true && (_radioExpress === true || _radioManual === true) ?
                                                                    focusAreasAutomateExpress : commonValidationPost
                                        }
                                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                            console.log("insideSubmit");
                                            setStatus({ success: true });
                                            setSubmitting(true);
                                            const matrixCount = values.martix_basic + values.martix_intermediate + values.martix_advanced

                                            if (_radioRecommendTeachersPre === true && values.percentageOfStudentsPre === '') {
                                                setFocusAreaErr(true)
                                            } else if (_radioOnlineTest === false && _radioPaperBased === false) {
                                                setOnlineErr(true)
                                            } else if (_radioAutomate === false && _radioExpress === false && _radioManual === false) {
                                                setNoOptionInTestMode(true)
                                            } else if (selectedTestMode === '' || selectedTestMode === undefined || selectedTestMode === null || selectedTestMode === 'Select...') {
                                                setTestModeErr(true)
                                            } else if (_radioAutomate === true && values.minNoQustionAutomate === '') {
                                                setAutomateErr(true)
                                            } else if ((_radioExpress === true || _radioManual === true) && values.minNoQustionManual_express === '') {
                                                setExpManualErr(true)
                                            } else if (_radioRandomizedQuestions === false && _radioRandomizedOrder === false) {
                                                setVarientErr(true)
                                            } else if (_radioRandomizedOrder === true && values.noOrderQuiz === '') {
                                                setNoOdrderQuizErr(true)
                                            } else if (matrixCount > 100 || matrixCount < 100) {
                                                setMatrixCountErr(true)
                                            } else {
                                                const formData = {
                                                    data: {
                                                        school_id: id,
                                                        post_quiz_config: {
                                                            pass_pct_quiz_l1: values.passPercentageL1Pre,
                                                            pass_pct_quiz_l2: values.passPercentageL2Pre,
                                                            pass_pct_quiz_l3: values.passPercentageL3Post,
                                                            pct_of_student_for_reteach: values.minStudentsPre,
                                                            no_of_attempt_to_unlock: values.noOfAttemptsPre,
                                                            l2_mandatory: selectedL2MandatoryPre,
                                                            read_digicard_mandatory: selectedReadDigicardPre,
                                                            recommend_teacher_on_focus_area: selectedRecommendTeachersPre,
                                                            pct_of_student_for_focus: selectedRecommendTeachersPre === 'Yes' ? values.percentageOfStudentsPre : '',
                                                            test_level: selectedTestMode,
                                                            test_matrix: {
                                                                Basic: values.martix_basic,
                                                                Intermediate: values.martix_intermediate,
                                                                Advanced: values.martix_advanced,
                                                            },
                                                            no_of_test: values.noOfTestPapers,
                                                            no_of_worksheet: values.noOfWorksheets,
                                                            automated_type: radioAutomateSelected,
                                                            manual_type: radioManualSelected,
                                                            express_type: radioExpressSelected,
                                                            online_mode: radioOnlineTestSelected,
                                                            offline_mode: radioPaperBasedSelected,
                                                            unlock_digicard_mandatory: radioUnlockDigicardSelected,
                                                            class_percentage_for_report: values.classPercentageRep,
                                                            topic_archive: selectedTopicSelection,
                                                            concept_mandatory: ConceptCompulsorialySelected,
                                                            min_qn_at_topic_level: values.minNoQustionManual_express,
                                                            min_qn_at_chapter_level: values.minNoQustionAutomate,
                                                            randomized_order_varient: radioRandomizedOrdersSelected,
                                                            randomized_questions_varient: radioRandomizedQuestionsSelected,
                                                            no_of_randomized_order: values.noOrderQuiz,
                                                            choose_topic: permitTopicChoose
                                                        }
                                                    }
                                                }

                                                console.log("formData", formData);

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


                                                <div id='CommonConfiguration'>
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
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <div className="form-group fill">

                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>
                                                                    No. of Worksheets to be generated
                                                                </label>

                                                                <input
                                                                    className="form-control"
                                                                    error={touched.noOfWorksheets && errors.noOfWorksheets}
                                                                    label="noOfWorksheets"
                                                                    name="noOfWorksheets"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    type="number"
                                                                    value={values.noOfWorksheets}
                                                                />

                                                                {touched.noOfWorksheets && errors.noOfWorksheets && <small className="text-danger form-text">{errors.noOfWorksheets}</small>}
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <div className="form-group fill">

                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>
                                                                    No. of Test Papers to be generated
                                                                </label>

                                                                <input
                                                                    className="form-control"
                                                                    error={touched.noOfTestPapers && errors.noOfTestPapers}
                                                                    label="noOfTestPapers"
                                                                    name="noOfTestPapers"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    type="number"
                                                                    value={values.noOfTestPapers}
                                                                />

                                                                {touched.noOfTestPapers && errors.noOfTestPapers && <small className="text-danger form-text">{errors.noOfTestPapers}</small>}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
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
                                                        <Col sm={6}>
                                                            <label className="floating-label">
                                                                <small className="text-danger">* </small>
                                                                Class percentage to generate the reports
                                                            </label>
                                                            <input
                                                                className="form-control"
                                                                error={touched.classPercentageRep && errors.classPercentageRep}
                                                                label="classPercentageRep"
                                                                name="classPercentageRep"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                type="number"
                                                                value={values.classPercentageRep}
                                                            // placeholder="To clear the Quiz"
                                                            />

                                                            {touched.classPercentageRep && errors.classPercentageRep && <small className="text-danger form-text">{errors.classPercentageRep}</small>}
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                    <Row>
                                                        <Col xs={6}>
                                                            <Row>
                                                                <Col>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger"></small>Access to Archive the Topic?
                                                                    </label>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className="row profile-view-radio-button-view">
                                                                        <Form.Check
                                                                            id={`topic_selection`}
                                                                            // label="Yes"
                                                                            error={touched.topic_selection && errors.topic_selection}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="topic_selection"
                                                                            checked={_radioTopicSelection}
                                                                            onChange={() => handleTopicSelection()}
                                                                        // className='ml-3 col-md-6'
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`topic_selection`}>
                                                                            {_radioTopicSelection === true ? 'Yes' : 'No'}
                                                                        </Form.Label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                    <Row>
                                                        <Col xs={6}>
                                                            <Row>
                                                                <Col>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger"></small>Unlock Digicard is Mandatory?
                                                                    </label>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className="row profile-view-radio-button-view">
                                                                        <Form.Check
                                                                            id={`unlockDigicard`}
                                                                            // label="Yes"
                                                                            error={touched.radioUnlockDigicard && errors.radioUnlockDigicard}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="unlockDigicard"
                                                                            checked={_radioUnlockDigicard}
                                                                            onChange={(e) => handleUnlockDigicard(e)}
                                                                        // className='ml-3 col-md-6'
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`unlockDigicard`}>
                                                                            {_radioUnlockDigicard === true ? 'Yes' : 'No'}
                                                                        </Form.Label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                    <Row>


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
                                                                            id={`readDigicardPre`}
                                                                            // label="Yes"
                                                                            error={touched.readDigicardPre && errors.readDigicardPre}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="readDigicardPre"
                                                                            checked={_radioReadDigicardPre}
                                                                            onChange={(e) => handleReadDigicardPre(e)}
                                                                        // className='ml-3 col-md-6'
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`readDigicardPre`}>
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
                                                            <Row>
                                                                <Col>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger"></small>Permit to Choose Topic?
                                                                    </label>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className="row profile-view-radio-button-view">
                                                                        <Form.Check
                                                                            id={`radioPermitTopic`}
                                                                            // label="Yes"
                                                                            error={touched.radioPermitTopic && errors.radioPermitTopic}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="radioPermitTopic"
                                                                            checked={_radioPermitChooseTopic}
                                                                            onChange={() => handlePermitTopic()}
                                                                        // className='ml-3 col-md-6'
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`radioPermitTopic`}>
                                                                            {_radioPermitChooseTopic === true ? 'Yes' : 'No'}
                                                                        </Form.Label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                    <Row>
                                                        <Col xs={6}>
                                                            <Row>
                                                                <Col>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger"></small>Recommend teachers on focus areas?
                                                                    </label>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className="row profile-view-radio-button-view">
                                                                        <Form.Check
                                                                            id={`radioRecommendTeachersPost`}
                                                                            error={touched.recommendTeachersPre && errors.recommendTeachersPre}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="radioRecommendTeachersPost"
                                                                            checked={_radioRecommendTeachersPre && _radioRecommendTeachersPre}
                                                                            onChange={(e) => {
                                                                                setFieldValue('percentageOfStudentsPre', '');
                                                                                handleRecommendTeachersPre(e);
                                                                            }}
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`radioRecommendTeachersPost`}>
                                                                            {_radioRecommendTeachersPre === true ? 'Yes' : 'No'}
                                                                        </Form.Label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
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
                                                                                        onChange={(e) => {
                                                                                            handleChange(e);
                                                                                            setFocusAreaErr(false)
                                                                                        }}
                                                                                        type="number"
                                                                                        // placeholder="After unlocking from Need Attention"
                                                                                        value={values.percentageOfStudentsPre}
                                                                                    />
                                                                                    {touched.percentageOfStudentsPre && errors.percentageOfStudentsPre && <small className="text-danger form-text">{errors.percentageOfStudentsPre}</small>}
                                                                                    {focusAreaErr && (<small className="text-danger form-text">Field is required!</small>)}
                                                                                </div>
                                                                            </OverlayTrigger>
                                                                        </Col>
                                                                    </Row>
                                                                )}
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <br />
                                                <hr />
                                                <div id='testMode'>
                                                    <Row>
                                                        <Col xs={6}>
                                                            <Row>
                                                                <Col>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger"></small>Online Mode?
                                                                    </label>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className="row profile-view-radio-button-view">
                                                                        <Form.Check
                                                                            id={`onlineTest`}
                                                                            error={touched.onlineTest && errors.onlineTest}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="radio_online_test"
                                                                            checked={_radioOnlineTest && _radioOnlineTest}
                                                                            onChange={(e) => {
                                                                                setOnlineErr(false);
                                                                                handleOnlineTest(e);
                                                                            }}
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`onlineTest`}>
                                                                            {_radioOnlineTest === true ? 'Enabled' : 'Disabled'}
                                                                        </Form.Label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                    <Row>
                                                        <Col xs={6}>

                                                            <Row>
                                                                <Col>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger"></small>Offline Mode?
                                                                    </label>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className="row profile-view-radio-button-view">
                                                                        <Form.Check
                                                                            id={`offlineMode`}
                                                                            error={touched.offlineMode && errors.offlineMode}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="offlineMode"
                                                                            checked={_radioPaperBased && _radioPaperBased}
                                                                            onChange={(e) => {
                                                                                setOnlineErr(false);
                                                                                handlePaperBased(e);
                                                                            }}
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`offlineMode`}>
                                                                            {_radioPaperBased === true ? 'Enabled' : 'Disabled'}
                                                                        </Form.Label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    {onlineErr && (
                                                        <small style={{ color: 'red' }}>Please, select either of the options!</small>
                                                    )}
                                                    <br />
                                                </div>
                                                <br />
                                                <hr />
                                                <div id='examType'>
                                                    <Row>
                                                        <Col xs={6}>
                                                            <Row>
                                                                <Col>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger"></small>Automate
                                                                    </label>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className="row profile-view-radio-button-view">
                                                                        <Form.Check
                                                                            id={`radioAutomateType`}
                                                                            // label="Yes"
                                                                            error={touched.radioAutomateType && errors.radioAutomateType}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="radioAutomateType"
                                                                            checked={_radioAutomate}
                                                                            onChange={(e) => {
                                                                                setFieldValue('minNoQustionAutomate', '');
                                                                                setNoOptionInTestMode(false);
                                                                                handleAutomate(e)
                                                                            }}
                                                                        // className='ml-3 col-md-6'
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`radioAutomateType`}>
                                                                            {_radioAutomate === true ? 'Enabled' : 'Disabled'}
                                                                        </Form.Label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <br />
                                                            <Row>
                                                                <Col>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger"></small>Express
                                                                    </label>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className="row profile-view-radio-button-view">
                                                                        <Form.Check
                                                                            id={`radioExpressType`}
                                                                            // label="Yes"
                                                                            error={touched.radioExpressType && errors.radioExpressType}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="radioExpressType"
                                                                            checked={_radioExpress}
                                                                            onChange={(e) => {
                                                                                setFieldValue('minNoQustionManual_express', '');
                                                                                setNoOptionInTestMode(false);
                                                                                handleExpress(e)
                                                                            }}
                                                                        // className='ml-3 col-md-6'
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`radioExpressType`}>
                                                                            {_radioExpress === true ? 'Enabled' : 'Disabled'}
                                                                        </Form.Label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <br />
                                                            <Row>
                                                                <Col>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger"></small>Manual
                                                                    </label>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className="row profile-view-radio-button-view">
                                                                        <Form.Check
                                                                            id={`radioManualType`}
                                                                            // label="Yes"
                                                                            error={touched.radioManualType && errors.radioManualType}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="radioManualType"
                                                                            checked={_radioManual}
                                                                            onChange={(e) => {
                                                                                setFieldValue('minNoQustionManual_express', '');
                                                                                setNoOptionInTestMode(false);
                                                                                handleManual(e);
                                                                                _setConceptCompulsorialy(false)
                                                                            }}
                                                                        // className='ml-3 col-md-6'
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`radioManualType`}>
                                                                            {_radioManual === true ? 'Enabled' : 'Disabled'}
                                                                        </Form.Label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                    <Row>
                                                        <Col sm={6}>
                                                            {_radioAutomate && (
                                                                <div className="form-group fill">

                                                                    <label className="floating-label">
                                                                        <small className="text-danger">* </small>
                                                                        Minimum no. of questions at chapter level for automate.
                                                                    </label>

                                                                    <input
                                                                        className="form-control"
                                                                        error={touched.minNoQustionAutomate && errors.minNoQustionAutomate}
                                                                        label="minNoQustionAutomate"
                                                                        name="minNoQustionAutomate"
                                                                        onBlur={handleBlur}
                                                                        onChange={(e) => {
                                                                            handleChange(e);
                                                                            setAutomateErr(false)
                                                                        }}
                                                                        type="number"
                                                                        // placeholder="After unlocking from Need Attention"
                                                                        value={values.minNoQustionAutomate}
                                                                    />

                                                                    {touched.minNoQustionAutomate && errors.minNoQustionAutomate && <small className="text-danger form-text">{errors.minNoQustionAutomate}</small>}
                                                                    {automateErr && (
                                                                        <small style={{ color: 'red' }}>Field Required!</small>
                                                                    )}
                                                                </div>
                                                            )}
                                                            <br />
                                                            {(_radioManual || _radioExpress) && (
                                                                <>
                                                                    <div className="form-group fill">

                                                                        <label className="floating-label">
                                                                            <small className="text-danger">* </small>
                                                                            Minimum no. of questions at Topic level for Manual\Express.
                                                                        </label>

                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.minNoQustionManual_express && errors.minNoQustionManual_express}
                                                                            label="minNoQustionManual_express"
                                                                            name="minNoQustionManual_express"
                                                                            onBlur={handleBlur}
                                                                            onChange={(e) => {
                                                                                handleChange(e);
                                                                                setExpManualErr(false)
                                                                            }}
                                                                            type="number"
                                                                            // placeholder="After unlocking from Need Attention"
                                                                            value={values.minNoQustionManual_express}
                                                                        />

                                                                        {touched.minNoQustionManual_express && errors.minNoQustionManual_express && <small className="text-danger form-text">{errors.minNoQustionManual_express}</small>}
                                                                        {expManualErr && (
                                                                            <small style={{ color: 'red' }}>Field Required!</small>
                                                                        )}
                                                                    </div><br />

                                                                    {_radioManual && (
                                                                        <Row>
                                                                            <Col>
                                                                                <label className="floating-label">
                                                                                    <small className="text-danger"></small>Concept Compulsorialy For Manual?
                                                                                </label>
                                                                            </Col>
                                                                            <Col xs={3}>
                                                                                <div className="row profile-view-radio-button-view">
                                                                                    <Form.Check
                                                                                        id={`conceptCompulsorialy`}
                                                                                        // label="Yes"
                                                                                        error={touched.conceptCompulsorialy && errors.conceptCompulsorialy}
                                                                                        type="switch"
                                                                                        variant={'outline-primary'}
                                                                                        name="conceptCompulsorialy"
                                                                                        checked={_radioConceptCompulsorialy}
                                                                                        onChange={(e) => handleconceptCompulsorialy(e)}
                                                                                    // className='ml-3 col-md-6'
                                                                                    />
                                                                                    <Form.Label className="profile-view-question" id={`conceptCompulsorialy`}>
                                                                                        {_radioConceptCompulsorialy === true ? 'Yes' : 'No'}
                                                                                    </Form.Label>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    )}

                                                                </>

                                                            )}
                                                        </Col>
                                                    </Row>

                                                    {noOptionInTestMode && (
                                                        <small style={{ color: 'red' }}>
                                                            Please, select either of the options!
                                                        </small>
                                                    )}

                                                </div>

                                                <hr />
                                                <div id='paperType'>
                                                    <Row>
                                                        <Col sm={6}>
                                                            <div className="form-group fill">
                                                                <label className="floating-label" >
                                                                    <small className="text-danger">* </small>
                                                                    Test Level
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
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <div>
                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>
                                                                    % of Questions From Basic Group
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.martix_basic && errors.martix_basic}
                                                                    label="martix_basic"
                                                                    name="martix_basic"
                                                                    onBlur={handleBlur}
                                                                    onChange={(e) => {
                                                                        handleChange(e);
                                                                        setMatrixCountErr(false);
                                                                    }}
                                                                    type="number"
                                                                    value={values.martix_basic}
                                                                    placeholder="% Questions "
                                                                />
                                                                {touched.martix_basic && errors.martix_basic && <small className="text-danger form-text">{errors.martix_basic}</small>}
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <div>
                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>
                                                                    % of Questions From Intermediate Group
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.martix_intermediate && errors.martix_intermediate}
                                                                    label="martix_intermediate"
                                                                    name="martix_intermediate"
                                                                    onBlur={handleBlur}
                                                                    onChange={(e) => {
                                                                        handleChange(e);
                                                                        setMatrixCountErr(false);
                                                                    }}
                                                                    type="number"
                                                                    value={values.martix_intermediate}
                                                                    placeholder="% Questions "
                                                                />
                                                                {touched.martix_intermediate && errors.martix_intermediate && <small className="text-danger form-text">{errors.martix_intermediate}</small>}
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <div>
                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>
                                                                    % of Questions From Advanced Group
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.martix_advanced && errors.martix_advanced}
                                                                    label="martix_advanced"
                                                                    name="martix_advanced"
                                                                    onBlur={handleBlur}
                                                                    onChange={(e) => {
                                                                        handleChange(e);
                                                                        setMatrixCountErr(false);
                                                                    }}
                                                                    type="number"
                                                                    value={values.martix_advanced}
                                                                    placeholder="% Questions "
                                                                />
                                                                {touched.martix_advanced && errors.martix_advanced && <small className="text-danger form-text">{errors.martix_advanced}</small>}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <br />
                                                    {matrixCountErr && (
                                                        <small style={{ color: 'red' }}> % of Questions From Basic,Intermediate and Advanced Group Exceed More then 100% or Less then 100%!</small>
                                                    )}
                                                </div>
                                                <br />
                                                <hr />
                                                <div id='varient'>
                                                    <Row>
                                                        <Col xs={6}>
                                                            <Row>
                                                                <Col>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger"></small>Randomized Questions Varient
                                                                    </label>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className="row profile-view-radio-button-view">
                                                                        <Form.Check
                                                                            id={`randomizedQuestionsPaper`}
                                                                            // label="Yes"
                                                                            error={touched.randomizedQuestionsPaper && errors.randomizedQuestionsPaper}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="randomizedQuestionsPaper"
                                                                            checked={_radioRandomizedQuestions}
                                                                            onChange={(e) => {
                                                                                setVarientErr(false);
                                                                                handleRandomizedQuestions(e)
                                                                            }}
                                                                        // className='ml-3 col-md-6'
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`randomizedQuestionsPaper`}>
                                                                            {_radioRandomizedQuestions === true ? 'Enabled' : 'Disabled'}
                                                                        </Form.Label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <br />
                                                            <Row>
                                                                <Col>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger"></small>Randomized Order Varient
                                                                    </label>
                                                                </Col>
                                                                <Col xs={3}>
                                                                    <div className="row profile-view-radio-button-view">
                                                                        <Form.Check
                                                                            id={`randomizedOrderPaper`}
                                                                            // label="Yes"
                                                                            error={touched.randomizedOrderPaper && errors.randomizedOrderPaper}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="randomizedOrderPaper"
                                                                            checked={_radioRandomizedOrder}
                                                                            onChange={(e) => {
                                                                                setVarientErr(false);
                                                                                setFieldValue('noOrderQuiz', '');
                                                                                handleRandomizedOrder(e)
                                                                            }}
                                                                        // className='ml-3 col-md-6'
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`randomizedOrderPaper`}>
                                                                            {_radioRandomizedOrder === true ? 'Enabled' : 'Disabled'}
                                                                        </Form.Label>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <br />
                                                        </Col>
                                                    </Row>
                                                    {varientErr && (
                                                        <small style={{ color: 'red' }}>Please, select either of the options!</small>
                                                    )}
                                                    <br />
                                                    {_radioRandomizedOrder && (
                                                        <>
                                                            <Row>
                                                                <Col sm={6}>
                                                                    <div className="form-group fill">
                                                                        <label className="floating-label" htmlFor="noOrderQuiz">
                                                                            <small className="text-danger">* </small>No. of Randomized Order Quiz
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.noOrderQuiz && errors.noOrderQuiz}
                                                                            name="noOrderQuiz"
                                                                            onBlur={handleBlur}
                                                                            onChange={(e) => {
                                                                                handleChange(e);
                                                                                setNoOdrderQuizErr(false)
                                                                                validateValue(e);
                                                                            }}
                                                                            type="number"
                                                                            value={values.noOrderQuiz}
                                                                            id='title'
                                                                        />
                                                                        {touched.noOrderQuiz && errors.noOrderQuiz && <small className="text-danger form-text">{errors.noOrderQuiz}</small>}
                                                                        {noOdrderQuizErr && (
                                                                            <small style={{ color: 'red' }}>Field is Required!</small>
                                                                        )}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </>

                                                    )}

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

export default PostQuizConfiguration