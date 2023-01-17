import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
// import dynamicUrl from '../../../helper/dynamicUrl';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { areFilesInvalid } from '../../../../util/utils';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { Label } from 'recharts';
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';
import { fetchClassBasedOnSchool, fetchSectionById } from '../../../api/CommonApi'
import * as Constants from '../../../../helper/constants';
import BasicSpinner from '../../../../helper/BasicSpinner';
import MESSAGES from '../../../../helper/messages';



const EditSection = ({ setOpenEditSection, id, sectionId }) => {
    console.log("id", id);
    console.log("sectionId", sectionId);
    const colourOptions = [];
    let history = useHistory();
    const [options, setOptions] = useState([]);
    const [classId, setClass] = useState([]);
    const [indidvidualSectionData, setIndidvidualSectionData] = useState();
    const [defaultClass, setdefaultClass] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    console.log('defaultClass', defaultClass);
    console.log('indidvidualSectionData', indidvidualSectionData);


    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const UpdateSection = (formData) => {
        axios.post(dynamicUrl.editSection, { data: formData }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                const result = response.data;
                if (result == 200) {
                    setOpenEditSection(false)
                    MySwal.fire({
                        title: 'Section updated successfully!',
                        icon: 'success',
                    }).then((willDelete) => {

                        window.location.reload();

                    })

                } else {
                    console.log("error");
                }
                console.log('result: ', result);
            })
            .catch((err) => {
                console.log(err.response.data);
                setOpenEditSection(false)
                if (err.response.status === 400) {
                    sweetAlertHandler({ title: 'Sorry', type: 'error', text: 'Section Name Already Exists!' })
                } else if (err.response.data === 'Invalid Token') {

                    sessionStorage.clear();
                    localStorage.clear();
                    history.push('/auth/signin-1');
                    window.location.reload();
                } else {
                    console.log("err", err);
                }
            })
    }

    const fetchAllClassData = async () => {
        setIsLoading(true)
        const allClassData = await fetchClassBasedOnSchool(id);
        console.log("allClassData", allClassData);
        if (allClassData.Error) {
            console.log("allClassData.Error", allClassData.Error);
            if (allClassData.Error.response.data == 'Invalid Token') {
                sessionStorage.clear();
                localStorage.clear();
                history.push('/auth/signin-1');
                window.location.reload();
            }
        } else {
            let resultData = allClassData.Items;
            resultData.forEach((item, index) => {
                colourOptions.push({ value: item.client_class_id, label: item.client_class_name })
            })
            setOptions(colourOptions)

            const sectionData = await fetchSectionById(sectionId);
            if (sectionData.Error) {
                console.log("sectionData.Error", sectionData.Error);
                if (sectionData.Error.response.data == 'Invalid Token') {
                    sessionStorage.clear();
                    localStorage.clear();
                    history.push('/auth/signin-1');
                    window.location.reload();
                }
            } else {
                resultData = sectionData.Items
                console.log("resultData", resultData);
                console.log('resultData.client_class_id', resultData[0].client_class_id);
                const defaultValue = colourOptions.filter(activity => (activity.value === resultData[0].client_class_id))
                setdefaultClass(defaultValue)
                console.log('defaultValue', defaultValue);
                setIndidvidualSectionData(resultData)
                setClass(defaultValue[0].value)
            }
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchAllClassData()
    }, [])

    const classOption = (e) => {
        console.log("postPreOption", e);
        setClass(e.value);
    };
    return (
        <div>
            {
                isLoading ? (
                    <BasicSpinner />
                ) : (
                    <React.Fragment>
                        {indidvidualSectionData && (
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    section_name: indidvidualSectionData[0].section_name,
                                    class_id: '',
                                }}

                                validationSchema={Yup.object().shape({
                                    section_name: Yup.string()
                                        .trim()
                                        .required(Constants.AddSection.SectionTitleRequired),
                                })}
                                // validationSchema
                                onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                                    // setSubmitting(true);


                                    const formData = {
                                        section_name: values.section_name,
                                        client_class_id: classId,
                                        school_id: id,
                                        section_id: sectionId

                                    }
                                    console.log('formData: ', formData)
                                    UpdateSection(formData)
                                }}
                            >
                                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                                    <Form onSubmit={handleSubmit} >
                                        <Col sm={6}>
                                            <Form.Group>
                                                <Form.Label className="floating-label" htmlFor="section_name"><small className="text-danger">* </small>Section Name</Form.Label>
                                                <Form.Control
                                                    className="form-control"
                                                    name="section_name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={values.section_name}
                                                />
                                                {touched.section_name && errors.section_name && <small className="text-danger form-text">{errors.section_name}</small>}
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            {defaultClass && (
                                                <div className="form-group fill">
                                                    <label className="floating-label" >
                                                        <small className="text-danger">* </small>
                                                        Class
                                                    </label>
                                                    <Select
                                                        defaultValue={defaultClass}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name="color"
                                                        options={options.disabled}
                                                        onChange={(e) => { classOption(e) }}
                                                    />
                                                </div>
                                            )}

                                        </Col>
                                        <div className="row d-flex justify-content-end">
                                            <div className="form-group fill">
                                                <div className="center col-sm-12">
                                                    <button color="success" type="submit" className="btn-block btn btn-success btn-large">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        )}

                    </React.Fragment>
                )
            }
        </div>

    )
}

export default EditSection