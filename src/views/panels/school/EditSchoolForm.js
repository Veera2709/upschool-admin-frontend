import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Pagination, Button, Modal, ModalBody, Form, Alert } from 'react-bootstrap';
import useFullPageLoader from '../../../helper/useFullPageLoader';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { areFilesInvalid } from '../../../util/utils';
import * as Constants from '../../../config/constant'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from 'axios';
import dynamicUrl from "../../../helper/dynamicUrls";
import { useHistory } from 'react-router-dom';


const EditSchoolForm = ({ className, rest, id }) => {

    let history = useHistory();

    const [imgFile, setImgFile] = useState();
    let [data, setData] = useState([]);
    const [scbscription_active, setScbscription_active] = useState('');
    const [previousData, setPreviousData] = useState([]);
    const [copy, setCopy] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const contactNameRef = useRef('');
    const addressLine1Ref = useRef('');
    const addressLine2Ref = useRef('');
    const cityRef = useRef('');
    const pincodeRef = useRef('');
    const phoneNumberRef = useRef('');

    const phoneRegExp = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;

    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const previewImage = (e) => {
        setImgFile(URL.createObjectURL(e.target.files[0]));
    }

    const handlesetCopyInputs = () => {

        console.log('copy');
        setCopy(!copy);

        console.log(data);
        console.log(copy);
        setData({
            contact_name: contactNameRef.current.value,
            address_line1: addressLine1Ref.current.value,
            address_line2: addressLine2Ref.current.value,
            city: cityRef.current.value,
            pincode: pincodeRef.current.value,
            phoneNumber: phoneNumberRef.current.value,

            contact_name2: data === {} ? '' : contactNameRef.current.value,
            address_line1_2: data === {} ? '' : addressLine1Ref.current.value,
            address_line2_2: data === {} ? '' : addressLine2Ref.current.value,
            city2: data === {} ? '' : cityRef.current.value,
            pincode2: data === {} ? '' : pincodeRef.current.value,
            phoneNumber2: data === {} ? '' : phoneNumberRef.current.value,
        })
    }

    useEffect(() => {

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

                    { console.log(response.data.Items[0].scbscription_active) }
                    { console.log(response.data.Items[0].school_logoURL) }

                    let individual_client_data = response.data.Items[0];

                    let previousSubscription = response.data.Items[0].scbscription_active;
                    let previousImage = response.data.Items[0].school_logoURL;

                    setScbscription_active(previousSubscription);
                    setImgFile(previousImage);
                    setPreviousData(individual_client_data);

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
                    // setStatus({ success: false });
                    // setErrors({ submit: error.response.data });
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                    hideLoader();
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    hideLoader();
                }
            });

    }, []);


    return (
        <>
            {previousData.length === 0 || previousData.length === "0" ? <></> : (
                <>
                    {console.log(scbscription_active)}
                    {console.log(imgFile)}

                    < Formik
                        initialValues={{
                            schoolName: previousData === {} ? '' : previousData.school_name,
                            school_logo: "",
                            subscription_active: scbscription_active,
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
                        }}
                        validationSchema={
                            Yup.object().shape({
                                schoolName: Yup.string().max(255).required('School Name is required'),
                                contact_name: Yup.string().max(255).required('Contact Name is required'),
                                address_line1: Yup.string().max(255).required('Address Line 1 is required'),
                                address_line2: Yup.string().max(255).required('Address Line 2 is required'),
                                city: Yup.string().max(255).required('City is required'),
                                pincode: Yup.string().max(255).required('Pincode is required'),
                                phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').max(255).required('Phone Number is required'),
                                contact_name2: Yup.string().max(255).required('Contact Name is required'),
                                address_line1_2: Yup.string().max(255).required('Address Line 1 is required'),
                                address_line2_2: Yup.string().max(255).required('Address Line 2 is required'),
                                city2: Yup.string().max(255).required('City is required'),
                                pincode2: Yup.string().max(255).required('Pincode is required'),
                                phoneNumber2: Yup.string().matches(phoneRegExp, 'Phone number is not valid').max(255).required('Phone Number is required'),
                                gst_number: Yup.string().max(255).required('GST Number is required'),
                            })
                        }
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            setStatus({ success: true });
                            setSubmitting(true);

                            showLoader();

                            console.log("Submit clicked")

                            const formData = {
                                data: {
                                    school_id: id,
                                    school_name: values.schoolName,
                                    school_logo: 'testImage.png',
                                    subscription_active: scbscription_active,
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

                                            // contact_name: copy === true ? values.contact_name2 : values.contact_name,
                                            // address_line1: copy === true ? values.address_line1_2 : values.address_line1,
                                            // address_line2: copy === true ? values.address_line2_2 : values.address_line2,
                                            // city: copy === true ? values.city2 : values.city,
                                            // pincode: copy === true ? values.pincode2 : values.pincode,
                                            // phone_no: copy === true ? values.phoneNumber2 : values.phoneNumber,
                                            // GST_no: values.gst_number
                                        },
                                    }
                                }
                            };

                            console.log('form Data: ', formData)

                            let allFilesData = [];
                            const fileNameArray = ['school_logo'];

                            fileNameArray.forEach((fileName) => {
                                let selectedFile = document.getElementById(fileName).files[0];
                                console.log('File!');
                                console.log(selectedFile);
                                if (selectedFile) {
                                    console.log('File if!');
                                    allFilesData.push(selectedFile);
                                } else {
                                    console.log('File else!');
                                }
                            });

                            if (allFilesData.length === 0) {
                                showLoader();

                            } else {

                                if (areFilesInvalid(allFilesData) !== 0) {

                                    sweetAlertHandler("Invalid File!");
                                    hideLoader();

                                } else {

                                    showLoader();
                                    console.log('formData: ', formData);
                                }
                            }

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

                                        console.log(response.data[0].file_upload_url);

                                        const MySwal = withReactContent(Swal);
                                        MySwal.fire('', 'Your school has been updated!', 'success');
                                    } else {

                                        console.log('else res');

                                        hideLoader();
                                        // Request made and server responded
                                        setStatus({ success: false });
                                        setErrors({ submit: 'Error in generating OTP' });

                                    }
                                })
                                .catch((error) => {
                                    if (error.response) {
                                        hideLoader();
                                        // Request made and server responded
                                        console.log(error.response.data);
                                        setStatus({ success: false });
                                        setErrors({ submit: error.response.data });

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

                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit} className={className} {...rest}>

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
                                            <label className="floating-label" >
                                                <small className="text-danger">
                                                    * </small>
                                                Scbscription Active
                                            </label>
                                            {Constants.AddressForm.YesNo.map((radio, idx) => (
                                                <div key={idx}>
                                                    < div className="col-md-3" >
                                                        <div className="row profile-view-radio-button-view">
                                                            <Form.Check
                                                                key={idx}
                                                                id={`radio-fresher-${idx}`}
                                                                error={touched.fresher && errors.fresher}
                                                                type="radio"
                                                                variant={'outline-primary'}
                                                                name="radio-fresher"
                                                                value={radio.value}
                                                                checked={scbscription_active === radio.value}
                                                                onChange={(e) => setScbscription_active(e.currentTarget.value)}
                                                            // className='ml-3 col-md-6'
                                                            />
                                                            <Form.Label className="profile-view-question" id={`radio-fresher-${idx}`}>
                                                                {radio.label}
                                                            </Form.Label>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {touched.fresher && errors.fresher && <small className="text-danger form-text">{errors.fresher}</small>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">

                                    {/* <div className="col-md-3"></div> */}
                                    <div className="col-md-6">
                                        <div className="form-group fill">
                                            <label className="floating-label" >
                                                <small className="text-danger">
                                                    * </small>
                                                School Logo
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

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <img width={150} src={imgFile} alt="" className="img-fluid mb-3" />
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
                                                    onWheel={(e) => e.target.blur()}
                                                    type="number"
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
                                                    onWheel={(e) => e.target.blur()}
                                                    type="number"
                                                    ref={phoneNumberRef}
                                                    value={values.phoneNumber}
                                                />
                                                {touched.phoneNumber && errors.phoneNumber && (
                                                    <small className="text-danger form-text">{errors.phoneNumber}</small>
                                                )}
                                            </div>

                                            <Form.Check type='checkbox' id={`default-checkbox`} label={`Same as Primary Address`} checked={copy} onChange={handlesetCopyInputs} />



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
                                                    onWheel={(e) => e.target.blur()}
                                                    type="number"
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
                                                    onWheel={(e) => e.target.blur()}
                                                    type="number"
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
                                    </div>
                                </div>

                                {errors.submit && (
                                    <Col sm={12}>
                                        <Alert variant="danger">{errors.submit}</Alert>
                                    </Col>
                                )}

                                {loader}


                                <div className="row">
                                    <div className="form-group fill">
                                        <div className="center col-sm-12">
                                            <button color="success" disabled={isSubmitting} type="submit" className="btn-block btn btn-success btn-large">Save</button>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        )
                        }
                    </Formik >
                </>

            )}
        </>
    )
}

export default EditSchoolForm