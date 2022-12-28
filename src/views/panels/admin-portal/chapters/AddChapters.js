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
import Select from 'react-select';
import Multiselect from 'multiselect-react-dropdown';
import { fetchAllTopics } from '../../../api/CommonApi'






// import { Button,Container,Row ,Col  } from 'react-bootstrap';

const AddChapter = (
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
    const [prelearningOptions, setPrelearningOptions] = useState([]);
    const [isLockedOption, setValue] = useState();
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




    let history = useHistory();

    console.log("colourOptions", colourOptions);



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

    const fetchAllTopicsList = async () => {
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
            console.log("colourOptions", colourOptions);
            setTopicTitles(colourOptions)
        }
    }


    useEffect(() => {
        fetchAllTopicsList();
    }, [])


    const handleOnSelect = (event) => {
        let valuesArr = [];
        for (let i = 0; i < event.length; i++) {
            valuesArr.push({ "topic_id": event[i].value })
        }
        setPostlearningOption(valuesArr);
    }
    
    const handleOnSelectPre = (event) => {
        let valuesArr = [];
        for (let i = 0; i < event.length; i++) {
            valuesArr.push({ "topic_id": event[i].value })
        }
        setPrelearningOptions(valuesArr);
    }




    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>Add Chapter</Card.Title>
                    <Formik
                        initialValues={{
                            chaptertitle: '',
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
                            } else if (prelearningOptions == '') {
                                setIsShownPre(false)
                            }
                            else if (description == undefined || description.trim()=='') {
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
                                    is_locked: isLockedOption === undefined ? 'Yes' : isLockedOption,
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
                                        <div className="form-group fill" style={{ position: "relative", zIndex: 20 }}>
                                            <label className="floating-label" htmlFor="postlearning_topic">
                                                <small className="text-danger">* </small> Postlearning Topic
                                            </label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="color"
                                                isMulti
                                                closeMenuOnSelect={false}
                                                onChange={(e)=>{handleOnSelect(e);setIsShown(true)}}
                                                options={topicTitles}
                                                placeholder="Select"
                                            />
                                            <br />
                                            <small className="text-danger form-text" style={{ display: isShown ? 'none' : 'block' }}>Postlearning Topic Required</small>
                                        </div>
                                        <div className="form-group fill" htmlFor="chapter_description">
                                            <Form.Label> <small className="text-danger">* </small>Chapter Description</Form.Label>
                                            <Form.Control as="textarea" onChange={(e) => { ChapterDescription(e); setIsShownDes(true) }} rows="4" />
                                            <br />
                                            <small className="text-danger form-text" style={{ display: isShownDes ? 'none' : 'block' }}>Chapter Description Required</small>
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="form-group fill" style={{ position: "relative", zIndex: 20 }}>
                                            <label className="floating-label" htmlFor="prelearning_topic">
                                                <small className="text-danger">* </small>Prelearning Topic
                                            </label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name="color"
                                                isMulti
                                                closeMenuOnSelect={false}
                                                onChange={(e)=>{handleOnSelectPre(e);setIsShownPre(true)}}
                                                options={topicTitles}
                                                placeholder="Select"
                                            />
                                            <br />
                                            <small className="text-danger form-text" style={{ display: isShownPre ? 'none' : 'block' }}>Prelearning Topic Required</small>
                                        </div>

                                        <div className="form-group fill" style={{ position: "relative", zIndex: 10 }}>
                                            <label className="floating-label" htmlFor="isLocked">
                                                <small className="text-danger">* </small> Is Locked
                                            </label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                defaultValue={isLocked[0]}
                                                name="color"
                                                options={isLocked}
                                                onChange={(e) => { isLockedOPtion(e) }}
                                            /><br />
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

export default AddChapter;
