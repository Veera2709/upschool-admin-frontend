import React, { useEffect, useState, useRef } from 'react';
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
    const [displayHeading, setDisplayHeading] = useState(sessionStorage.getItem('question_active_status'));
    const _questionStatus = sessionStorage.getItem('click_event');
    let displaySuccessMsg;
    const [questionTypeOptions, setQquestionTypeOptions] = useState([
        { value: 'Objective', label: 'Objective' },
        { value: 'Subjective', label: 'Subjective' }
    ]);
    const [questionCategoryOptions, setQquestionCategoryOptions] = useState([
        { value: 'Voice based', label: 'Voice based' },
        { value: 'Picture based', label: 'Picture based' },
        { value: 'Case Study based', label: 'Case Study based' },
        { value: 'Comprehension based', label: 'Comprehension based' },
        { value: 'Fill in the blank', label: 'Fill in the blank' },
        { value: 'True or False', label: 'True or False' },
        { value: 'Numerical problem', label: 'Numerical problem' }
    ]);
    const [questionTypeErrMsg, setQuestionTypeErrMsg] = useState(false);
    const [questionCategoryErrMsg, setQuestionCategoryErrMsg] = useState(false);
    const [questionEmptyErrMsg, setQuestionEmptyErrMsg] = useState(false);
    const [ansWeightageErrMsg, setAnsWeightageErrMsg] = useState(false);

    const [selectedQuestionType, setSelectedQuestionType] = useState([]);
    const [selectedQuestionCategory, setSelectedQuestionCategory] = useState([]);
    const [selectedQuestionDisclaimer, setSelectedQuestionDisclaimer] = useState([]);
    const [showMathKeyboard, setShowMathKeyboard] = useState('No');
    const [answerTypeOptions, setAnswerTypeOptions] = useState([]);
    const [selectedAnswerType, setSelectedAnswerType] = useState([]);
    const [questionVoiceError, setQuestionVoiceError] = useState(true);
    const [questionVoiceNote, setQuestionVoiceNote] = useState("");
    const [selectedQuestionVoiceNote, setSelectedQuestionVoiceNote] = useState("");

    const [articleSize, setArticleSize] = useState(10);
    const [imageCount, setImageCount] = useState(0);
    const [articleDataTitle, setArticleDataTtitle] = useState("");
    const [newDigicard, setnNewDigicard] = useState(false);


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
    const [previousData, setPreviousData] = useState([]);
    const [count, setCount] = useState(0);

    const [newdIgicardErrMax, setNewDigicardErrMax] = useState(false);
    const [newdIgicardErrMin, setNewDigicardErrMin] = useState(false);
    const [newdIgicardErrReq, setNewDigicardErrReq] = useState(false);
    const [newdIgicardErrRegex, setNewDigicardErrRegex] = useState(false);

    const [options, setOptions] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");//for question category

    const [optionsDisclaimer, setOptionsDisclaimer] = useState([]);
    const [selectedValueDisclaimer, setSelectedValueDisclaimer] = useState([]);
    const [selectedValueCategory, setSelectedValueCategory] = useState([]);
    const [errorMessageDisclaimer, setErrorMessageDisclaimer] = useState(false); //for question disclaimer


    const [questionLabelAlreadyExists, setQuestionLabelAlreadyExists] = useState(false);

    const [answerOptionsForm, setAnswerOptionsForm] = useState([
        {
            answer_type: '',
            answer_option: '',
            answer_content: '',
            answer_display: '',
            answer_weightage: ''
        }
    ]);

    displaySuccessMsg = _questionStatus === 'Save' ? 'Question Saved!' : _questionStatus === 'Submit' ? 'Question Submitted!' : _questionStatus === 'Accept' ? 'Question Accepted!' : _questionStatus === 'Reject' ? 'Question Rejected!' : _questionStatus === 'Revisit' ? 'Question set as Revisit!' : _questionStatus === 'DesignReady' ? 'Question set as Design Ready!' : _questionStatus === 'Publish' ? 'Question Published!' : 'Question Updated!';

    useEffect(() => {

        console.log("Request : ", {
            data: {
                category_status: "Active"
            }
        });
        axios
            // .post("api-url")
            .post(
                dynamicUrl.fetchDisclaimersandCategories,
                {
                    data: {
                        disclaimer_type: "Question",
                        disclaimer_status: "Active",
                        category_type: "Question",
                        category_status: "Active"
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
                await (response.data.categories.map(e => { tempCategoryArr.push({ value: e.category_id, label: e.category_name }) }));
                await (response.data.disclaimers.map(e => { tempDisclaimerArr.push({ value: e.disclaimer_id, label: e.disclaimer_label }) }));

                console.log("tempCategoryArr : ", tempCategoryArr);
                console.log("tempDisclaimerArr : ", tempDisclaimerArr);
                setOptions(tempCategoryArr);
                setOptionsDisclaimer(tempDisclaimerArr);


            })

            .catch((error) => {
                console.log(error)
                setErrorMessage("Error fetching data. Please try again later.")
            });
    }, []);




    const IndividualQuestionData = () => {
        console.log("Options : ", options, optionsDisclaimer);

        let userJWT = sessionStorage.getItem('user_jwt');

        if (userJWT === "" || userJWT === undefined || userJWT === "undefined" || userJWT === null) {

            sessionStorage.clear();
            localStorage.clear();
            history.push('/auth/signin-1');
            window.location.reload();

        } else {

            threadLinks.length === 1 ? setDisplayHeader(false) : setDisplayHeader(true);

            setIsLoading(true);
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
                        let selectedCategory = options.length > 0 && options.filter((e) => e.value === individual_user_data.question_category)
                        console.log("selectedCategory ", selectedCategory[0].value);

                        setSelectedValueCategory(selectedCategory);
                        setSelectedQuestionCategory(selectedCategory[0].value);


                        if (individual_user_data.question_disclaimer === "" || isEmptyArray(individual_user_data.question_disclaimer)) {
                            console.log("Disclaimer is not selected");
                            setSelectedValueDisclaimer([]);
                            setSelectedQuestionDisclaimer([]);
                        } else {
                            console.log("Disclaimer is not selected else");

                            let selectedDisclaimer = optionsDisclaimer.filter((e) => e.value === individual_user_data.question_disclaimer);
                            console.log("selectedDisclaimer ", selectedDisclaimer[0].value);
                            setSelectedValueDisclaimer(selectedDisclaimer);
                            setSelectedQuestionDisclaimer(selectedDisclaimer[0].value);
                        }

                        const radioValue = individual_user_data.show_math_keyboard === 'Yes' ? true : false;

                        setIsLoading(false);

                        setShowMathKeyboard(individual_user_data.show_math_keyboard);
                        _setRadio(radioValue);

                        setSelectedQuestionType(individual_user_data.question_type);
                        setQuestionLabelValue(individual_user_data.question_label);

                        individual_user_data.question_type === 'Subjective' ? setAnswerTypeOptions([
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

                        setArticleDataTtitle(individual_user_data.question_content);

                        let uploadParams = individual_user_data.answers_of_question;
                        let object;
                        let tempArray = [];
                        let tempImgPreviewArr = [];
                        let tempAudioPreviewArr = [];
                        let tempEquPreviewArr = [];

                        if (Array.isArray(uploadParams)) {

                            function setValues(index) {

                                if (index < uploadParams.length) {

                                    if (individual_user_data.answer_type === 'Numbers') {

                                        object = {
                                            answer_type: individual_user_data.answer_type,
                                            answer_content: uploadParams[index].answer_content,
                                            answer_display: uploadParams[index].answer_display,
                                            answer_option: uploadParams[index].answer_option,
                                            answer_weightage: uploadParams[index].answer_weightage,
                                            answer_range_from: Number(uploadParams[index].answer_range_from),
                                            answer_range_to: Number(uploadParams[index].answer_range_to)
                                        }

                                        tempArray.push(object);

                                    } else {

                                        object = {
                                            answer_type: individual_user_data.answer_type,
                                            answer_content: uploadParams[index].answer_content,
                                            answer_display: uploadParams[index].answer_display,
                                            answer_option: uploadParams[index].answer_option,
                                            answer_weightage: uploadParams[index].answer_weightage
                                        }

                                        tempArray.push(object);
                                    }

                                    if (individual_user_data.answer_type === 'Image') {

                                        let tempPreviewImg = uploadParams[index].answer_content_url;
                                        tempImgPreviewArr.push(tempPreviewImg);

                                        index++;
                                        setValues(index);
                                    } else if (individual_user_data.answer_type === 'Equation') {

                                        let tempPreviewEqu = uploadParams[index].answer_content;
                                        tempEquPreviewArr.push(tempPreviewEqu);
                                        index++;
                                        setValues(index);
                                    } else if (individual_user_data.answer_type === 'Audio File') {

                                        let tempPreviewAudio = uploadParams[index].answer_content_url;
                                        tempAudioPreviewArr.push(tempPreviewAudio);

                                        index++;
                                        setValues(index);
                                    } else {

                                        index++;
                                        setValues(index);
                                    }

                                } else {

                                    isEmptyArray(tempArray) ? (

                                        tempArray.push(object = {
                                            answer_type: individual_user_data.answer_type,
                                            answer_option: '',
                                            answer_content: '',
                                            answer_display: '',
                                            answer_weightage: ''
                                        })

                                    ) : (console.log("Not empty"));

                                    tempArray.length >= 1 ? setAddAnswerOptions(true) : setAddAnswerOptions(false);

                                    setAnswerOptionsForm(tempArray);

                                    setPreviewImages(tempImgPreviewArr);

                                    setPreviewAudios(tempAudioPreviewArr);

                                    setEquation(tempEquPreviewArr);

                                    switch (individual_user_data.answer_type) {
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
                                            break;
                                    }

                                    setSelectedAnswerType(individual_user_data.answer_type);

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

                        } else {

                            // sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
                            // fetchUserData();
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
        if (!isEmptyArray(optionsDisclaimer) && !isEmptyArray(options)) {
            console.log("Inside UE!", options, optionsDisclaimer);

            IndividualQuestionData();
        }
    }, [optionsDisclaimer, options]);

    const handleQuestionCategory = (event) => {
        console.log(event);
        setQuestionCategoryErrMsg(false);
        setSelectedValueCategory(event.value);
        setSelectedQuestionCategory(event.value);
    };
    const handleDisclaimerChange = (event) => {
        console.log(event);
        setErrorMessageDisclaimer(false)
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

        let tempFileValue = [...fileValues];
        tempFileValue[count] = '';
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

        let tempFileValue = [...fileValues];
        tempFileValue[count] = '';
        setFileValues(tempFileValue);

        let data = [...answerOptionsForm];
        data[index]["answer_content"] = "";
        console.log(data);
        setAnswerOptionsForm(data);

        let tempCount = count - 1;
        setCount(tempCount);
    }

    const handleRadioChange = (e) => {

        _setRadio(!_radio);
        _radio === true ? setShowMathKeyboard('No') : setShowMathKeyboard('Yes');
    }

    const [answerBlanksOptions, setAnswerBlanksOptions] = useState([]);
    const [answerDisplayOptions, setAnswerDisplayOptions] = useState([
        { value: 'No', label: 'No' },
        { value: 'Yes', label: 'Yes' }
    ]);

    const selectedArr = [{ label: 'Options', value: 'Options' }];

    const handleQuestionType = (event) => {

        setAnswerTypeOptions((currentOptions) => currentOptions.filter((currentOption) => !selectedAnswerType.includes(currentOption)));
        setSelectedQuestionCategory([]);
        setSelectedQuestionDisclaimer([]);

        console.log(answerTypeOptions);
        // setAnswerTypeOptions([]);
        setSelectedAnswerType([]);
        setAnswerOptionsForm([]);
        setQuestionTypeErrMsg(false);
        setQuestionCategoryErrMsg(false);
        setQuestionEmptyErrMsg(false);
        setAnsWeightageErrMsg(false);

        setToggleWordsInput(false);
        setToggleNumbersInput(false);
        setToggleImageInput(false);
        setToggleAudioInput(false);
        setToggleEquationsInput(false);
        setAddAnswerOptions(false);
        setEquation([]);

        console.log(event.target);

        let valuesSelected = event.target.value;
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

    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const handleAnswerBlanks = (event, index) => {

        let data = [...answerOptionsForm];
        if (toggleNumbersInput && event.target.name === 'answer_content') {
            data[index][event.target.name] = Number(event.target.value);
        } else {
            data[index][event.target.name] = event.target.value;
        }

        if (toggleNumbersInput && event.target.name === 'answer_range_from') {
            data[index][event.target.name] = Number(event.target.value);
        }

        if (toggleNumbersInput && event.target.name === 'answer_range_to') {
            data[index][event.target.name] = Number(event.target.value);
        }

        data[index]["answer_type"] = selectedAnswerType;

        if (event.target.name === 'answer_weightage') {
            setAnsWeightageErrMsg(false);
        }

        if (toggleEquationsInput && event.target.name === 'answer_content') {
            let tempEquation = [...equation];
            tempEquation[index] = event.target.value;

            setEquation(tempEquation);
        }

        if (toggleImageInput && event.target.name === 'answer_content') {

            data[index][event.target.name] = '';

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
                tempFileValue[count] = event.target.files.length === 0 ? '' : event.target.files[0];
                setFileValues(tempFileValue);

                let tempCount = count + 1;
                setCount(tempCount);
            }

        }

        if (toggleAudioInput && event.target.name === 'answer_content') {

            data[index][event.target.name] = '';

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
                tempFileValue[count] = event.target.files.length === 0 ? '' : event.target.files[0];
                setFileValues(tempFileValue);

                let tempCount = event.target.files.length === 0 ? count : count + 1;
                setCount(tempCount);

            }
        }

        setAnswerOptionsForm(data);
    }

    const previewQuestionVoiceNote = (e) => {

        let tempUrl = e.target.files.length === 0 ? '' : URL.createObjectURL(e.target.files[0]);
        let tempVoiceNoteFileValues = e.target.files.length === 0 ? '' : e.target.files[0];
        setQuestionVoiceNote(tempUrl);
        setSelectedQuestionVoiceNote(e.target.value);
        setVoiceNoteFileValues(tempVoiceNoteFileValues);
    }

    const handleAnswerType = (event) => {

        let valuesSelected = event.target.value;

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
            case 'Select...':
                setToggleAudioInput(false);
                setToggleWordsInput(false);
                setToggleEquationsInput(false);
                setToggleNumbersInput(false);
                setToggleImageInput(false);
                setAddAnswerOptions(false);
                break;
            default:

        }

    }

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

                                title: sessionStorage.getItem('click_event') === 'Save' ? 'Question Saved!' : sessionStorage.getItem('click_event') === 'Submit' ? 'Question Submitted!' : sessionStorage.getItem('click_event') === 'Accept' ? "Question Accepted!" : sessionStorage.getItem('click_event') === 'Reject' ? "Question Rejected!" : sessionStorage.getItem('click_event') === 'Revisit' ? "Question marked as Revisit!" : sessionStorage.getItem('click_event') === 'DesignReady' ? "Question marked as Design Ready!" : "Question Published!",
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

                                title: displaySuccessMsg,
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
            setnNewDigicard(true)
        } else if (name.trim().length === 0) {
            setNewDigicardErrReq(true)
            setnNewDigicard(true)
        } else {
            let payLoad = {

                question_type: selectedQuestionType,
                question_category: selectedQuestionCategory,
                question_voice_note: selectedQuestionVoiceNote,
                question_content: articleDataTitle,
                answer_type: selectedAnswerType,
                answers_of_question: answerOptionsForm,
                question_status: 'Save',
                question_disclaimer: selectedQuestionDisclaimer,
                show_math_keyboard: showMathKeyboard,
                question_label: document.getElementById('newQuestionLabel').value
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
            console.log(selectedQuestionCategory);
            setQuestionCategoryErrMsg(true);
        } else if (articleDataTitle === "" || articleDataTitle === undefined || articleDataTitle === 'undefined' || articleDataTitle === "<p><br></p>" || articleDataTitle === "<p></p>" || articleDataTitle === "<br>") {
            setQuestionEmptyErrMsg(true);
        } else if (answerOptionsForm) {

            let tempWeightage = answerOptionsForm.filter(value => value.answer_weightage < 0);

            if (tempWeightage.length !== 0) {
                setAnsWeightageErrMsg(true);
            } else {

                console.log('Data inserted!');

                let allFilesData = [];
                let questionsVoiceNoteFilesData = [];

                if (selectedQuestionVoiceNote) {

                    let selectedFileVoiceNote = voiceNoteFileValues;
                    console.log('File is here!');
                    console.log(selectedFileVoiceNote);

                    if (selectedFileVoiceNote) {
                        questionsVoiceNoteFilesData.push(selectedFileVoiceNote);
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


                                setnNewDigicard(true)


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


                                    setnNewDigicard(true)


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


                                setnNewDigicard(true)



                            } else {

                                if (voiceInvalid(allFilesData) !== 0) {
                                    sweetAlertHandler({
                                        title: 'Invalid Audio File(s)!',
                                        type: 'warning',
                                        text: 'Supported file formats are .mp3, .mpeg, .wav. Uploaded files should be less than 10MB. '
                                    });
                                } else {


                                    setnNewDigicard(true)


                                }
                            }
                        } else {

                            setnNewDigicard(true)


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


                                    setnNewDigicard(true)


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


                                        setnNewDigicard(true)


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


                                    setnNewDigicard(true)



                                } else {

                                    if (voiceInvalid(allFilesData) !== 0) {
                                        sweetAlertHandler({
                                            title: 'Invalid Audio File(s)!',
                                            type: 'warning',
                                            text: 'Supported file formats are .mp3, .mpeg, .wav. Uploaded files should be less than 10MB. '
                                        });
                                    } else {


                                        setnNewDigicard(true)


                                    }
                                }
                            } else {


                                setnNewDigicard(true)


                            }

                        }
                    }

                }
                else {

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

                            setnNewDigicard(true)


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


                                setnNewDigicard(true)


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

                            setnNewDigicard(true)



                        } else {

                            if (voiceInvalid(allFilesData) !== 0) {
                                sweetAlertHandler({
                                    title: 'Invalid Audio File(s)!',
                                    type: 'warning',
                                    text: 'Supported file formats are .mp3, .mpeg, .wav. Uploaded files should be less than 10MB. '
                                });
                            } else {


                                setnNewDigicard(true)


                            }
                        }
                    } else {
                        setnNewDigicard(true)


                    }

                }
            }
        }
    }

    return (

        <>
            {
                // (options.length) > 0 && (optionsDisclaimer.length > 0) &&
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
                                                        answerType: '',
                                                        submit: null
                                                    }}

                                                    validationSchema={Yup.object().shape({
                                                        question_label: Yup.string()
                                                            .trim()
                                                            .min(2, 'Question Label is too short!')
                                                            .max(51, 'Question Label is too long!')
                                                            .required('Question Label is required!'),
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
                                                                console.log(selectedQuestionCategory);

                                                                setQuestionCategoryErrMsg(true);
                                                            } else if (articleDataTitle === "" || articleDataTitle === undefined || articleDataTitle === 'undefined' || articleDataTitle === "<p><br></p>" || articleDataTitle === "<p></p>" || articleDataTitle === "<br>") {
                                                                setQuestionEmptyErrMsg(true);
                                                            } else if (answerOptionsForm) {

                                                                let tempWeightage = answerOptionsForm.filter(value => value.answer_weightage < 0);

                                                                if (tempWeightage.length !== 0) {
                                                                    setAnsWeightageErrMsg(true);
                                                                } else {

                                                                    console.log('Data inserted!');

                                                                    let payLoad = {

                                                                        question_type: selectedQuestionType,
                                                                        question_category: selectedQuestionCategory,
                                                                        question_voice_note: selectedQuestionVoiceNote,
                                                                        question_content: articleDataTitle,
                                                                        answer_type: selectedAnswerType,
                                                                        answers_of_question: answerOptionsForm,
                                                                        question_status: 'Save',
                                                                        question_disclaimer: selectedQuestionDisclaimer,
                                                                        show_math_keyboard: showMathKeyboard,
                                                                        question_label: questionLabelValue
                                                                    }

                                                                    console.log("payLoad", payLoad);

                                                                    let allFilesData = [];
                                                                    let questionsVoiceNoteFilesData = [];

                                                                    if (selectedQuestionVoiceNote) {

                                                                        let selectedFileVoiceNote = voiceNoteFileValues;
                                                                        console.log('File is here!');
                                                                        console.log(selectedFileVoiceNote);

                                                                        if (selectedFileVoiceNote) {
                                                                            questionsVoiceNoteFilesData.push(selectedFileVoiceNote);
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

                                                                    }
                                                                    else {

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


                                                        } else {

                                                            console.log(questionLabelValue);

                                                            if (questionLabelValue === "" || questionLabelValue === undefined || questionLabelValue === "undefined") {

                                                                setQuestionLabelErr(true);

                                                            } else if (isEmptyArray(selectedQuestionType)) {
                                                                setQuestionTypeErrMsg(true);
                                                            } else if (isEmptyArray(selectedQuestionCategory) || selectedQuestionCategory === 'Select...') {
                                                                console.log("selectedQuestionCategory : ", selectedQuestionCategory)

                                                                setQuestionCategoryErrMsg(true);
                                                            } else if (articleDataTitle === "" || articleDataTitle === undefined || articleDataTitle === 'undefined' || articleDataTitle === "<p><br></p>" || articleDataTitle === "<p></p>" || articleDataTitle === "<br>") {
                                                                setQuestionEmptyErrMsg(true);
                                                            } else if (answerOptionsForm) {

                                                                let tempWeightage = answerOptionsForm.filter(value => value.answer_weightage < 0);

                                                                if (tempWeightage.length !== 0) {
                                                                    setAnsWeightageErrMsg(true);
                                                                } else {

                                                                    console.log('Data inserted!');

                                                                    let payLoad = {

                                                                        question_id: question_id,
                                                                        question_type: selectedQuestionType,
                                                                        question_category: selectedQuestionCategory,
                                                                        question_voice_note: selectedQuestionVoiceNote,
                                                                        question_content: articleDataTitle,
                                                                        answer_type: selectedAnswerType,
                                                                        answers_of_question: answerOptionsForm,
                                                                        question_status: sessionStorage.getItem('click_event'),
                                                                        question_disclaimer: selectedQuestionDisclaimer,
                                                                        show_math_keyboard: showMathKeyboard,
                                                                        question_label: questionLabelValue
                                                                    }

                                                                    console.log("payLoad", payLoad);

                                                                    let allFilesData = [];
                                                                    let questionsVoiceNoteFilesData = [];

                                                                    if (selectedQuestionVoiceNote) {

                                                                        let selectedFileVoiceNote = voiceNoteFileValues;
                                                                        console.log('File is here!');
                                                                        console.log(selectedFileVoiceNote);

                                                                        if (selectedFileVoiceNote) {
                                                                            questionsVoiceNoteFilesData.push(selectedFileVoiceNote);
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
                                                                                    _editQuestions(payLoad);

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
                                                                                        _editQuestions(payLoad);
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
                                                                                    _editQuestions(payLoad);

                                                                                } else {

                                                                                    if (voiceInvalid(allFilesData) !== 0) {
                                                                                        sweetAlertHandler({
                                                                                            title: 'Invalid Audio File(s)!',
                                                                                            type: 'warning',
                                                                                            text: 'Supported file formats are .mp3, .mpeg, .wav. Uploaded files should be less than 10MB. '
                                                                                        });
                                                                                    } else {

                                                                                        showLoader();
                                                                                        _editQuestions(payLoad);
                                                                                    }
                                                                                }
                                                                            } else {

                                                                                showLoader();
                                                                                _editQuestions(payLoad);
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
                                                                                        _editQuestions(payLoad);

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
                                                                                            _editQuestions(payLoad);
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
                                                                                        _editQuestions(payLoad);

                                                                                    } else {

                                                                                        if (voiceInvalid(allFilesData) !== 0) {
                                                                                            sweetAlertHandler({
                                                                                                title: 'Invalid Audio File(s)!',
                                                                                                type: 'warning',
                                                                                                text: 'Supported file formats are .mp3, .mpeg, .wav. Uploaded files should be less than 10MB. '
                                                                                            });
                                                                                        } else {

                                                                                            showLoader();
                                                                                            _editQuestions(payLoad);
                                                                                        }
                                                                                    }
                                                                                } else {

                                                                                    showLoader();
                                                                                    _editQuestions(payLoad);
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
                                                                                _editQuestions(payLoad);

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
                                                                                    _editQuestions(payLoad);
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
                                                                                _editQuestions(payLoad);

                                                                            } else {

                                                                                if (voiceInvalid(allFilesData) !== 0) {
                                                                                    sweetAlertHandler({
                                                                                        title: 'Invalid Audio File(s)!',
                                                                                        type: 'warning',
                                                                                        text: 'Supported file formats are .mp3, .mpeg, .wav. Uploaded files should be less than 10MB. '
                                                                                    });
                                                                                } else {

                                                                                    showLoader();
                                                                                    _editQuestions(payLoad);
                                                                                }
                                                                            }
                                                                        } else {

                                                                            showLoader();
                                                                            _editQuestions(payLoad);
                                                                        }
                                                                    }

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
                                                                            setFieldValue('answerType', '')
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
                                                                        defaultValue={selectedValueCategory}
                                                                        name="questionCategory"
                                                                        options={options}
                                                                        className="basic-multi-select"
                                                                        classNamePrefix="Select"
                                                                        onChange={(event) => {
                                                                            handleQuestionCategory(event)
                                                                            // setFieldValue('answerType', '')
                                                                        }}
                                                                        menuPortalTarget={document.body}
                                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                    />

                                                                    {questionCategoryErrMsg && (
                                                                        <>
                                                                            <small className="text-danger form-text">{'Please select Question Category'}</small>
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
                                                                            // setFieldValue('answerType', '')
                                                                        }}
                                                                        menuPortalTarget={document.body}
                                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                    />

                                                                    {errorMessageDisclaimer && (
                                                                        <>
                                                                            <small className="text-danger form-text">{'Please select Question Disclaimer'}</small>
                                                                        </>
                                                                    )}





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
                                                                        <small className="text-danger form-text">{'Question required!'}</small>
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

                                                                        {toggleEquationsInput && answerBlanksOptions && (

                                                                            <>
                                                                                <br />

                                                                                {answerOptionsForm.length > 1 && (

                                                                                    < Row >
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

                                                                                    {/* {console.log(form)} */}
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


                                                                                        {previewImages[index] && previewImages[index] !== ""
                                                                                            && (

                                                                                                <>
                                                                                                    <br />

                                                                                                    <img width={150} src={previewImages[index]} alt="" className="img-fluid mb-3" style={{
                                                                                                        marginTop: "20px",
                                                                                                        marginLeft: "-50px"
                                                                                                    }} />


                                                                                                    {
                                                                                                        previewImages[index] && previewImages[index] !== 'N.A.' && (

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

                                                                                        {previewAudios && previewAudios[index] && previewAudios[index] !== 'N.A.' &&
                                                                                            (
                                                                                                <>
                                                                                                    <br />

                                                                                                    <div className="form-group fill" style={{ marginTop: "25px", marginLeft: "-53px" }} >
                                                                                                        <audio controls>
                                                                                                            <source
                                                                                                                src={previewAudios[index]}
                                                                                                                alt="Audio"
                                                                                                                type="audio/mp3" />

                                                                                                        </audio>
                                                                                                    </div>

                                                                                                    {
                                                                                                        previewAudios[index] && (
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

                                                                {
                                                                    sessionStorage.getItem('question_status') === 'Submit' && (

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
                                                                    )
                                                                }

                                                                {
                                                                    sessionStorage.getItem('question_status') === 'Accept' && (

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
                                                                    )
                                                                }

                                                                {
                                                                    sessionStorage.getItem('question_status') === 'Reject' && (
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
                                                                    )
                                                                }

                                                                {
                                                                    sessionStorage.getItem('question_status') === 'Revisit' && (
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
                                                                    )
                                                                }

                                                                {
                                                                    sessionStorage.getItem('question_status') === 'DesignReady' && (

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
                                                                    )
                                                                }
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