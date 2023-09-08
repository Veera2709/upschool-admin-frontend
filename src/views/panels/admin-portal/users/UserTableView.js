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
import { useTable, useSortBy, usePagination, useGlobalFilter, useRowSelect } from 'react-table';
import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import BasicSpinner from '../../../../helper/BasicSpinner';


function Table({ columns, data, modalOpen, userRole, sendDataToParent, callParentFunction, onPageChange, pageCountRes, onPageIndexUpdate, indexes }) {
  // console.log("data", data);
  // console.log("_userRole in Table", userRole);
  // console.log("pageCountRes", pageCountRes)
  const [stateUser, setStateUser] = useState([])
  const [check, setCheck] = useState(false)
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
  const initiallySelectedRows = React.useMemo(() => new Set(["1"]), []);
  const MySwal = withReactContent(Swal);
  const history = useHistory();
  const [_showLoader, _setShowLoader] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [pageIndexValue, setPageIndexValue] = useState(1);
  const [dataFromChild, setDataFromChild] = useState('');
  const [startKeys, setStartKeys] = useState(null);


  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 10; // Number of items per page
  const totalItems = data.length; // Total number of items
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = pageIndex * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = data.slice(startIndex, endIndex);
  const [initialValue, setInitialValue] = useState(1);

  const sweetAlertHandler = (alert) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

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
    selectedFlatRows,
    toggleAllRowsSelected,
    state: { pageSize, selectedRowPaths }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10, selectedRowPaths: initiallySelectedRows, globalFilter: searchValue },
      userRole,

    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const user_status = pageLocation === 'active-users' ? "Active" : "Archived"

  // console.log("user_status : ", user_status);


  useEffect(() => {
    const data = {
      page_size: pageSize,
      user: userRole,
      start_key: startKeys,
      searchedKeyword: searchValue,
      pageIndexValue: pageIndexValue,
      pageIndex: pageIndex,
      initialValue: initialValue
    }

    console.log('Data sent from child:', data);
    console.log("pageIndex : ", pageIndex);
    

    sendDataToParent(data);
    setGlobalFilter(searchValue);
    setDataFromChild(data);

  }, [pageSize, userRole, searchValue, globalFilter, setGlobalFilter, startKeys, pageIndex, pageIndexValue, initialValue]);

  // const MySwal = withReactContent(Swal);
  const conformDelete = () => {

    MySwal.fire({
      title: 'Are you sure?',
      text: 'Confirm deleting User',
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.value) {
        console.log("api calling");
        deleteUsersById();
      }
    });
  }


  const restoreData = () => {

    MySwal.fire({
      title: 'Are you sure?',
      text: 'Confirm Restore User',
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.value) {
        console.log("api calling");
        deleteUsersById();
      } else {
        return MySwal.fire('', 'User is archieved!', 'error');
      }
    });
  }

  const deleteUsersById = () => {

    console.log("data check: ", data);
    let arrIds = [];
    let userId = (userRole === "Teachers") ? "teacher_id" : (userRole === "Students") ? "student_id" : (userRole === "Parents") ? "parent_id" : "N.A.";

    let userRolePayload = (userRole === "Teachers") ? "Teacher" : (userRole === "Students") ? "Student" : (userRole === "Parents") ? "Parent" : "N.A.";

    console.log(userId);
    for (let k = 0; k < data.length; k++) {

      console.log(data[k][userId]);
      console.log("document.getElementById(data[k][userId]).checked ", document.getElementById(data[k][userId]).checked, "---", data[k][userId]);

      if (userRole === "Teachers") {
        console.log("Teachers cond");
        if (document.getElementById(data[k][userId]).checked) {
          console.log("Inside Condition");

          arrIds.push({ user_id: data[k][userId], school_id: data[k]["school_id"] });
        }
      } else if (userRole === "Parents") {
        console.log("Parents cond");
        console.log(data[k][userId]);
        console.log(document.getElementById(data[k][userId]));
        if (document.getElementById(data[k][userId]).checked) {
          console.log("Inside Condition");

          arrIds.push({ user_id: data[k][userId], school_id: data[k]["school_id"] });
        }
      }
    }
    console.log("CHECK ROWS : ", arrIds);
    console.log(_showLoader);

    _setShowLoader(true);
    axios
      .post(
        dynamicUrl.bulkToggleUsersStatus,
        {
          data: {
            selectedUsers: arrIds,
            user_role: userRolePayload,
            user_status: user_status === "Active" ? "Archived" : "Active"
          }
        }, {
        headers: { Authorization: sessionStorage.getItem('user_jwt') }
      }
      )
      .then(async (response) => {
        console.log("response : ", response);
        _setShowLoader(false);
        if (response.Error) {
          hideLoader();
          sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
          history.push('/admin-portal/' + pageLocation)
        } else {
          console.log("response : ", response);
          if (response.data === 200) {
            // sweetAlertHandler({ title: MESSAGES.INFO.USERS_DELETED, type: 'success' });
            window.location.reload()
            hideLoader();
            // window.location.reload();
            // setCheck(true);
            // history.push('/admin-portal/' + pageLocation)
          } else {

            MySwal.fire({ title: 'Sorry', icon: 'warning', text: response.response.data })
              .then((willDelete) => {
                window.location.reload();
              });
          }
        }
      }
      ).catch((error) => {
        _setShowLoader(false);
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          hideLoader();

          if (error.response.data === 'Invalid Token') {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

          } else {

            sweetAlertHandler({ title: 'Sorry', text: error.response.data, type: 'warning' }).then((willDelete) => {
              window.location.reaload();
            });

          }

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
  }
  const getAlldata = () => {
    console.log("selectedFlatRows", selectedFlatRows);
    let arrayWithUserIds = [];

    let userRolePayload = (userRole === "Teachers") ? "Teacher" : (userRole === "Students") ? "Student" : (userRole === "Parents") ? "Parent" : "N.A.";

    console.log("ROLE : ", userRolePayload);

    selectedFlatRows.map((items) => {
      console.log("Teacher Id : ", items.original.teacher_id);
      if (userRolePayload === "Teacher") {
        console.log("Teacher Id : ", items.original.teacher_id);
        arrayWithUserIds.push({ user_id: items.original.teacher_id, school_id: items.original.school_id });
      }
      else if (userRolePayload === "Parent") {
        console.log("Parent Id : ", items.original.parent_id);
        arrayWithUserIds.push({ user_id: items.original.parent_id, school_id: items.original.school_id });
      }
    })
    console.log("CHECKED IDS : ", arrayWithUserIds);

    if (arrayWithUserIds.length === 0) {

      const MySwal = withReactContent(Swal);
      return MySwal.fire('Sorry', 'No User Selected!', 'warning');

    } else {

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: 'Are you sure?',
        text: pageLocation === 'active-users' ? 'Confirm deleting' : 'Confirm restoring',
        type: 'warning',
        showCloseButton: true,
        showCancelButton: true,

      }).then((willDelete) => {
        if (willDelete.value) {

          _setShowLoader(true);
          console.log("api calling", _showLoader);

          // changeStatus(digi_card_id, digi_card_title);
          axios
            .post(
              dynamicUrl.bulkToggleUsersStatus,
              {
                data: {
                  selectedUsers: arrayWithUserIds,  // selectedFlatRows
                  user_role: userRolePayload,
                  user_status: user_status === "Active" ? "Archived" : "Active"
                }
              }, {
              headers: { Authorization: sessionStorage.getItem('user_jwt') }
            }
            )
            .then(async (response) => {
              console.log("response : ", response);
              _setShowLoader(false);
              if (response.Error) {
                hideLoader();
                // sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                pageLocation === "active-users"
                  ? sweetAlertHandler({
                    title: MESSAGES.TTTLES.Sorry,
                    type: "error",
                    text:
                      userRole === "Teachers"
                        ? MESSAGES.ERROR.DeletingTeachers
                        : userRole === "Parents"
                          ? MESSAGES.ERROR.DeletingParents
                          : MESSAGES.ERROR.InvalidUser,
                  })
                  : sweetAlertHandler({
                    title: MESSAGES.TTTLES.Sorry,
                    type: "error",
                    text:
                      userRole === "Teachers"
                        ? MESSAGES.ERROR.RestoringTeachers
                        : userRole === "Parents"
                          ? MESSAGES.ERROR.RestoringParents
                          : MESSAGES.ERROR.InvalidUser,
                  });

                history.push('/admin-portal/' + pageLocation)
              } else {
                console.log("response : ", response);
                if (response.data === 200) {
                  MySwal.fire({
                    title: (userRole === "Teachers" && pageLocation === 'active-users') ? 'Teachers Deleted' :
                      (userRole === "Parents" && pageLocation === 'active-users') ? 'Parents Deleted' :
                        'Users Restored',
                    icon: "success",
                    text: pageLocation === 'active-users' ? 'User Deleted' : 'User Restored',
                    // type: 'success',
                  }).then((willDelete) => {

                    window.location.reload()

                  })

                }
              }

            }
            ).catch((error) => {
              _setShowLoader(false);
              if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                hideLoader();

                if (error.response.data === 'Invalid Token') {

                  sessionStorage.clear();
                  localStorage.clear();

                  history.push('/auth/signin-1');
                  window.location.reload();

                } else {

                  MySwal.fire({ title: 'Sorry', text: error.response.data, icon: 'warning' }).then((willDelete) => {
                    window.location.reload();
                  })

                }

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

        }

      });

    }
  }
  const nextCustomPage = () => {

    // console.log("Math.min(pageIndex + 1, pageCountRes - 1) : ", Math.min(pageIndex + 1, pageCountRes - 1));

    // setPageIndexValue(pageIndexValue + 1);
    // setPageIndex(Math.min(pageIndex + 1, pageCountRes - 1));
    setPageIndex(pageIndex + 1);
    setInitialValue(initialValue + 1); 
    // onPageIndexUpdate(pageIndex + 1);

    // sendDataToParent(dataFromChild.pageIndexValue = pageIndexValue);
    // callParentFunction()

    // console.log("dataFromChild utv : ", dataFromChild);

  }
  // const nextCustomPage = () => {
  //   const newPageIndex = Math.min(pageIndex + 1, pageCountRes - 1);

  //   setPageIndex(newPageIndex);


  //   onPageIndexUpdate(newPageIndex);

  //   sendDataToParent(dataFromChild.pageIndexValue = newPageIndex);

  //   callParentFunction();
  // }

  const prevCustomPage = () => {

    // setPageIndexValue(pageIndexValue - 1);
    // setPageIndex(Math.min(pageIndex - 1, pageCountRes + 1));
    // onPageIndexUpdate(pageIndex - 1);
    // sendDataToParent(dataFromChild.pageIndexValue = pageIndexValue);
    // callParentFunction()

    setPageIndex(pageIndex - 1);
    setInitialValue(initialValue - 1); 

  }

  const goToPage = (page) => {
    // setPageIndex(Math.max(Math.min(page, pageCountRes - 1), 0));
    // onPageIndexUpdate(page);

    // sendDataToParent(dataFromChild.pageIndex = pageIndex);
    // callParentFunction()
    setPageIndex(page - 1); 
    setInitialValue(page); 

  }

  const handleInputChange = (e) => {

    const inputValue = e.target.value;

    if(inputValue <= pageCountRes){
      console.log("INPUT PAGE NO : ======================= ", inputValue);
      if (inputValue !== "") {
        sessionStorage.setItem('inputValue', inputValue);
      }
      console.log('Input value:', inputValue);
      const newPageNumber = parseInt(inputValue, 10) - 1;
  
  
      const neededPage = inputValue === "" ? inputValue : parseInt(inputValue, 10) - 1;
  
      onPageChange(neededPage);
      // onPageChange(newPageNumber);
      setPageIndex(newPageNumber);
  
      setInitialValue(inputValue);
  
      const pageNumber = parseInt(initialValue, 10);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= pageCountRes) {
        setPageIndex(pageNumber - 1); // Adjust for zero-based indexing
        // setInitialValue(''); // Clear input
      }
    }
    
  }

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
        <Col>
          {
            _showLoader === true && (
              <div className="form-group fill text-center">{loader}</div>
            )
          }
        </Col>
        <Col className="d-flex justify-content-end">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} setSearchValue={setSearchValue} />

          {user_status === "Active" ? (
            <>
              <Link to={'/admin-portal/add-users'}>
                <Button

                  className="btn-sm btn-round has-ripple ml-2 btn btn-success"
                  style={{
                    whiteSpace: "nowrap"
                  }}
                >

                  <i className="feather icon-plus" /> Add Users
                </Button>
              </Link>

              <Button

                className="btn-sm btn-round has-ripple ml-2  btn btn-danger"
                // style={{ marginLeft: "1.5rem" }}
                style={{ whiteSpace: "nowrap" }}
                onClick={() => { getAlldata() }}
              >
                <i className="feather icon-trash-2" /> &nbsp;
                Multi Delete
              </Button>
            </>
          ) : (

            <Button onClick={getAlldata}
              variant="primary"
              className="btn-sm btn-round has-ripple ml-2"
              // style={{ marginLeft: "1.5rem" }} 
              style={{ whiteSpace: "nowrap" }}
            ><i className="feather icon-plus" /> &nbsp;
              Multi Restore
            </Button>
          )}

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
              {/* {pageIndex + 1} of {pageOptions.length}{' '} */}
              {initialValue === "" ? 1 : initialValue} of {pageCountRes}
            </strong>{' '}
            | Go to page:{' '}
            <input
              className="form-control ml-2"
              type="number"
              onChange={handleInputChange} 
              // {initialValue > pageCountRes && onKeydown="return false;"} 
              value={initialValue}
              style={{ width: '100px' }}
            />
            {/* <button className="btn btn-primary ml-2" onClick={handleGoToPageClick}>
                Go
              </button> */}
          </span>
        </Col>
        <Col>
          <Pagination className="justify-content-end">
            <Pagination.First onClick={() => goToPage(1)} disabled={initialValue === 1}/>
            <Pagination.Prev onClick={prevCustomPage} disabled={initialValue === 1} />
            <Pagination.Next onClick={nextCustomPage} disabled={pageIndex === pageCountRes - 1} />
            <Pagination.Last onClick={() => goToPage(pageCountRes - 1)} />
          </Pagination>
        </Col>
      </Row>
    </>
  );
}

