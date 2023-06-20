import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { GlobalFilter } from '../chapters/GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter, useRowSelect } from 'react-table';

import dynamicUrl from '../../../../helper/dynamicUrls';

import { isEmptyArray } from '../../../../util/utils';

import { Link, useHistory } from 'react-router-dom';
import { SessionStorage } from '../../../../util/SessionStorage';
import MESSAGES from '../../../../helper/messages';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { useLocation } from "react-router-dom";
import BasicSpinner from '../../../../helper/BasicSpinner';



function Table({ columns, data, modalOpen }) {
    const [isOpenAddChapter, setOpenAddChapter] = useState(false);
    const initiallySelectedRows = React.useMemo(() => new Set(["1"]), []);
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const bluePrintStatus = pageLocation === "active-blueprint" ? 'Active' : 'Archived';
    const MySwal = withReactContent(Swal);
    let history = useHistory();


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
        useRowSelect,
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

                <Col className="mb-3" style={{ display: 'contents' }}>
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    {
                        bluePrintStatus === 'Active' ? (
                            <>
                                <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={() => { history.push('/admin-portal/add-bluePrint') }}>
                                    <i className="feather icon-plus" /> Add Blue Print
                                </Button>
                            </>
                        ) : (<></>)
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

        </>
    );
}

const BluePrintList = (props) => {
    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor: "index_no"
            },
            {
                Header: 'Blue Print Name',
                accessor: 'blueprint_name'
            },
            {
                Header: 'Test Duration',
                accessor: 'test_duration'
            },
            {
                Header: 'Options',
                accessor: 'actions'
            }
        ],
        []
    );

    // const data = React.useMemo(() => makeData(80), []);
    const [bluePrintData, setBluePrintData] = useState([]);
    const [reloadAllData, setReloadAllData] = useState('Fetched');
    const [statusUrl, setStatusUrl] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenEditChapter, setOpenEditChapter] = useState(false);
    const [chapterId, setChapterId] = useState();
    const [isOpenAddChapter, setOpenAddChapter] = useState(false);





    // console.log('data: ', data)

    let history = useHistory();
    const MySwal = withReactContent(Swal);
    const sweetConfirmHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    }

    function deleteBluePrint(blueprint_id, blueprint_name) {
        console.log("blueprint_id", blueprint_id);

        confirmHandler(blueprint_id, blueprint_name)
    }

    const confirmHandler = (blueprint_id, blueprint_name) => {
        var data = {
            "blueprint_id": blueprint_id,
            "blueprint_status": "Archived"
        }
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Confirm deleting ' + blueprint_name + ' Blue Print',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                axios
                    .post(dynamicUrl.toggleBluePrintStatus, { data: data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
                    .then((response) => {
                        if (response.Error) {
                            hideLoader();
                        } else {
                            allBluePritData()
                            setReloadAllData("Deleted");
                            return MySwal.fire('', 'The ' + blueprint_name + ' is Deleted', 'success');
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
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                            hideLoader();
                        }
                    });
            }
        });
    };





    function restoreBluePrint(blueprint_id, blueprint_name) {
        console.log("blueprint_id", blueprint_id);
        var data = {
            "blueprint_id": blueprint_id,
            "blueprint_status": 'Active'
        }

        const sweetConfirmHandler = () => {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: 'Are you sure?',
                text: 'Confirm to Restore ' + blueprint_name + ' Blue Print',
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true
            }).then((willDelete) => {
                if (willDelete.value) {
                    axios
                        .post(dynamicUrl.toggleBluePrintStatus, { data: data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
                        .then((response) => {
                            if (response.Error) {
                                hideLoader();
                            } else {
                                allBluePritData()
                                setReloadAllData("Deleted");
                                return MySwal.fire('', 'The ' + blueprint_name + ' is Restored', 'success');
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


    const allBluePritData = () => {
        const bluePrintStatus = pageLocation === "active-blueprint" ? 'Active' : 'Archived';
        console.log("bluePrintStatus", bluePrintStatus);
        setIsLoading(true);
        axios.post(dynamicUrl.fetchBluePrintsBasedonStatus, {
            data: {
                blueprint_status: bluePrintStatus
            }
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                let dataResponse = response.data
                console.log({ dataResponse });
                let finalDataArray = [];

                if (bluePrintStatus === 'Active') {
                    for (let index = 0; index < dataResponse.length; index++) {
                        dataResponse[index].index_no = index + 1;
                        dataResponse[index]['actions'] = (
                            <>
                                <>
                                    {/* <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        // onClick={(e) => history.push(`/admin-portal/editChapter/${dataResponse[index].chapter_id}`)}
                                        // onClick={(e) => {
                                        //     setChapterId(dataResponse[index].chapter_id);
                                        //     setOpenEditChapter(true)
                                        // }}
                                    >
                                        <i className="feather icon-edit" /> &nbsp; Edit
                                    </Button> */}
                                    &nbsp;
                                    {/* if(resultData[index].chapter_status=='Active') */}
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-danger"
                                        onClick={(e) => deleteBluePrint(dataResponse[index].blueprint_id, dataResponse[index].blueprint_name)}
                                    >
                                        <i className="feather icon-trash-2 " /> &nbsp; Delete
                                    </Button>
                                    &nbsp;

                                    {/* <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-danger"
                                        onClick={(e) => deleteBluePrint(dataResponse[index].blueprint_id, dataResponse[index].blueprint_name)}
                                    >
                                        <i className="feather icon-trash-2 " /> &nbsp; view
                                    </Button> */}
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-info"
                                        onClick={(e) => history.push(`/admin-portal/view-bluePrint/${dataResponse[index].blueprint_id}`)}
                                    >
                                        <i className="feather icon-eye" /> &nbsp;View
                                    </Button>
                                </>
                            </>
                        );
                        finalDataArray.push(dataResponse[index]);
                        console.log('finalDataArray: ', finalDataArray)
                    }
                } else {
                    for (let index = 0; index < dataResponse.length; index++) {
                        dataResponse[index].index_no = index + 1;
                        dataResponse[index]['actions'] = (
                            <>
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        onClick={(e) => restoreBluePrint(dataResponse[index].blueprint_id, dataResponse[index].blueprint_name)}
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
                setBluePrintData(finalDataArray);
                console.log('dataResponse: ', finalDataArray);
                setIsLoading(false);

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
            allBluePritData();
        }
    }, [])

    return (
        <div>
            {
                isLoading ? (
                    <BasicSpinner />
                ) : (
                    <>
                        {
                            bluePrintData.length <= 0 ? (
                                <>
                                    {
                                        pageLocation === 'active-blueprint' ? (
                                            < React.Fragment >
                                                <div>

                                                    <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-blueprint" ? 'Active Blue Print' : 'Archived Blue Print'} Found</h3>
                                                    <div className="form-group fill text-center">
                                                        <br></br>
                                                        <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={(e) => { history.push('/admin-portal/add-bluePrint') }}>
                                                            <i className="feather icon-plus" /> Add Blue Print
                                                        </Button>
                                                    </div>
                                                </div>

                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-blueprint" ? 'Active Blue Print' : 'Archived Blue Print'} Found</h3>
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
                                                        <Card.Title as="h5" className='d-flex justify-content-between'>
                                                            <h5>BluePrint List</h5>
                                                            <h5>Total Entries :- {bluePrintData.length}</h5>
                                                        </Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Table columns={columns} data={bluePrintData} />
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
        </div>
    );
};
export default BluePrintList;
