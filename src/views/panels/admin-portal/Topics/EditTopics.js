import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
// import dynamicUrl from '../../../helper/dynamicUrl';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { areFilesInvalid, isEmptyArray, isEmptyObject } from '../../../../util/utils';
import * as Constants from '../../../../config/constant'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { Label } from 'recharts';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';
import { fetchAllConcepts, fetchAllTopics, getIndividualTopic } from '../../../api/CommonApi'
import MESSAGES from '../../../../helper/messages';



const EditTopics = ({ className, rest, setIsOpen, fetchSchoolData }) => {
    let history = useHistory();
    let params = useParams();
    const id = params.topic_id;

    let conceptArr = [];
    let topicArr = [];
    const DefaultisLockedOption = [];


    const [editTopicData, setEditTopicData] = useState({});
    const [prePostLearning, setprePostLearning] = useState('pre-Learning');

    const [topicConceptId, setTopicConceptId] = useState([]);
    const [topicConceptIds, setConceptIds] = useState([]);
    const [topicConceptNames, setTopicConceptNames] = useState([]);

    const [relatedTopicsId, setRelatedTopicsId] = useState([]);
    const [relatedTopicsIds, setRelatedTopicsIds] = useState([]);
    const [relatedTopicNames, setRelatedTopicNames] = useState([]);

    const [editRelatedTopicsIds, setEditRelatedTopicsIds] = useState([]);
    const [editTopicConceptIds, setEditTopicConceptIds] = useState([]);

    const [conceptTitles, setConceptTitles] = useState([]);
    const [topicTitles, setTopicTitles] = useState([]);
    const [isShown, setIsShown] = useState(true);
    const [defaultConceptOption, setDefaultConceptOption] = useState([]);
    const [defaultTopicOption, setDefaultTopicOption] = useState([]);
    const [defaultOption, setDefaultOption] = useState([]);

    console.log("defaultConceptOption", defaultConceptOption);
    console.log("defaultTopicOption", defaultTopicOption);
    console.log("defaultOption", defaultOption);
    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };




    const topicQuizTemplate = { level: "", duration: "" }
    const [topicQuiz, setTopicQuiz] = useState([topicQuizTemplate])

    const addTopic = () => {
        setTopicQuiz([...topicQuiz, topicQuizTemplate])
    }
    const onDynamicFormChange = (e, index, fieldType) => {
        console.log("e", e)
        console.log("Field", fieldType)
        const updatedTopics = topicQuiz.map((topic, i) =>
            index == i
                ? Object.assign(topic, { [e.target.name]: e.target.value })
                : topic
        )
        setTopicQuiz(updatedTopics)
    }
    const removeTopic = (index) => {
        const filteredProjects = [...topicQuiz]
        filteredProjects.splice(index, 1)
        setTopicQuiz(filteredProjects)
    }

    const data = [{ id: 'ac05006b-2351-59e1-a5bf-aa88e249ad05', name: 'ac05006b-2351-59e1-a5bf-aa88e249ad05' }]

    const levels = [
        { label: 'Level-1', value: 'Level-1' },
        { label: 'Level-2', value: 'Level-2' },
        { label: 'Level-3', value: 'Level-3' },
    ]



    const submitEditTopic = (formData) => {
        axios.post(dynamicUrl.editTopic, { data: formData }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                const result = response.data;
                console.log('result: ', result);
                if(result == 200){
                    sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.EditTopic });

                }
            })
            .catch((err) => {
                console.log(err.response.data);
                if (err.response.data === 'Topic Name Already Exists') {
                    sweetAlertHandler({ title: 'Sorry', type: 'error', text: 'Topic Name Already Exists!' })
                }
            })
    }

    const fetchAllConceptsData = async () => {
        const allConceptsData = await fetchAllConcepts();
        if (allConceptsData.Error) {
            console.log("allConceptsData.ERROR", allConceptsData.Error);
        } else {
            console.log('allConceptsData', allConceptsData.Items);
            let resultConceptData = allConceptsData.Items

            resultConceptData.forEach((item, index) => {
                if (item.concept_status === 'Active') {
                    console.log();
                    conceptArr.push({ value: item.concept_id, label: item.concept_title })
                }
            }
            );
            console.log("conceptArr", conceptArr);
            setConceptTitles(conceptArr)


        }

        const allTopicsData = await fetchAllTopics();
        if (allTopicsData.Error) {
            console.log("allTopicsData,Error", allTopicsData, Error);
        } else {
            console.log("allTopicsData", allTopicsData.Items);
            let resultTopicData = allTopicsData.Items
            resultTopicData.forEach((item, index) => {
                if (item.topic_status === 'Active') {
                    console.log();
                    topicArr.push({ value: item.topic_id, label: item.topic_title })
                }
            }
            );
            console.log("topicArr", topicArr);
            setTopicTitles(topicArr)
        }

        const topicData = await getIndividualTopic(id);
        if (topicData.Error) {
            console.log("topicData.Error", topicData.Error);
        } else {

            const result = topicData.Items[0];
            console.log("result", result);
            setEditTopicData(result);
            setTopicQuiz(result.topic_quiz_config)


            topicData.Items[0].pre_post_learning === 'Pre-Learning' ? DefaultisLockedOption.push({ value: result.pre_post_learning, label: result.pre_post_learning }) : DefaultisLockedOption.push({ value: 'Post-Learning', label: 'Post-Learning' })
            console.log("DefaultisLockedOption", DefaultisLockedOption);
            setprePostLearning(DefaultisLockedOption[0].value)
            setDefaultOption(DefaultisLockedOption)

            let tempArr = [];
            let tempTopic = [];

            topicData.Items[0].topic_concept_id.forEach(function (entry_concept) {
                conceptArr.forEach(function (childrenEntry_concept) {
                    if (entry_concept.concept_id === childrenEntry_concept.value) {
                        tempArr.push(childrenEntry_concept)
                    }

                });
                console.log('tempArr', tempArr);
                setDefaultConceptOption(tempArr)
                setTopicConceptId(topicData.Items[0].topic_concept_id)
            });

            topicData.Items[0].related_topics.forEach(function (entry) {
                topicArr.forEach(function (childrenEntry) {
                    if (entry.topic_id === childrenEntry.value) {
                        tempTopic.push(childrenEntry)
                    }
                });
                console.log("tempTopic", tempTopic);
                setDefaultTopicOption(tempTopic)
                setRelatedTopicsId(topicData.Items[0].related_topics)
            });
        }

    }

    useEffect(() => {
        fetchAllConceptsData()
    }, [])

    const prePostOptions = [
        { value: 'Pre-Learning', label: 'pre-Learning' },
        { value: 'Post-Learning', label: 'Post-Learning' },
    ];

    // const handlePrePostChange = (e) => setprePostLearning(e.target.value)
    const postPreOption = (e) => {
        setprePostLearning(e.value);
    };

    const getconceptId = (event) => {
        let valuesArr = [];
        for (let i = 0; i < event.length; i++) {
            valuesArr.push({ "concept_id": event[i].value })
        }
        setTopicConceptId(valuesArr);
    }

    const gettopicId = (event) => {
        let topicArr = [];
        for (let i = 0; i < event.length; i++) {
            topicArr.push({ "topic_id": event[i].value })
        }
        setRelatedTopicsId(topicArr);
    }
    return (
        <div>
            {!isEmptyObject(editTopicData) ?
                <Card>
                    <Card.Body>
                        <Card.Title>Edit Topic</Card.Title>
                        <Formik
                            enableReinitialize
                            initialValues={{
                                topic_title: editTopicData.topic_title,
                                topic_description: editTopicData.topic_description,
                                topic_concept_id: '',
                                pre_post_learning: '',
                                related_topics: '',
                                topic_quiz_config: ''
                            }}
                            // validationSchema

                            
                            onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                                setSubmitting(true);
                                const formData = {
                                    topic_id:id,
                                    topic_title: values.topic_title,
                                    topic_description: values.topic_description,
                                    topic_concept_id:topicConceptId ,
                                    pre_post_learning: prePostLearning,
                                    related_topics: relatedTopicsId,
                                    topic_quiz_config: topicQuiz
                                }
                                console.log('formData: ', formData)
                                submitEditTopic(formData)
                            }}
                        >
                            {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                                <Form onSubmit={handleSubmit} >
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label className="floating-label" ><small className="text-danger">* </small>Topic Title</Form.Label>
                                            <Form.Control
                                                className="form-control"
                                                name="topic_title"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="text"
                                                value={values.topic_title}
                                            />
                                            {/* {touched.topic_title && errors.topic_title && <small className="text-danger form-text">{errors.topic_title}</small>} */}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        {defaultOption && (<div className="form-group fill" style={{ position: "relative", zIndex: 100 }}>
                                            <label className="floating-label">
                                                <small className="text-danger">* </small>
                                                pre-post learning
                                            </label>
                                            {defaultOption.length === 0 ? (

                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    defaultValue={prePostOptions[0]}
                                                    name="color"
                                                    options={prePostOptions}
                                                    onChange={(e) => { postPreOption(e) }}
                                                />

                                            ) : (
                                                <>
                                                    {defaultOption && (

                                                        <Select
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            defaultValue={defaultOption[0]}
                                                            name="color"
                                                            options={prePostOptions}
                                                            onChange={(e) => { postPreOption(e) }}
                                                        />

                                                    )}
                                                </>

                                            )}
                                            <small className="text-danger form-text" style={{ display: isShown ? 'none' : 'block' }}>required</small>
                                        </div>)}
                                    </Col>

                                    <Col sm={6}>

                                        {defaultConceptOption && (<div className="form-group fill" style={{ position: "relative", zIndex: 50 }}>
                                            <label className="floating-label" htmlFor="concept">
                                                <small className="text-danger">* </small>concepts
                                            </label>
                                            {defaultConceptOption.length === 0 ? (

                                                <Select
                                                    className="basic-multi-select"
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    onChange={(e) => { gettopicId(e); setIsShown(true) }}
                                                    options={topicTitles}
                                                    placeholder="Select the concept Title"
                                                />

                                            ) : (
                                                <>
                                                    {defaultConceptOption && (

                                                        <Select
                                                            defaultValue={defaultConceptOption}
                                                            className="basic-multi-select"
                                                            isMulti
                                                            closeMenuOnSelect={false}
                                                            onChange={(e) => { getconceptId(e); setIsShown(true) }}
                                                            options={conceptTitles}
                                                            placeholder="Select the Concept Title"
                                                        />

                                                    )}
                                                </>

                                            )}
                                            <small className="text-danger form-text" style={{ display: isShown ? 'none' : 'block' }}>required</small>
                                        </div>)}

                                        {defaultTopicOption && (<div className="form-group fill" style={{ position: "relative", zIndex: 20 }}>
                                            <label className="floating-label" htmlFor="related_topic">
                                                <small className="text-danger">* </small> Related Topics
                                            </label>
                                            {defaultTopicOption.length === 0 ? (

                                                <Select
                                                    className="basic-multi-select"
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    onChange={(e) => { gettopicId(e); setIsShown(true) }}
                                                    options={topicTitles}
                                                    placeholder="Select the Topic Title"
                                                />

                                            ) : (
                                                <>
                                                    {defaultTopicOption && (

                                                        <Select
                                                            defaultValue={defaultTopicOption}
                                                            className="basic-multi-select"
                                                            isMulti
                                                            closeMenuOnSelect={false}
                                                            onChange={(e) => { gettopicId(e); setIsShown(true) }}
                                                            options={topicTitles}
                                                            placeholder="Select the Topic Title"
                                                        />

                                                    )}
                                                </>

                                            )}
                                            <small className="text-danger form-text" style={{ display: isShown ? 'none' : 'block' }}>required</small>
                                        </div>)}
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label className="floating-label" ><small className="text-danger">* </small>Topic Decription</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows="4"
                                                name="topic_description"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="text"
                                                value={values.topic_description}
                                            />
                                            {/* {touched.topic_description && errors.topic_description && <small className="text-danger form-text">{errors.topic_description}</small>} */}
                                        </Form.Group>
                                    </Col>

                                    <Form.Label className="floating-label" ><small className="text-danger">* </small>Topic Quiz Config</Form.Label>
                                    {topicQuiz.map((topic, index) => (
                                        
                                        <div className='row ml-1 mb-2' key={index + 1000} >
                                            <div className='col-md-4' key={index + 10} >
                                                <select className='form-control' name="level" id="level" onChange={(e) => onDynamicFormChange(e, index, 'level')} value={topic.level} >
                                                    {levels.map((ele, i) => {
                                                        return <option id="level" keys={i} value={ele.value} >{ele.label}</option>
                                                    })}
                                                </select>
                                            </div>
                                            <p></p>
                                            <div className='col-md-4'>
                                                <div className='row'>
                                                    <div className='col-md-6'>
                                                        <Form.Control
                                                            type='number'
                                                            name='duration'
                                                            placeholder='Minutes'
                                                            value={topic.duration}
                                                            onChange={(e) => onDynamicFormChange(e, index, 'duration')}
                                                            autoComplete='off'
                                                        />
                                                    </div>
                                                    {topicQuiz.length == 1 ? "" :  
                                                    <div className='col-md-6'>
                                                        <Button variant='danger' onClick={() => removeTopic(index)}>Remove</Button>
                                                    </div>}
                                                   
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <p></p>
                                    <button type="button" className="btn btn-primary" onClick={addTopic} >Add another Quiz</button>

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
                    </Card.Body>
                </Card > :
                <h1>There are no datas to be displayed!</h1>
            }
        </div >
    )
}

export default EditTopics