const UserTableView = ({ _userRole, sendDataToGrandParent }) => {
  // console.log("_userRole : ", _userRole);
  const [dataFromChild, setDataFromChild] = useState('');
  const [users, setUsers] = useState([])
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
  const [isOpenSectionAllocation, setOpenSectionAllocation] = useState(false);
  const [teacherId, setTeacherId] = useState();
  const [selectDOBErr, setSelectDOBErr] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsSHow] = useState(false);
  const { user_id } = decodeJWT(sessionStorage.getItem('user_jwt'));
  const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
  const [selectClassErr, setSelectClassErr] = useState(false);
  const [_data, _setData] = useState([]);
  const [checkBoxId, _setAllCheckId] = useState([]);
  const classNameRef = useRef('');
  const schoolNameRef = useRef('');
  const [check, setCheck] = useState(false);
  const [selectAllCheckbox, setSelectAllCheckbox] = useState(false);
  // const [outPutData, setOutPutData] = useState(response.data);

  const [tempData, setTemData] = useState([]);
  const [startKeys, setStartKeys] = useState(null);
  const [lastKeys, setLastKeys] = useState([]);
  const [indexes, setIndexes] = useState(0)
  const [pageCountRes, setPageCountRes] = useState()
  const [pageIndexParent, setPageIndexParent] = useState(0); // Initialize pageIndexParent in the parent component
  const [itemsRes, setItemsRes] = useState([])
  const [initialValue, setInitialValue] = useState('');


  const handlePageIndexUpdate = (pageIndex) => {
    setPageIndexParent(pageIndex); // Update the parent's pageIndex state
  };

  const handleDataFromChild = (data) => {
    console.log('Data received in Parent:', data);
    setDataFromChild(data);
    setInitialValue(dataFromChild.initialValue)

    // Reset indexes to 1 when search keyword changes
    if (data.searchedKeyword !== dataFromChild.searchedKeyword) {
      console.log('Search keyword changed. Resetting indexes to 1.');

      setIndexes(1);
      // setPageIndexParent(1)
      handlePageIndexUpdate()

      console.log("pagendexfformparent,", pageIndexParent)

    }

    // Pass the data to the GrandParentComponent
    sendDataToGrandParent(data);
  };
  const handlePageChange = (pageNumber) => {

    const parsedNumber = Number(pageNumber);

    console.log('Parsed number:', parsedNumber);

    if (!isNaN(parsedNumber)) {
      setIndexes(parsedNumber);
    } else { // Handle the case where parsing failed 
      console.log('Invalid page number:', pageNumber);
    }

  };

  const phoneRegExp = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;

  const MySwal = withReactContent(Swal);


  const handleSelectAll = (allId) => {


    console.log("ALL CEHCK IDS : ", checkBoxId);
    if (document.getElementById(allId).checked === true) {
      alert("Checked");
    }
    else {
      alert("Un checked");
    }
    // const checked = event.target.checked;
    // const updatedData = outPutData.map(data => ({ ...data, checked }));
    // setOutPutData(updatedData);
    // setSelectAllCheckbox(checked);
  };

  const handleCheckboxChange = event => {
    // let userId = (_userRole === "Teacher") ? "teacher_id" : "N.A.";

    // let userId = (_userRole === "Teachers") ? "teacher_id" : (_userRole === "Students") ? "student_id" : (_userRole === "Parents") ? "parent_id" : "N.A.";
    // const id = event.target.id;
    // const updatedData = outPutData.map(data =>
    //   data[userId] === id ? { ...data, checked: event.target.checked } : data
    // );
    // setOutPutData(updatedData);
  };

  const columns = React.useMemo(() => [

    {
      id: "selection",
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <div>
          <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
        </div>
      ),
      Cell: ({ row }) => (
        <div>
          <input type="checkbox" {...row.getToggleRowSelectedProps()} />
        </div>
      )
    },
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
  ], []);

  const sweetAlertHandler = (alert) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  const sweetConfirmHandler = (alert, user_id, user_role, updateStatus, schoolId) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      type: alert.type,
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete.value) {
        showLoader();
        deleteUser(user_id, user_role, updateStatus, schoolId);
      } else {

        // const returnValue = pageLocation === 'active-users' ? (
        //   MySwal.fire('',  .DATA_SAFE, 'success')
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

  const saveUserIdDelete = (e, user_id, user_role, updateStatus, schoolId) => {
    e.preventDefault();

    pageLocation === 'active-users' ? (
      sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, user_id, user_role, updateStatus, schoolId)
    ) : (
      sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the user!' }, user_id, user_role, updateStatus, schoolId)
    )

  };
  ///////////////
  const handleChange = (e) => {
    // let responseData = _data;
    const { id, checked } = e.target;
    let tempArr = users.map(user => user.id === id ? { ...user, isChecked: checked } : user
    )
    setUsers(tempArr)
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
          // setPreviousSchool(schoolNameArr.school_name);
          schoolNameArr === "" || schoolNameArr === undefined || schoolNameArr === "undefined" || schoolNameArr === "N.A." ? setPreviousSchool("Select School") : setPreviousSchool(schoolNameArr.school_name);
          classNameArr === "" || classNameArr === undefined || classNameArr === "undefined" || classNameArr === "N.A." ? setPreviousClass("Select Class") : setPreviousClass(classNameArr.client_class_name);
          setUserDOB(response.data.Items[0].user_dob);
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

  const deleteUser = (user_id, user_role, updateStatus, schoolId) => {
    const values = {
      user_id: user_id,
      user_role: user_role,
      user_status: updateStatus,
      school_id: schoolId
    };

    // console.log(values);

    axios
      .post(dynamicUrl.toggleUserStatus,
        {
          data: {
            user_id: user_id,
            user_role: user_role,
            user_status: updateStatus,
            school_id: schoolId
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

  const updateValues = async (_data) => {
    let responseData = _data.Items;

    // console.log("updateValues responseData", responseData);
    setCheckedStatus(new Array(responseData.length).fill(false));



    let finalDataArray = [];
    let userId = (_userRole === "Teachers") ? "teacher_id" : (_userRole === "Students") ? "student_id" : (_userRole === "Parents") ? "parent_id" : "N.A.";
    // console.log("while setting", userId);
    // console.log("responseData : ", responseData);

    let allCheckBoxIds = [];
    for (let index = 0; index < responseData.length; index++) {
      // console.log("responseData[index][userId] : ", responseData[index][userId]);

      allCheckBoxIds.push(responseData[index][userId]);

      responseData[index].id = index + 1;

      responseData[index]['action'] = (
        <>
          {pageLocation === 'active-users' ? (
            <>

              {responseData[index].user_role === "Teacher" ? (
                <>


                  <Button
                    size="sm"
                    className="btn btn-icon btn-rounded btn-info"
                    // onClick={(e) => saveUserId(e, userId, responseData[index].user_role)}
                    onClick={(e) => {
                      history.push(`/admin-portal/edit-users/${responseData[index].teacher_id}/${responseData[index].user_role}/${responseData[index].school_id}`)
                    }

                    }
                  >
                    <i className="feather icon-edit" /> &nbsp; Edit
                  </Button>{' '}
                  &nbsp;
                  <Button
                    size="sm"
                    className="btn btn-icon btn-rounded btn-danger"
                    onClick={(e) => saveUserIdDelete(e, responseData[index].teacher_id, responseData[index].user_role, 'Archived', responseData[index].school_id)}
                  >
                    <i className="feather icon-trash-2" /> &nbsp;Delete
                  </Button>
                  &nbsp;
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="btn btn-icon btn-rounded btn-info"
                    // onClick={(e) => saveUserId(e, userId, responseData[index].user_role)}
                    onClick={(e) => history.push(`/admin-portal/edit-users/${responseData[index].parent_id}/${responseData[index].user_role}/${responseData[index].school_id}`)}
                  >
                    <i className="feather icon-edit" /> &nbsp; Edit
                  </Button>{' '}
                  &nbsp;
                  <Button
                    size="sm"
                    className="btn btn-icon btn-rounded btn-danger"
                    onClick={(e) => saveUserIdDelete(e, responseData[index].parent_id, responseData[index].user_role, 'Archived', responseData[index].school_id)}
                  >
                    <i className="feather icon-trash-2" /> &nbsp;Delete
                  </Button>
                  &nbsp;
                </>
              )}
            </>
          ) : (

            <>
              {responseData[index].user_role === "Teacher" ? (
                <>
                  <Button
                    size="sm"
                    className="btn btn-icon btn-rounded btn-primary"
                    onClick={(e) => saveUserIdDelete(e, responseData[index].teacher_id, responseData[index].user_role, 'Active', responseData[index].school_id)}
                  >
                    <i className="feather icon-plus" /> &nbsp;Restore
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="btn btn-icon btn-rounded btn-primary"
                    onClick={(e) => saveUserIdDelete(e, responseData[index].parent_id, responseData[index].user_role, 'Active', responseData[index].school_id)}
                  >
                    <i className="feather icon-plus" /> &nbsp;Restore
                  </Button>
                </>
              )}
            </>
          )}

        </>
      );
      finalDataArray.push(responseData[index]);
    }
    // console.log(finalDataArray);
    setUserData(finalDataArray);
    // console.log("userData : ", userData);
    // console.log("ALL N SET : ", allCheckBoxIds, checkBoxId);
    _setAllCheckId(allCheckBoxIds);
    // console.log("ALL N SET 2 : ", allCheckBoxIds, checkBoxId);
    setIsLoading(false);
  }

  const fetchUserData = async () => {
    try {
      showLoader();
      setIsSHow(true);
      console.log("startKeys : ", startKeys);
      console.log("indexes : ", indexes);
      console.log("datafromchildinital", dataFromChild.initialValue)

      const payLoadStatus = pageLocation === "active-users" ? 'Active' : 'Archived';

      console.log("payload : ", {
        page_size: dataFromChild.page_size === undefined ? 10 : dataFromChild.page_size,
        user: _userRole.replace("s", ""),
        start_key: startKeys,
        searchedKeyword: dataFromChild.searchedKeyword === undefined ? "" : dataFromChild.searchedKeyword,
      });

      const response = await axios.post(
        dynamicUrl.usersPagination,
        {
          data: {
            page_size: dataFromChild.page_size === undefined ? 10 : dataFromChild.page_size,
            user: _userRole.replace("s", ""),
            start_key: startKeys,
            searchedKeyword: dataFromChild.searchedKeyword === undefined ? "" : dataFromChild.searchedKeyword,
          }
        },
        {
          headers: { Authorization: sessionStorage.getItem('user_jwt') }
        }
      );

      const resultData = response.data;
      console.log("resultData.Items", resultData.Items); 
      console.log("resultData.lastKey", resultData); 

      if (resultData) {
        setIsLoading(false);
        setTemData(resultData);
        let tempPageCount = resultData.pagesCount === undefined || resultData.pagesCount === 'undefined' || resultData.pagesCount === "" ? pageCountRes : resultData.pagesCount;
        setPageCountRes(tempPageCount);
        updateValues(resultData);
        // setPageCountRes(resultData.pagesCount)
        hideLoader();

        const newStartKey = resultData.lastKey;

        resultData.lastKey !== undefined && setLastKeys(resultData.lastKey);
        console.log("lastKey : ", resultData.lastKey);

        const items = resultData.Items
        console.log("items", items);
        setItemsRes(items)
        console.log("itemsRes", itemsRes);

      }
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data === 'Invalid Token') {
        console.log("Invalid Token");
        sessionStorage.clear();
        localStorage.clear();
        history.push('/auth/signin-1');
        window.location.reload();
      } else {
        console.log("Fetching user data failed:", error);
      }
    }
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
     
      if (dataFromChild.pageIndex > 0) {
        let startKey = lastKeys[dataFromChild.pageIndex];
        setStartKeys(startKey);
      }else {
        setStartKeys(null);
      }

      fetchUserData();
    }
  }, [pageLocation, _userRole, dataFromChild.page_size, dataFromChild.searchedKeyword]);
  
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
  }, [startKeys]);
  

  console.log("dataFromChild.pageIndex : ", dataFromChild.pageIndex);

  useEffect(() => {
    const validateJWT = sessionStorage.getItem('user_jwt');

    if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {
      sessionStorage.clear();
      localStorage.clear();
      history.push('/auth/signin-1');
      window.location.reload();
    }
    else {

      if (dataFromChild.pageIndex > 0) {
        let startKey = lastKeys[dataFromChild.pageIndex];
        setStartKeys(startKey);
      }else {
        setStartKeys(null);
      }

    }
  }, [dataFromChild.pageIndex]);

  useEffect(() => {
    const validateJWT = sessionStorage.getItem('user_jwt');

    if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {
      sessionStorage.clear();
      localStorage.clear();
      history.push('/auth/signin-1');
      window.location.reload();
    }
    else {

      console.log('Updated indexes state useeff:', dataFromChild.pageIndex, indexes);

      if (indexes > 0) {
        let startKey = lastKeys[indexes];
        setStartKeys(startKey);
      }else {
        setStartKeys(null);
      }

    }
  }, [indexes]);
  
  return (
    <React.Fragment>
      <div>

        {
          isLoading ? (
            <BasicSpinner />
          ) :
            (
              <>
                {
                  userData.length <= 0 && _data ? (
                    <>
                      {
                        pageLocation === 'active-users' ? (
                          <div>
                            <h3 style={{ textAlign: 'center' }}>No {sessionStorage.getItem('user_type')} Found</h3>
                            <div className="form-group fill text-center">
                              <br></br>
                              {/* <Button variant="success" className="btn-sm btn-round has-ripple ml-2"
                            onClick={handleButtonClicked}
                          >
                            <i className="feather icon-plus" /> Add Users
                          </Button> */}
                              <Link to={'/admin-portal/add-users'}>
                                <Button variant="success" className="btn-sm btn-round has-ripple ml-2"
                                >
                                  <i className="feather icon-plus" /> Add Users
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <h3 style={{ textAlign: 'center' }}>No {sessionStorage.getItem('user_type')} Found</h3>
                        )
                      }
                    </>

                  ) : (

                    <>
                      {_data && (

                        <>
                          <React.Fragment>
                            <Row>
                              <Col sm={12}>
                                <Card>
                                  <Card.Header>
                                    <Card.Title as="h5" className='d-flex justify-content-between'>
                                      <h5>User List</h5>
                                      <h5>Total Entries :- {userData.length}</h5>

                                    </Card.Title>
                                  </Card.Header>

                                  <Card.Body>
                                      <Table
                                      columns={columns}
                                      data={userData}
                                      // data={itemsRes}
                                      modalOpen={openHandler}
                                      userRole={_userRole}
                                      selectAllCheckbox={selectAllCheckbox}
                                      sendDataToParent={handleDataFromChild}
                                      dataFromChild={dataFromChild}
                                      callParentFunction={fetchUserData}
                                      onPageChange={handlePageChange}
                                      pageCountRes={pageCountRes}
                                      onPageIndexUpdate={handlePageIndexUpdate}
                                      indexes={indexes}
                                    />

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

      </div>
      {loader}
    </React.Fragment>
  );
};

export default UserTableView;

