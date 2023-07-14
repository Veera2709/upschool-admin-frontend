import React, { useState, useEffect, useRef } from "react";
// import Select from 'react-select';
import Select from "react-draggable-multi-select";
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'axios';

import * as Constants from '../../../../config/constant';
import { Col, Form, Alert, Card } from 'react-bootstrap';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { areFilesInvalid } from '../../../../util/utils';
import dynamicUrl from "../../../../helper/dynamicUrls";
import BasicSpinner from '../../../../helper/BasicSpinner';
import MESSAGES from "../../../../helper/messages";

const EditSchoolForm = ({ id, setIsOpenEditSchool, fetchSchoolData, setInactive }) => {

    const [imgFile, setImgFile] = useState([]);
    const [subscription_active, setSubscription_active] = useState('');
    const [previousData, setPreviousData] = useState([]);
    const [schoolLabel, setSchoolLabel] = useState('Upschool');
    const [previousLabel, setPreviousLabel] = useState([])
    const [previousBoards, setPreviousBoards] = useState([]);
    const [selectedBoards, setSelectedBoards] = useState([]);
    const [copy, setCopy] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [updatedImage, setUpdatedImage] = useState('');
    const [fileValue, setFileValue] = useState('');
    const [_radio, _setRadio] = useState(false);
    const [schoolLogoErrMsg, setSchoolLogoErrMsg] = useState(false);
    const [schoolBoardErrMsg, setSchoolBoardErrMsg] = useState(false);
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);

    const contactNameRef = useRef('');
    const addressLine1Ref = useRef('');
    const addressLine2Ref = useRef('');
    const cityRef = useRef('');
    const pincodeRef = useRef('');
    const phoneNumberRef = useRef('');

    const schoolBoardOptions = [
        { value: 'ICSE', label: 'ICSE' },
        { value: 'CBSE', label: 'CBSE' },
        { value: 'STATE', label: 'STATE' },
        { value: 'CISCE', label: 'CISCE', isFixed: true },
        { value: 'NIOS', label: 'NIOS' },
        { value: 'IB', label: 'IB' }
    ];



    const schoolLabelling = [
        { value: 'Upschool', label: 'Upschool' },
        { value: 'Co-brand', label: 'Co-brand' },
        { value: 'White-label', label: 'White-label' }

    ]


    const handleSelectChange = (event) => {

        setSchoolBoardErrMsg(false);
        console.log(event);

        let valuesArr = [];
        if (event) {
            for (let i = 0; i < event.length; i++) {
                valuesArr.push(event[i].value)
            }
        }

        console.log(valuesArr);
        setSelectedBoards(valuesArr);
    }

    const previewImage = (e) => {
        console.log("File Updated!")
        console.log(e.target.files[0]);
        console.log(e.target.files[0].name);
        setSchoolLogoErrMsg(false);
        setFileValue(e.target.files[0])
        setUpdatedImage(e.target.files[0].name);
        setImgFile(URL.createObjectURL(e.target.files[0]));
    }

    const handleCopyAddress = () => {
        setCopy(!copy);
    }

    const handleRadioChange = (e) => {

        _setRadio(!_radio);
        _radio === true ? setSubscription_active('No') : setSubscription_active('Yes');
    }

    useEffect(() => {

        setIsLoading(true);

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

                    { console.log(response.data.Items[0].subscription_active) }
                    { console.log(response.data.Items[0].school_logoURL) }

                    // response.data.Items[0].school_board = ["ICSE", "CBSE", "IB"];

                    let individual_client_data = response.data.Items[0];
                    console.log(individual_client_data);

                    let previousSubscription = response.data.Items[0].subscription_active;
                    let previousImage = response.data.Items[0].school_logoURL;
                    const radioValue = response.data.Items[0].subscription_active === 'Yes' ? true : false;

                    let valuesArr = [];
                    let boardArr = [];
                    for (let index = 0; index < individual_client_data.school_board.length; index++) {
                        if (individual_client_data.school_board[index]) {
                            boardArr.push({ value: individual_client_data.school_board[index], label: individual_client_data.school_board[index] })
                            valuesArr.push(individual_client_data.school_board[index])
                        }
                    }
                    console.log("------------- data", individual_client_data.school_labelling);
                    setPreviousLabel({ value: individual_client_data.school_labelling, label: individual_client_data.school_labelling });

                    console.log(boardArr);

                    setSubscription_active(previousSubscription);
                    _setRadio(radioValue);
                    setImgFile(previousImage);
                    setPreviousData(individual_client_data);
                    setPreviousBoards(boardArr);
                    setSelectedBoards(valuesArr);
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

    }, []);


    const handleSchoolLabelling = (selectedSchoolLabel) => {
        console.log("--------------", selectedSchoolLabel.value);
        setSchoolLabel(selectedSchoolLabel.value)
    }



    return (

        <div>
            {
                isLoading ? (
                    <BasicSpinner />
                ) : (
                    <>
                        <React.Fragment>
                            {previousData.length === 0 || previousData.length === "0" || previousBoards.length === 0 ? <></> : (
                                <>
                                    {console.log(subscription_active)}
                                    {console.log(imgFile)}
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>Edit School</Card.Title>
                                            < Formik

                                                initialValues={
                                                    {
                                                        schoolName: previousData === {} ? '' : previousData.school_name,
                                                        school_logo: "",
                                                        subscription_active: subscription_active,
                                                        contact_name: previousData === {} ? '' : previousData.school_contact_info.business_address.contact_name,
                                                        address_line1: previousData === {} ? '' : previousData.school_contact_info.business_address.address_line1,
                                                        address_line2: previousData === {} ? '' : previousData.school_contact_info.business_address.address_line2,
                                                        city: previousData === {} ? '' : previousData.school_contact_info.business_address.city,
                                                        pincode: previousData === {} ? '' : previousData.school_contact_info.business_address.pincode,
                                                        phoneNumber: previousData === {} ? '' : previousData.school_contact_info.business_address.phone_no,


                                                        contact_name2: previousData === {} ? '' : previousData.school_contact_info.billing_address.contact_name,
                                                        address_line1_2: previousData === {} ? '' : previousData.school_contact_info.billing_address.address_line1,
                                                        address_line2_2: previousData === {} ? '' : previousData.school_contact_info.billing_address.address_line2,
                                                        city2: previousData === {} ? '' : previousData.school_contact_info.billing_address.city,
                                                        pincode2: previousData === {} ? '' : previousData.school_contact_info.billing_address.pincode,
                                                        phoneNumber2: previousData === {} ? '' : previousData.school_contact_info.billing_address.phone_no,
                                                        gst_number: previousData === {} ? '' : previousData.school_contact_info.billing_address.GST_no,
                                                        // submit: null
                                                    }
                                                }
                                                validationSchema={
                                                    Yup.object().shape({
                                                        schoolName: Yup.string().max(255).required('School Name is required'),
                                                        contact_name: Yup.string().max(255).required('Contact Name is required'),
                                                        address_line1: Yup.string().max(255).required('Address Line 1 is required'),
                                                        address_line2: Yup.string().max(255).required('Address Line 2 is required'),
                                                        city: Yup.string().max(255).required('City is required'),
                                                        pincode: Yup.string().matches(Constants.Common.pincodeNumberRegex, "pincode must contain 6 digits,should not begin with 0").required('Pincode is required'),
                                                        phoneNumber: Yup.string().matches(Constants.Common.phoneNumberValidRegex, 'Phone Number must contain 10 digits').required('Phone Number is required'),
                                                        contact_name2: Yup.string().max(255).required('Contact Name is required'),
                                                        address_line1_2: Yup.string().max(255).required('Address Line 1 is required'),
                                                        address_line2_2: Yup.string().max(255).required('Address Line 2 is required'),
                                                        city2: Yup.string().max(255).required('City is required'),
                                                        pincode2: Yup.string().matches(Constants.Common.pincodeNumberRegex, "pincode must contain 6 digits, should not begin with 0").required('Pincode is required'),
                                                        phoneNumber2: Yup.string().matches(Constants.Common.phoneNumberValidRegex, 'Phone Number must contain 10 digits').required('Phone Number is required'),

                                                        gst_number: Yup.string().matches(Constants.Common.GSTRegex, 'GST number must be 22AAAAA0000A1Z5 format').required('GST Number is required'),
                                                    })
                                                }
                                                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                                    setStatus({ success: true });
                                                    setSubmitting(true);

                                                    console.log("Submit clicked")

                                                    const formData = {
                                                        data: {
                                                            school_id: id,
                                                            school_name: values.schoolName,
                                                            school_board: selectedBoards,
                                                            school_labelling: schoolLabel,
                                                            school_logo: updatedImage === "" ? previousData.school_logo : updatedImage,
                                                            subscription_active: subscription_active,
                                                            school_contact_info: {
                                                                business_address: {
                                                                    contact_name: values.contact_name,
                                                                    address_line1: values.address_line1,
                                                                    address_line2: values.address_line2,
                                                                    city: values.city,
                                                                    pincode: values.pincode,
                                                                    phone_no: values.phoneNumber,
                                                                },
                                                                billing_address: {

                                                                    contact_name: copy === true ? values.contact_name : values.contact_name2,
                                                                    address_line1: copy === true ? values.address_line1 : values.address_line1_2,
                                                                    address_line2: copy === true ? values.address_line2 : values.address_line2_2,
                                                                    city: copy === true ? values.city : values.city2,
                                                                    pincode: copy === true ? values.pincode : values.pincode2,
                                                                    phone_no: copy === true ? values.phoneNumber : values.phoneNumber2,
                                                                    GST_no: values.gst_number

                                                                },
                                                            }
                                                        }
                                                    };

                                                    console.log('form Data: ', formData);

                                                    if (selectedBoards.length >= 1) {

                                                        let allFilesData = [];
                                                        let selectedFile = fileValue;
                                                        console.log('File!');
                                                        console.log(selectedFile);

                                                        if (selectedFile) {

                                                            console.log('File if!');
                                                            allFilesData.push(selectedFile);

                                                            console.log(allFilesData);

                                                            if (areFilesInvalid(allFilesData) !== 0) {

                                                                showLoader();
                                                                setSchoolLogoErrMsg(true);
                                                                hideLoader();

                                                            } else {

                                                                showLoader();
                                                                console.log('formData: ', formData);

                                                                axios
                                                                    .post(
                                                                        dynamicUrl.updateSchool,
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

                                                                            // Upload Image to S3

                                                                            let uploadParams = response.data;
                                                                            // setDisableButton(false);
                                                                            hideLoader();
                                                                            console.log('Proceeding with file upload');

                                                                            if (Array.isArray(uploadParams)) {

                                                                                for (let index = 0; index < uploadParams.length; index++) {

                                                                                    let keyNameArr = Object.keys(uploadParams[index]);
                                                                                    let keyName = keyNameArr[0];
                                                                                    console.log('KeyName', keyName);

                                                                                    let blobField = fileValue;
                                                                                    console.log({
                                                                                        blobField
                                                                                    });

                                                                                    let tempObj = uploadParams[index];

                                                                                    let result = fetch(tempObj[keyName], {
                                                                                        method: 'PUT',
                                                                                        body: blobField
                                                                                    });

                                                                                    console.log({
                                                                                        result
                                                                                    });
                                                                                }

                                                                                const MySwal = withReactContent(Swal);
                                                                                MySwal.fire({
                                                                                    // title: MESSAGES.TTTLES.Goodjob,
                                                                                    type: 'success',
                                                                                    text: 'Your school has been updated!',
                                                                                    icon: 'success',
                                                                                }).then((willDelete) => {
                                                                                    window.location.reload();
                                                                                });
                                                                            } else {

                                                                                console.log('No files uploaded');


                                                                            }
                                                                        } else {

                                                                            console.log('else res');

                                                                            hideLoader();
                                                                            // Request made and server responded
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
                                                            }
                                                        } else {
                                                            console.log('File else!');

                                                            showLoader();
                                                            console.log('formData: ', formData);

                                                            axios
                                                                .post(
                                                                    dynamicUrl.updateSchool,
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

                                                                        // Upload Image to S3

                                                                        let uploadParams = response.data;
                                                                        // setDisableButton(false);
                                                                        hideLoader();
                                                                        console.log('Proceeding with file upload');

                                                                        if (Array.isArray(uploadParams)) {

                                                                            for (let index = 0; index < uploadParams.length; index++) {

                                                                                let keyNameArr = Object.keys(uploadParams[index]);
                                                                                let keyName = keyNameArr[0];
                                                                                console.log('KeyName', keyName);

                                                                                let blobField = fileValue;
                                                                                console.log({
                                                                                    blobField
                                                                                });

                                                                                let tempObj = uploadParams[index];

                                                                                let result = fetch(tempObj[keyName], {
                                                                                    method: 'PUT',
                                                                                    body: blobField
                                                                                });

                                                                                console.log({
                                                                                    result
                                                                                });
                                                                            }

                                                                            // setIsOpenEditSchool(false);
                                                                            const MySwal = withReactContent(Swal);
                                                                            MySwal.fire({
                                                                                // title: MESSAGES.TTTLES.Goodjob,
                                                                                type: 'success',
                                                                                text: 'Your school has been updated!',
                                                                                icon: 'success',
                                                                            }).then((willDelete) => {
                                                                                window.location.reload();
                                                                            });
                                                                        } else {

                                                                            console.log('No files uploaded');


                                                                        }
                                                                    } else {

                                                                        console.log('else res');

                                                                        hideLoader();
                                                                        // Request made and server responded
                                                                        setStatus({ success: false });
                                                                        setErrors({ submit: 'Error in Editing School' });


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
                                                        }

                                                    } else {

                                                        console.log("School Boards Empty!");
                                                        setSchoolBoardErrMsg(true);

                                                        axios
                                                            .post(
                                                                dynamicUrl.updateSchool,
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

                                                                    // Upload Image to S3

                                                                    let uploadParams = response.data;
                                                                    // setDisableButton(false);
                                                                    hideLoader();
                                                                    console.log('Proceeding with file upload');

                                                                    if (Array.isArray(uploadParams)) {

                                                                        for (let index = 0; index < uploadParams.length; index++) {

                                                                            let keyNameArr = Object.keys(uploadParams[index]);
                                                                            let keyName = keyNameArr[0];
                                                                            console.log('KeyName', keyName);

                                                                            let blobField = fileValue;
                                                                            console.log({
                                                                                blobField
                                                                            });

                                                                            let tempObj = uploadParams[index];

                                                                            console.log(tempObj);
                                                                            console.log(keyName);
                                                                            console.log(tempObj[keyName]);


                                                                            let result = fetch(tempObj[keyName], {
                                                                                method: 'PUT',
                                                                                body: blobField
                                                                            });

                                                                            console.log({
                                                                                result
                                                                            });
                                                                        }

                                                                        const MySwal = withReactContent(Swal);
                                                                        MySwal.fire({
                                                                            // title: MESSAGES.TTTLES.Goodjob,
                                                                            type: 'success',
                                                                            text: 'Your school has been updated!',
                                                                            icon: 'success',
                                                                        }).then((willDelete) => {
                                                                            window.location.reload();
                                                                        });
                                                                    } else {

                                                                        console.log('No files uploaded');


                                                                    }
                                                                } else {

                                                                    console.log('else res');

                                                                    hideLoader();
                                                                    // Request made and server responded
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
                                                    }

                                                }}
                                            >
                                                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue, setFieldTouched }) => (
                                                    <form noValidate onSubmit={handleSubmit}>

                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group fill">
                                                                    <label className="floating-label">
                                                                        <small className="text-danger">* </small>
                                                                        School Name</label>
                                                                    <input
                                                                        className="form-control"
                                                                        error={touched.schoolName && errors.schoolName}
                                                                        label="schoolName"
                                                                        name="schoolName"
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        type="schoolName"
                                                                        value={values.schoolName}
                                                                    />
                                                                    {touched.schoolName && errors.schoolName && <small className="text-danger form-text">{errors.schoolName}</small>}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group fill">

                                                                    <label className="floating-label">
                                                                        <small className="text-danger">* </small>
                                                                        School Board
                                                                    </label>
                                                                    {console.log(previousBoards)}
                                                                    <Select
                                                                        defaultValue={previousBoards}
                                                                        isMulti
                                                                        name="boards"
                                                                        options={schoolBoardOptions}
                                                                        className="basic-multi-select"
                                                                        classNamePrefix="Select"
                                                                        onChange={event => handleSelectChange(event)}
                                                                    />

                                                                    {schoolBoardErrMsg && (
                                                                        <small className="text-danger form-text">{'Please select School Board'}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group fill">

                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <label className="floating-label" >
                                                                                <small className="text-danger">
                                                                                </small>
                                                                                Subscription Active
                                                                            </label>
                                                                        </div>

                                                                        <div className="col">
                                                                            <div className="row profile-view-radio-button-view">
                                                                                <Form.Check
                                                                                    id={`radio-fresher`}
                                                                                    // label="Yes"
                                                                                    error={touched.fresher && errors.fresher}
                                                                                    type="switch"
                                                                                    variant={'outline-primary'}
                                                                                    name="radio-fresher"
                                                                                    // value={subscription_active}
                                                                                    checked={_radio}
                                                                                    onChange={(e) => handleRadioChange(e)}
                                                                                // className='ml-3 col-md-6'
                                                                                />
                                                                                <Form.Label className="profile-view-question" id={`radio-fresher`}>
                                                                                    {_radio === true ? 'Yes' : 'No'}
                                                                                </Form.Label>

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">

                                                            {/* <div className="col-md-3"></div> */}
                                                            <div className="col-md-6">
                                                                <div className="form-group fill">
                                                                    <label className="floating-label" >
                                                                        <small className="text-danger">
                                                                            * </small> School Logo

                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        error={touched.school_logo && errors.school_logo}
                                                                        name="school_logo"
                                                                        id="school_logo"
                                                                        type="file"
                                                                        onChange={previewImage}
                                                                        value={values.school_logo}
                                                                    />
                                                                    {touched.school_logo && errors.school_logo && (
                                                                        <small className="text-danger form-text">{errors.school_logo}</small>
                                                                    )}

                                                                    {schoolLogoErrMsg && (
                                                                        <small className="text-danger form-text">{'Invalid File or file size exceeds 2 MB!'}</small>
                                                                    )}

                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <img width={150} src={imgFile} alt="" className="img-fluid mb-3" />
                                                            </div>
                                                        </div>



                                                        <div className="row">
                                                            <div className='col-sm-6'>
                                                                <div className="form-group fill">

                                                                    <label className="floating-label">
                                                                        <>School labelling </>

                                                                    </label>


                                                                    {console.log("HERE : ", previousLabel)}

                                                                    <Select
                                                                        defaultValue={previousLabel}
                                                                        name="boards"
                                                                        options={schoolLabelling}
                                                                        className="basic-select"
                                                                        classNamePrefix="Select"
                                                                        onBlur={handleBlur}
                                                                        // onChange={handleChange}
                                                                        // onChange={event => handleSelectChange(event)}
                                                                        onChange={(e) => {
                                                                            handleSchoolLabelling(e)
                                                                        }}
                                                                    //     onChange={event => {
                                                                    //         setSchoolBoardErrMsg(false);
                                                                    //         handleSelectChange(event)
                                                                    //     }}
                                                                    // // onSelect={handleSelectBoard}
                                                                    // onRemove={handleOnRemove}
                                                                    />

                                                                    {schoolBoardErrMsg && (
                                                                        <small className="text-danger form-text">{'Please select School Board'}</small>
                                                                    )}

                                                                </div>
                                                            </div>
                                                        </div>












                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group fill">
                                                                    <label className="floating-label">
                                                                        <small className="text-danger">* </small>
                                                                        Business Address</label>

                                                                    <div className="form-group fill">
                                                                        <label className="floating-label">
                                                                            Contact Name
                                                                        </label>
                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.contact_name && errors.contact_name}
                                                                            label="contact_name"
                                                                            name="contact_name"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            // onWheel={(e) => e.target.blur()}
                                                                            type="contact_name"
                                                                            ref={contactNameRef}
                                                                            // value=''
                                                                            value={values.contact_name}
                                                                        />
                                                                        {touched.contact_name && errors.contact_name && (
                                                                            <small className="text-danger form-text">{errors.contact_name}</small>
                                                                        )}
                                                                    </div>

                                                                    <div className="form-group fill">
                                                                        <label className="floating-label">Address Line 1</label>
                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.address_line1 && errors.address_line1}
                                                                            name="address_line1"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            // onWheel={(e) => e.target.blur()}
                                                                            type="address_line1"
                                                                            ref={addressLine1Ref}
                                                                            value={values.address_line1}
                                                                        />
                                                                        {touched.address_line1 && errors.address_line1 && (
                                                                            <small className="text-danger form-text">{errors.address_line1}</small>
                                                                        )}
                                                                    </div>


                                                                    <div className="form-group fill">
                                                                        <label className="floating-label">Address Line 2</label>
                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.address_line2 && errors.address_line2}
                                                                            name="address_line2"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            // onWheel={(e) => e.target.blur()}
                                                                            type="address_line2"
                                                                            ref={addressLine2Ref}
                                                                            value={values.address_line2}
                                                                        />
                                                                        {touched.address_line2 && errors.address_line2 && (
                                                                            <small className="text-danger form-text">{errors.address_line2}</small>
                                                                        )}
                                                                    </div>


                                                                    <div className="form-group fill">

                                                                        <label className="floating-label">City</label>
                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.city && errors.city}
                                                                            name="city"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            // onWheel={(e) => e.target.blur()}
                                                                            type="city"
                                                                            ref={cityRef}
                                                                            value={values.city}
                                                                        />
                                                                        {touched.city && errors.city && (
                                                                            <small className="text-danger form-text">{errors.city}</small>
                                                                        )}
                                                                    </div>


                                                                    <div className="form-group fill">
                                                                        <label className="floating-label">Pincode</label>

                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.pincode && errors.pincode}
                                                                            name="pincode"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            type="number"
                                                                            onWheel={(e) => e.target.blur()}
                                                                            ref={pincodeRef}
                                                                            value={values.pincode}
                                                                        />
                                                                        {touched.pincode && errors.pincode && (
                                                                            <small className="text-danger form-text">{errors.pincode}</small>
                                                                        )}
                                                                    </div>

                                                                    <div className="form-group fill">
                                                                        <label className="floating-label">Phone Number</label>
                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.phoneNumber && errors.phoneNumber}
                                                                            name="phoneNumber"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            type="number"
                                                                            onWheel={(e) => e.target.blur()}
                                                                            ref={phoneNumberRef}
                                                                            value={values.phoneNumber}
                                                                        />
                                                                        {touched.phoneNumber && errors.phoneNumber && (
                                                                            <small className="text-danger form-text">{errors.phoneNumber}</small>
                                                                        )}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group fill">
                                                                    <label className="floating-label">
                                                                        <small className="text-danger">* </small>
                                                                        Billng Address</label>

                                                                    <div className="form-group fill">
                                                                        <label className="floating-label">Contact Name</label>

                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.contact_name2 && errors.contact_name2}
                                                                            label="contact_name2"
                                                                            name="contact_name2"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            // onWheel={(e) => e.target.blur()}
                                                                            type="contact_name2"
                                                                            value={values.contact_name2}
                                                                        />
                                                                        {touched.contact_name2 && errors.contact_name2 && (
                                                                            <small className="text-danger form-text">{errors.contact_name2}</small>
                                                                        )}
                                                                    </div>

                                                                    <div className="form-group fill">
                                                                        <label className="floating-label">Address Line 1</label>
                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.address_line1_2 && errors.address_line1_2}
                                                                            label="address_line1_2"
                                                                            name="address_line1_2"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            // onWheel={(e) => e.target.blur()}
                                                                            type="address_line1_2"
                                                                            value={values.address_line1_2}
                                                                        />
                                                                        {touched.address_line1_2 && errors.address_line1_2 && (
                                                                            <small className="text-danger form-text">{errors.address_line1_2}</small>
                                                                        )}
                                                                    </div>


                                                                    <div className="form-group fill">
                                                                        <label className="floating-label">Address Line 2</label>

                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.address_line2_2 && errors.address_line2_2}
                                                                            label="address_line2_2"
                                                                            name="address_line2_2"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            // onWheel={(e) => e.target.blur()}
                                                                            type="address_line2_2"
                                                                            value={values.address_line2_2}
                                                                        />
                                                                        {touched.address_line2_2 && errors.address_line2_2 && (
                                                                            <small className="text-danger form-text">{errors.address_line2_2}</small>
                                                                        )}
                                                                    </div>


                                                                    <div className="form-group fill">
                                                                        <label className="floating-label">City</label>

                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.city2 && errors.city2}
                                                                            label="city2"
                                                                            name="city2"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            // onWheel={(e) => e.target.blur()}
                                                                            type="city2"
                                                                            value={values.city2}
                                                                        />
                                                                        {touched.city2 && errors.city2 && (
                                                                            <small className="text-danger form-text">{errors.city2}</small>
                                                                        )}
                                                                    </div>


                                                                    <div className="form-group fill">
                                                                        <label className="floating-label">Pincode</label>

                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.pincode2 && errors.pincode2}
                                                                            label="pincode2"
                                                                            name="pincode2"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            type="number"
                                                                            onWheel={(e) => e.target.blur()}
                                                                            value={values.pincode2}
                                                                        />
                                                                        {touched.pincode2 && errors.pincode2 && (
                                                                            <small className="text-danger form-text">{errors.pincode2}</small>
                                                                        )}
                                                                    </div>

                                                                    <div className="form-group fill">

                                                                        <label className="floating-label">Phone Number</label>

                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.phoneNumber2 && errors.phoneNumber2}
                                                                            label="phoneNumber2"
                                                                            name="phoneNumber2"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            type="number"
                                                                            onWheel={(e) => e.target.blur()}
                                                                            value={values.phoneNumber2}
                                                                        />
                                                                        {touched.phoneNumber2 && errors.phoneNumber2 && (
                                                                            <small className="text-danger form-text">{errors.phoneNumber2}</small>
                                                                        )}
                                                                    </div>


                                                                    <div className="form-group fill">

                                                                        <label className="floating-label">GST Number</label>

                                                                        <input
                                                                            className="form-control"
                                                                            error={touched.gst_number && errors.gst_number}
                                                                            label="gst_number"
                                                                            name="gst_number"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                            onWheel={(e) => e.target.blur()}
                                                                            type="gst_number"
                                                                            // ref={permCrimPhoneNoRef}
                                                                            value={values.gst_number}
                                                                        />
                                                                        {touched.gst_number && errors.gst_number && (
                                                                            <small className="text-danger form-text">{errors.gst_number}</small>
                                                                        )}
                                                                    </div>

                                                                </div>

                                                                <Form.Check
                                                                    type='checkbox'
                                                                    id={`default-checkbox`}
                                                                    label={`Same as Business Address`}
                                                                    checked={copy}
                                                                    onClick={() => {
                                                                        console.log("copy", copy);

                                                                        copy === false ? setFieldValue('contact_name2', contactNameRef.current.value) : setFieldValue('contact_name2', '')

                                                                        copy === false ? setFieldValue('address_line1_2', addressLine1Ref.current.value) : setFieldValue('address_line1_2', '')

                                                                        copy === false ? setFieldValue('address_line2_2', addressLine2Ref.current.value) : setFieldValue('address_line2_2', '')

                                                                        copy === false ? setFieldValue('city2', cityRef.current.value) : setFieldValue('city2', '')

                                                                        copy === false ? setFieldValue('pincode2', pincodeRef.current.value) : setFieldValue('pincode2', '')

                                                                        copy === false ? setFieldValue('phoneNumber2', phoneNumberRef.current.value) : setFieldValue('phoneNumber2', '')

                                                                        setFieldTouched('phoneNumber2', false, false);
                                                                        setFieldTouched('pincode2', false, false);
                                                                        setFieldTouched('city2', false, false);
                                                                        setFieldTouched('address_line2_2', false, false);
                                                                        setFieldTouched('address_line1_2', false, false);
                                                                        setFieldTouched('contact_name2', false, false);

                                                                    }}
                                                                    onChange={handleCopyAddress} />

                                                                {errors.submit && (
                                                                    <Col sm={12}>
                                                                        <Alert variant="danger">{errors.submit}</Alert>
                                                                    </Col>
                                                                )}

                                                                {loader}

                                                                <br />

                                                                <div className="row">
                                                                    <div className="col-md-8"></div>
                                                                    <div className="col-md-4">
                                                                        <button color="success" disabled={isSubmitting} type="submit" className="btn-block btn btn-success btn-large">Save</button>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </form>
                                                )
                                                }
                                            </Formik >
                                        </Card.Body>
                                    </Card>
                                </>

                            )}
                        </React.Fragment>
                    </>
                )
            }
        </div >
    )
}

export default EditSchoolForm