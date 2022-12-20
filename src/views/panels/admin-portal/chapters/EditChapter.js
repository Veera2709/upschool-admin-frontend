import React, { useState, useCallback } from 'react';
// import './style.css'
import { Row, Col, Card, Button, Modal, Dropdown, Form } from 'react-bootstrap';
// import CkDecoupledEditor from '../../../components/CK-Editor/CkDecoupledEditor';
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
import { areFilesInvalid, isEmptyObject } from '../../../../util/utils';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { isEmptyArray } from '../../../../util/utils';


// import { Button,Container,Row ,Col  } from 'react-bootstrap';

const EditChapter = (
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
    const DefaultisLockedOption = [];

    const isLocked = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
    ]



    const [content, setContent] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [disableButton, setDisableButton] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const MySwal = withReactContent(Swal);
    const [isClientExists, setIsClientExists] = useState(false);
    const [invalidFile, setInvalidFile] = useState(false);
    const [currentFeature, setCurrentFeature] = useState("");
    const [title, setTitle] = useState("");


    const [postlearningOption, setPostlearningOption] = useState([]);
    const [defaultPrelearning, setDefaultPrelearning] = useState([]);
    const [prelearningOptions, setPrelearningOptions] = useState([]);
    const [defaultPostleraing, setDefaultPostleraing] = useState([]);
    const [isLockedOption, setValue] = useState();
    const [defaulIslocked, setDefaulIslocked] = useState([]);
    const [description, setDescription] = useState();
    const [defauleDescription, setDefauleDescription] = useState();

    console.log('defaulIslocked', defaulIslocked);
    console.log("description", description);





    const [tags, setTags] = useState([]);
    const [ImgURL, setImgURL] = useState([]);
    const [display, setDisplay] = useState('none');
    const [imgFile, setImgFile] = useState([]);
    const [articleData, setArticleData] = useState("");
    const [articleDataTitle, setArticleDataTtitle] = useState("");
    const [digitalTitles, setDigitalTitles] = useState(0);
    const [isShown, setIsShown] = useState(true);

    const [individualChapterdata, setIndividualChapterdata] = useState([]);




    const { chapter_id } = useParams();


    const PostlearningOption = (e) => {
        setPostlearningOption(e);
    }

    const PrelearningOptions = (e) => {
        setPrelearningOptions(e);
    }

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };


    const isLockedOPtion = (e) => {
        setValue(e.value);
    };

    const ChapterDescription = (text) => {
        setDescription(text.target.value)
    }



    const fetchAllChapters = () => {
        axios.post(dynamicUrl.fetchAllTopics, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response.data.Items);
                let resultData = response.data.Items;
                console.log("response.data.Items", response.data.Items);

                resultData.forEach((item, index) => {
                    item.topic_status === 'Active' ? colourOptions.push({ value: item.topic_title, label: item.topic_title }) : colourOptions.push({ value: item.topic_title, label: item.topic_title, isDisabled: true })
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
                dynamicUrl.fetchIndividualChapter,
                {
                    data: {
                        "chapter_id": chapter_id,
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

                    let individual_Chapter_data = response.data.Items[0];
                    console.log("individual_Chapter_data", individual_Chapter_data);
                    setIndividualChapterdata(individual_Chapter_data)
                    setDefaultPrelearning(individual_Chapter_data.prelearning_topic_id);
                    setDefaultPostleraing(individual_Chapter_data.postlearning_topic_id);
                    setPostlearningOption(individual_Chapter_data.postlearning_topic_id);
                    setPrelearningOptions(individual_Chapter_data.prelearning_topic_id);
                    setDefauleDescription(individual_Chapter_data.chapter_description);
                    setDescription(individual_Chapter_data.chapter_description)
                    individual_Chapter_data.is_locked === 'Yes' ? DefaultisLockedOption.push({ value: individual_Chapter_data.is_locked, label: individual_Chapter_data.is_locked }) : DefaultisLockedOption.push({ value: 'No', label: 'No' })
                    setDefaulIslocked(DefaultisLockedOption)
                    setValue(DefaultisLockedOption)
                    console.log("DefaultisLockedOption", DefaultisLockedOption);


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
                    // The request was made but no response was received
                    console.log(error.request);
                    hideLoader();
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    hideLoader();
                }
            });
        fetchAllChapters();

    }, [])

    return isEmptyObject(individualChapterdata) || defaultPostleraing == '' || defaulIslocked == '' ? null : (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>Edit Chapter</Card.Title>
                    <Formik
                        initialValues={{
                            chaptertitle: individualChapterdata.chapter_title,
                            postlearning_topic: '',
                            prelearning_topic: '',
                            isLocked: '',
                            chapter_description: '',
                        }}
                        validationSchema={Yup.object().shape({
                            chaptertitle: Yup.string()
                                .trim()
                                .min(2, Constants.AddDigiCard.ChaptertitleTooShort)
                                .max(30, Constants.AddDigiCard.ChaptertitleTooLong)
                                .required(Constants.AddDigiCard.ChaptertitleRequired),
                        })}



                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {


                            if (postlearningOption == '') {
                                setIsShown(false)
                            } else {

                                console.log("on submit");
                                var formData = {
                                    chapter_id: chapter_id,
                                    chapter_title: values.chaptertitle,
                                    chapter_description: description,
                                    prelearning_topic_id: prelearningOptions,
                                    postlearning_topic_id: postlearningOption,
                                    is_locked: isLockedOption,
                                };

                                console.log("formdata", formData);

                                axios
                                    .post(dynamicUrl.editChapter, { data: formData }, { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
                                    .then(async (response) => {
                                        console.log({ response });
                                        if (response.Error) {
                                            console.log('Error');
                                            hideLoader();
                                            setDisableButton(false);
                                        } else {
                                            sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingChapter });
                                            hideLoader();
                                            setDisableButton(false);
                                            // fetchClientData();
                                            setIsOpen(false);
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

                            }







                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Row>
                                    {/* {edit1Toggle && <Loader />} */}
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="chaptertitle">
                                                <small className="text-danger">* </small>Chapter Title
                                            </label>
                                            <input
                                                className="form-control"
                                                error={touched.chaptertitle && errors.chaptertitle}
                                                name="chaptertitle"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="text"
                                                value={values.chaptertitle}
                                                id='title'
                                            />
                                            {touched.chaptertitle && errors.chaptertitle && <small className="text-danger form-text">{errors.chaptertitle}</small>}
                                        </div><br />
                                        <div className="form-group fill" style={{ position: "relative", zIndex: 20 }}>
                                            <label className="floating-label" htmlFor="postlearning_topic">
                                                <small className="text-danger">* </small> Postlearning Topic
                                            </label>
                                            <Select
                                                defaultValue={defaultPostleraing}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isMulti
                                                closeMenuOnSelect={false}
                                                onChange={(e) => { PostlearningOption(e); setIsShown(false) }}
                                                options={digitalTitles}
                                                placeholder="Which is your favourite colour?"
                                            />
                                            <small className="text-danger form-text" style={{ display: isShown ? 'none' : 'block' }}>required</small>
                                        </div>
                                        <div className="form-group fill" >
                                            <Form.Label htmlFor="chapter_description"> <small className="text-danger">* </small>Chapter Description</Form.Label>
                                            <Form.Control as="textarea"
                                                onChange={ChapterDescription} rows="4"
                                                defaultValue={description}
                                            />
                                            <br />
                                            {touched.prelearning_topic && errors.prelearning_topic && (
                                                <small className="text-danger form-text">{errors.prelearning_topic}</small>
                                            )}
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill" style={{ position: "relative", zIndex: 20 }}>
                                            <label className="floating-label" htmlFor="prelearning_topic">
                                                <small className="text-danger">* </small>Prelearning Topic
                                            </label>
                                            <Select
                                                defaultValue={defaultPrelearning}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                // name="digiCardTitle"
                                                isMulti
                                                closeMenuOnSelect={false}
                                                onChange={PrelearningOptions}
                                                options={digitalTitles}
                                                placeholder="Which is your favourite colour?"
                                            /><br />
                                            {touched.prelearning_topic && errors.prelearning_topic && (
                                                <small className="text-danger form-text">{errors.prelearning_topic}</small>
                                            )}
                                        </div>

                                        <div className="form-group fill" style={{ position: "relative", zIndex: 10 }}>
                                            <label className="floating-label" htmlFor="isLocked">
                                                <small className="text-danger">* </small> Is Locked
                                            </label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                defaultValue={defaulIslocked}
                                                name="color"
                                                options={isLocked}
                                                onChange={isLockedOPtion}
                                            /><br />
                                            {touched.isLocked && errors.isLocked && (
                                                <small className="text-danger form-text">{errors.isLocked}</small>
                                            )}
                                        </div>

                                    </Col>
                                </Row>
                                <br></br>
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

export default EditChapter;
