import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-select';
import ReactTags from 'react-tag-autocomplete';
import * as Yup from 'yup';
import { Row, Col } from 'react-bootstrap';

import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { SessionStorage } from '../../../../util/SessionStorage';
import { useHistory } from 'react-router-dom';

const EditSubjects = ({ _units, _relatedSubjects, editSubjectID, setIsOpenEditSubject, fetchAllSubjectsData }) => {

    console.log(_units);
    console.log(_relatedSubjects);

    const history = useHistory();
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [selectedUnits, setSelectedUnits] = useState([]);
    const [selectedRelatedSubjects, setSelectedRelatedSubjects] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [dropdownUnits, setDropdownUnits] = useState([]);
    const [previousUnits, setPreviousUnits] = useState([]);
    const [previousSubjects, setPreviousSubjects] = useState([]);
    const [dropdownRelatedSubjects, setDropdownRelatedSubjects] = useState([]);
    const [showUnitErr, setShowUnitErr] = useState(false);
    const [subjectTitleErr, setSubjectTitleErr] = useState(false);
    const [subjectTitleErrMessage, setSubjectTitleErrMessage] = useState('');
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
            subject_id: editSubjectID
        };

        if (_units) {

            let valuesArr = [];

            for (let index = 0; index < _units.length; index++) {

                if (_units[index]) {
                    valuesArr.push({ value: _units[index].unit_id, label: _units[index].unit_title })
                }
            }
            setDropdownUnits(valuesArr);
        }

        if (_relatedSubjects) {

            let valuesArr = [];

            for (let index = 0; index < _relatedSubjects.length; index++) {

                if (_relatedSubjects[index]) {
                    valuesArr.push({ value: _relatedSubjects[index].subject_id, label: _relatedSubjects[index].subject_title })
                }
            }
            setDropdownRelatedSubjects(valuesArr)
        }

        axios
            .post(
                dynamicUrl.fetchIndividualSubject,
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

                    for (let i = 0; i < response.data.Items[0].subject_keyword.length; i++) {
                        previousTagsArr.push({ name: response.data.Items[0].subject_keyword[i] })
                        keywordsTempArr.push(response.data.Items[0].subject_keyword[i])
                    }

                    setTags(previousTagsArr);
                    setSelectedKeywords(keywordsTempArr);

                    // ------------------------------

                    let previousUnitsArr = [];
                    let getData;

                    function getPreviousUnits(i) {

                        if (i < response.data.Items[0].subject_unit_id.length) {

                            console.log(_units.filter(p => p.unit_id === response.data.Items[0].subject_unit_id[i])[0]);

                            getData = _units.filter(p => p.unit_id === response.data.Items[0].subject_unit_id[i]);

                            previousUnitsArr.push(getData[0]);
                            console.log(previousUnitsArr);
                            i++;
                            getPreviousUnits(i);

                        } else {

                            let setArr = [];
                            let setTempArr;
                            let selectedArr = [];

                            console.log(previousUnitsArr);

                            for (let j = 0; j < previousUnitsArr.length; j++) {

                                setTempArr = [{ label: previousUnitsArr[j].unit_title, value: previousUnitsArr[j].unit_id }];

                                console.log(setTempArr);
                                setArr.push(setTempArr[0]);
                                selectedArr.push(previousUnitsArr[j].unit_id);
                            }
                            console.log(setArr);
                            setPreviousUnits(setArr);
                            setSelectedUnits(selectedArr);
                        }

                    } getPreviousUnits(0)

                    // ------------------------------

                    let previousSubjectsArr = [];
                    let getDataSubjects;

                    console.log(_relatedSubjects);
                    console.log(response.data.Items[0].related_subject);
                    console.log(response.data.Items[0].related_subject.length);

                    function getPreviousSubjects(i) {

                        if (i < response.data.Items[0].related_subject.length) {

                            console.log(_relatedSubjects.filter(p => p.subject_id === response.data.Items[0].related_subject[i])[0]);

                            getDataSubjects = _relatedSubjects.filter(p => p.subject_id === response.data.Items[0].related_subject[i]);

                            previousSubjectsArr.push(getDataSubjects[0]);
                            console.log(previousSubjectsArr);
                            i++;
                            getPreviousSubjects(i);

                        } else {

                            let setArr = [];
                            let setTempArr;
                            let selectedArr = [];

                            console.log(previousSubjectsArr);

                            for (let j = 0; j < previousSubjectsArr.length; j++) {

                                setTempArr = [{ label: previousSubjectsArr[j].subject_title, value: previousSubjectsArr[j].subject_id }];

                                console.log(setTempArr);
                                setArr.push(setTempArr[0]);
                                selectedArr.push(previousSubjectsArr[j].subject_id);
                            }
                            console.log(setArr);
                            setPreviousSubjects(setArr);
                            setSelectedRelatedSubjects(selectedArr);
                        }

                    } getPreviousSubjects(0)

                } else {

                    setIsOpenEditSubject(true);
                }

            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    setIsOpenEditSubject(false);
                    hideLoader();

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

    const handleUnitChange = (event) => {

        setShowUnitErr(false);
        console.log(event);

        let valuesArr = [];
        for (let i = 0; i < event.length; i++) {
            valuesArr.push(event[i].value)
        }

        console.log(valuesArr);
        setSelectedUnits(valuesArr);
    }

    const handleRelatedSubjects = (event) => {

        console.log(event);

        let valuesArr = [];
        for (let i = 0; i < event.length; i++) {
            valuesArr.push(event[i].value)
        }

        console.log(valuesArr);
        setSelectedRelatedSubjects(valuesArr);
    }

    return (

        <>
            {previousData.length === 0 || previousUnits.length === 0 ? (<></>) : (
                <>
                    {_units && _relatedSubjects && (

                        <>
                            {console.log(previousData.subject_title)}
                            <React.Fragment>
                                < Formik

                                    initialValues={
                                        {
                                            subjectTitle: previousData.subject_title,
                                            description: previousData.subject_description,
                                            // submit: null
                                        }
                                    }
                                    validationSchema={
                                        Yup.object().shape({
                                            subjectTitle: Yup.string().max(255).required('Subject Title is required'),
                                            description: Yup.string().max(255).required('Subject Description is required')

                                        })
                                    }
                                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                        setStatus({ success: true });
                                        setSubmitting(true);

                                        console.log("Submit clicked")

                                        const formData = {
                                            data: {
                                                subject_id: editSubjectID,
                                                subject_title: values.subjectTitle,
                                                subject_unit_id: selectedUnits,
                                                subject_keyword: selectedKeywords,
                                                related_subject: selectedRelatedSubjects,
                                                subject_description: values.description

                                            }
                                        };

                                        console.log('form Data: ', formData);

                                        if (selectedUnits.length > 0) {
                                            console.log("Proceed");
                                            showLoader();

                                            axios
                                                .post(
                                                    dynamicUrl.updateSubject,
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
                                                        setIsOpenEditSubject(false);
                                                        sweetAlertHandler({ title: 'Success', type: 'success', text: 'Subject updated successfully!' });
                                                        fetchAllSubjectsData();
                                                        // window.location.reload();

                                                    } else {

                                                        console.log('else res');
                                                        hideLoader();
                                                        // Request made and server responded
                                                        setSubjectTitleErr(true);
                                                        setSubjectTitleErrMessage("err");
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

                                                            setSubjectTitleErr(true);
                                                            setSubjectTitleErrMessage(error.response.data);

                                                        }

                                                    } else if (error.request) {
                                                        // The request was made but no response was received
                                                        console.log(error.request);
                                                        hideLoader();
                                                        setSubjectTitleErr(true);
                                                        setSubjectTitleErrMessage(error.request);
                                                    } else {
                                                        // Something happened in setting up the request that triggered an Error
                                                        console.log('Error', error.message);
                                                        hideLoader();
                                                        setSubjectTitleErr(true);
                                                        setSubjectTitleErrMessage(error.request);

                                                    }
                                                })
                                        } else {
                                            console.log("Unit empty");
                                            setShowUnitErr(true);

                                        }



                                    }}>

                                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                                        <form noValidate onSubmit={handleSubmit} >

                                            <Row>

                                                <Col>
                                                    <Row>
                                                        <Col>

                                                            <div className="form-group fill">
                                                                <label className="floating-label" htmlFor="subjectTitle">
                                                                    <small className="text-danger">* </small>Subject Title
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    error={touched.subjectTitle && errors.subjectTitle}
                                                                    name="subjectTitle"
                                                                    onBlur={handleBlur}
                                                                    // onChange={handleChange}
                                                                    type="text"
                                                                    value={values.subjectTitle}
                                                                    onChange={(e) => {
                                                                        handleChange("subjectTitle")(e);
                                                                        setSubjectTitleErr(false);
                                                                    }}

                                                                />

                                                                {touched.subjectTitle && errors.subjectTitle && <small className="text-danger form-text">{errors.subjectTitle}</small>}

                                                                {subjectTitleErr && subjectTitleErrMessage &&
                                                                    <small className="text-danger form-text">{subjectTitleErrMessage}</small>
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
                                                                    Description
                                                                </label>

                                                                <textarea
                                                                    className="form-control"
                                                                    error={touched.description && errors.description}
                                                                    label="description"
                                                                    name="description"
                                                                    id="description"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    value={values.description}
                                                                    placeholder="Enter description"
                                                                    rows="6"
                                                                />
                                                                {touched.description && errors.description && (
                                                                    <small className="text-danger form-text">{errors.description}</small>
                                                                )}

                                                            </div>

                                                        </Col>
                                                    </Row>

                                                    <br />

                                                    <Row>
                                                        <Col>
                                                            <div className="form-group fill">

                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>
                                                                    Units
                                                                </label>
                                                                {console.log(previousUnits)}
                                                                <Select
                                                                    defaultValue={previousUnits}
                                                                    isMulti
                                                                    name="units"
                                                                    options={dropdownUnits}
                                                                    className="basic-multi-select"
                                                                    classNamePrefix="Select"
                                                                    onChange={event => handleUnitChange(event)}
                                                                />
                                                                {showUnitErr && <small className="text-danger form-text">{'Please select a unit'}</small>}
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <div className="form-group fill">

                                                                <label className="floating-label">
                                                                    <small className="text-danger"></small>
                                                                    Related Subjects
                                                                </label>
                                                                {console.log(previousSubjects)}

                                                                {
                                                                    previousSubjects.length === 0 ? (
                                                                        <Select

                                                                            isMulti
                                                                            name="relatedSubjects"
                                                                            options={dropdownRelatedSubjects}
                                                                            className="basic-multi-select"
                                                                            classNamePrefix="Select"
                                                                            onChange={event => handleRelatedSubjects(event)}
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            {previousSubjects && (
                                                                                < Select
                                                                                    defaultValue={previousSubjects}
                                                                                    isMulti
                                                                                    name="relatedSubjects"
                                                                                    options={dropdownRelatedSubjects}
                                                                                    className="basic-multi-select"
                                                                                    classNamePrefix="Select"
                                                                                    onChange={event => handleRelatedSubjects(event)}
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

export default EditSubjects