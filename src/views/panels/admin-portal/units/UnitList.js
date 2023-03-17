import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { GlobalFilter } from './GlobalFilter';
import { useTable, useSortBy, usePagination, useGlobalFilter, useRowSelect } from 'react-table';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { Link, useHistory } from 'react-router-dom';
import { SessionStorage } from '../../../../util/SessionStorage';
import MESSAGES from '../../../../helper/messages';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { useLocation } from "react-router-dom";
import { fetchUnitsBasedonStatus } from '../../../api/CommonApi';
import BasicSpinner from '../../../../helper/BasicSpinner';
import AddUnit from './AddUnit';
import EditUnit from './EditUnit';




function Table({ columns, data, modalOpen }) {
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[3]);
    const initiallySelectedRows = React.useMemo(() => new Set(["1"]), []);
    // let unit_status = pageLocation === "active-units" ? 'Active' : 'Archived';



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
    const unit_status = pageLocation === 'active-units' ? "Active" : "Archived"
    console.log("unit_status", unit_status);
    console.log(pageLocation)
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAddUnit, setOpenAddUnit] = useState(false)
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const MySwal = withReactContent(Swal);
    let history = useHistory();


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

    const getUnitsFromData = () => {
        console.log("selectedFlatRows", selectedFlatRows);
        let arrayWithUnits = [];


        selectedFlatRows.map((item) => {
            console.log("item.original.unit_chapter_id", item.original.unit_title);
            arrayWithUnits.push(item.original.unit_id)
        })
        console.log("arrayWithUnits.length", arrayWithUnits.length)
        console.log("CHECKED IDS : ", arrayWithUnits);

        if (arrayWithUnits.length === 0) {
            const MySwal = withReactContent(Swal);
            return MySwal.fire('Sorry', 'No units Selected!', 'warning').then(() => {
                window.location.reload();
            });
        } else {

            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: 'Are you sure?',
                text: pageLocation === 'active-units' ? 'Confirm deleting' : 'Confirm restoring',
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true,


            }).then((willDelete) => {
                if (willDelete.value) {
                    console.log("api calling");
                    // changeStatus(digi_card_id, digi_card_title);
                    console.log("Request : ", {
                        unit_status: unit_status === "Active" ? "Archived" : "Active",
                        unit_array: arrayWithUnits,

                    });

                    axios
                        .post(
                            dynamicUrl.bulkToggleUnitStatus,
                            {
                                data: {
                                    unit_status: unit_status === "Active" ? "Archived" : "Active",
                                    unit_array: arrayWithUnits,

                                }
                            }, {
                            headers: { Authorization: sessionStorage.getItem('user_jwt') }
                        })
                        .then(async (response) => {
                            console.log("response : ", response);
                            if (response.Error) {
                                console.log("Error");
                                hideLoader();
                                // sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                                pageLocation === "active-units"
                                    ? sweetAlertHandler({
                                        title: MESSAGES.TTTLES.Sorry,
                                        type: "error",
                                        text: MESSAGES.ERROR.DeletingParents
                                    })
                                    : sweetAlertHandler({
                                        title: MESSAGES.TTTLES.Sorry,
                                        type: "error",
                                        text: MESSAGES.ERROR.RestoringParents
                                    });

                                history.push('/admin-portal/' + pageLocation)
                            }
                            else {
                                console.log("response : ", response);
                                if (response.data === 200) {
                                    MySwal.fire({
                                        title: (pageLocation === 'active-units') ? 'units Deleted' : "units restored",
                                        icon: "success",
                                        // text: (pageLocation === 'active-units') ? 'Unit Deleted' : 'Unit Restored',
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

                } else {
                    return MySwal.fire('', pageLocation === 'active-units' ? 'Unit is safe!' : "Unit remains Archived", 'error');
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

                    {unit_status === "Active" ? (
                        <>
                            <Button
                                variant="success"
                                style={{ whiteSpace: "no-wrap" }}
                                className="btn-sm btn-round has-ripple ml-2"
                                onClick={() => { setOpenAddUnit(true) }}>
                                <i className="feather icon-plus" /> Add Unit
                            </Button>

                            <Button
                                className='btn-sm btn-round has-ripple ml-2 btn btn-danger'
                                style={{ whiteSpace: "no-wrap" }}
                                onClick={() => { getUnitsFromData("Archived") }}
                            > <i className="feather icon-trash-2" />&nbsp;
                                Multi Delete
                            </Button>
                        </>
                    ) : (
                        <Button className='btn-sm btn-round has-ripple ml-2 btn btn-primary'
                            style={{ whiteSpace: "no-wrap" }}
                            onClick={() => { getUnitsFromData("Active") }}
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

            <Modal dialogClassName="my-modal" show={isOpenAddUnit} onHide={() => setOpenAddUnit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Add Unit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddUnit setOpenAddUnit={setOpenAddUnit} />
                </Modal.Body>
            </Modal>
        </>
    );
}

const UnitList = (props) => {

    const [unitData, setUnitData] = useState([]);
    const [reloadAllData, setReloadAllData] = useState('Fetched');
    const [statusUrl, setStatusUrl] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[3]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenEditUnit, setOpenEditUnit] = useState(false);
    const [isOpenAddUnit, setOpenAddUnit] = useState(false);
    const [unitId, setUnitId] = useState()



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
                Header: ' Unit Title',
                accessor: 'unit_title'
            },
            {
                Header: 'Options',
                accessor: 'actions'
            }
        ],
        []
    );






    // console.log('data: ', data)

    const handleAddUnit = (e) => {

        console.log("No subjects, add subjects")
        e.preventDefault();
        setOpenAddUnit(true);
    }

    const MySwal = withReactContent(Swal);
    const sweetConfirmHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    }
    let history = useHistory();



    const deleteUnit = (unit_id, unit_title) => {
        var data = {
            "unit_id": unit_id,
            "unit_status": "Archived"
        }
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Confirm deleting ' + unit_title + 'Unit',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                axios
                    .post(dynamicUrl.toggleUnitStatus, { data: data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
                    .then((response) => {
                        if (response.Error) {
                            hideLoader();
                            sweetConfirmHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                        } else {
                            allUnitsList()
                            setReloadAllData("Deleted");
                            return MySwal.fire('', 'The ' + unit_title + ' is Deleted', 'success');
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
            } else {
            }
        });
    };





    function restoreChapter(unit_id, unit_title) {
        console.log("unit_id", unit_id);
        var data = {
            "unit_id": unit_id,
            "unit_status": 'Active'
        }

        const sweetConfirmHandler = () => {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: 'Are you sure?',
                text: 'Confirm to Restore ' + unit_title + ' unit',
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true
            }).then((willDelete) => {
                if (willDelete.value) {
                    axios
                        .post(dynamicUrl.toggleUnitStatus, { data: data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
                        .then((response) => {
                            if (response.Error) {
                                hideLoader();
                                sweetConfirmHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                            } else {
                                allUnitsList()
                                setReloadAllData("Deleted");
                                return MySwal.fire('', 'The ' + unit_title + ' is Restored', 'success')
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


    const allUnitsList = async () => {
        const UnitStatus = pageLocation === "active-units" ? 'Active' : 'Archived';
        let userJWT = sessionStorage.getItem('user_jwt');
        console.log("jwt", userJWT);

        if (userJWT === "" || userJWT === undefined || userJWT === "undefined" || userJWT === null) {

            sessionStorage.clear();
            localStorage.clear();
            history.push('/auth/signin-1');
            window.location.reload();
        } else {

            setIsLoading(true)
            const allUnitsData = await fetchUnitsBasedonStatus(UnitStatus);
            if (allUnitsData.ERROR) {
                console.log("allUnitsData.ERROR", allUnitsData.ERROR);
            } else {
                let dataResponse = allUnitsData.Items
                console.log("dataResponse", dataResponse);
                let finalDataArray = [];
                if (UnitStatus === 'Active') {


                    for (let index = 0; index < dataResponse.length; index++) {
                        dataResponse[index].index_no = index + 1;
                        dataResponse[index]['actions'] = (
                            <>
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        // onClick={(e) => history.push(`/admin-portal/editunit/${dataResponse[index].unit_id}`)}
                                        onClick={(e) => {
                                            setUnitId(dataResponse[index].unit_id);
                                            setOpenEditUnit(true)
                                        }}
                                    >
                                        <i className="feather icon-edit" /> &nbsp; Edit
                                    </Button>
                                    &nbsp;
                                    {/* if(resultData[index].chapter_status=='Active') */}
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-danger"
                                        onClick={(e) => deleteUnit(dataResponse[index].unit_id, dataResponse[index].unit_title)}
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
                    let resultData = (dataResponse && dataResponse.filter(e => e.unit_status === 'Archived'))
                    for (let index = 0; index < resultData.length; index++) {
                        resultData[index].index_no = index + 1;
                        resultData[index]['actions'] = (
                            <>
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        onClick={(e) => restoreChapter(resultData[index].unit_id, resultData[index].unit_title)}
                                    >
                                        <i className="feather icon-plus" /> &nbsp; Restore
                                    </Button>
                                    &nbsp;
                                </>
                            </>
                        );
                        finalDataArray.push(resultData[index]);
                        console.log('finalDataArray: ', finalDataArray)
                    }
                }
                setUnitData(finalDataArray);
                console.log('resultData: ', finalDataArray);
                setIsLoading(false)
            }
        }
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
            allUnitsList();
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
                            unitData.length <= 0 ? (
                                <>
                                    {
                                        pageLocation === 'active-units' ? (
                                            < React.Fragment >
                                                <div>
                                                    <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-units" ? 'Active Units' : 'Archived Units'} Found</h3>
                                                    <div className="form-group fill text-center">
                                                        <br></br>
                                                        <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={(e) => { handleAddUnit(e) }}>
                                                            <i className="feather icon-plus" /> Add Units
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Modal dialogClassName="my-modal" show={isOpenAddUnit} onHide={() => setOpenAddUnit(false)}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title as="h5">Add Unit</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <AddUnit setOpenAddUnit={setOpenAddUnit} />
                                                    </Modal.Body>
                                                </Modal>
                                            </React.Fragment>
                                        ) : (
                                            <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-units" ? 'Active Units' : 'Archived Units'} Found</h3>
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
                                                        <Card.Title as="h5">Unit List</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Table columns={columns} data={unitData} />
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Modal dialogClassName="my-modal" show={isOpenEditUnit} onHide={() => setOpenEditUnit(false)}>
                                            <Modal.Header closeButton>
                                                <Modal.Title as="h5">Edit Unit</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <EditUnit setOpenEditUnit={setOpenEditUnit} unitId={unitId} />
                                            </Modal.Body>
                                        </Modal>
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
export default UnitList;
