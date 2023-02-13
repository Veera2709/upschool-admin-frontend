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
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import BasicSpinner from '../../../../helper/BasicSpinner';

function Table({ columns, data }) {
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

        setOptions([]);

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
                    let classNameArr = response.data.classList.find(o => o.client_class_id === response.data.Items[0].class_id);
                    let sectionArr = response.data.sectionList.find(o => o.section_id === response.data.Items[0].section_id);
                    let schoolNameArr = response.data.schoolList.find(o => o.school_id === response.data.Items[0].school_id);

                    console.log(classNameArr);
                    console.log(schoolNameArr);

                    console.log("response.data.classList", response.data.classList.length);
                    if (colourOptions.length <= 0) {
                        response.data.classList.forEach((item, index) => {
                            colourOptions.push({ value: item.client_class_id, label: item.client_class_name })
                        })
                        setOptions(colourOptions)
                    }

                    _setUserID(user_id);

                    response.data.sectionList.forEach((item, index) => {
                        multiDropDownValues.push({ value: item.section_id, label: item.section_name })
                    })
                    setMultiDropOptions(multiDropDownValues)

                } else {

                }

            })
            .catch((error) => {
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

                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-info"
                                onClick={(e) => {

                                    history.push(`/admin-porttal/edit-users/${responseData[index].student_id}/${responseData[index].user_role}/${schoolId}`)
                                }}>
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
                                                                <Table columns={columns} data={userData} />
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

export default UserTableViewStudent;
