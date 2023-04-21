import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTable, useSortBy, usePagination, useGlobalFilter, useRowSelect } from 'react-table';

import MESSAGES from '../../../../../helper/messages';
import { GlobalFilter } from '../../../../common-ui-components/tables/GlobalFilter';
import useFullPageLoader from '../../../../../helper/useFullPageLoader';
import AddSourceOfQuestion from './AddSourceOfQuestion';
import EditSourceOfQuestion from './EditSourceOfQuestion';
import BasicSpinner from '../../../../../helper/BasicSpinner';
import {
    bulkToggleQuestionSourceStatus,
    toggleQuestionSourceStatus,
    fetchSourcesBasedonStatus
} from '../../../../api/CommonApi';

function Table({ columns, data }) {

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [sourceOfQuestion, setSourceOfQuestion] = useState([{}]);

    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[3]);
    const [editSourceOfQuestionID, setEditSourceOfQuestionID] = useState('');

    const [isOpenAddSourceOfQuestion, setIsOpenAddSourceOfQuestion] = useState(false);
    const [isOpenEditSourceOfQuestion, setIsOpenEditSourceOfQuestion] = useState(false);

    const MySwal = withReactContent(Swal);
    console.log(pageLocation);
    useEffect(() => {
        fetchAllSourceOfQuestion();
    }, []);

    const sweetConfirmHandler = (alert, source_id, updateStatus) => {

        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type,
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                showLoader();
                deleteSourceOfQuestion(source_id, updateStatus);
            }
        });
    };

    const saveSourceOfQuestionIdDelete = (e, source_id, updateStatus) => {
        e.preventDefault();

        pageLocation === 'active-sourceOfQuestion   ' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, source_id, updateStatus)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the Source of question!' }, source_id, updateStatus)
        )

    };

    const fetchAllSourceOfQuestion = async () => {

        setIsLoading(true);
        showLoader();
        console.log(pageLocation);

        const sourceOfQuestionStatus = pageLocation === 'active-sourceOfQuestion' ? 'Active' : 'Archived';

        const ResultData = await fetchSourcesBasedonStatus({ source_status: sourceOfQuestionStatus });

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

            if (ResultData.Items) {

                const responseData = ResultData.Items;
                console.log("responseData", responseData);
                let finalDataArray = [];

                for (let index = 0; index < responseData.length; index++) {

                    responseData[index].id = index + 1;
                    responseData[index]['action'] = (
                        <>
                            {console.log(pageLocation)}
                            {pageLocation === 'active-sourceOfQuestion' ? (
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-info"
                                        onClick={(e) => {
                                            setEditSourceOfQuestionID(responseData[index].source_id);
                                            setIsOpenEditSourceOfQuestion(true);
                                        }}
                                    >
                                        <i className="feather icon-edit" /> &nbsp; Edit
                                    </Button>{' '}
                                    &nbsp;
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-danger"
                                        onClick={(e) => saveSourceOfQuestionIdDelete(e, responseData[index].source_id, 'Archived')}
                                    >
                                        <i className="feather icon-trash-2" /> &nbsp; Delete
                                    </Button>
                                </>

                            ) : (
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        onClick={(e) => saveSourceOfQuestionIdDelete(e, responseData[index].source_id, 'Active')}
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
                setSourceOfQuestion(finalDataArray);
                setIsLoading(false);
            }

        }

    };

    const handleAddSourceOfQuestion = (e) => {

        console.log("No Question Category, add Question Category");
        e.preventDefault();
        setIsOpenAddSourceOfQuestion(true);
    }

    const deleteSourceOfQuestion = async (source_id, updateStatus) => {
        const values = {
            source_id: source_id,
            source_status: updateStatus
        };

        console.log(values);

        const ResultData = await toggleQuestionSourceStatus(values);
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

            hideLoader()
            updateStatus === 'Active' ? (
                MySwal.fire('', MESSAGES.INFO.QUESTION_CATEGORY_RESTORED, 'success')

            ) : (
                MySwal.fire('', MESSAGES.INFO.QUESTION_CATEGORY_DELETED, 'success')
            )
            fetchAllSourceOfQuestion();
        }
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
        const sourceofQuestionsIDs = [];

        selectedFlatRows.map((item) => {
            sourceofQuestionsIDs.push(item.original.source_id)
        })

        if (sourceofQuestionsIDs.length > 0) {

            MySwal.fire({
                title: 'Are you sure?',
                text: `Confirm ${pageLocation === 'active-sourceOfQuestion' ? "deleting" : "restoring"} the selected Source of question!`,
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true
            }).then(async (willDelete) => {

                if (willDelete.value) {

                    showLoader();

                    var payload = {
                        "source_status": status,
                        "source_array": sourceofQuestionsIDs
                    }

                    const ResultData = await bulkToggleQuestionSourceStatus(payload);
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
                        return MySwal.fire('Success', `All the chosen Source of questions have been ${status === 'Active' ? 'restored' : "deleted"} successfully!`, 'success').then(() => {
                            window.location.reload();
                        });
                    }
                }
            });

        } else {

            return MySwal.fire('Sorry', 'No Question questions are selected!', 'warning');
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

                    {pageLocation === 'active-sourceOfQuestion' ? (
                        <>
                            <Button
                                variant="success"
                                className="btn-sm btn-round has-ripple ml-2"
                                onClick={(e) => {
                                    handleAddSourceOfQuestion(e);
                                }}
                            >
                                <i className="feather icon-plus" /> Add Source of Question
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

            <Modal
                size="sm"
                dialogClassName="my-modal"
                show={isOpenAddSourceOfQuestion
                }
                onHide={() => setIsOpenAddSourceOfQuestion(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Add Source Of Question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddSourceOfQuestion setIsOpenAddSourceOfQuestion={setIsOpenAddSourceOfQuestion} />
                </Modal.Body>
            </Modal>

            <Modal
                size="sm"
                dialogClassName="my-modal"
                show={isOpenEditSourceOfQuestion}
                onHide={() => setIsOpenEditSourceOfQuestion(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Edit Questions Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditSourceOfQuestion editSourceOfQuestionID={editSourceOfQuestionID} setIsOpenEditSourceOfQuestion={setIsOpenEditSourceOfQuestion} />
                </Modal.Body>
            </Modal>
        </>
    );
}

const SourceOfQuestionTableView = ({ userStatus }) => {

    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor: 'id'
            },
            {
                Header: 'Source of Question Name',
                accessor: 'source_name'
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
    const [sourceOfQuestion, setSourceOfQuestion] = useState([]);
    const [_questionCategoryID, _setQuestionCategoryID] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [_showLoader, _setShowLoader] = useState(false);
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[3]);

    const [isOpenAddSourceOfQuestion, setIsOpenAddSourceOfQuestion] = useState(false);
    const [isOpenEditSourceOfQuestion, setIsOpenEditSourceOfQuestion] = useState(false);
    const [editSourceOfQuestionID, setEditSourceOfQuestionID] = useState('');

    const MySwal = withReactContent(Swal);

    useEffect(() => {
        fetchAllSourceOfQuestion();
    }, []);

    const sweetConfirmHandler = (alert, source_id, updateStatus) => {

        MySwal.fire({

            title: alert.title,
            text: alert.text,
            type: alert.type,
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {

            if (willDelete.value) {
                showLoader();
                _setShowLoader(true);
                deleteSourceOfQuestion(source_id, updateStatus);
            }
        });
    };

    const saveSourceOfQuestionIdDelete = (e, source_id, updateStatus) => {
        e.preventDefault();

        pageLocation === 'active-sourceOfQuestion' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, source_id, updateStatus)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the Question Category!' }, source_id, updateStatus)
        );

    };

    const fetchAllSourceOfQuestion = async () => {

        setIsLoading(true);
        showLoader();
        _setShowLoader(true);
        console.log(pageLocation);

        const sourceOfQuestionStatus = pageLocation === 'active-sourceOfQuestion' ? 'Active' : 'Archived';

        const ResultData = await fetchSourcesBasedonStatus({ source_status: sourceOfQuestionStatus });

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
            _setShowLoader(false);

            console.log('inside res source of q');
            console.log(ResultData);

            if (ResultData.Items) {

                const responseData = ResultData.Items;
                console.log("responseData", responseData);

                let finalDataArray = [];

                for (let index = 0; index < responseData.length; index++) {
                    responseData[index].id = index + 1;

                    responseData[index]['action'] = (
                        <>
                            {console.log(pageLocation)}
                            {pageLocation === 'active-sourceOfQuestion' ? (

                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-info"
                                        onClick={(e) => {
                                            setEditSourceOfQuestionID(responseData[index].source_id);
                                            setIsOpenEditSourceOfQuestion(true);
                                        }}>
                                        <i className="feather icon-edit" /> &nbsp; Edit
                                    </Button>{' '}
                                    &nbsp;
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-danger"
                                        onClick={(e) => saveSourceOfQuestionIdDelete(e, responseData[index].source_id, 'Archived')}
                                    >
                                        <i className="feather icon-trash-2" /> &nbsp; Delete
                                    </Button>
                                </>

                            ) : (

                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-round btn-primary"
                                        onClick={(e) => saveSourceOfQuestionIdDelete(e, responseData[index].source_id, 'Active')}
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
                setSourceOfQuestion(finalDataArray);
                setIsLoading(false);

            }

        }

    };

    const handleAddSourceOfQuestion = (e) => {

        e.preventDefault();
        setIsOpenAddSourceOfQuestion(true);
    }

    const deleteSourceOfQuestion = async (source_id, updateStatus) => {

        const values = {
            source_id: source_id,
            source_status: updateStatus
        };

        console.log(values);

        const ResultData = await toggleQuestionSourceStatus(values);
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
            _setShowLoader(false);
            updateStatus === 'Active' ? (
                MySwal.fire('', MESSAGES.INFO.SOURCE_RESTORED, 'success')

            ) : (
                MySwal.fire('', MESSAGES.INFO.SOURCE_DELETED, 'success')
            )
            fetchAllSourceOfQuestion();
        }
    };

    return (

        <div>
            {
                isLoading ? (
                    <BasicSpinner />
                ) : (

                    <>
                        {
                            sourceOfQuestion.length <= 0 ? (
                                <>
                                    {
                                        pageLocation === 'active-sourceOfQuestion' ? (
                                            < React.Fragment >
                                                <div>
                                                    <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-sourceOfQuestion" ? 'Active Question Categories' : 'Archived Question Categories'} Found</h3>
                                                    <div className="form-group fill text-center">
                                                        <br></br>
                                                        <Button
                                                            variant="success"
                                                            className="btn-sm btn-round has-ripple ml-2"
                                                            onClick={(e) => {
                                                                handleAddSourceOfQuestion(e);
                                                            }}
                                                        >
                                                            <i className="feather icon-plus" /> Add Source of question
                                                        </Button>
                                                    </div>
                                                </div>

                                                <Modal
                                                    size="sm"
                                                    dialogClassName="my-modal"
                                                    show={isOpenAddSourceOfQuestion
                                                    }
                                                    onHide={() => setIsOpenAddSourceOfQuestion(false)}
                                                >
                                                    <Modal.Header closeButton>
                                                        <Modal.Title as="h5">Add Source Of Question</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <AddSourceOfQuestion setIsOpenAddSourceOfQuestion={setIsOpenAddSourceOfQuestion}
                                                        />
                                                    </Modal.Body>
                                                </Modal>
                                            </React.Fragment>
                                        ) : (
                                            <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-sourceOfQuestion" ? 'Active Question Categories' : 'Archived Question Categories'} Found</h3>
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
                                                        <Card.Title as="h5">Source of Question List</Card.Title>
                                                    </Card.Header>
                                                    {
                                                        _showLoader === true && (
                                                            <div className="form-group fill text-center">{loader}</div>
                                                        )
                                                    }
                                                    <Card.Body>
                                                        <Table columns={columns} data={sourceOfQuestion} />
                                                    </Card.Body>
                                                </Card>

                                            </Col>
                                        </Row>
                                    </React.Fragment>

                                    <Modal
                                        size="sm"
                                        dialogClassName="my-modal"
                                        show={isOpenAddSourceOfQuestion
                                        }
                                        onHide={() => setIsOpenAddSourceOfQuestion(false)}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title as="h5">y</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <AddSourceOfQuestion setIsOpenAddSourceOfQuestion={setIsOpenAddSourceOfQuestion} />
                                        </Modal.Body>
                                    </Modal>

                                    <Modal
                                        size="sm"
                                        dialogClassName="my-modal"
                                        show={isOpenEditSourceOfQuestion}
                                        onHide={() => setIsOpenEditSourceOfQuestion(false)}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title as="h5">Edit Questions Category</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <EditSourceOfQuestion editSourceOfQuestionID={editSourceOfQuestionID} setIsOpenEditSourceOfQuestion={setIsOpenEditSourceOfQuestion} />
                                        </Modal.Body>
                                    </Modal>

                                </>
                            )
                        }
                    </>
                )
            }
        </div>
    );
};

export default SourceOfQuestionTableView;