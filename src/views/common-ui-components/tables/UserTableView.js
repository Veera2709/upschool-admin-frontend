import React, { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Row, Col, Card, Pagination, Button, Modal, Alert } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { SessionStorage } from '../../../util/SessionStorage';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import MESSAGES from './../../../helper/messages';
import * as Constants from '../../../helper/constants';

import { GlobalFilter } from './GlobalFilter';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import dynamicUrl from '../../../helper/dynamicUrls';
import { decodeJWT } from '../../../util/utils';
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

  const { _data } = props;

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
        Header: 'Role',
        accessor: 'user_role'
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
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [validationObj, setValidationObj] = useState({});

  const [clients, setClients] = useState([]);
  const [multiSelectClients, setMultiSelectClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState('N.A.');
  const [isLoading, setIsLoading] = useState(false);
  const { user_id } = decodeJWT(sessionStorage.getItem('user_jwt'));
  const { user_client_id } = decodeJWT(sessionStorage.getItem('user_jwt'));
  const [userId, setUserId] = useState(user_id);
  const [supervisor, setSupervisor] = useState('N.A.');
  const [editUsersId, setEditUsersId] = useState('');

  const phoneRegExp = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;

  const MySwal = withReactContent(Swal);

  const sweetAlertHandler = (alert) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  const sweetConfirmHandler = (alert, user_id) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      type: alert.type,
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.value) {
        showLoader();
        deleteUser(user_id);
      } else {
        return MySwal.fire('', MESSAGES.INFO.DATA_SAFE, 'error');
      }
    });
  };

  const saveUserId = (e, user_id) => {
    e.preventDefault();
    getIndividualUser(user_id);
    showLoader();
  };

  const saveUserIdDelete = (e, user_id) => {
    e.preventDefault();
    sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.NOT_ABLE_TO_RECOVER }, user_id);
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
          userRole: Yup.string().max(255).required('User Role is required')
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
        })

      } else {
        userId = responseData[index].parent_id;
        setValidationObj({
          firstName: Yup.string().max(255).required('First Name is required'),
          lastName: Yup.string().max(255).required('Last Name is required'),
          userEmail: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').max(255).required('Phone Number is required'),
          userRole: Yup.string().max(255).required('User Role is required')
        })
      }

      responseData[index]['action'] = (
        <>
          <Button size="sm" className="btn btn-icon btn-rounded btn-info" onClick={(e) => saveUserId(e, userId)}>
            <i className="feather icon-edit" /> &nbsp; Edit
          </Button>{' '}
          &nbsp;
          <Button
            size="sm"
            className="btn btn-icon btn-rounded btn-danger"
            onClick={(e) => saveUserIdDelete(e, responseData[index].user_id)}
          >
            <i className="feather icon-delete" /> &nbsp; Delete
          </Button>
        </>
      );
      finalDataArray.push(responseData[index]);
    }
    console.log(finalDataArray);
    setUserData(finalDataArray);
    setIsLoading(true);

  };

  const getIndividualUser = (user_id) => {
    setEditUsersId(user_id);

    const values = {
      user_id: user_id
    };

    console.log(values);

    let response = {
      data: {
        Items: [
          {
            id: 1,
            teacher_id: "jdngu2g982qu3iung9q3ht984hgniuq3gn93q84u89tng98394u8t",
            user_email: "teacher@gmail.com",
            user_firstname: "first",
            user_lastname: "second",
            user_phone_no: "9312312312",
            user_role: "Teacher",
            dob: "1997-05-27",
            class: "10",
            section: "A"
          }
        ]
      }
    }


    console.log(response.data.Items[0]);
    hideLoader();

    if (response.data.Items[0]) {

      let individual_user_data = response.data.Items[0];
      console.log({ individual_user_data });

      setIndividualUserData(individual_user_data);
      setIsEditModalOpen(true);

    } else {

      setIsEditModalOpen(true);
    }

    // axios
    //   .post(
    //     dynamicUrl.fetchIndividualUser,
    //     { data: values },
    //     {
    //       headers: { Authorization: SessionStorage.getItem('user_jwt') }
    //     }
    //   )
    //   .then((response) => {
    //     setIndividualUserData(response.data.Items[0]);

    //     console.log(response.data.Items[0]);
    //     hideLoader();      

    //     if (response.data.Items[0].user_components.length !== 0) {
    //       let individual_user_data = response.data.Items[0];
    //       console.log({ individual_user_data });

    //       let final_array = [];
    //       let final_component = [];

    //       for (var i = 0; i < individual_user_data.user_components.length; i++) {
    //         var newArray = colourOptions.filter(function (el) {
    //           return el.value === individual_user_data.user_components[i];
    //         });
    //         final_array.push(newArray[0]);
    //         final_component.push(individual_user_data.user_components[i]);
    //       }

    //       console.log({ final_array });
    //       console.log({ final_component });

    //       setDefaultValueData(final_array);
    //       console.log({ defaultValueData });
    //       setComponent(final_component);
    //       setIsEditModalOpen(true);
    //     } else {
    //       setComponent([]);
    //       setIsEditModalOpen(true);
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       // Request made and server responded
    //       console.log(error.response.data);
    //       setIsEditModalOpen(false);
    //       hideLoader();
    //       sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
    //     } else if (error.request) {
    //       // The request was made but no response was received
    //       hideLoader();
    //       console.log(error.request);
    //     } else {
    //       // Something happened in setting up the request that triggered an Error
    //       hideLoader();
    //       console.log('Error', error.message);
    //     }
    //   });
  };

  const deleteUser = (user_id) => {
    const values = { user_id: user_id };
    console.log(values);
    axios
      .post(dynamicUrl.deleteUser, { data: values }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
      .then((response) => {
        if (response.Error) {
          hideLoader();
          sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
        } else {
          MySwal.fire('', MESSAGES.INFO.USER_DELETED, 'success');
          hideLoader();
          fetchUserData();
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


  const _SubmitUser = (values) => {
    // components empty check
    console.log(values);
    switch (sessionStorage.getItem('user_category')) {
      case 'Operation Supervisor':
        if (values.user_components.length === 0) {
          alert('Please select a component');
          return;
        }
        break;
      default:
        break;
    }
    console.log('Submitted');
    axios
      .post(dynamicUrl.insertUsers, { data: values }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
      .then((response) => {
        console.log({ response });
        if (response.Error) {
          setIsOpen(false);
          sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.AddingUser });
          hideLoader();
        } else {
          setIsOpen(false);
          sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingUser });
          hideLoader();
          fetchUserData();
        }
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          setIsOpen(false);
          hideLoader();
          sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
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
  };

  const _UpdateUser = (values) => {
    console.log(values);
    console.log('Submitted');

    switch (sessionStorage.getItem('user_category')) {
      case 'Operation Supervisor':
        if (values.user_components.length === 0) {
          alert('Please select a component');
          return;
        }
        break;
      default:
        break;
    }

    axios
      .post(dynamicUrl.updateUser, { data: values }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
      .then((response) => {
        console.log({ response });
        if (response.Error) {
          hideLoader();
          setIsEditModalOpen(false);
          sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.UpdatingUser });
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

  const validationSchema = Yup.object().shape({
    userName: Yup.string()
      .min(2, Constants.AddUserForm.UserNameIsTooShort)
      .max(50, Constants.AddUserForm.UserNameIsTooLong)
      .matches(Constants.AddUserForm.UserNameRegex, Constants.AddUserForm.UserNameValidation)
      .required(Constants.AddUserForm.UserNameIsRequired),
    userEmail: Yup.string().trim().email(Constants.AddUserForm.ValiedEmail).required(Constants.AddUserForm.EmailRequired),
    userPassword: Yup.string()
      .trim()
      .min(8, Constants.AddUserForm.PasswordMustHaveMinimum8Characters)
      .matches(Constants.AddUserForm.PasswordRegExp, Constants.AddUserForm.PasswordValidation)
      .required(Constants.AddUserForm.PasswordRequired),
    userPhone: Yup.string()
      .trim()
      .min(10, 'Enter Valid Phone Number')
      .max(10, 'Enter Valid Phone Number')
      .required(Constants.AddUserForm.PhonNumberRequired),
    selectCategory: Yup.string()
  });

  const validationSchemaPasswordNotRequired = Yup.object().shape({
    userName: Yup.string()
      .min(2, Constants.AddUserForm.UserNameIsTooShort)
      .max(50, Constants.AddUserForm.UserNameIsTooLong)
      .matches(Constants.AddUserForm.UserNameRegex, Constants.AddUserForm.UserNameValidation)
      .required(Constants.AddUserForm.UserNameIsRequired),
    userEmail: Yup.string().trim().email(Constants.AddUserForm.ValiedEmail).required(Constants.AddUserForm.EmailRequired),
    userPassword: Yup.string()
      .trim()
      .min(8, Constants.AddUserForm.PasswordMustHaveMinimum8Characters)
      .matches(Constants.AddUserForm.PasswordRegExp, Constants.AddUserForm.PasswordValidation),
    userPhone: Yup.string()
      .trim()
      .min(10, 'Enter Valid Phone Number')
      .max(10, 'Enter Valid Phone Number')
      .required(Constants.AddUserForm.PhonNumberRequired),
    selectCategory: Yup.string()
  });

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
                    {userData.length > 0 ? (
                      <Table columns={columns} data={userData} modalOpen={openHandler} />
                    ) : (
                      <Table columns={columns} data={userData} modalOpen={openHandler} />
                    )}
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
                  dob: individualUserData.dob,
                  class: individualUserData.class,
                  section: individualUserData.section

                }}
                validationSchema={
                  Yup.object().shape(validationObj)
                }
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                  console.log("Submit")
                  setStatus({ success: true });
                  setSubmitting(true);

                  const formData = {
                    user_firstname: values.firstName,
                    user_lastname: values.lastName,
                    user_email: values.userEmail,
                    user_phone_no: values.phoneNumber,
                    user_role: values.userRole,


                  };

                  console.log(formData);
                  showLoader();
                  _UpdateUser(formData);
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
                              <label className="floating-label" htmlFor="userRole">
                                <small className="text-danger">* </small>User Role
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
                          <Col>
                            <div className="form-group fill">
                              <label className="floating-label" htmlFor="dob">
                                <small className="text-danger">* </small>DOB
                              </label>
                              <input
                                className="form-control"
                                error={touched.dob && errors.dob}
                                name="dob"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="date"
                                value={values.dob}

                              />
                              {touched.dob && errors.dob && <small className="text-danger form-text">{errors.dob}</small>}
                            </div>
                          </Col>
                        </Row>

                        {individualUserData.class && individualUserData.section && (
                          <>
                            <Row>
                              <Col>
                                <div className="form-group fill">
                                  <label className="floating-label" htmlFor="class">
                                    <small className="text-danger">* </small>Class
                                  </label>
                                  <input
                                    className="form-control"
                                    error={touched.class && errors.class}
                                    name="class"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.class}

                                  />
                                  {touched.class && errors.class && <small className="text-danger form-text">{errors.class}</small>}
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