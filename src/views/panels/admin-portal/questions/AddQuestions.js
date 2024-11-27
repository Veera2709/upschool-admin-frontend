import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card, CloseButton, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select from 'react-select';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import ArticleRTE from './ArticleRTE'
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import MathJax from "react-mathjax";

import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { isEmptyArray, areFilesInvalid, voiceInvalid } from '../../../../util/utils';
import { updateSyncWarnings } from 'redux-form';

const AddQuestions = ({ className, ...rest }) => {

    const history = useHistory();
    const questionTypeOptions = [
        { value: 'Objective', label: 'Objective' },
        { value: 'Subjective', label: 'Subjective' },
        { value: 'Descriptive', label: 'Descriptive' }
    ];

    const descriptiveAnswerTypeOptions = [
        { value: 'Phrases', label: 'Phrases' },
        { value: 'Equation', label: 'Equation' }
    ];

    const difficultylevel = [
        { value: 'lessDifficult', label: 'Less Difficult' },
        { value: 'moderatelyDifficult', label: 'Moderately Difficult' },
        { value: 'highlyDifficult', label: 'Highly Difficult' },
    ]
    const [isDuplicatePresent, setIsDuplicatePresent] = useState(false);/////////
    const [isDuplicatePresent2, setIsDuplicatePresent2] = useState(false);
    const [isDuplicatePresent3, setIsDuplicatePresent3] = useState(false);
    const [descriptiveAnswerErrMsg, setDescriptiveAnswerErrMsg] = useState(false);
    const [questionTypeErrMsg, setQuestionTypeErrMsg] = useState(false);
    const [questionCategoryErrMsg, setQuestionCategoryErrMsg] = useState(false);
    const [questionCognitiveSkillErrMsg, setQuestionCognitiveSkillErrMsg] = useState(false);
    const [questionSourceErrMsg, setQuestionSourceErrMsg] = useState(false);
    const [questionEmptyErrMsg, setQuestionEmptyErrMsg] = useState(false);
    const [questionEmptyErrMsg2, setQuestionEmptyErrMsg2] = useState(false);
    const [questionEmptyErrMsg3, setQuestionEmptyErrMsg3] = useState(false);
    const [ansWeightageErrMsg, setAnsWeightageErrMsg] = useState(false);
    const [unitWeightageErrMsg, setUnitWeightageErrMsg] = useState(false);
    const [negativeMarksErrMsg, setNegativeMarksErrMsg] = useState(false);
    const [answerTypeErrMsg, setAnswerTypeErrMsg] = useState(false);
    const [weightageEmpty, setWeightageEmpty] = useState(false);
    const [keyWordsEmptyErr, setKeyWordsEmptyErr] = useState(false);
    const [answersEmptyErr, setAnswersEmptyErr] = useState(false);
    const [optionsEmptyErr, setOptionsEmptyErr] = useState(false);
    const [mismatchWeightageErr, setMismatchWeightageErr] = useState(false);
    const [answerTypeEmptyErr, setAnswerTypeEmptyErr] = useState(false);
    const [blanksMismatchErr, setBlanksMismatchErr] = useState(false);

    const [selectedQuestionType, setSelectedQuestionType] = useState([]);
    const [selectedQuestionCategory, setSelectedQuestionCategory] = useState({});
    const [selectedQuestionCognitiveSkill, setSelectedQuestionCognitiveSkill] = useState({});
    const [selectedQuestionSource, setSelectedQuestionSource] = useState({});
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [displayHeader, setDisplayHeader] = useState(true);
    const [displayHeading, setDisplayHeading] = useState(sessionStorage.getItem('question_active_status'));
    const threadLinks = document.getElementsByClassName('page-header');
    const [showMathKeyboard, setShowMathKeyboard] = useState('No');
    // const [workSheetOrTest, setWorkSheetOrTest] = useState('preOrPost');
    const [workSheetOrTest, setWorkSheetOrTest] = useState(['preOrPost']);
    const [answerTypeOptions, setAnswerTypeOptions] = useState([]);
    const [descriptiveAnswerOptionsForm, setDescriptiveAnswerOptionsForm] = useState([]);
    const [selectedAnswerType, setSelectedAnswerType] = useState('');
    const [questionVoiceError, setQuestionVoiceError] = useState(true);
    const [questionVoiceNote, setQuestionVoiceNote] = useState("");
    const [selectedQuestionVoiceNote, setSelectedQuestionVoiceNote] = useState("");

    const [articleSize, setArticleSize] = useState(10);
    const [articleSize2, setArticleSize2] = useState(10);
    const [articleSize3, setArticleSize3] = useState(10);
    const [imageCount, setImageCount] = useState(0);
    const [imageCount2, setImageCount2] = useState(0);
    const [imageCount3, setImageCount3] = useState(0);
    const [articleDataTitle, setArticleDataTtitle] = useState("");
    const [articleDataTitle2, setArticleDataTtitle2] = useState("");
    const [articleDataTitle3, setArticleDataTtitle3] = useState("");

    const [questionLabelErr, setQuestionLabelErr] = useState(false);
    const [questionLabelValue, setQuestionLabelValue] = useState('');

    const [equation, setEquation] = useState([]);
    const [descriptiveEquation, setDescriptiveEquation] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [fileValues, setFileValues] = useState([]);
    const [voiceNoteFileValues, setVoiceNoteFileValues] = useState('');
    const [previewAudios, setPreviewAudios] = useState([]);
    const [_radioShowMathKeyboard, _setRadioShowMathKeyboard] = useState(false);
    const [_radioWorkSheetOrTest, _setRadioWorkSheetOrTest] = useState(false);

    const [optionsCategory, setOptionsCategory] = useState([]);
    const [optionsCongnitiveSkills, setOptionsCongnitiveSkills] = useState([]);
    const [optionsSource, setOptionsSource] = useState([]);
    const [optionsDisclaimer, setOptionsDisclaimer] = useState([]);

    const [errorMessage, setErrorMessage] = useState("");

    const [selectedValueDisclaimer, setSelectedValueDisclaimer] = useState("N.A.");

    const [selectedDifficultyLevel, setSelectedDifficultyLevel] = useState();
    const [isDefficultyLevelErr, setIsDefficultyLevelErr] = useState(false)

    const [questionLabelAlreadyExists, setQuestionLabelAlreadyExists] = useState(false);
    const [answerOptionsForm, setAnswerOptionsForm] = useState([
        {
            answer_type: '',
            answer_option: '',
            answer_content: '',
            answer_display: 'No',
            answer_weightage: ''
        }
    ]);


    const handleChildStateChange = (newState) => {
        setIsDuplicatePresent(newState);
    };

    const handleChildStateChange2 = (newState) => {
        setIsDuplicatePresent2(newState);
    };

    const handleChildStateChange3 = (newState) => {
        setIsDuplicatePresent3(newState);
    };


    useEffect(() => {

        console.log("Request : ", {
            data: {
                category_status: "Active"
            }
        });
        axios

            .post(
                dynamicUrl.fetchQuestionMasters,
                {
                    data: {
                        disclaimer_type: "Question",
                        disclaimer_status: "Active",
                        category_type: "Question",
                        category_status: "Active",
                        cognitive_type: "Question",
                        cognitive_status: "Active",
                        source_type: "Question",
                        source_status: "Active"
                    }
                },
                { headers: { Authorization: sessionStorage.getItem('user_jwt') } }
            )
            .then((response) => {

                console.log("Response : ", response);
                let tempCategoryArr = [];
                let tempDisclaimerArr = [];
                let tempCognitiveSkillArr = [];
                let tempSourceArr = [];

                (response.data.categories.map(e => { tempCategoryArr.push({ value: e.category_id, label: e.category_name }) }));
                (response.data.disclaimers.map(e => { tempDisclaimerArr.push({ value: e.disclaimer_id, label: e.disclaimer_label }) }));
                (response.data.cognitive_skills.map(e => { tempCognitiveSkillArr.push({ value: e.cognitive_id, label: e.cognitive_name }) }));
                (response.data.question_sources.map(e => { tempSourceArr.push({ value: e.source_id, label: e.source_name }) }));

                isEmptyArray(tempCategoryArr) ? setOptionsCategory([]) : setOptionsCategory(tempCategoryArr);
                isEmptyArray(tempDisclaimerArr) ? setOptionsDisclaimer([]) : setOptionsDisclaimer(tempDisclaimerArr);
                isEmptyArray(tempCognitiveSkillArr) ? setOptionsCongnitiveSkills([]) : setOptionsCongnitiveSkills(tempCognitiveSkillArr);
                isEmptyArray(tempSourceArr) ? setOptionsSource([]) : setOptionsSource(tempSourceArr);

            })

            .catch((error) => {
                console.log(error)
                setErrorMessage("Error fetching data. Please try again later.")
            });
    }, []);

    const handleCategoryChange = (event) => {
        console.log(event);
        setQuestionCategoryErrMsg(false);
        setSelectedQuestionCategory(event.value);
    };

    const handleCognitiveSkillChange = (event) => {
        console.log(event);
        setQuestionCognitiveSkillErrMsg(false);
        setSelectedQuestionCognitiveSkill(event.value);
    };

    const handleSourceChange = (event) => {
        console.log(event);
        setQuestionSourceErrMsg(false);
        setSelectedQuestionSource(event.value);
    };

    const handleDisclaimerChange = (event) => {
        console.log(event);
        // setErrorMessageDisclaimer(false)
        setSelectedValueDisclaimer(event.value);
    };

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

    const handleShowMathKeyboard = (e) => {

        _setRadioShowMathKeyboard(!_radioShowMathKeyboard);
        _radioShowMathKeyboard === true ? setShowMathKeyboard('No') : setShowMathKeyboard('Yes');
    }

    // const handleWorkSheetOrTest = (e) => {
    //     _setRadioWorkSheetOrTest(!_radioWorkSheetOrTest);
    //     _radioWorkSheetOrTest === true ? setWorkSheetOrTest('preOrPost') : setWorkSheetOrTest('worksheetOrTest');
    // }

    const handleWorkSheetOrTest = (e) => {
        const value = e.target.value;
        let updatedSelection;
    
        if (workSheetOrTest.includes(value)) {
            // Remove the value if it's already selected (uncheck)
            updatedSelection = workSheetOrTest.filter(item => item !== value);
        } else {
            // Add the value if it's not already selected (check)
            updatedSelection = [...workSheetOrTest, value];
        }
    
        setWorkSheetOrTest(updatedSelection);
    
        // Update _setRadioWorkSheetOrTest based on whether 'worksheetOrTest' is in the array
        if (updatedSelection.includes('worksheetOrTest')) {
            _setRadioWorkSheetOrTest(true);
        } else {
            _setRadioWorkSheetOrTest(false);
        }
    };

    const [answerBlanksOptions, setAnswerBlanksOptions] = useState([]);
    const [answerBlanksOptions2, setAnswerBlanksOptions2] = useState([]);
    const [answerBlanksOptions3, setAnswerBlanksOptions3] = useState([]);
    const answerDisplayOptions = [
        { value: 'No', label: 'No' },
        { value: 'Yes', label: 'Yes' }
    ];

    const selectedArr = [{ label: 'Options', value: 'Options' }];

    const handleQuestionType = (event) => {

        setAnswerTypeOptions((currentOptions) => currentOptions.filter((currentOption) => !selectedAnswerType.includes(currentOption)));
        // setSelectedQuestionCategory([]);
        // setSelectedQuestionCognitiveSkill([]);
        // setSelectedQuestionSource([]);

        console.log(answerTypeOptions);
        // setAnswerTypeOptions([]);
        setSelectedAnswerType([]);
        setAnswerOptionsForm([{
            answer_type: '',
            answer_option: '',
            answer_content: '',
            answer_display: 'No',
            answer_weightage: ''
        }]);
        setDescriptiveAnswerErrMsg(false);
        setQuestionTypeErrMsg(false);
        setQuestionCategoryErrMsg(false);
        setQuestionCognitiveSkillErrMsg(false);
        setQuestionSourceErrMsg(false);
        setQuestionEmptyErrMsg(false);
        setQuestionEmptyErrMsg2(false);
        setQuestionEmptyErrMsg3(false);
        setAnsWeightageErrMsg(false);
        setWeightageEmpty(false);
        setKeyWordsEmptyErr(false);
        setAnswersEmptyErr(false);
        setOptionsEmptyErr(false);
        setMismatchWeightageErr(false);
        setUnitWeightageErrMsg(false);
        setAnswerTypeEmptyErr(false);
        setBlanksMismatchErr(false);

        setEquation([]);
        setDescriptiveEquation([]);

        console.log(event);

        let valuesSelected = event.value;
        console.log(valuesSelected);
        setSelectedQuestionType(valuesSelected);

        if (valuesSelected === 'Descriptive') {

            setDescriptiveAnswerOptionsForm([{
                answer_type: '',
                answer_content: '',
                answer_weightage: ''
            }]);

        }

        valuesSelected === 'Subjective' ? setAnswerTypeOptions([
            { value: 'Words', label: 'Words' },
            { value: 'Numbers', label: 'Numbers' },
            { value: 'Alpha Numeric', label: 'Alpha Numeric' },
            { value: 'Equation', label: 'Equation' }
        ]) : setAnswerTypeOptions([
            { value: 'Words', label: 'Words' },
            { value: 'Numbers', label: 'Numbers' },
            { value: 'Alpha Numeric', label: 'Alpha Numeric' },
            { value: 'Equation', label: 'Equation' },
            { value: 'Image', label: 'Image' },
            { value: 'Audio File', label: 'Audio File' }
        ]);

    }

    const handleDescriptiveAnswerBlanks = (event, index) => {

        let data = [...descriptiveAnswerOptionsForm];
        setWeightageEmpty(false);
        setKeyWordsEmptyErr(false);
        setAnswersEmptyErr(false);
        setOptionsEmptyErr(false);
        setMismatchWeightageErr(false);
        setAnswerTypeEmptyErr(false);
        setBlanksMismatchErr(false);

        if (event.target.name === 'answer_type') {

            // Clear Answer Values
            data[index][event.target.name] = event.target.value;
            data[index]["answer_content"] = "";
            data[index]["answer_weightage"] = "";

        } else {
            data[index][event.target.name] = event.target.value;
        }

        if (data[index]['answer_type'] === 'Equation' && event.target.name === 'answer_content') {
            let tempEquation = [...descriptiveEquation];
            tempEquation[index] = event.target.value;

            console.log(tempEquation);
            setDescriptiveEquation(tempEquation);
        }

        setDescriptiveAnswerOptionsForm(data);
    }

    const handleAnswerBlanks = (event, index) => {

        setKeyWordsEmptyErr(false);
        setAnswersEmptyErr(false);
        setOptionsEmptyErr(false);
        setMismatchWeightageErr(false);
        setAnswerTypeEmptyErr(false);
        setBlanksMismatchErr(false);

        let data = [...answerOptionsForm];

        if (event.target.name === 'answer_type') {

            // Clear Answer Values
            data[index][event.target.name] = event.target.value;
            data[index]["answer_content"] = "";
            data[index]["answer_display"] = "No";
            data[index]["answer_option"] = "";
            data[index]["answer_weightage"] = "";

            // Clear selected File Values (Image&Audio)
            let tempFileValue = [...fileValues];
            tempFileValue[index] = '';
            setFileValues(tempFileValue);

            // Clear Image Preview Values
            let tempPreviewImg = [...previewImages];
            tempPreviewImg[index] = '';
            setPreviewImages(tempPreviewImg);

            // Clear Audio Preview Values
            let tempPreviewAudio = [...previewAudios];
            tempPreviewAudio[index] = '';
            setPreviewAudios(tempPreviewAudio);

        }

        if (event.target.value === "Numbers" && event.target.name === 'answer_content') {
            data[index][event.target.name] = Number(event.target.value);
        } else {
            data[index][event.target.name] = event.target.value;
        }

        if (event.target.value === "Numbers" && event.target.name === 'answer_range_from') {
            data[index][event.target.name] = Number(event.target.value);
        }

        if (event.target.value === "Numbers" && event.target.name === 'answer_range_to') {
            data[index][event.target.name] = Number(event.target.value);
        }

        // ------------ Alpha Numeric ---------------//

        if (event.target.value === "Alpha Numeric" && event.target.name === 'answer_content') {
            data[index][event.target.name] = Number(event.target.value);
        } else {
            data[index][event.target.name] = event.target.value;
        }

        if (event.target.value === "Alpha Numeric" && event.target.name === 'answer_range_from') {
            data[index][event.target.name] = Number(event.target.value);
        }

        if (event.target.value === "Alpha Numeric" && event.target.name === 'answer_range_to') {
            data[index][event.target.name] = Number(event.target.value);
        }

        if (event.target.value === "Alpha Numeric" && event.target.name === 'answer_unit') {
            data[index][event.target.name] = event.target.value;
        }

        if (event.target.value === "Alpha Numeric" && event.target.name === 'unit_weightage') {
            data[index][event.target.name] = Number(event.target.value);
        }

        console.log(data);

        setAnswerOptionsForm(data);

        if (event.target.name === 'answer_weightage') {
            setAnsWeightageErrMsg(false);
            setWeightageEmpty(false);
        }

        if (event.target.name === 'unit_weightage') {
            setUnitWeightageErrMsg(false);
        }

        if (data[index]['answer_type'] === 'Equation' && event.target.name === 'answer_content') {
            let tempEquation = [...equation];
            tempEquation[index] = event.target.value;

            console.log(tempEquation);
            setEquation(tempEquation);
        }

        if (data[index]['answer_type'] === 'Image' && event.target.files && event.target.name === 'answer_content') {

            if (areFilesInvalid([event.target.files[0]]) !== 0) {
                sweetAlertHandler(
                    {
                        title: 'Invalid Image File(s)!',
                        type: 'warning',
                        text: 'Supported file formats are .png, .jpg, .jpeg. Uploaded files should be less than 2MB. '
                    }
                );
            } else {

                let tempPreviewImg = [...previewImages];
                tempPreviewImg[index] = event.target.files.length === 0 ? '' : URL.createObjectURL(event.target.files[0]);
                setPreviewImages(tempPreviewImg);

                let tempFileValue = [...fileValues];
                tempFileValue[index] = event.target.files[0];
                setFileValues(tempFileValue);
            }
        }

        if (data[index]['answer_type'] === 'Audio File' && event.target.files && event.target.name === 'answer_content') {

            if (voiceInvalid([event.target.files[0]]) !== 0) {
                sweetAlertHandler({
                    title: 'Invalid Audio File(s)!',
                    type: 'warning',
                    text: 'Supported file formats are .mp3, .mpeg, .wav. Uploaded files should be less than 10MB. '
                });
            } else {

                let tempPreviewAudio = [...previewAudios];
                tempPreviewAudio[index] = event.target.files.length === 0 ? '' : URL.createObjectURL(event.target.files[0]);
                setPreviewAudios(tempPreviewAudio);

                let tempFileValue = [...fileValues];
                tempFileValue[index] = event.target.files[0];
                setFileValues(tempFileValue);
            }
        }
    }

    const previewQuestionVoiceNote = (e) => {

        if (voiceInvalid([e.target.files[0]]) !== 0) {
            sweetAlertHandler({
                title: 'Invalid Audio File(s)!',
                type: 'warning',
                text: 'Supported file formats are .mp3, .mpeg, .wav. Uploaded files should be less than 10MB. '
            });
        } else {

            console.log(e.target);
            let tempUrl = e.target.files.length === 0 ? '' : URL.createObjectURL(e.target.files[0]);
            setQuestionVoiceNote(tempUrl);
            setSelectedQuestionVoiceNote(e.target.value);
            setVoiceNoteFileValues(e.target.files[0]);
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
            answer_type: '',
            answer_option: '',
            answer_content: '',
            answer_display: 'No',
            answer_weightage: ''
        }

        setAnswerOptionsForm([...answerOptionsForm, object])
    }

    const addDescriptiveAnswerTypeOptions = () => {

        sessionStorage.setItem('click_event', "");

        let object = {
            answer_type: '',
            answer_content: '',
            answer_weightage: ''
        }

        setDescriptiveAnswerOptionsForm([...descriptiveAnswerOptionsForm, object]);

    }

    const removeDescriptiveAnswerTypeOptions = (index) => {

        console.log(descriptiveAnswerOptionsForm);
        console.log(index);

        let data = [...descriptiveAnswerOptionsForm];
        data.splice(index, 1)
        setDescriptiveAnswerOptionsForm(data);

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
        setQuestionLabelAlreadyExists(false);
    }

    useEffect(() => {

        const validateJWT = sessionStorage.getItem('user_jwt');

        if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

        } else {

            console.log(threadLinks.length);
            threadLinks.length === 2 ? setDisplayHeader(false) : setDisplayHeader(true);

        }

    }, []);

    const _addQuestions = (payLoad) => {
        axios
            .post(
                dynamicUrl.addQuestions,
                { data: payLoad },
                { headers: { Authorization: sessionStorage.getItem('user_jwt') } }
            )
            .then((response) => {
                let result = response.status === 200;

                if (result) {

                    let uploadParamsQuestionsNote = response.data.question_voice_note;
                    let uploadParamsAnswerOptions = response.data.answers_options;

                    hideLoader();

                    if (Array.isArray(uploadParamsQuestionsNote)) {

                        for (let index = 0; index < uploadParamsQuestionsNote.length; index++) {

                            let keyNameArr = Object.keys(uploadParamsQuestionsNote[index]);
                            let keyName = keyNameArr[1];

                            let blobField = voiceNoteFileValues;

                            let tempObj = uploadParamsQuestionsNote[index];

                            let result = fetch(tempObj[keyName], {
                                method: 'PUT',
                                body: blobField
                            });

                        }


                        if (Array.isArray(uploadParamsAnswerOptions)) {

                            for (let index = 0; index < uploadParamsAnswerOptions.length; index++) {

                                let keyNameArr = Object.keys(uploadParamsAnswerOptions[index]);
                                let keyName = keyNameArr[1];

                                let blobField = fileValues[index];

                                let tempObjFile = uploadParamsAnswerOptions[index];

                                let result = fetch(tempObjFile[keyName], {
                                    method: 'PUT',
                                    body: blobField
                                });

                            }

                            const MySwal = withReactContent(Swal);

                            MySwal.fire({
                                title: sessionStorage.getItem('click_event') === 'Save' ? 'Question Saved!' : 'Question Submitted!',
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

                                let blobField = fileValues[index];

                                let tempObjFile = uploadParamsAnswerOptions[index];

                                let result = fetch(tempObjFile[keyName], {
                                    method: 'PUT',
                                    body: blobField
                                });
                            }

                            const MySwal = withReactContent(Swal);
                            MySwal.fire({

                                title: 'Question Saved!',
                                icon: 'success',
                            }).then((willDelete) => {

                                history.push('/admin-portal/active-questions');
                                // window.location.reload();

                            })

                            console.log('Question Voice Note not uploaded');
                        }
                    }


                } else {
                    hideLoader();

                }
            })
            .catch((error) => {
                if (error.response) {
                    hideLoader();

                    if (error.response.data === "Question Label Already Exist!") {
                        setQuestionLabelAlreadyExists(true);
                    }

                } else if (error.request) {
                    hideLoader();

                } else {
                    hideLoader();
                }
            });
    }

    return (
        <>
            {

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
                                    question_label: '',
                                    marks: '',
                                    submit: null
                                }}

                                validationSchema={Yup.object().shape({
                                    question_label: Yup.string()
                                        .trim()
                                        .min(2, 'Question Label is too short!')
                                        .max(51, 'Question Label is too long!')
                                        .required('Question Label required!'),
                                    marks: Yup.string()
                                        .trim()
                                        .required('Marks required!'),
                                })}

                                onSubmit={async (values, { setErrors, setStatus, setSubmitting, }) => {

                                    setSubmitting(true);

                                    if (sessionStorage.getItem('click_event') === "" || sessionStorage.getItem('click_event') === undefined || sessionStorage.getItem('click_event') === "undefined" || sessionStorage.getItem('click_event') === null) {

                                    } else {
                                        if (questionLabelValue === "" || questionLabelValue === undefined || questionLabelValue === "undefined") {
                                            setQuestionLabelErr(true);
                                        } else if (isEmptyArray(selectedQuestionType)) {
                                            setQuestionTypeErrMsg(true);
                                        } else if (isEmptyArray(selectedQuestionCategory)) {
                                            setQuestionCategoryErrMsg(true);
                                        } else if (isEmptyArray(selectedQuestionCognitiveSkill)) {
                                            setQuestionCognitiveSkillErrMsg(true);
                                        } else if (isEmptyArray(selectedQuestionSource)) {
                                            setQuestionSourceErrMsg(true);
                                        } else if (_radioWorkSheetOrTest === true && (selectedDifficultyLevel === '' || selectedDifficultyLevel === undefined)) {
                                            setIsDefficultyLevelErr(true)
                                        } else if (articleDataTitle === "" || articleDataTitle === undefined || articleDataTitle === 'undefined' || articleDataTitle === "<p><br></p>" || articleDataTitle === "<p></p>" || articleDataTitle === "<br>") {
                                            setQuestionEmptyErrMsg(true);
                                        } else if (articleDataTitle2 === "" || articleDataTitle2 === undefined || articleDataTitle2 === 'undefined' || articleDataTitle2 === "<p><br></p>" || articleDataTitle2 === "<p></p>" || articleDataTitle2 === "<br>") {
                                            setQuestionEmptyErrMsg2(true);
                                        // } else if (articleDataTitle3 === "" || articleDataTitle3 === undefined || articleDataTitle3 === 'undefined' || articleDataTitle3 === "<p><br></p>" || articleDataTitle3 === "<p></p>" || articleDataTitle3 === "<br>") {
                                        //     setQuestionEmptyErrMsg3(true);
                                        }
                                        else if (selectedQuestionType === 'Descriptive') {
                                          
                                            let payLoad = {
                                                question_type: selectedQuestionType,
                                                question_category: selectedQuestionCategory,
                                                question_source: selectedQuestionSource,
                                                cognitive_skill: selectedQuestionCognitiveSkill,
                                                question_voice_note: selectedQuestionVoiceNote,
                                                question_content: articleDataTitle,
                                                answers_of_question: descriptiveAnswerOptionsForm,
                                                question_status: sessionStorage.getItem('click_event'),
                                                question_disclaimer: selectedValueDisclaimer,
                                                show_math_keyboard: showMathKeyboard,
                                                appears_in: workSheetOrTest,
                                                question_label: questionLabelValue,
                                                // display_answer: values.descriptive_answer,
                                                display_answer: articleDataTitle3,
                                                marks: values.marks,
                                                difficulty_level: _radioWorkSheetOrTest ? selectedDifficultyLevel : 'N.A',
                                                // answer_explanation: values.answer_explanation === undefined || values.answer_explanation === "undefined" || values.answer_explanation === "" ? "N.A." : values.answer_explanation
                                                answer_explanation: articleDataTitle2

                                            }

                                            if (articleDataTitle3 === "" || articleDataTitle3 === undefined || articleDataTitle3 === 'undefined' || articleDataTitle3 === "<p><br></p>" || articleDataTitle3 === "<p></p>" || articleDataTitle3 === "<br>") {
                                                setDescriptiveAnswerErrMsg(true);
                                            } else {

                                                if (Number(values.marks) < 0) {
                                                    setNegativeMarksErrMsg(true);
                                                } else {

                                                    let answerTypeSelected = descriptiveAnswerOptionsForm.filter(value => (value.answer_type === '' || value.answer_type === 'N.A.' || value.answer_type === 'Select...' || value.answer_type === 'undefined' || value.answer_type === undefined) && sessionStorage.getItem('click_event') === 'Submit');

                                                    if (answerTypeSelected.length === 0) {      
                                                        let keywordsGiven = descriptiveAnswerOptionsForm.filter(value => (value.answer_content === '' || value.answer_content === 'N.A.' || value.answer_content === 'undefined' || value.answer_content === undefined) && sessionStorage.getItem('click_event') === 'Submit');

                                                        if (keywordsGiven.length === 0) {

                                                            if (sessionStorage.getItem('click_event') === 'Submit') {

                                                                let weightageGiven = descriptiveAnswerOptionsForm.filter(value => (value.answer_weightage === '' || value.answer_weightage === 'N.A.' || value.answer_weightage === 'undefined' || value.answer_weightage === undefined) && sessionStorage.getItem('click_event') === 'Submit');
                                                               
                                                                if (weightageGiven.length === 0) {

                                                                    let sumOfAllWeightage = descriptiveAnswerOptionsForm.reduce((acc, item) => acc + Number(item.answer_weightage), 0);
                                                                    let allEqual = sumOfAllWeightage === Number(values.marks);

                                                                    console.log("allEqual", allEqual);

                                                                    if (allEqual) {
                                                                       showLoader();
                                                                        _addQuestions(payLoad);
                                                                    } else {
                                                                        setMismatchWeightageErr(true);
                                              
                                                                    }

                                                                } else {
                                                                    setWeightageEmpty(true);
                                                                }

                                                            } else {
                                                                showLoader();
                                                                _addQuestions(payLoad);
                                                            }

                                                        } else {
                                                            setKeyWordsEmptyErr(true);
                                                        }

                                                    } else {
                                                        setAnswerTypeEmptyErr(true);
                                                    }

                                                }
                                            }

                                        } else if (selectedQuestionType === 'Subjective' || selectedQuestionType === 'Objective') {

                                            let payLoad = {
                                                question_type: selectedQuestionType,
                                                question_category: selectedQuestionCategory,
                                                question_source: selectedQuestionSource,
                                                cognitive_skill: selectedQuestionCognitiveSkill,
                                                question_voice_note: selectedQuestionVoiceNote,
                                                question_content: articleDataTitle,
                                                answers_of_question: answerOptionsForm,
                                                question_status: sessionStorage.getItem('click_event'),
                                                question_disclaimer: selectedValueDisclaimer,
                                                show_math_keyboard: showMathKeyboard,
                                                appears_in: workSheetOrTest,
                                                question_label: questionLabelValue,
                                                display_answer: "N.A.",
                                                marks: values.marks,
                                                difficulty_level: _radioWorkSheetOrTest ? selectedDifficultyLevel : 'N.A',
                                                // answer_explanation: values.answer_explanation === undefined || values.answer_explanation === "undefined" || values.answer_explanation === "" ? "N.A." : values.answer_explanation
                                                answer_explanation: articleDataTitle2
                                            };

                                            console.log("payLoad", payLoad);

                                            let tempAnsWeightage = answerOptionsForm.filter(value => value.answer_weightage < 0);
                                            let tempUnitWeightage = answerOptionsForm.filter(value => value.unit_weightage < 0);
                                            console.log("selectedDifficultyLevel", selectedDifficultyLevel);

                                            if (Number(values.marks) < 0) {
                                                setNegativeMarksErrMsg(true);
                                            } else if (tempAnsWeightage.length !== 0) {
                                                setAnsWeightageErrMsg(true);
                                            } else if (_radioWorkSheetOrTest === true && (selectedDifficultyLevel === '' || selectedDifficultyLevel === undefined)) {
                                                setIsDefficultyLevelErr(true);
                                            } else if (tempUnitWeightage.length !== 0) {
                                                setUnitWeightageErrMsg(true);
                                            } else {

                                                let answerTypeSelected = answerOptionsForm.filter(value => (value.answer_type === '' || value.answer_type === 'N.A.' || value.answer_type === 'Select...' || value.answer_type === 'undefined' || value.answer_type === undefined) && sessionStorage.getItem('click_event') === 'Submit');

                                                if (answerTypeSelected.length === 0) {

                                                    let placegolderSelected = answerOptionsForm.filter(value => (value.answer_option === '' || value.answer_option === 'N.A.' || value.answer_option === 'Select...' || value.answer_option === 'undefined' || value.answer_option === undefined) && sessionStorage.getItem('click_event') === 'Submit');

                                                    if (placegolderSelected.length === 0) {

                                                        let answersGiven = answerOptionsForm.filter(value => (value.answer_content === '' || value.answer_content === 'N.A.' || value.answer_content === 'undefined' || value.answer_content === undefined) && sessionStorage.getItem('click_event') === 'Submit');

                                                        if (answersGiven.length === 0) {

                                                            if (sessionStorage.getItem('click_event') === 'Submit') {

                                                                let weightageGiven = answerOptionsForm.filter(value => (value.answer_weightage === '' || value.answer_weightage === 'N.A.' || value.answer_weightage === 'undefined' || value.answer_weightage === undefined) && sessionStorage.getItem('click_event') === 'Submit');

                                                                if (weightageGiven.length === 0) {

                                                                    if (selectedQuestionType === 'Objective') {

                                                                        let sumOfAllWeightage = answerOptionsForm.filter(item => item.answer_display === "Yes").reduce((acc, item) => acc + Number(item.answer_weightage), 0);

                                                                        let allEqual = sumOfAllWeightage === Number(values.marks);
                                                                        console.log("allEqual", allEqual);

                                                                        if (allEqual) {
                                                                            if (isDuplicatePresent) {
                                                                                console.log("Duplicates are present, skip form submission");
                                                                                Swal.fire({
                                                                                    title: 'Duplicates Found',
                                                                                    text: 'Duplicate values are present between $$ markers in Question Field',
                                                                                    icon: 'warning',
                                                                                });
                                                                                return;
                                                                            } else {
                                                                                showLoader();
                                                                                _addQuestions(payLoad);
                                                                            }
                                                                        } else {
                                                                            setMismatchWeightageErr(true);
                                                                        }
                                                                    } else {

                                                                        console.log("answerBlanksOptions", answerBlanksOptions.map(value => value.value));
                                                                        console.log("answerOptionsForm", answerOptionsForm.map(value => value.answer_option));

                                                                        let allOptionsPresent = answerBlanksOptions.map(value => value.value).every(item => answerOptionsForm.map(value => value.answer_option).includes(item));

                                                                        console.log("allOptionsPresent", allOptionsPresent);

                                                                        if (allOptionsPresent) {
                                                                            if (isDuplicatePresent) {

                                                                                console.log("Duplicates are present, skip form submission");
                                                                                Swal.fire({
                                                                                    title: 'Duplicates Found',
                                                                                    text: 'Duplicate values are present between $$ markers in Question Field',
                                                                                    icon: 'warning',
                                                                                });
                                                                                return
                                                                            } else {
                                                                                showLoader();
                                                                                _addQuestions(payLoad);
                                                                            }
                                                                        } else {
                                                                            setBlanksMismatchErr(true);
                                                                        }

                                                                    }

                                                                } else {
                                                                    setWeightageEmpty(true);
                                                                }

                                                            } else {

                                                                if (isDuplicatePresent) {

                                                                    console.log("Duplicates are present, skip form submission");
                                                                    Swal.fire({
                                                                        title: 'Duplicates Found',
                                                                        text: 'Duplicate values are present between $$ markers in Question Field',
                                                                        icon: 'warning',
                                                                    });
                                                                    return
                                                                } else {
                                                                    showLoader();
                                                                    _addQuestions(payLoad);
                                                                }
                                                            }

                                                        } else {
                                                            setAnswersEmptyErr(true);
                                                        }

                                                    } else {
                                                        setOptionsEmptyErr(true);
                                                    }

                                                } else {
                                                    setAnswerTypeEmptyErr(true);
                                                }
                                            }
                                        } else {
                                            console.log("Invalid option!");
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
                                                    name="questionType"
                                                    options={questionTypeOptions}
                                                    className="basic-multi-select"
                                                    classNamePrefix="Select"
                                                    onChange={(event) => {
                                                        handleQuestionType(event)
                                                        setFieldValue('answer_type', '')
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
                                                    onClick={() => {
                                                        setQuestionVoiceNote('');
                                                    }}
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
                                                <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-top`}>This will be treated as the Question Title!</Tooltip>}>
                                                    <div>
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
                                                            onChange={e => {
                                                                handleChange(e)
                                                                handleQuestionLabel(e)
                                                            }}
                                                            placeholder="Question Label"
                                                        />
                                                    </div>
                                                </OverlayTrigger>


                                                {
                                                    touched.question_label && errors.question_label && <small className="text-danger form-text">{errors.question_label}</small>
                                                }

                                                {
                                                    questionLabelErr && (
                                                        <small className="text-danger form-text">{'Question Label is required!'}</small>
                                                    )
                                                }

                                                {
                                                    questionLabelAlreadyExists && (
                                                        <small className="text-danger form-text">{'Question Label already exists!'}</small>
                                                    )
                                                }

                                            </Col>

                                            <Col xs={6}>
                                                <label className="floating-label">
                                                    <small className="text-danger">* </small>
                                                    Question Category
                                                </label>

                                                <Select
                                                    name="questionCategory"
                                                    options={optionsCategory}
                                                    className="basic-multi-select"
                                                    classNamePrefix="Select"
                                                    onChange={(event) => {
                                                        handleCategoryChange(event)
                                                    }}
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />

                                                {questionCategoryErrMsg && (
                                                    <>
                                                        <small className="text-danger form-text">{'Please, select Question Category'}
                                                        </small>
                                                    </>
                                                )}


                                            </Col>
                                        </Row>

                                        <br />
                                        <Row>
                                            <Col xs={6}>
                                                <label className="floating-label">
                                                    <small className="text-danger">* </small>
                                                    Cognitive Skill
                                                </label>

                                                <Select
                                                    name="cognitiveSkill"
                                                    options={optionsCongnitiveSkills}
                                                    className="basic-multi-select"
                                                    classNamePrefix="Select"
                                                    onChange={(event) => {
                                                        handleCognitiveSkillChange(event)
                                                    }}
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />

                                                {questionCognitiveSkillErrMsg && (
                                                    <>
                                                        <small className="text-danger form-text">{'Please, select Cognitive Skill'}
                                                        </small>
                                                    </>
                                                )}


                                            </Col>

                                            <Col xs={6}>
                                                <label className="floating-label">
                                                    <small className="text-danger">* </small>
                                                    Question Source
                                                </label>

                                                <Select
                                                    name="questionSource"
                                                    options={optionsSource}
                                                    className="basic-multi-select"
                                                    classNamePrefix="Select"
                                                    onChange={(event) => {
                                                        handleSourceChange(event)
                                                    }}
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />

                                                {questionSourceErrMsg && (
                                                    <>
                                                        <small className="text-danger form-text">{'Please, select Question Source'}
                                                        </small>
                                                    </>
                                                )}


                                            </Col>
                                        </Row>

                                        <br />
                                        <Row>

                                            <Col>
                                                <label className="floating-label">
                                                    <small className="text-danger"></small>
                                                    Question Disclaimer
                                                </label>

                                                <Select
                                                    name="questionDisclaimer"
                                                    options={optionsDisclaimer}
                                                    className="basic-multi-select"
                                                    classNamePrefix="Select"
                                                    onChange={(event) => {
                                                        handleDisclaimerChange(event)
                                                    }}
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />

                                                {/* {errorMessageDisclaimer && (
                                                        <>
                                                            <small className="text-danger form-text">{'Please select Disclaimer'}</small>
                                                        </>
                                                    )} */}


                                            </Col>
                                            <Col></Col>

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
                                                            id={`radio-mathKeyboard`}
                                                            // label="Yes"
                                                            error={touched.mathKeyboard && errors.mathKeyboard}
                                                            type="switch"
                                                            variant={'outline-primary'}
                                                            name="radio-mathKeyboard"
                                                            checked={_radioShowMathKeyboard}
                                                            onChange={(e) => handleShowMathKeyboard(e)}
                                                        // className='ml-3 col-md-6'
                                                        /> &nbsp;

                                                        <Form.Label className="profile-view-question" id={`radio-mathKeyboard`}>
                                                            {_radioShowMathKeyboard === true ? 'Yes' : 'No'}
                                                        </Form.Label>
                                                    </div>
                                                </div>
                                            </Col>

                                            {/* <Col>
                                                <label className="floating-label">
                                                    <small className="text-danger"></small>
                                                    Question Appears in
                                                </label>

                                                <div className="col">
                                                    <div className="row profile-view-radio-button-view">
                                                        <Form.Check
                                                            id={`radio-fresher`}
                                                            error={touched.fresher && errors.fresher}
                                                            type="switch"
                                                            variant={'outline-primary'}
                                                            name="radio-fresher"
                                                            checked={_radioWorkSheetOrTest}
                                                            onChange={(e) => {
                                                                handleWorkSheetOrTest(e);
                                                                setSelectedDifficultyLevel('');
                                                                setIsDefficultyLevelErr(false)
                                                            }}
                                                        /> &nbsp;

                                                        <Form.Label className="profile-view-question" id={`radio-fresher`}>
                                                            {_radioWorkSheetOrTest === true ? 'Worksheet/Test' : 'Pre/Post'}
                                                        </Form.Label>
                                                    </div>
                                                </div>

                                            </Col> */}

<Col>
    <label className="floating-label">
        <small className="text-danger"></small>
        Question Appears in
    </label>
    <div className="col">
        <div  className="row profile-view-checkbox-view">
            <Form.Check 
                type="checkbox" 
                id="checkbox-preOrPost" 
                label="Pre/Post" 
                value="preOrPost"
                className="blue-checkbox"
                checked={workSheetOrTest.includes('preOrPost')}
                onChange={handleWorkSheetOrTest}
            />
            &nbsp;

            <Form.Check 
                type="checkbox" 
                id="checkbox-worksheetOrTest" 
                label="Worksheet/Test" 
                value="worksheetOrTest"
                className="blue-checkbox"
                checked={workSheetOrTest.includes('worksheetOrTest')}
                onChange={handleWorkSheetOrTest}
            />
        </div>
    </div>
</Col>
                                        </Row>
                                        <br />
                                        {
                                            _radioWorkSheetOrTest && (
                                                <>
                                                    <Row>
                                                        <Col sm={6}>

                                                            <div className="form-group fill" style={{ position: 'relative', zIndex: 10 }}>
                                                                <label className="floating-label" >
                                                                    <small className="text-danger">* </small>
                                                                    Level of Difficulty
                                                                </label>
                                                                <Select
                                                                    className="basic-single"
                                                                    classNamePrefix="select"
                                                                    name="color"
                                                                    options={difficultylevel}
                                                                    onChange={(e) => {
                                                                        setSelectedDifficultyLevel(e.value);
                                                                        setIsDefficultyLevelErr(false)
                                                                    }}
                                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}

                                                                />
                                                            </div>
                                                            {isDefficultyLevelErr && (
                                                                <small style={{ color: 'red' }}>Field required!</small>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </>
                                            )
                                        }
                                        <br />
                                        <Row>
                                            <Col>
                                                <label className="floating-label">
                                                    <small className="text-danger">* </small>
                                                    Question
                                                </label>

                                                <ArticleRTE
                                                    onChildStateChange={handleChildStateChange}////
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

                                        {(selectedQuestionType === 'Subjective' || selectedQuestionType === 'Objective' || selectedQuestionType === 'Descriptive') && (
                                            <>

                                                <Row>

                                                    <Col xs={6}>
                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Marks
                                                        </label>
                                                        <input
                                                            value={values.marks}
                                                            className="form-control"
                                                            error={touched.marks && errors.marks}
                                                            label="marks"
                                                            name="marks"
                                                            onBlur={handleBlur}
                                                            onChange={e => {
                                                                handleChange(e);
                                                                setNegativeMarksErrMsg(false);
                                                            }}
                                                            type="number"
                                                            min="0.01"
                                                            placeholder="Enter the total marks this question carries"
                                                            // onWheel={e => e.preventDefault()}
                                                            onWheel={(e) => e.target.blur()}

                                                        />

                                                        {
                                                            touched.marks && errors.marks &&
                                                            <small className="text-danger form-text">{errors.marks}</small>
                                                        }

                                                        {
                                                            negativeMarksErrMsg &&
                                                            <small className="text-danger form-text">{'Invalid Marks'}</small>
                                                        }

                                                    </Col>
                                                </Row>
                                            </>
                                        )}

                                        {(selectedQuestionType === 'Subjective' || selectedQuestionType === 'Objective') && (
                                            <>
                                                <br />
                                                {answerOptionsForm.map((form, index) => {

                                                    return (
                                                        <Card
                                                            className="shadow p-3 mb-5 bg-white rounded"
                                                            style={{ backgroundColor: "rgb(224 238 255)" }}>

                                                            <Card.Body style={{ backgroundColor: "rgb(224 238 255)" }}>

                                                                <Row>
                                                                    <Col xs={6}>
                                                                        <label className="floating-label">
                                                                            <small className="text-danger"></small>
                                                                            Answer Type
                                                                        </label>

                                                                        <select
                                                                            className="form-control"
                                                                            error={touched.answer_type && errors.answer_type}
                                                                            name="answer_type"
                                                                            onBlur={handleBlur}
                                                                            type="text"
                                                                            value={form.answer_type}
                                                                            onChange={event => handleAnswerBlanks(event, index)}
                                                                            id={`ans-type-${index}`}
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

                                                                    {(answerOptionsForm.length > 1 || form.answer_type === "Select...") && (
                                                                        <Col xs={6}>
                                                                            <Row>
                                                                                <Col></Col>
                                                                                <Col>
                                                                                    <CloseButton onClick={() => {
                                                                                        removeAnswerTypeOptions(index)
                                                                                    }} variant="white" />
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                    )}
                                                                </Row>

                                                                {form.answer_type === 'Words' && answerBlanksOptions && (

                                                                    <>
                                                                        <br />
                                                                        <Row key={index}>

                                                                            <Col xs={3}>
                                                                                <label className="floating-label">
                                                                                    <small className="text-danger"></small>
                                                                                    Placeholder
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

                                                                                {
                                                                                    selectedQuestionType === 'Objective' ? (
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Correct Answer
                                                                                        </label>
                                                                                    ) : (
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Answer Display
                                                                                        </label>
                                                                                    )
                                                                                }

                                                                                <select
                                                                                    className="form-control"
                                                                                    error={touched.answer_display && errors.answer_display}
                                                                                    name="answer_display"
                                                                                    onBlur={handleBlur}
                                                                                    placeholder="Select..."
                                                                                    type="text"
                                                                                    value={form.answer_display}
                                                                                    key={index}
                                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                                >

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
                                                                                    onWheel={(e) => e.target.blur()}
                                                                                />
                                                                            </Col>

                                                                        </Row>

                                                                    </>

                                                                )}

                                                                {form.answer_type === "Equation" && answerBlanksOptions && (

                                                                    <>
                                                                        <br />
                                                                        <Row key={index}>

                                                                            <Col xs={3}>
                                                                                <label className="floating-label">
                                                                                    <small className="text-danger"></small>
                                                                                    Placeholder
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
                                                                                {
                                                                                    selectedQuestionType === 'Objective' ? (
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Correct Answer
                                                                                        </label>
                                                                                    ) : (
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Answer Display
                                                                                        </label>
                                                                                    )
                                                                                }

                                                                                <select
                                                                                    className="form-control"
                                                                                    error={touched.answer_display && errors.answer_display}
                                                                                    name="answer_display"
                                                                                    onBlur={handleBlur}
                                                                                    placeholder="Select..."
                                                                                    type="text"
                                                                                    value={form.answer_display}
                                                                                    key={index}
                                                                                    onChange={(event) => {

                                                                                        handleAnswerBlanks(event, index)
                                                                                    }}
                                                                                >

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
                                                                                    onWheel={(e) => e.target.blur()}
                                                                                />
                                                                            </Col>

                                                                        </Row>

                                                                        <br />
                                                                        <Row>
                                                                            <Col xs={12}>
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
                                                                                    }}
                                                                                    placeholder="Enter Equation"
                                                                                    style={{
                                                                                        height: '250px',
                                                                                        resize: 'vertical',
                                                                                        fontSize: '14px',
                                                                                        lineHeight: '1.5',

                                                                                    }}
                                                                                />

                                                                            </Col>
                                                                        </Row>

                                                                        <br />
                                                                        <Row>
                                                                            <Col xs={12}>
                                                                                <label className="floating-label">
                                                                                    <small className="text-danger"></small>
                                                                                    Preview
                                                                                </label>
                                                                                <div className="preview-container" style={{
                                                                                    maxHeight: '100px',
                                                                                    overflowY: 'auto',
                                                                                    overflowX: 'auto',
                                                                                    resize: 'vertical',
                                                                                    whiteSpace: 'pre-wrap',
                                                                                    backgroundColor: '#f5f5f5',
                                                                                }}>
                                                                                    {equation.length >= 1 && form.answer_content && (
                                                                                        <MathJax.Provider>
                                                                                            {equation[index] && (
                                                                                                <div style={{
                                                                                                    fontSize: '14px',
                                                                                                    fontWeight: 'normal',
                                                                                                    marginBottom: '10px',
                                                                                                    marginTop: '10px',
                                                                                                    fontFamily: 'Arial'
                                                                                                }}>
                                                                                                    <MathJax.Node formula={equation[index]}

                                                                                                    />
                                                                                                </div>
                                                                                            )}
                                                                                        </MathJax.Provider>
                                                                                    )}
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                        {/* ////////////////////////////////////////////////// */}

                                                                        {/* <Row>
                                                                            <Col xs={12}>
                                                                                <label className="floating-label">
                                                                                    <small className="text-danger"></small>
                                                                                    Preview
                                                                                </label>
                                                                                <div className="preview-container" style={{
                                                                                    maxHeight: '100px',
                                                                                    overflowY: 'auto',
                                                                                    // overflowX: 'auto',
                                                                                    resize: 'vertical',
                                                                                    whiteSpace: 'pre-wrap',
                                                                                    backgroundColor: '#f5f5f5',
                                                                                }}>
                                                                                    {equation.length >= 1 && form.answer_content && (
                                                                                        <MathJax.Provider options={{
                                                                                            tex: {
                                                                                                packages: { '[+]': ['base', 'autoload-all'] },
                                                                                                inlineMath: [['$', '$'], ['\\(', '\\)']],
                                                                                                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                                                                                                processEscapes: true
                                                                                            },
                                                                                            'HTML-CSS': {
                                                                                                linebreaks: { automatic: true }
                                                                                            }
                                                                                        }}>
                                                                                            {equation[index] && (
                                                                                                <div style={{
                                                                                                    fontSize: '14px',
                                                                                                    fontWeight: 'normal',
                                                                                                    marginBottom: '10px',
                                                                                                    marginTop: '10px',
                                                                                                    fontFamily: 'Arial'
                                                                                                }}>
                                                                                                    <MathJax.Node formula={equation[index]} />
                                                                                                </div>
                                                                                            )}
                                                                                        </MathJax.Provider>
                                                                                    )}
                                                                                </div>
                                                                            </Col>
                                                                        </Row> */}

                                                                    </>

                                                                )}

                                                                {form.answer_type === "Numbers" && answerBlanksOptions && (

                                                                    <>
                                                                        <br />
                                                                        <Row key={index}>

                                                                            <Col xs={3}>
                                                                                <label className="floating-label">
                                                                                    <small className="text-danger"></small>
                                                                                    Placeholder
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

                                                                                    {selectedQuestionType === 'Objective' ?
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
                                                                                    onWheel={(e) => e.target.blur()}
                                                                                    value={values.answer_content}
                                                                                    onChange={event => handleAnswerBlanks(event, index)}
                                                                                    placeholder="Enter Answer"
                                                                                />
                                                                            </Col>

                                                                            <Col>

                                                                                {
                                                                                    selectedQuestionType === 'Objective' ? (
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Correct Answer
                                                                                        </label>
                                                                                    ) : (
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Answer Display
                                                                                        </label>
                                                                                    )
                                                                                }

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
                                                                                    onWheel={(e) => e.target.blur()}
                                                                                />
                                                                            </Col>

                                                                        </Row>

                                                                        {selectedQuestionType === 'Subjective' && (
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
                                                                                            onWheel={(e) => e.target.blur()}
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
                                                                                            onWheel={(e) => e.target.blur()}
                                                                                            value={values.answer_range_to}
                                                                                            onChange={event => handleAnswerBlanks(event, index)}
                                                                                            placeholder="To"
                                                                                        />
                                                                                    </Col>
                                                                                </Row>
                                                                            </>
                                                                        )}

                                                                    </>

                                                                )}

                                                                {form.answer_type === "Alpha Numeric" && answerBlanksOptions && (

                                                                    <>

                                                                        {selectedQuestionType === 'Subjective' ? (
                                                                            <>
                                                                                <br />
                                                                                <Row key={index}>

                                                                                    <Col xs={3}>
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Placeholder
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

                                                                                            {selectedQuestionType === 'Objective' ?
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
                                                                                            onWheel={(e) => e.target.blur()}
                                                                                            value={values.answer_content}
                                                                                            onChange={event => handleAnswerBlanks(event, index)}
                                                                                            placeholder="Enter Answer"
                                                                                        />
                                                                                    </Col>

                                                                                    <Col xs={4}>
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Unit
                                                                                        </label>

                                                                                        <input
                                                                                            className="form-control"
                                                                                            error={touched.answer_unit && errors.answer_unit}
                                                                                            label="answer_unit"
                                                                                            name="answer_unit"
                                                                                            onBlur={handleBlur}
                                                                                            type="text"
                                                                                            value={values.answer_unit}
                                                                                            onChange={event => handleAnswerBlanks(event, index)}
                                                                                            placeholder="Enter Unit"
                                                                                        />

                                                                                    </Col>
                                                                                </Row>

                                                                                <br />
                                                                                <Row>

                                                                                    <Col>
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Weightage for Answer
                                                                                        </label>
                                                                                        <input
                                                                                            className="form-control"
                                                                                            error={touched.answer_weightage && errors.answer_weightage}
                                                                                            label="answer_weightage"
                                                                                            name="answer_weightage"
                                                                                            onBlur={handleBlur}
                                                                                            // onChange={handleChange}
                                                                                            type="number"
                                                                                            onWheel={(e) => e.target.blur()}
                                                                                            min="0.01"
                                                                                            value={form.answer_weightage}
                                                                                            onChange={event => handleAnswerBlanks(event, index)}
                                                                                            placeholder="Enter Weightage for Answer"

                                                                                        />
                                                                                    </Col>

                                                                                    <Col>
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Weightage for Unit
                                                                                        </label>
                                                                                        <input
                                                                                            className="form-control"
                                                                                            error={touched.unit_weightage && errors.unit_weightage}
                                                                                            label="unit_weightage"
                                                                                            name="unit_weightage"
                                                                                            onBlur={handleBlur}
                                                                                            // onChange={handleChange}
                                                                                            type="number"
                                                                                            min="0.01"
                                                                                            value={form.unit_weightage}
                                                                                            onChange={event => handleAnswerBlanks(event, index)}
                                                                                            placeholder="Enter Weightage for Unit"
                                                                                            onWheel={(e) => e.target.blur()}
                                                                                        />
                                                                                    </Col>

                                                                                    <Col>

                                                                                        {selectedQuestionType === 'Objective' ? (
                                                                                            <label className="floating-label">
                                                                                                <small className="text-danger"></small>
                                                                                                Correct Answer
                                                                                            </label>
                                                                                        ) : (
                                                                                            <label className="floating-label">
                                                                                                <small className="text-danger"></small>
                                                                                                Answer Display
                                                                                            </label>
                                                                                        )
                                                                                        }

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

                                                                                </Row>

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
                                                                                            onWheel={(e) => e.target.blur()}
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
                                                                                            onWheel={(e) => e.target.blur()}
                                                                                            value={values.answer_range_to}
                                                                                            onChange={event => handleAnswerBlanks(event, index)}
                                                                                            placeholder="To"
                                                                                        />
                                                                                    </Col>
                                                                                </Row>
                                                                            </>
                                                                        ) : (

                                                                            <>
                                                                                <br />
                                                                                <Row key={index}>

                                                                                    <Col xs={3}>
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Placeholder
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

                                                                                            {selectedQuestionType === 'Objective' ?
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
                                                                                            type="text"
                                                                                            value={values.answer_content}
                                                                                            onChange={event => handleAnswerBlanks(event, index)}
                                                                                            placeholder="Enter Answer"
                                                                                        />
                                                                                    </Col>

                                                                                    <Col>

                                                                                        {selectedQuestionType === 'Objective' ? (
                                                                                            <label className="floating-label">
                                                                                                <small className="text-danger"></small>
                                                                                                Correct Answer
                                                                                            </label>
                                                                                        ) : (
                                                                                            <label className="floating-label">
                                                                                                <small className="text-danger"></small>
                                                                                                Answer Display
                                                                                            </label>
                                                                                        )
                                                                                        }

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
                                                                                            onWheel={(e) => e.target.blur()}
                                                                                        />
                                                                                    </Col>

                                                                                </Row>
                                                                            </>
                                                                        )}

                                                                    </>

                                                                )}

                                                                {form.answer_type === "Image" && answerBlanksOptions && (

                                                                    <>
                                                                        <br />
                                                                        <Row key={index}>

                                                                            <Col xs={3}>
                                                                                <label className="floating-label">
                                                                                    <small className="text-danger"></small>
                                                                                    Placeholder
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

                                                                                {
                                                                                    selectedQuestionType === 'Objective' ? (
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Correct Answer
                                                                                        </label>
                                                                                    ) : (
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Answer Display
                                                                                        </label>
                                                                                    )
                                                                                }

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
                                                                                    onWheel={(e) => e.target.blur()}
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
                                                                                    onClick={() => {
                                                                                        let tempPreviewImg = [...previewImages];
                                                                                        tempPreviewImg[index] = '';
                                                                                        setPreviewImages(tempPreviewImg);

                                                                                        // let tempFileValue = [...fileValues];
                                                                                        // tempFileValue[count] = '';
                                                                                        // setFileValues(tempFileValue);

                                                                                        // let data = [...answerOptionsForm];
                                                                                        // data[index]["answer_content"] = "";
                                                                                        // console.log(data);
                                                                                        // setAnswerOptionsForm(data);

                                                                                        // let tempCount = count - 1;
                                                                                        // setCount(tempCount);
                                                                                    }}
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

                                                                {form.answer_type === 'Audio File' && answerBlanksOptions && (

                                                                    <>
                                                                        <br />
                                                                        <Row key={index}>

                                                                            <Col xs={3}>
                                                                                <label className="floating-label">
                                                                                    <small className="text-danger"></small>
                                                                                    Placeholder
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

                                                                                {
                                                                                    selectedQuestionType === 'Objective' ? (
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Correct Answer
                                                                                        </label>
                                                                                    ) : (
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Answer Display
                                                                                        </label>
                                                                                    )
                                                                                }

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
                                                                                    onWheel={(e) => e.target.blur()}
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
                                                                                    onClick={() => {
                                                                                        let tempPreviewAudio = [...previewAudios];
                                                                                        tempPreviewAudio[index] = '';
                                                                                        setPreviewAudios(tempPreviewAudio);

                                                                                        // let tempFileValue = [...fileValues];
                                                                                        // tempFileValue[count] = '';
                                                                                        // setFileValues(tempFileValue);

                                                                                        // let data = [...answerOptionsForm];
                                                                                        // data[index]["answer_content"] = "";
                                                                                        // console.log(data);
                                                                                        // setAnswerOptionsForm(data);

                                                                                        // let tempCount = count - 1;
                                                                                        // setCount(tempCount);
                                                                                    }}
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
                                                                <br />
                                                            </Card.Body>
                                                        </Card>
                                                    )
                                                })}

                                                <Row className="my-3">
                                                    <Col></Col>
                                                    <Col></Col>
                                                    <Col>
                                                        <button onClick={addAnswerTypeOptions} className="float-right">+</button>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}

                                        {selectedQuestionType === 'Descriptive' && (
                                            <>

                                                <br />
                                                <Row>
                                                    <Col xs={12}>
                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Answer to Display
                                                        </label>
                                                        {/* <textarea
                                                            rows="5"
                                                            cols="80"
                                                            value={values.descriptive_answer}
                                                            className="form-control"
                                                            error={touched.descriptive_answer && errors.descriptive_answer}
                                                            label="descriptive_answer"
                                                            name="descriptive_answer"
                                                            onBlur={handleBlur}
                                                            type="textarea"
                                                            onChange={e => {
                                                                handleChange(e)
                                                                setDescriptiveAnswerErrMsg(false)
                                                            }}
                                                            placeholder="Enter the answer to be displayed to students"
                                                        />

                                                        {descriptiveAnswerErrMsg && (
                                                            <small className="text-danger form-text">{'Answer to Display is required'}</small>
                                                        )} */}
                                                         <ArticleRTE
                                                    onChildStateChange={handleChildStateChange3}
                                                    setArticleSize={setArticleSize3}
                                                    setImageCount={setImageCount3}
                                                    imageCount={imageCount3}
                                                    articleData={articleDataTitle3}
                                                    setArticleData={setArticleDataTtitle3}
                                                    setAnswerBlanksOptions={setAnswerBlanksOptions3}
                                                    setQuestionEmptyErrMsg={setQuestionEmptyErrMsg3}
                                                />
                                                 {questionEmptyErrMsg3 && (
                                                    <small className="text-danger form-text">{'Answer to Display is required!'}</small>
                                                )}
                                                    </Col>


                                                </Row>

                                                <br />
                                                <Row>
                                                    <Col xs={12}>
                                                        <label className="floating-label">
                                                            <small className="text-danger"></small>
                                                            Keywords
                                                        </label>

                                                        {descriptiveAnswerOptionsForm.map((form, index) => {

                                                            console.log(descriptiveAnswerOptionsForm);

                                                            return (

                                                                <Card
                                                                    className="shadow p-3 mb-5 bg-white rounded"
                                                                    style={{ backgroundColor: "rgb(224 238 255)" }}>

                                                                    <Card.Body style={{ backgroundColor: "rgb(224 238 255)" }}>

                                                                        <Row>
                                                                            <Col xs={2}>
                                                                                <label className="floating-label">
                                                                                    <small className="text-danger"></small>
                                                                                    Answer Type
                                                                                </label>

                                                                                <select
                                                                                    className="form-control"
                                                                                    error={touched.answer_type && errors.answer_type}
                                                                                    name="answer_type"
                                                                                    onBlur={handleBlur}
                                                                                    type="text"
                                                                                    value={form.answer_type}
                                                                                    onChange={event => handleDescriptiveAnswerBlanks(event, index)}
                                                                                >

                                                                                    <option>
                                                                                        Select...
                                                                                    </option>
                                                                                    {descriptiveAnswerTypeOptions.map((optionsData) => {

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

                                                                            {(form.answer_type === 'Phrases' || form.answer_type === 'Equation') && descriptiveAnswerOptionsForm && (
                                                                                <Col xs={2}>
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
                                                                                        onChange={event => handleDescriptiveAnswerBlanks(event, index)}
                                                                                        placeholder="Enter Weightage"
                                                                                        onWheel={(e) => e.target.blur()}
                                                                                    />
                                                                                </Col>
                                                                            )}

                                                                            {(descriptiveAnswerOptionsForm.length > 1 || form.answer_type === "Select...") && (
                                                                                <Col>
                                                                                    <Row>
                                                                                        <Col></Col>
                                                                                        <Col>
                                                                                            <CloseButton onClick={() => {
                                                                                                removeDescriptiveAnswerTypeOptions(index)
                                                                                            }} variant="white" />
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            )}
                                                                        </Row>

                                                                        <br />


                                                                        {form.answer_type === 'Phrases' && descriptiveAnswerOptionsForm && (

                                                                            <Row>
                                                                                <Col xs={6}>
                                                                                    <label className="floating-label">
                                                                                        <small className="text-danger"></small>
                                                                                        Keyword
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
                                                                                            handleDescriptiveAnswerBlanks(event, index);
                                                                                        }}
                                                                                        placeholder="Enter Keyword"
                                                                                    />
                                                                                </Col>
                                                                            </Row>

                                                                        )}


                                                                        {form.answer_type === "Equation" && descriptiveAnswerOptionsForm && (
                                                                            <>
                                                                                <Row key={index}>
                                                                                    <Col xs={12}>
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Keyword
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
                                                                                                handleDescriptiveAnswerBlanks(event, index);
                                                                                            }}
                                                                                            placeholder="Enter Keyword"
                                                                                        />
                                                                                    </Col>
                                                                                </Row>
                                                                                <br />
                                                                                <Row key={index}>
                                                                                    <Col xs={12}>
                                                                                        <label className="floating-label">
                                                                                            <small className="text-danger"></small>
                                                                                            Preview
                                                                                        </label>
                                                                                        <div
                                                                                            style={{
                                                                                                maxHeight: "200px", // Set the maximum height of the preview container
                                                                                                overflowY: "auto", // Enable vertical scrolling when content exceeds the height
                                                                                            }}
                                                                                        >
                                                                                            {descriptiveEquation.length >= 1 && form.answer_content && (
                                                                                                <MathJax.Provider>
                                                                                                    {descriptiveEquation[index] && (
                                                                                                        <div
                                                                                                            style={{
                                                                                                                display: "contents",
                                                                                                            }}
                                                                                                        >
                                                                                                            <MathJax.Node
                                                                                                                styles={{
                                                                                                                    ".MathJax_Display": {
                                                                                                                        display: "contents",
                                                                                                                    },
                                                                                                                }}
                                                                                                                inline
                                                                                                                formula={descriptiveEquation[index]}
                                                                                                            />
                                                                                                        </div>
                                                                                                    )}
                                                                                                </MathJax.Provider>
                                                                                            )}
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                            </>
                                                                        )}


                                                                    </Card.Body>
                                                                </Card>

                                                            )
                                                        })}

                                                    </Col>
                                                </Row>

                                                <Row className="my-3">
                                                    <Col></Col>
                                                    <Col></Col>
                                                    <Col>
                                                        <button onClick={addDescriptiveAnswerTypeOptions} className="float-right">+</button>
                                                    </Col>
                                                </Row>


                                            </>
                                        )}

                                        {(selectedQuestionType === 'Subjective' || selectedQuestionType === 'Objective' || selectedQuestionType === 'Descriptive') && (
                                            <>
                                                <Row>
                                                    <Col>
                                                        <label className="floating-label">
                                                            <small className="text-danger"></small>
                                                            Answer Explanation
                                                        </label>
                                                        {/* <textarea
                                                            rows="7"
                                                            value={values.answer_explanation}
                                                            className="form-control"
                                                            error={touched.answer_explanation && errors.answer_explanation}
                                                            label="answer_explanation"
                                                            name="answer_explanation"
                                                            onBlur={handleBlur}
                                                            type="textarea"
                                                            onChange={handleChange}
                                                            placeholder="Enter Answer Explanation"
                                                        /> */}
                                                <ArticleRTE
                                                    onChildStateChange={handleChildStateChange2}
                                                    setArticleSize={setArticleSize2}
                                                    setImageCount={setImageCount2}
                                                    imageCount={imageCount2}
                                                    articleData={articleDataTitle2}
                                                    setArticleData={setArticleDataTtitle2}
                                                    setAnswerBlanksOptions={setAnswerBlanksOptions2}
                                                    setQuestionEmptyErrMsg={setQuestionEmptyErrMsg2}
                                                />
                                                 {questionEmptyErrMsg2 && (
                                                    <small className="text-danger form-text">{'Answer is required!'}</small>
                                                )}
                                                    </Col>
                                                </Row>
                                            </>
                                        )}

                                        {loader}

                                        <br />
                                        <Row className="my-3">
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

                                                {unitWeightageErrMsg && (
                                                    <>
                                                        <div
                                                            style={{ color: 'red' }}
                                                            className="error">
                                                            Invalid Unit Weightage
                                                        </div>

                                                    </>
                                                )}

                                                {weightageEmpty && (
                                                    <> <div
                                                        style={{ color: 'red' }}
                                                        className="error">
                                                        Weightage cannot be empty, please fill weightage in each option!
                                                    </div></>
                                                )}

                                                {keyWordsEmptyErr && (
                                                    <> <div
                                                        style={{ color: 'red' }}
                                                        className="error">
                                                        Keywords cannot be empty, please fill Keyword in each option!
                                                    </div> </>
                                                )}

                                                {answersEmptyErr && (
                                                    <> <div
                                                        style={{ color: 'red' }}
                                                        className="error">
                                                        Answers cannot be empty, please fill Answer in each option!
                                                    </div> </>
                                                )}

                                                {mismatchWeightageErr && (
                                                    <> <div
                                                        style={{ color: 'red' }}
                                                        className="error">
                                                        The addition of all the weightage options is not equal to Marks!
                                                    </div> </>
                                                )}

                                                {optionsEmptyErr && (
                                                    <> <div
                                                        style={{ color: 'red' }}
                                                        className="error">
                                                        Placeholder cannot be empty, please select any of the options!
                                                    </div> </>
                                                )}

                                                {answerTypeEmptyErr && (
                                                    <> <div
                                                        style={{ color: 'red' }}
                                                        className="error">
                                                        Answer Type cannot be empty, please select any of the types!
                                                    </div> </>
                                                )}

                                                {blanksMismatchErr && (
                                                    <> <div
                                                        style={{ color: 'red' }}
                                                        className="error">
                                                        Options is not provided for every blank, please re-check!
                                                    </div> </>
                                                )}

                                            </Col>
                                            <Col xs={4}>
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
                                                            onClick={() => {
                                                                setKeyWordsEmptyErr(false);
                                                                setAnswersEmptyErr(false);
                                                                setOptionsEmptyErr(false);
                                                                setWeightageEmpty(false);
                                                                setBlanksMismatchErr(false);
                                                                setMismatchWeightageErr(false);
                                                                setAnswerTypeEmptyErr(false);
                                                                setBlanksMismatchErr(false);
                                                                sessionStorage.setItem('click_event', 'Save');
                                                            }}
                                                        >
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
                                                            onClick={() => {
                                                                setKeyWordsEmptyErr(false);
                                                                setAnswersEmptyErr(false);
                                                                setWeightageEmpty(false);
                                                                setBlanksMismatchErr(false);
                                                                setOptionsEmptyErr(false);
                                                                setMismatchWeightageErr(false);
                                                                setAnswerTypeEmptyErr(false);
                                                                setBlanksMismatchErr(false);
                                                                sessionStorage.setItem('click_event', 'Submit');
                                                            }}>
                                                            Submit
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>

                                    </form>
                                )}
                            </Formik>
                        </Card.Body >
                    </Card >

                </React.Fragment >
            }

        </>

    );
};

export default AddQuestions;