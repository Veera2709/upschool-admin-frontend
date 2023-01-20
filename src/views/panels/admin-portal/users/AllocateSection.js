import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Pagination, Button, Modal, ModalBody, Form, Alert } from 'react-bootstrap';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import * as Yup from 'yup';
import Board from 'react-trello';
import { FieldArray, Formik } from 'formik';
import { areFilesInvalid } from '../../../../util/utils';
import * as Constants from '../../../../config/constant'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'axios';
import dynamicUrl from "../../../../helper/dynamicUrls";
import { useHistory } from 'react-router-dom';
import { isEmptyObject } from '../../../../util/utils';
import CloseButton from 'react-bootstrap/CloseButton';
import { isEmptyArray } from '../../../../util/utils';
import Select from 'react-select';
import BasicSpinner from '../../../../helper/BasicSpinner';
import { fetchSectionByClientClassId, fetchClassBasedOnSchool, fetchSchoolSection, fetchTeacherInfoDetails } from "../../../api/CommonApi";

const AllocateSection = ({ setOpenSectionAllocation, schoolId, teacherId }) => {
    console.log("teacherId", teacherId);

    const [errorMessage, setErrorMessage] = React.useState("");
    const colourOptions = [];
    const multiDropDownValues = [];
    const allSections = [];

    const [formFields, setFormFields] = useState([
        {
            client_class_id: '',
            section_id: '',
        }
    ]);
    const [classId, setClass] = useState([]);
    const [options, setOptions] = useState([]);
    const [multiOptions, setMultiOptions] = useState([]);
    const [multiDropOptions, setMultiDropOptions] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [sectionRepeat, SetSecctionRepeat] = useState(false)
    const [selectSection, SetSelectSection] = useState(false)
    const [selectSectionErr, SetSelectSectionErr] = useState(false)
    const [sectionValidation, setSectionValidation] = useState(false)
    const [count, setCount] = useState(0);
    const [validationIndex, setValidationIndex] = useState();
    const [sections, setSections] = useState();
    const [sectionData, setSectionData] = useState([]);
    const [classData, setClassData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [selectIndex, SetSelectIndex] = useState();
    
    const MySwal = withReactContent(Swal);
    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    console.log("multiDropDownValues", multiDropDownValues);
    console.log("sections", sections);
    console.log("sectionsData", sectionData);
    console.log("colourOptions", colourOptions);




    const handleFormChange = (event, index, type) => {

        console.log("handle FormChange", event);

        let data = [...formFields];

        
            if (type === 'class') {
                console.log(data);
                data[index]["client_class_id"] = event.value;
                setCount(0);
                setFormFields(data);
            } else {
                console.log(event);
                data[index]['section_id'] = event.value;
                console.log(data);
            }
        }
       

    

    const addFields = () => {
        let object = {
            client_class_id: '',
            section_id: '',
        }

        setFormFields([...formFields, object])
    }

    const subscribeClass = (e) => {

        let sendData = {
            teacher_id: teacherId,
            allocateLists: formFields
        }

        const unique = new Set();
        const showError = formFields.some(element => unique.size === unique.add(element.section_id).size);
        // alert(showError)

        let emptyFieldValidation = formFields.find(o => o.section_id === "" || o.section_id === 0 || o.section_id === undefined)
        if (emptyFieldValidation) {
            setSectionValidation(true)
        } else if (showError === true) {
            SetSecctionRepeat(showError)

        } else if (selectSection === true) {
            SetSelectSectionErr(true)
        } else {
            console.log("sending the data", sendData);
            axios.post(dynamicUrl.teacherSectionAllocation, { data: sendData }, {
                headers: { Authorization: sessionStorage.getItem('user_jwt') }
            })
                .then((response) => {
                    const result = response.data;
                    if (result == 200) {
                        setOpenSectionAllocation(false)
                        MySwal.fire({

                            title: 'Section Allocation successfully!',
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
                        setOpenSectionAllocation(false)
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
        data1.splice(index,1)
        setSectionData(data1)

        let data2 = [...classData]
        data2.splice(index,1)
        setClassData(data2)
    }

    const fetchClass = async () => {
        setIsLoading(true)
        const ClientClassId = await fetchClassBasedOnSchool(schoolId);
        console.log("SchollIdForSection",schoolId);
        if (ClientClassId.Error) {
            console.log("ClientClassId.Error", ClientClassId.Error);
        } else {
            let resultData = ClientClassId.Items
            resultData.forEach((item, index) => {
                colourOptions.push({ value: item.client_class_id, label: item.client_class_name })
            })
            setOptions(colourOptions)
            const schoolSections = await fetchSchoolSection(schoolId);
            if (schoolSections.Error) {
                console.log("schoolSections.Error", schoolSections.Error);
            } else {
                const sectionsData = schoolSections.Items
                console.log("sectionsData", sectionsData);
                sectionsData.forEach((item, index) => {
                    allSections.push({ value: item.section_id, label: item.section_name })
                })
                setSections(allSections)

                const teacherInfo = await fetchTeacherInfoDetails(teacherId);
                if (teacherInfo.Error) {
                    console.log("teacherInfo.Error", teacherInfo.Error);
                } else {
                    console.log('teacherInfo', teacherInfo);
                    let object;
                    let tempArray = [];
                    let classArray = [];
                    let SesionArray = [];
                    teacherInfo.forEach((Items, index) => {
                        object = {
                            client_class_id: Items.client_class_id,
                            section_id: Items.section_id
                        }
                        tempArray.push(object);
                        console.log("options", options);
                        console.log("Items.client_class_id", Items);
                        const defaultValue = colourOptions && colourOptions.filter(activity => (activity.value === Items.client_class_id))
                        const sectiontValue = allSections && allSections.filter(activity => (activity.value === Items.section_id))

                        classArray.push(defaultValue);
                        console.log("defaultValue", defaultValue);
                        console.log("sectiontValue", sectiontValue);
                        SesionArray.push({ value: sectiontValue[0].value, label: sectiontValue[0].label });
                        console.log("defaultValue", defaultValue);
                        console.log('sectiontValue', sectiontValue);
                    })

                    isEmptyArray(tempArray) ? (

                        tempArray.push(object = {
                            client_class_id: "",
                            section_id: "",
                        })

                    ) : (console.log("Not empty"))

                    console.log("tempArray", tempArray);
                    // setdropDownValues(responseData.upschoolClassItems);
                    setFormFields(tempArray);
                    setClassData(classArray);
                    setSectionData(SesionArray);
                    // setPreviousData(responseData);
                }

            }
        }
        setIsLoading(false)
    }

    useEffect(() => {

        fetchClass();

    }, [])

    const classOption = async (e, index) => {
        setValidationIndex(index)
        console.log("classOption", e);
        setClass(e.value);
        const ClientClassId = await fetchSectionByClientClassId(e.value);
        if (ClientClassId.Error) {
            console.log('ClientClassId.Error', ClientClassId.Error);
        } else {
            console.log('ClientClassId', ClientClassId.Items);
            const resultData = ClientClassId.Items
            console.log("resultData",resultData);
            resultData.forEach((item, index) => {
                multiDropDownValues.push({ value: item.section_id, label: item.section_name })
            })
            // setSectionData(multiDropDownValues);
            setMultiDropOptions(multiDropDownValues)
        }

    };

    const handleDeleteEduItem = (index) => {
        sectionData.splice(index, 1, { value: '', label: 'select' })
    }

    const handleDeleteSection = (event, index) => {
        console.log("handleDeleteSection", event, index);
        sectionData.splice(index, 1, event)
        setSectionData(sectionData)
        let data = [...classData]
        setClassData(data)
    }

    const SectionErr = (index)=>{
        if(selectIndex === index){
            SetSelectSectionErr(false)
        }
    }

    useEffect(() => {

    }, [classData])
    return (

        <div className="App">
            {
                isLoading ? (
                    <BasicSpinner />
                ) : (
                    <>
                        {isEmptyObject(formFields) ? <></> : (
                            <>
                                <React.Fragment>
                                    <Formik
                                        initialValues={{
                                            client_class_id: '',
                                            Section_id: multiOptions,
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

                                                            return (

                                                                <>
                                                                    {console.log(formFields)}

                                                                    {formFields.length > 1 && (
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
                                                                                Class
                                                                            </label>
                                                                            {classData && (
                                                                                <Select
                                                                                    // classData
                                                                                    defaultValue={classData[index]}
                                                                                    className="basic-single"
                                                                                    classNamePrefix="select"
                                                                                    label="client_class_id"
                                                                                    name="client_class_id"
                                                                                    options={options}
                                                                                    // onChange={(e) => { classOption(e) }}
                                                                                    onBlur={(e) => { handleBlur(e) }}
                                                                                    onChange={(event) => {
                                                                                        handleFormChange(event, index, 'class');
                                                                                        classOption(event, index);
                                                                                        handleDeleteEduItem(index);
                                                                                        SetSelectSection(true)
                                                                                        SetSelectIndex(index)
                                                                                    }}
                                                                                />
                                                                            )}
                                                                            {touched.upschool_class_id && errors.upschool_class_id && (
                                                                                <small className="text-danger form-text">{errors.zupschool_class_id}</small>
                                                                            )}
                                                                        </Col>
                                                                        {multiDropOptions && sectionData && (
                                                                            <Col>
                                                                                <label className="floating-label">
                                                                                    <small className="text-danger">* </small>
                                                                                    Section
                                                                                </label>

                                                                                {
                                                                                    validationIndex !== index ? <>
                                                                                        <Select
                                                                                            defaultValue={sectionData[index]}
                                                                                            className="basic-single"
                                                                                            label="section_id"
                                                                                            classNamePrefix="select"
                                                                                            name="section_id"
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
                                                                                            label="section_id"
                                                                                            value={sectionData[index] && sectionData[index]}
                                                                                            classNamePrefix="select"
                                                                                            name="section_id"
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

                                                                </>

                                                            )
                                                        })

                                                    }
                                                </form>

                                                <Row className="my-3">
                                                    <Col sm={2}>
                                                        <button onClick={addFields}>+</button>
                                                    </Col>
                                                    <Col>
                                                        {sectionRepeat && (<small className="text-danger form-text">Class and Section Combination is Repeated</small>)}
                                                        {sectionValidation && (<small className="text-danger form-text">Section is required!</small>)}
                                                        {selectSectionErr && (<small className="text-danger form-text">please select section!</small>)}
                                                    </Col>
                                                    <Col>
                                                        <Button className="btn-block" color="success" size="large" type="submit" variant="success" onClick={subscribeClass} >
                                                            Submit
                                                        </Button>
                                                    </Col>
                                                </Row> </>
                                        )}
                                    </Formik>
                                </React.Fragment>
                            </>
                        )}
                    </>
                )
            }
        </div >
    );

}

export default AllocateSection
