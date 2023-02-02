import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import axios from 'axios';
import { SessionStorage } from '../../../../util/SessionStorage';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import MESSAGES from '../../../../helper/messages';
import { useHistory } from 'react-router-dom';

import { GlobalFilter } from '../../../common-ui-components/tables/GlobalFilter';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import AddConcepts from './AddConcepts';
import EditConcepts from './EditConcepts';
import BasicSpinner from '../../../../helper/BasicSpinner';

function Table({ columns, data }) {

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [conceptData, setConceptData] = useState([]);
    const [_conceptID, _setConceptID] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [digicardsAndConcepts, setDigicardsAndConcepts] = useState(false);
    const [_relatedConcepts, _setRelatedConcepts] = useState([]);
    const [_digicards, _setDigicards] = useState([]);
    const [editConceptID, setEditConceptID] = useState('');

    const [isOpenAddConcept, setIsOpenAddConcept] = useState(false);
    const [isEditAddConcept, setIsOpenEditConcept] = useState(false);

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    useEffect(() => {
        fetchAllConceptsData();
    }, []);

    useEffect(() => {

        axios
            .post(
                dynamicUrl.fetchDigicardAndConcept,
                {},
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {

                let result = response.status === 200;
                hideLoader();

                if (result) {

                    console.log('inside res fetchDigicardAndConcept');

                    let responseData = response.data;
                    console.log(responseData);
                    // setDisableButton(false);
                    hideLoader();
                    _setRelatedConcepts(responseData.conceptList);
                    _setDigicards(responseData.digicardList);

                } else {

                    console.log('else res');

                    hideLoader();


                }
            })
            .catch((error) => {
                if (error.response) {
                    hideLoader();
                    // Request made and server responded
                    console.log(error.response.data);

                    if (error.response.data === 'Invalid Token') {

                        sessionStorage.clear();
                        localStorage.clear();

                        history.push('/auth/signin-1');
                        window.location.reload();

                    } else {

                        sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
                        fetchAllConceptsData();
                    }


                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                    hideLoader();
                    fetchAllConceptsData();
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    hideLoader();
                    fetchAllConceptsData();
                }
            })

    }, [digicardsAndConcepts])


    const sweetConfirmHandler = (alert, concept_id, updateStatus) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type,
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {

            if (willDelete.value) {

                showLoader();
                deleteConcept(concept_id, updateStatus);

            } else {

                // const returnValue = pageLocation === 'active-concepts' ? (
                //     MySwal.fire('', MESSAGES.INFO.DATA_SAFE, 'success')
                // ) : (
                //     MySwal.fire('', MESSAGES.INFO.FAILED_TO_RESTORE, 'error')
                // )
                // return returnValue;
            }
        });
    };

    const saveConceptIdDelete = (e, concept_id, updateStatus) => {
        e.preventDefault();

        pageLocation === 'active-concepts' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, concept_id, updateStatus)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the concept!' }, concept_id, updateStatus)
        )

    };

    const fetchAllConceptsData = () => {

        setIsLoading(true);
        showLoader();
        console.log(pageLocation);

        const conceptStatus = pageLocation === 'active-concepts' ? 'Active' : 'Archived';

        axios
            .post(dynamicUrl.fetchAllConcepts,
                {
                    data: {
                        concept_status: conceptStatus
                    }
                }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })

            .then(async (response) => {

                console.log(response.data);
                console.log(response.data.Items);
                hideLoader();

                setDigicardsAndConcepts(true);

                if (response.data.Items) {

                    const responseData = response.data.Items;

                    console.log("responseData", responseData);

                    let finalDataArray = [];

                    for (let index = 0; index < responseData.length; index++) {
                        responseData[index].id = index + 1;

                        responseData[index]['action'] = (
                            <>
                                {console.log(pageLocation)}
                                {pageLocation === 'active-concepts' ? (

                                    <>
                                        <Button
                                            size="sm"
                                            className="btn btn-icon btn-rounded btn-info"
                                            onClick={(e) => {
                                                setEditConceptID(responseData[index].concept_id);
                                                setIsOpenEditConcept(true);
                                            }}>
                                            <i className="feather icon-edit" /> &nbsp; Edit
                                        </Button>{' '}
                                        &nbsp;
                                        <Button
                                            size="sm"
                                            className="btn btn-icon btn-rounded btn-danger"
                                            onClick={(e) => saveConceptIdDelete(e, responseData[index].concept_id, 'Archived')}
                                        >
                                            <i className="feather icon-trash-2" /> &nbsp;Delete
                                        </Button>
                                    </>

                                ) : (

                                    <>

                                        <Button
                                            size="sm"
                                            className="btn btn-icon btn-rounded btn-primary"
                                            onClick={(e) => saveConceptIdDelete(e, responseData[index].concept_id, 'Active')}
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
                    setConceptData([...finalDataArray]);
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
                        fetchAllConceptsData();
                    }

                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                    fetchAllConceptsData();
                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                    fetchAllConceptsData();
                }
            });
    };

    const handleAddConcepts = (e) => {

        console.log("No concepts, add concepts")
        e.preventDefault();
        setIsOpenAddConcept(true);
    }

    const deleteConcept = (concept_id, updateStatus) => {
        const values = {
            concept_id: concept_id,
            concept_status: updateStatus
        };

        console.log(values);

        axios
            .post(dynamicUrl.toggleConceptStatus,
                {
                    data: {
                        concept_id: concept_id,
                        concept_status: updateStatus
                    }
                }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
            .then(async (response) => {

                if (response.Error) {
                    hideLoader();

                    if (response.Error.data === 'Invalid Token') {

                        sessionStorage.clear();
                        localStorage.clear();

                        history.push('/auth/signin-1');
                        window.location.reload();

                    } else {

                        sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'warning', text: MESSAGES.ERROR.DeletingConcept });
                        fetchAllConceptsData();
                    }


                } else {

                    hideLoader()
                    updateStatus === 'Active' ? (
                        MySwal.fire('', MESSAGES.INFO.CONCEPT_RESTORED, 'success')

                    ) : (
                        MySwal.fire('', MESSAGES.INFO.CONCEPT_DELETED, 'success')
                    )
                    fetchAllConceptsData();

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
                        fetchAllConceptsData();
                    }


                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                    fetchAllConceptsData();
                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                    fetchAllConceptsData();
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

            {conceptData && data && (

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

                            <Button
                                variant="success"
                                className="btn-sm btn-round has-ripple ml-2"
                                onClick={(e) => {
                                    handleAddConcepts(e);
                                }}
                            >
                                <i className="feather icon-plus" /> Add Concepts
                            </Button>

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

                    <Modal dialogClassName="my-modal" show={isOpenAddConcept} onHide={() => setIsOpenAddConcept(false)}>

                        <Modal.Header closeButton>

                            <Modal.Title as="h5">Add Concept</Modal.Title>

                        </Modal.Header>

                        <Modal.Body>

                            <AddConcepts _digicards={_digicards} _relatedConcepts={_relatedConcepts} setIsOpenAddConcept={setIsOpenAddConcept} fetchAllConceptsData={fetchAllConceptsData} setDigicardsAndConcepts={setDigicardsAndConcepts} />

                        </Modal.Body>

                    </Modal>

                    <Modal dialogClassName="my-modal" show={isEditAddConcept} onHide={() => setIsOpenEditConcept(false)}>

                        <Modal.Header closeButton>

                            <Modal.Title as="h5">Edit Concept</Modal.Title>

                        </Modal.Header>

                        <Modal.Body>

                            <EditConcepts _digicards={_digicards} _relatedConcepts={_relatedConcepts} editConceptID={editConceptID} setIsOpenEditConcept={setIsOpenEditConcept} fetchAllConceptsData={fetchAllConceptsData} />

                        </Modal.Body>

                    </Modal>
                </>

            )}


        </>
    );
}

const ConceptTableView = ({ userStatus }) => {

    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor: 'id'
            },
            {
                Header: 'Concept Name',
                accessor: 'concept_title'
            },
            {
                Header: 'Options',
                accessor: 'action'
            }
        ],
        []
    );

    // const data = React.useMemo(() => makeData(50), []);

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [conceptData, setConceptData] = useState([]);
    const [_conceptID, _setConceptID] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [digicardsAndConcepts, setDigicardsAndConcepts] = useState(false);
    const [_relatedConcepts, _setRelatedConcepts] = useState([]);
    const [_digicards, _setDigicards] = useState([]);

    const [isOpenAddConcept, setIsOpenAddConcept] = useState(false);
    const [isEditAddConcept, setIsOpenEditConcept] = useState(false);
    const [editConceptID, setEditConceptID] = useState('');

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    useEffect(() => {
        fetchAllConceptsData();
    }, []);

    useEffect(() => {

        axios
            .post(
                dynamicUrl.fetchDigicardAndConcept,
                {},
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then((response) => {

                let result = response.status === 200;
                hideLoader();

                if (result) {

                    console.log('inside res fetchDigicardAndConcept');

                    let responseData = response.data;
                    console.log(responseData);
                    // setDisableButton(false);
                    hideLoader();
                    _setRelatedConcepts(responseData.conceptList);
                    _setDigicards(responseData.digicardList);

                } else {

                    console.log('else res');

                    hideLoader();


                }
            })
            .catch((error) => {
                if (error.response) {
                    hideLoader();
                    // Request made and server responded
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
                    console.log(error.request);
                    hideLoader();

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    hideLoader();

                }
            })

    }, [digicardsAndConcepts])

    const sweetConfirmHandler = (alert, concept_id, updateStatus) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type,
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                showLoader();
                deleteConcept(concept_id, updateStatus);
            } else {

                // const returnValue = pageLocation === 'active-concepts' ? (
                //     MySwal.fire('', MESSAGES.INFO.DATA_SAFE, 'success')
                // ) : (
                //     MySwal.fire('', MESSAGES.INFO.FAILED_TO_RESTORE, 'error')
                // )
                // return returnValue;
            }
        });
    };


    const saveConceptIdDelete = (e, concept_id, updateStatus) => {
        e.preventDefault();

        pageLocation === 'active-concepts' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, concept_id, updateStatus)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the concept!' }, concept_id, updateStatus)
        )

    };

    const fetchAllConceptsData = () => {

        setIsLoading(true);
        showLoader();
        console.log(pageLocation);

        const conceptStatus = pageLocation === 'active-concepts' ? 'Active' : 'Archived';

        axios
            .post(dynamicUrl.fetchAllConcepts,
                {
                    data: {
                        concept_status: conceptStatus
                    }
                }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })

            .then(async (response) => {

                console.log(response.data);
                console.log(response.data.Items);
                hideLoader();

                setDigicardsAndConcepts(true);

                if (response.data.Items) {

                    const responseData = response.data.Items;

                    console.log("responseData", responseData);

                    let finalDataArray = [];

                    for (let index = 0; index < responseData.length; index++) {
                        responseData[index].id = index + 1;

                        responseData[index]['action'] = (
                            <>
                                {console.log(pageLocation)}
                                {pageLocation === 'active-concepts' ? (

                                    <>
                                        <Button
                                            size="sm"
                                            className="btn btn-icon btn-rounded btn-info"
                                            onClick={(e) => {
                                                setEditConceptID(responseData[index].concept_id);
                                                setIsOpenEditConcept(true);
                                            }}>
                                            <i className="feather icon-edit" /> &nbsp; Edit
                                        </Button>{' '}
                                        &nbsp;
                                        <Button
                                            size="sm"
                                            className="btn btn-icon btn-rounded btn-danger"
                                            onClick={(e) => saveConceptIdDelete(e, responseData[index].concept_id, 'Archived')}
                                        >
                                            <i className="feather icon-trash-2" /> &nbsp;Delete
                                        </Button>
                                    </>

                                ) : (

                                    <>

                                        <Button
                                            size="sm"
                                            className="btn btn-icon btn-rounded btn-primary"
                                            onClick={(e) => saveConceptIdDelete(e, responseData[index].concept_id, 'Active')}
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
                    setConceptData(finalDataArray);
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
                        fetchAllConceptsData();
                    }


                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                    fetchAllConceptsData();
                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                    fetchAllConceptsData();
                }
            });
    };

    const handleAddConcepts = (e) => {

        console.log("No concepts, add concepts")
        e.preventDefault();
        setIsOpenAddConcept(true);
    }

    const deleteConcept = (concept_id, updateStatus) => {
        const values = {
            concept_id: concept_id,
            concept_status: updateStatus
        };

        console.log(values);

        axios
            .post(dynamicUrl.toggleConceptStatus,
                {
                    data: {
                        concept_id: concept_id,
                        concept_status: updateStatus
                    }
                }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
            .then(async (response) => {
                if (response.Error) {
                    hideLoader();

                    if (response.Error.data === 'Invalid Token') {

                        sessionStorage.clear();
                        localStorage.clear();

                        history.push('/auth/signin-1');
                        window.location.reload();

                    } else {
                        sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                        fetchAllConceptsData();
                    }

                } else {

                    hideLoader()
                    updateStatus === 'Active' ? (
                        MySwal.fire('', MESSAGES.INFO.CONCEPT_RESTORED, 'success')

                    ) : (
                        MySwal.fire('', MESSAGES.INFO.CONCEPT_DELETED, 'success')
                    )

                    fetchAllConceptsData();

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
                        fetchAllConceptsData();
                    }


                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                    fetchAllConceptsData();
                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                    fetchAllConceptsData();
                }
            });
    };

    return (
        <div>

            {isLoading ? (
                <BasicSpinner />
            ) : (
                <>

                    {conceptData.length <= 0 ? (
                        <>
                            {
                                pageLocation === 'active-concepts' ? (
                                    < React.Fragment >
                                        <div>

                                            <h3 style={{ textAlign: 'center' }}>No Concepts Found</h3>
                                            <div className="form-group fill text-center">
                                                <br></br>

                                                <Button
                                                    variant="success"
                                                    className="btn-sm btn-round has-ripple ml-2"
                                                    onClick={(e) => {
                                                        handleAddConcepts(e);
                                                    }}
                                                >
                                                    <i className="feather icon-plus" /> Add Concepts
                                                </Button>


                                            </div>

                                        </div>

                                        <Modal dialogClassName="my-modal" show={isOpenAddConcept} onHide={() => setIsOpenAddConcept(false)}>

                                            <Modal.Header closeButton>

                                                <Modal.Title as="h5">Add Concept</Modal.Title>

                                            </Modal.Header>

                                            <Modal.Body>

                                                <AddConcepts _digicards={_digicards} _relatedConcepts={_relatedConcepts} setIsOpenAddConcept={setIsOpenAddConcept} fetchAllConceptsData={fetchAllConceptsData} setDigicardsAndConcepts={setDigicardsAndConcepts} />

                                            </Modal.Body>

                                        </Modal>

                                    </React.Fragment>
                                ) : (
                                    <h3 style={{ textAlign: 'center' }}>No Concepts Found</h3>
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
                                                <Card.Title as="h5">Concept List</Card.Title>
                                            </Card.Header>
                                            <Card.Body>
                                                <Table columns={columns} data={conceptData} />
                                            </Card.Body>
                                        </Card>

                                    </Col>
                                </Row>
                            </React.Fragment>

                            <Modal dialogClassName="my-modal" show={isOpenAddConcept} onHide={() => setIsOpenAddConcept(false)}>

                                <Modal.Header closeButton>

                                    <Modal.Title as="h5">Add Concept</Modal.Title>

                                </Modal.Header>

                                <Modal.Body>

                                    <AddConcepts _digicards={_digicards} _relatedConcepts={_relatedConcepts} setIsOpenAddConcept={setIsOpenAddConcept} fetchAllConceptsData={fetchAllConceptsData} setDigicardsAndConcepts={setDigicardsAndConcepts} />

                                </Modal.Body>

                            </Modal>

                            <Modal dialogClassName="my-modal" show={isEditAddConcept} onHide={() => setIsOpenEditConcept(false)}>

                                <Modal.Header closeButton>

                                    <Modal.Title as="h5">Edit Concept</Modal.Title>

                                </Modal.Header>

                                <Modal.Body>

                                    <EditConcepts _digicards={_digicards} _relatedConcepts={_relatedConcepts} editConceptID={editConceptID} setIsOpenEditConcept={setIsOpenEditConcept} fetchAllConceptsData={fetchAllConceptsData} />

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

export default ConceptTableView;