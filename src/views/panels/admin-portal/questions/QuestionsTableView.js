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

          <Link to={'/admin-portal/add-questions'}>
            <Button variant="success" className="btn-sm btn-round has-ripple ml-2">
              <i className="feather icon-plus" /> Add Questions
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

const QuestionsTableView = ({ _questionStatus }) => {

  console.log(_questionStatus);

  const columns = React.useMemo(() => [
    {
      Header: '#',
      accessor: 'id'
    },
    {
      Header: 'Type',
      accessor: 'question_type'
    },
    {
      Header: 'Question',
      accessor: 'question_content'
    },
    // {
    //   Header: 'Status',
    //   accessor: 'question_status'
    // },
    {
      Header: 'Options',
      accessor: 'action'
    }
  ], []);

  const history = useHistory();
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
  const [_data, _setData] = useState([]);
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

  const sweetConfirmHandler = (alert, question_id, updateStatus) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      type: alert.type,
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.value) {
        showLoader();
        deleteUser(question_id, updateStatus);
      }
    });
  };


  const saveUserIdDelete = (e, question_id, updateStatus) => {
    e.preventDefault();

    pageLocation === 'active-questions' ? (
      sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, question_id, updateStatus)
    ) : (
      sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the question!' }, question_id, updateStatus)
    )

  };


  const deleteUser = (question_id, updateStatus) => {
    const values = {
      question_id: question_id,
      question_active_status: updateStatus
    };

    console.log(values);

    axios
      .post(dynamicUrl.toggleQuestionStatus,
        {
          data: {
            question_id: question_id,
            question_active_status: updateStatus
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

            MySwal.fire('', MESSAGES.INFO.QUESTION_RESTORED, 'success')

          ) : (
            MySwal.fire('', MESSAGES.INFO.QUESTION_DELETED, 'success')
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
      .post(dynamicUrl.updateQuestion, { data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
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

          {pageLocation === 'active-questions' ? (

            <>

              <Button
                size="sm"
                className="btn btn-icon btn-rounded btn-info"
                onClick={(e) => history.push(`/admin-portal/edit-questions/${responseData[index].question_id}`)}
              >
                <i className="feather icon-edit" /> &nbsp; Edit
              </Button>{' '}
              &nbsp;
              <Button
                size="sm"
                className="btn btn-icon btn-rounded btn-danger"
                onClick={(e) => saveUserIdDelete(e, responseData[index].question_id, 'Archived')}
              >
                <i className="feather icon-trash-2" /> &nbsp;Delete
              </Button>
            </>

          ) : (

            <>

              <Button
                size="sm"
                className="btn btn-icon btn-rounded btn-primary"
                onClick={(e) => saveUserIdDelete(e, responseData[index].question_id, 'Active')}
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

    const payLoadStatus = pageLocation === "active-questions" ? 'Active' : 'Archived';

    axios.post(dynamicUrl.fetchAllQuestionsData, {
      data: {
        question_status: _questionStatus,
        question_active_status: payLoadStatus
      }
    }, {
      headers: { Authorization: sessionStorage.getItem('user_jwt') }
    })
      .then((response) => {

        let resultData = response.data.Items;
        console.log("resultData", response.data.Items);
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

  }, [_questionStatus]);

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

                  <h3 style={{ textAlign: 'center' }}>No Questions Found</h3>
                  <div className="form-group fill text-center">
                    <br></br>

                    <Link to={'/admin-portal/add-questions'}>
                      <Button variant="success" className="btn-sm btn-round has-ripple ml-2">
                        <i className="feather icon-plus" /> Add Questions
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
                                <Card.Title as="h5">Questions List</Card.Title>
                              </Card.Header>
                              <Card.Body>
                                <Table columns={columns} data={userData} modalOpen={openHandler} />
                              </Card.Body>
                            </Card>

                          </Col>
                        </Row>
                      </React.Fragment>
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

export default QuestionsTableView;