import React, { useState, useCallback } from 'react';
// import './style.css'
import { Row, Col, Card, Button, Modal, Dropdown, Form, ModalBody } from 'react-bootstrap';
// import CkDecoupledEditor from '../../../components/CK-Editor/CkDecoupledEditor';
import * as Constants from '../../../../helper/constants';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import dynamicUrl from '../../../../helper/dynamicUrls';
import ReactTags from 'react-tag-autocomplete';
import 'jodit';
import 'jodit/build/jodit.min.css';
import MESSAGES from '../../../../helper/messages';
import Swal from 'sweetalert2';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import withReactContent from 'sweetalert2-react-content';
import { areFilesInvalid, isEmptyObject } from '../../../../util/utils';
import { useEffect } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import { fetchAllChapters } from '../../../api/CommonApi'
import Select from 'react-select';
import { useHistory, useParams } from 'react-router-dom';
import Breadcrumb from '../../../../layouts/AdminLayout/Breadcrumb';


const AddUnit = ({ setOpenAddUnit }) => {
    console.log('setOpenAddUnit', setOpenAddUnit);
    const colourOptions = [];
    let history = useHistory();

    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [disableButton, setDisableButton] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const MySwal = withReactContent(Swal);
    const [chapterOption, setChapterOption] = useState([]);
    const [description, setDescription] = useState();
    const [isShown, setIsShown] = useState(true);
    const [isShownPre, setIsShownPre] = useState(true);
    const [isShownIsl, setIsShownIsl] = useState(true);
    const [isShownDes, setIsShownDes] = useState(true);
    const [topicDigiCardIds, setTopicDigiCardIds] = useState([]);
    const [topicTitles, setTopicTitles] = useState([]);




    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const getMultiOptions = (event) => {
        let valuesArr = [];
        for (let i = 0; i < event.length; i++) {
            valuesArr.push(event[i].value)
        }
        setChapterOption(valuesArr);
    }




    const UnitDescription = (text) => {
        setDescription(text.target.value)
    }

    const fetchAllChapterList = async () => {
        const allChapterData = await fetchAllChapters();
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
                if (item.chapter_status === 'Active') {
                    console.log();
                    colourOptions.push({ value: item.chapter_id, label: item.chapter_title })
                }
            }
            );
            console.log("colourOptions", colourOptions);
            setTopicTitles(colourOptions)
        }
    }


    useEffect(() => {
        fetchAllChapterList();
    }, [])

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    unittitle: '',
                    chapter: '',
                    unit_description: '',
                }}
                validationSchema={Yup.object().shape({
                    unittitle: Yup.string()
                        .trim()
                        .min(2, Constants.AddUnit.UnittitleTooShort)
                        .max(30, Constants.AddUnit.UnittitleTooLong)
                        .required(Constants.AddUnit.UnittitleRequired),
                })}



                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    if (chapterOption == '') {
                        setIsShown(false)
                    } else if (description == undefined || description.trim() === '') {
                        setIsShownDes(false)
                    }
                    else {
                        setOpenAddUnit(false)
                        console.log("on submit");
                        var formData = {
                            unit_title: values.unittitle,
                            unit_description: description,
                            unit_chapter_id: chapterOption,
                        };

                        console.log("formdata", formData);

                        axios
                            .post(dynamicUrl.addUnit, { data: formData }, { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
                            .then(async (response) => {
                                console.log({ response });
                                if (response.Error) {
                                    console.log('Error');
                                    hideLoader();
                                    setDisableButton(false);
                                } else {
                                    // sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingUnit });
                                    hideLoader();
                                    setDisableButton(false);
                                    // fetchClientData();
                                    setIsOpen(false);

                                    MySwal.fire({

                                        title: 'Unit added successfully!',
                                        icon: 'success',
                                    }).then((willDelete) => {

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
                                        sweetAlertHandler({ title: 'Error', type: 'error', text: MESSAGES.ERROR.UnitNameExists });

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


                }
                }
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Row>
                            {/* {edit1Toggle && <Loader />} */}
                            <Col sm={6}>
                                <div className="form-group fill">
                                    <label className="floating-label" htmlFor="unittitle">
                                        <small className="text-danger">* </small>Unit Title
                                    </label>
                                    <input
                                        className="form-control"
                                        error={touched.chaptertitle && errors.chaptertitle}
                                        name="unittitle"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.unittitle}
                                        id='title'
                                    />
                                    {touched.unittitle && errors.unittitle && <small className="text-danger form-text">{errors.unittitle}</small>}
                                </div><br />
                                <div className="form-group fill" style={{ position: "relative", zIndex: 20 }}>
                                    <label className="floating-label" htmlFor="chapter">
                                        <small className="text-danger">* </small> Chapters
                                    </label>
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        name="color"
                                        isMulti
                                        closeMenuOnSelect={false}
                                        onChange={(e) => { getMultiOptions(e); setIsShown(true) }}
                                        options={topicTitles}
                                        placeholder="Select"
                                    />
                                    <br />
                                    <small className="text-danger form-text" style={{ display: isShown ? 'none' : 'block' }}>Field Required</small>
                                </div>
                                <div className="form-group fill" htmlFor="unit_description">
                                    <Form.Label> <small className="text-danger">* </small>Unit Description</Form.Label>
                                    <Form.Control as="textarea" onChange={(e) => { UnitDescription(e); setIsShownDes(true) }} rows="4" />
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
        </React.Fragment>









    )

};

export default AddUnit;
