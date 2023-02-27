import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, Col, Form, Row, CloseButton } from 'react-bootstrap';
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
import { fetchAllConcepts, fetchAllTopics } from '../../../api/CommonApi'
import * as Constants from '../../../../helper/constants';
import MESSAGES from '../../../../helper/messages';
import { setDate } from 'date-fns';



const AddUsers = ({ setOpenAddTopic }) => {
    let history = useHistory();
    const MySwal = withReactContent(Swal);




    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const entitieType = [
        { value: 'DigiCard', label: 'DigiCard' },
        { value: 'Assessments', label: 'Assessments' },
        { value: 'Groups', label: 'Groups' },
        { value: 'Worksheet', label: 'Worksheet' },
    ]

    const userRole =
        [
            { entitie: '', creater: 'No', previewer: 'No', publisher: 'No' }
        ]

    const [userRoles, setTopicQuiz] = useState(userRole)
    const [isDate, setDate] = useState()
    const [isRoleRep, setIsRoleRep] = useState(false)
    const [isDateReq, setIsDateReq] = useState(false)


    const addOneRole = () => {
        let object =
        {
            entitie: '',
            creater: 'No',
            previewer: 'No',
            publisher: 'No'
        }

        setTopicQuiz([...userRoles, object])
    }

    const removeRole = (index) => {
        let data = [...userRoles];
        data.splice(index, 1)
        setTopicQuiz(data);
    }

    const getUserRole = (e, type, index) => {

        console.log("event", type);
        console.log("event", index);
        let data = [...userRoles]

        if (type === 'entitie') {
            data[index][type] = e.value;
        } else {
            if (e.target.checked === true) {
                data[index][type] = 'Yes';
            } else {
                data[index][type] = 'No';
            }
        }
    }

    const getdate = (e) => {
        setDate(e.target.value)
    }



    return (
        <React.Fragment>
            <Card>
                <Card.Body>
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: "",
                            userEmail: "",
                            phoneNumber: '',
                            user_dob: "",
                            user_role: [],
                        }}

                        validationSchema={Yup.object().shape({
                            firstName: Yup.string()
                                .trim()
                                .min(2, Constants.cmsRole.FirstNameTooShort)
                                .max(32, Constants.cmsRole.FirstNameTooLong)
                                .required(Constants.cmsRole.FirstName),
                            lastName: Yup.string()
                                .trim()
                                .min(2, Constants.cmsRole.LastNameTooShort)
                                .max(32, Constants.cmsRole.LastNameTooLong)
                                .required(Constants.cmsRole.LastName),
                            userEmail: Yup.string()
                                .trim()
                                .min(2, Constants.cmsRole.userEmailTooShort)
                                .max(255, Constants.cmsRole.userEmailTooLong)
                                .email('Must be a valid email')
                                .required(Constants.cmsRole.userEmail),
                            phoneNumber: Yup.string()
                                .trim()
                                .min(10, Constants.cmsRole.phoneNumTooShort)
                                .max(15, Constants.cmsRole.phoneNumTooLong)
                                .matches(Constants.cmsRole.phoneRegExp, Constants.cmsRole.phoneNumVali)
                                .required(Constants.cmsRole.phoneNum),

                        })}
                        // validationSchema
                        onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {

                            const unique = new Set();
                            const showError = userRoles.some(element => unique.size === unique.add(element.entitie).size);
                            if (showError) {
                                setIsRoleRep(true)
                            } else if (isDate === '' || isDate === undefined) {
                                setIsDateReq(true)
                            } else {
                                var formData = {
                                    first_name: values.firstName,
                                    last_name: values.lastName,
                                    user_email: values.userEmail,
                                    phone_number: values.phoneNumber,
                                    user_dob: isDate,
                                    user_role: userRoles
                                }
                                console.log('formData: ', formData)
                            }

                        }

                        }
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                            <Form onSubmit={handleSubmit} >


                                <Row>
                                    <Col>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="firstName">
                                                <small className="text-danger">* </small>First Name
                                            </label>
                                            <input
                                                className="form-control"
                                                error={touched.firstName && errors.firstName}
                                                name="firstName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="text"
                                                value={values.firstName}
                                            />
                                            {touched.firstName && errors.firstName && <small className="text-danger form-text">{errors.firstName}</small>}
                                        </div>
                                    </Col>

                                    <Col>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="lastName">
                                                <small className="text-danger">* </small>Last Name
                                            </label>
                                            <input
                                                className="form-control"
                                                error={touched.lastName && errors.lastName}
                                                name="lastName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="text"
                                                value={values.lastName}
                                            />
                                            {touched.lastName && errors.lastName && <small className="text-danger form-text">{errors.lastName}</small>}
                                        </div>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="userEmail">
                                                <small className="text-danger">* </small>Email ID
                                            </label>
                                            <input
                                                className="form-control"
                                                error={touched.userEmail && errors.userEmail}
                                                name="userEmail"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="email"
                                                value={values.userEmail}

                                            />
                                            {touched.userEmail && errors.userEmail && <small className="text-danger form-text">{errors.userEmail}</small>}
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="phoneNumber">
                                                <small className="text-danger">* </small>Phone No
                                            </label>
                                            <input
                                                className="form-control"
                                                error={touched.phoneNumber && errors.phoneNumber}
                                                name="phoneNumber"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="number"
                                                value={values.phoneNumber}

                                            />
                                            {touched.phoneNumber && errors.phoneNumber && <small className="text-danger form-text">{errors.phoneNumber}</small>}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>

                                    <Col>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="user_dob">
                                                <small className="text-danger">* </small>DOB
                                            </label>
                                            <input
                                                className="form-control"
                                                error={touched.user_dob && errors.user_dob}
                                                name="user_dob"
                                                onBlur={handleBlur}
                                                onChange={e => {
                                                    getdate(e)
                                                }}
                                                type="date"
                                                value={isDate}

                                            />
                                            {isDateReq && (
                                                <small className="text-danger form-text">DOB is required!</small>
                                            )}

                                        </div>
                                    </Col>

                                    <Col></Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col sm={4}>
                                        <Form.Label className="floating-label" ><small className="text-danger">* </small>Entities</Form.Label>
                                    </Col>
                                    <Col sm={6}>
                                        <div className='d-flex justify-content-between'>
                                            <Form.Label className="floating-label" ><small className="text-danger">* </small>Creater</Form.Label>
                                            <Form.Label className="floating-label" ><small className="text-danger">* </small>Previewer</Form.Label>
                                            <Form.Label className="floating-label" style={{ marginRight: '-15px' }} ><small className="text-danger">* </small>Publisher</Form.Label>
                                        </div>

                                    </Col>
                                    {/* <Col sm={6}>
                                        <Form.Label className="floating-label" ><small className="text-danger">* </small>Topic Quiz Minutes</Form.Label>
                                    </Col> */}
                                </Row>
                                {userRoles.map((topic, index) => (
                                    <Row>
                                        <Col sm={4}>
                                            <div>
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    name="user_role"
                                                    closeMenuOnSelect={false}
                                                    onChange={(e) => { getUserRole(e, 'entitie', index) }}
                                                    options={entitieType}
                                                    placeholder="Select"
                                                    menuPortalTarget={document.body}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                    key={index}
                                                />
                                            </div>

                                        </Col>
                                        <Col sm={6} >
                                            <div className="form-group fill d-flex justify-content-between">
                                                <div>
                                                    <Form.Control
                                                        className="form-control"
                                                        name="topic_title"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => { getUserRole(e, 'creater', index) }}
                                                        type="checkbox"
                                                        value={values.topic_title}
                                                        style={{ width: '25px', marginLeft: '14px' }}
                                                        key={index}
                                                    />
                                                </div>
                                                <div>
                                                    <Form.Control
                                                        className="form-control"
                                                        name="topic_title"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => { getUserRole(e, 'previewer', index) }}
                                                        type="checkbox"
                                                        value={values.topic_title}
                                                        style={{ width: '25px' }}
                                                        key={index}
                                                    />
                                                </div>
                                                <div>
                                                    <Form.Control
                                                        className="form-control"
                                                        name="topic_title"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => { getUserRole(e, 'publisher', index) }}
                                                        type="checkbox"
                                                        value={values.topic_title}
                                                        style={{ width: '25px' }}
                                                        key={index}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={2}>
                                            <CloseButton
                                                onClick={(e) => { removeRole(index) }}
                                                variant="white"
                                                style={{ marginRight: "80px" }}
                                                key={index}
                                            />
                                        </Col>
                                    </Row>
                                ))}
                                <Row>
                                    <Col>
                                        {isRoleRep && (
                                            <small className="text-danger form-text">user role Repeated!</small>
                                        )}
                                        <br />
                                        <button type='button' onClick={addOneRole}>+</button>
                                    </Col>

                                </Row>
                                <p></p>
                                {/* <button type="button" className="btn btn-primary" onClick={addTopic} >Add another Quiz</button> */}
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

            </Card>

        </React.Fragment >
    )
}

export default AddUsers;