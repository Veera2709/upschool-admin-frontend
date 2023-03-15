import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
// import dynamicUrl from '../../../helper/dynamicUrl';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { areFilesInvalid, isEmptyArray, isEmptyObject } from '../../../../util/utils';
import * as Constants from '../../../../helper/constants';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { Label } from 'recharts';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';
import { fetchAllConcepts, fetchTopicsBasedonStatus, getIndividualTopic } from '../../../api/CommonApi'
import MESSAGES from '../../../../helper/messages';
import BasicSpinner from '../../../../helper/BasicSpinner';



const EditTopics = ({ setOpenEditTopic, topicId }) => {
    let history = useHistory();


    let conceptArr = [];
    let topicArr = [];
    const DefaultisLockedOption = [];


    const [editTopicData, setEditTopicData] = useState({});
    const [prePostLearning, setprePostLearning] = useState('pre-Learning');

    const [topicConceptId, setTopicConceptId] = useState([]);
    const [relatedTopicsId, setRelatedTopicsId] = useState([]);
    const [conceptTitles, setConceptTitles] = useState([]);
    const [topicTitles, setTopicTitles] = useState([]);
    const [isShown, setIsShown] = useState(true);
    const [defaultConceptOption, setDefaultConceptOption] = useState([]);
    const [defaultTopicOption, setDefaultTopicOption] = useState([]);
    const [defaultOption, setDefaultOption] = useState([]);
    const [isShownRelatedTopic, setIsShownRelatedTopic] = useState([]);
    const [topicDuration, setTopicDuration] = useState(true);
    const [negativeValue, setNegative] = useState(false);
    const [timeLimit, setTimeLimit] = useState(false);
    const MySwal = withReactContent(Swal);
    const [isLoading, setIsLoading] = useState(false);




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

    const levels = [
        { label: 'Level-1', value: 'Level-1' },
        { label: 'Level-2', value: 'Level-2' },
        { label: 'Level-3', value: 'Level-3' },
    ]

    const topicQuizTemplate = { level: levels[0].value, duration: "" }
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


    const submitEditTopic = (formData) => {
        axios.post(dynamicUrl.editTopic, { data: formData }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                const result = response.data;
                console.log('result: ', result);
                if (result == 200) {
                    // sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.EditTopic });
                    MySwal.fire({

                        title: 'Topic Updated successfully!',
                        icon: 'success',
                    }).then((willDelete) => {
                        history.push('/admin-portal/Topics/active-topics');
                        window.location.reload();

                    })
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
        setIsLoading(true)
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

            resultConceptData.forEach((item, index) => {
                if (item.concept_status === 'Active') {
                    console.log();
                    conceptArr.push({ value: item.concept_id, label: item.concept_title })
                }
            }
            );
            console.log("conceptArr", conceptArr);
            setConceptTitles(conceptArr)

            const allTopicsData = await fetchTopicsBasedonStatus();
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
                resultTopicData.forEach((item, index) => {
                    if (item.topic_status === 'Active' && item.topic_id != topicId) {
                        topicArr.push({ value: item.topic_id, label: item.topic_title })
                    }
                }
                );
                console.log("topicArr", topicArr);
                setTopicTitles(topicArr)
            }

            const topicData = await getIndividualTopic(topicId);
            if (topicData.Error) {
                console.log("topicData.Error", topicData.Error);
            } else {

                const result = topicData.Items[0];
                console.log("result", result);
                // setEditTopicData(result);
                // setTopicQuiz(result.topic_quiz_config)


                topicData.Items[0].pre_post_learning === 'Pre-Learning' ? DefaultisLockedOption.push({ value: result.pre_post_learning, label: result.pre_post_learning }) : DefaultisLockedOption.push({ value: 'Post-Learning', label: 'Post-Learning' })
                console.log("DefaultisLockedOption", DefaultisLockedOption);
                setprePostLearning(DefaultisLockedOption[0].value)
                setDefaultOption(DefaultisLockedOption)

                let tempArr = [];
                let tempTopic = [];

                topicData.Items[0].topic_concept_id.forEach(function (entry_concept) {
                    conceptArr.forEach(function (childrenEntry_concept) {
                        if (entry_concept === childrenEntry_concept.value) {
                            tempArr.push(childrenEntry_concept)
                        }

                    });
                    console.log('tempArr', tempArr);
                    setDefaultConceptOption(tempArr)
                    setTopicConceptId(topicData.Items[0].topic_concept_id)
                });

                topicData.Items[0].related_topics.forEach(function (entry) {
                    topicArr.forEach(function (childrenEntry) {
                        if (entry === childrenEntry.value) {
                            tempTopic.push(childrenEntry)
                        }
                    });
                    console.log("tempTopic", tempTopic);
                    setDefaultTopicOption(tempTopic)
                    setRelatedTopicsId(topicData.Items[0].related_topics)
                });

                setEditTopicData(result);
                setTopicQuiz(result.topic_quiz_config)
            }

        }
        setIsLoading(false)
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
            valuesArr.push(event[i].value)
        }
        setTopicConceptId(valuesArr);
    }

    const gettopicId = (event) => {
        let topicArr = [];
        for (let i = 0; i < event.length; i++) {
            topicArr.push(event[i].value)
        }
        setRelatedTopicsId(topicArr);
    }
    return (
        <div>
            {
                isLoading ? (<BasicSpinner />) : (
                    <div>
                        {editTopicData && (
                            <>
                                {!isEmptyObject(editTopicData) ?
                                    <React.Fragment>
                                        <Formik
                                            enableReinitialize
                                            initialValues={{
                                                topic_title: editTopicData.topic_title,
                                                topic_description: editTopicData.topic_description,
                                                topic_concept_id: '',
                                                pre_post_learning: '',
                                                related_topics: '',
                                                topic_quiz_config: '',
                                                duration: ''
                                            }}

                                            validationSchema={Yup.object().shape({
                                                topic_title: Yup.string()
                                                    .trim()
                                                    .min(2, Constants.AddTopic.TopictitleTooShort)
                                                    .max(32, Constants.AddTopic.TopictitleTooLong)
                                                    .required(Constants.AddTopic.TopictitleRequired),
                                                topic_description: Yup.string()
                                                    .trim()
                                                    .required(Constants.AddTopic.DescriptionRequired),
                                            })}


                                            onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {

                                                console.log("SUBMIT SIDE QUIZ : ", topicQuiz);

                                                let emptyFieldValidation = topicQuiz.find(o => o.duration === "" || o.duration === 0 || o.duration <= 0)
                                                // let TopicDuration = topicQuiz.find(o => o.duration <= 0)
                                                let TopicDurationLimit = topicQuiz.find(o => o.duration > 150)
                                                if (emptyFieldValidation) {
                                                    setTopicDuration(false)
                                                } else if (TopicDurationLimit) {
                                                    setTimeLimit(true)
                                                } else {
                                                    if (topicConceptId == '') {
                                                        setIsShown(false)
                                                    } else {
                                                        setOpenEditTopic(false)
                                                        const formData = {
                                                            topic_id: topicId,
                                                            topic_title: values.topic_title,
                                                            topic_description: values.topic_description,
                                                            topic_concept_id: topicConceptId,
                                                            pre_post_learning: prePostLearning,
                                                            related_topics: relatedTopicsId,
                                                            topic_quiz_config: topicQuiz
                                                        }
                                                        console.log('formData: ', formData)
                                                        submitEditTopic(formData)
                                                    }
                                                }

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
                                                            {touched.topic_title && errors.topic_title && <small className="text-danger form-text">{errors.topic_title}</small>}
                                                        </Form.Group>
                                                    </Col>

                                                    <Col sm={6}>
                                                        {defaultOption && (<div className="form-group fill" style={{ position: "relative", zIndex: 100 }}>
                                                            <label className="floating-label">
                                                                <small className="text-danger">* </small>
                                                                Pre-Post learning
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
                                                            {/* <small className="text-danger form-text" style={{ display: isShown ? 'none' : 'block' }}>required</small> */}
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
                                                                    options={conceptTitles}
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
                                                            <small className="text-danger form-text" style={{ display: isShown ? 'none' : 'block' }}>concepts Required</small>
                                                        </div>)}

                                                        {defaultTopicOption && (<div className="form-group fill" style={{ position: "relative", zIndex: 20 }}>
                                                            <label className="floating-label" htmlFor="related_topic">
                                                                <small className="text-danger"> </small> Related Topics
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
                                                                    {console.log(defaultTopicOption)}
                                                                    {defaultTopicOption && (

                                                                        < Select
                                                                            defaultValue={defaultTopicOption}
                                                                            className="basic-multi-select"
                                                                            isMulti
                                                                            closeMenuOnSelect={false}
                                                                            onChange={(e) => { gettopicId(e); setIsShownRelatedTopic(true) }}
                                                                            options={topicTitles}
                                                                            placeholder="Select the Topic Title"
                                                                        />

                                                                    )}
                                                                </>

                                                            )}
                                                            {/* <small className="text-danger form-text" style={{ display: isShownRelatedTopic ? 'none' : 'block' }}>required</small> */}
                                                        </div>)}
                                                    </Col>

                                                    <Col sm={6}>
                                                        <Form.Group>
                                                            <Form.Label className="floating-label" ><small className="text-danger">* </small>Topic Description</Form.Label>
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
                                                    <Row>
                                                        <Col sm={4}>
                                                            <Form.Label className="floating-label" ><small className="text-danger">* </small>Topic Quiz Levels</Form.Label>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Form.Label className="floating-label" ><small className="text-danger">* </small>Topic Quiz Minutes</Form.Label>
                                                        </Col>
                                                    </Row>
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
                                                                            onChange={(e) => {
                                                                                onDynamicFormChange(e, index, 'duration');
                                                                                handleChange(e);
                                                                                setTopicDuration(true);
                                                                                setTimeLimit(false);
                                                                            }}
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

                                                    ))
                                                    }
                                                    <Row>
                                                        <Col sm={4}>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <small className="text-danger form-text" style={{ display: topicDuration ? 'none' : 'block' }}>Quiz Minutes are required!</small>
                                                            {/* {negativeValue && (
                                                    <small className="text-danger form-text">Quiz Minutes are required in positive value!</small>
                                                )} */}
                                                            {timeLimit && (
                                                                <small className="text-danger form-text">Quiz Minutes exceeds more 150min !</small>
                                                            )}
                                                        </Col>
                                                    </Row>
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
                                    </React.Fragment>
                                    :
                                    <></>
                                }
                            </>
                        )}


                    </div >
                )
            }
        </div>

    )
}

