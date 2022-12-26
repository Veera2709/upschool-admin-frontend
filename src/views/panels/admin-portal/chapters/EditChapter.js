import React, { useState, useCallback } from 'react';
import { Row, Col, Card, Button, Modal, Dropdown, Form } from 'react-bootstrap';
import * as Constants from '../../../../helper/constants';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import dynamicUrl from '../../../../helper/dynamicUrls';
import 'jodit';
import 'jodit/build/jodit.min.css';
import MESSAGES from '../../../../helper/messages';
import Swal from 'sweetalert2';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import withReactContent from 'sweetalert2-react-content';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import Multiselect from 'multiselect-react-dropdown';
import { fetchAllTopics, fetchIndividualChapter } from '../../../api/CommonApi'






const EditChapter = () => {


    const colourOptions = [];
    const DefaultisLockedOption = [];

    const isLocked = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
    ]



    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [disableButton, setDisableButton] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const MySwal = withReactContent(Swal);


    const [postlearningOption, setPostlearningOption] = useState([]);
    const [defaultPrelearning, setDefaultPrelearning] = useState([]);
    const [prelearningOptions, setPrelearningOptions] = useState([]);
    const [defaultPostleraing, setDefaultPostleraing] = useState([]);
    const [topicDigiCardIds, setTopicDigiCardIds] = useState([]);

    const [isLockedOption, setValue] = useState();
    const [defaulIslocked, setDefaulIslocked] = useState();
    const [description, setDescription] = useState();
    const [defauleDescription, setDefauleDescription] = useState();
    const [topicTitles, setTopicTitles] = useState([]);
    const [isShown, setIsShown] = useState(true);
    const [individualChapterdata, setIndividualChapterdata] = useState([]);




    const { chapter_id } = useParams();



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

    const fetchAllData = async () => {

        const allTopicdData = await fetchAllTopics();
        console.log("allTopicdData", allTopicdData.Items);
        if (allTopicdData.Error) {
            console.log("allTopicdData", allTopicdData.Error);
        } else {
            let resultData = allTopicdData.Items
            console.log("resultData", resultData);
            resultData.forEach((item, index) => {
                if (item.topic_status === 'Active') {
                    console.log();
                    colourOptions.push({ value: item.topic_id, label: item.topic_title })
                }
            }
            );

        }
        console.log("colourOptions", colourOptions);
        setTopicTitles(colourOptions)

        const chapterData = await fetchIndividualChapter(chapter_id);
        console.log("chapterData", chapterData);
        if (chapterData.ERROR) {
            console.log("chapterData.ERROR", chapterData.ERROR);
        } else {
            let individual_Chapter_data = chapterData.Items[0];
            setIndividualChapterdata(individual_Chapter_data)
         
            
            setDefauleDescription(individual_Chapter_data.chapter_description);
            setDescription(individual_Chapter_data.chapter_description)

            let tempArr_pre = [];
            let tempArr2 = [];
            individual_Chapter_data.prelearning_topic_id.forEach(function (entry_pre) {
                colourOptions.forEach(function (childrenEntry_pre) {
                    if (entry_pre.topic_id === childrenEntry_pre.value) {
                        console.log("childrenEntry", childrenEntry_pre);
                        tempArr_pre.push(childrenEntry_pre)
                    }

                });
            });
            setDefaultPrelearning(tempArr_pre)
            setPrelearningOptions(individual_Chapter_data.prelearning_topic_id)

            individual_Chapter_data.postlearning_topic_id.forEach(function (entry) {
                colourOptions.forEach(function (childrenEntry2) {
                    if (entry.topic_id === childrenEntry2.value) {
                        console.log("childrenEntry", childrenEntry2);
                        tempArr2.push(childrenEntry2)
                    }

                });
            });
            setDefaultPostleraing(tempArr2)
            setPostlearningOption(individual_Chapter_data.postlearning_topic_id)


            individual_Chapter_data.is_locked === 'Yes' ? DefaultisLockedOption.push({ value: individual_Chapter_data.is_locked, label: individual_Chapter_data.is_locked }) : DefaultisLockedOption.push({ value: 'No', label: 'No' })
            setDefaulIslocked(DefaultisLockedOption)
            setValue(DefaultisLockedOption[0].value)
        }
    }


    useEffect(() => {
        fetchAllData();

    }, [])

    

    const prelerningOtions = (event_pre) => {
        let values_pre = [];
        for (let i = 0; i < event_pre.length; i++) {
            values_pre.push({ "topic_id": event_pre[i].value })
        }
        setPrelearningOptions(values_pre);
    }

    const postlerningOtions = (event) => {
        let valuesArr = [];
        for (let i = 0; i < event.length; i++) {
            valuesArr.push({ "topic_id": event[i].value })
        }
        setPostlearningOption(valuesArr);
    }



    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>Edit Chapter</Card.Title>
                    <Formik
                        enableReinitialize
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


                            // if (postlearningOption == '') {
                            //     setIsShown(false)
                            // } else {

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
                                            sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.EditChapter });
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

                            // }







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
                                            {defaultPostleraing.length === 0 ? (

                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    name="color"
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    onChange={postlerningOtions}
                                                    options={topicTitles}
                                                    placeholder="Select"
                                                />

                                            ) : (
                                                <>
                                                    {defaultPostleraing && (

                                                        <Select
                                                            defaultValue={defaultPostleraing}
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            name="color"
                                                            isMulti
                                                            closeMenuOnSelect={false}
                                                            onChange={postlerningOtions}
                                                            options={topicTitles}
                                                            placeholder="Select"
                                                        />

                                                    )}
                                                </>

                                            )}
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
                                            {defaultPrelearning.length === 0 ? (

                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    name="color"
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    onChange={prelerningOtions}
                                                    options={topicTitles}
                                                    placeholder="Select"
                                                />

                                            ) : (
                                                <>
                                                    {defaultPrelearning && (

                                                        <Select
                                                            defaultValue={defaultPrelearning}
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            name="color"
                                                            isMulti
                                                            closeMenuOnSelect={false}
                                                            onChange={prelerningOtions}
                                                            options={topicTitles}
                                                            placeholder="Select"
                                                        />

                                                    )}
                                                </>

                                            )}
                                            <br />
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
                                                defaultValue={DefaultisLockedOption}
                                                name="color"
                                                options={isLocked}
                                                onChange={isLockedOPtion}
                                            />
                                            <br />
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