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
            { entity: '', roles: [] }
        ]

    const [userRoles, setTopicQuiz] = useState(userRole)
    const [isDate, setDate] = useState()
    const [isRoleRep, setIsRoleRep] = useState(false)
    const [isDateReq, setIsDateReq] = useState(false)
    const [displayHeading, setDisplayHeading] = useState(sessionStorage.getItem('Upusers_type'));
    const [displayHeader, setDisplayHeader] = useState(true);
    const [isSelected, setIsSelected] = useState(false);
    const [isSelectedEntity, setIsSelectedEntity] = useState(false);
    const threadLinks = document.getElementsByClassName('page-header');
    const [loader, showLoader, hideLoader] = useFullPageLoader();





    const addOneRole = () => {
        let object =
        {
            entity: '',
            roles: []
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

        if (type === 'entity') {
            data[index][type] = e.value;
        } else {
            if (e.target.checked === true) {
                data[index]['roles'].push(type)
            } else {
                const i = data[index]['roles'].indexOf(type);
                data[index]['roles'].splice(i, 1);
            }
        }
    }

    const getdate = (e) => {
        setDate(e.target.value)
    }

    const inserUser = (formData) => {
        axios
            .post(dynamicUrl.addCMSUser, { data: formData }, { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
            .then(async (response) => {
                console.log({ response });
                if (response.Error) {
                    console.log('Error');
                    hideLoader();

                } else {
                    hideLoader();
                    MySwal.fire({

                        title: 'User added successfully!',
                        icon: 'success',
                    }).then((willDelete) => {
                        history.push('/admin-portal/active-upSchoolUsers')
                        window.location.reload();

                    })

                }
            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);

                    console.log(error.response.data);
                    if (error.response.status === 401) {
                        console.log();
                        hideLoader();
                        // setIsClientExists(true);
                        sweetAlertHandler({ title: 'Error', type: 'error', text: "User Already Exist" });

                    } else {
                        sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
                    }
                } else if (error.request) {
                    console.log(error.request);
                    hideLoader();
                } else {
                    console.log('Error', error.message);
                    hideLoader();
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

            if (threadLinks.length === 2) {
                setDisplayHeader(false);
            } else {
                setDisplayHeader(true);
            }
        }

    }, [])

    return (
        <React.Fragment>
            {
                displayHeader && (
                    <div className="page-header">
                        <div className="page-block">
                            <div className="row align-items-center">
                                <div className="col-md-12">
                                    <div className="page-header-title">
                                        <h5 className="m-b-10">{displayHeading}</h5>
                                    </div><ul className="breadcrumb  ">
                                        <li className="breadcrumb-item  ">
                                            <a href="/upschool/admin-portal/admin-dashboard">
                                                <i className="feather icon-home">
                                                </i>
                                            </a>
                                        </li>
                                        <li className="breadcrumb-item  ">CMS Users</li>
                                        <li className="breadcrumb-item  ">{displayHeading}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <Card>
                <Card.Body>
                    <Card.Title>
                        Add User
                    </Card.Title>
                    <Formik
                        initialValues={{
                            userName: '',
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
                                .min(1, Constants.cmsRole.FirstNameTooShort)
                                .max(32, Constants.cmsRole.FirstNameTooLong)
                                .required(Constants.cmsRole.FirstName),
                            lastName: Yup.string()
                                .trim()
                                .min(1, Constants.cmsRole.LastNameTooShort)
                                .max(32, Constants.cmsRole.LastNameTooLong)
                                .required(Constants.cmsRole.LastName),
                            userEmail: Yup.string()
                                .trim()
                                .min(2, Constants.cmsRole.userEmailTooShort)
                                .max(255, Constants.cmsRole.userEmailTooLong)
                                .email('Must be a valid email !')
                                .required(Constants.cmsRole.userEmail),
                            phoneNumber: Yup.string()
                                .trim()
                                .min(10, Constants.cmsRole.phoneNumTooShort)
                                .max(15, Constants.cmsRole.phoneNumTooLong)
                                .matches(Constants.cmsRole.phoneRegExp, Constants.cmsRole.phoneNumVali)
                                .required(Constants.cmsRole.phoneNum),
                            userName: Yup.string()
                                .trim()
                                .min(2, Constants.cmsRole.UserNameTooShort)
                                .max(32, Constants.cmsRole.UserNameTooLong)
                                .required(Constants.cmsRole.UserName),

                        })}
                        // validationSchema
                        onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                            console.log("userRoles", userRoles);
                            const unique = new Set();
                            const showError = userRoles.some(element => unique.size === unique.add(element.entity).size);
                            let validateRole = userRoles.find(o => o.entity === '' || o.entity === 0 || o.entity === undefined)
                            var validator = userRoles.filter((e) => (e.roles).length <= 0)
                            console.log("validator : ", validator);


                            if (showError) {
                                setIsRoleRep(true)
                            } else if (isDate === '' || isDate === undefined) {
                                setIsDateReq(true)
                            } else if (validateRole) {
                                setIsSelectedEntity(true)
                            } else if (validator.length > 0) {
                                setIsSelected(true)
                            } else {
                                var formData = {
                                    user_name: values.userName,
                                    first_name: values.firstName,
                                    last_name: values.lastName,
                                    user_email: values.userEmail,
                                    user_phone_no: `${values.phoneNumber}`,
                                    user_dob: isDate,
                                    user_role: userRoles
                                }
                                console.log('formData: ', formData)
                                inserUser(formData)
                            }

                        }

                        }
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                            <Form onSubmit={handleSubmit} >


                                <Row>
                                    <Col>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="userName">
                                                <small className="text-danger">* </small>User Name
                                            </label>
                                            <input
                                                className="form-control"
                                                error={touched.userName && errors.userName}
                                                name="userName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="text"
                                                value={values.userName}
                                            />
                                            {touched.userName && errors.userName && <small className="text-danger form-text">{errors.userName}</small>}
                                        </div>
                                    </Col>

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
                                </Row>
                                <Row>
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
                                </Row>
                                <Row>
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
                                                    setIsDateReq(false)
                                                }}
                                                type="date"
                                                value={isDate}

                                            />
                                            {isDateReq && (
                                                <small className="text-danger form-text">DOB is required!</small>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                                <br />
                                <Form.Label className="floating-label" ><small className="text-danger">* </small>CMS Role Allocation</Form.Label>
                                <hr />
                                <br />
                                <Row>
                                    <Col sm={4}>
                                        <Form.Label className="floating-label" ><small className="text-danger">* </small>Entities</Form.Label>
                                    </Col>
                                    <Col sm={6}>
                                        <div className='d-flex justify-content-between'>
                                            <Form.Label className="floating-label" ><small className="text-danger">* </small>Creator</Form.Label>
                                            <Form.Label className="floating-label" ><small className="text-danger">* </small>Reviewer</Form.Label>
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
                                                    name="entity"
                                                    closeMenuOnSelect={false}
                                                    onChange={(e) => {
                                                        getUserRole(e, 'entity', index);
                                                        setIsRoleRep(false);
                                                        setIsSelectedEntity(false)
                                                    }}
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
                                                        name="creator"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            getUserRole(e, 'creator', index);
                                                            setIsSelected(false);
                                                        }}
                                                        type="checkbox"
                                                        value={values.creator}
                                                        style={{ width: '25px', marginLeft: '14px' }}
                                                        key={index}
                                                    />
                                                </div>
                                                <div>
                                                    <Form.Control
                                                        className="form-control"
                                                        name="reviewer"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            getUserRole(e, 'reviewer', index);
                                                            setIsSelected(false);
                                                        }}
                                                        type="checkbox"
                                                        value={values.reviewer}
                                                        style={{ width: '25px' }}
                                                        key={index}
                                                    // defaultChecked={true}
                                                    />
                                                </div>
                                                <div>
                                                    <Form.Control
                                                        className="form-control"
                                                        name="publisher"
                                                        onBlur={handleBlur}
                                                        onChange={(e) => {
                                                            getUserRole(e, 'publisher', index);
                                                            setIsSelected(false);
                                                        }}
                                                        type="checkbox"
                                                        value={values.publisher}
                                                        style={{ width: '25px' }}
                                                        key={index}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm={2}>
                                            {/* <CloseButton
                                                onClick={(e) => { removeRole(index) }}
                                                variant="white"
                                                style={{ marginRight: "80px" }}
                                                key={index}
                                            /> */}
                                            <Button className="btn btn-icon btn-rounded btn-danger"
                                                onClick={(e) => { removeRole(index) }}
                                                style={{ marginLeft: "40px", paddingTop: '2px', paddingBottom: '2px', marginTop: '4px' }}
                                            >
                                                <i className='feather icon-trash-2'></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Row>
                                    <Col>
                                        {isRoleRep && (
                                            <small className="text-danger form-text">Entity Repeated!</small>
                                        )}
                                        {isSelected && (
                                            <small className="text-danger form-text">Role Not selected!</small>
                                        )}
                                        {isSelectedEntity && (
                                            <small className="text-danger form-text">Entity Not selected!</small>
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