import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Button, Card, CloseButton, Form } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';
import axios from 'axios';
import ArticleRTE from './ArticleRTE'
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import MathJax from "react-mathjax";

import MESSAGES from '../../../../helper/messages';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { defaultPostApi } from '../../../common-ui-components/sow/bgv-api/BgvApi';
import { bgvAlerts } from '../../../common-ui-components/sow/bgv-api/bgvAlerts';
import { areFilesInvalidBulkUpload, isEmptyObject } from '../../../../util/utils';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { isEmptyArray, areFilesInvalid, voiceInvalid } from '../../../../util/utils';
import * as Constants from '../../../../config/constant';

const AddQuestions = ({ className, ...rest }) => {

    const history = useHistory();
    const [questionTypeOptions, setQquestionTypeOptions] = useState([
        { value: 'Objective', label: 'Objective' },
        { value: 'Subjective', label: 'Subjective' }
    ]);
    const [questionTypeErrMsg, setQuestionTypeErrMsg] = useState(false);
    const [questionEmptyErrMsg, setQuestionEmptyErrMsg] = useState(false);
    const [ansWeightageErrMsg, setAnsWeightageErrMsg] = useState(false);
    const [answerTypeErrMsg, setAnswerTypeErrMsg] = useState(false);

    const [selectedQuestionType, setSelectedQuestionType] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [displayHeader, setDisplayHeader] = useState(true);
    const [displayHeading, setDisplayHeading] = useState(sessionStorage.getItem('question_active_status'));
    const threadLinks = document.getElementsByClassName('page-header');
    const [showMathKeyboard, setShowMathKeyboard] = useState('');
    const [answerTypeOptions, setAnswerTypeOptions] = useState([]);
    const [selectedAnswerType, setSelectedAnswerType] = useState('');
    const [questionVoiceError, setQuestionVoiceError] = useState(true);
    const [questionVoiceNote, setQuestionVoiceNote] = useState("");
    const [selectedQuestionVoiceNote, setSelectedQuestionVoiceNote] = useState("");

    const [articleSize, setArticleSize] = useState(10);
    const [imageCount, setImageCount] = useState(0);
    const [articleDataTitle, setArticleDataTtitle] = useState("");

    const [addAnserOptions, setAddAnswerOptions] = useState(false);
    const [toggleWordsInput, setToggleWordsInput] = useState(false);
    const [toggleNumbersInput, setToggleNumbersInput] = useState(false);
    const [toggleEquationsInput, setToggleEquationsInput] = useState(false);
    const [toggleImageInput, setToggleImageInput] = useState(false);
    const [toggleAudioInput, setToggleAudioInput] = useState(false);
    const [questionLabelErr, setQuestionLabelErr] = useState(false);
    const [questionLabelValue, setQuestionLabelValue] = useState('');

    const [equation, setEquation] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [fileValues, setFileValues] = useState([]);
    const [voiceNoteFileValues, setVoiceNoteFileValues] = useState('');
    const [previewAudios, setPreviewAudios] = useState([]);
    const [_radio, _setRadio] = useState(false);

    const [answerOptionsForm, setAnswerOptionsForm] = useState([
        {
            answer_type: '',
            answer_option: '',
            answer_content: '',
            answer_display: '',
            answer_weightage: ''
        }
    ]);

    const questionTypeRef = useRef(null);

    const removeSelectedImg = (index) => {

        let tempPreviewImg = [...previewImages];
        tempPreviewImg[index] = '';
        setPreviewImages(tempPreviewImg);

        let tempFileValue = [...fileValues];
        tempFileValue[index] = '';
        setFileValues(tempFileValue);

        let data = [...answerOptionsForm];
        data[index]["answer_content"] = "";
        console.log(data);
        setAnswerOptionsForm(data);
    }

    const removeSelectedAudio = (index) => {

        let tempPreviewAudio = [...previewAudios];
        tempPreviewAudio[index] = '';
        setPreviewAudios(tempPreviewAudio);

        let tempFileValue = [...fileValues];
        tempFileValue[index] = '';
        setFileValues(tempFileValue);

        let data = [...answerOptionsForm];
        data[index]["answer_content"] = "";
        console.log(data);
        console.log(previewAudios);
        setAnswerOptionsForm(data);
    }

    const handleRadioChange = (e) => {

        _setRadio(!_radio);
        _radio === true ? setShowMathKeyboard('No') : setShowMathKeyboard('Yes');
    }

    const [answerBlanksOptions, setAnswerBlanksOptions] = useState([]);
    const [answerDisplayOptions, setAnswerDisplayOptions] = useState([
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
    ]);

    const selectedArr = [{ label: 'Options', value: 'Options' }];

    const handleQuestionType = (event) => {

        setAnswerTypeOptions((currentOptions) => currentOptions.filter((currentOption) => !selectedAnswerType.includes(currentOption)));

        console.log(answerTypeOptions);
        // setAnswerTypeOptions([]);
        setSelectedAnswerType([]);
        setAnswerOptionsForm([]);
        setQuestionTypeErrMsg(false);
        setQuestionEmptyErrMsg(false);
        setAnsWeightageErrMsg(false);

        setToggleWordsInput(false);
        setToggleNumbersInput(false);
        setToggleImageInput(false);
        setToggleAudioInput(false);
        setToggleEquationsInput(false);
        setAddAnswerOptions(false);
        setEquation([]);

        console.log(event);

        let valuesSelected = event.value;
        console.log(valuesSelected);
        setSelectedQuestionType(valuesSelected);

        valuesSelected === 'Subjective' ? setAnswerTypeOptions([
            { value: 'Words', label: 'Words' },
            { value: 'Numbers', label: 'Numbers' },
            { value: 'Equation', label: 'Equation' }
        ]) : setAnswerTypeOptions([
            { value: 'Words', label: 'Words' },
            { value: 'Numbers', label: 'Numbers' },
            { value: 'Equation', label: 'Equation' },
            { value: 'Image', label: 'Image' },
            { value: 'Audio File', label: 'Audio File' }
        ]);

    }

    const handleAnswerBlanks = (event, index) => {

        console.log(event.target);

        let data = [...answerOptionsForm];
        data[index][event.target.name] = event.target.value;
        data[index]["answer_type"] = selectedAnswerType;

        console.log(data);

        setAnswerOptionsForm(data);

        if (event.target.name === 'answer_weightage') {
            setAnsWeightageErrMsg(false);
        }

        if (toggleEquationsInput && event.target.name === 'answer_content') {
            let tempEquation = [...equation];
            tempEquation[index] = event.target.value;

            console.log(tempEquation);
            setEquation(tempEquation);
        }

        if (toggleImageInput && event.target.files) {
            let tempPreviewImg = [...previewImages];
            tempPreviewImg[index] = URL.createObjectURL(event.target.files[0]);
            setPreviewImages(tempPreviewImg);

            let tempFileValue = [...fileValues];
            tempFileValue[index] = event.target.files[0];
            setFileValues(tempFileValue);
        }

        if (toggleAudioInput && event.target.files) {
            let tempPreviewAudio = [...previewAudios];
            tempPreviewAudio[index] = URL.createObjectURL(event.target.files[0]);
            setPreviewAudios(tempPreviewAudio);

            let tempFileValue = [...fileValues];
            tempFileValue[index] = event.target.files[0];
            setFileValues(tempFileValue);
        }
    }

    const previewQuestionVoiceNote = (e) => {
        console.log(e.target)
        setQuestionVoiceNote(URL.createObjectURL(e.target.files[0]));
        setSelectedQuestionVoiceNote(e.target.value);
        setVoiceNoteFileValues(e.target.files[0]);
    }

    const handleAnswerType = (event) => {

        console.log(event.target.value);

        let valuesSelected = event.target.value;
        console.log(valuesSelected);
        console.log(articleDataTitle);

        setSelectedAnswerType(valuesSelected);

        setAnswerOptionsForm([{
            answer_type: event.target.value,
            answer_option: '',
            answer_content: '',
            answer_display: '',
            answer_weightage: ''
        }]);

        // setQquestionTypeOptions({ disabled: true });
        // setAnswerTypeOptions({ disabled: true });
        setEquation([]);
        setAddAnswerOptions(true);
        setAnsWeightageErrMsg(false);


        switch (valuesSelected) {
            case 'Words':
                setToggleWordsInput(true);
                setToggleNumbersInput(false);
                setToggleEquationsInput(false);
                setToggleImageInput(false);
                setToggleAudioInput(false);
                break;
            case 'Numbers':
                setToggleNumbersInput(true);
                setToggleWordsInput(false);
                setToggleEquationsInput(false);
                setToggleImageInput(false);
                setToggleAudioInput(false);
                break;
            case 'Equation':
                setToggleEquationsInput(true);
                setToggleWordsInput(false);
                setToggleNumbersInput(false);
                setToggleImageInput(false);
                setToggleAudioInput(false);
                break;
            case 'Image':
                setToggleImageInput(true);
                setToggleWordsInput(false);
                setToggleEquationsInput(false);
                setToggleNumbersInput(false);
                setToggleAudioInput(false);
                break;
            case 'Audio File':
                setToggleAudioInput(true);
                setToggleWordsInput(false);
                setToggleEquationsInput(false);
                setToggleNumbersInput(false);
                setToggleImageInput(false);
                break;
            default:

        }

    }

    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const addAnswerTypeOptions = () => {

        sessionStorage.setItem('click_event', "");

        let object = {
            answer_type: selectedAnswerType,
            answer_option: '',
            answer_content: '',
            answer_display: '',
            answer_weightage: ''
        }

        setAnswerOptionsForm([...answerOptionsForm, object])
    }

    const removeAnswerTypeOptions = (index) => {

        console.log(answerOptionsForm);
        console.log(index);

        let data = [...answerOptionsForm];
        data.splice(index, 1)
        setAnswerOptionsForm(data);
    }

    const handleQuestionLabel = (e) => {

        setQuestionLabelValue(e.target.value);
        setQuestionLabelErr(false);
    }

    useEffect(() => {

        const validateJWT = sessionStorage.getItem('user_jwt');

        if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

        } else {

            threadLinks.length === 2 ? setDisplayHeader(false) : setDisplayHeader(true);

        }

    }, []);

    const _addQuestions = (payLoad) => {

        axios
            .post(
                dynamicUrl.addQuestions,
                {
                    data: payLoad
                },
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {

                console.log({ response });
                console.log(response.status);
                console.log(response.data);

                console.log(response.status === 200);
                let result = response.status === 200;

                if (result) {

                    console.log('inside res');

                    let uploadParamsQuestionsNote = response.data.question_voice_note;
                    let uploadParamsAnswerOptions = response.data.answers_options;

                    hideLoader();

                    if (Array.isArray(uploadParamsQuestionsNote)) {

                        for (let index = 0; index < uploadParamsQuestionsNote.length; index++) {

                            let keyNameArr = Object.keys(uploadParamsQuestionsNote[index]);
                            let keyName = keyNameArr[1];
                            console.log('KeyName', keyName);

                            let blobField = voiceNoteFileValues;
                            console.log({ blobField });

                            let tempObj = uploadParamsQuestionsNote[index];
                            console.log(tempObj);
                            let result = fetch(tempObj[keyName], {
                                method: 'PUT',
                                body: blobField
                            });

                            console.log({ result });
                        }


                        if (Array.isArray(uploadParamsAnswerOptions)) {

                            for (let index = 0; index < uploadParamsAnswerOptions.length; index++) {

                                let keyNameArr = Object.keys(uploadParamsAnswerOptions[index]);
                                let keyName = keyNameArr[1];
                                console.log('KeyName', keyName);

                                let blobField = fileValues[index];
                                console.log({ blobField });

                                let tempObjFile = uploadParamsAnswerOptions[index];
                                console.log(tempObjFile);
                                console.log(keyName);
                                console.log(tempObjFile[keyName]);

                                let result = fetch(tempObjFile[keyName], {
                                    method: 'PUT',
                                    body: blobField
                                });

                                console.log({ result });
                            }

                            const MySwal = withReactContent(Swal);

                            MySwal.fire({

                                title: 'Question added!',
                                icon: 'success',
                            }).then((willDelete) => {

                                history.push('/admin-portal/active-questions');
                                // window.location.reload();

                            });

                        } else {

                            console.log('Answer option files not uploaded!');
                        }


                    } else {

                        if (Array.isArray(uploadParamsAnswerOptions)) {

                            for (let index = 0; index < uploadParamsAnswerOptions.length; index++) {

                                let keyNameArr = Object.keys(uploadParamsAnswerOptions[index]);
                                let keyName = keyNameArr[1];
                                console.log('KeyName', keyName);

                                let blobField = fileValues[index];
                                console.log({ blobField });

                                let tempObjFile = uploadParamsAnswerOptions[index];
                                console.log(tempObjFile[keyName]);

                                let result = fetch(tempObjFile[keyName], {
                                    method: 'PUT',
                                    body: blobField
                                });

                                console.log({ result });
                            }

                            const MySwal = withReactContent(Swal);
                            MySwal.fire({

                                title: 'Question added!',
                                icon: 'success',
                            }).then((willDelete) => {

                                history.push('/admin-portal/active-questions');
                                // window.location.reload();

                            })

                            console.log('Question Voice Note not uploaded');
                        }
                    }


                } else {

                    console.log('else res');
                    hideLoader();

                }
            })
            .catch((error) => {
                if (error.response) {
                    hideLoader();

                    console.log(error.response.data);

                } else if (error.request) {

                    console.log(error.request);
                    hideLoader();

                } else {

                    console.log('Error', error.message);
                    hideLoader();
                }
            });
    }

    return (

        <>

            <React.Fragment>

                {
                    displayHeader && (
                        <div className="page-header">
                            <div className="page-block">
                                <div className="row align-items-center">
                                    <div className="col-md-12">
                                        <div className="page-header-title">
                                            <h5 className="m-b-10">{displayHeading}</h5>
                                        </div><ul className="breadcrumb  ">
                                            <li className="breadcrumb-item  ">
                                                <a href="/upschool/admin-portal/admin-dashboard">
                                                    <i className="feather icon-home">
                                                    </i>
                                                </a>
                                            </li>
                                            <li className="breadcrumb-item  ">Questions</li>
                                            <li className="breadcrumb-item  ">{displayHeading}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                <Card>

                    <Card.Body>
                        <Formik

                            initialValues={{
                                answerType: '',
                                submit: null
                            }}

                            validationSchema={Yup.object().shape({
                                // answer_weightage: Yup.string().matches(Constants.Common.marksWeightageRegex, "Invalid Marks Weightage")
                            })}

                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                console.log(values);
                                setSubmitting(true);

                                console.log(sessionStorage.getItem('click_event') !== "");

                                if (sessionStorage.getItem('click_event') === "" || sessionStorage.getItem('click_event') === undefined || sessionStorage.getItem('click_event') === "undefined" || sessionStorage.getItem('click_event') === null) {

                                } else {

                                    console.log(questionLabelValue);
                                    if (questionLabelValue === "" || questionLabelValue === undefined || questionLabelValue === "undefined") {

                                        setQuestionLabelErr(true);

                                    } else if (isEmptyArray(selectedQuestionType)) {
                                        setQuestionTypeErrMsg(true);
                                    } else if (articleDataTitle === "" || articleDataTitle === undefined || articleDataTitle === 'undefined' || articleDataTitle === "<p><br></p>" || articleDataTitle === "<p></p>" || articleDataTitle === "<br>") {
                                        setQuestionEmptyErrMsg(true);
                                    } else if (answerOptionsForm) {

                                        let tempWeightage = answerOptionsForm.filter(value => value.answer_weightage < 0);

                                        if (tempWeightage.length !== 0) {
                                            setAnsWeightageErrMsg(true);
                                        } else {

                                            console.log('Data inserted!', values.question_disclaimer);

                                            let payLoad = {

                                                question_type: selectedQuestionType,
                                                question_voice_note: selectedQuestionVoiceNote,
                                                question_content: articleDataTitle,
                                                answer_type: selectedAnswerType,
                                                answers_of_question: answerOptionsForm,
                                                question_status: sessionStorage.getItem('click_event'),
                                                question_disclaimer: values.question_disclaimer === undefined ? "" : values.question_disclaimer,
                                                show_math_keyboard: showMathKeyboard,
                                                question_label: questionLabelValue
                                            }

                                            console.log("payLoad", payLoad);

                                            let allFilesData = [];
                                            let questionsVoiceNoteFilesData = [];

                                            if (selectedQuestionVoiceNote) {

                                                let selectedFile = voiceNoteFileValues;
                                                console.log('File is here!');
                                                console.log(selectedFile);

                                                if (selectedFile) {
                                                    questionsVoiceNoteFilesData.push(selectedFile);
                                                }

                                                if (questionsVoiceNoteFilesData.length === 0) {

                                                    if (selectedAnswerType === "Image") {

                                                        fileValues.forEach((fileName) => {
                                                            let selectedFile = fileName;
                                                            console.log('File is here!');
                                                            console.log(selectedFile);
                                                            if (selectedFile) {
                                                                allFilesData.push(selectedFile);
                                                            }
                                                        });

                                                        console.log(allFilesData);

                                                        if (allFilesData.length === 0) {

                                                            showLoader();
                                                            _addQuestions(payLoad);

                                                        } else {
                                                            if (areFilesInvalid(allFilesData) !== 0) {
                                                                sweetAlertHandler(
                                                                    {
                                                                        title: 'Invalid Image File(s)!',
                                                                        type: 'warning',
                                                                        text: 'Supported file formats are .png, .jpg, .jpeg. Uploaded files should be less than 2MB. '
                                                                    }
                                                                );
                                                            } else {

                                                                showLoader();
                                                                _addQuestions(payLoad);

                                                            }
                                                        }
                                                    } else if (selectedAnswerType === "Audio File") {

                                                        fileValues.forEach((fileName) => {
                                                            let selectedFile = fileName;
                                                            console.log('File is here!');
                                                            console.log(selectedFile);
                                                            if (selectedFile) {
                                                                allFilesData.push(selectedFile);
                                                            }
                                                        });

                                                        console.log(allFilesData);

                                                        if (allFilesData.length === 0) {

                                                            showLoader();
                                                            _addQuestions(payLoad);

                                                        } else {

                                                            if (voiceInvalid(allFilesData) !== 0) {
                                                                sweetAlertHandler({
                                                                    title: 'Invalid Audio File(s)!',
                                                                    type: 'warning',
                                                                    text: 'Supported file formats are .mp3, .mpeg, .wav. Uploaded files should be less than 10MB. '
                                                                });
                                                            } else {

                                                                showLoader();
                                                                _addQuestions(payLoad);

                                                            }
                                                        }

                                                    } else {

                                                        showLoader();
                                                        _addQuestions(payLoad);
                                                    }

                                                } else {

                                                    if (voiceInvalid(questionsVoiceNoteFilesData) !== 0) {
                                                        sweetAlertHandler({
                                                            title: 'Invalid Question Voice Note File!',
                                                            type: 'warning',
                                                            text: 'Supported file formats are .mp3, .mpeg, .wav. Uploaded files should be less than 10MB. '
                                                        });
                                                    } else {

                                                        if (selectedAnswerType === "Image") {

                                                            fileValues.forEach((fileName) => {
                                                                let selectedFile = fileName;
                                                                console.log('File is here!');
                                                                console.log(selectedFile);
                                                                if (selectedFile) {
                                                                    allFilesData.push(selectedFile);
                                                                }
                                                            });

                                                            console.log(allFilesData);

                                                            if (allFilesData.length === 0) {

                                                                showLoader();
                                                                _addQuestions(payLoad);

                                                            } else {
                                                                if (areFilesInvalid(allFilesData) !== 0) {
                                                                    sweetAlertHandler(
                                                                        {
                                                                            title: 'Invalid Image File(s)!',
                                                                            type: 'warning',
                                                                            text: 'Supported file formats are .png, .jpg, .jpeg. Uploaded files should be less than 2MB. '
                                                                        }
                                                                    );
                                                                } else {

                                                                    showLoader();
                                                                    _addQuestions(payLoad);

                                                                }
                                                            }
                                                        } else if (selectedAnswerType === "Audio File") {

                                                            fileValues.forEach((fileName) => {
                                                                let selectedFile = fileName;
                                                                console.log('File is here!');
                                                                console.log(selectedFile);
                                                                if (selectedFile) {
                                                                    allFilesData.push(selectedFile);
                                                                }
                                                            });

                                                            console.log(allFilesData);

                                                            if (allFilesData.length === 0) {

                                                                showLoader();
                                                                _addQuestions(payLoad);

                                                            } else {

                                                                if (voiceInvalid(allFilesData) !== 0) {
                                                                    sweetAlertHandler({
                                                                        title: 'Invalid Audio File(s)!',
                                                                        type: 'warning',
                                                                        text: 'Supported file formats are .mp3, .mpeg, .wav. Uploaded files should be less than 10MB. '
                                                                    });
                                                                } else {

                                                                    showLoader();
                                                                    _addQuestions(payLoad);

                                                                }
                                                            }

                                                        } else {

                                                            showLoader();
                                                            _addQuestions(payLoad);
                                                        }

                                                    }

                                                }


                                            } else {

                                                if (selectedAnswerType === "Image") {

                                                    fileValues.forEach((fileName) => {
                                                        let selectedFile = fileName;
                                                        console.log('File is here!');
                                                        console.log(selectedFile);
                                                        if (selectedFile) {
                                                            allFilesData.push(selectedFile);
                                                        }
                                                    });

                                                    console.log(allFilesData);

                                                    if (allFilesData.length === 0) {

                                                        showLoader();
                                                        _addQuestions(payLoad);

                                                    } else {
                                                        if (areFilesInvalid(allFilesData) !== 0) {
                                                            sweetAlertHandler(
                                                                {
                                                                    title: 'Invalid Image File(s)!',
                                                                    type: 'warning',
                                                                    text: 'Supported file formats are .png, .jpg, .jpeg. Uploaded files should be less than 2MB. '
                                                                }
                                                            );
                                                        } else {

                                                            showLoader();
                                                            _addQuestions(payLoad);

                                                        }
                                                    }
                                                } else if (selectedAnswerType === "Audio File") {

                                                    fileValues.forEach((fileName) => {
                                                        let selectedFile = fileName;
                                                        console.log('File is here!');
                                                        console.log(selectedFile);
                                                        if (selectedFile) {
                                                            allFilesData.push(selectedFile);
                                                        }
                                                    });

                                                    console.log(allFilesData);

                                                    if (allFilesData.length === 0) {

                                                        showLoader();
                                                        _addQuestions(payLoad);

                                                    } else {

                                                        if (voiceInvalid(allFilesData) !== 0) {
                                                            sweetAlertHandler({
                                                                title: 'Invalid Audio File(s)!',
                                                                type: 'warning',
                                                                text: 'Supported file formats are .mp3, .mpeg, .wav. Uploaded files should be less than 10MB. '
                                                            });
                                                        } else {

                                                            showLoader();
                                                            _addQuestions(payLoad);

                                                        }
                                                    }
                                                } else {
                                                    showLoader();
                                                    _addQuestions(payLoad);
                                                }

                                            }
                                        }
                                    }


                                }
                            }
                            }

                        >
                            {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                                <form noValidate onSubmit={handleSubmit} className={className} {...rest}>

                                    <Row>
                                        <Col xs={6}>
                                            <label className="floating-label">
                                                <small className="text-danger">* </small>
                                                Question Type
                                            </label>

                                            <Select
                                                ref={questionTypeRef}
                                                name="questionType"
                                                options={questionTypeOptions}
                                                className="basic-multi-select"
                                                classNamePrefix="Select"
                                                onChange={(event) => {
                                                    handleQuestionType(event)
                                                    setFieldValue('answerType', '')
                                                }}
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            />

                                            {questionTypeErrMsg && (
                                                <>
                                                    <small className="text-danger form-text">{'Please select Question Type'}</small>
                                                </>
                                            )}
                                        </Col>

                                        <Col xs={6}>
                                            <label className="floating-label" htmlFor="question_voice_note">
                                                <small className="text-danger"> </small>Question Voice Note
                                            </label>
                                            <input
                                                className="form-control"
                                                error={touched.question_voice_note && errors.question_voice_note}
                                                name="question_voice_note"
                                                id="question_voice_note"
                                                onBlur={handleBlur}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setQuestionVoiceError(true)
                                                    previewQuestionVoiceNote(e)
                                                }
                                                }
                                                type="file"
                                                value={values.question_voice_note}
                                                accept=".mp3,audio/*"
                                            />

                                            {questionVoiceNote && (
                                                <>
                                                    <br />
                                                    <Row style={{ display: "contents" }}>
                                                        <Col xs={8}>
                                                            <div className="form-group fill">
                                                                <audio controls>
                                                                    <source src={questionVoiceNote} alt="Audio" type="audio/mp3" />
                                                                    {console.log("questionVoiceNote", questionVoiceNote)}
                                                                </audio>
                                                            </div>
                                                        </Col>
                                                        <Col xs={3}>
                                                            <div>
                                                                <Button
                                                                    size="lg"
                                                                    variant="light"
                                                                    onClick={(e) => {
                                                                        setQuestionVoiceNote(false);
                                                                        setSelectedQuestionVoiceNote('');
                                                                        setVoiceNoteFileValues('');
                                                                        setFieldValue('question_voice_note', '')
                                                                    }}
                                                                    style={
                                                                        {
                                                                            marginTop: "-120px",
                                                                            marginLeft: "310px"
                                                                        }
                                                                    }
                                                                >
                                                                    <i className="feather icon-trash-2 " />
                                                                </Button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </>
                                            )}

                                            {touched.question_voice_note && errors.question_voice_note && (
                                                <small className="text-danger form-text">{errors.question_voice_note}</small>
                                            )}
                                            <small className="text-danger form-text" style={{ display: questionVoiceError ? 'none' : 'block' }}>{'Invalid File Type or File size is Exceed More Than 10MB'}</small>
                                        </Col>
                                    </Row>

                                    <br />
                                    <Row>
                                        <Col>
                                            <div
                                                title="This will be shown as question in the table!"

                                            >
                                                <label className="floating-label">
                                                    <small className="text-danger">* </small>
                                                    Question Label
                                                </label>

                                                <input
                                                    value={values.question_label}
                                                    className="form-control"
                                                    error={touched.question_label && errors.question_label}
                                                    label="question_label"
                                                    name="question_label"
                                                    onBlur={handleBlur}
                                                    type="question_label"
                                                    onChange={e => handleQuestionLabel(e)}
                                                    placeholder="Question Label"

                                                />
                                            </div>

                                            {
                                                questionLabelErr && (
                                                    <small className="text-danger form-text">{'Question Label is required!'}</small>
                                                )
                                            }

                                        </Col>
                                    </Row>

                                    <br />
                                    <Row>
                                        <Col>
                                            <label className="floating-label">
                                                <small className="text-danger"></small>
                                                Question Disclaimer
                                            </label>
                                            <textarea
                                                value={values.question_disclaimer}
                                                className="form-control"
                                                error={touched.question_disclaimer && errors.question_disclaimer}
                                                label="question_disclaimer"
                                                name="question_disclaimer"
                                                onBlur={handleBlur}
                                                type="textarea"
                                                onChange={handleChange}
                                                placeholder="Disclaimer"
                                            />
                                        </Col>

                                    </Row>

                                    <br />
                                    <Row>
                                        <Col>
                                            <label className="floating-label">
                                                <small className="text-danger"></small>
                                                Show Math Keyboard
                                            </label>

                                            <div className="col">
                                                <div className="row profile-view-radio-button-view">
                                                    <Form.Check
                                                        id={`radio-fresher`}
                                                        // label="Yes"
                                                        error={touched.fresher && errors.fresher}
                                                        type="switch"
                                                        variant={'outline-primary'}
                                                        name="radio-fresher"
                                                        // value={showMathKeyboard}
                                                        checked={_radio}
                                                        onChange={(e) => handleRadioChange(e)}
                                                    // className='ml-3 col-md-6'
                                                    /> &nbsp;

                                                    <Form.Label className="profile-view-question" id={`radio-fresher`}>
                                                        {_radio === true ? 'Yes' : 'No'}
                                                    </Form.Label>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <br />
                                    <Row>
                                        <Col>
                                            <label className="floating-label">
                                                <small className="text-danger">* </small>
                                                Question
                                            </label>

                                            <ArticleRTE
                                                setArticleSize={setArticleSize}
                                                setImageCount={setImageCount}
                                                imageCount={imageCount}
                                                articleData={articleDataTitle}
                                                setArticleData={setArticleDataTtitle}
                                                setAnswerBlanksOptions={setAnswerBlanksOptions}
                                                setQuestionEmptyErrMsg={setQuestionEmptyErrMsg}
                                            />

                                            {questionEmptyErrMsg && (
                                                <small className="text-danger form-text">{'Question is required!'}</small>
                                            )}

                                        </Col>
                                    </Row>

                                    <br />
                                    <Row>
                                        <Col>
                                            <label className="floating-label">
                                                <small className="text-danger"></small>
                                                Answer Type
                                            </label>

                                            <select
                                                className="form-control"
                                                error={touched.answerType && errors.answerType}
                                                name="answerType"
                                                onBlur={handleBlur}
                                                type="text"
                                                value={selectedAnswerType}
                                                onChange={event => handleAnswerType(event)}
                                            >

                                                <option>
                                                    Select...
                                                </option>
                                                {answerTypeOptions.map((optionsData) => {

                                                    return <option
                                                        value={optionsData.value}
                                                        key={optionsData.value}
                                                    >
                                                        {optionsData.value}
                                                    </option>

                                                })}

                                            </select>
                                            {answerTypeErrMsg && (
                                                <small className="text-danger form-text">{'Please select Answer Type'}</small>
                                            )}
                                        </Col>
                                        <Col></Col>
                                    </Row>

                                    {answerOptionsForm.map((form, index) => {

                                        return (
                                            <>
                                                < br />

                                                {toggleWordsInput && answerBlanksOptions && (

                                                    <>

                                                        <br />

                                                        {answerOptionsForm.length > 1 && (
                                                            <Row>
                                                                <Col></Col>
                                                                <Col>
                                                                    <CloseButton onClick={() => {
                                                                        removeAnswerTypeOptions(index)
                                                                    }} variant="white" />
                                                                </Col>
                                                            </Row>
                                                        )}

                                                        <Row key={index}>

                                                            <Col xs={3}>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Option
                                                                </label>

                                                                <select
                                                                    className="form-control"
                                                                    error={touched.answer_option && errors.answer_option}
                                                                    name="answer_option"
                                                                    onBlur={handleBlur}

                                                                    type="text"
                                                                    value={form.answer_option}
                                                                    key={index}
                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                >

                                                                    <option>
                                                                        Select...
                                                                    </option>

                                                                    {
                                                                        selectedQuestionType === 'Objective' ?
                                                                            <>

                                                                                {selectedArr.map((optionsData) => {
                                                                                    { console.log(optionsData) }
                                                                                    return <option
                                                                                        value={optionsData.value}
                                                                                        key={optionsData.value}
                                                                                    >
                                                                                        {optionsData.label}
                                                                                    </option>

                                                                                })}
                                                                            </> : <>

                                                                                {answerBlanksOptions.map((optionsData) => {

                                                                                    return <option
                                                                                        value={optionsData.value}
                                                                                        key={optionsData.value}
                                                                                    >
                                                                                        {optionsData.label}
                                                                                    </option>

                                                                                })}
                                                                            </>

                                                                    }

                                                                </select>

                                                            </Col>

                                                            <Col xs={5}>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Answer
                                                                </label>
                                                                <input
                                                                    value={form.answer_content}
                                                                    className="form-control"
                                                                    error={touched.answer_content && errors.answer_content}
                                                                    label="answer_content"
                                                                    name="answer_content"
                                                                    onBlur={handleBlur}
                                                                    type="answer_content"
                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                    placeholder="Enter Answer"
                                                                />
                                                            </Col>

                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Answer Display
                                                                </label>

                                                                <select
                                                                    className="form-control"
                                                                    error={touched.answer_display && errors.answer_display}
                                                                    name="answer_display"
                                                                    onBlur={handleBlur}

                                                                    type="text"
                                                                    value={form.answer_display}
                                                                    key={index}
                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                >

                                                                    <option>
                                                                        Select...
                                                                    </option>

                                                                    {answerDisplayOptions.map((optionsData) => {

                                                                        return <option
                                                                            value={optionsData.value}
                                                                            key={optionsData.value}
                                                                        >
                                                                            {optionsData.label}
                                                                        </option>

                                                                    })}

                                                                </select>


                                                            </Col>

                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Weightage
                                                                </label>
                                                                <input
                                                                    value={form.answer_weightage}
                                                                    className="form-control"
                                                                    error={touched.answer_weightage && errors.answer_weightage}
                                                                    label="answer_weightage"
                                                                    name="answer_weightage"
                                                                    onBlur={handleBlur}
                                                                    // onChange={handleChange}
                                                                    type="number"
                                                                    min="0.01"
                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                    placeholder="Enter Weightage"
                                                                />
                                                            </Col>

                                                        </Row>

                                                    </>

                                                )}

                                                {toggleEquationsInput && answerBlanksOptions && (

                                                    <>

                                                        <br />

                                                        {answerOptionsForm.length > 1 && (
                                                            <Row key={index}>
                                                                <Col></Col>
                                                                <Col>
                                                                    <CloseButton onClick={() => {
                                                                        removeAnswerTypeOptions(index)
                                                                    }} variant="white" />
                                                                </Col>
                                                            </Row>
                                                        )}

                                                        <Row key={index}>

                                                            <Col xs={3}>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Option
                                                                </label>

                                                                <select
                                                                    className="form-control"
                                                                    error={touched.answer_option && errors.answer_option}
                                                                    name="answer_option"
                                                                    onBlur={handleBlur}

                                                                    type="text"
                                                                    value={form.answer_option}
                                                                    key={index}
                                                                    onChange={(event) => {
                                                                        handleAnswerBlanks(event, index);
                                                                    }}
                                                                >

                                                                    <option>
                                                                        Select...
                                                                    </option>

                                                                    {
                                                                        selectedQuestionType === 'Objective' ?
                                                                            <>

                                                                                {selectedArr.map((optionsData) => {
                                                                                    { console.log(optionsData) }
                                                                                    return <option
                                                                                        value={optionsData.value}
                                                                                        key={optionsData.value}
                                                                                    >
                                                                                        {optionsData.label}
                                                                                    </option>

                                                                                })}
                                                                            </> : <>

                                                                                {answerBlanksOptions.map((optionsData) => {

                                                                                    return <option
                                                                                        value={optionsData.value}
                                                                                        key={optionsData.value}
                                                                                    >
                                                                                        {optionsData.label}
                                                                                    </option>

                                                                                })}
                                                                            </>

                                                                    }

                                                                </select>


                                                            </Col>

                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Answer Display
                                                                </label>

                                                                <select
                                                                    className="form-control"
                                                                    error={touched.answer_display && errors.answer_display}
                                                                    name="answer_display"
                                                                    onBlur={handleBlur}

                                                                    type="text"
                                                                    value={form.answer_display}
                                                                    key={index}
                                                                    onChange={(event) => {

                                                                        handleAnswerBlanks(event, index)
                                                                    }}
                                                                >

                                                                    <option>
                                                                        Select...
                                                                    </option>

                                                                    {answerDisplayOptions.map((optionsData) => {

                                                                        return <option
                                                                            value={optionsData.value}
                                                                            key={optionsData.value}
                                                                        >
                                                                            {optionsData.label}
                                                                        </option>

                                                                    })}

                                                                </select>


                                                            </Col>

                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Weightage
                                                                </label>
                                                                <input
                                                                    value={form.answer_weightage}
                                                                    className="form-control"
                                                                    error={touched.answer_weightage && errors.answer_weightage}
                                                                    label="answer_weightage"
                                                                    name="answer_weightage"
                                                                    onBlur={handleBlur}
                                                                    // onChange={handleChange}
                                                                    type="number"
                                                                    min="0.01"
                                                                    onChange={event => {

                                                                        handleAnswerBlanks(event, index)
                                                                    }}
                                                                    placeholder="Enter Weightage"
                                                                />
                                                            </Col>

                                                        </Row>

                                                        <br />
                                                        <Row>
                                                            <Col xs={6}>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Answer
                                                                </label>
                                                                <textarea
                                                                    value={form.answer_content}
                                                                    className="form-control"
                                                                    error={touched.answer_content && errors.answer_content}
                                                                    label="answer_content"
                                                                    name="answer_content"
                                                                    onBlur={handleBlur}
                                                                    type="textarea"
                                                                    onChange={(event) => {

                                                                        handleAnswerBlanks(event, index);
                                                                        console.log(equation);
                                                                        // setEquation([...equation], event.target.value);
                                                                    }}
                                                                    placeholder="Enter Equation"
                                                                />
                                                            </Col>

                                                            <Col xs={6}>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Preview
                                                                </label>

                                                                {equation.length >= 1 && (
                                                                    <MathJax.Provider>
                                                                        {
                                                                            (
                                                                                equation[index] && (
                                                                                    <div>
                                                                                        <MathJax.Node inline formula={equation[index]} />
                                                                                    </div>
                                                                                )
                                                                            )
                                                                        }

                                                                    </MathJax.Provider>
                                                                )}

                                                            </Col>
                                                        </Row>

                                                    </>

                                                )
                                                }

                                                {toggleNumbersInput && answerBlanksOptions && (

                                                    <>
                                                        <br />

                                                        {answerOptionsForm.length > 1 && (
                                                            <Row>
                                                                <Col></Col>
                                                                <Col>
                                                                    <CloseButton onClick={() => {
                                                                        removeAnswerTypeOptions(index)
                                                                    }} variant="white" />
                                                                </Col>
                                                            </Row>
                                                        )}

                                                        <Row key={index}>

                                                            <Col xs={3}>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Option
                                                                </label>

                                                                <select
                                                                    className="form-control"
                                                                    error={touched.answer_option && errors.answer_option}
                                                                    name="answer_option"
                                                                    onBlur={handleBlur}

                                                                    type="text"
                                                                    value={form.answer_option}
                                                                    key={index}
                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                >

                                                                    <option>
                                                                        Select...
                                                                    </option>

                                                                    {
                                                                        selectedQuestionType === 'Objective' ?
                                                                            <>

                                                                                {selectedArr.map((optionsData) => {
                                                                                    { console.log(optionsData) }
                                                                                    return <option
                                                                                        value={optionsData.value}
                                                                                        key={optionsData.value}
                                                                                    >
                                                                                        {optionsData.label}
                                                                                    </option>

                                                                                })}
                                                                            </> : <>

                                                                                {answerBlanksOptions.map((optionsData) => {

                                                                                    return <option
                                                                                        value={optionsData.value}
                                                                                        key={optionsData.value}
                                                                                    >
                                                                                        {optionsData.label}
                                                                                    </option>

                                                                                })}
                                                                            </>

                                                                    }

                                                                </select>


                                                            </Col>

                                                            <Col xs={5}>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Answer
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.answer_content && errors.answer_content}
                                                                    label="answer_content"
                                                                    name="answer_content"
                                                                    onBlur={handleBlur}
                                                                    type="number"
                                                                    value={values.answer_content}
                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                    placeholder="Enter Answer"
                                                                />
                                                            </Col>

                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Answer Display
                                                                </label>

                                                                <select
                                                                    className="form-control"
                                                                    error={touched.answer_display && errors.answer_display}
                                                                    name="answer_display"
                                                                    onBlur={handleBlur}

                                                                    type="text"
                                                                    value={form.answer_display}
                                                                    key={index}
                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                >

                                                                    <option>
                                                                        Select...
                                                                    </option>

                                                                    {answerDisplayOptions.map((optionsData) => {

                                                                        return <option
                                                                            value={optionsData.value}
                                                                            key={optionsData.value}
                                                                        >
                                                                            {optionsData.label}
                                                                        </option>

                                                                    })}

                                                                </select>


                                                            </Col>

                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Weightage
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.answer_weightage && errors.answer_weightage}
                                                                    label="answer_weightage"
                                                                    name="answer_weightage"
                                                                    onBlur={handleBlur}
                                                                    // onChange={handleChange}
                                                                    type="number"
                                                                    min="0.01"
                                                                    value={form.answer_weightage}
                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                    placeholder="Enter Weightage"
                                                                />
                                                            </Col>

                                                        </Row>

                                                        {
                                                            selectedQuestionType === 'Subjective' && (
                                                                <>
                                                                    <br />
                                                                    <Row>
                                                                        <Col>
                                                                            <label className="floating-label">
                                                                                <small className="text-danger"></small>
                                                                                Answer Range
                                                                            </label>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col xs={3}>
                                                                            <input
                                                                                className="form-control"
                                                                                error={touched.answer_range_from && errors.answer_range_from}
                                                                                label="answer_range_from"
                                                                                name="answer_range_from"
                                                                                onBlur={handleBlur}
                                                                                type="number"
                                                                                value={values.answer_range_from}
                                                                                onChange={event => handleAnswerBlanks(event, index)}
                                                                                placeholder="From"
                                                                            />
                                                                        </Col>
                                                                        <div style={{
                                                                            paddingTop: "6px"
                                                                        }}
                                                                        >-</div>

                                                                        <Col xs={3}>
                                                                            <input
                                                                                className="form-control"
                                                                                error={touched.answer_range_to && errors.answer_range_to}
                                                                                label="answer_range_to"
                                                                                name="answer_range_to"
                                                                                onBlur={handleBlur}
                                                                                type="number"
                                                                                value={values.answer_range_to}
                                                                                onChange={event => handleAnswerBlanks(event, index)}
                                                                                placeholder="To"
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </>
                                                            )
                                                        }

                                                    </>

                                                )}

                                                {toggleImageInput && answerBlanksOptions && (

                                                    <>
                                                        <br />

                                                        {answerOptionsForm.length > 1 && (
                                                            <Row>
                                                                <Col></Col>
                                                                <Col>
                                                                    <CloseButton onClick={() => {
                                                                        removeAnswerTypeOptions(index)
                                                                    }} variant="white" />
                                                                </Col>
                                                            </Row>
                                                        )}

                                                        <Row key={index}>

                                                            <Col xs={3}>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Option
                                                                </label>

                                                                <select
                                                                    className="form-control"
                                                                    error={touched.answer_option && errors.answer_option}
                                                                    name="answer_option"
                                                                    onBlur={handleBlur}

                                                                    type="text"
                                                                    value={form.answer_option}
                                                                    key={index}
                                                                    onChange={event => {
                                                                        handleAnswerBlanks(event, index)
                                                                    }}
                                                                >

                                                                    <option>
                                                                        Select...
                                                                    </option>

                                                                    {
                                                                        selectedQuestionType === 'Objective' ?
                                                                            <>

                                                                                {selectedArr.map((optionsData) => {
                                                                                    { console.log(optionsData) }
                                                                                    return <option
                                                                                        value={optionsData.value}
                                                                                        key={optionsData.value}
                                                                                    >
                                                                                        {optionsData.label}
                                                                                    </option>

                                                                                })}
                                                                            </> : <>

                                                                                {answerBlanksOptions.map((optionsData) => {

                                                                                    return <option
                                                                                        value={optionsData.value}
                                                                                        key={optionsData.value}
                                                                                    >
                                                                                        {optionsData.label}
                                                                                    </option>

                                                                                })}
                                                                            </>

                                                                    }

                                                                </select>


                                                            </Col>

                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Answer Display
                                                                </label>

                                                                <select
                                                                    className="form-control"
                                                                    error={touched.answer_display && errors.answer_display}
                                                                    name="answer_display"
                                                                    onBlur={handleBlur}

                                                                    type="text"
                                                                    value={form.answer_display}
                                                                    key={index}
                                                                    onChange={event => {
                                                                        handleAnswerBlanks(event, index)
                                                                    }}
                                                                >

                                                                    <option>
                                                                        Select...
                                                                    </option>

                                                                    {answerDisplayOptions.map((optionsData) => {

                                                                        return <option
                                                                            value={optionsData.value}
                                                                            key={optionsData.value}
                                                                        >
                                                                            {optionsData.label}
                                                                        </option>

                                                                    })}

                                                                </select>


                                                            </Col>

                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Weightage
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.answer_weightage && errors.answer_weightage}
                                                                    label="answer_weightage"
                                                                    name="answer_weightage"
                                                                    onBlur={handleBlur}
                                                                    // onChange={handleChange}
                                                                    type="number"
                                                                    min="0.01"
                                                                    value={form.answer_weightage}
                                                                    onChange={event => {
                                                                        handleAnswerBlanks(event, index)
                                                                    }}
                                                                    placeholder="Enter Weightage"
                                                                />
                                                            </Col>

                                                        </Row>

                                                        <br />
                                                        <Row>
                                                            <Col xs={6}>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Image
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.answer_content && errors.answer_content}
                                                                    label="answer_content"
                                                                    name="answer_content"
                                                                    onBlur={handleBlur}
                                                                    // onChange={handleChange}
                                                                    type="file"
                                                                    value={form.answer_content}

                                                                    onChange={event => {

                                                                        handleAnswerBlanks(event, index);
                                                                    }}
                                                                    placeholder="Enter Answer"
                                                                />
                                                            </Col>
                                                            <Col xs={3} style={{ display: "contents" }} >

                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Preview
                                                                </label>


                                                                {previewImages[index] &&
                                                                    (
                                                                        <>
                                                                            <br />

                                                                            <img width={150} src={previewImages[index]} alt="" className="img-fluid mb-3" style={{
                                                                                marginTop: "20px",
                                                                                marginLeft: "-50px"
                                                                            }} />

                                                                            {
                                                                                previewImages[index] && (
                                                                                    <CloseButton
                                                                                        onClick={() => {
                                                                                            setFieldValue("answer_content", "")
                                                                                            removeSelectedImg(index)
                                                                                        }}
                                                                                        style={
                                                                                            {
                                                                                                color: "#ff0000",
                                                                                                marginRight: "50px",
                                                                                                marginTop: "-80px"
                                                                                            }
                                                                                        }
                                                                                    />
                                                                                )
                                                                            }

                                                                        </>
                                                                    )
                                                                }
                                                            </Col>
                                                        </Row>
                                                    </>

                                                )}

                                                {toggleAudioInput && answerBlanksOptions && (

                                                    <>
                                                        <br />

                                                        {answerOptionsForm.length > 1 && (
                                                            <Row>
                                                                <Col></Col>
                                                                <Col>
                                                                    <CloseButton onClick={() => {
                                                                        removeAnswerTypeOptions(index)
                                                                    }} variant="white" />
                                                                </Col>
                                                            </Row>
                                                        )}

                                                        <Row key={index}>

                                                            <Col xs={3}>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Option
                                                                </label>

                                                                <select
                                                                    className="form-control"
                                                                    error={touched.answer_option && errors.answer_option}
                                                                    name="answer_option"
                                                                    onBlur={handleBlur}

                                                                    type="text"
                                                                    value={form.answer_option}
                                                                    key={index}
                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                >

                                                                    <option>
                                                                        Select...
                                                                    </option>

                                                                    {
                                                                        selectedQuestionType === 'Objective' ?
                                                                            <>

                                                                                {selectedArr.map((optionsData) => {
                                                                                    { console.log(optionsData) }
                                                                                    return <option
                                                                                        value={optionsData.value}
                                                                                        key={optionsData.value}
                                                                                    >
                                                                                        {optionsData.label}
                                                                                    </option>

                                                                                })}
                                                                            </> : <>

                                                                                {answerBlanksOptions.map((optionsData) => {
                                                                                    { console.log(optionsData) }
                                                                                    return <option
                                                                                        value={optionsData.value}
                                                                                        key={optionsData.value}
                                                                                    >
                                                                                        {optionsData.label}
                                                                                    </option>

                                                                                })}
                                                                            </>

                                                                    }

                                                                </select>

                                                            </Col>


                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Answer Display
                                                                </label>

                                                                <select
                                                                    className="form-control"
                                                                    error={touched.answer_display && errors.answer_display}
                                                                    name="answer_display"
                                                                    onBlur={handleBlur}

                                                                    type="text"
                                                                    value={form.answer_display}
                                                                    key={index}
                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                >

                                                                    <option>
                                                                        Select...
                                                                    </option>

                                                                    {answerDisplayOptions.map((optionsData) => {

                                                                        return <option
                                                                            value={optionsData.value}
                                                                            key={optionsData.value}
                                                                        >
                                                                            {optionsData.label}
                                                                        </option>

                                                                    })}

                                                                </select>


                                                            </Col>

                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Weightage
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.answer_weightage && errors.answer_weightage}
                                                                    label="answer_weightage"
                                                                    name="answer_weightage"
                                                                    onBlur={handleBlur}
                                                                    type="number"
                                                                    min="0.01"
                                                                    value={form.answer_weightage}
                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                    placeholder="Enter Weightage"
                                                                />
                                                            </Col>

                                                        </Row>

                                                        <br />

                                                        <Row>

                                                            <Col xs={6}>
                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Audio File
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.answer_content && errors.answer_content}
                                                                    name="answer_content"
                                                                    id="answer_content"
                                                                    onBlur={handleBlur}
                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                    type="file"
                                                                    value={form.answer_content}
                                                                    accept=".mp3,audio/*"
                                                                />
                                                            </Col>

                                                            <Col xs={3} style={{ display: "contents" }}>

                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Preview
                                                                </label>


                                                                {previewAudios && previewAudios[index] &&
                                                                    (
                                                                        <>
                                                                            <br />

                                                                            <div className="form-group fill" style={{ marginTop: "25px", marginLeft: "-53px" }} >
                                                                                <audio controls>
                                                                                    <source
                                                                                        src={previewAudios[index]}
                                                                                        alt="Audio"
                                                                                        type="audio/mp3" />
                                                                                    {console.log("previewAudios", previewAudios[index])
                                                                                    }
                                                                                </audio>
                                                                            </div>

                                                                            {
                                                                                previewAudios[index] && (
                                                                                    <CloseButton
                                                                                        onClick={() => {
                                                                                            setFieldValue("answer_content", "")
                                                                                            removeSelectedAudio(index)
                                                                                        }}
                                                                                        style={
                                                                                            {
                                                                                                color: "#ff0000",
                                                                                                marginRight: "-95px",
                                                                                                marginTop:
                                                                                                    "-55px"
                                                                                            }
                                                                                        }
                                                                                    />
                                                                                )
                                                                            }


                                                                        </>
                                                                    )
                                                                }
                                                            </Col>
                                                        </Row>
                                                    </>

                                                )}

                                            </>
                                        )
                                    })
                                    }

                                    {addAnserOptions && (
                                        <Row className="my-3">
                                            <Col></Col>
                                            <Col></Col>
                                            <Col>
                                                <button onClick={addAnswerTypeOptions} className="float-right">+</button>
                                            </Col>
                                        </Row>
                                    )}

                                    {loader}

                                    <br />
                                    <Row className="my-3">
                                        <Col></Col>
                                        <Col>
                                            {ansWeightageErrMsg && (
                                                <>
                                                    <div
                                                        style={{ color: 'red' }}
                                                        className="error">
                                                        Invalid Answer Weightage
                                                    </div>

                                                </>
                                            )}
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col>
                                                    <Button
                                                        className="btn-block"
                                                        color="warning"
                                                        size="small"
                                                        variant="warning"
                                                        onClick={() => window.location.reload()}>
                                                        Clear
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Button
                                                        className="btn-block"
                                                        color="warning"
                                                        size="small"
                                                        type="submit"
                                                        variant="info"
                                                        onClick={() => sessionStorage.setItem('click_event', 'Save')}>
                                                        Save
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Button
                                                        className="btn-block"
                                                        color="success"
                                                        size="small"
                                                        type="submit"
                                                        variant="success"
                                                        onClick={() => sessionStorage.setItem('click_event', 'Submit')}>
                                                        Submit
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                </form>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>


            </React.Fragment>
        </>

    );
};

export default AddQuestions;