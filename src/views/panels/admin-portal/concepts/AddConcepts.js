import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Select from 'react-select';
import ReactTags from 'react-tag-autocomplete';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Row, Col, Card, Pagination, Button, Modal, Alert } from 'react-bootstrap';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import dynamicUrl from '../../../../helper/dynamicUrls';


const AddConcepts = ({ _digicards, _relatedConcepts, setIsOpenAddConcept, fetchAllConceptsData }) => {

    console.log(_digicards);
    console.log(_relatedConcepts);

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [selectedDigicards, setSelectedDigicards] = useState([]);
    const [selectedRelatedConcepts, setSelectedRelatedConcepts] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [dropdownDigicards, setDropdownDigicards] = useState([]);
    const [dropdownRelatedConcepts, setDropdownRelatedConcepts] = useState([]);
    const [showDigicardErr, setShowDigicardErr] = useState(false);
    const [conceptTitleErr, setConceptTitleErr] = useState(false);
    const [conceptTitleErrMessage, setConceptTitleErrMessage] = useState('');

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

        // setIsOpenAddConcept(false);
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
            {_digicards && _relatedConcepts && (

                <>
                    <React.Fragment>

                        < Formik

                            initialValues={
                                {
                                    conceptTitle: "",
                                    submit: null
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
                                } else {
                                    console.log("Digicard empty");
                                    setShowDigicardErr(true);

                                }

                                axios
                                    .post(
                                        dynamicUrl.addConcepts,
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
                                            setIsOpenAddConcept(false);
                                            sweetAlertHandler({ title: 'Success', type: 'success', text: 'Concept added successfully!' });
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
                                                        {showDigicardErr && <small className="text-danger form-text">{'Please select a digicard'}</small>}
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

    )

}

export default AddConcepts