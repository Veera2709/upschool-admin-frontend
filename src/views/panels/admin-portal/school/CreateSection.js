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
import { fetchClassBasedOnSchool } from '../../../api/CommonApi'
import * as Constants from '../../../../helper/constants';
import MESSAGES from '../../../../helper/messages';



const CreateSection = ({ setOpenAddSection, id }) => {
    const colourOptions = [];
    let history = useHistory();
    const [options, setOptions] = useState([]);
    const [classId, setClass] = useState();
    const [classIdErr, setClassIdErr] = useState(false);

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const Addsection = (formData) => {
        axios
            .post(dynamicUrl.addSection, { data: formData }, { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
            .then(async (response) => {
                console.log({ response });
                if (response.Error) {
                    console.log('Error');
                } else {
                    setOpenAddSection(false)
                    MySwal.fire({
                        title: 'Section added successfully!',
                        icon: 'success',
                    }).then((willDelete) => {
                        window.location.reload();
                    })
                }
            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    if (error.response.status === 400) {
                        console.log();
                        setOpenAddSection(false)
                        sweetAlertHandler({ title: 'Sorry', type: 'error', text: 'Section Name Already Exists!' })
                    } else if (error.response.data === 'Invalid Token') {
                        sessionStorage.clear();
                        localStorage.clear();
                        history.push('/auth/signin-1');
                        window.location.reload();
                    } else {
                        console.log("err", error);
                    }

                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            });
    }

    const fetchAllClassData = async () => {
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

        }
    }

    useEffect(() => {
        fetchAllClassData()
    }, [])

    const classOption = (e) => {
        console.log("postPreOption", e);
        setClass(e.value);
    };
    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    section_name: '',
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
                    // setOpenAddSection(false)
                    if (classId === undefined || classId === '') {
                        setClassIdErr(true)
                    }else{
                        const formData = {
                            section_name: values.section_name,
                            client_class_id: classId,
                            school_id: id
                        }
                        console.log('formData: ', formData)
                        Addsection(formData)
                    } 
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

                            <div className="form-group fill">
                                <label className="floating-label" >
                                    <small className="text-danger">* </small>
                                    Class
                                </label>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="color"
                                    options={options}
                                    onChange={(e) => {
                                        classOption(e);
                                        setClassIdErr(false)
                                    }}
                                />
                            </div>
                            {classIdErr && (<small className="text-danger form-text">Select The Class!</small>)}
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
        </React.Fragment>
    )
}

export default CreateSection