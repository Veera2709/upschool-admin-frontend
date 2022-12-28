
import React, { useState, useCallback } from 'react';
// import './style.css'
import { Row, Col, Card, Button, Modal, Dropdown, Form } from 'react-bootstrap';
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
import Select from 'react-select';
import { isEmptyArray } from '../../../../util/utils';
import Multiselect from 'multiselect-react-dropdown';
import { fetchAllChapters, fetchIndividualUnit } from '../../../api/CommonApi'




// import { Button,Container,Row ,Col  } from 'react-bootstrap';

const EditUnit = () => {


    const colourOptions = [];
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [disableButton, setDisableButton] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const MySwal = withReactContent(Swal);
    const [chapterOption, setChapterOption] = useState([]);



    const [postlearningOption, setPostlearningOption] = useState([]);
    const [defaultPrelearning, setDefaultPrelearning] = useState([]);
    const [prelearningOptions, setPrelearningOptions] = useState([]);
    const [defaultPostleraing, setDefaultPostleraing] = useState([]);
    const [topicDigiCardIds, setTopicDigiCardIds] = useState([]);


    const [description, setDescription] = useState();
    const [defaultOptions, setDefaultOptions] = useState([]);

    const [defauleDescription, setDefauleDescription] = useState();
    const [isShownDes, setIsShownDes] = useState(true);





    const [topicTitles, setTopicTitles] = useState([]);

    const [isShown, setIsShown] = useState(true);

    const [individualUnitdata, setIndividualUnitdata] = useState([]);
    console.log("individualUnitdata", individualUnitdata);




    const { unit_id } = useParams();
    console.log("unit_id", unit_id);


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




    const UnitDescription = (text) => {
        setDescription(text.target.value)
    }



    const fetchAllChaptersList = async () => {
        const allChapterData = await fetchAllChapters();
        console.log("allTopicdData", allChapterData.Items);
        if (allChapterData.Error) {
            console.log("allChapterData", allChapterData.Error);
        } else {
            console.log("allChapterData.Items", allChapterData.Items);
            let resultData = allChapterData.Items
            console.log("resultData", resultData);
            resultData.forEach((item, index) => {
                if (item.chapter_status === 'Active') {
                    console.log();
                    colourOptions.push({ value: item.chapter_id, label: item.chapter_title })
                }
            }
            );
            console.log("colourOptions", colourOptions);
            setTopicTitles(colourOptions)

            const individualUnitData = await fetchIndividualUnit(unit_id);
            if (individualUnitData.Error) {
                console.log("individualUnitData.Error", individualUnitData.Error);
            } else {
                let individual_Unit_data = individualUnitData.Items[0];
                setIndividualUnitdata(individual_Unit_data)
                setDefauleDescription(individual_Unit_data.unit_description)
                setDescription(individual_Unit_data.unit_description)
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
    }


    useEffect(() => {
        fetchAllChaptersList();
    }, [])



    const getMultiOptions = (event) => {
        let valuesArr = [];
        for (let i = 0; i < event.length; i++) {
            valuesArr.push( event[i].value )
        }
        setChapterOption(valuesArr);
    }


    return  (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>Edit Unit</Card.Title>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            unittitle: individualUnitdata.unit_title,
                            chapter: '',
                            unit_description: '',
                        }}
                        validationSchema={Yup.object().shape({
                            unittitle: Yup.string()
                                .trim()
                                .min(2, Constants.AddUnit.UnittitleRequired)
                                .max(30, Constants.AddUnit.UnittitleTooShort)
                                .required(Constants.AddUnit.UnittitleTooLongs),
                        })}



                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {


                            if (chapterOption == '') {
                                setIsShown(false)
                            }else if(description === undefined || description.trim()===''){
                                setIsShownDes(false)
                            }
                            else {
                                console.log("on submit");
                                var formData = {
                                    unit_id: unit_id,
                                    unit_title: values.unittitle,
                                    unit_description: description,
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
                                            sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.EditUnit });
                                            hideLoader();
                                            setDisableButton(false);
                                            // fetchClientData();
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

                           

                            // }

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
                                                            onChange={getMultiOptions}
                                                            options={topicTitles}
                                                            placeholder="Select"
                                                        />

                                                    )}
                                                </>

                                            )}
                                            <small className="text-danger form-text" style={{ display: isShown ? 'none' : 'block' }}>Required</small>
                                        </div>)}
                                        <div className="form-group fill" >
                                            <Form.Label htmlFor="unit_description"> <small className="text-danger">* </small>Unit Description</Form.Label>
                                            <Form.Control as="textarea"
                                                onChange={(e) => { UnitDescription(e); setIsShownDes(true) }} rows="4"
                                                defaultValue={description}
                                            />
                                            <br />
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
                </Card.Body>

            </Card>

        </div>


    )

};

export default EditUnit;

