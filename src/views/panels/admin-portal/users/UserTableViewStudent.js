import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Row, Col, Card, Pagination, Button } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import axios from 'axios';
import { SessionStorage } from '../../../../util/SessionStorage';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import MESSAGES from '../../../../helper/messages';
import { GlobalFilter } from '../../../common-ui-components/tables/GlobalFilter';
import { useTable, useSortBy, usePagination, useGlobalFilter, useRowSelect } from 'react-table';
import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import BasicSpinner from '../../../../helper/BasicSpinner';

function Table({ columns, data, modalOpen, userRole, sendDataToParent, callParentFunction, onPageChange, pageCountRes, onPageIndexUpdate, indexes }) {
    console.log("_userRole in Table", userRole);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const MySwal = withReactContent(Swal);
    const history = useHistory();
    const [searchValue, setSearchValue] = useState('');

    const [pageIndexValue, setPageIndexValue] = useState(1);

    const [dataFromChild, setDataFromChild] = useState('');
    const [startKeys, setStartKeys] = useState(null);
    const [initialValue, setInitialValue] = useState(1);
    const [pageIndex, setPageIndex] = useState(0);


    const initiallySelectedRows = React.useMemo(() => new Set(["1"]), []);
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
            userRole
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect
    );

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };
    const user_status = pageLocation === 'active-users' ? "Active" : "Archived"
    console.log("user_status : ", user_status);

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

        console.log('Data sent from stu child:', data);

        sendDataToParent(data);
        setGlobalFilter(searchValue);
        setDataFromChild(data);


    }, [pageSize, userRole, searchValue, globalFilter, setGlobalFilter, startKeys, pageIndex, pageIndexValue, initialValue]);


    // const conformDelete = () => {

    const restoreData = () => {

        MySwal.fire({
            title: 'Are you sure?',
            text: 'Confirm restore User',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                console.log("api calling");
                deleteStudentById();
            } else {
                return MySwal.fire('', 'User is archieved!', 'error');
            }
        });
    }

    const deleteStudentById = () => {
        console.log("data check: ", data);
        console.log("userRole : ", userRole);

        let arrIds = [];
        let userId = (userRole === "Student") ? "student_id" : "N.A.";

        let userRolePayload = (userRole === "Student") ? "Student" : "N.A.";

        console.log(userId);
        for (let k = 0; k < data.length; k++) {

            console.log(data[k][userId]);

            if (document.getElementById(data[k][userId]).checked) {
                console.log("Inside Condition");

                arrIds.push(data[k][userId]);
            }
        }
        console.log("CHECK ROWS : ", arrIds);
        // Call API : 
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

                if (response.Error) {
                    hideLoader();
                    sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                    history.push('/admin-portal/' + pageLocation)
                    // fetchUserData();
                } else {
                    console.log("response : ", response);

                    if (response.data === 200) {

                        window.location.reload()
                        hideLoader();

                    }

                    // sweetAlertHandler({ title: MESSAGES.INFO.STUDENT_DELETED, type: 'success' });
                    // hideLoader();
                    // history.push('/admin-portal/' + pageLocation)

                    // fetchSchoolData();
                    // setInactive(false);
                    // _fetchSchoolData();
                }
            }
            ).catch((error) => {
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
    const deleteAllStudent = () => {

        console.log("selectedFlatRows", selectedFlatRows);
        let arrayWithStudentIds = [];

        let userRolePayload = (userRole === "Teachers") ? "Teacher" : (userRole === "Students") ? "Student" : (userRole === "Parents") ? "Parent" : "N.A.";

        console.log("ROLE : ", userRolePayload);

        selectedFlatRows.map((items) => {
            console.log("Student Id : ", items.original.student_id);
            if (userRole === "Students") {
                console.log("Student Id : ", items.original.student_id);
                arrayWithStudentIds.push({ user_id: items.original.student_id, school_id: items.original.school_id });
            }

        })

        console.log("CHECKED IDS : ", arrayWithStudentIds);


        if (arrayWithStudentIds.length === 0) {
            const MySwal = withReactContent(Swal);
            return MySwal.fire('Sorry', 'No user Selected!', 'warning').then(() => {
                window.location.reload();
            });
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
                    console.log("api calling");
                    // changeStatus(digi_card_id, digi_card_title);
                    axios
                        .post(
                            dynamicUrl.bulkToggleUsersStatus,
                            {
                                data: {
                                    selectedUsers: arrayWithStudentIds,  // selectedFlatRows
                                    user_role: userRolePayload,
                                    user_status: user_status === "Active" ? "Archived" : "Active"
                                }
                            }, {
                            headers: { Authorization: sessionStorage.getItem('user_jwt') }
                        }
                        )
                        .then(async (response) => {
                            console.log("response : ", response);

                            if (response.Error) {
                                hideLoader();
                                // sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                                pageLocation === 'active-users' ?
                                    sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: (userRole === "Student") ? MESSAGES.ERROR.DeletingStudents : MESSAGES.ERROR.InvalidUser })
                                    :
                                    sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: (userRole === "Student") ? MESSAGES.ERROR.RestoringStudents : MESSAGES.ERROR.InvalidUser });

                                history.push('/admin-portal/' + pageLocation)
                                // fetchUserData();
                            } else {
                                console.log("response : ", response);
                                if (response.data === 200) {
                                    // hideLoader();
                                    MySwal.fire({
                                        title: (userRole === "Student") && pageLocation === 'active-users' ? 'Student Deleted' : 'Student Restored',
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
                } else {
                    return MySwal.fire('', pageLocation === 'active-users' ? 'User is safe!' : "User remains Archived", 'error')


                }

            })

        }
    }

    const nextCustomPage = () => {
        if(data.length !== 0){
            setPageIndex(pageIndex + 1);
            setInitialValue(initialValue + 1); 
        }
      }
    
      const prevCustomPage = () => {
        if(data.length !== 0){
            setPageIndex(pageIndex - 1);
            setInitialValue(initialValue - 1); 
        }
      }
    
      const goToPage = (page) => {
        if(data.length !== 0){
            page === 1 ? setPageIndex(page - 1) : setPageIndex(page); 
            page === 1  ? setInitialValue(page) : setInitialValue(page + 1); 
        }
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
                <Col className="d-flex justify-content-end">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} setSearchValue={setSearchValue} />

                    {user_status === "Active" ? (
                        <>
                        {
                          data.length === 0 ? (<></>) : (
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
                            onClick={() => { deleteAllStudent() }}
                          >
                            <i className="feather icon-trash-2" /> &nbsp;
                            Multi Delete
                          </Button>
                            </>
                          )
                        }
                          
                        </>

                    )
                        :
                        <Button
                            onClick={deleteAllStudent}
                            variant="primary"
                            className="btn-sm btn-round has-ripple ml-2"
                            style={{ whiteSpace: "nowrap" }} >
                            <i className="feather icon-plus" /> &nbsp;
                            Multi Restore
                        </Button>
                    }
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
            {data.length === 0 && ( <>
              <div>
                                      <h3 style={{ textAlign: 'center' }}>No {sessionStorage.getItem('user_type')} Found</h3>
                                      <div className="form-group fill text-center">
                                        <br></br>
                                       
                                        <Link to={'/admin-portal/add-users'}>
                                          <Button variant="success" className="btn-sm btn-round has-ripple ml-2"
                                          >
                                            <i className="feather icon-plus" /> Add Users
                                          </Button>
                                        </Link>
                                      </div>
                                    </div>
            </>

            )}
            

            <Row className="justify-content-between">
                <Col>
                    <span className="d-flex align-items-center">
                        Page{' '}
                        <strong>
                            {' '}
                            {data.length === 0 ? 0 : (initialValue === "" ? 1 : initialValue)} of {data.length === 0 ? 0 : (pageCountRes)} 


                        </strong>{' '}
                        | Go to page:{' '}
                        <input
                            className="form-control ml-2"
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={handleInputChange}
                            onWheel={(e) => e.target.blur()}
                            value={data.length === 0 ? 0 : initialValue}
                            disabled={data.length === 0}
                            style={{ width: '100px' }}
                        />
                    </span>
                </Col>
                <Col>
                    <Pagination className="justify-content-end">
                    <Pagination.First onClick={() => goToPage(1)} disabled={initialValue === 1}/>
                    <Pagination.Prev onClick={prevCustomPage} disabled={initialValue === 1} />
                    <Pagination.Next onClick={nextCustomPage} disabled={pageIndex === pageCountRes - 1 || data.length === 0} />
                    <Pagination.Last onClick={() => goToPage(pageCountRes - 1)} disabled={data.length === 0}/>
                    </Pagination>
                </Col>
            </Row>
        </>
    );
}

