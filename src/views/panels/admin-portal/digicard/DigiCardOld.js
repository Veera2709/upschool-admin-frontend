import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
// import makeData from '../../../data/schoolData';
import { Link, useHistory } from 'react-router-dom';


import dynamicUrl from '../../../../helper/dynamicUrls';
import MESSAGES from '../../../../helper/messages';
import { SessionStorage } from '../../../../util/SessionStorage';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import withReactContent from 'sweetalert2-react-content';
import { useLocation } from "react-router-dom";
import { fetchIndividualDigiCard, changeStatusID } from '../../../api/DigiCardApi'



import Swal from 'sweetalert2';

function Table({ columns, data, modalOpen }) {
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

    const [isOpen, setIsOpen] = useState(false);


    let history = useHistory();

    const adddigicard = () => {
        history.push('/admin-portal/add-digicard');
        setIsOpen(true);
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
                    entries
                </Col>
                <Col className="d-flex justify-content-end">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    <Button className='btn-sm btn-round has-ripple ml-2 btn btn-success' onClick={() => { adddigicard(); }}  >
                        Add DigiCard
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
                Header: '#',
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
    const [reloadAllData, setReloadAllData] = useState('Fetched');
    const MySwal = withReactContent(Swal);
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);



    const openHandler = () => {
        setIsOpen(true);
    };



    let history = useHistory();

    const changeStatus = async (digi_card_id, digi_card_title) => {
        console.log("digi_card_id", digi_card_id, "", "digi_card_name", digi_card_title);
        let digiCardData = {
            data: {
                "digi_card_id":digi_card_id ,
                "digicard_status": 'Archived'
            }
        }
        const digiCardStatus = await changeStatusID(dynamicUrl.toggleDigiCardStatus, digiCardData);
        if (digiCardStatus == 200) {
            console.log("digiCardStatus", digiCardStatus);
            setReloadAllData("Deleted");
            return MySwal.fire('', 'The ' + digi_card_title + ' is Deleted', 'success');
        } else {
            console.log("digiCardStatus.error", digiCardStatus.Error);
        }
    }

    function deleteDigicard(digi_card_id, digi_card_title) {
        console.log("digi_card_id", digi_card_id);
        var data = {
            "digi_card_id": digi_card_id,
            "digicard_status": 'Archived'
        }

        const sweetConfirmHandler = () => {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: 'Are you sure?',
                text: 'Confirm deleting ' + digi_card_title + ' DigiCard',
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true
            }).then((willDelete) => {
                if (willDelete.value) {
                    console.log("api calling");
                    changeStatus(digi_card_id, digi_card_title);
                } else {
                    return MySwal.fire('', 'DigiCard is safe!', 'error');
                }
            });
        };
        sweetConfirmHandler();

    }

    

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
                    changeStatus(digi_card_id,digi_card_title)
                } else {
                    return MySwal.fire('', 'DigiCard is Restore!', 'error');
                }
            });
        };
        sweetConfirmHandler();

    }

    const fetchAllDigiCards = (digiCardStatus) => {
        console.log("digiCardStatus", digiCardStatus);
        axios.post(dynamicUrl.fetchAllDigiCards, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                let dataResponse = response.data.Items
                let finalDataArray = [];
                if (digiCardStatus === 'Active') {
                    let ActiveresultData = (dataResponse && dataResponse.filter(e => e.digicard_status === 'Active'))
                    console.log("ActiveresultData", ActiveresultData);

                    for (let index = 0; index < ActiveresultData.length; index++) {
                        ActiveresultData[index]['digicard_image'] = <img class="img-fluid img-radius wid-40" alt="Poison regulate" src={ActiveresultData[index].digicard_imageURL} />
                        ActiveresultData[index]['actions'] = (
                            <>
                                <Button
                                    size="sm"
                                    className="btn btn-icon btn-rounded btn-primary"
                                    onClick={(e) => history.push(`/admin-portal/editDigiCard/${ActiveresultData[index].digi_card_id}`)}
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
                            </>
                        );
                        finalDataArray.push(ActiveresultData[index]);
                        console.log('finalDataArray: ', finalDataArray)
                    }
                } else {
                    let resultData = (dataResponse && dataResponse.filter(e => e.digicard_status === 'Archived'))
                    for (let index = 0; index < resultData.length; index++) {
                        resultData[index]['digicard_image'] = <img class="img-fluid img-radius wid-40" alt="Poison regulate" src={resultData[index].digicard_imageURL} />
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
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (pageLocation) {
            console.log("--", pageLocation);
            const url = pageLocation === "active-digiCard" ? 'Active' : 'Archived';
            // setPageURL(url);
            fetchAllDigiCards(url);

        }

    }, [reloadAllData])

    return (
        <div>
            {data.length >= 0 ? (
                <React.Fragment>
                    <Row>
                        <Col sm={12}>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">DigiCard List</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Table columns={columns} data={data} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </React.Fragment >
            ) : (
                <div>
                    <h3 style={{ textAlign: 'center' }}>No DigiCard Found</h3>
                    <div className="form-group fill text-center">
                        <br></br>

                        <Link to={'/admin-portal/add-digicard'}>
                            <Button variant="success" className="btn-sm btn-round has-ripple ml-2">
                                <i className="feather icon-plus" /> Add DigiCard
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};
export default DigiCard;
