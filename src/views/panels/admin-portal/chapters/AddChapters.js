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
import { useHistory } from 'react-router-dom';
import Select from 'react-draggable-multi-select';
import Multiselect from 'multiselect-react-dropdown';
import { fetchTopicsBasedonStatus, fetchPostLearningTopics, fetchPreLearningTopics } from '../../../api/CommonApi'






// import { Button,Container,Row ,Col  } from 'react-bootstrap';

const AddChapter = ({ setOpenAddChapter }) => {


    const postLeraning = [];
    const preLeraning = [];




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
    const [prelearningOptions, setPrelearningOptions] = useState([]);
    const [description, setDescription] = useState();
    const [isShown, setIsShown] = useState(true);
    const [isShownPre, setIsShownPre] = useState(true);
    const [isShownIsl, setIsShownIsl] = useState(true);
    const [isShownDes, setIsShownDes] = useState(true);
    const [topicDigiCardIds, setTopicDigiCardIds] = useState([]);





    const [tags, setTags] = useState([]);
    const [ImgURL, setImgURL] = useState([]);
    const [display, setDisplay] = useState('none');
    const [imgFile, setImgFile] = useState([]);
    const [articleData, setArticleData] = useState("");
    const [articleDataTitle, setArticleDataTtitle] = useState("");
    const [topicTitles, setTopicTitles] = useState([]);
    const [topicTitlesPre, setTopicTitlesPre] = useState([]);




    let history = useHistory();

    console.log("postLeraning", postLeraning);



    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };




    const ChapterDescription = (text) => {
        setDescription(text.target.value)
    }

    const fetchAllTopicsList = async () => {
        const allPostLeraningData = await fetchPostLearningTopics();
        console.log("allPostLeraningData", allPostLeraningData.Items);
        if (allPostLeraningData.Error) {
            console.log("allPostLeraningData", allPostLeraningData.Error);
            if (allPostLeraningData.Error.response.data == 'Invalid Token') {
                sessionStorage.clear();
                localStorage.clear();
                history.push('/auth/signin-1');
                window.location.reload();
            }
        } else {
            let resultData = allPostLeraningData.Items
            console.log("resultData", resultData);
            resultData.forEach((item, index) => {
                    console.log();
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
                console.log("preLeraningTopics",preData)
                preData.forEach((itempre, index) => {
                        console.log();
                        preLeraning.push({ value: itempre.topic_id, label: itempre.topic_title }) 
                });
                setTopicTitlesPre(preLeraning)
            }
        }
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
            fetchAllTopicsList();
        }
    }, [])


    const handleOnSelect = (event) => {
        let valuesArr = [];
        if(event){
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        setPostlearningOption(valuesArr);
    }

    const handleOnSelectPre = (event) => {
        let valuesArr = [];
        if(event){
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        setPrelearningOptions(valuesArr);
    }




    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    chaptertitle: '',
                    postlearning_topic: '',
                    prelearning_topic: '',
                    chapter_description: '',
                }}
                validationSchema={Yup.object().shape({
                    chaptertitle: Yup.string()
                        .trim()
                        .min(2, Constants.AddDigiCard.ChaptertitleTooShort)
                        .max(32, Constants.AddDigiCard.ChaptertitleTooLong)
                        .required(Constants.AddDigiCard.ChaptertitleRequired),
                })}



                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    if (postlearningOption == '') {
                        setIsShown(false)
                    } else if (prelearningOptions == '') {
                        setIsShownPre(false)
                    }
                    else if (description == undefined || description.trim() == '') {
                        setIsShownDes(false)
                    }
                    else {
                        setIsShown(true)
                        console.log("on submit");
                        var formData = {
                            chapter_title: values.chaptertitle,
                            chapter_description: description,
                            prelearning_topic_id: prelearningOptions,
                            postlearning_topic_id: postlearningOption,
                        };
                        console.log("formdata", formData);
                        axios
                            .post(dynamicUrl.addChapter, { data: formData }, { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
                            .then(async (response) => {
                                console.log({ response });
                                if (response.Error) {
                                    console.log('Error');
                                    hideLoader();
                                    setDisableButton(false);
                                } else {
                                    setOpenAddChapter(false)
                                    // sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingChapter });
                                    MySwal.fire({
                                        title: 'Chapter added successfully!',
                                        icon: 'success',
                                    }).then((willDelete) => {
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
                                        sweetAlertHandler({ title: 'Error', type: 'error', text: MESSAGES.ERROR.ChapterNameExists });

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
                }
                }
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Row>
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
                                <div className="form-group fill">
                                    <label className="floating-label" htmlFor="postlearning_topic">
                                        <small className="text-danger">* </small> Post-learning Topic
                                    </label>
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        name="color"
                                        isMulti
                                        closeMenuOnSelect={false}
                                        onChange={(e) => { handleOnSelect(e); setIsShown(true) }}
                                        options={topicTitles}
                                        placeholder="Select"
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    />
                                    <br />
                                    <small className="text-danger form-text" style={{ display: isShown ? 'none' : 'block' }}>Postlearning Topic Required</small>
                                </div>

                                <div className="form-group fill">
                                    <label className="floating-label" htmlFor="prelearning_topic">
                                        <small className="text-danger">* </small>Pre-learning Topic
                                    </label>
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        name="color"
                                        isMulti
                                        closeMenuOnSelect={false}
                                        onChange={(e) => { handleOnSelectPre(e); setIsShownPre(true) }}
                                        options={topicTitlesPre}
                                        placeholder="Select"
                                        menuPortalTarget={document.body}
                                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    />
                                    <br />
                                    <small className="text-danger form-text" style={{ display: isShownPre ? 'none' : 'block' }}>Prelearning Topic Required</small>
                                </div>

                                <div className="form-group fill" htmlFor="chapter_description">
                                    <Form.Label> <small className="text-danger">* </small>Chapter Description</Form.Label>
                                    <Form.Control as="textarea" onChange={(e) => { ChapterDescription(e); setIsShownDes(true) }} rows="4" />
                                    <br />
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

};

export default AddChapter;
