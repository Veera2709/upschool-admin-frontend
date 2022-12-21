import React, { useState, useEffect } from 'react';
// import './style.css'
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
// import CkDecoupledEditor from '../../../components/CK-Editor/CkDecoupledEditor';
import * as Constants from '../../../../helper/constants';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import dynamicUrl from '../../../../helper/dynamicUrls';
import ReactTags from 'react-tag-autocomplete';
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from 'jodit-react';
import MESSAGES from '../../../../helper/messages';
import Swal from 'sweetalert2';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import withReactContent from 'sweetalert2-react-content';
import AddArticles from '../digicard/AddArticles'
import ArticleRTE from './ArticleRTE'
import { areFilesInvalid } from '../../../../util/utils';
import { isEmptyObject } from '../../../../util/utils';
import Select from 'react-select';
import Multiselect from 'multiselect-react-dropdown';




import { Link, useHistory, useParams } from 'react-router-dom';

import { SessionStorage } from '../../../../util/SessionStorage';

// import { Button,Container,Row ,Col  } from 'react-bootstrap';

const EditDigiCard = (
    setTabChange,
    categoryAPI,
    added,
    setAdded,
    articlesList,
    currentArticle,
    setEditArticle,
    editMode,
    currentSubCategory,
    terminal,
    setCurrentSubCategory
) => {


    const colourOptions = [];

    const [content, setContent] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [disableButton, setDisableButton] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const MySwal = withReactContent(Swal);
    const [isClientExists, setIsClientExists] = useState(false);
    const [invalidFile, setInvalidFile] = useState(false);
    const [currentFeature, setCurrentFeature] = useState("");
    const [title, setTitle] = useState("");

    const [category, setCategory] = useState("");
    const [categoryNameEdit, setCategoryNameEdit] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [subCategoryName, setSubCategoryName] = useState("");
    const [device, setDevice] = useState(terminal);
    const [featured, setFeatured] = useState("No");
    const [categoryCollection, setCategoryCollection] = useState("");
    const [subCollection, setSubCollection] = useState("");
    const [currentStatus, setCurrentStatus] = useState("Draft");
    const [createdAt, setCreatedAt] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [modifiedAt, setModifiedAt] = useState("");
    const [modifiedBy, setModifiedBy] = useState("");
    const [uniqueArticle, setUniqueArtricle] = useState("");
    const [terminalOption, setTerminalOption] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [views, setViews] = useState([]);
    const [upvotes, setUpvotes] = useState([]);
    const [downvotes, setDownvotes] = useState([]);
    const [submitAnchor, setSubmitAnchor] = useState(false);
    const [finalSequenceNo, setFinalSequenceNo] = useState("");
    const [articleSize, setArticleSize] = useState(20);
    const [imageCount, setImageCount] = useState(0);





    const [tags, setTags] = useState([]);
    const [imgFile, setImgFile] = useState([]);
    const [voiceNote, setVoiceNote] = useState([]);
    const [articleData, setArticleData] = useState("");
    const [articleDataTitle, setArticleDataTtitle] = useState("");
    const [digiCardTitles, setDigitalTitles] = useState([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [multiOptions, selectedOption] = useState(0);


    const [topicDigiCardIds, setTopicDigiCardIds] = useState([]);
    const [topicDigiCardNames, setTopicDigiCardNames] = useState([]);


    const [individualDigiCardData, setIndividualDigiCardData] = useState([]);
    console.log('individualDigiCardData initial', individualDigiCardData);
    console.log("defaultOptions", defaultOptions);

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
        setImgFile(URL.createObjectURL(e.target.files[0]));
    }

    const previewVoiceNote = (e) => {
        setVoiceNote(URL.createObjectURL(e.target.files[0]));
    }


    const fetchAllDigiCards = () => {
        axios.post(dynamicUrl.fetchAllDigiCards, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response.data.Items);
                let resultData = response.data.Items;


                resultData.forEach((item, index) => {
                    // item.digicard_status === 'Active' ? colourOptions.push({ value: item.digi_card_title, digi_card_id: item.digi_card_id }) : {}
                    // console.log("item",item)
                    if(item.digicard_status === 'Active'){
                        colourOptions.push({ value: item.digi_card_title, digi_card_id: item.digi_card_id })
                    }
                }
                );
                console.log("colourOptions", colourOptions);
                setDigitalTitles(colourOptions)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        axios
            .post(
                dynamicUrl.fetchIndividualDigiCard,
                {
                    data: {
                        "digi_card_id": digi_card_id,
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

                    console.log('inside res initial data');

                    let individual_client_data = response.data.Items[0];
                    let previousImage = response.data.Items[0].digicard_imageURL;
                    let previousVoiceNote = response.data.Items[0].digicard_voice_noteURL;
                    console.log("previousVoiceNote", previousVoiceNote);
                    console.log("individual_client_data", individual_client_data);
                    console.log("keyWords", individual_client_data.digi_card_keywords);
                    // let previousSubscription = response.data.Items[0].scbscription_active;

                    // setScbscription_active(previousSubscription);
                    setImgFile(previousImage);
                    setVoiceNote(previousVoiceNote);
                    setIndividualDigiCardData(individual_client_data);
                    setArticleData(individual_client_data.digi_card_content)
                    setArticleDataTtitle(individual_client_data.digi_card_excerpt)
                    setTags(individual_client_data.digi_card_keywords)
                    setDefaultOptions([...individual_client_data.related_digi_cards])
                    selectedOption(individual_client_data.related_digi_cards)
                    console.log("defaultOptions", individual_client_data.related_digi_cards);

                    console.log('individualDigiCardData after API', individualDigiCardData);

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
                    // setStatus({ success: false });
                    // setErrors({ submit: error.response.data });
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                    hideLoader();
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    hideLoader();
                }
            });

        fetchAllDigiCards();

    }, []);

    const handleOnSelect = ((selectedList, selectedItem) => {
        selectedOption(selectedList)
    })
    const handleOnRemove = (selectedList, selectedItem) => setTopicDigiCardIds(selectedList.map(skillId => skillId.id))

    return isEmptyObject(individualDigiCardData) || digiCardTitles === '' ? null : (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>Edit DigiCard</Card.Title>
                    <Formik
                        initialValues={{
                            // digicardname: individualDigiCardData.digi_card_name,
                            digicardtitle: individualDigiCardData.digi_card_title,
                            digicard_image: '',
                            digicard_voice_note: '',
                            digi_card_keywords: tags
                        }}
                        validationSchema={Yup.object().shape({
                            // digicardname: Yup.string()
                            //     .trim()
                            //     .min(2, Constants.AddDigiCard.DigiCardNameTooShort)
                            //     .max(50, Constants.AddDigiCard.DigiCardNameTooLong)
                            //     .matches(Constants.AddDigiCard.DigiCardNameRegex, Constants.AddDigiCard.DigiCardNameValidation)
                            //     .required(Constants.AddDigiCard.DigiCardNameRequired),
                            digicardtitle: Yup.string()
                                .trim()
                                .min(2, Constants.AddDigiCard.DigiCardtitleTooShort)
                                .max(50, Constants.AddDigiCard.DigiCardtitleTooLong)
                                .matches(Constants.AddDigiCard.DigiCardtitleRegex, Constants.AddDigiCard.DigiCardtitleValidation)
                                .required(Constants.AddDigiCard.DigiCardtitleRequired),
                            // digicard_image: Yup.string()
                            //     .trim()
                            //     .nullable(true, Constants.AddDigiCard.DigiCardFileNotNull)
                            //     .required(Constants.AddDigiCard.DigiCardfileRequired),

                        })}


                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            console.log("multiOptions in submitting time", multiOptions);


                            var formData;

                            if (values.digicard_image === '') {
                                console.log("if condition");
                                formData = {
                                    digi_card_id: individualDigiCardData.digi_card_id,
                                    digi_card_title: values.digicardtitle,
                                    digi_card_files: [values.digicard_image],
                                    digicard_image: imgFile,
                                    digicard_voice_note: voiceNote === undefined ? '' : voiceNote,
                                    digi_card_excerpt: articleDataTitle,
                                    digi_card_content: articleData,
                                    digi_card_keywords: tags,
                                    related_digi_cards: multiOptions
                                };
                            } else {
                                console.log("else condition");
                                formData = {
                                    digi_card_id: individualDigiCardData.digi_card_id,
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
                                            sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.EditDigiCard });
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
                                        if (error.response.status === 400) {
                                            console.log();
                                            hideLoader();
                                            // setIsClientExists(true);
                                            sweetAlertHandler({ title: 'Error', type: 'error', text: MESSAGES.ERROR.DigiCardNameExists });

                                        } else {
                                            sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
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
                            // setSubmitting(true);
                            console.log(formData);
                            console.log('Submitting');

                            // sla file validation
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

                            console.log(allFilesData);

                            if (allFilesData.length === 0) {
                                showLoader();
                                // if (contact === false) {
                                setDisableButton(true);
                                // _SubmitClient(formData);
                                // }
                            } else {
                                if (areFilesInvalid(allFilesData) !== 0) {
                                    setInvalidFile(true);
                                } else {
                                    showLoader();
                                    // if (contact === false) {
                                    setDisableButton(true);
                                    // _SubmitClient(formData);
                                    // }
                                }
                            }
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
                                                }}
                                                type="file"
                                                value={values.digicard_image}
                                                accept="image/*"
                                            />
                                            {touched.digicard_image && errors.digicard_image && (
                                                <small className="text-danger form-text">{errors.digicard_image}</small>
                                            )}
                                        </div>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="digicard_voice_note">
                                                <small className="text-danger">* </small>Voice Note
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
                                                <small className="text-danger">* </small>KeyWords
                                            </label>
                                            <ReactTags
                                                classNames={{ root: 'react-tags bootstrap-tagsinput', selectedTag: 'react-tags__selected-tag btn-primary' }}
                                                allowNew={true}
                                                tags={tags}
                                                onDelete={handleDelete}
                                                onAddition={(e) => handleAddition(e)}
                                            />
                                        </div><br />
                                        {console.log("---------------------------", defaultOptions)}


                                        <div className="form-group fill" style={{ position: "relative", zIndex: 10 }}>
                                            <label className="floating-label" htmlFor="digicardtitle">
                                                <small className="text-danger">* </small>Related DigiCard Titles
                                            </label>
                                            {/* <Select
                                                defaultValue={defaultOptions}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="color"
                                                isMulti
                                                closeMenuOnSelect={false}
                                                // onChange={handleChange}
                                                // value={selectedOption}
                                                onChange={getMultiOptions}
                                                options={digiCardTitles}
                                                placeholder="Select"
                                            /> */}
                                            <Multiselect
                                                options={digiCardTitles}
                                                displayValue="value"
                                                selectionLimit="25"
                                                selectedValues={defaultOptions}
                                                onSelect={handleOnSelect}
                                                onRemove={handleOnRemove}
                                            />
                                        </div>



                                    </Col>
                                    <Col sm={6}>

                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="digicardtitle">
                                                <small className="text-danger">* </small>Logo preview
                                            </label><br />
                                            <img width={100} src={imgFile} alt="" className="img-fluid mb-3" />
                                        </div>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="digicard">
                                                <small className="text-danger">* </small>Voice Note Preview
                                            </label><br />
                                            {/* <img width={150} src={voiceNote} alt="" className="img-fluid mb-3" /> */}
                                            <audio controls>
                                                <source src={voiceNote} alt="Audio" type="audio/mp3" />
                                            </audio>
                                        </div>



                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm='12'>
                                        <label className="floating-label" htmlFor="digicardtitle">
                                            <small className="text-danger">* </small>DigiCard Excerpt
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
                                            <small className="text-danger">* </small>DigiCard Content
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
                                <Row>
                                    <Col sm={10}>
                                    </Col>
                                    <div className="form-group fill float-end" >
                                        <Col sm={12} className="center">
                                            <Button
                                                className="btn-block"
                                                color="success"
                                                size="large"
                                                type="submit"
                                                variant="success"
                                            // disabled={disableButton === true}
                                            >
                                                Submit
                                            </Button>
                                        </Col>
                                    </div>
                                </Row>
                            </form>
                        )}
                    </Formik>
                </Card.Body>

            </Card>

        </div>


    )

};

export default EditDigiCard;
