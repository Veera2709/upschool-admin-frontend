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
import { fetchSectionByClientClassId } from "../../../api/CommonApi";

const AllocateSection = ({ setOpenSectionAllocation, schoolId }) => {

    const [errorMessage, setErrorMessage] = React.useState("");
    const colourOptions = [];
    const multiDropDownValues = []

    const [formFields, setFormFields] = useState([
        {
            client_class_id: '',
            Section_id: ''
        }
    ]);
    const [classId, setClass] = useState([]);
    const [options, setOptions] = useState([]);
    const [multiOptions, setMultiOptions] = useState([]);
    const [multiDropOptions, setMultiDropOptions] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    console.log("multiDropDownValues", multiDropDownValues);
    const [count, setCount] = useState(0);
    const [validationIndex, setValidationIndex] = useState();


    const handleFormChange = (event, index) => {

        console.log("handleFormChange", event);

        let data = [...formFields];

        if (event.label) {
            if (event.label.length >= 1 && event.label.startsWith("Class")) {

                data[index]["client_class_id"] = event.value;
                console.log(data);
                // setMultiDropOptions({isDisabled: true});

                // data.forEach((item, i) => {
                //     multiDropDownValues.push({ value: data[i].client_class_id, label: item.section_name, isDisables: true })
                // })

                setCount(0);
                setFormFields(data);
            } else {

                console.log(event);
                data[index]['Section_id']=event[0].value;
                console.log(data);
            }
        } else {

            console.log("else", event);
            console.log("index", data.length);

            if (event.length >= 1) {

                data[index]['Section_id']=event[0].value;
                
             
            }

        }

    }

    const addFields = () => {
        let object = {
            client_class_id: '',
            Section_id: ''
        }

        setFormFields([...formFields, object])
    }

    const subscribeClass = (e) => {


        let sendData = {
            school_id: schoolId,
            classList: formFields
        }

        console.log('sendData', sendData);

    }

    const removeFields = (index) => {

        console.log(formFields);
        console.log(index);

        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data);

    }

    useEffect(() => {

        axios
            .post(
                dynamicUrl.fetchClassBasedOnSchool,
                {
                    data: {
                        school_id: schoolId
                    }
                },
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {

                console.log({ response });
                console.log(response.data);
                let resultData = response.data.Items
                resultData.forEach((item, index) => {
                    colourOptions.push({ value: item.client_class_id, label: item.client_class_name })
                })
                setOptions(colourOptions)
            })
            .catch((error) => {
                if (error.response) {
                    hideLoader();

                    console.log(error.response.data);

                } else if (error.request) {
                    console.log(error.request);
                    hideLoader();
                } else {
                    console.log('Error', error.message);
                    hideLoader();
                }
            });

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
            resultData.forEach((item, index) => {
                multiDropDownValues.push({ value: item.section_id, label: item.section_name })
            })
            setMultiDropOptions(multiDropDownValues)
        }

    };


    return (

        <div className="App">

            <>
                {isEmptyObject(formFields) ? <></> : (
                    <>

                        <React.Fragment>

                            <Card>
                                <Card.Body>
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

                                        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
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
                                                                                    removeFields(index)
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
                                                                            <Select
                                                                                className="basic-single"
                                                                                classNamePrefix="select"
                                                                                label="client_class_id"
                                                                                name="client_class_id"
                                                                                options={options}
                                                                                // onChange={(e) => { classOption(e) }}
                                                                                onBlur={handleBlur}
                                                                                onChange={(event) => { handleFormChange(event, index); classOption(event, index) }}
                                                                            />
                                                                            {touched.upschool_class_id && errors.upschool_class_id && (
                                                                                <small className="text-danger form-text">{errors.zupschool_class_id}</small>
                                                                            )}
                                                                        </Col>
                                                                        {multiDropOptions && (
                                                                            <Col>
                                                                                <label className="floating-label">
                                                                                    <small className="text-danger">* </small>
                                                                                    Section
                                                                                </label>

                                                                                {
                                                                                    validationIndex !== index ? <>

                                                                                        <Select
                                                                                            classNamePrefix="select"
                                                                                            className="basic-single"
                                                                                            label="Section_id"
                                                                                            name="Section_id"
                                                                                            options={multiDropOptions}
                                                                                            placeholder="Select"
                                                                                            onBlur={handleBlur}
                                                                                            onChange={(event) => { handleFormChange(event, index) }}
                                                                                            isDisabled={true}

                                                                                        />
                                                                                    </> : <>
                                                                                        <Select
                                                                                            classNamePrefix="select"
                                                                                            label="Section_id"
                                                                                            name="Section_id"
                                                                                            isMulti
                                                                                            options={multiDropOptions}
                                                                                            placeholder="Select"
                                                                                            onBlur={handleBlur}
                                                                                            onChange={(event) => { handleFormChange(event, index) }}

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
                                                        {errorMessage &&
                                                            <div style={{ color: 'red' }} className="error"> {errorMessage} </div>}
                                                    </Col>
                                                    <Col>
                                                        <Button className="btn-block" color="success" size="large" type="submit" variant="success" onClick={subscribeClass} >
                                                            Submit
                                                        </Button>
                                                    </Col>
                                                </Row> </>
                                        )}
                                    </Formik>
                                </Card.Body>
                            </Card>
                        </React.Fragment>
                    </>
                )}
            </>
        </div >
    );

}

export default AllocateSection
