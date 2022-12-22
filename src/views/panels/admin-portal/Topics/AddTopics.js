import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
// import dynamicUrl from '../../../helper/dynamicUrl';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { areFilesInvalid } from '../../../../util/utils';
import * as Constants from '../../../../config/constant'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { Label } from 'recharts';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';

const AddTopics = ({ className, rest, setIsOpen, fetchSchoolData }) => {
    let history = useHistory();
    const [tags, setTags] = useState([]);
    const [ImgURL, setImgURL] = useState([]);
    const [display, setDisplay] = useState('none');
    const [imgFile, setImgFile] = useState([]);
    const [articleData, setArticleData] = useState("");

    const [topicConceptId, setTopicConceptId] = useState([]);
    const [topicConceptIds, setConceptIds] = useState([]);
    const [topicConceptNames, setTopicConceptNames] = useState([]);

    const [relatedTopicsId, setRelatedTopicsId] = useState([]);
    const [relatedTopicsIds, setRelatedTopicsIds] = useState([]);
    const [relatedTopicNames, setRelatedTopicNames] = useState([]);

    const handleOnSelect = ((selectedList, selectedItem) => {
        setConceptIds(selectedList.map(concept => concept.id))
        setTopicConceptNames(selectedList.map(conceptName => conceptName.name))
    })
    const handleOnRemove = (selectedList, selectedItem) => setConceptIds(selectedList.map(concept => concept.id))

    const handleOnSelectTopic = ((selectedList, selectedItem) => {
        setRelatedTopicsIds(selectedList.map(topic => topic.id))
        setRelatedTopicNames(selectedList.map(topicName => topicName.name))
    })
    const handleOnRemoveTopic = (selectedList, selectedItem) => setRelatedTopicsIds(selectedList.map(topic => topic.id))

    const data = [
        { id: 1, name: 'Topics' },
        { id: 2, name: 'Topics1' },
        { id: 3, name: 'Topics2' },
    ]


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

    const levels = [
        { label: 'Level-1', value: 'Level-1' },
        { label: 'Level-2', value: 'Level-2' },
        { label: 'Level-3', value: 'Level-3' },
    ]

    useEffect(() => {
        setTopicConceptId(data);
        setRelatedTopicsId(data);
    }, [])

    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>Add Topic</Card.Title>
                    <Formik
                        initialValues={{
                            topic_title: '',
                            topic_description: '',
                            topic_concept_id: [],
                            pre_post_learning: '',
                            related_topics: [],
                            topic_quiz_config: []
                        }}
                        // validationSchema
                        onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                            setSubmitting(true);
                            const formData = {
                                topic_title: values.topic_title,
                                topic_description: values.topic_description,
                                topic_concept_id: topicConceptIds,
                                pre_post_learning: values.pre_post_learning,
                                related_topics: relatedTopicsIds,
                                topic_quiz_config: topicQuiz
                            }
                            console.log('formData: ', formData)
                            axios.post(dynamicUrl.addTopic, { data: formData }, {
                                headers: { Authorization: sessionStorage.getItem('user_jwt') }
                            })
                                .then((response) => {
                                    const result = response;
                                    console.log('result: ', result);
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
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
                                    <Form.Group>
                                        <Form.Label className="floating-label" ><small className="text-danger">* </small>Topic Decription</Form.Label>
                                        <Form.Control
                                            name="topic_description"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="text"
                                            value={values.topic_description}
                                        />
                                        {/* {touched.topic_description && errors.topic_description && <small className="text-danger form-text">{errors.topic_description}</small>} */}
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group>
                                        <Form.Label className="floating-label" ><small className="text-danger">* </small>Topic concept Id</Form.Label>
                                        <Multiselect
                                            options={topicConceptId}
                                            displayValue="name"
                                            selectionLimit="25"
                                            onSelect={handleOnSelect}
                                            onRemove={handleOnRemove}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group>
                                        <Form.Label className="floating-label" ><small className="text-danger">* </small>Pre-Post Learning</Form.Label>
                                        <Form.Control
                                            name="pre_post_learning"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="number"
                                            value={values.pre_post_learning}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                        {/* {touched.pre_post_learning && errors.pre_post_learning && <small className="text-danger form-text">{errors.pre_post_learning}</small>} */}
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group>
                                        <Form.Label className="floating-label" ><small className="text-danger">* </small>Related Topics</Form.Label>
                                        <Multiselect
                                            options={relatedTopicsId}
                                            displayValue="name"
                                            selectionLimit="25"
                                            onSelect={handleOnSelectTopic}
                                            onRemove={handleOnRemoveTopic}
                                        />
                                    </Form.Group>
                                </Col>

                                <Form.Label className="floating-label" ><small className="text-danger">* </small>Topic Quiz Config</Form.Label>
                                {topicQuiz.map((topic, index) => (
                                    <div className='row ml-1 mb-2'>
                                        <div className='col-md-4'>
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
                                                        value={topic.duration}
                                                        onChange={(e) => onDynamicFormChange(e, index, 'duration')}
                                                        autoComplete='off'
                                                    />
                                                </div>
                                                <div className='col-md-6'>
                                                    <Button variant='danger' onClick={() => removeTopic(index)}>Remove</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <p></p>
                                <p className='ml-3' onClick={addTopic} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Add another topic quiz config</p>

                                <div class="row d-flex justify-content-end">
                                    <div class="form-group fill">
                                        <div class="center col-sm-12">
                                            <button color="success" type="submit" class="btn-block btn btn-success btn-large">Submit</button>
                                        </div>
                                    </div>
                                </div>

                            </Form>
                        )}
                    </Formik>
                </Card.Body>
            </Card>
        </div>
    )
}

export default AddTopics