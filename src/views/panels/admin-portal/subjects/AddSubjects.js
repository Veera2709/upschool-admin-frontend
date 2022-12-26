import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Select from 'react-select';
import ReactTags from 'react-tag-autocomplete';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Row, Col } from 'react-bootstrap';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import dynamicUrl from '../../../../helper/dynamicUrls';


const AddSubjects = ({ _units, _relatedSubjects, setIsOpenAddSubject, fetchAllSubjectsData }) => {

    console.log(_units);
    console.log(_relatedSubjects);

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [selectedUnits, setSelectedUnits] = useState([]);
    const [selectedRelatedSubjects, setSelectedRelatedSubjects] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [dropdownUnits, setDropdownUnits] = useState([]);
    const [dropdownRelatedSubjects, setDropdownRelatedSubjects] = useState([]);
    const [showUnitsErr, setShowUnitsErr] = useState(false);
    const [subjectTitleErr, setsubjectTitleErr] = useState(false);
    const [subjectTitleErrMessage, setsubjectTitleErrMessage] = useState('');

    useEffect(() => {

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

        // setIsOpenAddSubject(false);
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

    const handleUnitsChange = (event) => {

        setShowUnitsErr(false);
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
            {_units && _relatedSubjects && (

                <>
                    <React.Fragment>

                        < Formik

                            initialValues={
                                {
                                    subjectTitle: "",
                                    description: "",
                                    submit: null
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
                                            dynamicUrl.addSubject,
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
                                                setIsOpenAddSubject(false);
                                                sweetAlertHandler({ title: 'Success', type: 'success', text: 'Subject added successfully!' });
                                                fetchAllSubjectsData();
                                                // window.location.reload();

                                            } else {

                                                console.log('else res');
                                                hideLoader();
                                                // Request made and server responded
                                                setsubjectTitleErr(true);
                                                setsubjectTitleErrMessage("err");
                                                // window.location.reload();


                                            }
                                        })
                                        .catch((error) => {
                                            if (error.response) {
                                                hideLoader();
                                                // Request made and server responded
                                                console.log(error.response.data);
                                                setsubjectTitleErr(true);
                                                setsubjectTitleErrMessage(error.response.data);

                                            } else if (error.request) {
                                                // The request was made but no response was received
                                                console.log(error.request);
                                                hideLoader();
                                                setsubjectTitleErr(true);
                                                setsubjectTitleErrMessage(error.request);
                                            } else {
                                                // Something happened in setting up the request that triggered an Error
                                                console.log('Error', error.message);
                                                hideLoader();
                                                setsubjectTitleErr(true);
                                                setsubjectTitleErrMessage(error.request);

                                            }
                                        })
                                } else {
                                    console.log("Units empty");
                                    setShowUnitsErr(true);

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
                                                                setsubjectTitleErr(false);
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
                                                        {/* {console.log(previousBoards)} */}
                                                        <Select
                                                            // defaultValue={previousBoards}
                                                            isMulti
                                                            name="units"
                                                            options={dropdownUnits}
                                                            className="basic-multi-select"
                                                            classNamePrefix="Select"
                                                            onChange={event => handleUnitsChange(event)}
                                                        />
                                                        {showUnitsErr && <small className="text-danger form-text">{'Please select Units'}</small>}
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div className="form-group fill">

                                                        <label className="floating-label">
                                                            <small className="text-danger"></small>
                                                            Related Subjects
                                                        </label>
                                                        {/* {console.log(previousBoards)} */}
                                                        <Select
                                                            // defaultValue={previousBoards}
                                                            isMulti
                                                            name="relatedSubjects"
                                                            options={dropdownRelatedSubjects}
                                                            className="basic-multi-select"
                                                            classNamePrefix="Select"
                                                            onChange={event => handleRelatedSubjects(event)}
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

export default AddSubjects