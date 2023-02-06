import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Pagination, Button, Modal, ModalBody, Form, Alert, CloseButton } from 'react-bootstrap';
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
import { isEmptyArray } from '../../../../util/utils';
import Select from 'react-select';

const SubscribeClass = ({ className, rest, id, setIsOpenSubscribeClass }) => {

    const [errorMessage, setErrorMessage] = React.useState("");
    const [formFields, setFormFields] = useState([
        {
            client_class_name: '',
            upschool_class_id: ''
        }
    ]);

    const classNamesOptions = [];

    const [previousData, setPreviousData] = useState({
        "upschoolClassItems": [],
        "ClientClassItems": []
    });

    const [dropDownValues, setdropDownValues] = useState([]);

    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const classNameRef = useRef('');

    const handleFormChange = (event, index) => {

        console.log(event);

        let data = [...formFields];
        data[index][event.target.name] = event.target.value;
        setFormFields(data);
        setErrorMessage();

    }

    const addFields = () => {
        let object = {
            client_class_name: '',
            upschool_class_id: ''
        }

        setFormFields([...formFields, object])
    }

    const subscribeClass = (e) => {
        e.preventDefault();
        console.log(formFields);
        showLoader();

        let sendData = {
            school_id: id,
            classList: formFields
        }

        console.log(sendData);

        let emptyFieldValidation = formFields.find(o => o.client_class_name === "" || o.upschool_class_id === "" || o.upschool_class_id === "Select Class")

        console.log(emptyFieldValidation);

        if (emptyFieldValidation) {

            setErrorMessage("Fields can't be empty!");

        } else {

            axios
                .post(
                    dynamicUrl.classSubscribe,
                    {
                        data: {
                            school_id: id,
                            classList: formFields,
                        }
                    },
                    {
                        headers: { Authorization: sessionStorage.getItem('user_jwt') }
                    }
                )
                .then((response) => {
                    console.log({ response });
                    console.log(response.status);
                    console.log(response.status === 200);
                    let result = response.status === 200;
                    hideLoader();

                    if (result) {
                        console.log('inside res');

                        // setIsOpenSubscribeClass(false);
                        const MySwal = withReactContent(Swal);
                        MySwal.fire('', 'School subscrption successful!', 'success');

                    } else {
                        console.log('else res');
                        hideLoader();
                        // Request made and server responded
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        hideLoader();
                        // Request made and server responded
                        console.log(error.response.data);

                        let displayErrorMessage = error.response.data;

                        let matchID = error.response.data.split(':')[1].trim();
                        console.log(matchID);

                        displayErrorMessage = displayErrorMessage.startsWith("REPEATED") ? error.response.data : (
                            "MULTIPLE SUBSCRIPTION FOR : " +
                            previousData.upschoolClassItems.find(o => o.class_id === matchID).class_name

                        )

                        setErrorMessage(displayErrorMessage);

                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log(error.request);
                        hideLoader();
                        setErrorMessage(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                        hideLoader();
                        setErrorMessage(error.message);
                    }
                });
        }

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
                dynamicUrl.fetchUpschoolAndClientClasses,
                {
                    data: {
                        school_id: id
                    }
                },
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {

                console.log({ response });
                console.log(response.status);
                console.log(response.data);

                console.log(response.status === 200);
                let result = response.status === 200;

                if (result) {
                    console.log('inside res');

                    let responseData = response.data;

                    let uploadParams = response.data.ClientClassItems;

                    let object;
                    let tempArray = [];

                    if (Array.isArray(uploadParams)) {
                        for (let index = 0; index < uploadParams.length; index++) {

                            object = {
                                client_class_name: uploadParams[index].client_class_name,
                                upschool_class_id: uploadParams[index].upschool_class_id
                            }

                            tempArray.push(object);

                        }
                    }

                    isEmptyArray(tempArray) ? (

                        tempArray.push(object = {
                            client_class_name: "",
                            upschool_class_id: ""
                        })

                    ) : (console.log(""))

                    console.log("tempArray", tempArray);
                    setdropDownValues(responseData.upschoolClassItems);
                    setFormFields(tempArray);
                    setPreviousData(responseData);



                } else {

                    console.log('else res');
                    hideLoader();
                    // Request made and server responded
                    // setStatus({ success: false });
                    // setErrors({ submit: 'Error in generating OTP' });
                }
            })
            .catch((error) => {
                if (error.response) {
                    hideLoader();
                    // Request made and server responded
                    console.log(error.response.data);
                    // setStatus({ success: false });
                    // setErrors({ submit: error.response.data });
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                    hideLoader();
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    hideLoader();
                }
            });

    }, [])



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
                                            upschool_class_id: '',
                                            client_class_name: '',
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
                                                <form noValidate onSubmit={handleSubmit} className={className} {...rest}>

                                                    {
                                                        formFields.map((form, index) => {

                                                            return (

                                                                <>
                                                                    < br />

                                                                    {console.log(formFields)}
                                                                    {console.log(form)}
                                                                    {console.log(form.client_class_name)}
                                                                    {console.log(form.upschool_class_id)}


                                                                    {(form.client_class_name === "" || form.upschool_class_id === "") &&
                                                                        (
                                                                            <Row>
                                                                                <Col></Col>
                                                                                <Col>
                                                                                    <CloseButton onClick={() => {
                                                                                        setErrorMessage()
                                                                                        removeFields(index)
                                                                                    }} variant="white" />
                                                                                </Col>
                                                                            </Row>
                                                                        )}

                                                                    <Row key={index}>

                                                                        <Col>
                                                                            <label className="floating-label">
                                                                                <small className="text-danger">* </small>
                                                                                Class to be mapped with UpSchool
                                                                            </label>
                                                                            <input
                                                                                className="form-control"
                                                                                error={touched.client_class_name && errors.client_class_name}
                                                                                label="client_class_name"
                                                                                name="client_class_name"
                                                                                onBlur={handleBlur}
                                                                                // onChange={handleChange}
                                                                                type="client_class_name"
                                                                                value={form.client_class_name}
                                                                                onChange={event => handleFormChange(event, index)}
                                                                                placeholder="Enter Class Name"
                                                                            />


                                                                        </Col>



                                                                        {previousData.upschoolClassItems && previousData.ClientClassItems && dropDownValues && (
                                                                            <Col>

                                                                                <label className="floating-label">
                                                                                    <small className="text-danger">* </small>
                                                                                    UpSchool Class
                                                                                </label>
                                                                                <select
                                                                                    className="form-control"
                                                                                    error={touched.upschool_class_id && errors.upschool_class_id}
                                                                                    name="upschool_class_id"
                                                                                    onBlur={handleBlur}

                                                                                    type="text"
                                                                                    ref={classNameRef}
                                                                                    value={form.upschool_class_id}
                                                                                    key={index}
                                                                                    onChange={event => handleFormChange(event, index)}
                                                                                >

                                                                                    <option>
                                                                                        Select Class
                                                                                    </option>

                                                                                    {console.log(dropDownValues)}

                                                                                    {dropDownValues.map((classData) => {

                                                                                        return <option
                                                                                            value={classData.class_id}
                                                                                            key={classData.class_id}
                                                                                        >
                                                                                            {classData.class_name}
                                                                                        </option>

                                                                                    })}

                                                                                </select>



                                                                                {touched.upschool_class_id && errors.upschool_class_id && (
                                                                                    <small className="text-danger form-text">{errors.upschool_class_id}</small>
                                                                                )}
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
                                                        <Button
                                                            onClick={(event) => {
                                                                subscribeClass(event);
                                                            }}
                                                            className="btn-block"
                                                            color="success"
                                                            size="large"
                                                            type="submit"
                                                            variant="success">
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

export default SubscribeClass