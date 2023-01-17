import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Row, Col, Card, Pagination, Button, Modal, Alert } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { SessionStorage } from '../../../../util/SessionStorage';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import MESSAGES from '../../../../helper/messages';
import { isEmptyArray, decodeJWT } from '../../../../util/utils';
import { fetchSectionByClientClassId } from "../../../api/CommonApi";
import { GlobalFilter } from '../../../common-ui-components/tables/GlobalFilter';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import BasicSpinner from '../../../../helper/BasicSpinner';

function Table({ columns, data, modalOpen }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,

        globalFilter,
        setGlobalFilter,

        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 }
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    return (
        <>
            <Row className="mb-3">
                <Col className="d-flex align-items-center">
                    Show
                    <select
                        className="form-control w-auto mx-2"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                        }}
                    >
                        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    Entries
                </Col>
                <Col className="d-flex justify-content-end">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

                    <Link to={'/admin-portal/add-users'}>
                        <Button variant="success" className="btn-sm btn-round has-ripple ml-2">
                            <i className="feather icon-plus" /> Add Users
                        </Button>
                    </Link>
                </Col>
            </Row>

            <BTable striped bordered hover responsive {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {// Add a sort direction indicator //
                                    }
                                    <span>
                                        {column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <span className="feather icon-arrow-down text-muted float-right" />
                                            ) : (
                                                <span className="feather icon-arrow-up text-muted float-right" />
                                            )
                                        ) : (
                                            ''
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </BTable>


            <Row className="justify-content-between">
                <Col>
                    <span className="d-flex align-items-center">
                        Page{' '}
                        <strong>
                            {' '}
                            {pageIndex + 1} of {pageOptions.length}{' '}
                        </strong>{' '}
                        | Go to page:{' '}
                        <input
                            className="form-control ml-2"
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                gotoPage(page);
                            }}
                            onWheel={(e) => e.target.blur()}
                            style={{ width: '100px' }}
                        />
                    </span>
                </Col>
                <Col>
                    <Pagination className="justify-content-end">
                        <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
                        <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
                        <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
                        <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
                    </Pagination>
                </Col>
            </Row>
        </>
    );
}

