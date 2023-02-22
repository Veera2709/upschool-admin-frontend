import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import * as Constants from '../../../../helper/constants';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import dynamicUrl from '../../../../helper/dynamicUrls';
import ReactTags from 'react-tag-autocomplete';
import 'jodit';
import 'jodit/build/jodit.min.css';
import MESSAGES from '../../../../helper/messages';
import Swal from 'sweetalert2';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import withReactContent from 'sweetalert2-react-content';
import ArticleRTE from './ArticleRTE'
import { areFilesInvalid, voiceInvalid } from '../../../../util/utils';
import Multiselect from 'multiselect-react-dropdown';
import { fetchIndividualDigiCard, fetchAllDigiCards } from '../../../api/CommonApi'
import { Link, useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import BasicSpinner from '../../../../helper/BasicSpinner';


const EditDigiCard = () => {

    const colourOptions = [];

    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [disableButton, setDisableButton] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const MySwal = withReactContent(Swal);
    const [invalidFile, setInvalidFile] = useState(false);
    const [articleSize, setArticleSize] = useState(20);
    const [imageCount, setImageCount] = useState(0);
    const [tags, setTags] = useState([]);
    const [imgFile, setImgFile] = useState([]);
    const [voiceNotePre, setVoiceNote] = useState("");
    const [articleData, setArticleData] = useState("");
    const [articleDataTitle, setArticleDataTtitle] = useState("");
    const [digiCardTitles, setDigitalTitles] = useState([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [multiOptions, selectedOption] = useState(0);
    const [topicDigiCardIds, setTopicDigiCardIds] = useState([]);
    const [individualDigiCardData, setIndividualDigiCardData] = useState([]);
    const [digiCardDataTitel, setDigiCardDataTitel] = useState([]);
    const [displayHeading, setDisplayHeading] = useState(sessionStorage.getItem('digicard_type'));
    const [displayHeader, setDisplayHeader] = useState(true);
    const [imgValidation, setImgValidation] = useState(false);
    const [newdIgicardErrMax, setNewDigicardErrMax] = useState(false);
    const [newdIgicardErrMin, setNewDigicardErrMin] = useState(false);
    const [newdIgicardErrReq, setNewDigicardErrReq] = useState(false);
    const [newdIgicardErrRegex, setNewDigicardErrRegex] = useState(false);
    const [imageErr, setImageErr] = useState(false);
    const [status, setStatus] = useState('');
    const [newDigicard, setnNewDigicard] = useState(false);
    const [voiceError, setVoiceError] = useState(true);
    const [isLoading, setIsLoading] = useState(false)



    const threadLinks = document.getElementsByClassName('page-header');
    console.log('individualDigiCardData initial', individualDigiCardData);
    console.log("defaultOptions", defaultOptions);
    let history = useHistory();

    const { digi_card_id } = useParams();

    const handleDelete = (i, states) => {
        const newTags = tags.slice(0);
        newTags.splice(i, 1);
        setTags(newTags);
    };

    const handleAddition = (tag, state) => {
        const newTags = [].concat(tags, tag);
        setTags(newTags);
    };

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    

    const previewImage = (e) => {
        // setImgFile(URL.createObjectURL(e.target.files[0]));
        let FileLength = e.target.files.length
        console.log("FileLength", FileLength);
        FileLength === 1 ? setImgFile(URL.createObjectURL(e.target.files[0])) : setImgFile()
    }

    const previewData = () => {
        let userJWT = sessionStorage.getItem('user_jwt');
        console.log("jwt", userJWT);
        if (userJWT === "" || userJWT === undefined || userJWT === "undefined" || userJWT === null) {
            sessionStorage.clear();
            localStorage.clear();
            history.push('/auth/signin-1');
            window.location.reload();
        } else {
            window.open(`/admin-portal/preview/${digi_card_id}`)
        }
    }

    const previewVoiceNote = (e) => {
        setVoiceNote(URL.createObjectURL(e.target.files[0]));
    }

    const fetchAllData = async () => {
        setIsLoading(true)
        if (threadLinks.length === 2) {
            setDisplayHeader(false);
        } else {
            setDisplayHeader(true);
        }
        const allDigicardData = await fetchAllDigiCards(dynamicUrl.fetchAllDigiCards);
        if (allDigicardData.error) {
            console.log(allDigicardData.error);
            if (allDigicardData.Error.response.data == 'Invalid Token') {
                sessionStorage.clear();
                localStorage.clear();
                history.push('/auth/signin-1');
                window.location.reload();
            }
        } else {
            console.log("allDigicardData", allDigicardData.Items);
            let resultData = allDigicardData.Items;
            resultData.forEach((item, index) => {
                if (item.digicard_status === 'Active' && item.digi_card_id != digi_card_id) {
                    colourOptions.push({ value: item.digi_card_id, label: item.digi_card_title })
                }
            })
            setDigitalTitles(colourOptions);

            const indidvidualDigicard = await fetchIndividualDigiCard(dynamicUrl.fetchIndividualDigiCard, digi_card_id);
            if (indidvidualDigicard.error) {
                console.log("indidvidualDigicard.error", indidvidualDigicard.error);
                if (indidvidualDigicard.Error.response.data == 'Invalid Token') {
                    sessionStorage.clear();
                    localStorage.clear();
                    history.push('/auth/signin-1');
                    window.location.reload();
                }
            } else {
                console.log(indidvidualDigicard);
                let singleData = indidvidualDigicard.Items
                console.log("resultData in indidvidual", singleData);
                let previousImage = indidvidualDigicard.Items[0].digicard_imageURL;
                let previousVoiceNote = indidvidualDigicard.Items[0].digicard_voice_noteURL;

                setIndividualDigiCardData(indidvidualDigicard.Items);
                setDigiCardDataTitel(indidvidualDigicard.Items[0].digi_card_title)
                setImgFile(previousImage);
                setVoiceNote(previousVoiceNote);
                setArticleData(indidvidualDigicard.Items[0].digi_card_content)
                setArticleDataTtitle(indidvidualDigicard.Items[0].digi_card_excerpt)
                setTags(indidvidualDigicard.Items[0].digi_card_keywords)
                selectedOption(indidvidualDigicard.Items[0].related_digi_cards)

                let tempArr = [];
                indidvidualDigicard.Items[0].related_digi_cards.forEach(function (entry) {
                    colourOptions.forEach(function (childrenEntry) {
                        if (entry === childrenEntry.value) {
                            console.log("childrenEntry", childrenEntry);
                            tempArr.push(childrenEntry)
                        }

                    });
                });
                setDefaultOptions(tempArr)
            }
        }
        setIsLoading(false)
    }

    useEffect(() => {
        let userJWT = sessionStorage.getItem('user_jwt');
        console.log("jwt", userJWT);
        if (userJWT === "" || userJWT === undefined || userJWT === "undefined" || userJWT === null) {
            sessionStorage.clear();
            localStorage.clear();
            history.push('/auth/signin-1');
            window.location.reload();
        } else {
            fetchAllData();
        }

    }, []);

    console.log('digiCardDataTitel', digiCardDataTitel);

    const getMultiOptions = (event) => {
        let valuesArr = [];
        for (let i = 0; i < event.length; i++) {
            valuesArr.push(event[i].value)
        }
        selectedOption(valuesArr);
    }

    const inserNewDigicard = () => {
        let DigiCardtitleRegex = Constants.AddDigiCard.DigiCardtitleRegex;
        let name = document.getElementById("newdigicardtitle").value;
        console.log("nameLength", name.length);
        let allFilesData = [];
        let voiceData = [];
        const fileNameArray = ['digicard_image'];
        let voiceNote = document.getElementById('digicard_voice_note').files[0];
        let img = document.getElementById('digicard_image').value;
        // voiceData.push(voiceNote)
        console.log("voicenote", voiceNote);

        if (voiceNote == undefined) {
            voiceData.push({ values: 'false' })
        } else {
            voiceData.push(voiceNote)
        }


        fileNameArray.forEach((fileName) => {
            let selectedFile = document.getElementById(fileName).files[0];
            console.log('File is here!');
            console.log(selectedFile);
            if (selectedFile) {
                allFilesData.push(selectedFile);
            }
        });

        if (areFilesInvalid(allFilesData) !== 0) {
            setImgValidation(false)
            setnNewDigicard(false)
            hideLoader();
        } else if (voiceInvalid(voiceData) !== 0) {
            setVoiceError(false)
            setnNewDigicard(false)
            console.log("voice note not a mp3");
        } else if ((name.length <= 2 && name.length > 0) || name.length > 32) {
            name.length > 32 ? setNewDigicardErrMax(true) : setNewDigicardErrMin(true)
            setnNewDigicard(true)
        } else if (name.trim().length === 0) {
            setNewDigicardErrReq(true)
            setnNewDigicard(true)
        } else if (DigiCardtitleRegex.test(name) === false) {
            setNewDigicardErrRegex(true)
            setnNewDigicard(true)
        } else if (individualDigiCardData[0].digicard_image === '' || individualDigiCardData[0].digicard_image === undefined) {
            setImageErr(true)
            setnNewDigicard(false)
        } else {
            setnNewDigicard(false)
            var formData;
            console.log("------------------------------------------------------");
            if (img === '' || voiceNote === '') {
                console.log("if condition");
                formData = {
                    digi_card_title: name,
                    digi_card_files: [document.getElementById("digicard_image").value],
                    digicard_image: individualDigiCardData[0].digicard_image,
                    digi_card_excerpt: articleDataTitle,
                    digi_card_content: articleData,
                    digi_card_keywords: tags,
                    digicard_voice_note: individualDigiCardData[0].digicard_voice_note === '' ? '' : individualDigiCardData[0].digicard_voice_note,
                    related_digi_cards: multiOptions,
                };
            } else {
                console.log("else condition");
                formData = {
                    digi_card_title: name,
                    digi_card_files: [document.getElementById("digicard_image").value],
                    digicard_image: document.getElementById("digicard_image").value,
                    digi_card_excerpt: articleDataTitle,
                    digi_card_content: articleData,
                    digi_card_keywords: tags,
                    digicard_voice_note: document.getElementById("digicard_voice_note").value === undefined || '' ? "" : document.getElementById("digicard_voice_note").value,
                    related_digi_cards: multiOptions,
                };
            }

            console.log("formData", formData);
            axios
                .post(dynamicUrl.insertDigicard, { data: formData }, { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
                .then(async (response) => {
                    console.log({ response });
                    if (response.Error) {
                        console.log('Error');
                        hideLoader();
                        setDisableButton(false);
                    } else {
                        let uploadParams = response.data;
                        hideLoader();
                        setDisableButton(false);
                        console.log('Proceeding with file upload');

                        if (Array.isArray(uploadParams)) {
                            for (let index = 0; index < uploadParams.length; index++) {
                                let keyNameArr = Object.keys(uploadParams[index]);
                                let keyName = keyNameArr[0];
                                console.log('KeyName', keyName);


                                let blobField = document.getElementById(keyName).files[0];
                                console.log({
                                    blobField
                                });

                                let tempObj = uploadParams[index];

                                let result = await fetch(tempObj[keyName], {
                                    method: 'PUT',
                                    body: blobField
                                });

                                console.log({
                                    result
                                });
                            }
                            // sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingDigiCard });
                            hideLoader();
                            setDisableButton(false);
                            // fetchClientData();
                            setIsOpen(false);

                            MySwal.fire({

                                title: 'Digicard added successfully!',
                                icon: 'success',
                            }).then((willDelete) => {
                                history.push('/admin-portal/active-digiCard');
                                window.location.reload();

                            })
                        } else {
                            console.log('No files uploaded');
                            sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingDigiCard });
                            hideLoader();
                            setDisableButton(false);
                            // fetchClientData();
                            setIsOpen(false);
                        }
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        // Request made and server responded
                        console.log(error.response.data);

                        console.log(error.response.data);
                        if (error.response.status === 401) {
                            console.log();
                            hideLoader();
                            // setIsClientExists(true);
                            sweetAlertHandler({ title: 'Error', type: 'error', text: MESSAGES.ERROR.DigiCardNameExists });

                        } else if (error.response.data === 'Invalid Token') {

                            sessionStorage.clear();
                            localStorage.clear();
                            history.push('/auth/signin-1');
                            window.location.reload();
                        } else {
                            console.log("err", error);
                        }

                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log(error.request);
                        setDisableButton(false);
                        hideLoader();
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                        setDisableButton(false);
                        hideLoader();
                    }
                });
        }
    }

    return (
        <div>
            {isLoading ? (
                <BasicSpinner />
            ) : (
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
                                                    <li className="breadcrumb-item  ">Digicard</li>
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
                                <Card.Title>Edit DigiCard</Card.Title>
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        // digicardname: individualDigiCardData.digi_card_name,
                                        digicardtitle: digiCardDataTitel,
                                        digicard_image: '',
                                        digicard_voice_note: '',
                                        digi_card_keywords: tags
                                    }}
                                    validationSchema={Yup.object().shape({
                                        digicardtitle: Yup.string()
                                            .trim()
                                            .min(2, Constants.AddDigiCard.DigiCardtitleTooShort)
                                            .max(32, Constants.AddDigiCard.DigiCardtitleTooLong)
                                            .matches(Constants.AddDigiCard.DigiCardtitleRegex, Constants.AddDigiCard.DigiCardtitleValidation)
                                            .required(Constants.AddDigiCard.DigiCardtitleRequired),
                                    })}


                                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                        console.log("multiOptions in submitting time", multiOptions);
                                        let allFilesData = [];

                                        const fileNameArray = ['digicard_image'];

                                        fileNameArray.forEach((fileName) => {
                                            let selectedFile = document.getElementById(fileName).files[0];
                                            console.log('File is here!');
                                            console.log(selectedFile);
                                            if (selectedFile) {
                                                allFilesData.push(selectedFile);
                                            }
                                        });

                                        if (areFilesInvalid(allFilesData) !== 0) {
                                            setImgValidation(true)
                                            hideLoader();
                                        } else {
                                            var formData;
                                            if (values.digicard_image === '' || voiceNotePre !== undefined) {
                                                console.log("if condition");
                                                formData = {
                                                    digi_card_id: individualDigiCardData[0].digi_card_id,
                                                    digi_card_title: values.digicardtitle,
                                                    digi_card_files: [values.digicard_image],
                                                    digicard_image: imgFile,
                                                    digicard_voice_note: voiceNotePre === undefined ? values.digicard_voice_note : values.digicard_voice_note,
                                                    digi_card_excerpt: articleDataTitle,
                                                    digi_card_content: articleData,
                                                    digi_card_keywords: tags,
                                                    related_digi_cards: multiOptions
                                                };
                                            } else {
                                                console.log("else condition");
                                                formData = {
                                                    digi_card_id: individualDigiCardData[0].digi_card_id,
                                                    digi_card_title: values.digicardtitle,
                                                    digi_card_files: [values.digicard_image],
                                                    digicard_image: values.digicard_image,
                                                    digicard_voice_note: values.digicard_voice_note,
                                                    digi_card_excerpt: articleDataTitle,
                                                    digi_card_content: articleData,
                                                    digi_card_keywords: tags,
                                                    related_digi_cards: multiOptions
                                                };
                                            }

                                            console.log("formData", formData);

                                            axios
                                                .post(dynamicUrl.editDigiCard, { data: formData }, { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
                                                .then(async (response) => {
                                                    console.log({ response });
                                                    if (response.Error) {
                                                        console.log('Error');
                                                        hideLoader();
                                                        setDisableButton(false);
                                                    } else {
                                                        let uploadParams = response.data;
                                                        hideLoader();
                                                        setDisableButton(false);
                                                        console.log('Proceeding with file upload');

                                                        if (Array.isArray(uploadParams)) {
                                                            for (let index = 0; index < uploadParams.length; index++) {
                                                                let keyNameArr = Object.keys(uploadParams[index]);
                                                                let keyName = keyNameArr[0];
                                                                console.log('KeyName', keyName);

                                                                let blobField = document.getElementById(keyName).files[0];
                                                                console.log({
                                                                    blobField
                                                                });

                                                                let tempObj = uploadParams[index];

                                                                let result = await fetch(tempObj[keyName], {
                                                                    method: 'PUT',
                                                                    body: blobField
                                                                });

                                                                console.log({
                                                                    result
                                                                });
                                                            }
                                                            // sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.EditDigiCard });
                                                            MySwal.fire({

                                                                title: 'DigiCard Updated successfully!',
                                                                icon: 'success',
                                                            }).then((willDelete) => {
                                                                history.push('/admin-portal/active-digiCard');
                                                                window.location.reload();

                                                            })
                                                            hideLoader();
                                                            setDisableButton(false);
                                                            // fetchClientData();
                                                            setIsOpen(false);
                                                        } else {
                                                            console.log('No files uploaded');
                                                            sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.EditDigiCard });
                                                            hideLoader();
                                                            setDisableButton(false);
                                                            // fetchClientData();
                                                            setIsOpen(false);
                                                        }
                                                    }
                                                })
                                                .catch((error) => {
                                                    if (error.response) {
                                                        // Request made and server responded
                                                        console.log(error.response.data);

                                                        console.log(error.response.data);
                                                        if (error.response.status === 401) {
                                                            console.log();
                                                            hideLoader();
                                                            // setIsClientExists(true);
                                                            sweetAlertHandler({ title: 'Error', type: 'error', text: MESSAGES.ERROR.DigiCardNameExists });

                                                        } else if (error.response.data === 'Invalid Token') {

                                                            sessionStorage.clear();
                                                            localStorage.clear();
                                                            history.push('/auth/signin-1');
                                                            window.location.reload();
                                                        } else {
                                                            console.log("err", error);
                                                        }
                                                    } else if (error.request) {
                                                        // The request was made but no response was received
                                                        console.log(error.request);
                                                        setDisableButton(false);
                                                        hideLoader();
                                                    } else {
                                                        // Something happened in setting up the request that triggered an Error
                                                        console.log('Error', error.message);
                                                        setDisableButton(false);
                                                        hideLoader();
                                                    }
                                                });
                                        }
                                        // setSubmitting(true);
                                    }}
                                >
                                    {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                                        <form noValidate onSubmit={handleSubmit}>
                                            <Row>
                                                {/* {edit1Toggle && <Loader />} */}
                                                <Col sm={6}>
                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="digicardtitle">
                                                            <small className="text-danger">* </small>DigiCard Title
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            error={touched.digicardtitle && errors.digicardtitle}
                                                            name="digicardtitle"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            type="text"
                                                            value={values.digicardtitle}
                                                        />
                                                        {touched.digicardtitle && errors.digicardtitle && <small className="text-danger form-text">{errors.digicardtitle}</small>}
                                                    </div>
                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="digicard_image">
                                                            <small className="text-danger">* </small>DigiCard Logo
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            error={touched.entityName && errors.entityName}
                                                            name="digicard_image"
                                                            id="digicard_image"
                                                            onBlur={handleBlur}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                previewImage(e);
                                                                setImgValidation(false)
                                                            }}
                                                            type="file"
                                                            value={values.digicard_image}
                                                            accept="image/*"
                                                        />
                                                        {touched.digicard_image && errors.digicard_image && (
                                                            <small className="text-danger form-text">{errors.digicard_image}</small>
                                                        )}
                                                        {imageErr && (
                                                            <small className="text-danger form-text">Digicard Image is required!</small>
                                                        )}
                                                        {imgValidation && (<small className="text-danger form-text">Invalid File Type or File size is Exceed More Than 1MB</small>)}
                                                    </div>
                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="digicard_voice_note">
                                                            <small className="text-danger"> </small>Voice Note
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            error={touched.digicard_voice_note && errors.digicard_voice_note}
                                                            name="digicard_voice_note"
                                                            id="digicard_voice_note"
                                                            onBlur={handleBlur}
                                                            onChange={(e) => {
                                                                handleChange(e);
                                                                previewVoiceNote(e);
                                                            }}
                                                            type="file"
                                                            value={values.digicard_voice_note}
                                                            accept=".mp3,audio/*"
                                                        // accept="image/*"
                                                        />
                                                        {touched.digicard_voice_note && errors.digicard_voice_note && (
                                                            <small className="text-danger form-text">{errors.digicard_voice_note}</small>
                                                        )}
                                                    </div>

                                                    <div className='ReactTags'>
                                                        <label className="floating-label" htmlFor="digicard_image">
                                                            <small className="text-danger"> </small>KeyWords
                                                        </label>
                                                        <ReactTags
                                                            classNames={{ root: 'react-tags bootstrap-tagsinput', selectedTag: 'react-tags__selected-tag btn-primary' }}
                                                            allowNew={true}
                                                            addOnBlur={true}
                                                            tags={tags}
                                                            onDelete={handleDelete}
                                                            onAddition={(e) => handleAddition(e)}
                                                        />
                                                    </div><br />



                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="digicardtitle">
                                                            <small className="text-danger"> </small>Related DigiCard Titles
                                                        </label>
                                                        {defaultOptions.length === 0 ? (

                                                            <Select

                                                                className="basic-single"
                                                                classNamePrefix="select"
                                                                name="color"
                                                                isMulti
                                                                closeMenuOnSelect={false}
                                                                onChange={getMultiOptions}
                                                                options={digiCardTitles}
                                                                placeholder="Select"
                                                                menuPortalTarget={document.body}
                                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                            />

                                                        ) : (
                                                            <>
                                                                {defaultOptions && (

                                                                    <Select
                                                                        defaultValue={defaultOptions}
                                                                        className="basic-single"
                                                                        classNamePrefix="select"
                                                                        name="color"
                                                                        isMulti
                                                                        closeMenuOnSelect={false}
                                                                        onChange={getMultiOptions}
                                                                        options={digiCardTitles}
                                                                        placeholder="Select"
                                                                        menuPortalTarget={document.body}
                                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                                    />

                                                                )}
                                                            </>

                                                        )}


                                                    </div>
                                                </Col>
                                                <Col sm={6}>

                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="digicardtitle">
                                                            <small className="text-danger">* </small>Logo preview
                                                        </label><br />
                                                        <img width={100} src={imgFile} alt="" className="img-fluid mb-3" />
                                                    </div>
                                                    {voiceNotePre && (<div className="form-group fill">
                                                        <label className="floating-label" htmlFor="digicard">
                                                            <small className="text-danger">* </small>Voice Note Preview
                                                        </label><br />
                                                        {/* <img width={150} src={voiceNote} alt="" className="img-fluid mb-3" /> */}
                                                        <audio controls>
                                                            <source src={voiceNotePre} alt="Audio" type="audio/mp3" />
                                                        </audio>
                                                    </div>)}



                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm='12'>
                                                    <label className="floating-label" htmlFor="digicardtitle">
                                                        <small className="text-danger"> </small>DigiCard Excerpt
                                                    </label>
                                                    <ArticleRTE
                                                        setArticleSize={setArticleSize}
                                                        setImageCount={setImageCount}
                                                        imageCount={imageCount}
                                                        articleData={articleDataTitle}
                                                        setArticleData={setArticleDataTtitle}
                                                    />
                                                </Col>
                                            </Row><br></br>
                                            <Row>
                                                <Col sm='12'>
                                                    <label className="floating-label" htmlFor="digicardtitle">
                                                        <small className="text-danger"> </small>DigiCard Content
                                                    </label>
                                                    <ArticleRTE
                                                        setArticleSize={setArticleSize}
                                                        setImageCount={setImageCount}
                                                        imageCount={imageCount}
                                                        articleData={articleData}
                                                        setArticleData={setArticleData}
                                                    />
                                                </Col>
                                            </Row><br></br>
                                            <Row >
                                                <Col sm={6}>
                                                </Col>
                                                <Col>
                                                    <Row>
                                                        <Col>
                                                            <Button
                                                                className="btn-block"
                                                                color="success"
                                                                size="large"
                                                                variant="success"
                                                                onClick={previewData}
                                                            >
                                                                preview
                                                            </Button>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                className="btn-block"
                                                                color="success"
                                                                size="large"
                                                                // type="submit"
                                                                variant="primary"
                                                                onClick={(e) => {
                                                                    setStatus("Save");
                                                                    setnNewDigicard(true)
                                                                }}
                                                            >
                                                                Save As New
                                                            </Button>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                className="btn-block"
                                                                color="success"
                                                                size="large"
                                                                type="submit"
                                                                variant="success"
                                                            >
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
                        <Modal dialogClassName="my-modal" show={newDigicard} onHide={() => setnNewDigicard(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title as="h5">New Digicard Title</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col sm={9} >
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="digicardtitle">
                                                <small className="text-danger">* </small>DigiCard Title
                                            </label>
                                            <input
                                                className="form-control"
                                                id="newdigicardtitle"
                                                type="text"
                                                onChange={(e) => {
                                                    setNewDigicardErrMin(false)
                                                    setNewDigicardErrMax(false)
                                                    setNewDigicardErrReq(false)
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={9}>
                                        {newdIgicardErrMin && (
                                            <small className="text-danger form-text">Digicard title is too short!</small>
                                        )}
                                        {newdIgicardErrMax && (
                                            <small className="text-danger form-text">Digicard title is too long!</small>
                                        )}
                                        {newdIgicardErrReq && (
                                            <small className="text-danger form-text">Digicard title is required!</small>
                                        )}
                                        {newdIgicardErrRegex && (
                                            <small className="text-danger form-text">Digicard title should contain only alphabets and numbers!</small>
                                        )}
                                    </Col>
                                    <Col>
                                        <Button variant="primary" onClick={(e) => {
                                            inserNewDigicard();
                                        }}>Create New DigiCard</Button>
                                    </Col>
                                </Row>
                            </Modal.Body>
                        </Modal>
                    </React.Fragment>
                </>
            )}
        </div>

    )
};

export default EditDigiCard;
