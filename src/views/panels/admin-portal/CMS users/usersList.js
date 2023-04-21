import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { GlobalFilter } from '../digicard/GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter, useRowSelect } from 'react-table';

import dynamicUrl from '../../../../helper/dynamicUrls';

import { Link, useHistory } from 'react-router-dom';
import { SessionStorage } from '../../../../util/SessionStorage';
import MESSAGES from '../../../../helper/messages';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { useLocation } from "react-router-dom";
import { fetchCMSUsersBasedonRoleStatus1, toggleUserStatus } from '../../../api/CommonApi';
import BasicSpinner from '../../../../helper/BasicSpinner';
import { async } from 'q';
import { isEmptyArray } from '../../../../util/utils';
// import AddUnit from './AddUnit';
// import EditUnit from './EditUnit';




function Table({ columns, data, modalOpen }) {
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const user_status = pageLocation === 'active-upSchoolUsers' ? "Active" : "Archived"
    const initiallySelectedRows = React.useMemo(() => new Set(["1"]), []);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAddUnit, setOpenAddUnit] = useState(false)
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    let history = useHistory();
    const MySwal = withReactContent(Swal);

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
            initialState: { pageIndex: 0, pageSize: 10, selectedRowPaths: initiallySelectedRows }
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


    const addingChapter = () => {
        history.push('/admin-portal/addUnits');
        setIsOpen(true);
    }


    const getAllCmsData = () => {
        let arrayWithCmsUsers = [];
        const UnitStatus = pageLocation === "active-upSchoolUsers" ? 'Active' : 'Archived';
        var userType = sessionStorage.getItem('user_type')

        let userTypePayload = (userType === "admin") ? "admin" : (userType === "creator") ? "creator" : (userType === "reviewer") ? "reviewer" : (userType === "publisher") ? "publisher" : "N.A.";

        page.map((item) => {
            console.log("Items : ", item);
            item.isSelected === true && arrayWithCmsUsers.push(item.original.user_id)
        })
        // selectedFlatRows.map((item) => {
        //     console.log("item.original.unit_chapter_id", item.original.user_id);
        //     console.log("pagelocation", pageLocation)
        //     arrayWithCmsUsers.push(item.original.user_id)
        // })
        console.log("CHECKED IDS : ", arrayWithCmsUsers);
        if (arrayWithCmsUsers.length === 0) {
            console.log("Not Selected");
            const MySwal = withReactContent(Swal);
            return MySwal.fire('Sorry', 'No User Selected!', 'warning').then(() => {
                // window.location.reload();
            });
        } else {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: 'Are you sure?',
                text: pageLocation === 'active-upSchoolUsers' ? 'Confirm deleting' : 'Confirm restoring',
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true,
            }).then((willDelete) => {
                if (willDelete.value) {
                    console.log("api calling");
                    // changeStatus(digi_card_id, digi_card_title);
                    console.log("Request : ", {
                        user_status: user_status === "active-upSchoolUsers" ? "Archived" : "Active",
                        user_array: arrayWithCmsUsers,

                    });

                    axios
                        .post(
                            dynamicUrl.bulkToggleCMSUserStatus,
                            {
                                data: {
                                    user_status: user_status === "Active" ? "Archived" : "Active",
                                    cms_user_array: arrayWithCmsUsers,

                                }
                            }, {
                            headers: { Authorization: sessionStorage.getItem('user_jwt') }
                        })
                        .then(async (response) => {
                            console.log("response : ", response);
                            console.log("pagelocation", pageLocation);
                            if (response.Error) {
                                console.log("Error");
                                hideLoader();
                                // sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                                pageLocation === "active-upSchoolUsers"

                                    ? sweetAlertHandler({
                                        title: MESSAGES.TTTLES.Sorry,
                                        type: "error",
                                        text: MESSAGES.ERROR.DeletingUser
                                    })
                                    : sweetAlertHandler({
                                        title: MESSAGES.TTTLES.Sorry,
                                        type: "error",
                                        text: MESSAGES.ERROR.RestoringUser
                                    });

                                history.push('/admin-portal/' + pageLocation)
                            }
                            else {
                                console.log("response : ", response);
                                if (response.data === 200) {
                                    MySwal.fire({
                                        title: (pageLocation === 'active-upSchoolUsers') ? 'Users Deleted' : "Users restored",
                                        icon: "success",
                                        // text: (pageLocation === 'active-upSchoolUsers') ? 'User Deleted' : 'User Restored',
                                        // type: 'success',
                                    }).then((willDelete) => {

                                        window.location.reload()

                                    })

                                }
                            }
                            //new




                        }
                        ).catch(async (errorResponse) => {
                            console.log("errorResponse : ", errorResponse);
                            if (errorResponse.response.data) {
                                MySwal.fire({
                                    title: MESSAGES.TTTLES.Sorry,
                                    icon: "error",
                                    text: errorResponse.response.data,
                                    // type: 'success',
                                }).then((willDelete) => {

                                    window.location.reload()

                                })
                            }

                        }

                        )

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
                    <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={(e) => { history.push('/admin-portal/add_UpSchoolusers'); }}>
                        <i className="feather icon-plus" /> Add User
                    </Button>
                    {user_status === "Active" ?
                        <Button
                            variant="danger"
                            className="btn-sm btn-round has-ripple ml-2"
                            // style={{ marginLeft: "1.5rem" }}
                            style={{ whiteSpace: "nowrap" }}
                            onClick={(e) => { getAllCmsData() }}
                        >Multi Delete</Button> :

                        <Button
                            onClick={getAllCmsData}
                            variant="primary"
                            className="btn-sm btn-round has-ripple ml-2"
                            // style={{ marginLeft: "1.5rem" }}
                            style={{ whiteSpace: "nowrap" }}
                        >Multi Restore</Button>
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
                                    {/* Add a sort direction indicator */}
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
                                    return <td  {...cell.getCellProps()}>{cell.render('Cell')}</td>;
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
                            type="number"
                            className="form-control ml-2"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                gotoPage(page);
                            }}
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

            {/* <Modal dialogClassName="my-modal" show={isOpenAddUnit} onHide={() => setOpenAddUnit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Add Unit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddUnit setOpenAddUnit={setOpenAddUnit} />
                </Modal.Body>
            </Modal> */}
        </>
    );
}

