import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card, } from 'react-bootstrap';
import Select from 'react-draggable-multi-select';
import Swal from 'sweetalert2';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useHistory, useParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';

import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { isEmptyArray } from '../../../../util/utils';
import BasicSpinner from '../../../../helper/BasicSpinner';

const EditGroups = ({ className, ...rest }) => {

    const history = useHistory();
    const group_id = useParams();

    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [displayHeader, setDisplayHeader] = useState(true);
    const [displayHeading, setDisplayHeading] = useState(sessionStorage.getItem('group_status'));
    const threadLinks = document.getElementsByClassName('page-header');
    const [isLoading, setIsLoading] = useState(false);

    const [groupTypeOptions, setGroupTypeOptions] = useState([
        { value: 'Basic', label: 'Basic' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Advanced', label: 'Advanced' }
    ]);
    const [levelsDropdown, setLevelsDropdown] = useState([
        { value: 'Level_1', label: 'Level-1' },
        { value: 'Level_2', label: 'Level-2' },
        { value: 'Level_3', label: 'Level-3' }
    ]);

    const [digicardsDropdown, setDigicardsDropdown] = useState([]);
    const [questionsDropdown, setQuestionsDropdown] = useState([]);

    const [groupNameExistsErrMsg, setGroupNameExistsErrMsg] = useState(false);
    const [groupTypeErrMsg, setGroupTypeErrMsg] = useState(false);
    const [levelsErrMsg, setLevelsErrMsg] = useState(false);

    const [selectedGroupType, setSelectedGroupType] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [selectedDigicards, setSelectedDigicards] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);

    const [previousGroupData, setPreviousGroupData] = useState([]);
    const [previousGroupType, setPreviousGroupType] = useState([]);
    const [previousQuestions, setPreviousQuestions] = useState([]);
    const [previousDigicards, setPreviousDigicards] = useState([]);
    const [previousLevels, setPreviousLevels] = useState([]);

    const handleGroupTypeChange = (event) => {

        setGroupTypeErrMsg(false);
        console.log(event.value);
        setSelectedGroupType(event.value);
    }

    const handleQuestionsChange = (event) => {

        console.log(event);

        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        console.log(valuesArr);
        setSelectedQuestions(valuesArr);
    }

    const handleDigicardsChange = (event) => {

        console.log(event);

        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        console.log(valuesArr);
        setSelectedDigicards(valuesArr);
    }

    const handleLevelsChange = (event) => {

        setLevelsErrMsg(false);
        console.log(event);

        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        console.log(valuesArr);
        setSelectedLevels(valuesArr);
    }

    const fetchQuestions = () => {

        axios
            .post(
                dynamicUrl.fetchAllQuestionsData,
                {
                    data: {
                        question_status: "Publish",
                        question_active_status: "Active"
                    }
                },
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {

                console.log(response.status === 200);
                let result = response.status === 200;

                if (result) {

                    console.log('inside res');

                    let resultDataAllQuestions = response.data.Items;
                    console.log("resultDataAllQuestions", resultDataAllQuestions);

                    let questionsArr = [];
                    let getQuestionsArr;

                    if (Array.isArray(resultDataAllQuestions)) {
                        for (let index = 0; index < resultDataAllQuestions.length; index++) {

                            getQuestionsArr = [{ label: resultDataAllQuestions[index].question_label, value: resultDataAllQuestions[index].question_id }];

                            questionsArr.push(getQuestionsArr[0]);
                            console.log(questionsArr);

                        }
                    }

                    setQuestionsDropdown(questionsArr);


                    axios
                        .post(
                            dynamicUrl.fetchDigicardIdAndName,
                            {},
                            {
                                headers: { Authorization: sessionStorage.getItem('user_jwt') }
                            }
                        )
                        .then((response) => {

                            console.log(response.status === 200);
                            let result = response.status === 200;

                            if (result) {

                                console.log('inside res');

                                let resultDataAllDigicards = response.data.Items;
                                console.log("resultDataAllDigicards", resultDataAllDigicards);

                                let digicardsArr = [];
                                let getQuestionsArr;

                                if (Array.isArray(resultDataAllDigicards)) {
                                    for (let index = 0; index < resultDataAllDigicards.length; index++) {

                                        getQuestionsArr = [{ value: resultDataAllDigicards[index].digi_card_id, label: resultDataAllDigicards[index].digi_card_title }];

                                        digicardsArr.push(getQuestionsArr[0]);

                                    }
                                }

                                console.log(digicardsArr);
                                setDigicardsDropdown(digicardsArr);


                                axios
                                    .post(
                                        dynamicUrl.fetchIndividualGroupData,
                                        {
                                            data: group_id

                                        },
                                        {
                                            headers: { Authorization: sessionStorage.getItem('user_jwt') }
                                        }
                                    )
                                    .then((response) => {

                                        console.log(response.status === 200);
                                        let result = response.status === 200;

                                        if (result) {

                                            console.log('inside res');

                                            let resultDataIndGroup = response.data.Items[0];
                                            console.log("resultDataIndGroup", resultDataIndGroup);

                                            setIsLoading(false);

                                            setPreviousGroupType({ value: resultDataIndGroup.group_type, label: resultDataIndGroup.group_type });
                                            setSelectedGroupType(resultDataIndGroup.group_type);

                                            let questionData = resultDataIndGroup.group_question_id;
                                            let questionsArr = [];
                                            let getQuestionsArr, getDataQuestionsSec;

                                            if (Array.isArray(questionData)) {
                                                for (let index = 0; index < questionData.length; index++) {

                                                    getDataQuestionsSec = resultDataAllQuestions.filter(p => p.question_id === questionData[index]);
                                                    getQuestionsArr = [{ label: getDataQuestionsSec[0].question_label, value: questionData[index] }];
                                                    questionsArr.push(getQuestionsArr[0]);

                                                }
                                            }

                                            setPreviousQuestions(questionsArr);
                                            setSelectedQuestions(resultDataIndGroup.group_question_id);

                                            let digicardData = resultDataIndGroup.group_related_digicard;
                                            let digicardsArr = [];
                                            let getDigicardsArr, getDataDigicardsSec;

                                            if (Array.isArray(digicardData)) {
                                                for (let index = 0; index < digicardData.length; index++) {

                                                    getDataDigicardsSec = resultDataAllDigicards.filter(p => p.digi_card_id === digicardData[index]);
                                                    getDigicardsArr = [{ label: getDataDigicardsSec[0].digi_card_title, value: digicardData[index] }];
                                                    digicardsArr.push(getDigicardsArr[0]);

                                                }
                                            }

                                            setPreviousDigicards(digicardsArr);
                                            setSelectedDigicards(resultDataIndGroup.group_related_digicard);

                                            let levelsData = resultDataIndGroup.group_levels;
                                            let levelsArr = [];
                                            let getLevelsArr, getDataLevelsSec;

                                            if (Array.isArray(levelsData)) {
                                                for (let index = 0; index < levelsData.length; index++) {

                                                    getDataLevelsSec = levelsDropdown.filter(p => p.value === levelsData[index]);
                                                    getLevelsArr = [{ label: getDataLevelsSec[0].label, value: levelsData[index] }];
                                                    console.log(getLevelsArr);
                                                    levelsArr.push(getLevelsArr[0]);

                                                }
                                            }

                                            setPreviousLevels(levelsArr);
                                            setSelectedLevels(resultDataIndGroup.group_levels);

                                            setPreviousGroupData(resultDataIndGroup);


                                        } else {

                                            console.log('else res');
                                            hideLoader();

                                        }
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


                            } else {

                                console.log('else res');
                                hideLoader();

                            }
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


                } else {

                    console.log('else res');
                    hideLoader();

                }
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

    }

    useEffect(() => {

        const validateJWT = sessionStorage.getItem('user_jwt');

        if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

        } else {

            threadLinks.length === 2 ? setDisplayHeader(false) : setDisplayHeader(true);

            setIsLoading(true);
            fetchQuestions();

        }

    }, []);

    return (

        <>
            <React.Fragment>
                <div>
                    {isLoading ? (
                        <BasicSpinner />
                    ) : (
                        <>
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
                                                        <li className="breadcrumb-item  ">Groups</li>
                                                        <li className="breadcrumb-item  ">{displayHeading}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                previousGroupData.length === 0 || previousGroupType.length === 0 ? <></> : (

                                    <Card>

                                        <Card.Body>

                                            {
                                                console.log(previousGroupType)
                                            }
                                            <Formik

                                                initialValues={{
                                                    group_name: previousGroupData === {} ? '' : previousGroupData.group_name
                                                }}

                                                validationSchema={
                                                    Yup.object().shape({
                                                        group_name: Yup.string()
                                                            .trim()
                                                            .min(2, 'Group Name is too short!')
                                                            .max(51, 'Group Name is too long!')
                                                            .required('Group Name is required!'),
                                                    })}

                                                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                                    console.log(values);
                                                    setStatus({ success: true });
                                                    setSubmitting(true);

                                                    console.log('Data inserted!', values.group_name);

                                                    if (isEmptyArray(selectedGroupType)) {

                                                        setGroupTypeErrMsg(true);

                                                    } else if (isEmptyArray(selectedLevels)) {

                                                        setLevelsErrMsg(true);

                                                    } else {

                                                        let payLoad = {

                                                            group_id: group_id.group_id,
                                                            group_name: values.group_name,
                                                            group_type: selectedGroupType,
                                                            group_question_id: selectedQuestions,
                                                            group_levels: selectedLevels,
                                                            group_related_digicard: selectedDigicards,
                                                            group_description:''
                                                        }

                                                        console.log("payLoad", payLoad);

                                                        showLoader();
                                                        axios
                                                            .post(
                                                                dynamicUrl.editGroup,
                                                                {
                                                                    data: payLoad
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
                                                                    hideLoader();

                                                                    const MySwal = withReactContent(Swal);

                                                                    MySwal.fire({

                                                                        title: 'Group updated!',
                                                                        icon: 'success',
                                                                    }).then((willDelete) => {

                                                                        history.push('/admin-portal/active-groups');
                                                                    });

                                                                } else {

                                                                    console.log('else res');
                                                                    hideLoader();

                                                                }
                                                            })
                                                            .catch((error) => {
                                                                if (error.response) {
                                                                    hideLoader();

                                                                    console.log(error.response.data);

                                                                    if (error.response.data === 'Group Name Already Exist!') {
                                                                        setGroupNameExistsErrMsg(true);
                                                                    } else {
                                                                        const MySwal = withReactContent(Swal);

                                                                        MySwal.fire({

                                                                            title: error.response.data,
                                                                            icon: 'error',
                                                                        }).then((willDelete) => {

                                                                            history.push('/admin-portal/active-groups');
                                                                        });
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
                                                }}


                                            >
                                                {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                                                    <form noValidate onSubmit={handleSubmit} className={className} {...rest}>

                                                        <Row>
                                                            <Col xs={6}>

                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>
                                                                    Group Name
                                                                </label>

                                                                <input
                                                                    value={values.group_name}
                                                                    className="form-control"
                                                                    error={touched.group_name && errors.group_name}
                                                                    label="group_name"
                                                                    name="group_name"
                                                                    onBlur={handleBlur}
                                                                    type="text"
                                                                    onChange={e => {
                                                                        setGroupNameExistsErrMsg(false);
                                                                        handleChange(e);
                                                                    }}
                                                                    placeholder="Group Name"
                                                                />

                                                                {touched.group_name && errors.group_name && <small className="text-danger form-text">{errors.group_name}</small>}
                                                                {
                                                                    groupNameExistsErrMsg && <small className="text-danger form-text">{'Group Name Already Exists!'}</small>
                                                                }
                                                            </Col>

                                                            <Col xs={6}>
                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>
                                                                    Group Type
                                                                </label>

                                                                <Select
                                                                    defaultValue={previousGroupType}
                                                                    // isMulti
                                                                    // value={selectedGroupType}
                                                                    name="groupType"
                                                                    options={groupTypeOptions}
                                                                    className="basic-select"
                                                                    classNamePrefix="Select"
                                                                    onChange={event => handleGroupTypeChange(event)}
                                                                />

                                                                {groupTypeErrMsg && (
                                                                    <>
                                                                        <small className="text-danger form-text">{'Please select Group Type!'}</small>
                                                                    </>
                                                                )}

                                                            </Col>

                                                        </Row>

                                                        <br />
                                                        <Row>

                                                            <Col>
                                                                {
                                                                    questionsDropdown && (
                                                                        <>
                                                                            <label className="floating-label">
                                                                                <small className="text-danger"></small>
                                                                                Questions
                                                                            </label>

                                                                            <Select
                                                                                defaultValue={previousQuestions}
                                                                                isMulti
                                                                                name="questions"
                                                                                options={questionsDropdown}
                                                                                className="basic-multi-select"
                                                                                classNamePrefix="Select"
                                                                                onChange={event => handleQuestionsChange(event)}
                                                                            />
                                                                        </>
                                                                    )
                                                                }
                                                            </Col>
                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>
                                                                    Levels
                                                                </label>

                                                                <Select
                                                                    defaultValue={previousLevels}
                                                                    isMulti
                                                                    name="boards"
                                                                    options={levelsDropdown}
                                                                    className="basic-multi-select"
                                                                    classNamePrefix="Select"
                                                                    onChange={event => handleLevelsChange(event)}
                                                                />

                                                                {levelsErrMsg && (
                                                                    <small className="text-danger form-text">{'Levels required!'}</small>
                                                                )}
                                                            </Col>
                                                        </Row>

                                                        <br />
                                                        <Row>

                                                            <Col xs={6}>
                                                                {
                                                                    digicardsDropdown && (
                                                                        <>
                                                                            <label className="floating-label">
                                                                                <small className="text-danger"></small>
                                                                                Related Digicards
                                                                            </label>

                                                                            <Select
                                                                                defaultValue={previousDigicards}
                                                                                isMulti
                                                                                name="relatedDigicards"
                                                                                options={digicardsDropdown}
                                                                                className="basic-multi-select"
                                                                                classNamePrefix="Select"
                                                                                onChange={event => handleDigicardsChange(event)}
                                                                            />
                                                                        </>
                                                                    )
                                                                }
                                                            </Col>
                                                        </Row>

                                                        {loader}

                                                        <br />
                                                        <Row className="my-3">
                                                            <Col></Col>
                                                            <Col></Col>

                                                            <Col xs={2}>
                                                                <Button
                                                                    className="btn-block"
                                                                    color="success"
                                                                    size="small"
                                                                    type="submit"
                                                                    variant="success"
                                                                >
                                                                    Submit
                                                                </Button>
                                                            </Col>
                                                        </Row>

                                                    </form>
                                                )}
                                            </Formik>
                                        </Card.Body>
                                    </Card>

                                )
                            }

                        </>
                    )
                    }
                </div>
            </React.Fragment>
        </>

    );
};

export default EditGroups;