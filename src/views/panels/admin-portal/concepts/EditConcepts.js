import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-draggable-multi-select';
import ReactTags from 'react-tag-autocomplete';
import * as Yup from 'yup';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { SessionStorage } from '../../../../util/SessionStorage';
import BasicSpinner from '../../../../helper/BasicSpinner';
import * as Constants from '../../../../helper/constants';

const EditConcepts = ({ _digicards, _relatedConcepts, editConceptID, setIsOpenEditConcept, fetchAllConceptsData, _basicGroups, _intermediateGroups, _advancedGroups }) => {

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const [selectedDigicards, setSelectedDigicards] = useState([]);
    const [selectedRelatedConcepts, setSelectedRelatedConcepts] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [selectedBasicGroups, setSelectedBasicGroups] = useState([]);
    const [selectedIntermediateGroups, setSelectedIntermediateGroups] = useState([]);
    const [selectedAdvancedGroups, setSelectedAdvancedGroups] = useState([]);

    const [dropdownDigicards, setDropdownDigicards] = useState([]);
    const [dropdownBasicGroups, setDropdownBasicGroups] = useState([]);
    const [dropdownIntermediateGroups, setDropdownIntermediateGroups] = useState([]);
    const [dropdownAdvancedGroups, setDropdownAdvancedGroups] = useState([]);
    const [dropdownRelatedConcepts, setDropdownRelatedConcepts] = useState([]);

    const [previousDigicards, setPreviousDigicards] = useState([]);
    const [previousBasicGroups, setPreviousBasicGroups] = useState([]);
    const [previousIntermediateGroups, setPreviousIntermediateGroups] = useState([]);
    const [previousAdvancedGroups, setPreviousAdvancedGroups] = useState([]);
    const [previousConcepts, setPreviousConcepts] = useState([]);

    const [showDigicardErr, setShowDigicardErr] = useState(false);
    const [showBasicGroupErr, setShowBasicGroupErr] = useState(false);
    const [showIntermediateGroupErr, setShowIntermediateGroupErr] = useState(false);
    const [showAdvancedGroupErr, setShowAdvancedGroupErr] = useState(false);
    const [conceptTitleErr, setConceptTitleErr] = useState(false);
    const [conceptTitleErrMessage, setConceptTitleErrMessage] = useState('');

    const [previousData, setPreviousData] = useState([]);
    const [tags, setTags] = useState([]);

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    useEffect(() => {

        setIsLoading(true);
        showLoader();

        const payload = {
            concept_id: editConceptID
        };

        if (_digicards) {

            let valuesArr = [];

            for (let index = 0; index < _digicards.length; index++) {

                if (_digicards[index]) {
                    valuesArr.push({ value: _digicards[index].digi_card_id, label: _digicards[index].digi_card_title })
                }
            }
            setDropdownDigicards(valuesArr);
        }

        if (_basicGroups) {

            let valuesArr = [];

            for (let index = 0; index < _basicGroups.length; index++) {

                if (_basicGroups[index]) {
                    valuesArr.push({ value: _basicGroups[index].group_id, label: _basicGroups[index].group_name })
                }
            }
            setDropdownBasicGroups(valuesArr);
        }

        if (_intermediateGroups) {

            let valuesArr = [];

            for (let index = 0; index < _intermediateGroups.length; index++) {

                if (_intermediateGroups[index]) {
                    valuesArr.push({ value: _intermediateGroups[index].group_id, label: _intermediateGroups[index].group_name })
                }
            }
            setDropdownIntermediateGroups(valuesArr);
        }

        if (_advancedGroups) {

            let valuesArr = [];

            for (let index = 0; index < _advancedGroups.length; index++) {

                if (_advancedGroups[index]) {
                    valuesArr.push({ value: _advancedGroups[index].group_id, label: _advancedGroups[index].group_name })
                }
            }
            setDropdownAdvancedGroups(valuesArr);
        }

        axios
            .post(
                dynamicUrl.fetchIndividualConcept,
                { data: payload },
                {
                    headers: { Authorization: SessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {

                console.log(response.data.Items[0]);
                hideLoader();

                if (response.data.Items[0]) {

                    setPreviousData(response.data.Items[0]);

                    // ------------------------------

                    let previousTagsArr = [];
                    let keywordsTempArr = [];

                    for (let i = 0; i < response.data.Items[0].concept_keywords.length; i++) {
                        previousTagsArr.push({ name: response.data.Items[0].concept_keywords[i] })
                        keywordsTempArr.push(response.data.Items[0].concept_keywords[i])
                    }

                    setTags(previousTagsArr);
                    setSelectedKeywords(keywordsTempArr);

                    // ------------------------------

                    let previousDigicardsArr = [];
                    let getData;

                    function getPreviousDigicards(i) {

                        if (i < response.data.Items[0].concept_digicard_id.length) {

                            console.log(_digicards.filter(p => p.digi_card_id === response.data.Items[0].concept_digicard_id[i])[0]);

                            getData = _digicards.filter(p => p.digi_card_id === response.data.Items[0].concept_digicard_id[i]);

                            previousDigicardsArr.push(getData[0]);
                            console.log(previousDigicardsArr);
                            i++;
                            getPreviousDigicards(i);

                        } else {

                            let setArr = [];
                            let setTempArr;
                            let selectedArr = [];

                            console.log(previousDigicardsArr);

                            for (let j = 0; j < previousDigicardsArr.length; j++) {

                                setTempArr = [{ label: previousDigicardsArr[j].digi_card_title, value: previousDigicardsArr[j].digi_card_id }];

                                console.log(setTempArr);
                                setArr.push(setTempArr[0]);
                                selectedArr.push(previousDigicardsArr[j].digi_card_id);
                            }
                            console.log(setArr);
                            setPreviousDigicards(setArr);
                            setSelectedDigicards(selectedArr);
                        }

                    } getPreviousDigicards(0);

                    // ------------------------------

                    let previousBasicGroupsArr = [];
                    let getDataBasicGroups;

                    function getPreviousBasicGroups(i) {

                        if (i < response.data.Items[0].concept_group_id.basic.length) {

                            console.log(_basicGroups.filter(p => p.group_id === response.data.Items[0].concept_group_id.basic[i])[0]);

                            getDataBasicGroups = _basicGroups.filter(p => p.group_id === response.data.Items[0].concept_group_id.basic[i]);
                            previousBasicGroupsArr.push(getDataBasicGroups[0]);
                            console.log(previousBasicGroupsArr);
                            i++;
                            getPreviousBasicGroups(i);

                        } else {

                            let setArr = [];
                            let setTempArr;
                            let selectedArr = [];

                            console.log(previousBasicGroupsArr);

                            for (let j = 0; j < previousBasicGroupsArr.length; j++) {

                                setTempArr = [{ label: previousBasicGroupsArr[j].group_name, value: previousBasicGroupsArr[j].group_id }];

                                console.log(setTempArr);
                                setArr.push(setTempArr[0]);
                                selectedArr.push(previousBasicGroupsArr[j].group_id);
                            }
                            console.log(setArr);
                            setPreviousBasicGroups(setArr);
                            setSelectedBasicGroups(selectedArr);
                        }

                    } getPreviousBasicGroups(0);

                    // ------------------------------

                    let previousIntermediateGroupsArr = [];
                    let getDataIntermediateGroups;

                    function getPreviousIntermediateGroups(i) {

                        if (i < response.data.Items[0].concept_group_id.intermediate.length) {

                            console.log(_intermediateGroups.filter(p => p.group_id === response.data.Items[0].concept_group_id.intermediate[i])[0]);

                            getDataIntermediateGroups = _intermediateGroups.filter(p => p.group_id === response.data.Items[0].concept_group_id.intermediate[i]);
                            previousIntermediateGroupsArr.push(getDataIntermediateGroups[0]);
                            console.log(previousIntermediateGroupsArr);
                            i++;
                            getPreviousIntermediateGroups(i);

                        } else {

                            let setArr = [];
                            let setTempArr;
                            let selectedArr = [];

                            console.log(previousIntermediateGroupsArr);

                            for (let j = 0; j < previousIntermediateGroupsArr.length; j++) {

                                setTempArr = [{ label: previousIntermediateGroupsArr[j].group_name, value: previousIntermediateGroupsArr[j].group_id }];

                                console.log(setTempArr);
                                setArr.push(setTempArr[0]);
                                selectedArr.push(previousIntermediateGroupsArr[j].group_id);
                            }
                            console.log(setArr);
                            setPreviousIntermediateGroups(setArr);
                            setSelectedIntermediateGroups(selectedArr);
                        }

                    } getPreviousIntermediateGroups(0);

                    // ------------------------------

                    let previousAdvancedGroupsArr = [];
                    let getDataAdvancedGroups;

                    function getPreviousAdvancedGroups(i) {

                        if (i < response.data.Items[0].concept_group_id.advanced.length) {

                            console.log(_advancedGroups.filter(p => p.group_id === response.data.Items[0].concept_group_id.advanced[i])[0]);

                            getDataAdvancedGroups = _advancedGroups.filter(p => p.group_id === response.data.Items[0].concept_group_id.advanced[i]);
                            previousAdvancedGroupsArr.push(getDataAdvancedGroups[0]);
                            console.log(previousAdvancedGroupsArr);
                            i++;
                            getPreviousAdvancedGroups(i);

                        } else {

                            let setArr = [];
                            let setTempArr;
                            let selectedArr = [];

                            console.log(previousAdvancedGroupsArr);

                            for (let j = 0; j < previousAdvancedGroupsArr.length; j++) {

                                setTempArr = [{ label: previousAdvancedGroupsArr[j].group_name, value: previousAdvancedGroupsArr[j].group_id }];

                                console.log(setTempArr);
                                setArr.push(setTempArr[0]);
                                selectedArr.push(previousAdvancedGroupsArr[j].group_id);
                            }
                            console.log(setArr);
                            setPreviousAdvancedGroups(setArr);
                            setSelectedAdvancedGroups(selectedArr);
                        }

                    } getPreviousAdvancedGroups(0);

                    // ------------------------------

                    let previousConceptsArr = [];
                    let getDataConcepts;

                    console.log(_relatedConcepts);
                    console.log(response.data.Items[0].related_concept);
                    console.log(response.data.Items[0].related_concept.length);

                    function getPreviousConcepts(i) {

                        if (i < response.data.Items[0].related_concept.length) {

                            console.log(_relatedConcepts.filter(p => p.concept_id === response.data.Items[0].related_concept[i])[0]);

                            getDataConcepts = _relatedConcepts.filter(p => p.concept_id === response.data.Items[0].related_concept[i]);

                            previousConceptsArr.push(getDataConcepts[0]);
                            console.log(previousConceptsArr);
                            i++;
                            getPreviousConcepts(i);

                        } else {

                            let setArr = [];
                            let setTempArr;
                            let selectedArr = [];

                            console.log(previousConceptsArr);

                            for (let j = 0; j < previousConceptsArr.length; j++) {

                                setTempArr = [{ label: previousConceptsArr[j].concept_title, value: previousConceptsArr[j].concept_id }];

                                console.log(setTempArr);
                                setArr.push(setTempArr[0]);
                                selectedArr.push(previousConceptsArr[j].concept_id);
                            }
                            console.log(setArr);
                            setPreviousConcepts(setArr);
                            setSelectedRelatedConcepts(selectedArr);
                            setIsLoading(false);
                        }

                    } getPreviousConcepts(0);

                } else {

                    setIsOpenEditConcept(true);
                }

            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);

                    if (error.response.data === 'Invalid Token') {

                        sessionStorage.clear();
                        localStorage.clear();

                        history.push('/auth/signin-1');
                        window.location.reload();

                    } else {

                        setIsOpenEditConcept(false);
                        hideLoader();
                        setIsLoading(false);
                        sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
                    }

                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    setIsLoading(false);
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    setIsLoading(false);
                    console.log('Error', error.message);
                }
            });

    }, []);

    useEffect(() => {

        console.log(previousData.concept_title);

        if (_relatedConcepts) {

            let valuesArr = [];

            for (let index = 0; index < _relatedConcepts.length; index++) {

                console.log(_relatedConcepts[index].concept_title !== previousData.concept_title);
                console.log(_relatedConcepts[index].concept_title, previousData.concept_title);

                if (_relatedConcepts[index] && _relatedConcepts[index].concept_title !== previousData.concept_title) {
                    valuesArr.push({ value: _relatedConcepts[index].concept_id, label: _relatedConcepts[index].concept_title })
                }
            }
            setDropdownRelatedConcepts(valuesArr);
        }
    }, [previousData]);

    const handleDeleteKeywords = (i, states) => {
        const newTags = tags.slice(0);
        newTags.splice(i, 1);
        setTags(newTags);

        let valuesArr = [];
        for (let i = 0; i < newTags.length; i++) {
            valuesArr.push(newTags[i].name)
        }

        console.log(valuesArr);
        setSelectedKeywords(valuesArr);
    };

    const handleAddKeywords = (tag, state) => {

        console.log(tag);
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

    return (


        <div>

            {isLoading ? (
                <BasicSpinner />
            ) : (
                <>
                    {previousData.length === 0 || previousDigicards.length === 0 ? (<></>) : (
                        <>
                            {_digicards && _relatedConcepts && (

                                <>
                                    {console.log(previousData.concept_title)}
                                    <React.Fragment>
                                        < Formik

                                            initialValues={
                                                {
                                                    conceptTitle: previousData.concept_title,
                                                    // submit: null
                                                }
                                            }
                                            validationSchema={
                                                Yup.object().shape({
                                                    conceptTitle: Yup.string()
                                                        .trim()
                                                        .min(2, Constants.AddConcepts.ConceptTitleTooShort)
                                                        .max(32, Constants.AddConcepts.ConceptTitleTooLong)
                                                        .required(Constants.AddConcepts.ConceptTitleRequired),

                                                })
                                            }
                                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                                setStatus({ success: true });
                                                setSubmitting(true);

                                                console.log("Submit clicked")

                                                const formData = {
                                                    data: {
                                                        concept_id: editConceptID,
                                                        concept_title: values.conceptTitle,
                                                        concept_digicard_id: selectedDigicards,
                                                        concept_keywords: selectedKeywords,
                                                        related_concept: selectedRelatedConcepts,
                                                        concept_group_id: {
                                                            basic: selectedBasicGroups,
                                                            intermediate: selectedIntermediateGroups,
                                                            advanced: selectedAdvancedGroups
                                                        }

                                                    }
                                                };

                                                console.log('form Data: ', formData);

                                                if (selectedDigicards.length > 0) {
                                                    console.log("Digicard selected");

                                                    if (selectedBasicGroups.length > 0) {

                                                        if (selectedIntermediateGroups.length > 0) {

                                                            if (selectedAdvancedGroups.length > 0) {

                                                                showLoader();

                                                                axios
                                                                    .post(
                                                                        dynamicUrl.updateConcept,
                                                                        formData,
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
                                                                            setIsOpenEditConcept(false);
                                                                            sweetAlertHandler({ title: 'Success', type: 'success', text: 'Concept updated successfully!' });
                                                                            fetchAllConceptsData();
                                                                            // window.location.reload();

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
                                                                            setConceptTitleErr(true);
                                                                            setConceptTitleErrMessage(error.response.data);

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
                                                                            onChange={(e) => {
                                                                                handleChange("conceptTitle")(e);
                                                                                setConceptTitleErr(false);
                                                                            }}
                                                                            type="text"
                                                                            value={values.conceptTitle}

                                                                        />

                                                                        {touched.conceptTitle && errors.conceptTitle && <small className="text-danger form-text">{errors.conceptTitle}</small>}

                                                                        {conceptTitleErr && conceptTitleErrMessage &&
                                                                            <small className="text-danger form-text">{conceptTitleErrMessage}</small>
                                                                        }

                                                                    </div>

                                                                </Col>
                                                                <Col>

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

                                                                </Col>
                                                            </Row>
                                                            <br />
                                                            <Row>
                                                                <Col>
                                                                    <div className="form-group fill">

                                                                        <label className="floating-label">
                                                                            <small className="text-danger">* </small>
                                                                            Digicards
                                                                        </label>
                                                                        <Select
                                                                            defaultValue={previousDigicards}
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
                                                                        {console.log(previousConcepts)}

                                                                        {
                                                                            previousConcepts.length === 0 ? (
                                                                                <Select

                                                                                    isMulti
                                                                                    name="relatedConcepts"
                                                                                    options={dropdownRelatedConcepts}
                                                                                    className="basic-multi-select"
                                                                                    classNamePrefix="Select"
                                                                                    onChange={event => handleRelatedConcepts(event)}
                                                                                />
                                                                            ) : (
                                                                                <>
                                                                                    {previousConcepts && (
                                                                                        < Select
                                                                                            defaultValue={previousConcepts}
                                                                                            isMulti
                                                                                            name="relatedConcepts"
                                                                                            options={dropdownRelatedConcepts}
                                                                                            className="basic-multi-select"
                                                                                            classNamePrefix="Select"
                                                                                            onChange={event => handleRelatedConcepts(event)}
                                                                                        />
                                                                                    )

                                                                                    }
                                                                                </>

                                                                            )
                                                                        }


                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <br />
                                                            <Row>
                                                                <Col>
                                                                    <div className="form-group fill">

                                                                        <label className="floating-label">
                                                                            <small className="text-danger">* </small>
                                                                            Basic Groups
                                                                        </label>

                                                                        <Select
                                                                            defaultValue={previousBasicGroups}
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

                                                                        <Select
                                                                            defaultValue={previousIntermediateGroups}
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

                                                                        <Select
                                                                            defaultValue={previousAdvancedGroups}
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
                                            )
                                            }
                                        </Formik>

                                    </React.Fragment>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>



    )
}

export default EditConcepts