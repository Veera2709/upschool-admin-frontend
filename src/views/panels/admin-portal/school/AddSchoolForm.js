import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal, ModalBody, Form } from 'react-bootstrap';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
// import dynamicUrl from '../../../helper/dynamicUrl';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { areFilesInvalid } from '../../../../util/utils';
import * as Constants from '../../../../config/constant'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { bgvAlerts } from '../../../common-ui-components/sow/bgv-api/bgvAlerts';

// import { bgvAlerts } from '../bgv-api/bgvAlerts';

function AddSchool({ className, rest, setIsOpen, fetchSchoolData }) {
    const [imgFile, setImgFile] = useState('');
    let [data, setData] = useState({});
    const [_radio, _setRadio] = useState(false);
    const [scbscription_active, setScbscription_active] = useState('No');
    const [copy, setCopy] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const schoolNameRef = useRef('');
    const schoolBoardRef = useRef('');
    const schoolBoardsRef = useRef('');
    const schoolLogoRef = useRef('');
    const contactNameRef = useRef('');
    const addressLine1Ref = useRef('');
    const addressLine2Ref = useRef('');
    const cityRef = useRef('');
    const pincodeRef = useRef('');
    const phoneNumberRef = useRef('');
    const gst_numberRef = useRef('');

    const phoneRegExp = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;

    // console.log('data: ', data);

    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const handlesetCopyInputs = () => {
        setCopy(!copy);
        setData({
            school_name: schoolNameRef.current.value,
            school_board: schoolBoardRef.current.value,
            school_logo: schoolLogoRef.current.value,
            contact_name: contactNameRef.current.value,
            address_line1: addressLine1Ref.current.value,
            address_line2: addressLine2Ref.current.value,
            city: cityRef.current.value,
            pincode: pincodeRef.current.value,
            phoneNumber: phoneNumberRef.current.value,

            contact_name2: data === {} ? '' : contactNameRef.current.value,
            addres_line1_2: data === {} ? '' : addressLine1Ref.current.value,
            address_line2_2: data === {} ? '' : addressLine2Ref.current.value,
            city2: data === {} ? '' : cityRef.current.value,
            pincode2: data === {} ? '' : pincodeRef.current.value,
            phone_no2: data === {} ? '' : phoneNumberRef.current.value,
            GST_no: data === {} ? '' : gst_numberRef.current.value,
        })
    }

    const previewImage = (e) => {
        setImgFile(URL.createObjectURL(e.target.files[0]));
    }

    const handleRadioChange = (e) => {
        _setRadio(!_radio);
        _radio === true ? setScbscription_active('No') : setScbscription_active('Yes');
    }


    // const [schoolBoardState, setSchoolBoardState] = useState([]);
    // const [schoolBoardCbse, setSchoolBoardCbse] = useState([]);
    // const [schoolBoardIcse, setSchoolBoardIcse] = useState([]);
    // const [schoolBoardCisce, setSchoolBoardCisce] = useState([]);
    // const [schoolBoardNios, setSchoolBoardNios] = useState([]);
    // const [schoolBoardIb, setSchoolBoardIb] = useState([]);

    // const handleOnSelectItem = ((selectedBoardList, selectedBoardItem) => {
    //     setSchoolBoardState(selectedList.map(selectedBoardList => selectedBoardList.id))
    //     setSchoolBoardIb(selectedList.map(selectedBoardItem => selectedBoardItem.name))
    // })
    // const handleOnRemoveItem = (selectedList, selectedItem) => (selectedList.map(skillId => skillId.id))

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    school_name: data === {} ? '' : data.school_name,
                    school_board: data === {} ? '' : data.school_board,
                    school_logo: data === {} ? '' : data.school_logo,
                    subscription_active: scbscription_active,

                    contact_name: data === {} ? '' : data.contact_name,
                    address_line1: data === {} ? '' : data.address_line1,
                    address_line2: data === {} ? '' : data.address_line2,
                    city: data === {} ? '' : data.city,
                    pincode: data === {} ? '' : data.pincode,
                    phone_no: data === {} ? '' : data.phoneNumber,

                    contact_name2: data === {} ? '' : data.contact_name,
                    addres_line1_2: data === {} ? '' : data.address_line1,
                    address_line2_2: data === {} ? '' : data.address_line2,
                    city2: data === {} ? '' : data.city,
                    pincode2: data === {} ? '' : data.pincode,
                    phone_no2: data === {} ? '' : data.phoneNumber,
                    GST_no: data === {} ? '' : data.GST_no,
                }}
                validationSchema={
                    Yup.object().shape({
                        school_name: Yup.string().matches(Constants.Common.alphabetsWithSpaceRegex, 'School Name must contain only alphabets!').max(255).required('School Name is required'), school_board: Yup.string().required('School Board is required'),
                        contact_name: Yup.string().matches(Constants.Common.alphabetsWithSpaceRegex, 'Contact Name must contain only alphabets!').max(255).required('Contact Name is required'),
                        address_line1: Yup.string().max(255).required('Address Line 1 is required'),
                        address_line2: Yup.string().max(255).required('Address Line 2 is required'),
                        city: Yup.string().matches(Constants.Common.alphabetsWithSpaceRegex, 'city Name must contain only alphabets!').max(100).required('City is required'),
                        pincode: Yup.string().matches(Constants.Common.positiveNumber, 'pincode required').max(6, 'pincode must be 6 charactor').required('Pincode is required'),
                        phone_no: Yup.string().matches(Constants.Common.positiveNumber, 'Phone Number required').max(10, 'phone number must be 10 charactar').required('Phone Number is required'),
                        contact_name2: Yup.string().matches(Constants.Common.alphabetsWithSpaceRegex, 'Contact Name must contain only alphabets!').max(255).required('Contact Name is required'),
                        addres_line1_2: Yup.string().max(255).required('Address Line 1 is required'),
                        address_line2_2: Yup.string().max(255).required('Address Line 2 is required'),
                        city2: Yup.string().matches(Constants.Common.alphabetsWithSpaceRegex, 'City Name must contain only alphabets!').max(100).required('City is required'),
                        pincode2: Yup.string().matches(Constants.Common.positiveNumber, 'pincode required').max(6, 'pincode must be 6 charactor').required('Pincode is required'),
                        phone_no2: Yup.string().matches(Constants.Common.positiveNumber, 'Phone Number required').max(10, 'phone Number must be 10 charactor').required('Phone Number is required'),
                        GST_no: Yup.string().matches(Constants.Common.GSTRegex, 'GST number must be 22AAAAA0000A1Z5 format').required('GST Number is required'),
                    })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    setSubmitting(true);
                    const formData = {
                        school_name: values.school_name,
                        school_board: values.school_board,
                        school_logo: "testImg.png",
                        subscription_active: scbscription_active,
                        school_contact_info: {
                            business_address: {
                                contact_name: values.contact_name,
                                address_line1: values.address_line1,
                                address_line2: values.address_line2,
                                city: values.city,
                                pincode: Number(values.pincode),
                                phone_no: Number(values.phone_no),
                            },
                            ///////
                            billing_address: {
                                contact_name: copy === true ? values.contact_name : values.contact_name2,
                                address_line1: copy === true ? values.address_line1 : values.addres_line1_2,
                                address_line2: copy === true ? values.address_line2 : values.address_line2_2,
                                city: copy === true ? values.city : values.city2,
                                pincode: copy === true ? Number(values.pincode) : Number(values.pincode2),
                                phone_no: copy === true ? Number(values.phone_no) : Number(values.phone_no2),
                                GST_no: copy === true ? values.GST_no : values.GST_no,
                            },
                        }
                    }

                    let imageFile = document.getElementById('school_logo').files[0];

                    let sendData = {
                        ImageFile: ''
                    }
                    if (imageFile) {

                        sendData.ImageFile = imageFile.name;

                        console.log('Submitting', sendData);

                        if (areFilesInvalid([imageFile]) !== 0) {
                            setIsOpen(false);
                            sweetAlertHandler({ title: 'Sorry', type: 'error', text: 'Invalid File!' });
                            hideLoader();
                        } else {
                            // console.log('formData: ', JSON.stringify(formData))
                            console.log('formData: ', JSON.stringify({ data: formData }))

                            axios.post(dynamicUrl.insertSchool, { data: formData }, {
                                headers: { Authorization: sessionStorage.getItem('user_jwt') }
                            })
                                .then((response) => {
                                    console.log({ response });
                                    console.log(response.status);
                                    console.log(response.status === 200);
                                    let result = response.status === 200;
                                    hideLoader();
                                    if (result) {
                                        console.log('inside res');

                                        let uploadParams = response.data;
                                        // setDisableButton(false);
                                        hideLoader();
                                        console.log('Proceeding with file upload');

                                        if (Array.isArray(uploadParams)) {
                                            for (let index = 0; index < uploadParams.length; index++) {
                                                let keyNameArr = Object.keys(uploadParams[index]);
                                                let keyName = keyNameArr[0];
                                                console.log('KeyName', keyName);

                                                let blobField = document.getElementById("school_logo").files[0];
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

                                                const timeOutFunction = () => {
                                                    setIsOpen(false);
                                                    const MySwal = withReactContent(Swal);

                                                    MySwal.fire('', 'Your school has been added!', 'success');

                                                    fetchSchoolData();
                                                }
                                                setTimeout(timeOutFunction, 1000);
                                            }

                                            // setIsOpen(false);
                                        } else {
                                            console.log('No files uploaded');
                                            // sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingClient });
                                            // hideLoader();
                                            // setDisableButton(false);
                                            // fetchClientData();
                                            // setIsOpen(false);
                                        }
                                        // SessionStorage.setItem('user_jwt', response.data[0].jwt);
                                    } else {
                                        console.log('else res');
                                        hideLoader();
                                        // Request made and server responded
                                        setStatus({ success: false });
                                        setErrors({ submit: 'Error in generating OTP' });
                                        // window.location.reload();
                                    }
                                })
                                .catch((error) => {
                                    if (error.response) {
                                        hideLoader();

                                        setIsOpen(false);

                                        console.log("------------------------------");
                                        const MySwal = withReactContent(Swal);

                                        MySwal.fire('', error.response.data, 'error');

                                        fetchSchoolData();
                                        // Request made and server responded
                                        console.log(error.response.data);
                                        setStatus({ success: false });
                                        setErrors({ submit: error.response.data });


                                        // window.location.reload();
                                    } else if (error.request) {
                                        // The request was made but no response was received
                                        console.log(error.request);
                                        hideLoader();
                                        // window.location.reload();
                                    } else {
                                        // Something happened in setting up the request that triggered an Error
                                        console.log('Error', error.message);
                                        hideLoader();
                                        // window.location.reload();
                                    }
                                });

                        }
                    } else {
                        sweetAlertHandler(bgvAlerts.noFilesPresentBulkUpload);
                        hideLoader();
                    }

                    let allFilesData = [];
                    const fileNameArray = ['school_logo'];

                    fileNameArray.forEach((fileName) => {
                        let selectedFile = document.getElementById(fileName).files[0];
                        console.log('File is here!');
                        console.log(selectedFile);
                        if (selectedFile) {
                            allFilesData.push(selectedFile);
                        }
                    });
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
                        <div class="row">
                            <div className='col-sm-6'>
                                <div className=''>
                                    <div class="form-group fill">
                                        <label class="floating-label" for="school_name">
                                            <small class="text-danger">* </small>
                                            School Name</label>
                                        <input
                                            error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                            class="form-control"
                                            type="text"
                                            name="school_name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.school_name}
                                            ref={schoolNameRef}
                                        />
                                        {touched.school_name && errors.school_name && (
                                            <small className="text-danger form-text">{errors.school_name}</small>
                                        )}
                                    </div>


                                    {/* <Col sm={6}>
                                        <Form.Group>
                                            <FormLabel className="floating-label" htmlFor="pre_post"><small className="text-danger">* </small>Related Topics</FormLabel>
                                            <Multiselect
                                                options={topicDigiCardId}
                                                displayValue="name"
                                                selectionLimit="25"
                                                onSelect={handleOnSelectItem}
                                                onRemove={handleOnRemoveItem}
                                            />
                                            {touched.pre_post && errors.pre_post && <small className="text-danger form-text">{errors.pre_post}</small>}
                                        </Form.Group>
                                    </Col> */}



                                    {/* 
                                    <div class="form-group fill">
                                        <label class="floating-label" for="school_board">
                                            <small class="text-danger">* </small>
                                            School Board</label>
                                           
                                            as='select'
                                            name="school_board"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.school_board}
                                            ref={schoolBoardRef}
                                            className='form-control'
                                        >
                                            {Constants.AddSchool.BoardsList.map((h, i) => {
                                                return <option id={`school_boards-${i}`} keys={i} value={h.value}>{h.label}</option>

                                            })}
                                        </select>
                                    </div> */}

                                    <div class="form-group fill">
                                        <label class="floating-label" for="email">
                                            <small class="text-danger">* </small>Subscription Active</label>
                                        <div className="row profile-view-radio-button-view ml-2">
                                            <Form.Check
                                                id={`radio-fresher`}
                                                error={touched.fresher && errors.fresher}
                                                type="switch"
                                                variant={'outline-primary'}
                                                name="radio-fresher"
                                                value={scbscription_active}
                                                checked={_radio}
                                                onChange={(e) => handleRadioChange(e)}
                                            />
                                            <Form.Label className="profile-view-question" id={`radio-fresher`}>
                                                {_radio === true ? 'Yes' : 'No'}
                                            </Form.Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div class="form-group fill"><label class="floating-label" for="school_logo">School Logo</label>
                                    <input
                                        class="form-control"
                                        name="school_logo"
                                        id="school_logo"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={previewImage}
                                        value={values.school_logo}
                                    // ref={schoolLogoRef}
                                    />
                                    {touched.school_logo && errors.school_logo && (
                                        <small className="text-danger form-text">{errors.school_logo}</small>
                                    )}
                                </div>
                                <img width={150} src={imgFile} alt="" className="img-fluid mb-3" />
                            </div>

                            <div className='col-sm-12'>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div class="form-group fill">
                                            <label class="floating-label" for="businessAddress">
                                                <small class="text-danger">* </small>
                                                Business Address</label>

                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>Contact Name</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="contact_name"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        // onWheel={(e) => e.target.blur()}
                                                        type="text"
                                                        ref={contactNameRef}
                                                        // value=''
                                                        value={values.contact_name}
                                                    />
                                                    {touched.contact_name && errors.contact_name && (
                                                        <small className="text-danger form-text">{errors.contact_name}</small>
                                                    )}
                                                </Col>
                                            </Row>

                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>Address Line 1</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="address_line1"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        // onWheel={(e) => e.target.blur()}
                                                        type="text"
                                                        ref={addressLine1Ref}
                                                        value={values.address_line1}
                                                    />
                                                    {touched.address_line1 && errors.address_line1 && (
                                                        <small className="text-danger form-text">{errors.address_line1}</small>
                                                    )}
                                                </Col>
                                            </Row>

                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>Address Line 2</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="address_line2"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        // onWheel={(e) => e.target.blur()}
                                                        type="text"
                                                        ref={addressLine2Ref}
                                                        value={values.address_line2}
                                                    />
                                                    {touched.address_line2 && errors.address_line2 && (
                                                        <small className="text-danger form-text">{errors.address_line2}</small>
                                                    )}
                                                </Col>
                                            </Row>


                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>City</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="city"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        // onWheel={(e) => e.target.blur()}
                                                        type="text"
                                                        ref={cityRef}
                                                        value={values.city}
                                                    />
                                                    {touched.city && errors.city && (
                                                        <small className="text-danger form-text">{errors.city}</small>
                                                    )}
                                                </Col>
                                            </Row>


                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>Pincode</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="pincode"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        onWheel={(e) => e.target.blur()}
                                                        type="number"
                                                        ref={pincodeRef}
                                                        value={values.pincode}
                                                    />
                                                    {touched.pincode && errors.pincode && (
                                                        <small className="text-danger form-text">{errors.pincode}</small>
                                                    )}
                                                </Col>
                                            </Row>

                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>Phone Number</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="phone_no"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        onWheel={(e) => e.target.blur()}
                                                        type="number"
                                                        ref={phoneNumberRef}
                                                        value={values.phone_no}
                                                    />
                                                    {touched.phone_no && errors.phone_no && (
                                                        <small className="text-danger form-text">{errors.phone_no}</small>
                                                    )}
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>

                                    <div class="col-md-6">

                                        <div class="form-group fill">
                                            <label class="floating-label" for="billingAddress"><small class="text-danger">
                                                * </small>Billing Address</label>
                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>Contact Name</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="contact_name2"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        // onWheel={(e) => e.target.blur()}
                                                        type="text"
                                                        // ref={permCrimPhoneNoRef}
                                                        value={values.contact_name2}
                                                    />
                                                    {touched.contact_name2 && errors.contact_name2 && (
                                                        <small className="text-danger form-text">{errors.contact_name2}</small>
                                                    )}
                                                </Col>
                                            </Row>

                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>Address Line 1</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="addres_line1_2"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        // onWheel={(e) => e.target.blur()}
                                                        type="text"
                                                        // ref={permCrimPhoneNoRef}
                                                        value={values.addres_line1_2}
                                                    />
                                                    {touched.addres_line1_2 && errors.addres_line1_2 && (
                                                        <small className="text-danger form-text">{errors.addres_line1_2}</small>
                                                    )}
                                                </Col>
                                            </Row>

                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>Address Line 2</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="address_line2_2"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        // onWheel={(e) => e.target.blur()}
                                                        type="text"
                                                        // ref={permCrimPhoneNoRef}
                                                        value={values.address_line2_2}
                                                    />
                                                    {touched.address_line2_2 && errors.address_line2_2 && (
                                                        <small className="text-danger form-text">{errors.address_line2_2}</small>
                                                    )}
                                                </Col>
                                            </Row>


                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>City</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="city2"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        // onWheel={(e) => e.target.blur()}
                                                        type="text"
                                                        // ref={permCrimPhoneNoRef}
                                                        value={values.city2}
                                                    />
                                                    {touched.city2 && errors.city2 && (
                                                        <small className="text-danger form-text">{errors.city2}</small>
                                                    )}
                                                </Col>
                                            </Row>


                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>Pincode</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="pincode2"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        onWheel={(e) => e.target.blur()}
                                                        type="number"
                                                        // ref={permCrimPhoneNoRef}
                                                        value={values.pincode2}
                                                    />
                                                    {touched.pincode2 && errors.pincode2 && (
                                                        <small className="text-danger form-text">{errors.pincode2}</small>
                                                    )}
                                                </Col>
                                            </Row>

                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>Phone Number</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="phone_no2"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        onWheel={(e) => e.target.blur()}
                                                        type="number"
                                                        // ref={permCrimPhoneNoRef}
                                                        value={values.phone_no2}
                                                    />
                                                    {touched.phone_no2 && errors.phone_no2 && (
                                                        <small className="text-danger form-text">{errors.phone_no2}</small>
                                                    )}
                                                </Col>
                                            </Row>

                                            <Row className="my-3">
                                                <Col sm={5}>
                                                    <label>GST Number</label>
                                                </Col>
                                                <Col sm={7}>
                                                    <input
                                                        className="form-control"
                                                        // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                        name="GST_no"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        onWheel={(e) => e.target.blur()}
                                                        type="text"
                                                        ref={gst_numberRef}
                                                        value={values.GST_no}
                                                    />
                                                    {touched.GST_no && errors.GST_no && (
                                                        <small className="text-danger form-text">{errors.GST_no}</small>
                                                    )}
                                                </Col>
                                                <Form.Check className='mt-3 ml-3' type='checkbox' id={`default-checkbox`} label={`Same as Business Address`} checked={copy} onChange={handlesetCopyInputs} />
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div class="row d-flex justify-content-end">
                            <div class="form-group fill">
                                <div class="center col-sm-12">
                                    <button color="success" type="submit" class="btn-block btn btn-success btn-large">Submit</button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
            {loader}
        </>
    )
}

export default AddSchool;