// export default EditTopics
// ---------------------------------------------------------------------------------------------
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
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
    const [prePostLearning, setprePostLearning] = useState('pre-Learning');

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
    const [topicDuration, setTopicDuration] = useState(false);
    const [negativeValue, setNegative] = useState(false);
    const [timeLimit, setTimeLimit] = useState(false);
    const MySwal = withReactContent(Swal);




    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const levels = [
        { label: 'Level-1', value: 'Level-1' },
        { label: 'Level-2', value: 'Level-2' },
        { label: 'Level-3', value: 'Level-3' },
    ]

    const topicQuizTemplate = { level: levels[0].value, duration: "" }
    const [topicQuiz, setTopicQuiz] = useState([topicQuizTemplate])
    console.log("topicQuiz : ", topicQuiz);

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



    const postTopic = (formData) => {
        axios.post(dynamicUrl.addTopic, { data: formData }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                const result = response.data;
                if (result == 200) {
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
                    sweetAlertHandler({ title: 'Sorry', type: 'error', text: 'Topic Name Already Exists!' })
                }
            })
    }

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
                if (item.concept_status === 'Active') {
                    console.log();
                    conceptArr.push({ value: item.concept_id, label: item.concept_title })
                }
            }
            );
            console.log("conceptArr", conceptArr);
            setConceptTitles(conceptArr)

            const allTopicsData = await fetchTopicsBasedonStatus();
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
                    if (item.topic_status === 'Active') {
                        console.log();
                        topicArr.push({ value: item.topic_id, label: item.topic_title })
                    }
                }
                );
                console.log("topicArr", topicArr);
                setTopicTitles(topicArr)
            }
        }

    }

    useEffect(() => {
        fetchAllConceptsData()
    }, [])

    const prePostOptions = [
        { value: 'Pre-Learning', label: 'Pre-Learning' },
        { value: 'Post-Learning', label: 'Post-Learning' },
    ];

    // const handlePrePostChange = (e) => setprePostLearning(e.target.value)

    const postPreOption = (e) => {
        console.log("postPreOption", e);
        setprePostLearning(e.value);
    };

    const getconceptId = (event) => {
        let valuesArr = [];
        for (let i = 0; i < event.length; i++) {
            valuesArr.push(event[i].value)
        }
        setTopicConceptId(valuesArr);
    }

    const gettopicId = (event) => {
        let topicArr = [];
        for (let i = 0; i < event.length; i++) {
            topicArr.push(event[i].value)
        }
        setRelatedTopicsId(topicArr);
    }

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    topic_title: '',
                    level: "",
                    duration: "",
                    topic_description: '',
                    topic_concept_id: [],
                    pre_post_learning: '',
                    related_topics: [],
                    topic_quiz_config: []
                }}

                validationSchema={Yup.object().shape({
                    topic_title: Yup.string()
                        .trim()
                        .min(2, Constants.AddTopic.TopictitleTooShort)
                        .max(32, Constants.AddTopic.TopictitleTooLong)
                        .required(Constants.AddTopic.TopictitleRequired),
                    duration: Yup.string()
                        .trim()
                        .required(Constants.AddTopic.QuizMinutesRequired),
                    topic_description: Yup.string()
                        .trim()
                        .required(Constants.AddTopic.DescriptionRequired),

                })}
                // validationSchema
                onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                    // setSubmitting(true);
                    let emptyFieldValidation = topicQuiz.find(o => o.duration === "" || o.duration === 0 || o.duration <= 0)
                    let TopicDurationLimit = topicQuiz.find(o => o.duration > 150)
                    if (topicConceptId == '') {
                        setIsShownConcept(false)
                    } else if (emptyFieldValidation) {
                        setTopicDuration(true)
                    } else if (TopicDurationLimit) {
                        setTimeLimit(true)
                    }
                    else {
                        setOpenAddTopic(false)
                        const formData = {
                            topic_title: values.topic_title,
                            topic_description: values.topic_description,
                            topic_concept_id: topicConceptId,
                            pre_post_learning: prePostLearning,
                            related_topics: relatedTopicsId,
                            topic_quiz_config: topicQuiz
                        }
                        console.log('formData: ', formData)
                        postTopic(formData)
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
                                    onChange={(e) => { getconceptId(e); setIsShownConcept(true) }}
                                    options={conceptTitles}
                                    placeholder="Select the Concept Title"
                                />
                                <small className="text-danger form-text" style={{ display: isShownConcept ? 'none' : 'block' }}>concept Id Field Required</small>
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
                        <Row>
                            <Col sm={4}>
                                <Form.Label className="floating-label" ><small className="text-danger">* </small>Topic Quiz Levels</Form.Label>
                            </Col>
                            <Col sm={6}>
                                <Form.Label className="floating-label" ><small className="text-danger">* </small>Topic Quiz Minutes</Form.Label>
                            </Col>
                        </Row>
                        {topicQuiz.map((topic, index) => (
                            <div className='row ml-1 mb-2' key={index + 1000} >
                                <div className='col-md-4' key={index + 10} >
                                    <select className='form-control' name="level" id="level" onChange={(e) => onDynamicFormChange(e, index, 'level')} value={topic.level} >
                                        {levels.map((ele, i) => {
                                            console.log("VALUE : ", ele.value);
                                            console.log("LABEL : ", ele.label);
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
                                                onChange={(e) => {
                                                    onDynamicFormChange(e, index, 'duration');
                                                    handleChange(e);
                                                    setTopicDuration(false)
                                                    setTimeLimit(false);
                                                }}
                                                autoComplete='off'
                                                onBlur={handleBlur}
                                            />
                                        </div>
                                        {topicQuiz.length === 1 ? "" :
                                            (
                                                <div className='col-md-6'>
                                                    <Button variant='danger' onClick={() => removeTopic(index)}>Remove</Button>
                                                </div>
                                            )

                                        }

                                    </div>
                                </div>
                            </div>
                        ))}
                        <Row>
                            <Col sm={4}>
                            </Col>
                            <Col sm={6}>
                                {touched.duration && errors.duration && <small className="text-danger form-text">{errors.duration}</small>}
                                {topicDuration && (
                                    <small className="text-danger form-text">Quiz Minutes are required!</small>
                                )}
                                {/* {negativeValue&&(
                                <small className="text-danger form-text">Quiz Minutes are required in positive value!</small>
                                )} */}
                                {timeLimit && (
                                    <small className="text-danger form-text">Quiz Minutes exceeds more 150min !</small>
                                )}
                            </Col>
                        </Row>
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
        </React.Fragment>
    )
}

export default AddTopics