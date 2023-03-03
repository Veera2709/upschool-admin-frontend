import React, { useEffect } from 'react';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import { Row, Col, Card, Button, CloseButton } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Select from 'react-select';

import dynamicUrl from '../../../../helper/dynamicUrls';
import BasicSpinner from '../../../../helper/BasicSpinner';
import { SessionStorage } from '../../../../util/SessionStorage';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { isEmptyArray, isEmptyObject } from '../../../../util/utils';
import MESSAGES from '../../../../helper/messages';

const AllocateSubjects = ({ schoolId, user_id }) => {

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const [errorMessage, setErrorMessage] = React.useState("");
    const tempClassSecOptions = [];
    const multiDropDownValues = [];
    const allSections = [];

    const [formFields, setFormFields] = useState([
        {
            classSectionId: '',
            subject_id: '',
            subject_title: ''
        }
    ]);
    const [classId, setClass] = useState([]);
    const [classSecDropdownOptions, setClassSecDropdownOptions] = useState([]);
    const [multiOptions, setMultiOptions] = useState([]);
    const [multiDropOptions, setMultiDropOptions] = useState([]);
    const [sectionRepeat, SetSecctionRepeat] = useState(false)
    const [selectSection, SetSelectSection] = useState(false)
    const [selectSectionErr, SetSelectSectionErr] = useState(false)
    const [sectionValidation, setSectionValidation] = useState(false)
    const [count, setCount] = useState(0);
    const [validationIndex, setValidationIndex] = useState();
    const [sections, setSections] = useState();
    const [sectionData, setSectionData] = useState([]);
    const [classData, setClassData] = useState();
    const [selectIndex, SetSelectIndex] = useState();
    const [subRepeatedErrMsg, setSubRepeatedErrMsg] = useState('');
    const [selectedClassSection, setSelectedClassSection] = useState('');

    console.log("multiDropDownValues", multiDropDownValues);
    console.log("sections", sections);
    console.log("sectionsData", sectionData);
    console.log("tempClassSecOptions", tempClassSecOptions);


    const handleFormChange = (event, index, type) => {

        console.log("handle FormChange", event);
        SetSelectSectionErr(false);
        SetSecctionRepeat(false);
        setSectionValidation(false);
        let data = [...formFields];

        if (type === 'class') {
            
            classData.splice(index, 1, { value: event.value, label: event.label })
            console.log(data);
            data[index]["classSectionId"] = event.value;
            setCount(0);
            setSelectedClassSection(event.label);
            setFormFields(data);

        } else {
            console.log(event);
            data[index]['subject_id'] = event.value;
            data[index]['subject_title'] = event.label;
            console.log(data);
        }
    }

    const addFields = () => {
        let object = {
            classSectionId: '',
            subject_id: '',
        }

        setFormFields([...formFields, object])
    }

    const subscribeClass = (e) => {

        let sendData = {
            teacher_id: user_id,
            subjectList: formFields
        }

        const unique = new Set();
        const duplicateValue = [];

        console.log(formFields);

        const showError = formFields.some(element => {

            let dupStatus = unique.size === unique.add(element.subject_id + element.classSectionId).size;

            console.log(dupStatus);
            console.log(unique.size === unique.add(element.subject_id + element.classSectionId).size);

            if (unique.size === unique.add(element.subject_id + element.classSectionId).size) {

                console.log(element.subject_title);
                duplicateValue.push(element.subject_title);
            }

            return unique.size === unique.add(element.subject_id + ' ' + element.classSectionId).size;
        });

        let emptyFieldValidation = formFields.find(o => o.subject_id === "" || o.subject_id === 0 || o.subject_id === undefined);
        let emptyFieldValidation2 = sectionData.find(o => o.value === "" || o.value === 'Select...' || o.value === undefined)

        if (emptyFieldValidation || emptyFieldValidation2) {

            setSectionValidation(true);

        } else if (showError === true) {

            console.log(duplicateValue);
            setSubRepeatedErrMsg(`The Combination is Repeated for: ${duplicateValue[duplicateValue.length - 1]}`)
            SetSecctionRepeat(showError);

        } else if (selectSection === true) {

            SetSelectSectionErr(true);

        } else {

            console.log("sending the data", sendData);

            axios.post(dynamicUrl.mappingSubjectToTeacher, { data: sendData }, {
                headers: { Authorization: sessionStorage.getItem('user_jwt') }
            })
                .then((response) => {
                    const result = response.data;
                    if (result == 200) {

                        MySwal.fire({

                            title: 'Subject Allocation successful!',
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
                    console.log(err);
                    if (err.response.status === 400) {

                        sweetAlertHandler({ title: 'Error', type: 'error', text: err.response.data });
                    }
                })
        }

        console.log('sendData', sendData);

    }

    const removeFields = (index) => {

        console.log(formFields);
        console.log(index);

        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data);

        let data1 = [...sectionData]
        data1.splice(index, 1)
        setSectionData(data1)

        let data2 = [...classData]
        data2.splice(index, 1)
        setClassData(data2)
    }

    const classOption = async (e, index) => {
        setValidationIndex(index)
        console.log("class Option", e);
        setClass(e.value);

        axios.post(dynamicUrl.fetchSubjectForClientClass, {
            data: { clientClassId: e.value }
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);

                const resultData = response.data;
                console.log("resultData", resultData);
                resultData.forEach((item, index) => {
                    multiDropDownValues.push({ value: item.subject_id, label: item.subject_title })
                })
                setSections(multiDropDownValues);
                setMultiDropOptions(multiDropDownValues)
            })
            .catch((error) => {

                console.log(error);
            })


    };

    const handleDeleteEduItem = (index) => {
        sectionData.splice(index, 1, { value: '', label: 'Select...' })
    }

    const handleDeleteSection = (event, index) => {
        console.log("handleDeleteSection", event, index);
        sectionData.splice(index, 1, event)
        setSectionData(sectionData)
        let data = [...classData]
        setClassData(data)
    }

    const SectionErr = (index) => {
        setSectionValidation(false)
        if (selectIndex === index) {
            SetSelectSectionErr(false)
            SetSelectSection(false)
        }
    }

    const fetchClassSection = () => {

        setIsLoading(true);

        const data = {
            school_id: schoolId,
            teacher_id: user_id
        }

        axios
            .post(dynamicUrl.fetchTeacherClassAndSection, { data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
            .then(async (response) => {

                console.log({ response });
                console.log(response.data);

                const resultData = response.data;

                resultData.forEach((item, index) => {
                    tempClassSecOptions.push({ value: item.valueId, label: item.classAndSection });
                });

                setClassSecDropdownOptions(tempClassSecOptions);

                axios
                    .post(dynamicUrl.fetchMappedSubjectForTeacher, { data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
                    .then(async (response) => {

                        console.log({ response });
                        console.log(response.data);

                        const subjectList = response.data.subjectList;
                        console.log("subjectList", subjectList);

                        const classSectionList = response.data.classSectionList;
                        console.log("classSectionList", classSectionList);

                        const mappedSubject = response.data.mappedSubject;

                        let object;
                        let tempArray = [];

                        let previousClassSecArr = [];
                        let getDataClassSec;
                        let getClassSecArr;

                        let previousSubArr = [];
                        let getDataSub;
                        let getSubArr;

                        if (Array.isArray(mappedSubject)) {
                            for (let index = 0; index < mappedSubject.length; index++) {

                                getDataClassSec = classSectionList.filter(p => p.valueId === mappedSubject[index].classSectionId);
                                console.log(getDataClassSec);
                                getClassSecArr = [{ label: getDataClassSec[0].classAndSection, value: mappedSubject[index].classSectionId }];

                                previousClassSecArr.push(getClassSecArr[0]);
                                console.log(previousClassSecArr);

                                getDataSub = subjectList.filter(p => p.subject_id === mappedSubject[index].subject_id);
                                console.log(getDataSub);
                                getSubArr = [{ label: getDataSub[0].subject_title, value: mappedSubject[index].subject_id }];

                                previousSubArr.push(getSubArr[0]);
                                console.log(previousSubArr);

                                object = {
                                    classSectionId: mappedSubject[index].classSectionId,
                                    subject_id: mappedSubject[index].subject_id,
                                    subject_title: getDataSub[0].subject_title
                                }

                                tempArray.push(object);

                            }
                        }

                        setClassData(previousClassSecArr);
                        setSectionData(previousSubArr);
                        isEmptyArray(tempArray) ? (

                            tempArray.push(object = {
                                classSectionId: '',
                                subject_id: '',
                                subject_title: ''
                            })

                        ) : (console.log("Not empty"))

                        setFormFields(tempArray);
                        setIsLoading(false);

                    })
                    .catch((error) => {
                        if (error.response) {
                            // Request made and server responded
                            hideLoader();
                            console.log(error.response.data);

                            if (error.response.data === 'Invalid Token') {

                                sessionStorage.clear();
                                localStorage.clear();

                                history.push('/auth/signin-1');
                                window.location.reload();

                            } else {


                            }

                        } else if (error.request) {
                            // The request was made but no response was received
                            hideLoader();
                            console.log(error.request);
                            history.push('/admin-portal/active-users');
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            hideLoader();
                            console.log('Error', error.message);
                            history.push('/admin-portal/active-users');

                        }
                    });

            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    hideLoader();
                    console.log(error.response.data);

                    if (error.response.data === 'Invalid Token') {

                        sessionStorage.clear();
                        localStorage.clear();

                        history.push('/auth/signin-1');
                        window.location.reload();

                    } else {


                    }

                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                    history.push('/admin-portal/active-users');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                    history.push('/admin-portal/active-users');

                }
            });
    }

    useEffect(() => {

        const validateJWT = sessionStorage.getItem('user_jwt');

        if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

        } else {

            fetchClassSection();
        }
    }, [])

    return (
        
        <>
            <React.Fragment>
                <div>
                    {isLoading ? (
                        <BasicSpinner />
                    ) : (

                        <>

                            <Card>
                                <Card.Body>
                                    <Card.Title>Allocate Subjects</Card.Title>
                                    <Formik
                                        initialValues={{
                                            classSectionId: '',
                                            subject_id: multiOptions,
                                            submit: null
                                        }}

                                        validationSchema={Yup.object().shape({

                                        })}

                                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                            setSubmitting(true);


                                        }}
                                    >

                                        {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                                            <>
                                                <form onSubmit={handleSubmit}>

                                                    {
                                                        formFields.map((form, index) => {

                                                            console.log(form.subject_title)

                                                            return (

                                                                <>
                                                                    {console.log(formFields)}

                                                                    {formFields && (
                                                                        <Row>
                                                                            <Col></Col>
                                                                            <Col>
                                                                                <CloseButton onClick={() => {
                                                                                    removeFields(index);
                                                                                    SetSecctionRepeat(false)
                                                                                    // SetSelectSectionErr(false)
                                                                                    SectionErr(index)
                                                                                }} variant="white" />
                                                                            </Col>
                                                                        </Row>
                                                                    )}

                                                                    <Row key={index}>
                                                                        <Col>
                                                                            <label className="floating-label" >
                                                                                <small className="text-danger">* </small>
                                                                                Class - Section
                                                                            </label>
                                                                            {classData && (
                                                                                <Select
                                                                                    // defaultValue={classData[index]}
                                                                                    className="basic-single"
                                                                                    classNamePrefix="select"
                                                                                    label="classSectionId"
                                                                                    name="classSectionId"
                                                                                    options={classSecDropdownOptions}
                                                                                    onBlur={(e) => { handleBlur(e) }}
                                                                                    value={classData[index] && classData[index]}
                                                                                    onChange={(event) => {
                                                                                        handleFormChange(event, index, 'class');
                                                                                        classOption(event, index);
                                                                                        handleDeleteEduItem(index);
                                                                                        SetSelectSection(true)
                                                                                        SetSelectIndex(index)
                                                                                    }}
                                                                                />

                                                                                // <select
                                                                                //     className="form-control"
                                                                                //     error={touched.classSectionId && errors.classSectionId}
                                                                                //     name="classSectionId"
                                                                                //     onBlur={handleBlur}
                                                                                //     type="text"
                                                                                //     defaultValue={form.subject_title}
                                                                                //     onChange={(event) => {
                                                                                //         handleFormChange(event, index, 'class');
                                                                                //         classOption(event, index);
                                                                                //         handleDeleteEduItem(index);
                                                                                //         SetSelectSection(true)
                                                                                //         SetSelectIndex(index)
                                                                                //     }}
                                                                                // >

                                                                                //     <option>
                                                                                //         Select...
                                                                                //     </option>
                                                                                //     {classSecDropdownOptions.map((optionsData) => {

                                                                                //         return <option
                                                                                //             value={optionsData.value}
                                                                                //             key={optionsData.value}
                                                                                //         >
                                                                                //             {optionsData.label}
                                                                                //         </option>

                                                                                //     })}

                                                                                // </select>
                                                                            )}
                                                                            {touched.upschool_class_id && errors.upschool_class_id && (
                                                                                <small className="text-danger form-text">{errors.zupschool_class_id}</small>
                                                                            )}
                                                                        </Col>

                                                                        {multiDropOptions && sectionData && (
                                                                            <Col>
                                                                                <label className="floating-label">
                                                                                    <small className="text-danger">* </small>
                                                                                    Subject
                                                                                </label>

                                                                                {
                                                                                    validationIndex !== index ? <>
                                                                                        <Select
                                                                                            defaultValue={sectionData[index]}
                                                                                            className="basic-single"
                                                                                            label="subject_id"
                                                                                            classNamePrefix="select"
                                                                                            name="subject_id"
                                                                                            value={sectionData[index] && sectionData[index]}
                                                                                            options={multiDropOptions}
                                                                                            onChange={(event) => {
                                                                                                handleFormChange(event, index, 'section'); SetSecctionRepeat(false);
                                                                                                setSectionValidation(false)
                                                                                                SetSelectSection(true)
                                                                                                SetSelectSectionErr(false)
                                                                                                handleDeleteSection(event, index)
                                                                                            }}
                                                                                            isDisabled={true}
                                                                                        />
                                                                                    </> : <>
                                                                                        <Select
                                                                                            defaultValue={sectionData[index]}
                                                                                            className="basic-single"
                                                                                            label="subject_id"
                                                                                            value={sectionData[index] && sectionData[index]}
                                                                                            classNamePrefix="select"
                                                                                            name="subject_id"
                                                                                            options={multiDropOptions}
                                                                                            onChange={(event) => {
                                                                                                handleFormChange(event, index, 'section'); SetSecctionRepeat(false);
                                                                                                setSectionValidation(false)
                                                                                                SetSelectSection(false)
                                                                                                SetSelectSectionErr(false)
                                                                                                handleDeleteSection(event, index)
                                                                                            }}
                                                                                        />
                                                                                    </>
                                                                                }


                                                                            </Col>
                                                                        )}
                                                                    </Row>
                                                                    <br />
                                                                </>

                                                            )
                                                        })

                                                    }
                                                </form>

                                                <br />
                                                <Row className="my-3">
                                                    <Col sm={2}>
                                                        <button onClick={addFields}>+</button>
                                                    </Col>
                                                    <Col>
                                                        {sectionRepeat && (<div className="text-danger form-text">{subRepeatedErrMsg}</div>)}
                                                        {sectionValidation && (<div className="text-danger form-text">Fields can't be empty!</div>)}
                                                        {selectSectionErr && (<div className="text-danger form-text">Please Select Subject!</div>)}
                                                    </Col>
                                                    <Col sm={2}>
                                                        <Button
                                                            className="btn-block"
                                                            color="success"
                                                            size="small"
                                                            type="submit"
                                                            variant="success"
                                                            onClick={subscribeClass} >
                                                            Submit
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}
                                    </Formik>

                                </Card.Body>
                            </Card>
                        </>
                    )}
                </div>
            </React.Fragment>
        </>
    )
}
export default AllocateSubjects