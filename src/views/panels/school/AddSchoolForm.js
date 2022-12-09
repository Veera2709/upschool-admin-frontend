import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Pagination, Button, Modal, ModalBody, Form } from 'react-bootstrap';
import useFullPageLoader from '../../../helper/useFullPageLoader';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { areFilesInvalid } from '../../../util/utils';
import * as Constants from '../../../config/constant'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

// import { areFilesInvalid } from '../../../../util/utils';
// import { bgvAlerts } from '../bgv-api/bgvAlerts';

function AddSchool(className, rest, newUpload) {
    let [data, setData] = useState({});
    const [scbscription_active, setScbscription_active] = useState('No');
    const [copy, setCopy] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const contactNameRef = useRef('');
    const addressLine1Ref = useRef('');
    const addressLine2Ref = useRef('');
    const cityRef = useRef('');
    const pincodeRef = useRef('');
    const phoneNumberRef = useRef('');

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
            contact_name: contactNameRef.current.value,
            addressL_lne1: addressLine1Ref.current.value,
            address_line2: addressLine2Ref.current.value,
            city: cityRef.current.value,
            pincode: pincodeRef.current.value,
            phoneNumber: phoneNumberRef.current.value,

            contact_name2: data === {} ? '' : contactNameRef.current.value,
            addres_line1_2: data === {} ? '' : addressLine1Ref.current.value,
            address_line2_2: data === {} ? '' : addressLine2Ref.current.value,
            city2: data === {} ? '' : cityRef.current.value,
            pincode2: data === {} ? '' : pincodeRef.current.value,
            phone_number2: data === {} ? '' : phoneNumberRef.current.value,
        })
    }

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    school_name: "",
                    school_logo: "",
                    subscription_active: scbscription_active,

                    contact_name: data === {} ? '' : data.contact_name,
                    addressL_lne1: data === {} ? '' : data.addressL_lne1,
                    address_line2: data === {} ? '' : data.address_line2,
                    city: data === {} ? '' : data.city,
                    pincode: data === {} ? '' : data.pincode,
                    phone_number: data === {} ? '' : data.phoneNumber,

                    contact_name2: data === {} ? '' : data.contact_name,
                    addres_line1_2: data === {} ? '' : data.addressL_lne1,
                    address_line2_2: data === {} ? '' : data.address_line2,
                    city2: data === {} ? '' : data.city,
                    pincode2: data === {} ? '' : data.pincode,
                    phone_number2: data === {} ? '' : data.phoneNumber,
                    gst_number: data === {} ? '' : data.gst_number,


                }}
                validationSchema={Yup.object().shape({

                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    setSubmitting(true);
                    const formData = {
                        data: {
                            school_name: values.school_name,
                            school_logo: "",
                            subscription_active: scbscription_active,
                            school_contact_info: {
                                business_address: {
                                    contact_name: values.contact_name,
                                    addressL_lne1: values.addressL_lne1,
                                    address_line2: values.address_line2,
                                    city: values.city,
                                    pincode: values.pincode,
                                    phoneNumber: values.phoneNumber,
                                }
                            },
                            billing_address: {
                                contact_name2: copy === true ? values.contact_name : values.contact_name2,
                                addres_line1_2: copy === true ? values.addressL_lne1 : values.addres_line1_2,
                                address_line2_2: copy === true ? values.address_line2 : values.address_line2_2,
                                city2: copy === true ? values.city : values.city2,
                                pincode2: copy === true ? values.pincode : values.pincode2,
                                phone_number2: copy === true ? values.phoneNumber : values.phone_number2,
                                gst_number: ''
                            },
                        }


                        // schoolName: values.schoolName,
                        // email: values.email,
                        // // // subCategory: values.subCategory,
                        // primaryContact: values.primaryContact,
                        // secondaryContact: values.secondaryContact,

                        // contact_name: values.contact_name,
                        // addressL_lne1: values.addressL_lne1,
                        // address_line2: values.address_line2,
                        // city: values.city,
                        // pincode: values.pincode,
                        // phoneNumber: values.phoneNumber,

                        // contact_name2: data === true ? values.contact_name : values.contact_name2,
                        // addres_line1_2: data === true ? values.addressL_lne1 : values.addres_line1_2,
                        // address_line2_2: data === true ? values.address_line2 : values.address_line2_2,
                        // city2: data === true ? values.city : values.city2,
                        // pincode2: data === true ? values.pincode : values.pincode2,
                        // phone_number2: data === true ? values.phoneNumber : values.phone_number2,
                        // gst_number: ''
                    };
                    // console.log('formData: ', JSON.stringify(formData))
                    console.log('formData: ', formData)

                    let allFilesData = [];
                    const fileNameArray = ['curCrimAddressProof', 'permCrimAddressProof'];

                    fileNameArray.forEach((fileName) => {
                        let selectedFile = document.getElementById(fileName).files[0];
                        console.log('File is here!');
                        console.log(selectedFile);
                        if (selectedFile) {
                            allFilesData.push(selectedFile);
                        }
                    });

                    if (allFilesData.length === 0) {
                        showLoader();
                        console.log('formData: ', formData)
                        // _sendCriminalInfo(formData);
                    } else {
                        if (areFilesInvalid(allFilesData) !== 0) {
                            sweetAlertHandler("Invalid File!");
                            hideLoader();
                        } else {
                            showLoader();
                            console.log('formData: ', formData)
                            // _sendCriminalInfo(formData);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group fill">
                                    <label class="floating-label" for="schoolName">
                                        <small class="text-danger">* </small>
                                        School Name</label>
                                    <input class="form-control" name="school_name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text" value={values.school_name} />
                                </div>
                                <div class="form-group fill">
                                    <label class="floating-label" for="email">
                                        <small class="text-danger">* </small>Email</label>

                                    <input class="form-control" name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange} type="text" value={values.email} />
                                </div>
                                <div class="form-group fill">
                                    <label class="floating-label" for="email">
                                        <small class="text-danger">* </small>Scbscription Active</label>
                                    {Constants.AddressForm.YesNo.map((radio, idx) => (
                                        <>
                                            <div className="col-md-3">
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
                                        </>
                                    ))}
                                </div>
                                {/* <div class="form-group fill">
                                    <label class="floating-label" for="primaryContact">
                                        <small class="text-danger">* </small>
                                        Primary contact</label>
                                    <input class="form-control" name="primaryContact" type="number"
                                        onBlur={handleBlur}
                                        onChange={handleChange} value={values.primaryContact} onWheel={(e) => e.target.blur()} />
                                </div> */}
                                {/* <div class="form-group fill">
                                    <label class="floating-label" for="secondaryContact">
                                        <small class="text-danger">*
                                        </small>Secondary contact</label>
                                    <input class="form-control" name="secondaryContact" type="number" value={values.secondaryContact}
                                        onBlur={handleBlur}
                                        onChange={handleChange} onWheel={(e) => e.target.blur()} />
                                </div> */}
                                <div class="form-group fill"><label class="floating-label" for="slaAggrement">School Logo</label>
                                    <input class="form-control" name="school_logo" id="school_logo" type="file" value={values.school_logo} />
                                </div>
                                <div class="form-group fill">
                                    <label class="floating-label" for="businessAddress">
                                        <small class="text-danger">* </small>
                                        Business Address</label>

                                    <Row className="my-3">
                                        <Col sm={3}>
                                            <label>Contact Name</label>
                                        </Col>
                                        <Col sm={9}>
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
                                            {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                        </Col>
                                    </Row>

                                    <Row className="my-3">
                                        <Col sm={3}>
                                            <label>Address Line 1</label>
                                        </Col>
                                        <Col sm={9}>
                                            <input
                                                className="form-control"
                                                // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                name="addressL_lne1"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                // onWheel={(e) => e.target.blur()}
                                                type="text"
                                                ref={addressLine1Ref}
                                                value={values.addressL_lne1}
                                            />
                                            {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                        </Col>
                                    </Row>


                                    <Row className="my-3">
                                        <Col sm={3}>
                                            <label>Address Line 2</label>
                                        </Col>
                                        <Col sm={9}>
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
                                            {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                        </Col>
                                    </Row>


                                    <Row className="my-3">
                                        <Col sm={3}>
                                            <label>City</label>
                                        </Col>
                                        <Col sm={9}>
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
                                            {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                        </Col>
                                    </Row>


                                    <Row className="my-3">
                                        <Col sm={3}>
                                            <label>Pincode</label>
                                        </Col>
                                        <Col sm={9}>
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
                                            {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                        </Col>
                                    </Row>

                                    <Row className="my-3">
                                        <Col sm={3}>
                                            <label>Phone Number</label>
                                        </Col>
                                        <Col sm={9}>
                                            <input
                                                className="form-control"
                                                // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                                name="phoneNumber"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                onWheel={(e) => e.target.blur()}
                                                type="number"
                                                ref={phoneNumberRef}
                                                value={values.phoneNumber}
                                            />
                                            {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                        </Col>
                                    </Row>



                                    <Form.Check type='checkbox' id={`default-checkbox`} label={`Same as Primary Address`} checked={copy} onChange={handlesetCopyInputs} />



                                    {/* <textarea placeholder="Business Address" name="businessAddress" class="form-control text-area-class" rows="6"></textarea> */

                                    }
                                </div></div>
                            <div class="col-sm-6"><div class="form-group fill">
                                <label class="floating-label" for="billingAddress"><small class="text-danger">
                                    * </small>Billing Address</label>
                                <Row className="my-3">
                                    <Col sm={3}>
                                        <label>Contact Name</label>
                                    </Col>
                                    <Col sm={9}>
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
                                        {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                    </Col>
                                </Row>

                                <Row className="my-3">
                                    <Col sm={3}>
                                        <label>Address Line 1</label>
                                    </Col>
                                    <Col sm={9}>
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
                                        {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                    </Col>
                                </Row>


                                <Row className="my-3">
                                    <Col sm={3}>
                                        <label>Address Line 2</label>
                                    </Col>
                                    <Col sm={9}>
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
                                        {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                    </Col>
                                </Row>


                                <Row className="my-3">
                                    <Col sm={3}>
                                        <label>City</label>
                                    </Col>
                                    <Col sm={9}>
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
                                        {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                    </Col>
                                </Row>


                                <Row className="my-3">
                                    <Col sm={3}>
                                        <label>Pincode</label>
                                    </Col>
                                    <Col sm={9}>
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
                                        {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                    </Col>
                                </Row>

                                <Row className="my-3">
                                    <Col sm={3}>
                                        <label>Phone Number</label>
                                    </Col>
                                    <Col sm={9}>
                                        <input
                                            className="form-control"
                                            // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                            name="phone_number2"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            onWheel={(e) => e.target.blur()}
                                            type="number"
                                            // ref={permCrimPhoneNoRef}
                                            value={values.phone_number2}
                                        />
                                        {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                    </Col>
                                </Row>





                                <Row className="my-3">
                                    <Col sm={3}>
                                        <label>GST Number</label>
                                    </Col>
                                    <Col sm={9}>
                                        <input
                                            className="form-control"
                                            // error={touched.permCrimPhoneNo && errors.permCrimPhoneNo}
                                            name="gst_number"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            onWheel={(e) => e.target.blur()}
                                            type="number"
                                            // ref={permCrimPhoneNoRef}
                                            value={values.gst_number}
                                        />
                                        {/* {touched.permCrimPhoneNo && errors.permCrimPhoneNo && (
                                    <small className="text-danger form-text">{errors.permCrimPhoneNo}</small>
                                )} */}
                                    </Col>
                                </Row>








                                {/* <textarea placeholder="Billing Address" name="billingAddress" class="form-control text-area-class" rows="6"></textarea> */}
                            </div>
                                <div class="form-group fill">
                                    {/* <label class="floating-label" for="clientComponents">Choose Components</label>
                                    <div class=" css-b62m3t-container">
                                    <span id="react-select-6-live-region" class="css-1f43avz-a11yText-A11yText">
                                    </span>
                                    <span aria-live="polite" aria-atomic="false" aria-relevant="additions text" class="css-1f43avz-a11yText-A11yText">
                                    </span>
                                    <div class=" css-1t8y0t9-control">
                                    <div class=" css-319lph-ValueContainer">
                                    <div class=" css-14el2xx-placeholder" id="react-select-6-placeholder">Select...
                                    </div>
                                    <div class=" css-6j8wv5-Input" data-value=""><input class="" autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-6-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" aria-expanded="false" aria-haspopup="true" aria-controls="react-select-6-listbox" aria-owns="react-select-6-listbox" role="combobox" aria-describedby="react-select-6-placeholder" value="" />
                                    </div>
                                    </div>
                                    <div class=" css-1hb7zxy-IndicatorsContainer">
                                    <span class=" css-1okebmr-indicatorSeparator"></span>
                                            <div class=" css-tlfecz-indicatorContainer" aria-hidden="true">
                                            <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-tj5bde-Svg">
                                            <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z">
                                            </path>
                                            </svg>
                                            </div>
                                            </div>
                                            </div>
                                            </div>
                                            </div>
                                            <div class="form-group fill"><label class="floating-label" for="pricing">Pricing</label>
                                    <input class="form-control" name="pricing" type="number" disabled="" value="" /> */}
                                </div>
                            </div>
                        </div>
                        <div class="row">
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
