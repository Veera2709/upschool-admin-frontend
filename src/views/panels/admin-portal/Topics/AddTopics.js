import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select from 'react-draggable-multi-select';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
// import dynamicUrl from '../../../helper/dynamicUrl';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { areFilesInvalid } from '../../../../util/utils';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { Label } from 'recharts';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';
import { fetchAllConcepts, fetchTopicsBasedonStatus } from '../../../api/CommonApi'
import * as Constants from '../../../../helper/constants';
import MESSAGES from '../../../../helper/messages';



const AddTopics = ({ setOpenAddTopic }) => {
    let history = useHistory();
    const [prePostLearning, setprePostLearning] = useState('Pre-Learning');

    const [topicConceptId, setTopicConceptId] = useState([]);
    const [topicConceptNames, setTopicConceptNames] = useState([]);
    const [isShown, setIsShown] = useState(true);

    const [relatedTopicsId, setRelatedTopicsId] = useState([]);
    const [conceptTitles, setConceptTitles] = useState([]);
    const [topicTitles, setTopicTitles] = useState([]);
    const [relatedTopicsIds, setRelatedTopicsIds] = useState([]);
    const [relatedTopicNames, setRelatedTopicNames] = useState([]);
    const [isShownConcept, setIsShownConcept] = useState(true);
    const [isShownTopic, setIsShownTopic] = useState(true);
    const [conceptErr, setConceptErr] = useState(false);
    // const [topicDuration, setTopicDuration] = useState(false);
    // const [timeLimit, setTimeLimit] = useState(false);
    const [displayNameErr, setDisplayNameErr] = useState(false);

    const [displayNameErrMessage, setDisplayNameErrMessage] = useState('');

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };





    const fetchAllConceptsData = async () => {
        const allConceptsData = await fetchAllConcepts();
        if (allConceptsData.Error) {
            console.log("allConceptsData.ERROR", allConceptsData.Error);
            if (allConceptsData.Error.response.data == 'Invalid Token') {
                sessionStorage.clear();
                localStorage.clear();
                history.push('/auth/signin-1');
                window.location.reload();
            }

        } else {
            console.log('allConceptsData', allConceptsData.Items);
            let resultConceptData = allConceptsData.Items
            let conceptArr = [];
            resultConceptData.forEach((item, index) => {
                conceptArr.push({ value: item.concept_id, label: item.concept_title })
            }
            );
            console.log("conceptArr", conceptArr);
            setConceptTitles(conceptArr)

            const allTopicsData = await fetchTopicsBasedonStatus('Active');
            if (allTopicsData.Error) {
                console.log("allTopicsData,Error", allTopicsData, Error);
                if (allTopicsData.Error.response.data == 'Invalid Token') {
                    sessionStorage.clear();
                    localStorage.clear();
                    history.push('/auth/signin-1');
                    window.location.reload();
                }
            } else {
                console.log("allTopicsData", allTopicsData.Items);
                let resultTopicData = allTopicsData.Items
                let topicArr = [];
                resultTopicData.forEach((item, index) => {
                    topicArr.push({ value: item.topic_id, label: item.topic_title })
                }
                );
                console.log("topicArr", topicArr);
                setTopicTitles(topicArr)
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
            fetchAllConceptsData()
        }
    }, [])

    const prePostOptions = [
        { value: 'Pre-Learning', label: 'Pre-Learning' },
        { value: 'Post-Learning', label: 'Post-Learning' },
    ];

    // const handlePrePostChange = (e) => setprePostLearning(e.target.value)

    const postPreOption = (e) => {
        console.log("postPreOption", e);
        setprePostLearning(e.value);
        // e.value === 'Pre-Learning' ? setTopicQuiz(topicQuizTemplatePre) : setTopicQuiz(topicQuizTemplatePost)
    };

    const getconceptId = (event) => {
        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        setTopicConceptId(valuesArr);
    }

    const gettopicId = (event) => {
        let topicArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                topicArr.push(event[i].value)
            }
        }
        setRelatedTopicsId(topicArr);
    }

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    topic_title: '',
                    display_name: '',
                    // level: "",
                    // duration: "",
                    topic_description: '',
                    topic_concept_id: [],
                    pre_post_learning: '',
                    related_topics: [],
                    // topic_quiz_config: []
                }}

                validationSchema={Yup.object().shape({
                    topic_title: Yup.string()
                        .trim()
                        .min(2, Constants.AddTopic.TopictitleTooShort)
                        // .max(32, Constants.AddTopic.TopictitleTooLong)
                        .required(Constants.AddTopic.TopictitleRequired),
                    // duration: Yup.string()
                    //     .trim()
                    //     .required(Constants.AddTopic.QuizMinutesRequired),
                    topic_description: Yup.string()
                        .trim()
                        .required(Constants.AddTopic.DescriptionRequired),

                    display_name: Yup.string()
                        .trim()
                        .min(2, Constants.AddTopic.DisplayNameTooShort)
                        // .max(32, Constants.AddTopic.DisplayNameTooLong)
                        .required(Constants.AddTopic.DisplayNameRequired),
                })}
                // validationSchema
                onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                   
                    if (topicConceptId.length <= 0) {
                        setConceptErr(true)
                    } else {
                        let formData = {
                            topic_title: values.topic_title,
                            display_name: values.display_name,
                            topic_description: values.topic_description,
                            topic_concept_id: topicConceptId,
                            pre_post_learning: prePostLearning,
                            related_topics: relatedTopicsId,
                        }
                        console.log('formData: ', formData)

                        axios.post(dynamicUrl.addTopic, { data: formData }, {
                            headers: { Authorization: sessionStorage.getItem('user_jwt') }
                        })
                            .then((response) => {
                                const result = response.data;
                                if (result == 200) {
                                    setOpenAddTopic(false)
                                    // sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingTopic });
                                    MySwal.fire({
                
                                        title: 'Topic added successfully!',
                                        icon: 'success',
                                    }).then((willDelete) => {
                
                                        window.location.reload();
                                    })
                
                                } else {
                                    console.log("error");
                                }
                                console.log('result: ', result);
                            })
                            .catch((err) => {
                                console.log(err.response.data);
                                if (err.response.data === 'Topic Name Already Exists') {
                                    setErrors({
                                        topic_title:'Topic Name Already Exists'
                                    })
                                }
                            })
                    }





                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                    <Form onSubmit={handleSubmit} >
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="floating-label" htmlFor="topic_title"><small className="text-danger">* </small>Topic Title</Form.Label>
                                <Form.Control
                                    className="form-control"
                                    name="topic_title"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.topic_title}
                                />
                                {touched.topic_title && errors.topic_title && <small className="text-danger form-text">{errors.topic_title}</small>}
                            </Form.Group>
                        </Col>

                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="floating-label" htmlFor="display_name"><small className="text-danger">* </small>Display Name</Form.Label>
                                <Form.Control
                                    className="form-control"
                                    name="display_name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.display_name}
                                />
                                {touched.display_name && errors.display_name && <small className="text-danger form-text">{errors.display_name}</small>}
                            </Form.Group>
                        </Col>





                        <Col sm={6}>

                            <div className="form-group fill">
                                <label className="floating-label" >
                                    <small className="text-danger">* </small>
                                    Pre-Post learning
                                </label>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={prePostOptions[0]}
                                    name="color"
                                    options={prePostOptions}
                                    onChange={(e) => { postPreOption(e) }}
                                />
                            </div>
                        </Col>

                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="floating-label" ><small className="text-danger">* </small>Concept</Form.Label>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="color"
                                    isMulti
                                    closeMenuOnSelect={false}
                                    onChange={(e) => { getconceptId(e); setConceptErr(false) }}
                                    options={conceptTitles}
                                    placeholder="Select the Concept Title"
                                />
                                {/* <small className="text-danger form-text" style={{ display: isShownConcept ? 'none' : 'block' }}>concept Id Field Required</small> */}
                                {conceptErr && (
                                    <small style={{ color: 'red' }}>Concept Field Required!</small>
                                )}
                            </Form.Group>
                        </Col>

                        <div className="col-md-6">
                            <Form.Group>
                                <Form.Label className="floating-label" ><small className="text-danger"> </small>Related Topics</Form.Label>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="color"
                                    isMulti
                                    closeMenuOnSelect={false}
                                    onChange={(e) => { gettopicId(e); setIsShownTopic(true) }}
                                    options={topicTitles}
                                    placeholder="Select the Topic Title"
                                />
                                <small className="text-danger form-text" style={{ display: isShownTopic ? 'none' : 'block' }}>Related Topics Field Required</small>
                            </Form.Group>
                        </div>

                        <Col sm={6}>

                            <Form.Group>
                                <Form.Label className="floating-label" htmlFor="topic_description"><small className="text-danger">* </small>Topic Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows="4"
                                    name="topic_description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.topic_description}
                                />
                                {touched.topic_description && errors.topic_description && <small className="text-danger form-text">{errors.topic_description}</small>}
                            </Form.Group>
                        </Col>

                        

                        <div className="row d-flex justify-content-end">
                            <div className="form-group fill">
                                <div className="center col-sm-12">
                                    <button color="success" type="submit" className="btn-block btn btn-success btn-large">Submit</button>
                                </div>
                            </div>
                        </div>

                    </Form>
                )}
            </Formik>
        </React.Fragment>
    )
}

export default AddTopics