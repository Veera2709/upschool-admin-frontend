import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-select';
import * as Yup from 'yup';
import { Row, Col, Card, CloseButton, Form, Button, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import MathJax from "react-mathjax";

import * as Constants from '../../../../helper/constants';
import ArticleRTE from './ArticleRTE';
import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { SessionStorage } from '../../../../util/SessionStorage';
import { isEmptyArray, areFilesInvalid, voiceInvalid } from '../../../../util/utils';
import BasicSpinner from '../../../../helper/BasicSpinner';

const EditQuestions = () => {

    const history = useHistory();
    const { question_id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const threadLinks = document.getElementsByClassName('page-header');
    const [displayHeader, setDisplayHeader] = useState(true);
    const displayHeading = sessionStorage.getItem('question_active_status');
    const _questionStatus = sessionStorage.getItem('click_event');

    const questionTypeOptions = [
        { value: 'Objective', label: 'Objective' },
        { value: 'Subjective', label: 'Subjective' },
        { value: 'Descriptive', label: 'Descriptive' }
    ];

    const descriptiveAnswerTypeOptions = [
        { value: 'Phrases', label: 'Phrases' },
        { value: 'Equation', label: 'Equation' }
    ];

    const [descriptiveAnswerErrMsg, setDescriptiveAnswerErrMsg] = useState(false);
    const [questionTypeErrMsg, setQuestionTypeErrMsg] = useState(false);
    const [questionCategoryErrMsg, setQuestionCategoryErrMsg] = useState(false);
    const [questionCognitiveSkillErrMsg, setQuestionCognitiveSkillErrMsg] = useState(false);
    const [questionSourceErrMsg, setQuestionSourceErrMsg] = useState(false);
    const [questionEmptyErrMsg, setQuestionEmptyErrMsg] = useState(false);
    const [ansWeightageErrMsg, setAnsWeightageErrMsg] = useState(false);
    const [unitWeightageErrMsg, setUnitWeightageErrMsg] = useState(false);
    const [negativeMarksErrMsg, setNegativeMarksErrMsg] = useState(false);
    const [answerTypeErrMsg, setAnswerTypeErrMsg] = useState(false);

    const [selectedQuestionType, setSelectedQuestionType] = useState([]);
    const [selectedQuestionCategory, setSelectedQuestionCategory] = useState([]);
    const [selectedQuestionCognitiveSkill, setSelectedQuestionCognitiveSkill] = useState({});
    const [selectedQuestionSource, setSelectedQuestionSource] = useState({});
    const [selectedQuestionDisclaimer, setSelectedQuestionDisclaimer] = useState([]);
    const [showMathKeyboard, setShowMathKeyboard] = useState('No');
    const [workSheetOrTest, setWorkSheetOrTest] = useState('preOrPost');
    const [answerTypeOptions, setAnswerTypeOptions] = useState([]);
    const [descriptiveAnswerOptionsForm, setDescriptiveAnswerOptionsForm] = useState([]);
    const [selectedAnswerType, setSelectedAnswerType] = useState([]);
    const [questionVoiceError, setQuestionVoiceError] = useState(true);
    const [questionVoiceNote, setQuestionVoiceNote] = useState("");
    const [selectedQuestionVoiceNote, setSelectedQuestionVoiceNote] = useState("");

    const [articleSize, setArticleSize] = useState(10);
    const [imageCount, setImageCount] = useState(0);
    const [articleDataTitle, setArticleDataTtitle] = useState("");
    const [newDigicard, setnNewDigicard] = useState(false);

    const [addAnserOptions, setAddAnswerOptions] = useState(false);
    const [questionLabelErr, setQuestionLabelErr] = useState(false);
    const [questionLabelValue, setQuestionLabelValue] = useState('');

    const [descriptiveEquation, setDescriptiveEquation] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [commonPreview, setCommonPreview] = useState([]);
    const [fileValues, setFileValues] = useState([]);
    const [voiceNoteFileValues, setVoiceNoteFileValues] = useState('');
    const [previewAudios, setPreviewAudios] = useState([]);
    const [_radioShowMathKeyboard, _setRadioShowMathKeyboard] = useState(false);
    const [_radioWorkSheetOrTest, _setRadioWorkSheetOrTest] = useState(false);

    const [previousData, setPreviousData] = useState([]);
    const [count, setCount] = useState(0);

    const [newdIgicardErrMax, setNewDigicardErrMax] = useState(false);
    const [newdIgicardErrMin, setNewDigicardErrMin] = useState(false);
    const [newdIgicardErrReq, setNewDigicardErrReq] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");//for question category

    const [optionsCategory, setOptionsCategory] = useState([]);
    const [optionsCongnitiveSkills, setOptionsCongnitiveSkills] = useState([]);
    const [optionsSource, setOptionsSource] = useState([]);
    const [optionsDisclaimer, setOptionsDisclaimer] = useState([]);

    const [selectedValueDisclaimer, setSelectedValueDisclaimer] = useState('N.A.');
    const [selectedValueCategory, setSelectedValueCategory] = useState([]);
    const [selectedValueSource, setSelectedValueSource] = useState([]);
    const [selectedValueCognitiveSkill, setSelectedValueCognitiveSkill] = useState([]);

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

    useEffect(() => {

        console.log("Request : ", {
            data: {
                category_status: "Active"
            }
        });
        axios
            // .post("api-url")
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
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then(async (response) => {

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

    const IndividualQuestionData = () => {
        console.log("Options : ", optionsCategory, optionsDisclaimer, optionsCongnitiveSkills, optionsSource);
        setIsLoading(true);

        let userJWT = sessionStorage.getItem('user_jwt');

        if (userJWT === "" || userJWT === undefined || userJWT === "undefined" || userJWT === null) {

            sessionStorage.clear();
            localStorage.clear();
            history.push('/auth/signin-1');
            window.location.reload();

        } else {

            threadLinks.length === 1 ? setDisplayHeader(false) : setDisplayHeader(true);


            axios
                .post(
                    dynamicUrl.fetchIndividualQuestionData,
                    {
                        data: {
                            question_id: question_id
                        }
                    },
                    {
                        headers: { Authorization: SessionStorage.getItem('user_jwt') }
                    }
                )
                .then((response) => {

                    hideLoader();

                    if (response.data.Items[0]) {

                        let individual_user_data = response.data.Items[0];
                        console.log({ individual_user_data });
                        let selectedCategory = optionsCategory.length > 0 && optionsCategory.filter((e) => e.value === individual_user_data.question_category)
                        console.log("selectedCategory ", selectedCategory[0].value);

                        setSelectedValueCategory(selectedCategory);
                        setSelectedQuestionCategory(selectedCategory[0].value);

                        let selectedCognitiveSkill = optionsCongnitiveSkills.length > 0 && optionsCongnitiveSkills.filter((e) => e.value === individual_user_data.cognitive_skill)
                        console.log("selectedCognitiveSkill ", selectedCognitiveSkill[0].value);

                        setSelectedValueCognitiveSkill(selectedCognitiveSkill);
                        setSelectedQuestionCognitiveSkill(selectedCognitiveSkill[0].value);

                        let selectedSource = optionsSource.length > 0 && optionsSource.filter((e) => e.value === individual_user_data.question_source)
                        console.log("selectedSource ", selectedSource[0].value);

                        setSelectedValueSource(selectedSource);
                        setSelectedQuestionSource(selectedSource[0].value);

                        if (individual_user_data.question_disclaimer === "" || individual_user_data.question_disclaimer === "N.A." || isEmptyArray(individual_user_data.question_disclaimer)) {
                            console.log("Disclaimer is not selected");
                            setSelectedValueDisclaimer([]);
                            setSelectedQuestionDisclaimer([]);
                        } else {
                            console.log("Disclaimer selected else");

                            let selectedDisclaimer = optionsDisclaimer.filter((e) => e.value === individual_user_data.question_disclaimer);
                            console.log("selectedDisclaimer ", selectedDisclaimer[0].value);
                            setSelectedValueDisclaimer(selectedDisclaimer);
                            setSelectedQuestionDisclaimer(selectedDisclaimer[0].value);
                        }

                        const radioValueShowMathKeyboard = individual_user_data.show_math_keyboard === 'Yes' ? true : false;
                        const radioValueWorkSheetOrTest = individual_user_data.appears_in === 'worksheetOrTest' ? true : false;

                        setIsLoading(false);

                        setShowMathKeyboard(individual_user_data.show_math_keyboard);
                        setWorkSheetOrTest(individual_user_data.appears_in);

                        _setRadioShowMathKeyboard(radioValueShowMathKeyboard);
                        _setRadioWorkSheetOrTest(radioValueWorkSheetOrTest);

                        setSelectedQuestionType(individual_user_data.question_type);
                        setQuestionLabelValue(individual_user_data.question_label);

                        individual_user_data.question_type === 'Subjective' ? setAnswerTypeOptions([
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

                        setArticleDataTtitle(individual_user_data.question_content);

                        let uploadParams = individual_user_data.answers_of_question;
                        let object;
                        let tempArray = [];
                        let tempArrayDescriptive = [];
                        let tempCommonPreviewArr = [];
                        let tempImgPreviewArr = [];
                        let tempAudioPreviewArr = [];

                        if (Array.isArray(uploadParams)) {

                            function setValues(index) {

                                if (index < uploadParams.length) {

                                    if (uploadParams[index].answer_type === 'Numbers') {

                                        object = {
                                            answer_type: uploadParams[index].answer_type,
                                            answer_content: Number(uploadParams[index].answer_content),
                                            answer_display: uploadParams[index].answer_display,
                                            answer_option: uploadParams[index].answer_option,
                                            answer_weightage: uploadParams[index].answer_weightage,
                                            answer_range_from: Number(uploadParams[index].answer_range_from),
                                            answer_range_to: Number(uploadParams[index].answer_range_to)
                                        }

                                        tempArray.push(object);

                                    } else if (uploadParams[index].answer_type === 'Alpha Numeric') {

                                        if (individual_user_data.question_type === 'Subjective') {

                                            object = {
                                                answer_type: uploadParams[index].answer_type,
                                                answer_content: Number(uploadParams[index].answer_content),
                                                answer_unit: uploadParams[index].answer_unit,
                                                answer_display: uploadParams[index].answer_display,
                                                answer_option: uploadParams[index].answer_option,
                                                answer_weightage: uploadParams[index].answer_weightage,
                                                unit_weightage: uploadParams[index].unit_weightage,
                                                answer_range_from: Number(uploadParams[index].answer_range_from),
                                                answer_range_to: Number(uploadParams[index].answer_range_to),
                                            }

                                            tempArray.push(object);

                                        } else {

                                            object = {
                                                answer_type: uploadParams[index].answer_type,
                                                answer_content: uploadParams[index].answer_content,
                                                answer_unit: uploadParams[index].answer_unit,
                                                answer_display: uploadParams[index].answer_display,
                                                answer_option: uploadParams[index].answer_option,
                                                answer_weightage: uploadParams[index].answer_weightage,
                                                unit_weightage: uploadParams[index].unit_weightage,
                                                answer_range_from: Number(uploadParams[index].answer_range_from),
                                                answer_range_to: Number(uploadParams[index].answer_range_to),
                                            }

                                            tempArray.push(object);
                                        }


                                    } else if (uploadParams[index].answer_type === 'Phrases') {

                                        object = {
                                            answer_type: uploadParams[index].answer_type,
                                            answer_content: uploadParams[index].answer_content,
                                            answer_weightage: uploadParams[index].answer_weightage
                                        }

                                        tempArrayDescriptive.push(object)

                                    } else if (uploadParams[index].answer_type === 'Equation' && individual_user_data.question_type === 'Descriptive') {

                                        object = {
                                            answer_type: uploadParams[index].answer_type,
                                            answer_content: uploadParams[index].answer_content,
                                            answer_weightage: uploadParams[index].answer_weightage
                                        }

                                        tempArrayDescriptive.push(object)

                                    } else {

                                        object = {
                                            answer_type: uploadParams[index].answer_type,
                                            answer_content: uploadParams[index].answer_content,
                                            answer_display: uploadParams[index].answer_display,
                                            answer_option: uploadParams[index].answer_option,
                                            answer_weightage: uploadParams[index].answer_weightage
                                        }

                                        tempArray.push(object);
                                    }

                                    if (uploadParams[index].answer_type === 'Image') {

                                        let tempPreviewImg = uploadParams[index].answer_content_url;
                                        tempImgPreviewArr.push(tempPreviewImg);
                                        tempCommonPreviewArr.push(tempPreviewImg);

                                        index++;
                                        setValues(index);
                                    } else if (uploadParams[index].answer_type === 'Equation' && (individual_user_data.question_type === 'Subjective' || individual_user_data.question_type === 'Objective')) {

                                        let tempPreviewEqu = uploadParams[index].answer_content;
                                        tempCommonPreviewArr.push(tempPreviewEqu);

                                        index++;
                                        setValues(index);
                                    } else if (uploadParams[index].answer_type === 'Equation' && individual_user_data.question_type === 'Descriptive') {

                                        let tempPreviewEquDesc = uploadParams[index].answer_content;
                                        tempCommonPreviewArr.push(tempPreviewEquDesc);

                                        index++;
                                        setValues(index);
                                    } else if (uploadParams[index].answer_type === 'Audio File') {

                                        let tempPreviewAudio = uploadParams[index].answer_content_url;
                                        tempAudioPreviewArr.push(tempPreviewAudio);
                                        tempCommonPreviewArr.push(tempPreviewAudio);

                                        index++;
                                        setValues(index);
                                    } else {
                                        tempCommonPreviewArr.push("N.A.");
                                        index++;
                                        setValues(index);
                                    }

                                } else {

                                    isEmptyArray(tempArray) ? (

                                        tempArray.push(object = {
                                            answer_type: '',
                                            answer_option: '',
                                            answer_content: '',
                                            answer_display: 'No',
                                            answer_weightage: ''
                                        })

                                    ) : (console.log('Invalid Option'));

                                    isEmptyArray(tempArrayDescriptive) ? (

                                        tempArrayDescriptive.push(object = {
                                            answer_type: '',
                                            answer_content: '',
                                            answer_weightage: ''
                                        })

                                    ) : (console.log('Invalid Option'));


                                    tempArray.length >= 1 ? setAddAnswerOptions(true) : setAddAnswerOptions(false);

                                    setAnswerOptionsForm(tempArray);
                                    setDescriptiveAnswerOptionsForm(tempArrayDescriptive);
                                    setDescriptiveEquation(tempCommonPreviewArr);
                                    setCommonPreview(tempCommonPreviewArr);
                                    setPreviewImages(tempImgPreviewArr);
                                    setPreviewAudios(tempAudioPreviewArr);

                                    console.log("tempCommonPreviewArr : ", tempCommonPreviewArr);

                                    if (individual_user_data.question_voice_note === 'N.A.') {

                                        console.log("No Question Voice Note");

                                    } else {

                                        setSelectedQuestionVoiceNote(individual_user_data.question_voice_note);
                                        setQuestionVoiceNote(individual_user_data.question_voice_note_url);
                                        // setVoiceNoteFileValues(individual_user_data.question_voice_note_url);
                                    }
                                    setPreviousData(individual_user_data);
                                }

                            } setValues(0);
                        }
                    } else {

                        // setIsEditModalOpen(true);
                    }

                })
                .catch((error) => {
                    if (error.response) {
                        // Request made and server responded
                        console.log(error.response.data);
                        // setIsEditModalOpen(false);
                        hideLoader();

                        if (error.response.data === 'Invalid Token') {

                            sessionStorage.clear();
                            localStorage.clear();

                            history.push('/auth/signin-1');
                            window.location.reload();

                        }

                    } else if (error.request) {
                        // The request was made but no response was received
                        hideLoader();
                        console.log(error.request);
                        // fetchUserData();
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        hideLoader();
                        console.log('Error', error.message);
                        // fetchUserData();
                    }
                });
        }
    }

    useEffect(() => {
        if (!isEmptyArray(optionsCategory) && !isEmptyArray(optionsCongnitiveSkills) && !isEmptyArray(optionsSource)) {
            console.log("Inside UE!", optionsCategory, optionsDisclaimer, optionsCongnitiveSkills, optionsSource);

            IndividualQuestionData();
        }
    }, [optionsCategory, optionsCongnitiveSkills, optionsSource]);

    const handleCategoryChange = (event) => {
        console.log(event);
        setQuestionCategoryErrMsg(false);
        setSelectedValueCategory(event.value);
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
        setSelectedValueDisclaimer(event.value);
        setSelectedQuestionDisclaimer(event.value);
    };

    const handleQuestionLabel = (e) => {

        setQuestionLabelValue(e.target.value);
        setQuestionLabelErr(false);
        setQuestionLabelAlreadyExists(false);
    }

    const removeSelectedImg = (index) => {

        let tempPreviewImg = [...previewImages];
        tempPreviewImg[index] = '';
        setPreviewImages(tempPreviewImg);

        let tempPreviewCommon = [...commonPreview];
        tempPreviewCommon[index] = '';
        setCommonPreview(tempPreviewCommon);

        let tempFileValue = [...fileValues];
        tempFileValue.splice(count, 1);
        setFileValues(tempFileValue);

        let data = [...answerOptionsForm];
        data[index]["answer_content"] = "";
        console.log(data);
        setAnswerOptionsForm(data);

        let tempCount = count - 1;
        setCount(tempCount);
    }

    const removeSelectedAudio = (index) => {

        let tempPreviewAudio = [...previewAudios];
        tempPreviewAudio[index] = '';
        setPreviewAudios(tempPreviewAudio);

        let tempPreviewCommon = [...commonPreview];
        tempPreviewCommon[index] = '';
        setCommonPreview(tempPreviewCommon);

        let tempFileValue = [...fileValues];
        tempFileValue.splice(count, 1);
        setFileValues(tempFileValue);

        let data = [...answerOptionsForm];
        data[index]["answer_content"] = "";
        console.log(data);
        setAnswerOptionsForm(data);

        let tempCount = count - 1;
        setCount(tempCount);
    }

    const handleShowMathKeyboard = (e) => {

        _setRadioShowMathKeyboard(!_radioShowMathKeyboard);
        _radioShowMathKeyboard === true ? setShowMathKeyboard('No') : setShowMathKeyboard('Yes');
    }

    const handleWorkSheetOrTest = (e) => {

        _setRadioWorkSheetOrTest(!_radioWorkSheetOrTest);
        _radioWorkSheetOrTest === true ? setWorkSheetOrTest('preOrPost') : setWorkSheetOrTest('worksheetOrTest');
    }

    const [answerBlanksOptions, setAnswerBlanksOptions] = useState([]);
    const answerDisplayOptions = [
        { value: 'No', label: 'No' },
        { value: 'Yes', label: 'Yes' }
    ];

    const selectedArr = [{ label: 'Options', value: 'Options' }];

    const handleQuestionType = (event) => {

        setAnswerTypeOptions((currentOptions) => currentOptions.filter((currentOption) => !selectedAnswerType.includes(currentOption)));
        // setSelectedQuestionCategory([]);
        // setSelectedQuestionDisclaimer([]);
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
        setAnsWeightageErrMsg(false);
        setUnitWeightageErrMsg(false);

        setAddAnswerOptions(false);

        console.log(event.target);

        let valuesSelected = event.target.value;
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

    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const handleAnswerBlanks = (event, index) => {

        console.log(event.target);

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
            tempFileValue.splice(index, 1);
            setFileValues(tempFileValue);

            // Clear Common Preview Values
            let tempPreviewCommon = [...commonPreview];
            tempPreviewCommon[index] = '';
            setCommonPreview(tempPreviewCommon);

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
        }

        if (event.target.name === 'unit_weightage') {
            setUnitWeightageErrMsg(false);
        }

        if (data[index]['answer_type'] === 'Equation' && event.target.name === 'answer_content') {

            let tempEquation = [...commonPreview];
            tempEquation[index] = event.target.value;
            setCommonPreview(tempEquation);
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

                let tempPreviewCommon = [...commonPreview];
                tempPreviewCommon[index] = event.target.files.length === 0 ? '' : URL.createObjectURL(event.target.files[0]);
                setCommonPreview(tempPreviewCommon);

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

                let tempPreviewCommon = [...commonPreview];
                tempPreviewCommon[index] = event.target.files.length === 0 ? '' : URL.createObjectURL(event.target.files[0]);
                setCommonPreview(tempPreviewCommon);

                let tempFileValue = [...fileValues];
                tempFileValue[index] = event.target.files[0];
                setFileValues(tempFileValue);
            }
        }
    }

    const previewQuestionVoiceNote = (e) => {

        let tempUrl = e.target.files.length === 0 ? '' : URL.createObjectURL(e.target.files[0]);
        let tempVoiceNoteFileValues = e.target.files.length === 0 ? '' : e.target.files[0];
        setQuestionVoiceNote(tempUrl);
        setSelectedQuestionVoiceNote(e.target.value);
        setVoiceNoteFileValues(tempVoiceNoteFileValues);
    }

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

    const removeAnswerTypeOptions = (index) => {

        let data = [...answerOptionsForm];
        data.splice(index, 1)
        setAnswerOptionsForm(data);
    }

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

                console.log(response.data);

                let result = response.status === 200;

                if (result) {

                    console.log('inside res');
                    setnNewDigicard(false)

                    let uploadParamsQuestionsNote = response.data.question_voice_note;
                    let uploadParamsAnswerOptions = response.data.answers_options;

                    hideLoader();

                    if (Array.isArray(uploadParamsQuestionsNote)) {

                        for (let index = 0; index < uploadParamsQuestionsNote.length; index++) {

                            let keyNameArr = Object.keys(uploadParamsQuestionsNote[index]);
                            let keyName = keyNameArr[1];

                            let blobField = voiceNoteFileValues;
                            console.log({ blobField });

                            let tempObj = uploadParamsQuestionsNote[index];
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

                                console.log(fileValues);

                                let blobField = fileValues[index];
                                console.log({ blobField });

                                let tempObjFile = uploadParamsAnswerOptions[index];

                                let result = fetch(tempObjFile[keyName], {
                                    method: 'PUT',
                                    body: blobField
                                });

                                console.log({ result });
                            }

                            const MySwal = withReactContent(Swal);

                            MySwal.fire({

                                title: 'Question saved as new Item!',
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
                                console.log({ blobField });

                                let tempObjFile = uploadParamsAnswerOptions[index];

                                let result = fetch(tempObjFile[keyName], {
                                    method: 'PUT',
                                    body: blobField
                                });

                                console.log({ result });
                            }

                            const MySwal = withReactContent(Swal);
                            MySwal.fire({

                                title: 'Question saved as new Item!',
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
                    setnNewDigicard(false)
                    sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
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

    const _editQuestions = (payLoad) => {

        console.log("payLoad: ", payLoad);

        axios
            .post(
                dynamicUrl.editQuestion,
                {
                    data: payLoad
                },
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {

                console.log(response.data);

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

                            let blobField = voiceNoteFileValues;
                            console.log({ blobField });

                            if (blobField !== undefined || blobField !== 'undefined') {
                                let tempObj = uploadParamsQuestionsNote[index];
                                let result = fetch(tempObj[keyName], {
                                    method: 'PUT',
                                    body: blobField
                                });

                                console.log({ result });
                            }
                        }


                        if (Array.isArray(fileValues)) {

                            function setEditedImages(index) {

                                if (index < fileValues.length) {

                                    let keyNameArr = Object.keys(uploadParamsAnswerOptions[0]);
                                    let keyName = keyNameArr[1];

                                    console.log(fileValues);

                                    let blobField = fileValues[index];
                                    console.log({ blobField });
                                    console.log((blobField === undefined || blobField === 'undefined'));

                                    if (blobField === undefined || blobField === 'undefined') {

                                        console.log("Inside Undefined");
                                        index++;
                                        setEditedImages(index);

                                    } else {

                                        let tempObjFile = uploadParamsAnswerOptions[0];
                                        uploadParamsAnswerOptions.shift();

                                        let result = fetch(tempObjFile[keyName], {
                                            method: 'PUT',
                                            body: blobField
                                        });

                                        console.log({ result });

                                        index++;
                                        setEditedImages(index);

                                    }

                                } else {

                                    const MySwal = withReactContent(Swal);

                                    MySwal.fire({

                                        title: sessionStorage.getItem('click_event') === 'Save' ? 'Question Saved!' : sessionStorage.getItem('click_event') === 'Submit' ? 'Question Submitted!' : sessionStorage.getItem('click_event') === 'Accept' ? "Question Accepted!" : sessionStorage.getItem('click_event') === 'Reject' ? "Question Rejected!" : sessionStorage.getItem('click_event') === 'Revisit' ? "Question marked as Revisit!" : sessionStorage.getItem('click_event') === 'DesignReady' ? "Question marked as Design Ready!" : "Question Published!",
                                        icon: 'success',
                                    }).then((willDelete) => {

                                        history.push('/admin-portal/active-questions');
                                        // window.location.reload();

                                    });
                                }
                            }
                            setEditedImages(0);

                        }

                    } else {
                        console.log("Invalid type received!")
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
                    if (error.response.data === "Question Label Already Exist!") {
                        setQuestionLabelAlreadyExists(true);
                    }

                } else if (error.request) {

                    console.log(error.request);
                    hideLoader();

                } else {

                    console.log('Error', error.message);
                    hideLoader();
                }
            });

    }

    const newQuestion = () => {

        let name = document.getElementById('newQuestionLabel').value;

        if ((name.length <= 2 && name.length > 0) || name.length > 32) {

            name.length > 32 ? setNewDigicardErrMax(true) : setNewDigicardErrMin(true)
            setnNewDigicard(true);

        } else if (name.trim().length === 0) {

            setNewDigicardErrReq(true);
            setnNewDigicard(true);

        } else {

            let answerExplanation = document.getElementById('answer_explanation').value;

            let payLoad = {

                question_type: selectedQuestionType,
                question_category: selectedQuestionCategory,
                question_voice_note: selectedQuestionVoiceNote,
                question_content: articleDataTitle,
                answers_of_question: selectedQuestionType === 'Descriptive' ? descriptiveAnswerOptionsForm : answerOptionsForm,
                question_status: 'Save',
                question_disclaimer: selectedQuestionDisclaimer,
                show_math_keyboard: showMathKeyboard,
                appears_in: workSheetOrTest,
                question_label: name,
                cognitive_skill: selectedQuestionCognitiveSkill,
                question_source: selectedQuestionSource,
                marks: document.getElementById('marks').value,
                display_answer: selectedQuestionType === 'Subjective' || selectedQuestionType === 'Objective' ? 'N.A.' : document.getElementById('descriptive_answer').value,
                answer_explanation: answerExplanation === undefined || answerExplanation === "undefined" || answerExplanation === "" ? "N.A." : answerExplanation
            }

            _addQuestions(payLoad)
        }
    }

    const addnewQuestion = () => {

        let DigiCardtitleRegex = Constants.AddDigiCard.DigiCardtitleRegex;
        if (questionLabelValue === "" || questionLabelValue === undefined || questionLabelValue === "undefined") {
            setQuestionLabelErr(true);
        } else if (isEmptyArray(selectedQuestionType)) {
            setQuestionTypeErrMsg(true);
        } else if (isEmptyArray(selectedQuestionCategory) || selectedQuestionCategory === 'Select...') {
            setQuestionCategoryErrMsg(true);
        } else if (isEmptyArray(selectedQuestionCognitiveSkill)) {
            setQuestionCognitiveSkillErrMsg(true);
        } else if (isEmptyArray(selectedQuestionSource)) {
            setQuestionSourceErrMsg(true);
        } else if (articleDataTitle === "" || articleDataTitle === undefined || articleDataTitle === 'undefined' || articleDataTitle === "<p><br></p>" || articleDataTitle === "<p></p>" || articleDataTitle === "<br>") {
            setQuestionEmptyErrMsg(true);
        } else if (selectedQuestionType === 'Descriptive') {

            console.log(document.getElementById('descriptive_answer').value);
            let descriptiveAnswer = document.getElementById('descriptive_answer').value;

            console.log(document.getElementById('marks').value);

            if (Number(document.getElementById('marks').value) < 0) {
                setNegativeMarksErrMsg(true);
            }
            else if (descriptiveAnswer === undefined || descriptiveAnswer === 'undefined' || descriptiveAnswer === "") {
                setDescriptiveAnswerErrMsg(true);
            } else {

                showLoader();
                setnNewDigicard(true);
            }

        } else if (selectedQuestionType === 'Subjective' || selectedQuestionType === 'Objective') {

            let tempAnsWeightage = answerOptionsForm.filter(value => value.answer_weightage < 0);
            let tempUnitWeightage = answerOptionsForm.filter(value => value.unit_weightage < 0);

            console.log(document.getElementById('marks').value);

            if (Number(document.getElementById('marks').value) < 0) {
                setNegativeMarksErrMsg(true);
            } else if (tempAnsWeightage.length !== 0) {
                setAnsWeightageErrMsg(true);
            } else if (tempUnitWeightage.length !== 0) {
                setUnitWeightageErrMsg(true);
            } else {

                showLoader();
                setnNewDigicard(true);

            }
        } else {
            console.log("Invalid option!");
        }
    }

    return (

        <>
            {

                (isLoading ? (
                    <BasicSpinner />
                ) : (

                    <>
                        {

                            previousData.length === 0 || previousData.length === "0" ? <></> : (
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
                                                        question_label: previousData.question_label,
                                                        question_disclaimer: selectedValueDisclaimer,
                                                        question_category: selectedValueCategory,
                                                        marks: previousData.marks,
                                                        descriptive_answer: previousData.display_answer === 'N.A.' ? '' : previousData.display_answer,
                                                        answer_explanation: previousData.answer_explanation === 'N.A.' ? '' : previousData.answer_explanation,
                                                        // answerType: '',
                                                        submit: null
                                                    }}

                                                    validationSchema={Yup.object().shape({
                                                        question_label: Yup.string()
                                                            .trim()
                                                            .min(2, 'Question Label is too short!')
                                                            .max(51, 'Question Label is too long!')
                                                            .required('Question Label is required!'),
                                                        marks: Yup.string()
                                                            .trim()
                                                            .required('Marks required!'),
                                                    })}

                                                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                                        setSubmitting(true);

                                                        if (sessionStorage.getItem('click_event') === "" || sessionStorage.getItem('click_event') === undefined || sessionStorage.getItem('click_event') === "undefined" || sessionStorage.getItem('click_event') === null) {

                                                        } else if (sessionStorage.getItem('click_event') === "SaveAsNew") {

                                                            console.log(questionLabelValue);

                                                            if (questionLabelValue === "" || questionLabelValue === undefined || questionLabelValue === "undefined") {

                                                                setQuestionLabelErr(true);

                                                            } else if (isEmptyArray(selectedQuestionType)) {
                                                                setQuestionTypeErrMsg(true);
                                                            } else if (isEmptyArray(selectedQuestionCategory) || selectedQuestionCategory === 'Select...') {

                                                                setQuestionCategoryErrMsg(true);
                                                            } else if (isEmptyArray(selectedQuestionCognitiveSkill)) {
                                                                setQuestionCognitiveSkillErrMsg(true);
                                                            } else if (isEmptyArray(selectedQuestionSource)) {
                                                                setQuestionSourceErrMsg(true);
                                                            } else if (articleDataTitle === "" || articleDataTitle === undefined || articleDataTitle === 'undefined' || articleDataTitle === "<p><br></p>" || articleDataTitle === "<p></p>" || articleDataTitle === "<br>") {
                                                                setQuestionEmptyErrMsg(true);
                                                            } else if (selectedQuestionType === 'Descriptive') {

                                                                console.log(values.descriptive_answer);
                                                                let descriptiveAnswer = values.descriptive_answer;

                                                                if (Number(values.marks) < 0) {
                                                                    setNegativeMarksErrMsg(true);
                                                                } else if (descriptiveAnswer === undefined || descriptiveAnswer === 'undefined' || descriptiveAnswer === "") {
                                                                    setDescriptiveAnswerErrMsg(true);
                                                                } else {

                                                                    showLoader();
                                                                    setnNewDigicard(true);
                                                                }

                                                            } else if (selectedQuestionType === 'Subjective' || selectedQuestionType === 'Objective') {

                                                                let tempAnsWeightage = answerOptionsForm.filter(value => value.answer_weightage < 0);
                                                                let tempUnitWeightage = answerOptionsForm.filter(value => value.unit_weightage < 0);

                                                                console.log(values.marks);

                                                                if (Number(values.marks) < 0) {
                                                                    setNegativeMarksErrMsg(true);
                                                                } else if (tempAnsWeightage.length !== 0) {
                                                                    setAnsWeightageErrMsg(true);
                                                                } else if (tempUnitWeightage.length !== 0) {
                                                                    setUnitWeightageErrMsg(true);
                                                                } else {

                                                                    console.log('Data inserted!');

                                                                    let payLoad = {

                                                                        question_type: selectedQuestionType,
                                                                        question_category: selectedQuestionCategory,
                                                                        question_voice_note: selectedQuestionVoiceNote,
                                                                        question_content: articleDataTitle,
                                                                        answers_of_question: answerOptionsForm,
                                                                        question_status: sessionStorage.getItem('click_event'),
                                                                        question_disclaimer: selectedQuestionDisclaimer,
                                                                        show_math_keyboard: showMathKeyboard,
                                                                        appears_in: workSheetOrTest,
                                                                        question_label: questionLabelValue,
                                                                        cognitive_skill: selectedQuestionCognitiveSkill,
                                                                        question_source: selectedQuestionSource,
                                                                        marks: values.marks,
                                                                        display_answer: "N.A.",
                                                                        answer_explanation: values.answer_explanation === undefined || values.answer_explanation === "undefined" || values.answer_explanation === "" ? "N.A." : values.answer_explanation

                                                                    }

                                                                    console.log("payLoad", payLoad);

                                                                    showLoader();
                                                                    _addQuestions(payLoad);

                                                                }
                                                            }

                                                        } else {

                                                            console.log(questionLabelValue);

                                                            if (questionLabelValue === "" || questionLabelValue === undefined || questionLabelValue === "undefined") {

                                                                setQuestionLabelErr(true);

                                                            } else if (isEmptyArray(selectedQuestionType)) {
                                                                setQuestionTypeErrMsg(true);
                                                            } else if (isEmptyArray(selectedQuestionCategory) || selectedQuestionCategory === 'Select...') {

                                                                setQuestionCategoryErrMsg(true);
                                                            } else if (isEmptyArray(selectedQuestionCognitiveSkill)) {
                                                                setQuestionCognitiveSkillErrMsg(true);
                                                            } else if (isEmptyArray(selectedQuestionSource)) {
                                                                setQuestionSourceErrMsg(true);
                                                            } else if (articleDataTitle === "" || articleDataTitle === undefined || articleDataTitle === 'undefined' || articleDataTitle === "<p><br></p>" || articleDataTitle === "<p></p>" || articleDataTitle === "<br>") {
                                                                setQuestionEmptyErrMsg(true);
                                                            } else if (selectedQuestionType === 'Descriptive') {

                                                                console.log(values.descriptive_answer);
                                                                let descriptiveAnswer = values.descriptive_answer;

                                                                if (Number(values.marks) < 0) {
                                                                    setNegativeMarksErrMsg(true);
                                                                } else if (descriptiveAnswer === undefined || descriptiveAnswer === 'undefined' || descriptiveAnswer === "") {
                                                                    setDescriptiveAnswerErrMsg(true);
                                                                } else {

                                                                    console.log('Data inserted!');

                                                                    let payLoad = {

                                                                        question_id: question_id,
                                                                        question_type: selectedQuestionType,
                                                                        question_category: selectedQuestionCategory,
                                                                        question_voice_note: selectedQuestionVoiceNote,
                                                                        question_content: articleDataTitle,
                                                                        answers_of_question: descriptiveAnswerOptionsForm,
                                                                        question_status: sessionStorage.getItem('click_event'),
                                                                        question_disclaimer: selectedQuestionDisclaimer,
                                                                        show_math_keyboard: showMathKeyboard,
                                                                        appears_in: workSheetOrTest,
                                                                        question_label: questionLabelValue,
                                                                        cognitive_skill: selectedQuestionCognitiveSkill,
                                                                        question_source: selectedQuestionSource,
                                                                        marks: values.marks,
                                                                        display_answer: values.descriptive_answer,
                                                                        answer_explanation: values.answer_explanation === undefined || values.answer_explanation === "undefined" || values.answer_explanation === "" ? "N.A." : values.answer_explanation

                                                                    }

                                                                    console.log("payLoad", payLoad);

                                                                    showLoader();
                                                                    _editQuestions(payLoad);
                                                                }

                                                            } else if (selectedQuestionType === 'Subjective' || selectedQuestionType === 'Objective') {

                                                                let tempAnsWeightage = answerOptionsForm.filter(value => value.answer_weightage < 0);
                                                                let tempUnitWeightage = answerOptionsForm.filter(value => value.unit_weightage < 0);

                                                                console.log(values.marks);

                                                                if (Number(values.marks) < 0) {
                                                                    setNegativeMarksErrMsg(true);
                                                                } else if (tempAnsWeightage.length !== 0) {
                                                                    setAnsWeightageErrMsg(true);
                                                                } else if (tempUnitWeightage.length !== 0) {
                                                                    setUnitWeightageErrMsg(true);
                                                                } else {

                                                                    console.log('Data inserted!');

                                                                    let payLoad = {

                                                                        question_id: question_id,
                                                                        question_type: selectedQuestionType,
                                                                        question_category: selectedQuestionCategory,
                                                                        question_voice_note: selectedQuestionVoiceNote,
                                                                        question_content: articleDataTitle,
                                                                        answers_of_question: answerOptionsForm,
                                                                        question_status: sessionStorage.getItem('click_event'),
                                                                        question_disclaimer: selectedQuestionDisclaimer,
                                                                        show_math_keyboard: showMathKeyboard,
                                                                        appears_in: workSheetOrTest,
                                                                        question_label: questionLabelValue,
                                                                        cognitive_skill: selectedQuestionCognitiveSkill,
                                                                        question_source: selectedQuestionSource,
                                                                        marks: values.marks,
                                                                        display_answer: "N.A.",
                                                                        answer_explanation: values.answer_explanation === undefined || values.answer_explanation === "undefined" || values.answer_explanation === "" ? "N.A." : values.answer_explanation

                                                                    }

                                                                    console.log("payLoad", payLoad);

                                                                    showLoader();
                                                                    _editQuestions(payLoad);

                                                                }
                                                            }
                                                        }

                                                    }}

                                                >
                                                    {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue, setFieldTouched }) => (
                                                        <form noValidate onSubmit={handleSubmit} >

                                                            <Row>
                                                                <Col>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger">* </small>
                                                                        Question Type
                                                                    </label>

                                                                    <select
                                                                        className="form-control"
                                                                        error={touched.questionType && errors.questionType}
                                                                        name="questionType"
                                                                        onBlur={handleBlur}
                                                                        type="text"
                                                                        value={selectedQuestionType}
                                                                        onChange={(event) => {
                                                                            handleQuestionType(event)
                                                                            setFieldValue('answer_type', '')
                                                                        }}
                                                                    >

                                                                        <option>
                                                                            Select...
                                                                        </option>
                                                                        {questionTypeOptions.map((optionsData) => {

                                                                            return <option
                                                                                value={optionsData.value}
                                                                                key={optionsData.value}
                                                                            >
                                                                                {optionsData.value}
                                                                            </option>

                                                                        })}

                                                                    </select>

                                                                    {questionTypeErrMsg && (
                                                                        <>
                                                                            <small className="text-danger form-text">{'Please select Question Type'}</small>
                                                                        </>
                                                                    )}
                                                                </Col>

                                                                <Col>
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
                                                                            setQuestionVoiceError(true);
                                                                            previewQuestionVoiceNote(e);
                                                                        }
                                                                        }
                                                                        type="file"
                                                                        value={values.question_voice_note}
                                                                        accept=".mp3,audio/*"
                                                                    />

                                                                    {questionVoiceNote && (
                                                                        <>
                                                                            <br />
                                                                            <Row>
                                                                                <Col>
                                                                                    <div className="form-group fill">
                                                                                        <audio controls>
                                                                                            <source src={questionVoiceNote} alt="Audio" type="audio/mp3" />

                                                                                        </audio>
                                                                                    </div>
                                                                                </Col>
                                                                                <Col style={{ padding: '5px' }}>
                                                                                    <div>
                                                                                        <Button
                                                                                            size="lg"
                                                                                            variant="light"
                                                                                            onClick={(e) => {
                                                                                                setQuestionVoiceNote('');
                                                                                                setSelectedQuestionVoiceNote('');
                                                                                                setVoiceNoteFileValues('');
                                                                                                setFieldValue('question_voice_note', '')
                                                                                            }}
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
                                                                    <small className="text-danger form-text" style={{ display: questionVoiceError ? 'none' : 'block' }}>Invalid File Type or File size is Exceed More Than 10MB</small>
                                                                </Col>
                                                            </Row>

                                                            <br />
                                                            <Row>
                                                                <Col>
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-top`}>This will be treated as the Question Title!</Tooltip>}>
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
                                                                                onChange={e => {
                                                                                    handleQuestionLabel(e)
                                                                                    handleChange(e)
                                                                                }}
                                                                                placeholder="Question Label"

                                                                            />
                                                                        </div>
                                                                    </OverlayTrigger>
                                                                    {touched.question_label && errors.question_label && <small className="text-danger form-text">{errors.question_label}</small>
                                                                    }
                                                                    {questionLabelErr && (
                                                                        <small className="text-danger form-text">{'Question Label is required!'}</small>
                                                                    )}
                                                                    {questionLabelAlreadyExists && (
                                                                        <small className="text-danger form-text">{'Question Label already exists!'}</small>
                                                                    )}
                                                                </Col>

                                                                <Col xs={6}>
                                                                    <label className="floating-label">
                                                                        <small className="text-danger">* </small>
                                                                        Question Category
                                                                    </label>


                                                                    <Select
                                                                        defaultValue={selectedValueCategory}
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
                                                                            <small className="text-danger form-text">{'Please, select Question Category'}</small>
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
                                                                        defaultValue={selectedValueCognitiveSkill}
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
                                                                        defaultValue={selectedValueSource}
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
                                                                    {console.log()}
                                                                    <Select
                                                                        defaultValue={selectedValueDisclaimer}
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

                                                                <Col>
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
                                                                                onChange={(e) => handleWorkSheetOrTest(e)}
                                                                            /> &nbsp;

                                                                            <Form.Label className="profile-view-question" id={`radio-fresher`}>
                                                                                {_radioWorkSheetOrTest === true ? 'Worksheet/Test' : 'Pre/Post'}
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
                                                                        <small className="text-danger form-text">{'Question required!'}</small>
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
                                                                                id="marks"
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

                                                                        return (<>

                                                                            <Card
                                                                                className="shadow p-3 mb-5 bg-white rounded"
                                                                                style={{ backgroundColor: "rgb(224 238 255)" }}>

                                                                                <Card.Body style={{ backgroundColor: "rgb(224 238 255)" }}>

                                                                                    <Row>
                                                                                        <Col>
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
                                                                                        <Col>
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
                                                                                        </Col>
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
                                                                                                        type="text"
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

                                                                                                        {/* <option>
                                                                                                Select...
                                                                                            </option> */}

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

                                                                                    {form.answer_type === 'Equation' && answerBlanksOptions && (

                                                                                        <>                                                            <br />
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
                                                                                                    />
                                                                                                </Col>

                                                                                            </Row>

                                                                                            <br />
                                                                                            <Row>
                                                                                                <Col xs={12}>
                                                                                                    <label className="floating-label">
                                                                                                        <small className="text-danger"></small>
                                                                                                        Equation
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

                                                                                                    {commonPreview.length >= 1 && form.answer_content && (commonPreview[index] !== 'N.A.') && (
                                                                                                        <MathJax.Provider>
                                                                                                            {
                                                                                                                (
                                                                                                                    (commonPreview[index]) && (<div>
                                                                                                                        <MathJax.Node inline formula={commonPreview[index]} />
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

                                                                                    {form.answer_type === 'Numbers' && answerBlanksOptions && (

                                                                                        <>
                                                                                            <br />
                                                                                            <Row key={index}>

                                                                                                {/* {console.log(form)} */}
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
                                                                                                        className="form-control"
                                                                                                        error={touched.answer_content && errors.answer_content}
                                                                                                        label="answer_content"
                                                                                                        name="answer_content"
                                                                                                        onBlur={handleBlur}
                                                                                                        type="number"
                                                                                                        value={form.answer_content}
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

                                                                                                        {/* <option>
                                                                                                Select...
                                                                                            </option> */}

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
                                                                                                                    value={form.answer_range_from}
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
                                                                                                                    value={form.answer_range_to}
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
                                                                                                                value={form.answer_content}
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
                                                                                                                value={form.answer_unit}
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
                                                                                                                value={form.answer_range_from}
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
                                                                                                                value={form.answer_range_to}
                                                                                                                onChange={event => handleAnswerBlanks(event, index)}
                                                                                                                placeholder="To"
                                                                                                            />
                                                                                                        </Col>
                                                                                                    </Row>
                                                                                                </>
                                                                                            ) :
                                                                                                (<>
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
                                                                                                        {console.log(form.answer_content)}
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
                                                                                                                value={form.answer_content}
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
                                                                                                            />
                                                                                                        </Col>

                                                                                                    </Row>
                                                                                                </>
                                                                                                )}

                                                                                        </>

                                                                                    )}

                                                                                    {form.answer_type === 'Image' && answerBlanksOptions && (

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

                                                                                                        {/* <option>
                                                                                                Select...
                                                                                            </option> */}

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
                                                                                                    <div>
                                                                                                        <input
                                                                                                            class="hidden"
                                                                                                            className="form-control"
                                                                                                            error={touched.answer_content && errors.answer_content}
                                                                                                            label="answer_content"
                                                                                                            name="answer_content"
                                                                                                            onBlur={handleBlur}
                                                                                                            // onChange={handleChange}
                                                                                                            type="file"
                                                                                                            // value={form.answer_content}
                                                                                                            title="&nbsp;"
                                                                                                            onClick={() => {
                                                                                                                let tempPreviewImg = [...previewImages];
                                                                                                                tempPreviewImg[index] = '';
                                                                                                                setPreviewImages(tempPreviewImg);
                                                                                                                let tempPreviewCommon = [...commonPreview];
                                                                                                                tempPreviewCommon[index] = '';
                                                                                                                setCommonPreview(tempPreviewCommon);

                                                                                                            }}
                                                                                                            onChange={event => {
                                                                                                                handleAnswerBlanks(event, index);
                                                                                                            }}
                                                                                                            placeholder="Enter Answer"
                                                                                                        />
                                                                                                    </div>
                                                                                                </Col>
                                                                                                <Col xs={3} style={{ display: "contents" }} >

                                                                                                    <label className="floating-label">
                                                                                                        <small className="text-danger"></small>
                                                                                                        Preview
                                                                                                    </label>


                                                                                                    {commonPreview[index] && commonPreview[index] !== ""
                                                                                                        && (

                                                                                                            <>
                                                                                                                <br />

                                                                                                                <img width={150} src={commonPreview[index]} alt="" className="img-fluid mb-3" style={{
                                                                                                                    marginTop: "20px",
                                                                                                                    marginLeft: "-50px"
                                                                                                                }} />


                                                                                                                {
                                                                                                                    commonPreview[index] && commonPreview[index] !== 'N.A.' && (

                                                                                                                        <CloseButton


                                                                                                                            onClick={() => {
                                                                                                                                setFieldValue("answer_content", "")
                                                                                                                                setFieldTouched("answer_content", false, false);
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
                                                                                                        onChange={event => handleAnswerBlanks(event, index)}
                                                                                                    >

                                                                                                        {/* <option>
                                                                                                Select...
                                                                                            </option> */}

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
                                                                                                        // value={form.answer_content}
                                                                                                        onClick={() => {
                                                                                                            let tempPreviewAudio = [...previewAudios];
                                                                                                            tempPreviewAudio[index] = '';
                                                                                                            setPreviewAudios(tempPreviewAudio);
                                                                                                            let tempPreviewCommon = [...commonPreview];
                                                                                                            tempPreviewCommon[index] = '';
                                                                                                            setCommonPreview(tempPreviewCommon);

                                                                                                        }}
                                                                                                        onChange={event => {
                                                                                                            handleAnswerBlanks(event, index)
                                                                                                        }}
                                                                                                        type="file"
                                                                                                        accept=".mp3,audio/*"
                                                                                                    />
                                                                                                </Col>

                                                                                                <Col xs={3} style={{ display: "contents" }}>

                                                                                                    <label className="floating-label">
                                                                                                        <small className="text-danger"></small>
                                                                                                        Preview
                                                                                                    </label>

                                                                                                    {commonPreview && commonPreview[index] && commonPreview[index] !== 'N.A.' &&
                                                                                                        (
                                                                                                            <>
                                                                                                                <br />

                                                                                                                <div className="form-group fill" style={{ marginTop: "25px", marginLeft: "-53px" }} >
                                                                                                                    <audio controls>
                                                                                                                        <source
                                                                                                                            src={commonPreview[index]}
                                                                                                                            alt="Audio"
                                                                                                                            type="audio/mp3" />

                                                                                                                    </audio>
                                                                                                                </div>

                                                                                                                {
                                                                                                                    commonPreview[index] && (
                                                                                                                        <CloseButton
                                                                                                                            onClick={() => {
                                                                                                                                setFieldValue("answer_content", "")
                                                                                                                                setFieldTouched("answer_content", false, false);
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
                                                                        </>
                                                                        )
                                                                    })
                                                                    }

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
                                                                            <textarea
                                                                                rows="5"
                                                                                cols="80"
                                                                                id="descriptive_answer"
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

                                                                                                        <Col>
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
                                                                                                        <Col>
                                                                                                            <label className="floating-label">
                                                                                                                <small className="text-danger"></small>
                                                                                                                Preview
                                                                                                            </label>

                                                                                                            {descriptiveEquation.length >= 1 && form.answer_content && (descriptiveEquation[index] !== 'N.A.') && (
                                                                                                                <MathJax.Provider>
                                                                                                                    {(descriptiveEquation[index] && (<div>
                                                                                                                        <MathJax.Node inline formula={descriptiveEquation[index]} />
                                                                                                                    </div>))}
                                                                                                                </MathJax.Provider>
                                                                                                            )}

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
                                                                            <textarea
                                                                                rows="7"
                                                                                id="answer_explanation"
                                                                                value={values.answer_explanation}
                                                                                className="form-control"
                                                                                error={touched.answer_explanation && errors.answer_explanation}
                                                                                label="answer_explanation"
                                                                                name="answer_explanation"
                                                                                onBlur={handleBlur}
                                                                                type="textarea"
                                                                                onChange={handleChange}
                                                                                placeholder="Enter Answer Explanation"
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </>
                                                            )}

                                                            {loader}

                                                            <br />
                                                            <Row className="my-3">
                                                                <Col xs={2}></Col>
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

                                                                {
                                                                    sessionStorage.getItem('question_status') === 'Save' && (
                                                                        <Col>
                                                                            <Row>
                                                                                <Col xs={5}>
                                                                                    <Button
                                                                                        type="button"
                                                                                        className="btn-block"
                                                                                        color="secondary"
                                                                                        size="large"
                                                                                        variant="secondary"
                                                                                        onClick={() => {
                                                                                            sessionStorage.setItem('click_event', 'SaveAsNew');
                                                                                            addnewQuestion()
                                                                                        }
                                                                                        }>
                                                                                        Save As New
                                                                                    </Button>
                                                                                </Col>
                                                                                <Col>
                                                                                    <Button
                                                                                        className="btn-block"
                                                                                        color="info"
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
                                                                    )
                                                                }

                                                                {sessionStorage.getItem('question_status') === 'Submit' && (

                                                                    <Col >
                                                                        <Row>
                                                                            <Col></Col>
                                                                            <Col>
                                                                                <Button
                                                                                    className="btn-block"
                                                                                    color="success"
                                                                                    size="small"
                                                                                    type="submit"
                                                                                    variant="success"
                                                                                    onClick={() => sessionStorage.setItem('click_event', 'Accept')}>
                                                                                    Accept
                                                                                </Button>
                                                                            </Col>
                                                                            <Col>
                                                                                <Button
                                                                                    className="btn-block"
                                                                                    color="danger"
                                                                                    size="small"
                                                                                    type="submit"
                                                                                    variant="danger"
                                                                                    onClick={() => sessionStorage.setItem('click_event', 'Reject')}>
                                                                                    Reject
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                )}

                                                                {sessionStorage.getItem('question_status') === 'Accept' && (

                                                                    <Col >
                                                                        <Row>
                                                                            <Col>
                                                                                <Button
                                                                                    className="btn-block"
                                                                                    color="danger"
                                                                                    size="small"
                                                                                    type="submit"
                                                                                    variant="danger"
                                                                                    onClick={() => sessionStorage.setItem('click_event', 'Revisit')}>
                                                                                    Revisit
                                                                                </Button>
                                                                            </Col>
                                                                            <Col xs={5}>
                                                                                <Button
                                                                                    className="btn-block"
                                                                                    color="info"
                                                                                    size="small"
                                                                                    type="submit"
                                                                                    variant="info"
                                                                                    onClick={() => sessionStorage.setItem('click_event', 'DesignReady')}>
                                                                                    Design Ready
                                                                                </Button>
                                                                            </Col>
                                                                            <Col>
                                                                                <Button
                                                                                    className="btn-block"
                                                                                    color="success"
                                                                                    size="small"
                                                                                    type="submit"
                                                                                    variant="success"
                                                                                    onClick={() => sessionStorage.setItem('click_event', 'Publish')}>
                                                                                    Publish
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                )}

                                                                {sessionStorage.getItem('question_status') === 'Reject' && (
                                                                    <Col>
                                                                        <Row>
                                                                            <Col xs={5}>
                                                                                <Button
                                                                                    className="btn-block"
                                                                                    color="secondary"
                                                                                    size="large"
                                                                                    type="button"
                                                                                    variant="secondary"
                                                                                    onClick={(e) => {
                                                                                        sessionStorage.setItem('click_event', 'SaveAsNew');
                                                                                        addnewQuestion()
                                                                                    }}>
                                                                                    Save As New
                                                                                </Button>
                                                                            </Col>
                                                                            <Col>
                                                                                <Button
                                                                                    className="btn-block"
                                                                                    color="info"
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
                                                                )}

                                                                {sessionStorage.getItem('question_status') === 'Revisit' && (
                                                                    <Col >
                                                                        <Row>
                                                                            <Col></Col>
                                                                            <Col>
                                                                                <Button
                                                                                    className="btn-block"
                                                                                    color="success"
                                                                                    size="small"
                                                                                    type="submit"
                                                                                    variant="success"
                                                                                    onClick={() => sessionStorage.setItem('click_event', 'Accept')}>
                                                                                    Accept
                                                                                </Button>
                                                                            </Col>
                                                                            <Col>
                                                                                <Button
                                                                                    className="btn-block"
                                                                                    color="danger"
                                                                                    size="small"
                                                                                    type="submit"
                                                                                    variant="danger"
                                                                                    onClick={() => sessionStorage.setItem('click_event', 'Reject')}>
                                                                                    Reject
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                )}

                                                                {sessionStorage.getItem('question_status') === 'DesignReady' && (

                                                                    <Col >
                                                                        <Row>
                                                                            <Col></Col>
                                                                            <Col></Col>
                                                                            <Col>
                                                                                <Button
                                                                                    className="btn-block"
                                                                                    color="success"
                                                                                    size="small"
                                                                                    type="submit"
                                                                                    variant="success"
                                                                                    onClick={() => sessionStorage.setItem('click_event', 'Publish')}>
                                                                                    Publish
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                )}

                                                            </Row>

                                                        </form>
                                                    )}
                                                </Formik>
                                            </Card.Body>

                                            <Modal dialogClassName="my-modal" show={newDigicard} onHide={() => setnNewDigicard(false)}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title as="h5">New Question Label</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <Row>
                                                        <Col sm={9} >
                                                            <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-top`} style={{ zIndex: 1151 }} >This will be treated as the Question Title!</Tooltip>}>
                                                                <div className="form-group fill">
                                                                    <label className="floating-label" htmlFor="questionLabel">
                                                                        <small className="text-danger">* </small>Question Label
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        id="newQuestionLabel"
                                                                        type="text"
                                                                        onChange={(e) => {
                                                                            setNewDigicardErrMin(false)
                                                                            setNewDigicardErrMax(false)
                                                                            setNewDigicardErrReq(false)
                                                                        }}
                                                                    />
                                                                </div>
                                                            </OverlayTrigger>

                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col sm={10}>
                                                            {newdIgicardErrMin && (
                                                                <small className="text-danger form-text">Question Label  is too short!</small>
                                                            )}
                                                            {newdIgicardErrMax && (
                                                                <small className="text-danger form-text">Question Label is too long!</small>
                                                            )}
                                                            {newdIgicardErrReq && (
                                                                <small className="text-danger form-text">Question Label is required!</small>
                                                            )}

                                                        </Col>
                                                        <Col sm={2}>
                                                            <Button variant="primary" onClick={(e) => {
                                                                newQuestion()
                                                            }}>Create</Button>
                                                        </Col>
                                                    </Row>
                                                </Modal.Body>
                                            </Modal>
                                        </Card>


                                    </React.Fragment>
                                </>
                            )


                        }
                    </>

                )
                )
            }
        </ >
    );
}

export default EditQuestions
