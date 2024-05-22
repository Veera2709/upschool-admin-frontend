import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Select from 'react-draggable-multi-select';
import ReactTags from 'react-tag-autocomplete';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import useFullPageLoader from '../../../../helper/useFullPageLoader';
import dynamicUrl from '../../../../helper/dynamicUrls';
import * as Constants from '../../../../helper/constants';
// import { getAllworkSheetQuestions } from '../../../api/CommonApi';

const AddConcepts = ({ _digicards, _relatedConcepts, setIsOpenAddConcept, fetchAllConceptsData, setDigicardsAndConcepts, _basicGroups, _intermediateGroups, _advancedGroups, _workSheetQuestions }) => {

    console.log(_digicards);
    console.log(_relatedConcepts);
    console.log("basic", _basicGroups);
    console.log("intermediate", _intermediateGroups);
    console.log("advanced", _advancedGroups);
    console.log("_workSheetQuestions", _workSheetQuestions);

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const history = useHistory();
    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const [selectedDigicards, setSelectedDigicards] = useState([]);
    const [selectedRelatedConcepts, setSelectedRelatedConcepts] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [selectedBasicGroups, setSelectedBasicGroups] = useState([]);
    const [selectedIntermediateGroups, setSelectedIntermediateGroups] = useState([]);
    const [selectedAdvancedGroups, setSelectedAdvancedGroups] = useState([]);

    const [dropdownDigicards, setDropdownDigicards] = useState([]);
    const [dropdownRelatedConcepts, setDropdownRelatedConcepts] = useState([]);
    const [dropdownBasicGroups, setDropdownBasicGroups] = useState([]);
    const [dropdownIntermediateGroups, setDropdownIntermediateGroups] = useState([]);
    const [dropdownAdvancedGroups, setDropdownAdvancedGroups] = useState([]);

    const [showDigicardErr, setShowDigicardErr] = useState(false);
    const [showBasicGroupErr, setShowBasicGroupErr] = useState(false);
    const [showIntermediateGroupErr, setShowIntermediateGroupErr] = useState(false);
    const [showAdvancedGroupErr, setShowAdvancedGroupErr] = useState(false);
    const [conceptTitleErr, setConceptTitleErr] = useState(false);
    const [displayNameErr, setDisplayNameErr] = useState(false);

    const [displayNameErrMessage, setDisplayNameErrMessage] = useState('');
    const [conceptTitleErrMessage, setConceptTitleErrMessage] = useState('');

    const [workSheetQuestions, setWorkSheetQuestions] = useState()
    const [selectedWorkSheetQue, setSelectedWorkSheetQue] = useState([])
    const [workSheetQueErr, setWorkSheetQueErr] = useState(false)


    useEffect(() => {

        if (_digicards) {

            let valuesArr = [];

            for (let index = 0; index < _digicards.length; index++) {

                if (_digicards[index]) {
                    valuesArr.push({ value: _digicards[index].digi_card_id, label: _digicards[index].digi_card_title })
                }
            }
            setDropdownDigicards(valuesArr);
        }

        if (_relatedConcepts) {

            let valuesArr = [];

            for (let index = 0; index < _relatedConcepts.length; index++) {

                if (_relatedConcepts[index]) {
                    valuesArr.push({ value: _relatedConcepts[index].concept_id, label: _relatedConcepts[index].concept_title })
                }
            }
            setDropdownRelatedConcepts(valuesArr)
        }

        if (_basicGroups) {
            let valuesArr = [];

            for (let index = 0; index < _basicGroups.length; index++) {

                if (_basicGroups[index]) {
                    valuesArr.push({ value: _basicGroups[index].group_id, label: _basicGroups[index].group_name })
                }
            }
            setDropdownBasicGroups(valuesArr)
        }

        if (_intermediateGroups) {
            let valuesArr = [];

            for (let index = 0; index < _intermediateGroups.length; index++) {

                if (_intermediateGroups[index]) {
                    valuesArr.push({ value: _intermediateGroups[index].group_id, label: _intermediateGroups[index].group_name })
                }
            }
            setDropdownIntermediateGroups(valuesArr)
        }

        if (_advancedGroups) {
            let valuesArr = [];

            for (let index = 0; index < _advancedGroups.length; index++) {

                if (_advancedGroups[index]) {
                    valuesArr.push({ value: _advancedGroups[index].group_id, label: _advancedGroups[index].group_name })
                }
            }
            setDropdownAdvancedGroups(valuesArr)
        }

        if (_workSheetQuestions) {
            setWorkSheetQuestions(_workSheetQuestions)
        }

    }, []);

    const [tags, setTags] = useState([]);

    const handleDeleteKeywords = (i, states) => {
        const newTags = tags.slice(0);
        newTags.splice(i, 1);
        setTags(newTags);
    };

    const handleAddKeywords = (tag, state) => {
        const newTags = [].concat(tags, tag);
        console.log(newTags);
        setTags(newTags);

        let valuesArr = [];
        for (let i = 0; i < newTags.length; i++) {
            valuesArr.push(newTags[i].name)
        }

        console.log(valuesArr);
        setSelectedKeywords(valuesArr);
    };

    const handleDigicardChange = (event) => {

        setShowDigicardErr(false);
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

    const handleBasicGroupChange = (event) => {

        setShowBasicGroupErr(false);
        console.log(event);

        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        console.log(valuesArr);
        setSelectedBasicGroups(valuesArr);
    }

    const handleIntermediateGroupChange = (event) => {

        setShowIntermediateGroupErr(false);
        console.log(event);

        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        console.log(valuesArr);
        setSelectedIntermediateGroups(valuesArr);
    }

    const handleAdvancedGroupChange = (event) => {

        setShowAdvancedGroupErr(false);
        console.log(event);

        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        console.log(valuesArr);
        setSelectedAdvancedGroups(valuesArr);
    }

    const handleRelatedConcepts = (event) => {
        console.log(event);
        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        console.log(valuesArr);
        setSelectedRelatedConcepts(valuesArr);
    }

    const handleWorkSheetQueChange = (event) => {
        console.log(event);
        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        console.log(valuesArr);
        setSelectedWorkSheetQue(valuesArr);
    }

    return (

        <>
            {_digicards && _relatedConcepts && _basicGroups && _intermediateGroups && _advancedGroups && (

                <>
                    <React.Fragment>

                        < Formik

                            initialValues={
                                {
                                    conceptTitle: "",
                                    displayName: "",

                                    submit: null
                                }
                            }
                            validationSchema={
                                Yup.object().shape({
                                    conceptTitle: Yup.string()
                                        .trim()
                                        .min(2, Constants.AddConcepts.ConceptTitleTooShort)
                                        .max(32, Constants.AddConcepts.ConceptTitleTooLong)
                                        .required(Constants.AddConcepts.ConceptTitleRequired),

                                    displayName: Yup.string()
                                        .trim()
                                        .min(2, Constants.AddConcepts.DisplayNameTooShort)
                                        .required(Constants.AddConcepts.DisplayNameRequired),



                                })
                            }
                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                setStatus({ success: true });
                                setSubmitting(true);
                                console.log("Submit clicked");

                                const formData = {
                                    data: {
                                        concept_title: values.conceptTitle,
                                        display_name: values.displayName,
                                        concept_digicard_id: selectedDigicards,
                                        concept_keywords: selectedKeywords,
                                        related_concept: selectedRelatedConcepts,
                                        concept_group_id: {
                                            basic: selectedBasicGroups,
                                            intermediate: selectedIntermediateGroups,
                                            advanced: selectedAdvancedGroups
                                        },
                                        concept_question_id: selectedWorkSheetQue
                                    }
                                };

                                console.log('form Data: ', formData);

                                if (selectedDigicards.length > 0) {

                                    console.log("Digicards selected!");

                                    if (selectedBasicGroups.length > 0) {

                                        if (selectedIntermediateGroups.length > 0) {

                                            if (selectedAdvancedGroups.length > 0) {
                                                if (selectedWorkSheetQue.length > 0) {
                                                    showLoader();

                                                    axios
                                                        .post(
                                                            dynamicUrl.addConcepts,
                                                            formData
                                                            ,
                                                            {
                                                                headers: { Authorization: sessionStorage.getItem('user_jwt') }
                                                            }
                                                        )
                                                        .then((response) => {

                                                            console.log({ response });

                                                            let result = response.status === 200;
                                                            hideLoader();

                                                            if (result) {

                                                                console.log('inside res edit');
                                                                hideLoader();
                                                                setIsOpenAddConcept(false);
                                                                // fetchAllConceptsData();
                                                                // sweetAlertHandler({ title: 'Success', type: 'success', text: 'Concept added successfully!' });

                                                                MySwal.fire({

                                                                    title: 'Concept added successfully!',
                                                                    icon: 'success',
                                                                }).then((willDelete) => {
                                                                    window.location.reload();
                                                                });
                                                                setDigicardsAndConcepts(true);

                                                            } else {

                                                                console.log('else res');
                                                                hideLoader();
                                                                // Request made and server responded
                                                                setConceptTitleErr(true);
                                                                setConceptTitleErrMessage("err");
                                                                // window.location.reload();

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

                                                                    setConceptTitleErr(true);
                                                                    setConceptTitleErrMessage(error.response.data);
                                                                }

                                                            } else if (error.request) {
                                                                // The request was made but no response was received
                                                                console.log(error.request);
                                                                hideLoader();
                                                                setConceptTitleErr(true);
                                                                setConceptTitleErrMessage(error.request);
                                                            } else {
                                                                // Something happened in setting up the request that triggered an Error
                                                                console.log('Error', error.message);
                                                                hideLoader();
                                                                setConceptTitleErr(true);
                                                                setConceptTitleErrMessage(error.request);
                                                            }
                                                        })
                                                } else {
                                                    console.log("Advanced Groups empty");
                                                    setWorkSheetQueErr(true);
                                                }

                                            } else {

                                                console.log("Advanced Groups empty");
                                                setShowAdvancedGroupErr(true);

                                            }

                                        } else {
                                            console.log("Intermediate Groups empty");
                                            setShowIntermediateGroupErr(true);
                                        }

                                    } else {
                                        console.log("Basic Groups empty");
                                        setShowBasicGroupErr(true);
                                    }


                                } else {
                                    console.log("Digicard empty");
                                    setShowDigicardErr(true);

                                }

                            }}>

                            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                                <form noValidate onSubmit={handleSubmit} >

                                    <Row>

                                        <Col>
                                            <Row>
                                                <Col>

                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="conceptTitle">
                                                            <small className="text-danger">* </small>Concept Title
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            error={touched.conceptTitle && errors.conceptTitle}
                                                            name="conceptTitle"
                                                            onBlur={handleBlur}
                                                            // onChange={handleChange}
                                                            type="text"
                                                            value={values.conceptTitle}
                                                            onChange={(e) => {
                                                                handleChange("conceptTitle")(e);
                                                                setConceptTitleErr(false);
                                                            }}

                                                        />

                                                        {touched.conceptTitle && errors.conceptTitle && <small className="text-danger form-text">{errors.conceptTitle}</small>}

                                                        {conceptTitleErr && conceptTitleErrMessage &&
                                                            <small className="text-danger form-text">{conceptTitleErrMessage}</small>
                                                        }

                                                    </div>

                                                </Col>
                                                <Col>
                                                    <div className="form-group fill">
                                                        <label className="floating-label" htmlFor="displayName">
                                                            <small className="text-danger">* </small>Display Name
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            error={touched.conceptTitle && errors.conceptTitle}
                                                            name="displayName"
                                                            onBlur={handleBlur}
                                                            // onChange={handleChange}
                                                            type="text"
                                                            value={values.displayName}
                                                            onChange={(e) => {
                                                                handleChange("displayName")(e);
                                                                setDisplayNameErr(false);
                                                            }}

                                                        />

                                                        {touched.displayName && errors.displayName && <small className="text-danger form-text">{errors.displayName}</small>}

                                                        {displayNameErr && displayNameErrMessage &&
                                                            <small className="text-danger form-text">{displayNameErrMessage}</small>
                                                        }

                                                    </div>



                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col>
                                                    <div>
                                                        <label className="floating-label" htmlFor="keywords">
                                                            <small className="text-danger"></small>Keywords
                                                        </label>

                                                        <ReactTags
                                                            classNames={{ root: 'react-tags bootstrap-tagsinput', selectedTag: 'react-tags__selected-tag btn-primary' }}
                                                            allowNew={true}
                                                            addOnBlur={true}
                                                            tags={tags}
                                                            onDelete={handleDeleteKeywords}
                                                            onAddition={(e) => handleAddKeywords(e)}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <hr />

                                            <Row>
                                                <Col>
                                                    <div className="form-group fill">

                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Digicards
                                                        </label>
                                                        {/* {console.log(previousBoards)} */}
                                                        <Select
                                                            // defaultValue={previousBoards}
                                                            isMulti
                                                            name="digicards"
                                                            options={dropdownDigicards}
                                                            className="basic-multi-select"
                                                            classNamePrefix="Select"
                                                            onChange={event => handleDigicardChange(event)}
                                                        />
                                                        {showDigicardErr && <small className="text-danger form-text">{'Please, select Digicards!'}</small>}
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div className="form-group fill">

                                                        <label className="floating-label">
                                                            <small className="text-danger"></small>
                                                            Related Concepts
                                                        </label>
                                                        {/* {console.log(previousBoards)} */}
                                                        <Select
                                                            // defaultValue={previousBoards}
                                                            isMulti
                                                            name="relatedConcepts"
                                                            options={dropdownRelatedConcepts}
                                                            className="basic-multi-select"
                                                            classNamePrefix="Select"
                                                            onChange={event => handleRelatedConcepts(event)}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col>
                                                    <div className="form-group fill">

                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Basic Groups
                                                        </label>
                                                        {/* {console.log(previousBoards)} */}
                                                        <Select
                                                            // defaultValue={previousBoards}
                                                            isMulti
                                                            name="basicGroups"
                                                            options={dropdownBasicGroups}
                                                            className="basic-multi-select"
                                                            classNamePrefix="Select"
                                                            onChange={event => handleBasicGroupChange(event)}
                                                        />
                                                        {showBasicGroupErr && <small className="text-danger form-text">{'Please, select Basic Groups!'}</small>}
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div className="form-group fill">

                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Intermediate Groups
                                                        </label>
                                                        {/* {console.log(previousBoards)} */}
                                                        <Select
                                                            // defaultValue={previousBoards}
                                                            isMulti
                                                            name="intermediateGroups"
                                                            options={dropdownIntermediateGroups}
                                                            className="basic-multi-select"
                                                            classNamePrefix="Select"
                                                            onChange={event => handleIntermediateGroupChange(event)}
                                                        />
                                                        {showIntermediateGroupErr && <small className="text-danger form-text">{'Please, select Intermediate Groups!'}</small>}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={6} >
                                                    <div className="form-group fill">

                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Advanced Groups
                                                        </label>
                                                        {/* {console.log(previousBoards)} */}
                                                        <Select
                                                            // defaultValue={previousBoards}
                                                            isMulti
                                                            name="advancedGroups"
                                                            options={dropdownAdvancedGroups}
                                                            className="basic-multi-select"
                                                            classNamePrefix="Select"
                                                            onChange={event => handleAdvancedGroupChange(event)}
                                                        />
                                                        {showAdvancedGroupErr && <small className="text-danger form-text">{'Please, select Advanced Groups!'}</small>}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col xs={6} >
                                                    <div className="form-group fill">

                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            WorkSheet/Test Questions
                                                        </label>
                                                        {/* {console.log(previousBoards)} */}
                                                        <Select
                                                            // defaultValue={previousBoards}
                                                            isMulti
                                                            name="workSheetOrTest"
                                                            options={workSheetQuestions}
                                                            className="basic-multi-select"
                                                            classNamePrefix="Select"
                                                            onChange={(event) => {
                                                                handleWorkSheetQueChange(event);
                                                                setWorkSheetQueErr(false);
                                                            }}
                                                        />
                                                        {workSheetQueErr && <small className="text-danger form-text">{'Please, select Worksheet Questions!'}</small>}
                                                    </div>
                                                </Col>
                                            </Row>

                                            {loader}
                                            <br />
                                            <hr />
                                            <Row>
                                                <Col>

                                                </Col>
                                                <Col>

                                                    <div className="row">
                                                        <div className="col-md-8"></div>
                                                        <div className="col-md-4">
                                                            <button color="success" disabled={isSubmitting} type="submit" className="btn-block btn btn-success btn-large">Save</button>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>

                                    </Row>

                                </form>
                            )}
                        </Formik>

                    </React.Fragment>
                </>
            )}
        </>

    )

}

export default AddConcepts