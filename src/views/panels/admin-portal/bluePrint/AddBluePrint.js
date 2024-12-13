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
import { useHistory , useParams } from 'react-router-dom';
import Select from 'react-draggable-multi-select';
import { getAllcognitiveSkills, allQuestionCategories } from '../../../api/CommonApi';



const AddBluePrint = () => {

    const sectionsData = [
        {
            section_name: '',
            section_description: '',
            questions: [
                {
                    // question_name: "",
                    marks: "",
                    category_id: "",
                    difficulty_level: "",
                    cognitive_id: "",
                    question_type: ""
                }
            ]
        }
    ]

    const { type } = useParams();
    console.log("--------type=0----------", type);
    const [bluePrintData, setBluePrintData] = useState(sectionsData)
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [disableButton, setDisableButton] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const MySwal = withReactContent(Swal);
    const [description, setBluePrintDescription] = useState();
    const threadLinks = document.getElementsByClassName('page-header');
    const [displayHeader, setDisplayHeader] = useState(true);
    const [cognitiveSkillOpptions, setCognitiveSkillOpptions] = useState();
    const [categoryOpptions, setCategoryOpptions] = useState();
    const [sectionRepErr, setSectionRepErr] = useState(false);
    const [questionTypeOption, setQuestionTypeOption] = useState(["Objective", "Subjective", "Descriptive"])
    const [questionDifficulty, setQuestionDifficulty] = useState(
        [
            { value: 'lessDifficult', label: 'Less Difficult' },
            { value: 'moderatelyDifficult', label: 'Moderately Difficult' },
            { value: 'highlyDifficult', label: 'Highly Difficult' },
        ]
    )

    let history = useHistory();

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };


    const BluePrintDescription = (text) => {
        setBluePrintDescription(text.target.value)
    }

    const addSection = () => {
        let data = {
            section_name: '',
            section_description: '',
            questions: [
                {
                    // question_name: "",
                    marks: "",
                    category_id: "",
                    difficulty_level: "",
                    cognitive_id: "",
                    question_type: ""
                }
            ]
        }
        setBluePrintData([...bluePrintData, data])
    }

    const addQuestion = (index) => {
        let data = [...bluePrintData]
        data[index].questions.push({
            // question_name: "",
            marks: "",
            category_id: "",
            difficulty_level: "",
            cognitive_id: "",
            question_type: ""
        })
        setBluePrintData([...bluePrintData]);

    }

    const removeSection = (index) => {
        let data = [...bluePrintData];
        data.splice(index, 1);
        setBluePrintData(data)
    }

    const removeQuestion = (index, ind) => {
        console.log("index,ind", index, ind);
        let data = [...bluePrintData];
        data[index].questions.splice(ind, 1)
        setBluePrintData(data)
    }

    const getAllRequiredData = async () => {
        const cognitiveSkill = await getAllcognitiveSkills();
        if (cognitiveSkill.Error) {
            if (cognitiveSkill.Error.response.data == 'Invalid Token') {
                sessionStorage.clear();
                localStorage.clear();
                history.push('/auth/signin-1');
                window.location.reload();
            }
        } else {
            const cognitiveSkillData = cognitiveSkill.Items
            const arrayData = [];
            console.log("cognitiveSkillData", cognitiveSkillData);
            cognitiveSkillData.map((item) => {
                arrayData.push({ value: item.cognitive_id, label: item.cognitive_name })
            })
            setCognitiveSkillOpptions(arrayData)

            const categoryData = await allQuestionCategories();
            if (categoryData.Error) {
                if (categoryData.Error.response.data == 'Invalid Token') {
                    sessionStorage.clear();
                    localStorage.clear();
                    history.push('/auth/signin-1');
                    window.location.reload();
                }
            } else {
                const categoryArray = [];
                categoryData.Items.map((item) => {
                    categoryArray.push({ value: item.category_id, label: item.category_name })
                })
                setCategoryOpptions(categoryArray)
            }
        }
    }

    const getCognitiveId = (event, index, ind) => {
        console.log("event", event.target.value);
        let data = [...bluePrintData];
        data[index].questions[ind].cognitive_id = event.target.value;
        setBluePrintData(data);
    }

    const getCategoryId = (event, index, ind) => {
        console.log("event", event.target.value);
        let data = [...bluePrintData];
        data[index].questions[ind].category_id = event.target.value;
        setBluePrintData(data);
    }

    const getQuestinType = (event, index, ind) => {
        console.log("event", event.target.value);
        let data = [...bluePrintData];
        data[index].questions[ind].question_type = event.target.value;
        setBluePrintData(data);
    }

    const getQuestionDifficult = (event, index, ind) => {
        console.log("event", event.target.value);
        let data = [...bluePrintData];
        data[index].questions[ind].difficulty_level = event.target.value;
        setBluePrintData(data);
    }

    const getSectionName = (event, index) => {
        let data = [...bluePrintData];
        data[index].section_name = event.target.value;
        setBluePrintData(data);
    }
    const getSectionDescription = (event, index) => {
        let data = [...bluePrintData];
        data[index].section_description = event.target.value;
        setBluePrintData(data);
    }

    // const getQuestionName = (event, index, ind) => {
    //     let data = [...bluePrintData];
    //     data[index].questions[ind].question_name = event.target.value;
    //     setBluePrintData(data);
    // }

    const getMarks = (event, index, ind) => {
        let data = [...bluePrintData];
        data[index].questions[ind].marks = event.target.value;
        setBluePrintData(data);
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
            if (threadLinks.length === 2) {
                setDisplayHeader(false);
            } else {
                setDisplayHeader(true);
            }

            getAllRequiredData();
        }
    }, [])



    return (
        <div>
            {
                displayHeader && (
                    <div className="page-header">
                        <div className="page-block">
                            <div className="row align-items-center">
                                <div className="col-md-12">
                                    <div className="page-header-title">
                                        <h5 className="m-b-10">Active Blue Print</h5>
                                    </div><ul className="breadcrumb  ">
                                        <li className="breadcrumb-item  ">
                                            <a href="/upschool/admin-portal/admin-dashboard">
                                                <i className="feather icon-home">
                                                </i>
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item  ">Blue Print</li>
                                        <li className="breadcrumb-item  ">Active Blue Print</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <React.Fragment>
                <Card>
                    <Card.Body>
                        <Card.Title>Add Blue Print</Card.Title>
                        <Formik
                            initialValues={{
                                bluePrintName: '',
                                bluePrintDuration: '',
                                bluePrintDec: '',
                                displayName: ''
                            }}
                            validationSchema={Yup.object().shape({
                                bluePrintName: Yup.string()
                                    .trim()
                                    .min(2, "Blue Print Name To short!")
                                    // .max(32, "Blue Print Name To Long!")
                                    .required("Blue Print Name is required!"),
                                bluePrintDuration: Yup.number()
                                    .min(1, "Duration is Less Then 1min!")
                                    .max(200, "Duration is More Then 200min!")
                                    .required("Time Duration is required!"),
                                displayName: Yup.string()
                                    .trim()
                                    .min(2, "Display Name To short!")
                                    // .max(32, "Display Name To Long!")
                                    .required("Display Name is required!"),
                            })}



                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                setErrors({ submit: 'Err' })
                                console.log("bluePrintDatabluePrintData", bluePrintData);
                                var finalData = JSON.parse(JSON.stringify(bluePrintData));

                                let filterSectionData = [];
                                let filterQuestionData = [];
                                bluePrintData.map((item) => {
                                    if (item.isError === 'yes') {
                                        filterSectionData.push(item)
                                    }
                                })

                                const unique = new Set();
                                const showError = finalData.some(element => unique.size === unique.add(element.section_name).size);
                                console.log("showError", showError);

                                bluePrintData.map((item) => {
                                    item.questions.map((e) => {
                                        console.log("item.questions", e);
                                        if (e.isError === 'yes') {
                                            filterQuestionData.push(e)
                                        }
                                        // else if (e.question_name === '' || e.question_name === undefined || e.question_name.length > 4) {
                                        //     filterQuestionData.push(e)

                                        // } 
                                        else if (e.marks === '' || e.marks === undefined || e.marks <= 0) {
                                            filterQuestionData.push(e)
                                        }
                                    })
                                })

                                console.log("filterQuestionData", filterQuestionData);


                                if (values.bluePrintDec.trim().length <= 0 || values.bluePrintDec === '' || values.bluePrintDec === undefined) {
                                    setErrors({ bluePrintDec: "Description is required!" });
                                } else if (showError) {
                                    setSectionRepErr(true)
                                } else if (filterSectionData.length > 0) {

                                } else if (filterQuestionData.length > 0) {

                                } else {
                                    await finalData.forEach((item, index) => {
                                        delete finalData[index].isError;
                                        finalData[index].questions.forEach((e, i) => {
                                            delete finalData[index].questions[i].isError
                                        })
                                    })

                                    console.log("finalData", finalData);

                                    let formData = {
                                        blueprint_name: values.bluePrintName,
                                        test_duration: values.bluePrintDuration,
                                        description: values.bluePrintDec,
                                        display_name: values.displayName,
                                        sections: finalData,
                                        blueprint_type : type,
                                    }

                                    console.log({ formData })
                                    axios
                                        .post(dynamicUrl.addBluePrint, {
                                            data: formData
                                        }, { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
                                        .then(async (response) => {
                                            console.log({ response });
                                            if (response.Error) {
                                                console.log('Error');
                                                hideLoader();
                                                setDisableButton(false);
                                            } else {

                                                sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingChapter });
                                                MySwal.fire({
                                                    title: 'Blue Print added successfully!',
                                                    icon: 'success',
                                                }).then((willDelete) => {

                                                    if(type === 'questionPaper')
                                                    history.push('/admin-portal/active-blueprint')
                                                    else
                                                    history.push('/admin-portal/worksheet-blueprint')
                                                    window.location.reload();
                                                })

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
                                                    sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });

                                                } else {
                                                    console.log("error", error);
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
                                        <Col>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="bluePrintName">
                                                    <small className="text-danger">* </small>BluePrint Name
                                                </label>
                                                <input
                                                    className="form-control"
                                                    error={touched.bluePrintName && errors.bluePrintName}
                                                    name="bluePrintName"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.bluePrintName}
                                                    id='title'
                                                />
                                                {touched.bluePrintName && errors.bluePrintName && <small className="text-danger form-text">{errors.bluePrintName}</small>}
                                            </div>
                                            <div className="form-group fill">
                                                <label className="floating-label" htmlFor="displayName">
                                                    <small className="text-danger">* </small>Display Name
                                                </label>
                                                <input
                                                    className="form-control"
                                                    error={touched.displayName && errors.displayName}
                                                    name="displayName"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.displayName}
                                                    id='title'
                                                />
                                                {touched.displayName && errors.displayName && <small className="text-danger form-text">{errors.displayName}</small>}
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="form-group fill" style={{ marginTop: '-9px' }}>
                                                <label className="floating-label" htmlFor="bluePrintDuration">
                                                    <small className="text-danger">* </small>Test Duration <label style={{ color: 'red' }}>&nbsp;(min)</label>
                                                </label>
                                                <input
                                                    className="form-control"
                                                    error={touched.bluePrintDuration && errors.bluePrintDuration}
                                                    name="bluePrintDuration"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="number"
                                                    value={values.bluePrintDuration}
                                                    id='title'
                                                    onWheel={(e) => e.target.blur()}
                                                />
                                                {touched.bluePrintDuration && errors.bluePrintDuration && <small className="text-danger form-text">{errors.bluePrintDuration}</small>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="form-group fill">
                                                <label><small className='text-danger'>*</small> BluePrint Description</label>
                                                <Form.Control as="textarea" name='bluePrintDec' onBlur={handleBlur} value={values.bluePrintDec}
                                                    onChange={handleChange} rows="4" />
                                                {touched.bluePrintDec && errors.bluePrintDec && <small className="text-danger form-text">{errors.bluePrintDec}</small>}
                                            </div>
                                        </Col>
                                    </Row>
                                    <br />
                                    {
                                        bluePrintData && bluePrintData.map((item, index) => {
                                            return (
                                                <>
                                                    <Card >
                                                        <Card.Body style={{ background: '#e0eeff' }}>
                                                            {bluePrintData.length > 1 ? (
                                                                <div className='d-flex justify-content-end'>
                                                                    <Button variant='danger' onClick={(e) => { removeSection(index) }}><i className='feather icon-trash' /></Button>
                                                                </div>
                                                            ) : (null)}
                                                            <Row>
                                                                <Col>
                                                                    <div className="form-group fill">
                                                                        <label className="floating-label" htmlFor="sectionName">
                                                                            <small className="text-danger">* </small>Section Name
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            name="sectionName"
                                                                            onBlur={handleBlur}
                                                                            onChange={(e) => {
                                                                                getSectionName(e, index);
                                                                            }}
                                                                            type="text"
                                                                            value={item.section_name}
                                                                            id='title'
                                                                        />
                                                                        {item.section_name.trim().length <= 0 && (errors.submit) ? (
                                                                            <>
                                                                                <p style={{ display: "none" }}>{item.isError = 'yes'}</p>
                                                                                <small style={{ color: 'red' }}>Field Required!</small>
                                                                            </>
                                                                        ) : (
                                                                            <p style={{ display: "none" }}>{item.isError = 'no'}</p>
                                                                        )}
                                                                    </div>

                                                                    <div className="form-group fill">
                                                                        <label className="floating-label" htmlFor="sectionName">
                                                                            <small className="text-danger">* </small>Section description
                                                                        </label>
                                                                        <textarea
                                                                            className="form-control"
                                                                            name="sectionName"
                                                                            onBlur={handleBlur}
                                                                            onChange={(e) => {
                                                                                getSectionDescription(e, index);
                                                                            }}
                                                                            type="text"
                                                                            value={item.section_description}
                                                                            id='title'
                                                                        />
                                                                        {item.section_description.trim().length <= 0 && (errors.submit) ? (
                                                                            <>
                                                                                <p style={{ display: "none" }}>{item.isError = 'yes'}</p>
                                                                                <small style={{ color: 'red' }}>Field Required!</small>
                                                                            </>
                                                                        ) : (
                                                                            <p style={{ display: "none" }}>{item.isError = 'no'}</p>
                                                                        )}
                                                                    </div>
                                                                    {console.log({ bluePrintData })}
                                                                    <div>
                                                                        {item.questions.map((e, ind) => {
                                                                            return (
                                                                                <>
                                                                                    <Card>
                                                                                        <Card.Body style={{ background: '#aaaaaa' }}>
                                                                                            {item.questions.length > 1 ? (
                                                                                                <div style={{display :'flex', flexDirection :"row", justifyContent :"space-between"}}>
                                                                                                 <label className="floating-label" >{ind+1}. </label>
                                                                                                <div className='d-flex justify-content-end'>
                                                                                                    <Button variant='danger' onClick={(e) => { removeQuestion(index, ind) }}><i className='feather icon-trash' /></Button>
                                                                                                </div>
                                                                                                </div>
                                                                                            ) : (  <label className="floating-label" >{ind+1}. </label>
                                                                                                )
                                                                                            }
                                                                                            <Row>
                                                                                                <Col>


                                                                                                    <div className="form-group fill">
                                                                                                        <label className="floating-label" >
                                                                                                            <small className="text-danger">* </small>
                                                                                                            Question Type
                                                                                                        </label>
                                                                                                        <select
                                                                                                            className="form-control"
                                                                                                            error={touched.upschool_class_id && errors.upschool_class_id}
                                                                                                            name="upschool_class_id"
                                                                                                            onBlur={handleBlur}
                                                                                                            type="text"
                                                                                                            value={e.question_type}
                                                                                                            key={index}
                                                                                                            onChange={event => getQuestinType(event, index, ind)}
                                                                                                        >

                                                                                                            <option>
                                                                                                                Select Question Type
                                                                                                            </option>

                                                                                                            {console.log(questionTypeOption)}
                                                                                                            {questionTypeOption && questionTypeOption.map((skillsData) => {
                                                                                                                return <option
                                                                                                                    value={skillsData}
                                                                                                                    key={skillsData}
                                                                                                                >
                                                                                                                    {skillsData}
                                                                                                                </option>
                                                                                                            })}

                                                                                                        </select>
                                                                                                        {(e.question_type === '' || e.question_type === undefined || e.question_type === 'Select Question Type') && (errors.submit) ? (
                                                                                                            <>
                                                                                                                <p style={{ display: "none" }}>{e.isError = 'yes'}</p>
                                                                                                                <small style={{ color: "red" }}>Field Required!</small>
                                                                                                            </>

                                                                                                        ) : (
                                                                                                            <>
                                                                                                                <p style={{ display: "none" }}>{e.isError = 'no'}</p>

                                                                                                            </>
                                                                                                        )}
                                                                                                    </div>

                                                                                                    <div className="form-group fill">
                                                                                                        <label className="floating-label" >
                                                                                                            <small className="text-danger">* </small>
                                                                                                            Question Category
                                                                                                        </label>

                                                                                                        <select
                                                                                                            className="form-control"
                                                                                                            error={touched.upschool_class_id && errors.upschool_class_id}
                                                                                                            name="upschool_class_id"
                                                                                                            onBlur={handleBlur}
                                                                                                            type="text"
                                                                                                            value={e.category_id}
                                                                                                            key={index}
                                                                                                            onChange={event => getCategoryId(event, index, ind)}
                                                                                                        >

                                                                                                            <option>
                                                                                                                Select Category
                                                                                                            </option>

                                                                                                            {console.log(categoryOpptions)}
                                                                                                            {categoryOpptions && categoryOpptions.map((skillsData) => {
                                                                                                                return <option
                                                                                                                    value={skillsData.value}
                                                                                                                    key={skillsData.value}
                                                                                                                >
                                                                                                                    {skillsData.label}
                                                                                                                </option>
                                                                                                            })}

                                                                                                        </select>
                                                                                                        {(e.category_id === '' || e.category_id === undefined || e.category_id === "Select Category") && (errors.submit) ? (
                                                                                                            <>
                                                                                                                <p style={{ display: "none" }}>{e.isError = 'yes'}</p>
                                                                                                                <small style={{ color: "red" }}>Field Required!</small>
                                                                                                            </>

                                                                                                        ) : (
                                                                                                            <>
                                                                                                                <p style={{ display: "none" }}>{e.isError = 'no'}</p>

                                                                                                            </>
                                                                                                        )}
                                                                                                    </div>

                                                                                                    <div className="form-group fill">
                                                                                                        <label className="floating-label" >
                                                                                                            <small className="text-danger">* </small>
                                                                                                            Difficulty level
                                                                                                        </label>
                                                                                                        <select
                                                                                                            className="form-control"
                                                                                                            error={touched.upschool_class_id && errors.upschool_class_id}
                                                                                                            name="upschool_class_id"
                                                                                                            onBlur={handleBlur}
                                                                                                            type="text"
                                                                                                            value={e.difficulty_level}
                                                                                                            key={index}
                                                                                                            onChange={event => getQuestionDifficult(event, index, ind)}
                                                                                                        >

                                                                                                            <option>
                                                                                                                Select Question Difficulty
                                                                                                            </option>

                                                                                                            {console.log(questionDifficulty)}
                                                                                                            {questionDifficulty && questionDifficulty.map((skillsData) => {
                                                                                                                return <option
                                                                                                                    value={skillsData.value}
                                                                                                                    key={skillsData.value}
                                                                                                                >
                                                                                                                    {skillsData.label}
                                                                                                                </option>
                                                                                                            })}

                                                                                                        </select>
                                                                                                        {(e.difficulty_level === '' || e.difficulty_level === undefined || e.difficulty_level === "Select Question Difficulty") && (errors.submit) ? (
                                                                                                            <>
                                                                                                                <p style={{ display: "none" }}>{e.isError = 'yes'}</p>
                                                                                                                <small style={{ color: "red" }}>Field Required!</small>
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <>
                                                                                                                <p style={{ display: "none" }}>{e.isError = 'no'}</p>
                                                                                                            </>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </Col>
                                                                                                <Col>
                                                                                                    <div className="form-group fill">
                                                                                                        <label className="floating-label" htmlFor="questionMarks">
                                                                                                            <small className="text-danger">* </small>Marks
                                                                                                        </label>
                                                                                                        <input
                                                                                                            className="form-control"
                                                                                                            error={touched.questionMarks && errors.questionMarks}
                                                                                                            name="questionMarks"
                                                                                                            onBlur={handleBlur}
                                                                                                            onChange={(e) => {
                                                                                                                getMarks(e, index, ind)
                                                                                                            }}
                                                                                                            type="number"
                                                                                                            value={e.marks}
                                                                                                            id='title'
                                                                                                            onWheel={(e) => e.target.blur()}
                                                                                                        />
                                                                                                        {(e.marks.trim().length <= 0 || e.marks <= 0) && (errors.submit) ? (
                                                                                                            <>
                                                                                                                <p style={{ display: "none" }}>{e.isError = 'yes'}</p>
                                                                                                                <small style={{ color: "red" }}>Field Required!</small>
                                                                                                            </>

                                                                                                        ) : (
                                                                                                            <>
                                                                                                                <p style={{ display: "none" }}>{e.isError = 'no'}</p>

                                                                                                            </>

                                                                                                        )}
                                                                                                    </div>
                                                                                                    <div className="form-group fill">
                                                                                                        <label className="floating-label" >
                                                                                                            <small className="text-danger">* </small>
                                                                                                            Cognitive Skill
                                                                                                        </label>
                                                                                                        <select
                                                                                                            className="form-control"
                                                                                                            error={touched.upschool_class_id && errors.upschool_class_id}
                                                                                                            name="upschool_class_id"
                                                                                                            onBlur={handleBlur}
                                                                                                            type="text"
                                                                                                            value={e.cognitive_id}
                                                                                                            key={index}
                                                                                                            onChange={event => getCognitiveId(event, index, ind)}
                                                                                                        >

                                                                                                            <option>
                                                                                                                Select Skill
                                                                                                            </option>

                                                                                                            {console.log(cognitiveSkillOpptions)}
                                                                                                            {cognitiveSkillOpptions && cognitiveSkillOpptions.map((skillsData) => {
                                                                                                                return <option
                                                                                                                    value={skillsData.value}
                                                                                                                    key={skillsData.value}
                                                                                                                >
                                                                                                                    {skillsData.label}
                                                                                                                </option>
                                                                                                            })}

                                                                                                        </select>
                                                                                                        {(e.cognitive_id === '' || e.cognitive_id === undefined || e.cognitive_id === "Select Skill") && (errors.submit) ? (
                                                                                                            <>
                                                                                                                <p style={{ display: "none" }}>{e.isError = 'yes'}</p>
                                                                                                                <small style={{ color: "red" }}>Field Required!</small>

                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <>
                                                                                                                <p style={{ display: "none" }}>{e.isError = 'no'}</p>

                                                                                                            </>

                                                                                                        )}
                                                                                                    </div>

                                                                                                </Col>
                                                                                            </Row>
                                                                                        </Card.Body>
                                                                                    </Card>
                                                                                </>
                                                                            )
                                                                        })}
                                                                        {sectionRepErr && (
                                                                            <>
                                                                                <smal className='text-danger'>Section Name Repeated!</smal>
                                                                                <br />
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Button style={{ backgroundColor: '#4e5256' }} onClick={(e) => { addQuestion(index) }}>
                                                                <i className='fas fa-plus' />&nbsp; Add Question
                                                            </Button>
                                                        </Card.Body>
                                                    </Card>
                                                </>
                                            )
                                        })
                                    }
                                    <Button style={{ backgroundColor: '#4e5256' }} onClick={addSection}>
                                        <i className='fas fa-plus' />&nbsp; Add Section
                                    </Button>
                                    <div className='d-flex justify-content-end'>
                                        <Button type='submit'>Submit</Button>
                                    </div>
                                </form>
                            )}

                        </Formik>
                    </Card.Body>

                </Card>

            </React.Fragment>
        </div>

    )

};

export default AddBluePrint;
