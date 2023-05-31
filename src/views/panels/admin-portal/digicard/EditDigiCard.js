import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal, InputGroup } from 'react-bootstrap';
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
import { fetchIndividualDigiCard, fetchDigiCardsBasedonStatus } from '../../../api/CommonApi'
import { Link, useHistory, useParams } from 'react-router-dom';
import Select from 'react-draggable-multi-select';
import BasicSpinner from '../../../../helper/BasicSpinner';


const EditDigiCard = () => {

    const colourOptions = [];
    const [selectedFile, setSelectedFile] = useState(null);//doc selected

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
    const [documentPre, setDocumentPre] = useState("");
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
    const [imageErr, setImageErr] = useState(false);
    const [status, setStatus] = useState('');
    const [newDigicard, setnNewDigicard] = useState(false);
    const [voiceError, setVoiceError] = useState(true);
    const [docError, setDocError] = useState(true);//upload doc err
    const [isLoading, setIsLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");

    const threadLinks = document.getElementsByClassName('page-header');
    console.log('individualDigiCardData initial', individualDigiCardData);
    console.log("defaultOptions", defaultOptions);
    let history = useHistory();

    const { digi_card_id } = useParams();



    const allowedFileTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif'];

    const handleDisplayName = (e) => {

        console.log("handleDisplayName : ", e.target.value);
        setDisplayName(e.target.value)
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

        if (!allowedFileTypes.includes(fileExtension)) {
            console.log('Invalid file type');
            MySwal.fire('Sorry', 'Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, PNG, and GIF files are allowed.', 'warning').then(() => {
                window.location.reload();
            });
            event.target.value = null;
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    function handleChange(event) {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    }

    function getPreviewLink(e) {
        console.log("getPreviewLink");
        console.log("URL.createObjectURL(selectedFile) : ", URL.createObjectURL(e.target.files[0]));
        individualDigiCardData[0].digicard_documentURL = URL.createObjectURL(e.target.files[0])
        // if (selectedFile) {

        //     return URL.createObjectURL(selectedFile);
        // } else {
        //     return "";
        // }

    }

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
        let FileLength = e.target.files.length
        console.log("FileLength", FileLength);
        FileLength === 1 ? setImgFile(URL.createObjectURL(e.target.files[0])) : setImgFile()
    }
    const previewDocument = (e) => {
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
        console.log("threadLinks", threadLinks.length);
        if (threadLinks.length === 1 || threadLinks.length === 2) {
            setDisplayHeader(false);
        } else {
            setDisplayHeader(true);
        }
        const allDigicardData = await fetchDigiCardsBasedonStatus("Active");
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
                if (item.digi_card_id !== digi_card_id) {
                    colourOptions.push({ value: item.digi_card_id, label: item.digi_card_title })
                }
            })
            setDigitalTitles(colourOptions);

            const indidvidualDigicard = await fetchIndividualDigiCard(dynamicUrl.fetchIndividualDigiCard, digi_card_id);
            if (indidvidualDigicard.error) {
                console.log("indidvidualDigicard.error", indidvidualDigicard.error);
                if (indidvidualDigicard.Error.response.data === 'Invalid Token') {
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
                setDisplayName(indidvidualDigicard.Items[0].display_name);
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
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        selectedOption(valuesArr);
    }

    const inserNewDigicard = () => {
        let DigiCardtitleRegex = Constants.AddDigiCard.DigiCardtitleRegex;
        let name = document.getElementById("newdigicardtitle").value;
        let display_name = document.getElementsByName("displayname").value;
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
        } else if (individualDigiCardData[0].digicard_image === '' || individualDigiCardData[0].digicard_image === undefined) {
            setImageErr(true)
            setnNewDigicard(false)
        } else {
            var formData = {
                digi_card_title: name,
                // display_name:,
                display_name: displayName,
                digi_card_files: [document.getElementById("digicard_image").value],
                digicard_image: document.getElementById("digicard_image").value === '' ?
                    (individualDigiCardData[0].digicard_image === '' ? '' : individualDigiCardData[0].digicard_image)
                    : document.getElementById("digicard_image").value,
                digi_card_excerpt: articleDataTitle,
                digi_card_content: articleData,
                digi_card_keywords: tags,
                digicard_document: document.getElementById("digicard_document").value === '' ?
                    (individualDigiCardData[0].digicard_document === '' ? '' : individualDigiCardData[0].digicard_document)
                    : individualDigiCardData[0].digicard_document,//upload doc
                digicard_voice_note: document.getElementById("digicard_voice_note").value === '' ?
                    (individualDigiCardData[0].digicard_voice_note === '' ? '' : individualDigiCardData[0].digicard_voice_note)
                    : document.getElementById("digicard_voice_note").value,
                related_digi_cards: multiOptions,
            };
            console.log("formData", formData);
            showLoader()
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
                            hideLoader()
                            setnNewDigicard(false)
                            MySwal.fire({
                                title: 'Digicard added successfully!',
                                icon: 'success',
                            }).then((willDelete) => {
                                history.push('/admin-portal/active-digiCard');
                                window.location.reload();
                            })
                        } else {
                            console.log('No files uploaded');
                            hideLoader()
                            setnNewDigicard(false)
                            sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingDigiCard });
                            history.push('/admin-portal/active-digiCard');
                            window.location.reload();
                        }
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.data);
                        if (error.response.status === 401) {
                            console.log();
                            hideLoader();
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
                        console.log(error.request);
                        hideLoader();
                    } else {
                        console.log('Error', error.message);
                        hideLoader();
                    }
                });
        }
    }

    //doc
    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    };



    return (
        <div>
            {isLoading ? (
                <BasicSpinner />
            ) : (
                <>{
                    individualDigiCardData.length > 0 &&
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
                                        digicardtitle: individualDigiCardData[0].digi_card_title,
                                        displayname: displayName,
                                        digicard_image: '',
                                        digicard_voice_note: '',
                                        digicard_document: '',
                                        digi_card_keywords: tags
                                    }}
                                    validationSchema={Yup.object().shape({
                                        digicardtitle: Yup.string()
                                            .trim()
                                            .min(2, Constants.AddDigiCard.DigiCardtitleTooShort)
                                            .max(32, Constants.AddDigiCard.DigiCardtitleTooLong)
                                            .required(Constants.AddDigiCard.DigiCardtitleRequired),

                                        displayname: Yup.string()
                                            .trim()
                                            .min(2, Constants.AddDigiCard.DisplayNameTooShort)

                                            .required(Constants.AddDigiCard.DisplayNameRequired),
                                    })}


                                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                        showLoader()
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
                                            const formData = {
                                                digi_card_id: individualDigiCardData[0].digi_card_id,
                                                digi_card_title: values.digicardtitle,
                                                display_name: displayName,

                                                digi_card_files: [values.digicard_image],
                                                digicard_image: values.digicard_image === '' || values.digicard_image === undefined ? individualDigiCardData[0].digicard_image : values.digicard_image,
                                                digicard_document: values.digicard_document === '' || values.digicard_document === undefined ? individualDigiCardData[0].digicard_document : values.digicard_document,//upload doc
                                                digicard_voice_note: values.digicard_voice_note === '' || values.digicard_voice_note === undefined ? individualDigiCardData[0].digicard_voice_note : values.digicard_voice_note,
                                                digi_card_excerpt: articleDataTitle,
                                                digi_card_content: articleData,
                                                digi_card_keywords: tags,
                                                related_digi_cards: multiOptions
                                            };
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
                                                        } else {
                                                            console.log('No files uploaded');
                                                            sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.EditDigiCard });
                                                            hideLoader();
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





                                                    <Row>
                                                        <Col>
                                                            <div className="form-group fill">
                                                                <label className="floating-label" htmlFor="displayname">
                                                                    <small className="text-danger">* </small>Display Name
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.displayname && errors.displayname}
                                                                    name="displayname"
                                                                    id="display_name"
                                                                    onBlur={handleBlur}
                                                                    onChange={(e) => {
                                                                        handleChange(e);
                                                                        handleDisplayName(e)
                                                                    }}
                                                                    type="text"
                                                                    value={displayName}
                                                                />
                                                                {touched.displayname && errors.displayname && <small className="text-danger form-text">{errors.displayname}</small>}
                                                            </div>
                                                        </Col>


                                                    </Row>



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
                                                        {imgValidation && (<small className="text-danger form-text">Invalid File Type or File size is Exceed More Than 2MB</small>)}
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
                                                            onClick={(e) => {
                                                                setVoiceNote('');
                                                            }}
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


                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="digicard_document">
                                                            <small className="text-danger"> </small> Upload Document
                                                        </label>
                                                        <InputGroup>
                                                            <input

                                                                className="form-control"
                                                                error={touched.digicard_document && errors.digicard_document}
                                                                name="digicard_document"
                                                                id="digicard_document"
                                                                value={values.digicard_document}

                                                                onBlur={handleBlur}
                                                                onChange={(e) => { handleFileInput(e); handleChange(e); getPreviewLink(e); handleFileChange(e) }}
                                                                type="file"
                                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                                                            />
                                                        </InputGroup>


                                                        {selectedFile && (
                                                            <small className="text-muted form-text">
                                                                Selected file: {selectedFile.name}
                                                            </small>
                                                        )}

                                                        {<a href={individualDigiCardData[0].digicard_documentURL} target="_blank" >Click here to Preview Document</a>}




                                                        <small className="text-danger form-text" style={{ display: docError ? 'none' : 'block' }}>Invalid File Type or File size is Exceed More Than 10MB</small>




                                                        {touched.digicard_document && errors.digicard_document && (
                                                            <small className="text-danger form-text">{errors.digicard_document}</small>
                                                        )}
                                                        <small className="text-danger form-text" style={{ display: docError ? 'none' : 'block' }}>Invalid File Type or File size is Exceed More Than 10MB</small>
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

                                                    <div className="form-group fill" style={{ marginTop: '60px' }}>
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
                                                {loader}
                                            </Row><br></br>
                                            <Row >
                                                <Col sm={6}>
                                                </Col>
                                                <Col>
                                                    <Row>
                                                        <Col>
                                                            {/* <Button
                                                                className="btn-block"
                                                                color="success"
                                                                size="large"
                                                                variant="success"
                                                                onClick={previewData}
                                                            >
                                                                Save And Preview
                                                            </Button> */}
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
                        <Modal dialogClassName="my-modal" show={newDigicard}
                            onHide={() => {
                                setnNewDigicard(false);
                                setNewDigicardErrMin(false);
                                setNewDigicardErrMax(false);
                                setNewDigicardErrReq(false);
                            }
                            }>
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
                                        </div><br />
                                        {loader}
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
                }
                </>
            )}
        </div>

    )
};

export default EditDigiCard;
