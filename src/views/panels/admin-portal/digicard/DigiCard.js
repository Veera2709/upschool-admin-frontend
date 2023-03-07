import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter, useRowSelect } from 'react-table';
// import makeData from '../../../data/schoolData';
import { Link, useHistory } from 'react-router-dom';


import dynamicUrl from '../../../../helper/dynamicUrls';
import MESSAGES from '../../../../helper/messages';
import { SessionStorage } from '../../../../util/SessionStorage';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import withReactContent from 'sweetalert2-react-content';
import { useLocation } from "react-router-dom";
import BasicSpinner from '../../../../helper/BasicSpinner';
import { toggleMultiDigicardStatus } from '../../../api/CommonApi'




import Swal from 'sweetalert2';
import { async } from 'q';

function Table({ columns, data, modalOpen }) {
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const initiallySelectedRows = React.useMemo(() => new Set(["1"]), []);
    const MySwal = withReactContent(Swal);
    let digicardStatus = pageLocation === "active-digiCard" ? 'Active' : 'Archived';


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
        selectedFlatRows,
        setPageSize,
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

    const [isOpen, setIsOpen] = useState(false);


    let history = useHistory();

    const adddigicard = () => {
        history.push('/admin-portal/add-digicard');
        setIsOpen(true);
    }

    const getIDFromData = async (DigicardStatus) => {
        var DigicardIds = [];
        selectedFlatRows.map((item) => {
            console.log("item.original.digi_card_id", item.original.digi_card_id);
            DigicardIds.push(item.original.digi_card_id)
        })

        console.log("DigicardIds", DigicardIds.length);
        if (DigicardIds.length > 0) {
            var payload = {
                "digicard_status": DigicardStatus,
                "digi_card_array": DigicardIds
            }

            const ResultData = await toggleMultiDigicardStatus(payload)
            if (ResultData.Error) {
                if (ResultData.Error.response.data == 'Invalid Token') {
                    sessionStorage.clear();
                    localStorage.clear();
                    history.push('/auth/signin-1');
                    window.location.reload();
                }else{
                    return MySwal.fire('Error',ResultData.Error.response.data, 'error').then(() => {
                        window.location.reload();
                    });
                }
            } else {
                return MySwal.fire('', `Digicards ${DigicardStatus === 'Active' ? 'Restored' : "Deleted"} Successfully`, 'success').then(() => {
                    window.location.reload();
                });
            }
        } else {
            return MySwal.fire('Sorry', 'No Digicard Selected!', 'warning').then(() => {
                window.location.reload();
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
                <Col className="mb-3" style={{ display: 'contents' }}>
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    <Button className='btn-sm btn-round has-ripple ml-2 btn btn-success'
                        onClick={() => { adddigicard(); }}
                    > <i className="feather icon-plus" />&nbsp;
                        Add DigiCard
                    </Button>
                    {digicardStatus === "Active" ? (
                        <Button className='btn-sm btn-round has-ripple ml-2 btn btn-danger'
                            onClick={() => { getIDFromData("Archived") }}
                        > <i className="feather icon-trash-2" />&nbsp;
                            Multi Delete
                        </Button>
                    ) : (
                        <Button className='btn-sm btn-round has-ripple ml-2 btn btn-primary'
                            onClick={() => { getIDFromData("Active") }}
                        > <i className="feather icon-plus" />&nbsp;
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
        </>
    );
}

const DigiCard = () => {

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
                Header: 'DigiCard Logo',
                accessor: 'digicard_image'
            },
            {
                Header: 'DigiCard Title',
                accessor: 'digi_card_title'
            },
            {
                Header: 'Options',
                accessor: 'actions'
            }
        ],
        []
    );

    // const data = React.useMemo(() => makeData(80), []);

    const [data, setData] = useState([]);
    console.log('data: ', data)
    const [isOpen, setIsOpen] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [isLoading, setIsLoading] = useState(false);

    const [isSelectedAll, setSelectedAll] = useState(false);
    const [reloadAllData, setReloadAllData] = useState('Fetched');
    const [statusUrl, setStatusUrl] = useState('');
    const MySwal = withReactContent(Swal);
    const [digiCardId, setDigiCardId] = useState([]);
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    let history = useHistory();


    function getDigiCardId(e, id) {
        console.log("digiCardId", id);
        if (e.target.checked === true) {
            digiCardId.push(id)
        } else {
            const i = digiCardId.indexOf(id);
            digiCardId.splice(i, 1);
        }
    }

    const sweetConfirmHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    }


    const openHandler = () => {
        setIsOpen(true);
    };



    function deleteDigicard(digi_card_id, digi_card_title) {
        console.log("digi_card_id", digi_card_id);
        confirmHandler(digi_card_id, digi_card_title)
    }

    const confirmHandler = (digi_card_id, digi_card_title) => {
        var data = {
            "digi_card_id": digi_card_id,
            "digicard_status": 'Archived'
        }
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Confirm deleting ' + digi_card_title + ' DigiCard',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                console.log("api calling");
                axios
                    .post(dynamicUrl.toggleDigiCardStatus, { data: data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
                    .then((response) => {
                        if (response.Error) {
                            hideLoader();
                            sweetConfirmHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                        } else {
                            fetchAllDigiCards()
                            setReloadAllData("Deleted");
                            return MySwal.fire('', 'The ' + digi_card_title + ' is Deleted', 'success');
                            // window. location. reload() 
                            //  MySwal.fire('', MESSAGES.INFO.CLIENT_DELETED, 'success');
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
                                sweetConfirmHandler({ title: 'Sorry', type: 'warning', text: error.response.data });
                            }
                        } else if (error.request) {
                            // The request was made but no response was received
                            console.log(error.request);
                            hideLoader();
                        } else {
                            console.log('Error', error.message);
                            hideLoader();
                        }
                    });
            } else {
            }
        });
    };



    function digicardRestore(digi_card_id, digi_card_title) {
        console.log("digi_card_id", digi_card_id);
        var data = {
            "digi_card_id": digi_card_id,
            "digicard_status": 'Active'
        }

        const sweetConfirmHandler = () => {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: 'Are you sure?',
                text: 'Confirm to Restore ' + digi_card_title + ' DigiCard',
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true
            }).then((willDelete) => {
                if (willDelete.value) {
                    console.log("api calling");
                    axios
                        .post(dynamicUrl.toggleDigiCardStatus, { data: data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
                        .then((response) => {
                            if (response.Error) {
                                hideLoader();
                                sweetConfirmHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                            } else {
                                fetchAllDigiCards()
                                setReloadAllData("Deleted");
                                return MySwal.fire('', 'The ' + digi_card_title + ' is Restored', 'success');
                                // window. location. reload() 
                                //  MySwal.fire('', MESSAGES.INFO.CLIENT_DELETED, 'success');



                            }
                        })
                        .catch((error) => {
                            if (error.response) {
                                // Request made and server responded
                                console.log(error.response.data);
                                if (error.response.data === 'Invalid Token') {
                                    sessionStorage.clear();
                                    localStorage.clear();
                                    history.push('/auth/signin-1');
                                    window.location.reload();
                                } else {
                                    console.log("err", error);
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
                        });
                } else {
                }
            });
        };
        sweetConfirmHandler();

    }

    const fetchAllDigiCards = () => {
        setIsLoading(true);
        let digicardStatus = pageLocation === "active-digiCard" ? 'Active' : 'Archived';
        let DigicardTyle = digicardStatus === "Active" ? "Active Digicards" : "Archived Digicards"
        sessionStorage.setItem('digicard_type', DigicardTyle)
        axios.post(dynamicUrl.fetchAllDigiCards, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                let dataResponse = response.data.Items
                let finalDataArray = [];
                if (digicardStatus === 'Active') {
                    let ActiveresultData = (dataResponse && dataResponse.filter(e => e.digicard_status === 'Active'))
                    console.log("ActiveresultData", ActiveresultData);

                    for (let index = 0; index < ActiveresultData.length; index++) {
                        // ActiveresultData[index]['check_box'] = <input
                        //     type="checkbox"
                        //     onChange={(e) => { getDigiCardId(e, ActiveresultData[index].digi_card_id) }}
                        //     defaultChecked={isSelectedAll&&isSelectedAll}
                        // />
                        ActiveresultData[index]['digicard_image'] = <img className="img-fluid img-radius wid-40" alt="Poison regulate" src={ActiveresultData[index].digicard_imageURL} />
                        ActiveresultData[index]['actions'] = (
                            <>
                                <Button
                                    size="sm"
                                    className="btn btn-icon btn-rounded btn-primary"
                                    onClick={(e) => history.push(`/admin-portal/editDigiCard/${ActiveresultData[index].digi_card_id}`)}
                                // onClick={(e) => history.push(`/admin-portal/admin-casedetails/${resultData[index].client_id}/all_cases`)}
                                >
                                    <i className="feather icon-edit" /> &nbsp; Edit
                                </Button>
                                &nbsp;
                                <Button
                                    size="sm"
                                    className="btn btn-icon btn-rounded btn-danger"
                                    onClick={(e) => deleteDigicard(ActiveresultData[index].digi_card_id, ActiveresultData[index].digi_card_title)}
                                >
                                    <i className="feather icon-trash-2 " /> &nbsp; Delete
                                </Button>
                                &nbsp;
                                {/* <Button size='sm' className="btn btn-icon btn-rounded btn-danger" onClick={(e) => saveClientIdDelete(e, responseData[index].client_id)}>
                                <i className="feather icon-delete" /> &nbsp; Delete
                              </Button> */}
                            </>
                        );
                        finalDataArray.push(ActiveresultData[index]);
                        console.log('finalDataArray: ', finalDataArray)
                    }
                } else {
                    let resultData = (dataResponse && dataResponse.filter(e => e.digicard_status === 'Archived'))
                    for (let index = 0; index < resultData.length; index++) {
                        resultData[index]['digicard_image'] = <img className="img-fluid img-radius wid-40" alt="Poison regulate" src={resultData[index].digicard_imageURL} />
                        resultData[index]['actions'] = (
                            <>
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        onClick={(e) => digicardRestore(resultData[index].digi_card_id, resultData[index].digi_card_title)}
                                    >
                                        <i className="feather icon-plus" /> &nbsp; Restore
                                    </Button>
                                </>
                            </>
                        );
                        finalDataArray.push(resultData[index]);
                        console.log('finalDataArray: ', finalDataArray)
                    }
                }


                setData(finalDataArray);
                console.log('resultData: ', finalDataArray);
                setIsLoading(false);

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
            fetchAllDigiCards();
        }
    }, [reloadAllData])

    return (

        <div>

            {
                isLoading ? (
                    <BasicSpinner />
                ) : (
                    <>
                        {
                            data.length <= 0 ? (
                                <>
                                    {
                                        pageLocation === 'active-digiCard' ? (
                                            < React.Fragment >
                                                <div>
                                                    <h3 style={{ textAlign: 'center' }}>No {sessionStorage.getItem('digicard_type')} Found</h3>
                                                    <div className="form-group fill text-center">
                                                        <br></br>

                                                        <Link to={'/admin-portal/add-digicard'}>
                                                            <Button variant="success" className="btn-sm btn-round has-ripple ml-2">
                                                                <i className="feather icon-plus" /> Add DigiCard
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <h3 style={{ textAlign: 'center' }}>No {sessionStorage.getItem('digicard_type')} Found</h3>
                                            </React.Fragment>
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
                                                        <Card.Title as="h5">DigiCard List</Card.Title>
                                                        <Row>
                                                            <Col className='d-flex justify-content-end'>
                                                                {/* <Button className='btn-sm btn-round has-ripple ml-2 btn-danger'
                                                                    style={{ paddingRight: '18px' }}
                                                                    onClick={() => { console.log('digicardId', digiCardId) }}
                                                                > <i className="feather icon-trash-2 " />&nbsp;
                                                                    Multi Delete
                                                                </Button> */}
                                                            </Col>
                                                        </Row>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Table columns={columns} data={data} />
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </React.Fragment >
                                </>
                            )
                        }
                    </>
                )
            }
        </div >
    );
};
export default DigiCard;