const UserTableViewStudent = ({ _userRole }) => {

    console.log(_userRole);

    const columns = React.useMemo(() => [
        {
            Header: '#',
            accessor: 'id'
        },
        {
            Header: 'First Name',
            accessor: 'user_firstname'
        },
        {
            Header: 'Last Name',
            accessor: 'user_lastname'
        },
        {
            Header: 'DOB',
            accessor: 'user_dob.dd_mm_yyyy'
        },
        {
            Header: 'Options',
            accessor: 'action'
        }
    ], []);
    const colourOptions = [];
    const multiDropDownValues = [];
    const history = useHistory();
    const [userData, setUserData] = useState([]);
    const [individualUserData, setIndividualUserData] = useState([]);
    const [userDOB, setUserDOB] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [className_ID, setClassName_ID] = useState();
    const [schoolId, setSchoolId] = useState();
    const [sectionId, setSectionId] = useState();

    const [multiDropOptions, setMultiDropOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const [schoolName_ID, setSchoolName_ID] = useState({});
    const [previousSchool, setPreviousSchool] = useState('');
    const [previousClass, setPreviousClass] = useState('');
    const [defaultClass, setDefaultClass] = useState([]);
    const [defaultSection, setDefaultSection] = useState([]);
    const [_userID, _setUserID] = useState('');

    const [isOpen, setIsOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const { user_id } = decodeJWT(sessionStorage.getItem('user_jwt'));
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [selectClassErr, setSelectClassErr] = useState(false);
    const [selectSectionErr, setSelectSectionErr] = useState(false);
    const [_data, _setData] = useState([]);
    const classNameRef = useRef('');
    const schoolNameRef = useRef('');

    console.log("options", options);
    console.log("multiDropOptions", multiDropOptions);


    const phoneRegExp = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const sweetConfirmHandler = (alert, user_id, user_role, updateStatus) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type,
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                showLoader();
                deleteUser(user_id, user_role, updateStatus);
            } else {

                // const returnValue = pageLocation === 'active-users' ? (
                //   MySwal.fire('', MESSAGES.INFO.DATA_SAFE, 'success')
                // ) : (
                //   MySwal.fire('', MESSAGES.INFO.FAILED_TO_RESTORE, 'error')
                // )
                // return returnValue;
            }
        });
    };

    const saveUserId = (e, user_id, user_role) => {
        e.preventDefault();
        showLoader();
        getIndividualUser(user_id, user_role);

    };

    const saveUserIdDelete = (e, user_id, user_role, updateStatus) => {
        e.preventDefault();

        pageLocation === 'active-users' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, user_id, user_role, updateStatus)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the user!' }, user_id, user_role, updateStatus)
        )

    };

    const getIndividualUser = (user_id, user_role) => {
        // setEditUsersId(user_id);

        const values = {
            user_id: user_id,
            user_role: user_role
        };

        console.log(values);

        axios
            .post(
                dynamicUrl.fetchIndividualUserByRole,
                { data: values },
                {
                    headers: { Authorization: SessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {

                console.log(response.data);
                console.log(response.data.Items[0]);
                hideLoader();

                if (response.data.Items[0]) {

                    let individual_user_data = response.data.Items[0];
                    console.log({ individual_user_data });
                    setSchoolId(response.data.Items[0].school_id)
                    setSectionId(response.data.Items[0].section_id)
                    setClassName_ID(response.data.Items[0].class_id)
                    let classNameArr = response.data.classList.find(o => o.client_class_id === response.data.Items[0].class_id);
                    let sectionArr = response.data.sectionList.find(o => o.section_id === response.data.Items[0].section_id);
                    let schoolNameArr = response.data.schoolList.find(o => o.school_id === response.data.Items[0].school_id);

                    console.log(classNameArr);
                    console.log(schoolNameArr);

                    setDefaultClass({ value: classNameArr.client_class_id, label: classNameArr.client_class_name })
                    setDefaultSection({ value: sectionArr.section_id, label: sectionArr.section_name })

                    console.log("response.data.classList", response.data.classList.length);
                    response.data.classList.forEach((item, index) => {
                        colourOptions.push({ value: item.client_class_id, label: item.client_class_name })
                    })
                    setOptions(colourOptions)

                    setSchoolName_ID(response.data.schoolList);
                    // setPreviousSchool(schoolNameArr.school_name);
                    schoolNameArr === "" || schoolNameArr === undefined || schoolNameArr === "undefined" || schoolNameArr === "N.A." ? setPreviousSchool("Select School") : setPreviousSchool(schoolNameArr.school_name);
                    classNameArr === "" || classNameArr === undefined || classNameArr === "undefined" || classNameArr === "N.A." ? setPreviousClass("Select Class") : setPreviousClass(classNameArr.client_class_name);
                    setUserDOB(response.data.Items[0].user_dob);
                    setIndividualUserData(individual_user_data);
                    setIsEditModalOpen(true);
                    _setUserID(user_id);



                    response.data.sectionList.forEach((item, index) => {
                        multiDropDownValues.push({ value: item.section_id, label: item.section_name })
                    })
                    setMultiDropOptions(multiDropDownValues)

                } else {

                    setIsEditModalOpen(true);
                }

            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    setIsEditModalOpen(false);
                    hideLoader();

                    if (error.response.data === 'Invalid Token') {

                        sessionStorage.clear();
                        localStorage.clear();

                        history.push('/auth/signin-1');
                        window.location.reload();

                    } else {

                        sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
                        fetchUserData();
                    }

                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                    fetchUserData();
                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                    fetchUserData();
                }
            });
    };

    const handleSchoolChange = () => {

        const filteredResult = schoolName_ID.find((e) => e.school_name == schoolNameRef.current.value);

        console.log(filteredResult.school_id);
        console.log(filteredResult.school_name);

        let sendData = {
            data: {
                school_id: filteredResult.school_id
            }
        }

        console.log(sendData);

        axios
            .post(
                dynamicUrl.fetchClassBasedOnSchool,
                {
                    data: {
                        school_id: filteredResult.school_id
                    }
                },
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {

                console.log(response.status === 200);
                let result = response.status === 200;

                hideLoader();
                if (result) {

                    console.log('inside res', response.data);
                    // let newClassData = response.data.Items;
                    // setClassName_ID(newClassData);

                } else {
                    console.log('else res');
                    hideLoader();

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

                        fetchUserData();
                    }

                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                    hideLoader();
                    fetchUserData();

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    hideLoader();
                    fetchUserData();

                }
            });

    }

    const deleteUser = (user_id, user_role, updateStatus) => {
        const values = {
            user_id: user_id,
            user_role: user_role,
            user_status: updateStatus
        };

        console.log(values);

        axios
            .post(dynamicUrl.toggleUserStatus,
                {
                    data: {
                        user_id: user_id,
                        user_role: user_role,
                        user_status: updateStatus
                    }
                }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
            .then(async (response) => {
                if (response.Error) {
                    hideLoader();
                    sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                    fetchUserData();


                } else {

                    hideLoader();

                    updateStatus === 'Active' ? (

                        MySwal.fire('', MESSAGES.INFO.USER_RESTORED, 'success')

                    ) : (
                        MySwal.fire('', MESSAGES.INFO.USER_DELETED, 'success')
                    )

                    fetchUserData();

                }
            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    hideLoader();
                    console.log(error.response.data);

                    if (error.response.data === 'Invalid Token') {

                        sessionStorage.clear();
                        localStorage.clear();

                        history.push('/auth/signin-1');
                        window.location.reload();

                    } else {

                        sweetAlertHandler({ title: 'Sorry', type: 'warning', text: error.response.data });
                        fetchUserData();
                    }


                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                    fetchUserData();

                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                    fetchUserData();

                }
            });
    };

    const openHandler = () => {
        setIsOpen(true);
    };

    const _UpdateUser = (data) => {
        console.log(data);
        console.log('Submitted');

        axios
            .post(dynamicUrl.updateUsersByRole, { data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
            .then(async (response) => {

                console.log({ response });
                if (response.Error) {
                    hideLoader();
                    setIsEditModalOpen(false);
                    sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.UpdatingUser });

                    fetchUserData();


                } else {
                    hideLoader();
                    setIsEditModalOpen(false);
                    sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.UpdatingUser });

                    fetchUserData();


                }
            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    hideLoader();
                    console.log(error.response.data);
                    setIsEditModalOpen(false);

                    if (error.response.data === 'Invalid Token') {

                        sessionStorage.clear();
                        localStorage.clear();

                        history.push('/auth/signin-1');
                        window.location.reload();

                    } else {

                        sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
                        fetchUserData();
                    }

                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                    fetchUserData();

                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                    fetchUserData();

                }
            });
    };

    const updateValues = (_data) => {
        let responseData = _data;
        // let responseData = [];

        console.log("responseData", responseData);

        let finalDataArray = [];
        for (let index = 0; index < responseData.length; index++) {
            responseData[index].id = index + 1;


            responseData[index]['action'] = (
                <>

                    {pageLocation === 'active-users' ? (

                        <>

                            <Button size="sm" className="btn btn-icon btn-rounded btn-info" onClick={(e) => saveUserId(e, responseData[index].student_id, responseData[index].user_role)}>
                                <i className="feather icon-edit" /> &nbsp; Edit
                            </Button>{' '}
                            &nbsp;
                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-danger"
                                onClick={(e) => saveUserIdDelete(e, responseData[index].student_id, responseData[index].user_role, 'Archived')}
                            >
                                <i className="feather icon-trash-2" /> &nbsp;Delete
                            </Button>
                        </>

                    ) : (

                        <>

                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-primary"
                                onClick={(e) => saveUserIdDelete(e, responseData[index].student_id, responseData[index].user_role, 'Active')}
                            >
                                <i className="feather icon-plus" /> &nbsp;Restore
                            </Button>
                        </>

                    )}

                </>
            );
            finalDataArray.push(responseData[index]);
        }
        console.log(finalDataArray);
        setUserData(finalDataArray);
        setIsLoading(false);
    }

    const fetchUserData = () => {

        console.log("fetch User Data calling");
        setIsLoading(true);
        // showLoader();

        const payLoadStatus = pageLocation === "active-users" ? 'Active' : 'Archived';

        axios.post(dynamicUrl.fetchAllUsersData, {
            data: {
                user_role: _userRole,
                user_status: payLoadStatus
            }
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {

                let resultData = response.data;
                console.log("resultData", response.data);
                console.log("resultData", resultData);

                if (resultData) {

                    setIsLoading(false);
                    updateValues(resultData);

                }

            })
            .catch((error) => {
                console.log(error.response.data);

                if (error.response.data === 'Invalid Token') {

                    sessionStorage.clear();
                    localStorage.clear();

                    history.push('/auth/signin-1');
                    window.location.reload();

                } else {

                    fetchUserData();
                }

            })

    };

    useEffect(() => {
        const validateJWT = sessionStorage.getItem('user_jwt');

        if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

        }
        else {
            fetchUserData();
        }

    }, [pageLocation]);

    useEffect(() => {
        const validateJWT = sessionStorage.getItem('user_jwt');

        if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

        }
        else {
            fetchUserData();
        }

    }, [_userRole]);

    const classOption = async (e) => {
        // setDefaultSection({ value: '', label: 'Select Section' })
        console.log("class Option", e);
        setClassName_ID(e.value)
        const ClientClassId = await fetchSectionByClientClassId(e.value);
        if (ClientClassId.Error) {
            console.log('ClientClassId.Error', ClientClassId.Error);
        } else {
            console.log('ClientClassId', ClientClassId.Items);
            const resultData = ClientClassId.Items
            resultData.forEach((item, index) => {
                multiDropDownValues.push({ value: item.section_id, label: item.section_name })
            })
            setMultiDropOptions(multiDropDownValues)
        }

    };

    const GetSectionId = (event) => {
        console.log("event", event.target.value);
        setSectionId(event.target.value)
    }

    return (

        <React.Fragment>
            <div>

                {isLoading ? (
                    <BasicSpinner />
                ) : (
                    <>

                        {
                            userData.length <= 0 && _data ? (
                                <div>

                                    <h3 style={{ textAlign: 'center' }}>No Users Found</h3>
                                    <div className="form-group fill text-center">
                                        <br></br>

                                        <Link to={'/admin-portal/add-users'}>
                                            <Button variant="success" className="btn-sm btn-round has-ripple ml-2">
                                                <i className="feather icon-plus" /> Add Users
                                            </Button>
                                        </Link>
                                    </div>

                                </div>
                            ) : (

                                <>
                                    {_data && (

                                        <>

                                            < React.Fragment >
                                                <Row>
                                                    <Col sm={12}>
                                                        <Card>
                                                            <Card.Header>
                                                                <Card.Title as="h5">User List</Card.Title>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <Table columns={columns} data={userData} modalOpen={openHandler} />
                                                            </Card.Body>
                                                        </Card>

                                                    </Col>
                                                </Row>
                                            </React.Fragment>

                                            <Modal dialogClassName="my-modal" show={isEditModalOpen} onHide={() => setIsEditModalOpen(false)}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title as="h5">Update User</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <Formik
                                                        initialValues={{
                                                            firstName: individualUserData.user_firstname,
                                                            lastName: individualUserData.user_lastname,
                                                            userEmail: individualUserData.user_email,
                                                            phoneNumber: individualUserData.user_phone_no,
                                                            userRole: individualUserData.user_role,
                                                            user_dob: userDOB.yyyy_mm_dd,
                                                            class: individualUserData.class_id,
                                                            section: individualUserData.section_id,
                                                            school: individualUserData.school_id

                                                            //individualUserData.user_dob.yyyy_mm_dd

                                                        }}
                                                        validationSchema={
                                                            Yup.object().shape({
                                                                firstName: Yup.string().max(255).required('First Name is required'),
                                                                lastName: Yup.string().max(255).required('Last Name is required'),
                                                                userEmail: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                                                                phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').max(255).required('Phone Number is required'),
                                                                userRole: Yup.string().max(255).required('User Role is required'),
                                                                class: Yup.string().max(255).required('Class is required'),
                                                                section: Yup.string().max(255).required('Section is required'),
                                                                school: Yup.string().max(255).required('School is required')
                                                            })
                                                        }
                                                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                                                            console.log("Submit")
                                                            setStatus({ success: true });
                                                            setSubmitting(true);

                                                            let data;

                                                            const selectedSchoolID = schoolName_ID.find((e) => e.school_name == schoolNameRef.current.value);

                                                            console.log(selectedSchoolID);
                                                            console.log(classNameRef.current.value);

                                                            // if (classNameRef.current.value === 'Select Class') {

                                                            //     setSelectClassErr(true);    

                                                            // } else {

                                                            //     const selectedClassID = isEmptyArray(className_ID) ? "N.A." : (

                                                            //         className_ID.find((e) => e.client_class_name == classNameRef.current.value).client_class_id
                                                            //     )

                                                            if (className_ID === undefined || className_ID === '') {
                                                                setSelectClassErr(true)
                                                            } else if (sectionId === undefined || sectionId === '' || sectionId == 'Select Section') {
                                                                setSelectSectionErr(true)
                                                            } else {
                                                                data = {

                                                                    student_id: _userID,
                                                                    class_id: className_ID,
                                                                    school_id: selectedSchoolID.school_id,
                                                                    section_id: sectionId,
                                                                    user_dob: values.user_dob,
                                                                    user_firstname: values.firstName,
                                                                    user_lastname: values.lastName,
                                                                    user_email: values.userEmail,
                                                                    user_phone_no: values.phoneNumber,
                                                                    user_role: values.userRole

                                                                };

                                                                console.log(data);
                                                                showLoader();
                                                                _UpdateUser(data);
                                                            }
                                                        }

                                                        }
                                                    // }
                                                    >
                                                        {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                                                            <form noValidate onSubmit={handleSubmit}>
                                                                <Row>
                                                                    <Col>
                                                                        <Row>
                                                                            <Col>
                                                                                <div className="form-group fill">
                                                                                    <label className="floating-label" htmlFor="firstName">
                                                                                        <small className="text-danger">* </small>First Name
                                                                                    </label>
                                                                                    <input
                                                                                        className="form-control"
                                                                                        error={touched.firstName && errors.firstName}
                                                                                        name="firstName"
                                                                                        onBlur={handleBlur}
                                                                                        onChange={handleChange}
                                                                                        type="text"
                                                                                        value={values.firstName}
                                                                                    />
                                                                                    {touched.firstName && errors.firstName && <small className="text-danger form-text">{errors.firstName}</small>}
                                                                                </div>
                                                                            </Col>

                                                                            <Col>
                                                                                <div className="form-group fill">
                                                                                    <label className="floating-label" htmlFor="lastName">
                                                                                        <small className="text-danger">* </small>Last Name
                                                                                    </label>
                                                                                    <input
                                                                                        className="form-control"
                                                                                        error={touched.lastName && errors.lastName}
                                                                                        name="lastName"
                                                                                        onBlur={handleBlur}
                                                                                        onChange={handleChange}
                                                                                        type="text"
                                                                                        value={values.lastName}
                                                                                    />
                                                                                    {touched.lastName && errors.lastName && <small className="text-danger form-text">{errors.lastName}</small>}
                                                                                </div>
                                                                            </Col>

                                                                        </Row>

                                                                        <Row>

                                                                            <Col>

                                                                                <div className="form-group fill">
                                                                                    <label className="floating-label" htmlFor="class">
                                                                                        <small className="text-danger">* </small>School
                                                                                    </label>
                                                                                    {console.log(previousSchool)}
                                                                                    <select
                                                                                        className="form-control"
                                                                                        error={touched.school && errors.school}
                                                                                        name="school"
                                                                                        onBlur={handleBlur}
                                                                                        // onChange={handleChange}
                                                                                        onChange={handleSchoolChange}
                                                                                        type="text"
                                                                                        ref={schoolNameRef}
                                                                                        // value={values.school}
                                                                                        defaultValue={previousSchool}
                                                                                        disabled={true}
                                                                                    >

                                                                                        <option>Select School</option>

                                                                                        {schoolName_ID.map((schoolData) => {

                                                                                            return <option key={schoolData.school_id}>
                                                                                                {schoolData.school_name}
                                                                                            </option>

                                                                                        })}

                                                                                    </select>
                                                                                    {touched.school && errors.school && (
                                                                                        <small className="text-danger form-text">{errors.school}</small>
                                                                                    )}
                                                                                </div>
                                                                            </Col>


                                                                            <Col>
                                                                                <div className="form-group fill">
                                                                                    <label className="floating-label" htmlFor="userRole">
                                                                                        <small className="text-danger">* </small>Role
                                                                                    </label>
                                                                                    <input
                                                                                        className="form-control"
                                                                                        error={touched.userRole && errors.userRole}
                                                                                        name="userRole"
                                                                                        onBlur={handleBlur}
                                                                                        onChange={handleChange}
                                                                                        type="text"
                                                                                        value={values.userRole}
                                                                                        readOnly={true}
                                                                                    />


                                                                                </div>
                                                                            </Col>

                                                                        </Row>

                                                                        {individualUserData.class_id && individualUserData.section_id ? (
                                                                            <>
                                                                                <Row>

                                                                                    <Col>

                                                                                        <div className="form-group fill">
                                                                                            <label className="floating-label" htmlFor="class">
                                                                                                <small className="text-danger">* </small>Class
                                                                                            </label>
                                                                                            <Select
                                                                                                defaultValue={defaultClass}
                                                                                                className="basic-single"
                                                                                                classNamePrefix="select"
                                                                                                label="client_class_id"
                                                                                                name="client_class_id"
                                                                                                options={options}
                                                                                                onBlur={(event) => { handleBlur(event) }}
                                                                                                onChange={(event) => {
                                                                                                    setFieldValue('section_id', '')
                                                                                                    classOption(event)

                                                                                                }}
                                                                                            />
                                                                                            {touched.class && errors.class && (
                                                                                                <small className="text-danger form-text">{errors.class}</small>
                                                                                            )}
                                                                                            {selectClassErr && (

                                                                                                <small className="text-danger form-text">Please select a class</small>

                                                                                            )}
                                                                                        </div>
                                                                                    </Col>

                                                                                    <Col>
                                                                                        <div className="form-group fill">
                                                                                            <label className="floating-label" htmlFor="section">
                                                                                                <small className="text-danger">* </small>Section
                                                                                            </label>
                                                                                            {/* <Select
                                                                                                defaultValue={defaultSection}
                                                                                                className="basic-single"
                                                                                                label="section_id"
                                                                                                classNamePrefix="select"
                                                                                                name="section_id"
                                                                                                options={multiDropOptions}
                                                                                                onChange={(event) => {
                                                                                                    GetSectionId(event)
                                                                                                }}
                                                                                            /> */}
                                                                                            <select
                                                                                                className="form-control"
                                                                                                error={touched.section_id && errors.section_id}
                                                                                                name="section_id"
                                                                                                onBlur={handleBlur}
                                                                                                type="text"
                                                                                                value={sectionId}
                                                                                                onChange={(event) =>{GetSectionId(event);setSelectSectionErr(false)} }
                                                                                            >                                                <option>                                    Select Section
                                                                                                </option>                                                {multiDropOptions.map((optionsData) => {
                                                                                                    return <option
                                                                                                        value={optionsData.value}
                                                                                                        key={optionsData.value}
                                                                                                    >                                                        {optionsData.label}
                                                                                                    </option>
                                                                                                })}
                                                                                            </select>
                                                                                            {selectSectionErr && (

                                                                                                <small className="text-danger form-text">Please select a Section</small>

                                                                                            )}
                                                                                            {touched.section && errors.section && <small className="text-danger form-text">{errors.section}</small>}
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>

                                                                                <Row>
                                                                                    <Col>
                                                                                        <div className="form-group fill">
                                                                                            <label className="floating-label" htmlFor="userEmail">
                                                                                                <small className="text-danger">* </small>Email ID
                                                                                            </label>
                                                                                            <input
                                                                                                className="form-control"
                                                                                                error={touched.userEmail && errors.userEmail}
                                                                                                name="userEmail"
                                                                                                onBlur={handleBlur}
                                                                                                onChange={handleChange}
                                                                                                type="email"
                                                                                                value={values.userEmail}
                                                                                                readOnly={true}
                                                                                            />
                                                                                            {touched.userEmail && errors.userEmail && <small className="text-danger form-text">{errors.userEmail}</small>}
                                                                                        </div>
                                                                                    </Col>
                                                                                    <Col>
                                                                                        <div className="form-group fill">
                                                                                            <label className="floating-label" htmlFor="phoneNumber">
                                                                                                <small className="text-danger">* </small>Phone No
                                                                                            </label>
                                                                                            <input
                                                                                                className="form-control"
                                                                                                error={touched.phoneNumber && errors.phoneNumber}
                                                                                                name="phoneNumber"
                                                                                                onBlur={handleBlur}
                                                                                                onChange={handleChange}
                                                                                                type="number"
                                                                                                value={values.phoneNumber}
                                                                                                readOnly={true}
                                                                                            />
                                                                                            {touched.phoneNumber && errors.phoneNumber && <small className="text-danger form-text">{errors.phoneNumber}</small>}
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                            </>

                                                                        ) : (
                                                                            <>
                                                                                <Row>
                                                                                    <Col>
                                                                                        <div className="form-group fill">
                                                                                            <label className="floating-label" htmlFor="userEmail">
                                                                                                <small className="text-danger">* </small>Email ID
                                                                                            </label>
                                                                                            <input
                                                                                                className="form-control"
                                                                                                error={touched.userEmail && errors.userEmail}
                                                                                                name="userEmail"
                                                                                                onBlur={handleBlur}
                                                                                                onChange={handleChange}
                                                                                                type="email"
                                                                                                value={values.userEmail}

                                                                                            />
                                                                                            {touched.userEmail && errors.userEmail && <small className="text-danger form-text">{errors.userEmail}</small>}
                                                                                        </div>
                                                                                    </Col>
                                                                                    <Col>
                                                                                        <div className="form-group fill">
                                                                                            <label className="floating-label" htmlFor="phoneNumber">
                                                                                                <small className="text-danger">* </small>Phone No
                                                                                            </label>
                                                                                            <input
                                                                                                className="form-control"
                                                                                                error={touched.phoneNumber && errors.phoneNumber}
                                                                                                name="phoneNumber"
                                                                                                onBlur={handleBlur}
                                                                                                onChange={handleChange}
                                                                                                type="number"
                                                                                                value={values.phoneNumber}

                                                                                            />
                                                                                            {touched.phoneNumber && errors.phoneNumber && <small className="text-danger form-text">{errors.phoneNumber}</small>}
                                                                                        </div>
                                                                                    </Col>
                                                                                </Row>
                                                                            </>
                                                                        )}



                                                                        <Row>

                                                                            <Col>
                                                                                <div className="form-group fill">
                                                                                    <label className="floating-label" htmlFor="user_dob">
                                                                                        <small className="text-danger">* </small>DOB
                                                                                    </label>
                                                                                    <input
                                                                                        className="form-control"
                                                                                        error={touched.user_dob && errors.user_dob}
                                                                                        name="user_dob"
                                                                                        onBlur={handleBlur}
                                                                                        onChange={handleChange}
                                                                                        type="date"
                                                                                        value={values.user_dob}

                                                                                    />
                                                                                    {touched.user_dob && errors.user_dob && <small className="text-danger form-text">{errors.user_dob}</small>}
                                                                                </div>
                                                                            </Col>

                                                                            <Col></Col>
                                                                        </Row>

                                                                        {errors.submit && (
                                                                            <Col sm={12}>
                                                                                <Alert variant="danger">{errors.submit}</Alert>
                                                                            </Col>
                                                                        )}


                                                                        <hr />

                                                                        <Row>

                                                                            <Col></Col>

                                                                            <Button type="submit" color="success" variant="success">
                                                                                Update
                                                                            </Button>


                                                                        </Row>


                                                                    </Col>
                                                                </Row>
                                                            </form>
                                                        )}
                                                    </Formik>
                                                </Modal.Body>
                                            </Modal>
                                        </>
                                    )}

                                </>
                            )
                        }
                    </>
                )

                }



            </div >
            {loader}
        </React.Fragment>
    );
};

export default UserTableViewStudent;
