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
import Select from 'react-draggable-multi-select';
import Multiselect from 'multiselect-react-dropdown';
import { fetchIndividualChapter, fetchPostLearningTopics, fetchPreLearningTopics } from '../../../api/CommonApi'
import { useHistory } from 'react-router-dom';
import BasicSpinner from '../../../../helper/BasicSpinner';

const EditChapter = ({ setOpenEditChapter, chapterId }) => {


    const postLeraning = [];
    const preLeraning = [];





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
    const [defauleDescription, setDefauleDescription] = useState();
    const [topicTitles, setTopicTitles] = useState([]);
    const [topicTitlesPre, setTopicTitlesPre] = useState([]);

    const [isShown, setIsShown] = useState(true);
    const [individualChapterdata, setIndividualChapterdata] = useState([]);
    const [isShownPre, setIsShownPre] = useState(true);
    const [isShownDes, setIsShownDes] = useState(true);
    const [isLoading, setIsLoading] = useState(false)
    let history = useHistory();











    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };





    const fetchAllData = async () => {
        setIsLoading(true)
        const allTopicdData = await fetchPostLearningTopics();
        console.log("allTopicdData", allTopicdData.Items);
        if (allTopicdData.Error) {
            console.log("allTopicdData", allTopicdData.Error);
            if (allTopicdData.Error.response.data == 'Invalid Token') {
                sessionStorage.clear();
                localStorage.clear();
                history.push('/auth/signin-1');
                window.location.reload();
            }
        } else {
            let resultData = allTopicdData.Items
            console.log("resultData", resultData);
            resultData.forEach((item, index) => {
                postLeraning.push({ value: item.topic_id, label: item.topic_title })
            }
            );
            console.log("postLeraning", postLeraning);
            setTopicTitles(postLeraning)

            const allPreLerningdData = await fetchPreLearningTopics();
            if (allPreLerningdData.Error) {
                console.log("allPreLerningdData.Error", allPreLerningdData.Error);
                if (allPreLerningdData.Error.response.data == 'Invalid Token') {
                    sessionStorage.clear();
                    localStorage.clear();
                    history.push('/auth/signin-1');
                    window.location.reload();
                }
            } else {
                let preData = allPreLerningdData.Items
                preData.forEach((itempre, index) => {
                    preLeraning.push({ value: itempre.topic_id, label: itempre.topic_title })
                });
                setTopicTitlesPre(preLeraning)
            }
            const chapterData = await fetchIndividualChapter(chapterId);
            console.log("chapterData", chapterData);
            if (chapterData.ERROR) {
                console.log("chapterData.ERROR", chapterData.ERROR);
                if (chapterData.Error.response.data == 'Invalid Token') {
                    sessionStorage.clear();
                    localStorage.clear();
                    history.push('/auth/signin-1');
                    window.location.reload();
                }
            } else {
                let individual_Chapter_data = chapterData.Items[0];
                let tempArr_pre = [];
                let tempArr2 = [];
                individual_Chapter_data.prelearning_topic_id.forEach(function (entry_pre) {
                    preLeraning.forEach(function (childrenEntry_pre) {
                        if (entry_pre === childrenEntry_pre.value) {
                            console.log("childrenEntry", childrenEntry_pre);
                            tempArr_pre.push(childrenEntry_pre)
                        }

                    });
                });
                setDefaultPrelearning(tempArr_pre)
                setPrelearningOptions(individual_Chapter_data.prelearning_topic_id)

                individual_Chapter_data.postlearning_topic_id.forEach(function (entry) {
                    postLeraning.forEach(function (childrenEntry2) {
                        if (entry === childrenEntry2.value) {
                            console.log("childrenEntry", childrenEntry2);
                            tempArr2.push(childrenEntry2)
                        }

                    });
                });
                setDefaultPostleraing(tempArr2)
                setPostlearningOption(individual_Chapter_data.postlearning_topic_id)
                setIndividualChapterdata(individual_Chapter_data)
                setDefauleDescription(individual_Chapter_data.chapter_description);
            }
        }
        setIsLoading(false)
    }


    useEffect(() => {
        fetchAllData();

    }, [])



    const prelerningOtions = (event_pre) => {
        let values_pre = [];
        if (event_pre) {
            for (let i = 0; i < event_pre.length; i++) {
                values_pre.push(event_pre[i].value)
            }
        }
        setPrelearningOptions(values_pre);
    }

    const postlerningOtions = (event) => {
        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        setPostlearningOption(valuesArr);
    }



    return (
        <div>
            {
                isLoading ? (
                    <BasicSpinner />
                ) : (
                    <React.Fragment>
                        <Formik
                            enableReinitialize
                            initialValues={{
                                chaptertitle: individualChapterdata.chapter_title,
                                postlearning_topic: '',
                                prelearning_topic: '',
                                isLocked: '',
                                chapter_description: individualChapterdata.chapter_description,
                            }}
                            validationSchema={Yup.object().shape({
                                chaptertitle: Yup.string()
                                    .trim()
                                    .min(2, Constants.AddDigiCard.ChaptertitleTooShort)
                                    .max(32, Constants.AddDigiCard.ChaptertitleTooLong)
                                    .required(Constants.AddDigiCard.ChaptertitleRequired),
                                chapter_description: Yup.string()
                                    .required(Constants.AddUnit.DescriptionRequired),
                            })}

                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                if (postlearningOption == '') {
                                    setIsShown(false)
                                } else if (prelearningOptions == '') {
                                    setIsShownPre(false)
                                }
                                else if (values.chapter_description == undefined || values.chapter_description.trim() == '') {
                                    setIsShownDes(false)
                                } else {
                                    console.log("on submit");
                                    var formData = {
                                        chapter_id: chapterId,
                                        chapter_title: values.chaptertitle,
                                        chapter_description: values.chapter_description,
                                        prelearning_topic_id: prelearningOptions,
                                        postlearning_topic_id: postlearningOption,
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
                                                setOpenEditChapter(false)
                                                // sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.EditChapter });
                                                MySwal.fire({

                                                    title: 'Chapter Updated successfully!',
                                                    icon: 'success',
                                                }).then((willDelete) => {
                                                    history.push('/admin-portal/chapters/active-chapter');
                                                    window.location.reload();

                                                })
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
                                                    <small className="text-danger">* </small> Post-learning Topic
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
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
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
                                                                onChange={(e) => { postlerningOtions(e); setIsShown(true) }}
                                                                options={topicTitles}
                                                                placeholder="Select"
                                                                menuPortalTarget={document.body}
                                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                            />

                                                        )}
                                                    </>

                                                )}
                                                <small className="text-danger form-text" style={{ display: isShown ? 'none' : 'block' }}>Postlearning Topic Required</small>
                                            </div>


                                            <div className="form-group fill" style={{ position: "relative", zIndex: 20 }}>
                                                <label className="floating-label" htmlFor="prelearning_topic">
                                                    <small className="text-danger">* </small>Pre-learning Topic
                                                </label>
                                                {defaultPrelearning.length === 0 ? (

                                                    <Select
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name="color"
                                                        isMulti
                                                        closeMenuOnSelect={false}
                                                        onChange={prelerningOtions}
                                                        options={topicTitlesPre}
                                                        placeholder="Select"
                                                        menuPortalTarget={document.body}
                                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
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
                                                                onChange={(e) => { prelerningOtions(e); setIsShownPre(true) }}
                                                                options={topicTitlesPre}
                                                                placeholder="Select"
                                                                menuPortalTarget={document.body}
                                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                            />

                                                        )}
                                                    </>

                                                )}
                                                <br />
                                                <small className="text-danger form-text" style={{ display: isShownPre ? 'none' : 'block' }}>Prelearning Topic Required</small>
                                            </div>

                                            <div className="form-group fill" >
                                                <Form.Label htmlFor="chapter_description"> <small className="text-danger">* </small>Chapter Description</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    onChange={(e) => { handleChange(e); setIsShownDes(true) }}
                                                    rows="4"
                                                    onBlur={handleBlur}
                                                    name="chapter_description"
                                                    value={values.chapter_description}
                                                    type='text'
                                                />
                                                <br />
                                                {touched.chapter_description && errors.chapter_description && <small className="text-danger form-text">{errors.chapter_description}</small>}
                                                <small className="text-danger form-text" style={{ display: isShownDes ? 'none' : 'block' }}>Chapter Description Required</small>
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
                    </React.Fragment>
                )
            }
        </div>

    )

};

export default EditChapter;