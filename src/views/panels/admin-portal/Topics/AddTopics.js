import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Col, Form, FormControl, FormLabel, Row } from 'react-bootstrap';
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

const AddTopics = ({ className, rest, setIsOpen, fetchSchoolData }) => {
    let history = useHistory();
    const [tags, setTags] = useState([]);
    const [ImgURL, setImgURL] = useState([]);
    const [display, setDisplay] = useState('none');
    const [imgFile, setImgFile] = useState([]);
    const [articleData, setArticleData] = useState("");

    const [topicDigiCardId, setTopicDigiCardId] = useState([]);
    const [topicDigiCardIds, setTopicDigiCardIds] = useState([]);
    const [topicDigiCardNames, setTopicDigiCardNames] = useState([]);


    const handleOnSelect = ((selectedList, selectedItem) => {
        setTopicDigiCardIds(selectedList.map(serviceId => serviceId.id))
        setTopicDigiCardNames(selectedList.map(skillname => skillname.name))
    })
    const handleOnRemove = (selectedList, selectedItem) => setTopicDigiCardIds(selectedList.map(skillId => skillId.id))

    const data = [
        { id: 1, name: 'Topics' },
        { id: 2, name: 'Topics1' },
        { id: 3, name: 'Topics2' },
    ]

    useEffect(() => {
        setTopicDigiCardId(data)
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
                            topic_digi_card_id: [],
                            pre_post_learning: '',
                            related_topics: [],
                            pre_post: '',
                            topic_quiz_config: ''
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                            <Form noValidate onSubmit={handleSubmit} fill >
                                <Col sm={6}>
                                    <Form.Group>
                                        <FormLabel className="floating-label" htmlFor="topic_title"><small className="text-danger">* </small>Topic Title</FormLabel>
                                        <FormControl
                                            className="form-control"
                                            error={touched.topic_title && errors.topic_title}
                                            name="topic_title"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="text"
                                            value={values.topic_title}
                                            id='topic_title'
                                        />
                                        {touched.topic_title && errors.topic_title && <small className="text-danger form-text">{errors.topic_title}</small>}
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group>
                                        <FormLabel className="floating-label" htmlFor="topic_description"><small className="text-danger">* </small>Topic Decription</FormLabel>
                                        <FormControl
                                            className="form-control"
                                            error={touched.topic_description && errors.topic_description}
                                            name="topic_description"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="text"
                                            value={values.topic_description}
                                            id='topic_description'
                                        />
                                        {touched.topic_description && errors.topic_description && <small className="text-danger form-text">{errors.topic_description}</small>}
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group>
                                        <FormLabel className="floating-label" htmlFor="topic_digi_card_id"><small className="text-danger">* </small>Topic Digi Card Id</FormLabel>
                                        <Multiselect
                                            options={topicDigiCardId}
                                            displayValue="name"
                                            selectionLimit="25"
                                            onSelect={handleOnSelect}
                                            onRemove={handleOnRemove}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group>
                                        <FormLabel className="floating-label" htmlFor="pre_post_learning"><small className="text-danger">* </small>Pre-Post Learning</FormLabel>
                                        <FormControl
                                            className="form-control"
                                            error={touched.pre_post_learning && errors.pre_post_learning}
                                            name="pre_post_learning"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="text"
                                            value={values.pre_post_learning}
                                            id='pre_post_learning'
                                        />
                                        {touched.pre_post_learning && errors.pre_post_learning && <small className="text-danger form-text">{errors.pre_post_learning}</small>}
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group>
                                        <FormLabel className="floating-label" htmlFor="related_topics"><small className="text-danger">* </small>Related Topics</FormLabel>
                                        <FormControl
                                            className="form-control"
                                            error={touched.related_topics && errors.related_topics}
                                            name="related_topics"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="text"
                                            value={values.related_topics}
                                            id='related_topics'
                                        />
                                        {touched.related_topics && errors.related_topics && <small className="text-danger form-text">{errors.related_topics}</small>}
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group>
                                        <FormLabel className="floating-label" htmlFor="pre_post"><small className="text-danger">* </small>Related Topics</FormLabel>
                                        <Multiselect
                                            options={topicDigiCardId}
                                            displayValue="name"
                                            selectionLimit="25"
                                            onSelect={handleOnSelect}
                                            onRemove={handleOnRemove}
                                        />
                                        {touched.pre_post && errors.pre_post && <small className="text-danger form-text">{errors.pre_post}</small>}
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group>
                                        <FormLabel className="floating-label" htmlFor="topic_quiz_config"><small className="text-danger">* </small>Related Topics</FormLabel>
                                        <FormControl
                                            className="form-control"
                                            error={touched.topic_quiz_config && errors.topic_quiz_config}
                                            name="topic_quiz_config"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            type="text"
                                            value={values.topic_quiz_config}
                                            id='topic_quiz_config'
                                        />
                                        {touched.topic_quiz_config && errors.topic_quiz_config && <small className="text-danger form-text">{errors.topic_quiz_config}</small>}
                                    </Form.Group>
                                </Col>

                            </Form>
                        )}
                    </Formik>
                </Card.Body>
            </Card>
        </div>
    )
}

export default AddTopics