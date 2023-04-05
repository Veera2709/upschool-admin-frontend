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

function Table({ columns, data, modalOpen, userRole }) {

    console.log("_userRole in Table", userRole);
    const initiallySelectedRows = React.useMemo(() => new Set(["1"]), []);

    const [stateStudent, setStateStudent] = useState([])
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
        state: { pageIndex, pageSize, selectedRowPaths }
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10, selectedRowPaths: initiallySelectedRows },
            userRole
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect
    );

    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);


    const MySwal = withReactContent(Swal);
    const history = useHistory();
    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };
    const user_status = pageLocation === 'active-users' ? "Active" : "Archived"
    console.log("user_status : ", user_status);

    // const conformDelete = () => {

    //     MySwal.fire({
    //         title: 'Are you sure?',
    //         text: 'Confirm deleting User',
    //         type: 'warning',
    //         showCloseButton: true,
    //         showCancelButton: true
    //     }).then((willDelete) => {
    //         if (willDelete.value) {
    //             console.log("api calling");
    //             deleteStudentById();
    //         } else {
    //             return MySwal.fire('', 'User is safe!', 'error');
    //         }
    //     });
    // }
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
        // let arrIds = [];
        // stateStudent.forEach(d => {
        //     if (d.select) {
        //         arrIds.push(d.id)
        //     }
        // })
        // console.log(arrIds)

        console.log("data check: ", data);
        console.log("userRole : ", userRole);

        let arrIds = [];
        let userId = (userRole === "Students") ? "student_id" : "N.A.";

        let userRolePayload = (userRole === "Students") ? "Student" : "N.A.";

        console.log(userId);
        for (let k = 0; k < data.length; k++) {

            console.log(data[k][userId]);

            // console.log("document.getElementById(data[k][userId]).checked ", document.getElementById(data[k][userId]).checked, "---", data[k][userId]);

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

        let userRolePayload = (userRole === "Students") ? "Student" : "N.A.";

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
                                    sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: (userRole === "Students") ? MESSAGES.ERROR.DeletingStudents : MESSAGES.ERROR.InvalidUser })
                                    :
                                    sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: (userRole === "Students") ? MESSAGES.ERROR.RestoringStudents : MESSAGES.ERROR.InvalidUser });

                                history.push('/admin-portal/' + pageLocation)
                                // fetchUserData();
                            } else {
                                console.log("response : ", response);
                                if (response.data === 200) {
                                    // hideLoader();
                                    MySwal.fire({
                                        title: (userRole === "Students") && pageLocation === 'active-users' ? 'Students Deleted' : 'Students Restored',
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

                    {user_status === "Active" ? (
                        <>
                            <Link to={'/admin-portal/add-users'}>
                                <Button
                                    style={{ whiteSpace: "nowrap" }}
                                    variant="success"
                                    className="btn-sm btn-round has-ripple ml-2">
                                    <i className="feather icon-plus" /> Add Users
                                </Button>
                            </Link>

                            <Button
                                onClick={(e) => { deleteAllStudent() }}
                                variant="danger"
                                className="btn-sm btn-round has-ripple ml-2"
                                style={{ whiteSpace: "nowrap" }} >
                                <i className="feather icon-trash-2" /> &nbsp;
                                Multi Delete
                            </Button>
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

    const updateValues = (_data) => {
        let responseData = _data;
        // let responseData = [];

        let userId = (_userRole === "Students") ? "student_id" : "N.A.";

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

                                    <h3 style={{ textAlign: 'center' }}>No {sessionStorage.getItem('user_type')} Found</h3>
                                    <div className="form-group fill text-center">
                                        <br></br>

                                        {
                                            pageLocation === 'active-users' && (
                                                <Link to={'/admin-portal/add-users'}>
                                                    <Button variant="success" className="btn-sm btn-round has-ripple ml-2">
                                                        <i className="feather icon-plus" /> Add Users
                                                    </Button>
                                                </Link>
                                            )
                                        }

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
                                                                <Table columns={columns} data={userData} userRole={_userRole} selectAllCheckbox={selectAllCheckbox} />
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

export default UserTableViewStudent;
