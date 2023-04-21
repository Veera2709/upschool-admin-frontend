
import React, { useState, useCallback } from 'react';
// import './style.css'
import { Row, Col, Card, Button, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
// import CkDecoupledEditor from '../../../components/CK-Editor/CkDecoupledEditor';
import * as Constants from '../../../../helper/constants';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import dynamicUrl from '../../../../helper/dynamicUrls';
import MESSAGES from '../../../../helper/messages';
import Swal from 'sweetalert2';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import withReactContent from 'sweetalert2-react-content';
import { areFilesInvalid, isEmptyObject } from '../../../../util/utils';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-draggable-multi-select';
import { isEmptyArray } from '../../../../util/utils';
import Multiselect from 'multiselect-react-dropdown';
import { fetchChaptersBasedonStatus, fetchIndividualUnit } from '../../../api/CommonApi'
import BasicSpinner from '../../../../helper/BasicSpinner';






// import { Button,Container,Row ,Col  } from 'react-bootstrap';

const EditUnit = ({ setOpenEditUnit, unitId }) => {


    const colourOptions = [];
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [disableButton, setDisableButton] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const MySwal = withReactContent(Swal);
    const [chapterOption, setChapterOption] = useState([]);
    let history = useHistory();
    const [postlearningOption, setPostlearningOption] = useState([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [defauleDescription, setDefauleDescription] = useState();
    const [isShownDes, setIsShownDes] = useState(true);
    const [topicTitles, setTopicTitles] = useState([]);
    const [isShown, setIsShown] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [individualUnitdata, setIndividualUnitdata] = useState([]);
    console.log("individualUnitdata", individualUnitdata);

    const PostlearningOption = (e) => {
        setPostlearningOption(e);
    }

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const fetchAllChaptersList = async () => {
        setIsLoading(true)
        const allChapterData = await fetchChaptersBasedonStatus();
        console.log("allTopicdData", allChapterData.Items);
        if (allChapterData.Error) {
            console.log("allChapterData", allChapterData.Error);
            if (allChapterData.Error.response.data == 'Invalid Token') {
                sessionStorage.clear();
                localStorage.clear();
                history.push('/auth/signin-1');
                window.location.reload();
            }
        } else {
            console.log("allChapterData.Items", allChapterData.Items);
            let resultData = allChapterData.Items
            console.log("resultData", resultData);
            resultData.forEach((item, index) => {
                colourOptions.push({ value: item.chapter_id, label: item.chapter_title })
            }
            );
            console.log("colourOptions", colourOptions);
            setTopicTitles(colourOptions)

            const individualUnitData = await fetchIndividualUnit(unitId);
            if (individualUnitData.Error) {
                console.log("individualUnitData.Error", individualUnitData.Error);
                if (individualUnitData.Error.response.data == 'Invalid Token') {
                    sessionStorage.clear();
                    localStorage.clear();
                    history.push('/auth/signin-1');
                    window.location.reload();
                }
            } else {
                let individual_Unit_data = individualUnitData.Items[0];
                setIndividualUnitdata(individual_Unit_data)
                setDefauleDescription(individual_Unit_data.unit_description)
                let tempArr = [];
                individual_Unit_data.unit_chapter_id.forEach(function (entry) {
                    colourOptions.forEach(function (childrenEntry) {
                        if (entry === childrenEntry.value) {
                            console.log("childrenEntry", childrenEntry);
                            tempArr.push(childrenEntry)
                        }

                    });
                });
                setDefaultOptions(tempArr)
                setChapterOption(individual_Unit_data.unit_chapter_id)
            }

        }
        setIsLoading(false)
    }


    useEffect(() => {
        let userJWT = sessionStorage.getItem('user_jwt');
        console.log("jwt", userJWT);
        if (userJWT === "" || userJWT === undefined || userJWT === "undefined" || userJWT === null) {
            sessionStorage.clear();
            localStorage.clear();
            history.push('/auth/signin-1');
            window.location.reload();
        } else {
            fetchAllChaptersList();
        }
    }, [])



    const getMultiOptions = (event) => {
        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }
        setChapterOption(valuesArr);
    }


    return (
        <div>
            {isLoading === true ? (
                <>
                    <BasicSpinner />
                </>
            ) : (
                <React.Fragment>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            unittitle: individualUnitdata.unit_title,
                            displayname: individualUnitdata.display_name,
                            chapter: '',
                            unit_description: individualUnitdata.unit_description,
                        }}
                        validationSchema={Yup.object().shape({
                            unittitle: Yup.string()
                                .trim()
                                .min(2, Constants.AddUnit.UnittitleRequired)
                                .max(30, Constants.AddUnit.UnittitleTooShort)
                                .required(Constants.AddUnit.UnittitleTooLongs),
                            unit_description: Yup.string()
                                .required(Constants.AddUnit.DescriptionRequired),
                            displayname: Yup.string()
                                .trim()
                                .min(2, Constants.AddUnit.DisplayNameTooShort)
                                .max(32, Constants.AddUnit.DisplayNameTooLong)
                                .required(Constants.AddUnit.DisplayNameRequired),
                        })}



                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            if (chapterOption == '') {
                                setIsShown(false)
                            } else if (values.unit_description === undefined || values.unit_description.trim() === '') {
                                setIsShownDes(false)
                            }
                            else {
                                console.log("on submit");
                                var formData = {
                                    unit_id: unitId,
                                    display_name: values.displayname,
                                    unit_title: values.unittitle,
                                    unit_description: values.unit_description,
                                    unit_chapter_id: chapterOption
                                };

                                console.log("formdata", formData);

                                axios
                                    .post(dynamicUrl.editUnit, { data: formData }, { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
                                    .then(async (response) => {
                                        console.log({ response });
                                        if (response.Error) {
                                            console.log('Error');
                                            hideLoader();
                                            setDisableButton(false);
                                        } else {
                                            setOpenEditUnit(false)
                                            MySwal.fire({
                                                title: 'Unit Updated successfully!',
                                                icon: 'success',
                                            }).then((willDelete) => {
                                                history.push('/admin-portal/units/active-units');
                                                window.location.reload();
                                            })
                                            hideLoader();
                                            setDisableButton(false);
                                            setIsOpen(false);
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
                                                sweetAlertHandler({ title: 'Error', type: 'error', text: MESSAGES.ERROR.DigiCardNameExists });

                                            } else {
                                                sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
                                            }
                                        } else if (error.request) {
                                            // The request was made but no response was received
                                            console.log(error.request);
                                            setDisableButton(false);
                                            hideLoader();
                                        } else {
                                            // Something happened in setting up the request that triggered an Error
                                            console.log('Error', error.message);
                                            setDisableButton(false);
                                            hideLoader();
                                        }
                                    });
                            }
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Row>
                                    <Col sm={6}>
                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="unittitle">
                                                <small className="text-danger">* </small>Unit Title
                                            </label>
                                            <input
                                                className="form-control"
                                                error={touched.unittitle && errors.unittitle}
                                                name="unittitle"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="text"
                                                value={values.unittitle}
                                                id='title'
                                            />
                                            {touched.unittitle && errors.unittitle && <small className="text-danger form-text">{errors.unittitle}</small>}
                                        </div>




                                        <div className="form-group fill">
                                            <label className="floating-label" htmlFor="displayname">
                                                <small className="text-danger">* </small>Display Name
                                            </label>
                                            <input
                                                className="form-control"
                                                error={touched.displayname && errors.displayname}
                                                name="displayname"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="text"
                                                value={values.displayname}
                                                id='title'
                                            />
                                            {touched.displayname && errors.displayname && <small className="text-danger form-text">{errors.displayname}</small>}
                                        </div><br />



                                        <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-top`} style={{ zIndex: 1151 }}>The selected order will be the index of chapter!</Tooltip>}>
                                            {defaultOptions && (<div className="form-group fill" style={{ position: "relative", zIndex: 20 }}>
                                                <label className="floating-label" htmlFor="chapter">
                                                    <small className="text-danger">* </small> Chapter
                                                </label>
                                                {defaultOptions.length === 0 ? (

                                                    <Select
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name="color"
                                                        isMulti
                                                        closeMenuOnSelect={false}
                                                        onChange={getMultiOptions}
                                                        options={topicTitles}
                                                        placeholder="Select"
                                                    />

                                                ) : (
                                                    <>
                                                        {defaultOptions && (

                                                            <Select
                                                                defaultValue={defaultOptions}
                                                                className="basic-single"
                                                                classNamePrefix="select"
                                                                name="color"
                                                                isMulti
                                                                closeMenuOnSelect={false}
                                                                onChange={(e) => { getMultiOptions(e); setIsShown(true) }}
                                                                options={topicTitles}
                                                                placeholder="Select"
                                                            />

                                                        )}
                                                    </>

                                                )}
                                                <small className="text-danger form-text" style={{ display: isShown ? 'none' : 'block' }}>Chapter Required</small>
                                            </div>)}
                                        </OverlayTrigger>

                                        <div className="form-group fill" >
                                            <Form.Label htmlFor="unit_description"> <small className="text-danger">* </small>Unit Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                onChange={(e) => { handleChange(e); setIsShownDes(e) }}
                                                rows="4"
                                                onBlur={handleBlur}
                                                name="unit_description"
                                                value={values.unit_description}
                                                type='text'
                                            />
                                            <br />
                                            {touched.unit_description && errors.unit_description && <small className="text-danger form-text">{errors.unit_description}</small>}
                                            <small className="text-danger form-text" style={{ display: isShownDes ? 'none' : 'block' }}>Unit Description Required</small>
                                        </div>
                                    </Col>
                                </Row>
                                <br></br>
                                <Row>
                                    <Col sm={10}>
                                    </Col>
                                    <div className="form-group fill float-end" >
                                        <Col sm={12} className="center">
                                            <Button
                                                className="btn-block"
                                                color="success"
                                                size="large"
                                                type="submit"
                                                variant="success"
                                            >
                                                Submit
                                            </Button>
                                        </Col>
                                    </div>
                                </Row>
                            </form>
                        )}

                    </Formik>
                </React.Fragment>
            )}
        </div>


    )

};

export default EditUnit;

