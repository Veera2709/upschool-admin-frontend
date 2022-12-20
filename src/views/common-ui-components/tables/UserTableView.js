import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Row, Col, Card, Pagination, Button, Modal, Alert } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { SessionStorage } from '../../../util/SessionStorage';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import MESSAGES from './../../../helper/messages';
import { isEmptyArray, decodeJWT } from '../../../util/utils';

import { GlobalFilter } from './GlobalFilter';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import dynamicUrl from '../../../helper/dynamicUrls';
import useFullPageLoader from '../../../helper/useFullPageLoader';


export const colourOptions = [
  { value: 'Education', label: 'Education', color: 'black' },
  { value: 'Address', label: 'Address', color: 'black' },
  { value: 'Employment', label: 'Employment', color: 'black' },
  { value: 'DatabaseCheck', label: 'DatabaseCheck', color: 'black', isFixed: true },
  { value: 'DrugTest', label: 'DrugTest', color: 'black' },
  { value: 'CreditCheck', label: 'CreditCheck', color: 'black' },
  { value: 'Criminal', label: 'Criminal', color: 'black', isFixed: true },
  { value: 'Identification', label: 'Identification', color: 'black' },
  { value: 'Reference', label: 'Reference', color: 'black' },
  { value: 'GapVerification', label: 'GapVerification', color: 'black' },
  { value: 'SocialMedia', label: 'SocialMedia', color: 'black' },
  { value: 'PoliceVerification', label: 'PoliceVerification', color: 'black' },
  { value: 'CompanyCheck', label: 'CompanyCheck', color: 'black' },
  { value: 'DirectorshipCheck', label: 'DirectorshipCheck', color: 'black' },
  { value: 'CvValidation', label: 'CvValidation', color: 'black' }
];

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
          entries
        </Col>
        <Col className="d-flex justify-content-end">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          {/* <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={modalOpen}>
            <i className="feather icon-plus" /> Add User
          </Button> */}

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

