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
import AddCognitiveSkills from './AddCognitiveSkills';
import EditCognitiveSkills from './EditCognitiveSkills';


import BasicSpinner from '../../../../../helper/BasicSpinner';
import {
    bulkToggleCognitiveSkillStatus,
    toggleCognitiveSkillStatus,
    fetchSkillsBasedonStatus
} from '../../../../api/CommonApi';

function Table({ columns, data }) {

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [cognitiveSkills, setCognitiveSkills] = useState([]);
    const [cognitiveSkillsID, setCognitiveSkillsID] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[3]);
    const [editCognitiveSkillsID, setEditCognitiveSkillsID] = useState('');

    const [isOpenAddCognitiveSkills, setIsOpenAddCognitiveSkills] = useState(false);
    const [isOpenEditCognitiveSkills, setIsOpenEditCognitiveSkills] = useState(false);

    const MySwal = withReactContent(Swal);
    console.log(pageLocation);
    useEffect(() => {
        fetchAllCognitiveSkillsData();
    }, []);

    const sweetConfirmHandler = (alert, cognitive_id, updateStatus) => {

        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type,
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                showLoader();
                deleteCognitiveSkills(cognitive_id, updateStatus);
            }
        });
    };

    const saveQuestionCategoryIdDelete = (e, cognitive_id, updateStatus) => {
        e.preventDefault();

        pageLocation === 'active-cognitiveSkills' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, cognitive_id, updateStatus)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the Question Category!' }, cognitive_id, updateStatus)
        )

    };

    const fetchAllCognitiveSkillsData = async () => {

        setIsLoading(true);
        showLoader();
        console.log(pageLocation);

        const cognitiveStatus = pageLocation === 'active-cognitiveSkills' ? 'Active' : 'Archived';

        const ResultData = await fetchSkillsBasedonStatus({ cognitive_status: cognitiveStatus });

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
                            {pageLocation === 'active-cognitiveSkills' ? (
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-info"
                                        onClick={(e) => {
                                            setEditCognitiveSkillsID(responseData[index].cognitive_id);
                                            setIsOpenEditCognitiveSkills(true);
                                        }}
                                    >
                                        <i className="feather icon-edit" /> &nbsp; Edit
                                    </Button>{' '}
                                    &nbsp;
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-danger"
                                        onClick={(e) => saveQuestionCategoryIdDelete(e, responseData[index].cognitive_id, 'Archived')}
                                    >
                                        <i className="feather icon-trash-2" /> &nbsp; Delete
                                    </Button>
                                </>

                            ) : (
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        onClick={(e) => saveQuestionCategoryIdDelete(e, responseData[index].cognitive_id, 'Active')}
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
                setCognitiveSkills(finalDataArray);
                setIsLoading(false);
            }

        }

    };


    const handleAddSourceOfQuestion = (e) => {

        console.log("No Question Category, add Question Category");
        e.preventDefault();
        setIsOpenAddCognitiveSkills(true);
    }

    const deleteCognitiveSkills = async (cognitive_id, updateStatus) => {
        const values = {
            cognitive_id: cognitive_id,
            cognitive_status: updateStatus
        };

        console.log(values);

        const ResultData = await toggleCognitiveSkillStatus(values);
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
                MySwal.fire('', MESSAGES.INFO.COGNITIVE_RESTORED, 'success')

            ) : (
                MySwal.fire('', MESSAGES.INFO.COGNITIVE_DELETED, 'success')
            )
            fetchAllCognitiveSkillsData();
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
        const cognitiveSkillsIDs = [];

        selectedFlatRows.map((item) => {
            cognitiveSkillsIDs.push(item.original.cognitive_id)
        })

        if (cognitiveSkillsIDs.length > 0) {

            MySwal.fire({
                title: 'Are you sure?',
                text: `Confirm ${pageLocation === 'active-cognitiveSkills' ? "deleting" : "restoring"} the selected Question Categories!`,
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true
            }).then(async (willDelete) => {

                if (willDelete.value) {

                    showLoader();

                    var payload = {
                        "cognitive_status": status,
                        "cognitive_skill_array": cognitiveSkillsIDs
                    }

                    const ResultData = await bulkToggleCognitiveSkillStatus(payload);
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
                        return MySwal.fire('Success', `All the chosen Question Categories have been ${status === 'Active' ? 'restored' : "deleted"} successfully!`, 'success').then(() => {
                            window.location.reload();
                        });
                    }
                }
            });

        } else {

            return MySwal.fire('Sorry', 'No Question Categories are selected!', 'warning');
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

                    {pageLocation === 'active-cognitiveSkills' ? (
                        <>
                            <Button
                                variant="success"
                                className="btn-sm btn-round has-ripple ml-2"
                                onClick={(e) => {
                                    handleAddSourceOfQuestion(e);
                                }}
                            >
                                <i className="feather icon-plus" /> Add Cognitive Skills
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
                show={isOpenAddCognitiveSkills}
                onHide={() => setIsOpenAddCognitiveSkills(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Add Cognitive Skills</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddCognitiveSkills setIsOpenAddCognitiveSkills={setIsOpenAddCognitiveSkills} />
                </Modal.Body>
            </Modal>

            <Modal
                size="sm"
                dialogClassName="my-modal"
                show={isOpenEditCognitiveSkills}
                onHide={() => setIsOpenEditCognitiveSkills(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Edit Cognitive Skills</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditCognitiveSkills editCognitiveSkillsID={editCognitiveSkillsID} setIsOpenEditCognitiveSkills={setIsOpenEditCognitiveSkills} />
                </Modal.Body>
            </Modal>
        </>
    );
}

const CognitiveSkillsTableView = ({ userStatus }) => {

    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor: 'id'
            },
            {
                Header: 'Cognitive Name',
                accessor: 'cognitive_name'
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
    const [cognitiveSkills, setCognitiveSkills] = useState([]);
    const [cognitiveSkillsID, setCognitiveSkillsID] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [_showLoader, _setShowLoader] = useState(false);
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[3]);

    const [isOpenAddCognitiveSkills, setIsOpenAddCognitiveSkills] = useState(false);
    const [isOpenEditCognitiveSkills, setIsOpenEditCognitiveSkills] = useState(false);
    const [editCognitiveSkillsID, setEditCognitiveSkillsID] = useState('');

    const MySwal = withReactContent(Swal);

    useEffect(() => {
        fetchAllCognitiveSkillsData();
    }, []);

    const sweetConfirmHandler = (alert, cognitive_id, updateStatus) => {

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
                deleteCognitiveSkills(cognitive_id, updateStatus);
            }
        });
    };

    const saveQuestionCategoryIdDelete = (e, cognitive_id, updateStatus) => {
        e.preventDefault();

        pageLocation === 'active-cognitiveSkills' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, cognitive_id, updateStatus)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the Question Category!' }, cognitive_id, updateStatus)
        );

    };

    const fetchAllCognitiveSkillsData = async () => {

        setIsLoading(true);
        showLoader();
        _setShowLoader(true);
        console.log(pageLocation);

        const cognitiveStatus = pageLocation === 'active-cognitiveSkills' ? 'Active' : 'Archived';

        const ResultData = await fetchSkillsBasedonStatus({ cognitive_status: cognitiveStatus });

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

            console.log('inside res fetch Unit And Questions Category');
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
                            {pageLocation === 'active-cognitiveSkills' ? (

                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-info"
                                        onClick={(e) => {
                                            setEditCognitiveSkillsID(responseData[index].cognitive_id);
                                            setIsOpenEditCognitiveSkills(true);
                                        }}>
                                        <i className="feather icon-edit" /> &nbsp; Edit
                                    </Button>{' '}
                                    &nbsp;
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-danger"
                                        onClick={(e) => saveQuestionCategoryIdDelete(e, responseData[index].cognitive_id, 'Archived')}
                                    >
                                        <i className="feather icon-trash-2" /> &nbsp; Delete
                                    </Button>
                                </>

                            ) : (

                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-round btn-primary"
                                        onClick={(e) => saveQuestionCategoryIdDelete(e, responseData[index].cognitive_id, 'Active')}
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
                setCognitiveSkills(finalDataArray);
                setIsLoading(false);

            }

        }

    };

    const handleAddSourceOfQuestion = (e) => {

        e.preventDefault();
        setIsOpenAddCognitiveSkills(true);
    }

    const deleteCognitiveSkills = async (cognitive_id, updateStatus) => {

        const values = {
            cognitive_id: cognitive_id,
            cognitive_status: updateStatus
        };

        console.log(values);

        const ResultData = await toggleCognitiveSkillStatus(values);
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
                MySwal.fire('', MESSAGES.INFO.COGNITIVE_RESTORED, 'success')

            ) : (
                MySwal.fire('', MESSAGES.INFO.COGNITIVE_DELETED, 'success')
            )
            fetchAllCognitiveSkillsData();
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
                            cognitiveSkills.length <= 0 ? (
                                <>
                                    {
                                        pageLocation === 'active-cognitiveSkills' ? (
                                            < React.Fragment >
                                                <div>
                                                    <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-cognitiveSkills" ? 'Active Question Categories' : 'Archived Question Categories'} Found</h3>
                                                    <div className="form-group fill text-center">
                                                        <br></br>
                                                        <Button
                                                            variant="success"
                                                            className="btn-sm btn-round has-ripple ml-2"
                                                            onClick={(e) => {
                                                                handleAddSourceOfQuestion(e);
                                                            }}
                                                        >
                                                            <i className="feather icon-plus" /> Add Cognitive Skills
                                                        </Button>
                                                    </div>
                                                </div>

                                                <Modal
                                                    size="sm"
                                                    dialogClassName="my-modal"
                                                    show={isOpenAddCognitiveSkills}
                                                    onHide={() => setIsOpenAddCognitiveSkills(false)}
                                                >
                                                    <Modal.Header closeButton>
                                                        <Modal.Title as="h5">Add Cognitive Skills</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <AddCognitiveSkills setIsOpenAddCognitiveSkills={setIsOpenAddCognitiveSkills} />
                                                    </Modal.Body>
                                                </Modal>
                                            </React.Fragment>
                                        ) : (
                                            <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-cognitiveSkills" ? 'Active Question Categories' : 'Archived Question Categories'} Found</h3>
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
                                                        <Card.Title as="h5">Cognitive Skills List</Card.Title>
                                                    </Card.Header>
                                                    {
                                                        _showLoader === true && (
                                                            <div className="form-group fill text-center">{loader}</div>
                                                        )
                                                    }
                                                    <Card.Body>
                                                        <Table columns={columns} data={cognitiveSkills} />
                                                    </Card.Body>
                                                </Card>

                                            </Col>
                                        </Row>
                                    </React.Fragment>

                                    <Modal
                                        size="sm"
                                        dialogClassName="my-modal"
                                        show={isOpenAddCognitiveSkills}
                                        onHide={() => setIsOpenAddCognitiveSkills(false)}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title as="h5">Add Cognitive Skills</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <AddCognitiveSkills setIsOpenAddCognitiveSkills={setIsOpenAddCognitiveSkills} />
                                        </Modal.Body>
                                    </Modal>

                                    <Modal
                                        size="sm"
                                        dialogClassName="my-modal"
                                        show={isOpenEditCognitiveSkills}
                                        onHide={() => setIsOpenEditCognitiveSkills(false)}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title as="h5">Edit Cognitive Skills</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <EditCognitiveSkills editCognitiveSkillsID={editCognitiveSkillsID} setIsOpenEditCognitiveSkills={setIsOpenEditCognitiveSkills} />
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

export default CognitiveSkillsTableView;