import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';

import dynamicUrl from '../../../../helper/dynamicUrls';
import BasicSpinner from '../../../../helper/BasicSpinner';
import { SessionStorage } from '../../../../util/SessionStorage';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import MESSAGES from '../../../../helper/messages';
import { fetchSectionByClientClassId } from "../../../api/CommonApi";

const EditUsersGeneralStudent = ({ user_id, user_role }) => {

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [schoolId, setSchoolId] = useState();
    const [className_ID, setClassName_ID] = useState({});
    const [sectionId, setSectionId] = useState();
    const [defaultClass, setDefaultClass] = useState([]);
    const [defaultSection, setDefaultSection] = useState([]);
    const [options, setOptions] = useState([]);
    const [schoolName_ID, setSchoolName_ID] = useState({});
    const [previousSchool, setPreviousSchool] = useState('');
    const [previousClass, setPreviousClass] = useState('');
    const [individualUserData, setIndividualUserData] = useState([]);
    const [_userID, _setUserID] = useState('');
    const [multiDropOptions, setMultiDropOptions] = useState([]);
    const [selectDOBErr, setSelectDOBErr] = useState(false);

    const [userDOB, setUserDOB] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const classNameRef = useRef('');
    const schoolNameRef = useRef('');
    const [selectClassErr, setSelectClassErr] = useState(false);
    const [selectSectionErr, setSelectSectionErr] = useState(false);

    const colourOptions = [];
    const multiDropDownValues = [];

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const phoneRegExp = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;

    const _UpdateUser = (data) => {
        console.log(data);
        console.log('Submitted');

        axios
            .post(dynamicUrl.updateUsersByRole, { data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
            .then(async (response) => {

                console.log({ response });
                if (response.Error) {
                    hideLoader();
                    sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.UpdatingUser });
                    history.push('/admin-portal/active-users');
                } else {
                    hideLoader();
                    sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.UpdatingUser });
                    history.push('/admin-portal/active-users');
                }
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

                        sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
                        history.push('/admin-portal/active-users');
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
    };

    const handleSchoolChange = () => {

        const filteredResult = schoolName_ID.find((e) => e.school_name == schoolNameRef.current.value);

        console.log(filteredResult.school_id);
        console.log(filteredResult.school_name);

        let sendData = {
            data: {
                school_id: filteredResult.school_id
            }
        }

        console.log(sendData);

        axios
            .post(
                dynamicUrl.fetchClassBasedOnSchool,
                {
                    data: {
                        school_id: filteredResult.school_id
                    }
                },
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {

                console.log(response.status === 200);
                let result = response.status === 200;

                hideLoader();
                if (result) {

                    console.log('inside res', response.data);
                    // let newClassData = response.data.Items;
                    // setClassName_ID(newClassData);

                } else {
                    console.log('else res');
                    hideLoader();

                }
            })
            .catch((error) => {
                if (error.response) {
                    hideLoader();
                    // Request made and server responded
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
                    console.log(error.request);
                    hideLoader();

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    hideLoader();

                }
            });

    }

    const GetSectionId = (event) => {
        console.log("event", event.target.value);
        setSectionId(event.target.value)
    }

    useEffect(() => {
        const validateJWT = sessionStorage.getItem('user_jwt');

        if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

        }
        else {

            setIsLoading(true);

            const values = {
                user_id: user_id,
                user_role: user_role
            };

            console.log(values);

            axios
                .post(
                    dynamicUrl.fetchIndividualUserByRole,
                    { data: values },
                    {
                        headers: { Authorization: SessionStorage.getItem('user_jwt') }
                    }
                )
                .then((response) => {

                    console.log(response.data);
                    console.log(response.data.Items[0]);

                    if (response.data.Items[0]) {

                        let individual_user_data = response.data.Items[0];
                        console.log({ individual_user_data });
                        setSchoolId(response.data.Items[0].school_id)
                        setSectionId(response.data.Items[0].section_id)
                        setClassName_ID(response.data.Items[0].class_id)
                        let classNameArr = response.data.classList.find(o => o.client_class_id === response.data.Items[0].class_id);
                        let sectionArr = response.data.sectionList.find(o => o.section_id === response.data.Items[0].section_id);
                        let schoolNameArr = response.data.schoolList.find(o => o.school_id === response.data.Items[0].school_id);

                        console.log(classNameArr);
                        console.log(schoolNameArr);

                        setDefaultClass({ value: classNameArr.client_class_id, label: classNameArr.client_class_name })
                        setDefaultSection({ value: sectionArr.section_id, label: sectionArr.section_name })

                        console.log("response.data.classList", response.data.classList.length);
                        if (colourOptions.length <= 0) {
                            response.data.classList.forEach((item, index) => {
                                colourOptions.push({ value: item.client_class_id, label: item.client_class_name })
                            })
                            setOptions(colourOptions)
                        }
                        setSchoolName_ID(response.data.schoolList);
                        // setPreviousSchool(schoolNameArr.school_name);
                        schoolNameArr === "" || schoolNameArr === undefined || schoolNameArr === "undefined" || schoolNameArr === "N.A." ? setPreviousSchool("Select School") : setPreviousSchool(schoolNameArr.school_name);
                        classNameArr === "" || classNameArr === undefined || classNameArr === "undefined" || classNameArr === "N.A." ? setPreviousClass("Select Class") : setPreviousClass(classNameArr.client_class_name);
                        setUserDOB(response.data.Items[0].user_dob);
                        setIndividualUserData(individual_user_data);
                        setIsLoading(false);
                        _setUserID(user_id);

                        response.data.sectionList.forEach((item, index) => {
                            multiDropDownValues.push({ value: item.section_id, label: item.section_name })
                        })
                        setMultiDropOptions(multiDropDownValues)

                    } else {

                        setIsLoading(false);
                    }

                })
                .catch((error) => {
                    if (error.response) {
                        // Request made and server responded
                        console.log(error.response.data);
                        setIsLoading(false);

                        if (error.response.data === 'Invalid Token') {

                            sessionStorage.clear();
                            localStorage.clear();

                            history.push('/auth/signin-1');
                            window.location.reload();

                        } else {

                            sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });

                        }

                    } else if (error.request) {
                        // The request was made but no response was received
                        setIsLoading(false);
                        console.log(error.request);

                    } else {
                        // Something happened in setting up the request that triggered an Error
                        setIsLoading(false);
                        console.log('Error', error.message);

                    }
                });

        }

    }, []);

    const classOption = async (e) => {
        // setDefaultSection({ value: '', label: 'Select Section' })
        setSectionId('');
        console.log("class Option", e);
        setClassName_ID(e.value)
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
        
        <React.Fragment>

            <div>

                {isLoading ? (
                    <BasicSpinner />
                ) : (
                    <>
                        {individualUserData.length === 0 || individualUserData.length === "0" || previousSchool.length === 0 ? <></> : (
                            <>

                                <Card>
                                    <Card.Body>
                                        <Card.Title>Update User</Card.Title>

                                        <Formik
                                            initialValues={{
                                                firstName: individualUserData.user_firstname,
                                                lastName: individualUserData.user_lastname,
                                                userEmail: individualUserData.user_email,
                                                phoneNumber: individualUserData.user_phone_no,
                                                userRole: individualUserData.user_role,
                                                user_dob: userDOB.yyyy_mm_dd,
                                                class: individualUserData.class_id,
                                                section: individualUserData.section_id,
                                                school: individualUserData.school_id

                                                //individualUserData.user_dob.yyyy_mm_dd

                                            }}
                                            validationSchema={
                                                Yup.object().shape({
                                                    firstName: Yup.string().max(255).required('First Name is required'),
                                                    lastName: Yup.string().max(255).required('Last Name is required'),
                                                    userEmail: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                                                    phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').max(255).required('Phone Number is required'),
                                                    userRole: Yup.string().max(255).required('User Role is required'),
                                                    class: Yup.string().max(255).required('Class is required'),
                                                    section: Yup.string().max(255).required('Section is required'),
                                                    school: Yup.string().max(255).required('School is required')
                                                })
                                            }
                                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                                console.log("Submit")
                                                setStatus({ success: true });
                                                setSubmitting(true);

                                                let data;

                                                const selectedSchoolID = schoolName_ID.find((e) => e.school_name == schoolNameRef.current.value);

                                                console.log(selectedSchoolID);
                                                console.log(classNameRef.current.value);

                                                if (className_ID === undefined || className_ID === '') {
                                                    setSelectClassErr(true)
                                                } else if (sectionId === undefined || sectionId === '' || sectionId == 'Select Section') {
                                                    setSelectSectionErr(true)
                                                } else if (values.user_dob === "") {
                                                    setSelectDOBErr(true);
                                                } else {
                                                    data = {

                                                        student_id: _userID,
                                                        class_id: className_ID,
                                                        school_id: selectedSchoolID.school_id,
                                                        section_id: sectionId,
                                                        user_dob: values.user_dob,
                                                        user_firstname: values.firstName,
                                                        user_lastname: values.lastName,
                                                        user_email: values.userEmail,
                                                        user_phone_no: values.phoneNumber,
                                                        user_role: values.userRole

                                                    };

                                                    console.log(data);
                                                    showLoader();
                                                    _UpdateUser(data);
                                                }
                                            }

                                            }
                                        // }
                                        >
                                            {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                                                <form noValidate onSubmit={handleSubmit}>
                                                    <Row>
                                                        <Col>
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
                                                                        <label className="floating-label" htmlFor="class">
                                                                            <small className="text-danger">* </small>School
                                                                        </label>
                                                                        {console.log(previousSchool)}
                                                                        <select
                                                                            className="form-control"
                                                                            error={touched.school && errors.school}
                                                                            name="school"
                                                                            onBlur={handleBlur}
                                                                            // onChange={handleChange}
                                                                            onChange={handleSchoolChange}
                                                                            type="text"
                                                                            ref={schoolNameRef}
                                                                            // value={values.school}
                                                                            defaultValue={previousSchool}
                                                                            disabled={true}
                                                                        >

                                                                            <option>Select School</option>

                                                                            {schoolName_ID.map((schoolData) => {

                                                                                return <option key={schoolData.school_id}>
                                                                                    {schoolData.school_name}
                                                                                </option>

                                                                            })}

                                                                        </select>
                                                                        {touched.school && errors.school && (
                                                                            <small className="text-danger form-text">{errors.school}</small>
                                                                        )}
                                                                    </div>
                                                                </Col>


                                                                <Col>
                                                                    <div className="form-group fill">
                                                                        <label className="floating-label" htmlFor="userRole">
                                                                            <small className="text-danger">* </small>Role
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.userRole && errors.userRole}
                                                                            name="userRole"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            type="text"
                                                                            value={values.userRole}
                                                                            readOnly={true}
                                                                        />


                                                                    </div>
                                                                </Col>

                                                            </Row>

                                                            {individualUserData.class_id && individualUserData.section_id ? (
                                                                <>
                                                                    <Row>

                                                                        <Col>

                                                                            <div className="form-group fill">
                                                                                <label className="floating-label" htmlFor="class">
                                                                                    <small className="text-danger">* </small>Class
                                                                                </label>
                                                                                <Select
                                                                                    defaultValue={defaultClass}
                                                                                    className="basic-single"
                                                                                    classNamePrefix="select"
                                                                                    label="client_class_id"
                                                                                    name="client_class_id"
                                                                                    options={options}
                                                                                    onBlur={(event) => { handleBlur(event) }}
                                                                                    onChange={(event) => {
                                                                                        setFieldValue('section_id', '')
                                                                                        classOption(event)

                                                                                    }}
                                                                                />
                                                                                {touched.class && errors.class && (
                                                                                    <small className="text-danger form-text">{errors.class}</small>
                                                                                )}
                                                                                {selectClassErr && (

                                                                                    <small className="text-danger form-text">Please select a class</small>

                                                                                )}
                                                                            </div>
                                                                        </Col>

                                                                        <Col>
                                                                            <div className="form-group fill">
                                                                                <label className="floating-label" htmlFor="section">
                                                                                    <small className="text-danger">* </small>Section
                                                                                </label>

                                                                                <select
                                                                                    className="form-control"
                                                                                    error={touched.section_id && errors.section_id}
                                                                                    name="section_id"
                                                                                    onBlur={handleBlur}
                                                                                    type="text"
                                                                                    value={sectionId}
                                                                                    onChange={(event) => {
                                                                                        GetSectionId(event);
                                                                                        setSelectSectionErr(false)
                                                                                    }}
                                                                                >
                                                                                    <option>
                                                                                        Select Section
                                                                                    </option>

                                                                                    {multiDropOptions.map((optionsData) => {
                                                                                        return <option
                                                                                            value={optionsData.value}
                                                                                            key={optionsData.value}
                                                                                        >                                                        {optionsData.label}
                                                                                        </option>
                                                                                    })}
                                                                                </select>
                                                                                {selectSectionErr && (

                                                                                    <small className="text-danger form-text">Please select a Section</small>

                                                                                )}
                                                                                {touched.section && errors.section && <small className="text-danger form-text">{errors.section}</small>}
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
                                                                                    readOnly={true}
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
                                                                                    readOnly={true}
                                                                                />
                                                                                {touched.phoneNumber && errors.phoneNumber && <small className="text-danger form-text">{errors.phoneNumber}</small>}
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </>

                                                            ) : (
                                                                <>
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
                                                                </>
                                                            )}



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
                                                                                setSelectDOBErr(false)
                                                                                handleChange(e)

                                                                            }}
                                                                            type="date"
                                                                            value={values.user_dob}

                                                                        />
                                                                        {touched.user_dob && errors.user_dob && <small className="text-danger form-text">{errors.user_dob}</small>}

                                                                        {selectDOBErr && (

                                                                            <small className="text-danger form-text">DOB required</small>

                                                                        )}
                                                                    </div>
                                                                </Col>

                                                                <Col></Col>
                                                            </Row>

                                                            {errors.submit && (
                                                                <Col sm={12}>
                                                                    <Alert variant="danger">{errors.submit}</Alert>
                                                                </Col>
                                                            )}


                                                            <hr />

                                                            <Row>

                                                                <Col></Col>

                                                                <Button type="submit" color="success" variant="success">
                                                                    Update
                                                                </Button>


                                                            </Row>


                                                        </Col>
                                                    </Row>
                                                </form>
                                            )}
                                        </Formik>
                                    </Card.Body>
                                </Card>
                            </>
                        )}
                    </>
                )}
            </div>
        </React.Fragment>
    )
}
export default EditUsersGeneralStudent