const UserData = (props) => {

  const { _data, fetchAllUsersData, pageURL } = props;

  const columns = React.useMemo(
    () => [
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
        Header: 'Email',
        accessor: 'user_email'
      },
      {
        Header: 'Phone',
        accessor: 'user_phone_no'
      },
      {
        Header: 'Options',
        accessor: 'action'
      }
    ],
    []
  );

  // const data = React.useMemo(() => makeData(50), []);

  const [userData, setUserData] = useState([]);
  const [individualUserData, setIndividualUserData] = useState([]);
  const [userDOB, setUserDOB] = useState('');
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [className_ID, setClassName_ID] = useState({});
  const [schoolName_ID, setSchoolName_ID] = useState({});
  const [previousSchool, setPreviousSchool] = useState('');
  const [previousClass, setPreviousClass] = useState('');
  const [_userID, _setUserID] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [validationObj, setValidationObj] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const { user_id } = decodeJWT(sessionStorage.getItem('user_jwt'));
  const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
  const [selectClassErr, setSelectClassErr] = useState(false);

  const classNameRef = useRef('');
  const schoolNameRef = useRef('');

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

        const returnValue = pageLocation === 'active-users' ? (
          MySwal.fire('', MESSAGES.INFO.DATA_SAFE, 'success')
        ) : (
          MySwal.fire('', MESSAGES.INFO.FAILED_TO_RESTORE, 'error')
        )
        return returnValue;
      }
    });
  };

  const saveUserId = (e, user_id, user_role) => {
    e.preventDefault();
    getIndividualUser(user_id, user_role);
    showLoader();
  };

  const saveUserIdDelete = (e, user_id, user_role, updateStatus) => {
    e.preventDefault();

    pageLocation === 'active-users' ? (
      sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, user_id, user_role, updateStatus)
    ) : (
      sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_DELETE }, user_id, user_role, updateStatus)
    )

  };

  const fetchUserData = () => {

    showLoader();

    let responseData = _data;
    // let responseData = [];

    console.log("responseData", responseData);

    let finalDataArray = [];
    for (let index = 0; index < responseData.length; index++) {
      responseData[index].id = index + 1;

      let userId;

      if (responseData[index].user_role === "Teacher") {
        userId = responseData[index].teacher_id;
        setValidationObj({
          firstName: Yup.string().max(255).required('First Name is required'),
          lastName: Yup.string().max(255).required('Last Name is required'),
          userEmail: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').max(255).required('Phone Number is required'),
          userRole: Yup.string().max(255).required('User Role is required'),
          school: Yup.string().max(255).required('School is required')
        })
      } else if (responseData[index].user_role === "Student") {

        userId = responseData[index].student_id;
        setValidationObj({
          firstName: Yup.string().max(255).required('First Name is required'),
          lastName: Yup.string().max(255).required('Last Name is required'),
          userEmail: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').max(255).required('Phone Number is required'),
          userRole: Yup.string().max(255).required('User Role is required'),
          class: Yup.string().max(255).required('Class is required'),
          section: Yup.string().max(255).required('Section is required'),
          school: Yup.string().max(255).required('School is required')
        })

      } else {
        userId = responseData[index].parent_id;
        setValidationObj({
          firstName: Yup.string().max(255).required('First Name is required'),
          lastName: Yup.string().max(255).required('Last Name is required'),
          userEmail: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').max(255).required('Phone Number is required'),
          userRole: Yup.string().max(255).required('User Role is required'),
          school: Yup.string().max(255).required('School is required')
        })
      }

      responseData[index]['action'] = (
        <>
          {console.log(pageLocation)}
          {pageLocation === 'active-users' ? (

            <>
              <Button size="sm" className="btn btn-icon btn-rounded btn-info" onClick={(e) => saveUserId(e, userId, responseData[index].user_role)}>
                <i className="feather icon-edit" /> &nbsp; Edit
              </Button>{' '}
              &nbsp;
              <Button
                size="sm"
                className="btn btn-icon btn-rounded btn-danger"
                onClick={(e) => saveUserIdDelete(e, userId, responseData[index].user_role, 'Archived')}
              >
                <i className="feather icon-trash-2" /> &nbsp;Delete
              </Button>
            </>

          ) : (

            <>

              <Button
                size="sm"
                className="btn btn-icon btn-rounded btn-primary"
                onClick={(e) => saveUserIdDelete(e, userId, responseData[index].user_role, 'Active')}
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
    setIsLoading(true);

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

          let classNameArr = response.data.classList.find(o => o.client_class_id === response.data.Items[0].class_id);
          let schoolNameArr = response.data.schoolList.find(o => o.school_id === response.data.Items[0].school_id);

          console.log(classNameArr);
          console.log(schoolNameArr);

          setClassName_ID(response.data.classList);
          setSchoolName_ID(response.data.schoolList);
          setPreviousSchool(schoolNameArr.school_name);
          classNameArr === "" || classNameArr === undefined || classNameArr === "undefined" || classNameArr === "N.A." ? setPreviousClass("Select Class") : setPreviousClass(classNameArr.client_class_name);
          setUserDOB(response.data.Items[0].user_dob)
          setIndividualUserData(individual_user_data);
          setIsEditModalOpen(true);
          _setUserID(user_id);

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
          sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
        } else if (error.request) {
          // The request was made but no response was received
          hideLoader();
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          hideLoader();
          console.log('Error', error.message);
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
          let newClassData = response.data.Items;
          setClassName_ID(newClassData);

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
          const responseData = await fetchAllUsersData(pageURL);
          if (responseData.status === 200) {
            fetchUserData();
          }
        } else {
          MySwal.fire('', MESSAGES.INFO.USER_DELETED, 'success');
          hideLoader();
          const responseData = await fetchAllUsersData(pageURL);

          console.log(responseData)
          if (responseData.status === 200) {
            fetchUserData();
          }
        }
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          hideLoader();
          console.log(error.response.data);
          sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
        } else if (error.request) {
          // The request was made but no response was received
          hideLoader();
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          hideLoader();
          console.log('Error', error.message);
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

          const responseData = await fetchAllUsersData(pageURL);
          if (responseData.status === 200) {
            fetchUserData();
          }
        } else {
          hideLoader();
          setIsEditModalOpen(false);
          sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.UpdatingUser });
          const responseData = await fetchAllUsersData(pageURL);
          if (responseData.status === 200) {
            fetchUserData();
          }
        }
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          hideLoader();
          console.log(error.response.data);
          setIsEditModalOpen(false);
          sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
        } else if (error.request) {
          // The request was made but no response was received
          hideLoader();
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          hideLoader();
          console.log('Error', error.message);
        }
      });
  };



  useEffect(() => {
    fetchUserData();
  }, [_data]);

  return (
    <div>
      {userData.length <= 0 ? (
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
                  Yup.object().shape(validationObj)
                }
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                  console.log("Submit")
                  setStatus({ success: true });
                  setSubmitting(true);

                  let data;

                  const selectedSchoolID = schoolName_ID.find((e) => e.school_name == schoolNameRef.current.value);

                  console.log(classNameRef.current.value);

                  if (values.userRole === 'Student') {

                    if (classNameRef.current.value === 'Select Class') {

                      setSelectClassErr(true);

                    } else {

                      const selectedClassID = isEmptyArray(className_ID) ? "N.A." : (

                        className_ID.find((e) => e.client_class_name == classNameRef.current.value).client_class_id
                      )

                      data = {

                        student_id: _userID,
                        class_id: selectedClassID,
                        school_id: selectedSchoolID.school_id,
                        section_id: values.section,
                        user_dob: values.user_dob,
                        user_firstname: values.firstName,
                        user_lastname: values.lastName,
                        user_email: values.userEmail,
                        user_phone_no: values.phoneNumber,
                        user_role: values.userRole

                      };

                    }

                  } else if (values.userRole === 'Teacher') {

                    data = {

                      teacher_id: _userID,
                      school_id: selectedSchoolID.school_id,
                      user_dob: values.user_dob,
                      user_firstname: values.firstName,
                      user_lastname: values.lastName,
                      user_email: values.userEmail,
                      user_phone_no: values.phoneNumber,
                      user_role: values.userRole

                    };

                  } else {

                    data = {

                      parent_id: _userID,
                      school_id: selectedSchoolID.school_id,
                      user_dob: values.user_dob,
                      user_firstname: values.firstName,
                      user_lastname: values.lastName,
                      user_email: values.userEmail,
                      user_phone_no: values.phoneNumber,
                      user_role: values.userRole

                    };

                  }

                  console.log(data);
                  showLoader();
                  _UpdateUser(data);
                }}
              >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
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
                              >

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

                              />
                              {touched.userRole && errors.userRole && <small className="text-danger form-text">{errors.userRole}</small>}
                            </div>
                          </Col>

                        </Row>

                        {individualUserData.class_id && individualUserData.section_id && className_ID && (
                          <>
                            <Row>

                              <Col>

                                <div className="form-group fill">
                                  <label className="floating-label" htmlFor="class">
                                    <small className="text-danger">* </small>Class
                                  </label>
                                  <select
                                    className="form-control"
                                    error={touched.class && errors.class}
                                    name="class"
                                    onBlur={handleBlur}
                                    onChange={() => {
                                      setSelectClassErr(false)
                                    }}
                                    type="text"
                                    ref={classNameRef}
                                    // value={values.class}
                                    defaultValue={previousClass}
                                  >

                                    {
                                      console.log("previousClass", previousClass)
                                    }
                                    <option>Select Class</option>

                                    {console.log("className_ID", className_ID)}
                                    {className_ID.map((classData) => {

                                      return <option key={classData.client_class_id}>
                                        {classData.client_class_name}
                                      </option>

                                    })}

                                  </select>
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
                                  <input
                                    className="form-control"
                                    error={touched.section && errors.section}
                                    name="section"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.section}

                                  />
                                  {touched.section && errors.section && <small className="text-danger form-text">{errors.section}</small>}
                                </div>
                              </Col>
                            </Row>
                          </>


                        )}

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
      )
      }

    </div >
  );
};

export default UserData;