const UsersList = ({ _userType }) => {
    const columns = React.useMemo(
        () => [
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
                accessor: "index_no"
            },
            {
                Header: ' User Name',
                accessor: 'user_name'
            },
            {
                Header: ' User Role',
                accessor: 'display_role'
            },
            {
                Header: ' Entity',
                accessor: 'entity_type'
            },
            {
                Header: 'Options',
                accessor: 'actions'
            }
        ],
        []
    );

    // const data = React.useMemo(() => makeData(80), []);
    const [unitData, setUnitData] = useState([]);
    const [reloadAllData, setReloadAllData] = useState('Fetched');
    const [statusUrl, setStatusUrl] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenEditUnit, setOpenEditUnit] = useState(false);
    const [isOpenAddUnit, setOpenAddUnit] = useState(false);
    const [unitId, setUnitId] = useState()
    const MySwal = withReactContent(Swal);




    // console.log('data: ', data)

    const handleAddUnit = (e) => {

        console.log("No subjects, add subjects")
        e.preventDefault();
        setOpenAddUnit(true);
    }


    let history = useHistory();



    const sweetConfirmHandler = (user_id, user_status) => {
        var data = {
            user_id: user_id,
            user_status: user_status
        }
        MySwal.fire({
            title: 'Are you sure?',
            text: user_status === 'Active' ? 'Confirm to Restore User!' : 'Confirm to Delete user!',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                console.log("api calling");
                changeStatus(data, user_status);
            }
        });
    };

    const changeStatus = async (data, user_status) => {
        let changeStatusResponse = await toggleUserStatus(data)
        if (changeStatusResponse.Error) {
            if (changeStatusResponse.Error.response.data == 'Invalid Token') {
                sessionStorage.clear();
                localStorage.clear();
                history.push('/auth/signin-1');
                window.location.reload();
            }
        } else {
            MySwal.fire({
                title: user_status === 'Active' ? 'User Restored successfully!' : 'User Deleted successfully!',
                icon: 'success',
            }).then((willDelete) => {
                allUserList();
                // window.location.reload();
            })
        }
    }






    const allUserList = async () => {
        setIsLoading(true)
        const UnitStatus = pageLocation === "active-upSchoolUsers" ? 'Active' : 'Archived';
        var userType = sessionStorage.getItem('user_type')
        var plyloadData = {
            user_status: UnitStatus,
            user_type: userType
        }
        console.log("plyloadData", plyloadData);
        axios.post(dynamicUrl.fetchCMSUsersBasedonRoleStatus, {
            data: plyloadData
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log("Check : ", response);

                let dataResponse = response.data
                console.log("dataResponse", dataResponse);
                let finalDataArray = [];
                if (UnitStatus === 'Active') {
                    for (let index = 0; index < dataResponse.length; index++) {
                        console.log("index", index);
                        dataResponse[index]['display_role'] = userType;
                        if (userType === 'admin') {
                            dataResponse[index]['entity_type'] = 'All'
                        } else {
                            var user_role = dataResponse[index]['user_role'];
                            console.log("user_role", user_role);
                            dataResponse[index]['entity_type'] = (
                                <>
                                    {
                                        user_role.map((e, index) => {
                                            return (
                                                <>
                                                    &nbsp;
                                                    <span
                                                        style={{ backgroundColor: "cadetblue" }}
                                                        className="badge badge-warning inline-block mr-1"
                                                    >{e.roles.includes(userType) && e.entity}</span>
                                                </>
                                            );
                                        })

                                    }
                                </>
                            );;
                        }

                        dataResponse[index].index_no = index + 1;
                        dataResponse[index]['actions'] = (
                            <>
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        onClick={(e) => {
                                            history.push(`/admin-portal/editCMSUser/${dataResponse[index].user_id}`)
                                        }}
                                    >
                                        <i className="feather icon-edit" /> &nbsp; Edit
                                    </Button>
                                    &nbsp;
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-danger"
                                        onClick={(e) => sweetConfirmHandler(dataResponse[index].user_id, 'Archived')}
                                    >
                                        <i className="feather icon-trash-2 " /> &nbsp; Delete
                                    </Button>
                                    &nbsp;
                                </>
                            </>
                        );
                        finalDataArray.push(dataResponse[index]);
                        console.log('finalDataArray: ', finalDataArray)
                    }
                } else {
                    for (let index = 0; index < dataResponse.length; index++) {
                        console.log("index", index);
                        dataResponse[index]['display_role'] = userType;
                        if (userType === 'admin') {
                            dataResponse[index]['entity_type'] = 'All'
                        } else {
                            var user_role = dataResponse[index]['user_role'];
                            console.log("user_role", user_role);
                            dataResponse[index]['entity_type'] = (
                                <>
                                    {
                                        user_role.map((e, index) => {
                                            return (
                                                <>
                                                    &nbsp;
                                                    <span
                                                        style={{ backgroundColor: "cadetblue" }}
                                                        className="badge badge-warning inline-block mr-1"
                                                    >{e.roles.includes(userType) && e.entity}</span>
                                                </>
                                            );
                                        })

                                    }
                                </>
                            );;
                        }

                        dataResponse[index].index_no = index + 1;
                        dataResponse[index]['actions'] = (
                            <>
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        onClick={(e) => sweetConfirmHandler(dataResponse[index].user_id, 'Active')}
                                    >
                                        <i className="feather icon-plus" /> &nbsp; Restore
                                    </Button>
                                    &nbsp;
                                </>
                            </>
                        );
                        finalDataArray.push(dataResponse[index]);
                        console.log('finalDataArray: ', finalDataArray)

                    }
                }

                setUnitData(finalDataArray);
                console.log('resultData: ', finalDataArray);
                setIsLoading(false)

            })
            .catch((error) => {
                if (error.response.data === 'Invalid Token') {
                    sessionStorage.clear();
                    localStorage.clear();
                    history.push('/auth/signin-1');
                    window.location.reload();
                } else {
                    console.log("err", error);
                }
            })

    }

    useEffect(() => {
        let userJWT = sessionStorage.getItem('user_jwt');
        console.log("jwt", userJWT);
        if (userJWT === "" || userJWT === undefined || userJWT === "undefined" || userJWT === null) {
            sessionStorage.clear();
            localStorage.clear();
            history.push('/auth/signin-1');
            window.location.reload();
        } else {

            allUserList();
        }



    }, [_userType])


    return (
        <div>
            {
                isLoading ? (
                    <BasicSpinner />
                ) : (
                    <>
                        {
                            unitData.length <= 0 ? (
                                <>
                                    {
                                        pageLocation === 'active-upSchoolUsers' ? (
                                            < React.Fragment >
                                                <div>
                                                    <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-upSchoolUsers" ? 'Active Users' : 'Archived Users'} Found</h3>
                                                    <div className="form-group fill text-center">
                                                        <br></br>
                                                        <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={(e) => { history.push('/admin-portal/add_UpSchoolusers'); }}>
                                                            <i className="feather icon-plus" /> Add Users
                                                        </Button>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ) : (
                                            <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-upSchoolUsers" ? 'Active Users' : 'Archived Users'} Found</h3>
                                        )
                                    }

                                </>
                            ) : (
                                <>
                                    <React.Fragment>
                                        <Row>
                                            <Col sm={12}>
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5" className='d-flex justify-content-between'>
                                                            <h5>CMS Users</h5>
                                                            <h5>Total Entries :- {unitData.length}</h5>
                                                        </Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Table columns={columns} data={unitData} />
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </React.Fragment>
                                </>
                            )
                        }
                    </>
                )
            }
        </div >

    );
};
export default UsersList;
