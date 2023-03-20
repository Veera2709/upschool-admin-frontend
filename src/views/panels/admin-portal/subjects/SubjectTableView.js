import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTable, useSortBy, usePagination, useGlobalFilter, useRowSelect } from 'react-table';

import MESSAGES from '../../../../helper/messages';
import { GlobalFilter } from '../../../common-ui-components/tables/GlobalFilter';
import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import AddSubjects from './AddSubjects';
import EditSubjects from './EditSubjects';
import BasicSpinner from '../../../../helper/BasicSpinner';
import { toggleMultiSubjectStatus, fetchUnitAndSubject } from '../../../api/CommonApi';
import { SessionStorage } from '../../../../util/SessionStorage';

function Table({ columns, data }) {

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [subjectData, setSubjectData] = useState([]);
    const [_subjectID, _setSubjectID] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [unitsAndSubjects, setUnitsAndSubjects] = useState(false);
    const [_relatedSubjects, _setRelatedSubjects] = useState([]);
    const [_units, _setUnits] = useState([]);
    const [editSubjectID, setEditSubjectID] = useState('');

    const [isOpenAddSubject, setIsOpenAddSubject] = useState(false);
    const [isEditAddSubject, setIsOpenEditSubject] = useState(false);

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    useEffect(() => {
        fetchAllSubjectsData();
    }, []);

    useEffect(() => {

        async function fetchData() {
            const ResultData = await fetchUnitAndSubject();

            if (ResultData.Error) {

                if (ResultData.Error.response.data == 'Invalid Token') {

                    sessionStorage.clear();
                    localStorage.clear();

                    history.push('/auth/signin-1');
                    window.location.reload();

                } else {

                    return MySwal.fire('Sorry', ResultData.Error.response.data, 'warning').then(() => {
                        window.location.reload();
                    });

                }
            } else {

                hideLoader();

                console.log('inside res fetch Unit And Subject');
                console.log(ResultData);

                _setRelatedSubjects(ResultData.subjectList);
                _setUnits(ResultData.unitList);

            }
        }
        fetchData();

    }, [unitsAndSubjects])

    const sweetConfirmHandler = (alert, subject_id, updateStatus) => {

        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type,
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                showLoader();
                deleteSubject(subject_id, updateStatus);
            } else {

                // const returnValue = pageLocation === 'active-subjects' ? (
                //     MySwal.fire('', MESSAGES.INFO.DATA_SAFE, 'success')
                // ) : (
                //     MySwal.fire('', MESSAGES.INFO.FAILED_TO_RESTORE, 'error')
                // )
                // return returnValue;
            }
        });
    };

    const saveSubjectIdDelete = (e, subject_id, updateStatus) => {
        e.preventDefault();

        pageLocation === 'active-subjects' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, subject_id, updateStatus)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the subject!' }, subject_id, updateStatus)
        )

    };

    const fetchAllSubjectsData = () => {

        setIsLoading(true);
        showLoader();
        console.log(pageLocation);

        const subjectStatus = pageLocation === 'active-subjects' ? 'Active' : 'Archived';

        axios
            .post(dynamicUrl.fetchAllSubjects,
                {
                    data: {
                        subject_status: subjectStatus
                    }
                }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })

            .then(async (response) => {

                console.log(response.data);
                console.log(response.data.Items);
                hideLoader();

                setUnitsAndSubjects(true);

                if (response.data.Items) {

                    const responseData = response.data.Items;

                    console.log("responseData", responseData);

                    let finalDataArray = [];

                    for (let index = 0; index < responseData.length; index++) {
                        responseData[index].id = index + 1;

                        responseData[index]['action'] = (
                            <>
                                {console.log(pageLocation)}
                                {pageLocation === 'active-subjects' ? (

                                    <>
                                        <Button
                                            size="sm"
                                            className="btn btn-icon btn-rounded btn-info"
                                            onClick={(e) => {
                                                setEditSubjectID(responseData[index].subject_id);
                                                setIsOpenEditSubject(true);
                                            }}>
                                            <i className="feather icon-edit" /> &nbsp; Edit
                                        </Button>{' '}
                                        &nbsp;
                                        <Button
                                            size="sm"
                                            className="btn btn-icon btn-rounded btn-danger"
                                            onClick={(e) => saveSubjectIdDelete(e, responseData[index].subject_id, 'Archived')}
                                        >
                                            <i className="feather icon-trash-2" /> &nbsp;Delete
                                        </Button>
                                    </>

                                ) : (

                                    <>

                                        <Button
                                            size="sm"
                                            className="btn btn-icon btn-rounded btn-primary"
                                            onClick={(e) => saveSubjectIdDelete(e, responseData[index].subject_id, 'Active')}
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
                    setSubjectData(finalDataArray);
                    setIsLoading(false);

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

                        sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });

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
    };

    const handleAddSubjects = (e) => {

        console.log("No subjects, add subjects")
        e.preventDefault();
        setIsOpenAddSubject(true);
    }

    const deleteSubject = (subject_id, updateStatus) => {
        const values = {
            subject_id: subject_id,
            subject_status: updateStatus
        };

        console.log(values);

        axios
            .post(dynamicUrl.toggleSubjectStatus,
                {
                    data: {
                        subject_id: subject_id,
                        subject_status: updateStatus
                    }
                }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
            .then(async (response) => {

                if (response.Error) {
                    hideLoader();
                    sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingSubject });
                    fetchAllSubjectsData();
                } else {

                    hideLoader()
                    updateStatus === 'Active' ? (
                        MySwal.fire('', MESSAGES.INFO.SUBJECT_RESTORED, 'success')

                    ) : (
                        MySwal.fire('', MESSAGES.INFO.SUBJECT_DELETED, 'success')
                    )
                    fetchAllSubjectsData();


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
                        fetchAllSubjectsData();

                    }

                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                    fetchAllSubjectsData();

                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                    fetchAllSubjectsData();

                }
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
        state: { pageIndex, pageSize }
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 }
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                {
                    id: "selection",
                    Header: ({ getToggleAllPageRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
                        </div>
                    ),
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    )
                },
                ...columns
            ]);
        }
    );

    const IndeterminateCheckbox = React.forwardRef(
        ({ indeterminate, ...rest }, ref) => {
            const defaultRef = React.useRef();
            const resolvedRef = ref || defaultRef;

            React.useEffect(() => {
                resolvedRef.current.indeterminate = indeterminate;
            }, [resolvedRef, indeterminate]);

            return (
                <>
                    <input type="checkbox" ref={resolvedRef} {...rest} />
                </>
            );
        }
    );

    const multiDelete = async (status) => {

        console.log("selectedFlatRows", selectedFlatRows);
        const subjectIDs = [];

        selectedFlatRows.map((item) => {
            subjectIDs.push(item.original.subject_id)
        })

        if (subjectIDs.length > 0) {

            MySwal.fire({
                title: 'Are you sure?',
                text: `Confirm ${pageLocation === 'active-subjects' ? "deleting" : "restoring"} the selected Subject(s)!`,
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true
            }).then(async (willDelete) => {
            
                if (willDelete.value) {
            
                    var payload = {
                        "subject_status": status,
                        "subject_array": subjectIDs
                    }
        
                    const ResultData = await toggleMultiSubjectStatus(payload)
                    if (ResultData.Error) {
                        if (ResultData.Error.response.data == 'Invalid Token') {
                            sessionStorage.clear();
                            localStorage.clear();
                            history.push('/auth/signin-1');
                            window.location.reload();
                        } else {
                            return MySwal.fire('Sorry', ResultData.Error.response.data, 'warning').then(() => {
                                window.location.reload();
                            });
                        }
                    } else {
                        return MySwal.fire('Success', `All the chosen Subjects have been ${status === 'Active' ? 'restored' : "deleted"} successfully!`, 'success').then(() => {
                            window.location.reload();
                        });
                    }
                }
            })

            
        } else {
            return MySwal.fire('Sorry', 'No Subjects are selected!', 'warning').then(() => {
                // window.location.reload();
            });
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



                    {pageLocation === 'active-subjects' ? (
                        <>
                            <Button
                                variant="success"
                                className="btn-sm btn-round has-ripple ml-2"
                                onClick={(e) => {
                                    handleAddSubjects(e);
                                }}
                            >
                                <i className="feather icon-plus" /> Add Subjects
                            </Button>

                            <Button
                                variant="success"
                                className='btn-sm btn-round has-ripple ml-2 btn btn-danger'
                                onClick={() => {
                                    multiDelete("Archived")
                                }}>
                                <i className="feather icon-trash-2"
                                />  Multi Delete
                            </Button>
                        </>

                    ) : (
                        <Button
                            className='btn-sm btn-round has-ripple ml-2 btn btn-primary'
                            onClick={() => { multiDelete("Active") }}>
                            <i className="feather icon-plus"
                            />   Multi Restore
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

            <Modal dialogClassName="my-modal" show={isOpenAddSubject} onHide={() => setIsOpenAddSubject(false)}>

                <Modal.Header closeButton>

                    <Modal.Title as="h5">Add Subject</Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <AddSubjects _units={_units} _relatedSubjects={_relatedSubjects} setIsOpenAddSubject={setIsOpenAddSubject} fetchAllSubjectsData={fetchAllSubjectsData} />

                </Modal.Body>

            </Modal>

            <Modal dialogClassName="my-modal" show={isEditAddSubject} onHide={() => setIsOpenEditSubject(false)}>

                <Modal.Header closeButton>

                    <Modal.Title as="h5">Edit Subject</Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <EditSubjects _units={_units} _relatedSubjects={_relatedSubjects} editSubjectID={editSubjectID} setIsOpenEditSubject={setIsOpenEditSubject} fetchAllSubjectsData={fetchAllSubjectsData} />

                </Modal.Body>

            </Modal>
        </>
    );
}

const SubjectTableView = ({ userStatus }) => {

    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor: 'id'
            },
            {
                Header: 'Subject Name',
                accessor: 'subject_title'
            },
            {
                Header: 'Options',
                accessor: 'action'
            }
        ],
        []
    );

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [subjectData, setSubjectData] = useState([]);
    const [_subjectID, _setSubjectID] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [unitsAndSubjects, setUnitsAndSubjects] = useState(false);
    const [_relatedSubjects, _setRelatedSubjects] = useState([]);
    const [_units, _setUnits] = useState([]);

    const [isOpenAddSubject, setIsOpenAddSubject] = useState(false);
    const [isEditAddSubject, setIsOpenEditSubject] = useState(false);
    const [editSubjectID, setEditSubjectID] = useState('');

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    useEffect(() => {
        fetchAllSubjectsData();
    }, []);

    useEffect(() => {

        async function fetchData() {
            const ResultData = await fetchUnitAndSubject();

            if (ResultData.Error) {

                if (ResultData.Error.response.data == 'Invalid Token') {

                    sessionStorage.clear();
                    localStorage.clear();

                    history.push('/auth/signin-1');
                    window.location.reload();

                } else {

                    return MySwal.fire('Sorry', ResultData.Error.response.data, 'warning').then(() => {
                        window.location.reload();
                    });

                }
            } else {

                hideLoader();

                console.log('inside res fetch Unit And Subject');
                console.log(ResultData);

                _setRelatedSubjects(ResultData.subjectList);
                _setUnits(ResultData.unitList);

            }
        }
        fetchData();

    }, [unitsAndSubjects])

    const sweetConfirmHandler = (alert, subject_id, updateStatus) => {

        MySwal.fire({

            title: alert.title,
            text: alert.text,
            type: alert.type,
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {

            if (willDelete.value) {
                showLoader();
                deleteSubject(subject_id, updateStatus);
            } else {

                // const returnValue = pageLocation === 'active-subjects' ? (
                //     MySwal.fire('', MESSAGES.INFO.DATA_SAFE, 'success')
                // ) : (
                //     MySwal.fire('', MESSAGES.INFO.FAILED_TO_RESTORE, 'error')
                // )
                // return returnValue;
            }
        });
    };

    const saveSubjectIdDelete = (e, subject_id, updateStatus) => {
        e.preventDefault();

        pageLocation === 'active-subjects' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, subject_id, updateStatus)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the subject!' }, subject_id, updateStatus)
        );

    };

    const fetchAllSubjectsData = () => {

        setIsLoading(true);
        showLoader();
        console.log(pageLocation);

        const subjectStatus = pageLocation === 'active-subjects' ? 'Active' : 'Archived';

        axios
            .post(dynamicUrl.fetchAllSubjects,
                {
                    data: {
                        subject_status: subjectStatus
                    }
                }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })

            .then(async (response) => {

                console.log(response.data);
                console.log(response.data.Items);
                hideLoader();

                setUnitsAndSubjects(true);

                if (response.data.Items) {

                    const responseData = response.data.Items;

                    console.log("responseData", responseData);

                    let finalDataArray = [];

                    for (let index = 0; index < responseData.length; index++) {
                        responseData[index].id = index + 1;

                        responseData[index]['action'] = (
                            <>
                                {console.log(pageLocation)}
                                {pageLocation === 'active-subjects' ? (

                                    <>
                                        <Button
                                            size="sm"
                                            className="btn btn-icon btn-rounded btn-info"
                                            onClick={(e) => {
                                                setEditSubjectID(responseData[index].subject_id);
                                                setIsOpenEditSubject(true);
                                            }}>
                                            <i className="feather icon-edit" /> &nbsp; Edit
                                        </Button>{' '}
                                        &nbsp;
                                        <Button
                                            size="sm"
                                            className="btn btn-icon btn-rounded btn-danger"
                                            onClick={(e) => saveSubjectIdDelete(e, responseData[index].subject_id, 'Archived')}
                                        >
                                            <i className="feather icon-trash-2" /> &nbsp;Delete
                                        </Button>
                                    </>

                                ) : (

                                    <>

                                        <Button
                                            size="sm"
                                            className="btn btn-icon btn-rounded btn-primary"
                                            onClick={(e) => saveSubjectIdDelete(e, responseData[index].subject_id, 'Active')}
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
                    setSubjectData(finalDataArray);
                    setIsLoading(false);

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

                        sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });


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
    };

    const handleAddSubjects = (e) => {

        console.log("No subjects, add subjects")
        e.preventDefault();
        setIsOpenAddSubject(true);
    }

    const deleteSubject = (subject_id, updateStatus) => {

        const values = {
            subject_id: subject_id,
            subject_status: updateStatus
        };

        console.log(values);

        axios
            .post(dynamicUrl.toggleSubjectStatus,
                {
                    data: {
                        subject_id: subject_id,
                        subject_status: updateStatus
                    }
                }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })

            .then(async (response) => {

                if (response.Error) {

                    hideLoader();
                    sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'warning', text: MESSAGES.ERROR.DeletingUser });
                    fetchAllSubjectsData();

                } else {

                    hideLoader()
                    updateStatus === 'Active' ? (
                        MySwal.fire('', MESSAGES.INFO.SUBJECT_RESTORED, 'success')

                    ) : (
                        MySwal.fire('', MESSAGES.INFO.SUBJECT_DELETED, 'success')
                    )
                    fetchAllSubjectsData();

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
                        fetchAllSubjectsData();

                    }

                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                    fetchAllSubjectsData();

                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                    fetchAllSubjectsData();

                }
            });
    };

    return (

        <div>

            {
                isLoading ? (
                    <BasicSpinner />
                ) : (

                    <>
                        {
                            subjectData.length <= 0 ? (
                                <>
                                    {
                                        pageLocation === 'active-subjects' ? (
                                            < React.Fragment >
                                                <div>

                                                    <h3 style={{ textAlign: 'center' }}>No Subjects Found</h3>
                                                    <div className="form-group fill text-center">
                                                        <br></br>

                                                        <Button
                                                            variant="success"
                                                            className="btn-sm btn-round has-ripple ml-2"
                                                            onClick={(e) => {
                                                                handleAddSubjects(e);
                                                            }}
                                                        >
                                                            <i className="feather icon-plus" /> Add Subjects
                                                        </Button>


                                                    </div>

                                                </div>

                                                <Modal dialogClassName="my-modal" show={isOpenAddSubject} onHide={() => setIsOpenAddSubject(false)}>

                                                    <Modal.Header closeButton>

                                                        <Modal.Title as="h5">Add Subject</Modal.Title>

                                                    </Modal.Header>

                                                    <Modal.Body>

                                                        <AddSubjects _units={_units} _relatedSubjects={_relatedSubjects} setIsOpenAddSubject={setIsOpenAddSubject} fetchAllSubjectsData={fetchAllSubjectsData} />

                                                    </Modal.Body>

                                                </Modal>

                                            </React.Fragment>
                                        ) : (
                                            <h3 style={{ textAlign: 'center' }}>No Subjects Found</h3>
                                        )
                                    }

                                </>
                            ) : (

                                <>

                                    < React.Fragment >
                                        <Row>
                                            <Col sm={12}>
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">Subject List</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Table columns={columns} data={subjectData} />
                                                    </Card.Body>
                                                </Card>

                                            </Col>
                                        </Row>
                                    </React.Fragment>

                                    <Modal dialogClassName="my-modal" show={isOpenAddSubject} onHide={() => setIsOpenAddSubject(false)}>

                                        <Modal.Header closeButton>

                                            <Modal.Title as="h5">Add Subject</Modal.Title>

                                        </Modal.Header>

                                        <Modal.Body>

                                            <AddSubjects _units={_units} _relatedSubjects={_relatedSubjects} setIsOpenAddSubject={setIsOpenAddSubject} fetchAllSubjectsData={fetchAllSubjectsData} />

                                        </Modal.Body>

                                    </Modal>

                                    <Modal dialogClassName="my-modal" show={isEditAddSubject} onHide={() => setIsOpenEditSubject(false)}>

                                        <Modal.Header closeButton>

                                            <Modal.Title as="h5">Edit Subject</Modal.Title>

                                        </Modal.Header>

                                        <Modal.Body>

                                            <EditSubjects _units={_units} _relatedSubjects={_relatedSubjects} editSubjectID={editSubjectID} setIsOpenEditSubject={setIsOpenEditSubject} fetchAllSubjectsData={fetchAllSubjectsData} />

                                        </Modal.Body>

                                    </Modal>

                                </>
                            )
                        }
                    </>
                )
            }
        </div >
    );
};

export default SubjectTableView;