const UserTableViewStudent = ({ _userRole, sendDataToGrandParent }) => {

    console.log(_userRole);
    // console.log(sendDataToParent);

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
            Header: 'Options',
            accessor: 'action'
        }
    ], []);
    const colourOptions = [];
    const multiDropDownValues = [];
    const history = useHistory();
    const [userData, setUserData] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [schoolId, setSchoolId] = useState();

    const [multiDropOptions, setMultiDropOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const [_userID, _setUserID] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const pageLocation = useLocation().pathname.split('/')[2];
    const [_data, _setData] = useState([]);

    console.log("options", options);
    console.log("multiDropOptions", multiDropOptions);
    const [selectAllCheckbox, setSelectAllCheckbox] = useState(false);
    ///
    const [dataFromChild, setDataFromChild] = useState('');
    console.log("datafrom child ", dataFromChild)

    const [tempData, setTemData] = useState([]);
    const [startKeys, setStartKeys] = useState(null);
    const [lastKeys, setLastKeys] = useState([]);
    const [indexes, setIndexes] = useState(0)
    const [pageCountRes, setPageCountRes] = useState()
    const [pageIndexParent, setPageIndexParent] = useState(0); // Initialize pageIndexParent in the parent component
    const [itemsRes, setItemsRes] = useState([])
    const [initialValue, setInitialValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);

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

    const MySwal = withReactContent(Swal);


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
            }
        });
    };

    const saveUserIdDelete = (e, user_id, user_role, updateStatus, schoolId) => {
        e.preventDefault();

        pageLocation === 'active-users' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, user_id, user_role, updateStatus, schoolId)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the user!' }, user_id, user_role, updateStatus, schoolId)
        )

    };

    const deleteUser = (user_id, user_role, updateStatus, schoolId) => {
        const values = {
            user_id: user_id,
            user_role: user_role,
            user_status: updateStatus,
            school_id: schoolId
        };

        console.log(values);

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
    const updateValues = (_data) => {
        let responseData = _data.Items;
        // let responseData = [];

        let userId = (_userRole === "Student") ? "student_id" : "N.A.";

        console.log("responseData", responseData);

        let finalDataArray = [];
        for (let index = 0; index < responseData.length; index++) {
            responseData[index].id = index + 1;

            //     responseData[index]['activity'] = (
            //         <input type="checkbox"
            //             name={responseData[index]["id"]}
            //             id={responseData[index][userId]}
            //         />
            //     )


            responseData[index]['action'] = (
                <>
                    {pageLocation === 'active-users' ? (
                        <>
                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-info"
                                onClick={(e) => {

                                    history.push(`/admin-portal/edit-users/${responseData[index].student_id}/${responseData[index].user_role}/${schoolId}`)
                                }}>
                                <i className="feather icon-edit" /> &nbsp; Edit
                            </Button>{' '}
                            &nbsp;
                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-danger"
                                onClick={(e) => saveUserIdDelete(e, responseData[index].student_id, responseData[index].user_role, 'Archived', responseData[index].school_id)}
                            >
                                <i className="feather icon-trash-2" /> &nbsp;Delete
                            </Button>
                        </>

                    ) : (

                        <>

                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-primary"
                                onClick={(e) => saveUserIdDelete(e, responseData[index].student_id, responseData[index].user_role, 'Active', responseData[index].school_id)}
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
        // setIsLoading(true);
        showLoader();

        const payLoadStatus = pageLocation === "active-users" ? 'Active' : 'Archived';

        console.log("startKeys : ", startKeys);
        console.log("Request for Pagination : ", {
            page_size: dataFromChild.page_size === undefined ? 10 : dataFromChild.page_size,
            user: _userRole.replace("s", ""),
            start_key: startKeys,
            searchedKeyword: dataFromChild.searchedKeyword === undefined ? "" : dataFromChild.searchedKeyword,
          });

        axios.post(
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
            })
            .then((response) => {

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
                  <>
                    {
                      pageLocation === 'active-users' ? (

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

                      ) : (
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
                      </React.Fragment>                      )
                    }
                  </>

                }
              </>
            )

        }

      </div>
      {loader}
    </React.Fragment>
    );
};

export default UserTableViewStudent;
