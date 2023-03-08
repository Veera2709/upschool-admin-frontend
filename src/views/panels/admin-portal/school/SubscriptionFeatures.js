import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
// import Select from 'react-select';
import Select from "react-draggable-multi-select";

import dynamicUrl from "../../../../helper/dynamicUrls";
import MESSAGES from '../../../../helper/messages';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import * as Constants from '../../../../config/constant';
import BasicSpinner from '../../../../helper/BasicSpinner';

const SubscriptionFeatures = ({ className, rest, id }) => {

    let history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const [previousSubscriptionData, setPreviousSubscriptionData] = useState([]);
    const [previousTypeOfReports, setPreviousTypeOfReports] = useState([]);

    const [_radioLibraryFeature, _setRadioLibraryFeature] = useState(false);
    const [_radioAutomateEvaluation, _setRadioAutomateEvaluation] = useState(false);

    const [selectedLibraryFeature, setSelectedLibraryFeature] = useState('No');
    const [slectedAutomateEvaluation, setSlectedAutomateEvaluation] = useState('No');
    const [selectedtypeOfReports, setSelectedTypeOfReports] = useState([]);

    const [typeOfReportsErrMsg, setTypeOfReportsErrMsg] = useState(false);

    const testTypePre = [
        { label: 'Online', value: 'Online' },
        { label: 'Paper Based', value: 'Paper Based' },
        { label: 'Both', value: 'Both' }
    ];

    const testTypePost = [
        { label: 'Online', value: 'Online' },
        { label: 'Paper Based', value: 'Paper Based' },
        { label: 'Both', value: 'Both' }
    ];

    const typesOfReportsOptions = [
        { value: 'Report1', label: 'Report1' },
        { value: 'Report2', label: 'Report2' },
        { value: 'Report3', label: 'Report3' },
        { value: 'Report4', label: 'Report4' },
        { value: 'Report5', label: 'Report5' }
    ];

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const handleReportChange = (event) => {

        setTypeOfReportsErrMsg(false);
        console.log(event);

        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }

        console.log(valuesArr);
        setSelectedTypeOfReports(valuesArr);
    }

    const handleLibraryFeature = (e) => {

        _setRadioLibraryFeature(!_radioLibraryFeature);
        _radioLibraryFeature === true ? setSelectedLibraryFeature('No') : setSelectedLibraryFeature('Yes');
    }

    const handleAutomateEvaluation = (e) => {

        _setRadioAutomateEvaluation(!_radioAutomateEvaluation);
        _radioAutomateEvaluation === true ? setSlectedAutomateEvaluation('No') : setSlectedAutomateEvaluation('Yes');
    }

    const fetchIndividualSchoolDetails = () => {
        axios
            .post(
                dynamicUrl.fetchIndividualSchool,
                {
                    data: {
                        school_id: id,
                    }
                },
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {
                console.log({ response });
                console.log(response.data.Items[0]);
                console.log(response.status === 200);
                let result = response.status === 200;
                hideLoader();
                if (result) {

                    console.log('inside res initial data');

                    let previousSubscriptionData = response.data.Items[0].school_subscribtion_feature;
                    console.log(previousSubscriptionData);

                    let valuesArr = [];
                    let dataArr = [];

                    if (previousSubscriptionData.types_of_report) {
                        for (let i = 0; i < previousSubscriptionData.types_of_report.length; i++) {
                            dataArr.push({ value: previousSubscriptionData.types_of_report[i], label: previousSubscriptionData.types_of_report[i] })
                            valuesArr.push(previousSubscriptionData.types_of_report[i])
                        }
                        console.log(valuesArr);
                    }

                    const radioValueLibraryFeature = previousSubscriptionData.library_enable_on_app === 'Yes' ? true : false;
                    const radioValueAutomateEvaluation = previousSubscriptionData.automated_evaluation === 'Yes' ? true : false;

                    _setRadioLibraryFeature(radioValueLibraryFeature);
                    _setRadioAutomateEvaluation(radioValueAutomateEvaluation);

                    setSelectedLibraryFeature(previousSubscriptionData.library_enable_on_app);
                    setSlectedAutomateEvaluation(previousSubscriptionData.automated_evaluation);
                    setSelectedTypeOfReports(valuesArr);

                    setPreviousTypeOfReports(dataArr);
                    setPreviousSubscriptionData(previousSubscriptionData);
                    setIsLoading(false);
                } else {
                    console.log('else res');
                    hideLoader();
                    // Request made and server responded
                    // setStatus({ success: false });
                    // setErrors({ submit: 'Error in generating OTP' });
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
                    }
                    // setStatus({ success: false });
                    // setErrors({ submit: error.response.data });
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                    hideLoader();
                    setIsLoading(false);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    hideLoader();
                    setIsLoading(false);
                }
            });
    }

    useEffect(() => {

        setIsLoading(true);
        fetchIndividualSchoolDetails();

    }, []);

    return (

        <div>
            {
                isLoading ? (
                    <BasicSpinner />
                ) : (
                    <>
                        <React.Fragment>

                            <Card>
                                <Card.Body>

                                    <Formik
                                        initialValues={{
                                            testTypePre: previousSubscriptionData.pre_test_type === '' ? '' : previousSubscriptionData.pre_test_type,
                                            testTypePost: previousSubscriptionData.post_test_type === '' ? '' : previousSubscriptionData.post_test_type,
                                            noOfTestPapers: previousSubscriptionData.no_of_test === '' ? '' : previousSubscriptionData.no_of_test,
                                            noOfWorksheets: previousSubscriptionData.no_of_worksheet === '' ? '' : previousSubscriptionData.no_of_worksheet,
                                            submit: null
                                        }}

                                        validationSchema={Yup.object().shape(
                                            {
                                                testTypePre: Yup.string()
                                                    .min(1, 'Please, select Test Type!')
                                                    .oneOf([testTypePre.map((ele) => ele.value)], "Please, provide a valid Test Type!")
                                                    .required('Please, select Test Type!'),
                                                testTypePost: Yup.string()
                                                    .min(1, 'Please, select Test Type!')
                                                    .oneOf([testTypePre.map((ele) => ele.value)], "Please, provide a valid Test Type!")
                                                    .required('Please, select Test Type!'),
                                                noOfWorksheets: Yup.string()
                                                    .matches(Constants.Common.numOfWorksheetsAndTestPapersRegex, 'Invalid Number of Worksheets!')
                                                    .required('Field is required/Invalid Number!'),
                                                noOfTestPapers: Yup.string()
                                                    .matches(Constants.Common.numOfWorksheetsAndTestPapersRegex, 'Invalid Number of Test Papers!')
                                                    .required('Field is required/Invalid Number!'),
                                            }
                                        )}
                                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                            setStatus({ success: true });
                                            setSubmitting(true);

                                            const formData = {
                                                data: {
                                                    school_id: id,
                                                    school_subscribe_feature: {
                                                        pre_test_type: values.testTypePre,
                                                        post_test_type: values.testTypePost,
                                                        types_of_report: selectedtypeOfReports,
                                                        no_of_worksheet: values.noOfWorksheets,
                                                        no_of_test: values.noOfTestPapers,
                                                        library_enable_on_app: selectedLibraryFeature,
                                                        automated_evaluation: slectedAutomateEvaluation
                                                    }
                                                }
                                            }

                                            console.log(formData);

                                            if (selectedtypeOfReports.length > 1) {
                                                showLoader();
                                                axios
                                                    .post(
                                                        dynamicUrl.schoolubscriptionFeatures,
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

                                                            if (response.status === 200) {

                                                                const MySwal = withReactContent(Swal);
                                                                MySwal.fire({
                                                                    title: MESSAGES.TTTLES.Goodjob,
                                                                    type: 'success',
                                                                    text: MESSAGES.SUCCESS.UpdatingSubscriptionFeatures,
                                                                    icon: 'success',
                                                                }).then((willDelete) => {
                                                                    window.location.reload();
                                                                });

                                                            } else {

                                                                setStatus({ success: false });
                                                                setErrors({ submit: 'Error in Editing School' });
                                                            }
                                                        } else {

                                                            console.log('else res');

                                                            setStatus({ success: false });
                                                            setErrors({ submit: 'Error in Editing School' });
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        if (error.response) {

                                                            hideLoader();
                                                            // Request made and server responded
                                                            console.log(error.response.data);

                                                            if (error.response.data === "Invalid Token") {

                                                                sessionStorage.clear();
                                                                localStorage.clear();

                                                                history.push('/auth/signin-1');
                                                                window.location.reload();
                                                            } else {
                                                                setStatus({ success: false });
                                                                setErrors({ submit: error.response.data });
                                                            }



                                                        } else if (error.request) {
                                                            // The request was made but no response was received
                                                            console.log(error.request);
                                                            hideLoader();

                                                        } else {
                                                            // Something happened in setting up the request that triggered an Error
                                                            console.log('Error', error.message);
                                                            hideLoader();

                                                        }
                                                    })

                                            } else {
                                                console.log("Type of reports empty!");
                                                setTypeOfReportsErrMsg(true);
                                            }
                                        }}
                                    >
                                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
                                            <form noValidate onSubmit={handleSubmit} className={className} {...rest}>

                                                <br />
                                                <Row>
                                                    <Col>
                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Test Type for Pre-learning
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            error={touched.testTypePre && errors.testTypePre}
                                                            name="testTypePre"
                                                            onBlur={handleBlur}
                                                            type="text"
                                                            defaultValue={previousSubscriptionData.pre_test_type}
                                                            onChange={e => {
                                                                handleChange(e);
                                                            }}
                                                        >
                                                            <option value={testTypePre}>Select</option>
                                                            {(testTypePre.map((ele, i) => {
                                                                return <option key={i} value={ele.value}>{ele.label}</option>
                                                            }))}
                                                        </select>
                                                        {touched.testTypePre && errors.testTypePre ? (
                                                            <small className="text-danger form-text">{errors.testTypePre}</small>
                                                        ) : null}
                                                    </Col>

                                                    <Col>
                                                        <label className="floating-label">
                                                            <small className="text-danger">* </small>
                                                            Test Type for Post-learning
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            error={touched.testTypePost && errors.testTypePost}
                                                            name="testTypePost"
                                                            onBlur={handleBlur}
                                                            type="text"
                                                            defaultValue={previousSubscriptionData.post_test_type}
                                                            onChange={e => {
                                                                handleChange(e);
                                                            }}
                                                        >
                                                            <option value={testTypePost}>Select</option>
                                                            {(testTypePost.map((ele, i) => {
                                                                return <option key={i} value={ele.value}>{ele.label}</option>
                                                            }))}
                                                        </select>
                                                        {touched.testTypePost && errors.testTypePost ? (
                                                            <small className="text-danger form-text">{errors.testTypePost}</small>
                                                        ) : null}
                                                    </Col>

                                                </Row>

                                                <br />
                                                <Row>
                                                    <Col xs={6}>
                                                        <div className="form-group fill" style={{ position: "relative", zIndex: 20 }}>
                                                            <label className="floating-label">
                                                                <small className="text-danger">* </small>
                                                                Types of Reports
                                                            </label>
                                                            <Select
                                                                defaultValue={previousTypeOfReports}
                                                                isMulti
                                                                name="boards"
                                                                options={typesOfReportsOptions}
                                                                className="basic-multi-select"
                                                                classNamePrefix="Select"
                                                                onChange={event => handleReportChange(event)}
                                                                style={{ menuPortal: base => ({ ...base, zIndex: 9999 }), position: 'fixed' }}
                                                            />

                                                            {typeOfReportsErrMsg && (
                                                                <small className="text-danger form-text">{'Please, select any Types of Reports!'}</small>
                                                            )}
                                                        </div>

                                                    </Col>
                                                    <Col xs={6}>

                                                        <div className="form-group fill">

                                                            <label className="floating-label">
                                                                <small className="text-danger">* </small>
                                                                No. of Worksheets to be generated
                                                            </label>

                                                            <input
                                                                className="form-control"
                                                                error={touched.noOfWorksheets && errors.noOfWorksheets}
                                                                label="noOfWorksheets"
                                                                name="noOfWorksheets"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                type="number"
                                                                value={values.noOfWorksheets}
                                                            />

                                                            {touched.noOfWorksheets && errors.noOfWorksheets && <small className="text-danger form-text">{errors.noOfWorksheets}</small>}
                                                        </div>

                                                    </Col>
                                                </Row>

                                                <br />
                                                <Row>

                                                    <Col xs={6}>

                                                        <div className="form-group fill">

                                                            <label className="floating-label">
                                                                <small className="text-danger">* </small>
                                                                No. of Test Papers to be generated
                                                            </label>

                                                            <input
                                                                className="form-control"
                                                                error={touched.noOfTestPapers && errors.noOfTestPapers}
                                                                label="noOfTestPapers"
                                                                name="noOfTestPapers"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                type="number"
                                                                value={values.noOfTestPapers}
                                                            />

                                                            {touched.noOfTestPapers && errors.noOfTestPapers && <small className="text-danger form-text">{errors.noOfTestPapers}</small>}
                                                        </div>

                                                    </Col>

                                                    <Col xs={6}></Col>
                                                </Row>

                                                <br />
                                                <Row>
                                                    <Col xs={6}>

                                                        <Row>
                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>
                                                                    Enable Library feature on Student App?
                                                                </label>
                                                            </Col>
                                                            <Col xs={2}>
                                                                <div className="form-group fill">
                                                                    <div className="row profile-view-radio-button-view">
                                                                        <Form.Check
                                                                            id={`radio-recommendTeachersPre`}
                                                                            // label="Yes"
                                                                            error={touched.recommendTeachersPre && errors.recommendTeachersPre}
                                                                            type="switch"
                                                                            variant={'outline-primary'}
                                                                            name="radio-recommendTeachersPre"
                                                                            checked={_radioLibraryFeature}
                                                                            onChange={(e) => { handleLibraryFeature(e) }}
                                                                        />
                                                                        <Form.Label className="profile-view-question" id={`radio-recommendTeachersPre`}>
                                                                            {_radioLibraryFeature === true ? 'Yes' : 'No'}
                                                                        </Form.Label>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                    </Col>

                                                    <Col xs={6}>

                                                        <Row>
                                                            <Col>
                                                                <label className="floating-label">
                                                                    <small className="text-danger">* </small>Automate evaluation of worksheets or test papers?
                                                                </label>
                                                            </Col>
                                                            <Col xs={2}>
                                                                <div className="row profile-view-radio-button-view">
                                                                    <Form.Check
                                                                        id={`radio-automateEvaluation`}
                                                                        // label="Yes"
                                                                        error={touched.automateEvaluation && errors.automateEvaluation}
                                                                        type="switch"
                                                                        variant={'outline-primary'}
                                                                        name="radio-automateEvaluation"
                                                                        checked={_radioAutomateEvaluation}
                                                                        onChange={(e) => { handleAutomateEvaluation(e); }}
                                                                    // className='ml-3 col-md-6'
                                                                    />
                                                                    <Form.Label className="profile-view-question" id={`radio-automateEvaluation`}>
                                                                        {_radioAutomateEvaluation === true ? 'Yes' : 'No'}
                                                                    </Form.Label>
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                    </Col>
                                                </Row>

                                                {loader}

                                                <Row className="my-3">
                                                    <Col> </Col>
                                                    <Col> </Col>
                                                    <Col xs={2}>
                                                        <Button
                                                            className="btn-block"
                                                            color="success"
                                                            size="small"
                                                            type="submit"
                                                            variant="success">
                                                            Submit
                                                        </Button>
                                                    </Col>
                                                </Row>

                                            </form>

                                        )}
                                    </Formik>

                                </Card.Body>
                            </Card>
                        </React.Fragment>

                    </>
                )
            }
        </div>


    );

}

export default SubscriptionFeatures