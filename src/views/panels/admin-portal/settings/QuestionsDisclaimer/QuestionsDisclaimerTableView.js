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
import AddQuestionsDisclaimer from './AddQuestionsDisclaimer';
import EditQuestionsDisclaimer from './EditQuestionsDisclaimer';
import BasicSpinner from '../../../../../helper/BasicSpinner';
import {
    toggleMultiQuestionDisclaimerStatus,
    toggleQuestionDisclaimerStatus,
    fetchAllQuestionDisclaimers
} from '../../../../api/CommonApi';

function Table({ columns, data }) {

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [questionDisclaimerData, setQuestionDisclaimerData] = useState([]);
    const [_questionDisclaimerID, _setQuestionDisclaimerID] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [_showLoader, _setShowLoader] = useState(false);
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[3]);
    const [editQuestionDisclaimerID, setEditQuestionDisclaimerID] = useState('');

    const [isOpenAddQuestionDisclaimer, setIsOpenAddQuestionDisclaimer] = useState(false);
    const [isOpenEditQuestionDisclaimer, setIsOpenEditQuestionDisclaimer] = useState(false);

    const MySwal = withReactContent(Swal);
    console.log(pageLocation);
    useEffect(() => {
        fetchAllQuestionDisclaimerData();
    }, []);

    const sweetConfirmHandler = (alert, disclaimer_id, updateStatus) => {

        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type,
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                _setShowLoader(true);
                showLoader();
                deleteQuestionDisclaimer(disclaimer_id, updateStatus);
            }
        });
    };

    const saveQuestionDisclaimerIdDelete = (e, disclaimer_id, updateStatus) => {
        e.preventDefault();

        pageLocation === 'active-questionDisclaimer' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, disclaimer_id, updateStatus)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the Question Disclaimer!' }, disclaimer_id, updateStatus)
        )

    };

    const fetchAllQuestionDisclaimerData = async () => {

        setIsLoading(true);
        _setShowLoader(true);
        showLoader();
        console.log(pageLocation);

        const questionDisclaimerStatus = pageLocation === 'active-questionDisclaimer' ? 'Active' : 'Archived';

        const ResultData = await fetchAllQuestionDisclaimers({ disclaimer_status: questionDisclaimerStatus });

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

            _setShowLoader(false);
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
                            {pageLocation === 'active-questionDisclaimer' ? (
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-info"
                                        onClick={(e) => {
                                            setEditQuestionDisclaimerID(responseData[index].disclaimer_id);
                                            setIsOpenEditQuestionDisclaimer(true);
                                        }}
                                    >
                                        <i className="feather icon-edit" /> &nbsp; Edit
                                    </Button>{' '}
                                    &nbsp;
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-danger"
                                        onClick={(e) => saveQuestionDisclaimerIdDelete(e, responseData[index].disclaimer_id, 'Archived')}
                                    >
                                        <i className="feather icon-trash-2" /> &nbsp; Delete
                                    </Button>
                                </>

                            ) : (
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        onClick={(e) => saveQuestionDisclaimerIdDelete(e, responseData[index].disclaimer_id, 'Active')}
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
                setQuestionDisclaimerData(finalDataArray);
                setIsLoading(false);
            }

        }

    };

    const handleAddQuestionDisclaimer = (e) => {

        console.log("No Question Disclaimer, add Question Disclaimer");
        e.preventDefault();
        setIsOpenAddQuestionDisclaimer(true);
    }

    const deleteQuestionDisclaimer = async (disclaimer_id, updateStatus) => {
        const values = {
            disclaimer_id: disclaimer_id,
            disclaimer_status: updateStatus
        };

        console.log(values);

        const ResultData = await toggleQuestionDisclaimerStatus(values);
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

            _setShowLoader(false);
            hideLoader()
            updateStatus === 'Active' ? (
                MySwal.fire('', MESSAGES.INFO.QUESTION_DESCLAIMER_RESTORED, 'success')

            ) : (
                MySwal.fire('', MESSAGES.INFO.QUESTION_DESCLAIMER_DELETED, 'success')
            )
            fetchAllQuestionDisclaimerData();
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
        const questionDisclaimerIDs = [];

        selectedFlatRows.map((item) => {
            questionDisclaimerIDs.push(item.original.disclaimer_id)
        })

        if (questionDisclaimerIDs.length > 0) {

            MySwal.fire({
                title: 'Are you sure?',
                text: `Confirm ${pageLocation === 'active-questionDisclaimer' ? "deleting" : "restoring"} the selected Question Disclaimers!`,
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true
            }).then(async (willDelete) => {

                if (willDelete.value) {

                    showLoader();

                    var payload = {
                        "disclaimer_status": status,
                        "disclaimer_array": questionDisclaimerIDs
                    }

                    const ResultData = await toggleMultiQuestionDisclaimerStatus(payload);
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
                        return MySwal.fire('Success', `All the chosen Question Disclaimers have been ${status === 'Active' ? 'restored' : "deleted"} successfully!`, 'success').then(() => {
                            window.location.reload();
                        });
                    }
                }
            });

        } else {

            return MySwal.fire('Sorry', 'No Question Disclaimers are selected!', 'warning');
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

                    {pageLocation === 'active-questionDisclaimer' ? (
                        <>
                            <Button
                                variant="success"
                                className="btn-sm btn-round has-ripple ml-2"
                                onClick={(e) => {
                                    handleAddQuestionDisclaimer(e);
                                }}
                            >
                                <i className="feather icon-plus" /> Add Question Disclaimers
                            </Button>

                            <Button
                                variant="success"
                                className='btn-sm btn-round has-ripple ml-2 btn btn-danger'
                                onClick={() => {
                                    multiDelete("Archived");
                                }}>
                                <i className="feather icon-trash-2"
                                />  Multi Delete
                            </Button>
                        </>

                    ) : (
                        <Button
                            className='btn-sm btn-round has-ripple ml-2 btn btn-primary'
                            onClick={() => { multiDelete("Active"); }}>
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
                size="md"
                dialogClassName="my-modal"
                show={isOpenAddQuestionDisclaimer}
                onHide={() => setIsOpenAddQuestionDisclaimer(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Add Question Disclaimer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddQuestionsDisclaimer setIsOpenAddQuestionDisclaimer={setIsOpenAddQuestionDisclaimer} />
                </Modal.Body>
            </Modal>

            <Modal
                size="md"
                dialogClassName="my-modal"
                show={isOpenEditQuestionDisclaimer}
                onHide={() => setIsOpenEditQuestionDisclaimer(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Edit Question Disclaimer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditQuestionsDisclaimer editQuestionDisclaimerID={editQuestionDisclaimerID} setIsOpenEditQuestionDisclaimer={setIsOpenEditQuestionDisclaimer} fetchAllQuestionDisclaimerData={fetchAllQuestionDisclaimerData} />
                </Modal.Body>
            </Modal>
        </>
    );
}

const QuestionsDisclaimerTableView = ({ userStatus }) => {

    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor: 'id'
            },
            {
                Header: 'Question Disclaimer Label',
                accessor: 'disclaimer_label'
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
    const [questionDisclaimerData, setQuestionDisclaimerData] = useState([]);
    const [_questionDisclaimerID, _setQuestionDisclaimerID] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [_showLoader, _setShowLoader] = useState(false);
    const pageLocation = useLocation().pathname.split('/')[3];

    const [isOpenAddQuestionDisclaimer, setIsOpenAddQuestionDisclaimer] = useState(false);
    const [isOpenEditQuestionDisclaimer, setIsOpenEditQuestionDisclaimer] = useState(false);
    const [editQuestionDisclaimerID, setEditQuestionDisclaimerID] = useState('');

    const MySwal = withReactContent(Swal);

    useEffect(() => {
        fetchAllQuestionDisclaimerData();
    }, []);

    const sweetConfirmHandler = (alert, disclaimer_id, updateStatus) => {

        MySwal.fire({

            title: alert.title,
            text: alert.text,
            type: alert.type,
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {

            if (willDelete.value) {
                _setShowLoader(true);
                showLoader();
                deleteQuestionDisclaimer(disclaimer_id, updateStatus);
            }
        });
    };

    const saveQuestionDisclaimerIdDelete = (e, disclaimer_id, updateStatus) => {
        e.preventDefault();

        pageLocation === 'active-questionDisclaimer' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, disclaimer_id, updateStatus)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the Question Disclaimer!' }, disclaimer_id, updateStatus)
        );

    };

    const fetchAllQuestionDisclaimerData = async () => {

        setIsLoading(true);
        _setShowLoader(true);
        showLoader();
        console.log(pageLocation);

        const questionDisclaimerStatus = pageLocation === 'active-questionDisclaimer' ? 'Active' : 'Archived';

        const ResultData = await fetchAllQuestionDisclaimers({ disclaimer_status: questionDisclaimerStatus });

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

            console.log('inside res fetch Unit And Question Disclaimer');
            console.log(ResultData);

            _setShowLoader(false);
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
                            {pageLocation === 'active-questionDisclaimer' ? (

                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-info"
                                        onClick={(e) => {
                                            setEditQuestionDisclaimerID(responseData[index].disclaimer_id);
                                            setIsOpenEditQuestionDisclaimer(true);
                                        }}>
                                        <i className="feather icon-edit" /> &nbsp; Edit
                                    </Button>{' '}
                                    &nbsp;
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-danger"
                                        onClick={(e) => saveQuestionDisclaimerIdDelete(e, responseData[index].disclaimer_id, 'Archived')}
                                    >
                                        <i className="feather icon-trash-2" /> &nbsp; Delete
                                    </Button>
                                </>

                            ) : (

                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-round btn-primary"
                                        onClick={(e) => saveQuestionDisclaimerIdDelete(e, responseData[index].disclaimer_id, 'Active')}
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
                setQuestionDisclaimerData(finalDataArray);
                setIsLoading(false);

            }

        }

    };

    const handleAddQuestionDisclaimer = (e) => {

        e.preventDefault();
        setIsOpenAddQuestionDisclaimer(true);
    }

    const deleteQuestionDisclaimer = async (disclaimer_id, updateStatus) => {

        const values = {
            disclaimer_id: disclaimer_id,
            disclaimer_status: updateStatus
        };

        console.log(values);

        const ResultData = await toggleQuestionDisclaimerStatus(values);
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

            _setShowLoader(false);
            hideLoader()
            updateStatus === 'Active' ? (
                MySwal.fire('', MESSAGES.INFO.QUESTION_DESCLAIMER_RESTORED, 'success')

            ) : (
                MySwal.fire('', MESSAGES.INFO.QUESTION_DESCLAIMER_DELETED, 'success')
            )
            fetchAllQuestionDisclaimerData();
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
                            questionDisclaimerData.length <= 0 ? (
                                <>
                                    {
                                        pageLocation === 'active-questionDisclaimer' ? (
                                            < React.Fragment >
                                                <div>
                                                    <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-questionDisclaimer" ? 'Active Question Disclaimers' : 'Archived Question Disclaimers'} Found</h3>
                                                    <div className="form-group fill text-center">
                                                        <br></br>
                                                        <Button
                                                            variant="success"
                                                            className="btn-sm btn-round has-ripple ml-2"
                                                            onClick={(e) => {
                                                                handleAddQuestionDisclaimer(e);
                                                            }}
                                                        >
                                                            <i className="feather icon-plus" /> Add Question Disclaimers
                                                        </Button>
                                                    </div>
                                                </div>

                                                <Modal
                                                    size="md"
                                                    dialogClassName="my-modal"
                                                    show={isOpenAddQuestionDisclaimer}
                                                    onHide={() => setIsOpenAddQuestionDisclaimer(false)}
                                                >
                                                    <Modal.Header closeButton>
                                                        <Modal.Title as="h5">Add Question Disclaimer</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <AddQuestionsDisclaimer setIsOpenAddQuestionDisclaimer={setIsOpenAddQuestionDisclaimer} />
                                                    </Modal.Body>
                                                </Modal>
                                            </React.Fragment>
                                        ) : (
                                            <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-questionDisclaimer" ? 'Active Question Disclaimers' : 'Archived Question Disclaimers'} Found</h3>
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
                                                        <Card.Title as="h5" className='d-flex justify-content-between'>
                                                            <h5>Question Disclaimer List</h5>
                                                            <h5>Total Entries :- {questionDisclaimerData.length}</h5>
                                                        </Card.Title>
                                                    </Card.Header>
                                                    {
                                                        _showLoader === true && (
                                                            <div className="form-group fill text-center">{loader}</div>
                                                        )
                                                    }
                                                    <Card.Body>
                                                        <Table columns={columns} data={questionDisclaimerData} />
                                                    </Card.Body>
                                                </Card>

                                            </Col>
                                        </Row>
                                    </React.Fragment>

                                    <Modal
                                        size="md"
                                        dialogClassName="my-modal"
                                        show={isOpenAddQuestionDisclaimer}
                                        onHide={() => setIsOpenAddQuestionDisclaimer(false)}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title as="h5">Add Question Disclaimer</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <AddQuestionsDisclaimer setIsOpenAddQuestionDisclaimer={setIsOpenAddQuestionDisclaimer} />
                                        </Modal.Body>
                                    </Modal>

                                    <Modal
                                        size="md"
                                        dialogClassName="my-modal"
                                        show={isOpenEditQuestionDisclaimer}
                                        onHide={() => setIsOpenEditQuestionDisclaimer(false)}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title as="h5">Edit Question Disclaimer</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <EditQuestionsDisclaimer editQuestionDisclaimerID={editQuestionDisclaimerID} setIsOpenEditQuestionDisclaimer={setIsOpenEditQuestionDisclaimer} fetchAllQuestionDisclaimerData={fetchAllQuestionDisclaimerData} />
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

export default QuestionsDisclaimerTableView;