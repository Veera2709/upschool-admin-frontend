import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-select';
import ReactTags from 'react-tag-autocomplete';
import * as Yup from 'yup';
import { Row, Col, Card, Pagination, Button, Modal, Alert } from 'react-bootstrap';

import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { SessionStorage } from '../../../../util/SessionStorage';

const EditConcepts = ({ _digicards, _relatedConcepts, editConceptID, setIsOpenEditConcept, fetchAllConceptsData }) => {

    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [selectedDigicards, setSelectedDigicards] = useState([]);
    const [selectedRelatedConcepts, setSelectedRelatedConcepts] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [dropdownDigicards, setDropdownDigicards] = useState([]);
    const [previousDigicards, setPreviousDigicards] = useState([]);
    const [previousConcepts, setPreviousConcepts] = useState([]);
    const [dropdownRelatedConcepts, setDropdownRelatedConcepts] = useState([]);
    const [showDigicardErr, setShowDigicardErr] = useState(false);
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

        if (_relatedConcepts) {

            let valuesArr = [];

            for (let index = 0; index < _relatedConcepts.length; index++) {

                if (_relatedConcepts[index]) {
                    valuesArr.push({ value: _relatedConcepts[index].concept_id, label: _relatedConcepts[index].concept_title })
                }
            }
            setDropdownRelatedConcepts(valuesArr)
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

                    } getPreviousDigicards(0)

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
                        }

                    } getPreviousConcepts(0)

                } else {

                    setIsOpenEditConcept(true);
                }

            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    setIsOpenEditConcept(false);
                    hideLoader();
                    sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                }
            });

    }, []);



    const handleDeleteKeywords = (i, states) => {
        const newTags = tags.slice(0);
        newTags.splice(i, 1);
        setTags(newTags);
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
        for (let i = 0; i < event.length; i++) {
            valuesArr.push(event[i].value)
        }

        console.log(valuesArr);
        setSelectedDigicards(valuesArr);
    }

    const handleRelatedConcepts = (event) => {

        console.log(event);

        let valuesArr = [];
        for (let i = 0; i < event.length; i++) {
            valuesArr.push(event[i].value)
        }

        console.log(valuesArr);
        setSelectedRelatedConcepts(valuesArr);
    }

    return (

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
                                            conceptTitle: Yup.string().max(255).required('Concept Title is required')

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
                                                related_concept: selectedRelatedConcepts

                                            }
                                        };

                                        console.log('form Data: ', formData);

                                        if (selectedDigicards.length > 0) {
                                            console.log("Proceed");
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
                                                                {console.log(previousDigicards)}
                                                                <Select
                                                                    defaultValue={previousDigicards}
                                                                    isMulti
                                                                    name="digicards"
                                                                    options={dropdownDigicards}
                                                                    className="basic-multi-select"
                                                                    classNamePrefix="Select"
                                                                    onChange={event => handleDigicardChange(event)}
                                                                />
                                                                {showDigicardErr && <small className="text-danger form-text">{'Please select a digicard'}</small>}
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
    )
}

export default EditConcepts