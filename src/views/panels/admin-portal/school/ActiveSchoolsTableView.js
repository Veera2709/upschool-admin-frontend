import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal, Form } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { GlobalFilter } from './GlobalFilter';
import MESSAGES from '../../../../helper/messages';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';

import AddSchoolForm from './AddSchoolForm';
import dynamicUrl from '../../../../helper/dynamicUrls';
import EditSchoolForm from './EditSchoolForm';
import SubscribeClass from './SubscribeClass';
import { isEmptyArray } from '../../../../util/utils';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { Link, useHistory } from 'react-router-dom';
import BasicSpinner from '../../../../helper/BasicSpinner';

function Table({ columns, data, modalOpen }) {
    const [stateCustomer, setStateCustomer] = useState([])
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, globalFilter, setGlobalFilter, page, canPreviousPage, canNextPage, pageOptions, pageCount, gotoPage, nextPage, previousPage, setPageSize, state: { pageIndex, pageSize } } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 }
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );




    //handle delete multi school
    const deleteSchoolById = () => {
        let arrIds = [];
        stateCustomer.forEach(d => {
            if (d.select) {
                arrIds.push(d.id)
            }
        })
        console.log(arrIds)

    }


    return (
        <>
            <Row className="mb-3">
                {/* 
                <Button onClick={deleteSchoolById} variant="danger" className="btn-sm btn-round has-ripple ml-2" style={{ marginLeft: "1.5rem" }} >Delete</Button> */}

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
                    <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={modalOpen}>
                        <i className="feather icon-plus" /> Add School
                    </Button>
                </Col>

                {/* <Button onClick={handleDeleteAll} variant="danger" className="btn-sm btn-round has-ripple ml-2" >Delete</Button> */}
            </Row>



            {/* style={{ background: "red", color: "white" }} */}
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

const SchoolChild = (props) => {
    const { _data, fetchSchoolData, inactive, setInactive } = props

    const columns = React.useMemo(
        () => [

            {
                Header: 'School Logo',
                accessor: 'school_avatar'
            },
            {
                Header: ' School Name',
                accessor: 'school_name'
            },
            {
                Header: 'Phone Number',
                accessor: 'phone_number'
            },
            {
                Header: 'city',
                accessor: 'city'
            },
            {
                Header: 'Options',
                accessor: 'actions'
            },


        ],
        []
    );

    const [schoolData, setSchoolData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [_isOpen, _setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [isOpenEditSchool, setIsOpenEditSchool] = useState(false);
    const [isOpenSubscribeClass, setIsOpenSubscribeClass] = useState(false);
    const [editID, setEditID] = useState('');
    const [subscribeID, setSubscribeClass] = useState('');
    let history = useHistory();


    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const handleDeleteSchool = (e, school_id, Archieved) => {
        e.preventDefault();

        const value = {
            school_id: school_id,
            school_status: Archieved
        };

        console.log(value);

        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Upon confirmation all the users associated with this School will also be deleted!',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            axios
                .post(
                    dynamicUrl.toggleSchoolStatus,
                    {
                        data: {
                            school_id: school_id,
                            school_status: Archieved
                        }
                    },
                    {
                        headers: { Authorization: sessionStorage.getItem('user_jwt') }
                    }
                )
                .then(async (response) => {
                    let responseData = response.status === 200;
                    if (response.Error) {
                        hideLoader();
                        sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingSchool });
                        fetchSchoolData();
                        setInactive(false);
                        // _fetchSchoolData();
                    } else {
                        sweetAlertHandler({ title: 'Success', type: 'success', text: MESSAGES.INFO.SCHOOL_DELETED });
                        hideLoader();
                        fetchSchoolData();
                        setInactive(false);
                        // _fetchSchoolData();
                    }
                })

                .catch((error) => {
                    if (error.response) {
                        // Request made and server responded
                        hideLoader();
                        console.log(error.response.data);
                        sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
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
        })
    };

    const handleSubscribeClass = (e, school_id) => {

        e.preventDefault();
        setSubscribeClass(school_id);
        setIsOpenSubscribeClass(true);

        console.log('edit school');
        console.log(school_id);
        console.log(isOpenSubscribeClass);
    }

    const handleEditSchool = (e, school_id) => {

        e.preventDefault();
        setEditID(school_id);
        setIsOpenEditSchool(true);

        console.log('edit school');
        console.log(school_id);
        console.log(isOpenEditSchool);
    }

    const openHandler = () => {
        setIsOpen(true);
    };
    // const _openHandler = () => {
    //     _setIsOpen(true);
    // };

    const _fetchSchoolData = () => {
        console.log("School data func called");
        setIsLoading(true);
        showLoader()
        let resultData = _data && _data;
        let finalDataArray = [];
        for (let index = 0; index < resultData.length; index++) {

            console.log('status: ', resultData[index]['school_status'])


            // resultData[index]['action'] = (

            //     <input type="checkbox" name="checkboxName" id="checkboxID" value="checkboxValue"
            //     // checked={this.state.checked} onChange={this.handleChange}
            //     />
            // )

            resultData[index]['school_name'] = <p>{resultData[index].school_name}</p>
            resultData[index]['school_avatar'] = <img className='img-fluid img-radius wid-50 circle-image' src={resultData[index].school_logoURL} alt="school_image" />
            resultData[index]['school_name'] = <p>{resultData[index].school_name}</p>
            resultData[index]['phone_number'] = <p>{resultData[index].school_contact_info.business_address.phone_no}</p>
            resultData[index]['city'] = <p>{resultData[index].school_contact_info.business_address.city}</p>
            resultData[index]['subscription_active'] = <p>{resultData[index].subscription_active}</p>
            resultData[index]['actions'] = (
                <>
                    {/* <Button onClick={(e) => {
                        handleSubscribeClass(e, resultData[index].school_id);
                    }}
                        size="sm"
                        className="btn btn-icon btn-rounded btn-primary">
                        <i className="feather icon-plus" />
                        Subscribe Class
                    </Button>
                    &nbsp; */}
                    <Button
                        // onClick={(e) => { handleEditSchool(e, resultData[index].school_id);}}
                        onClick={(e) => history.push(`/admin-portal/editSchool/${resultData[index].school_id}`)}
                        size="sm"
                        className="btn btn-icon btn-rounded btn-info"
                    >
                        <i className="feather icon-edit" /> &nbsp; Edit
                    </Button>
                    &nbsp;
                    {inactive === false ? null :
                        <Button onClick={(e) => { handleDeleteSchool(e, resultData[index].school_id, 'Archived') }}
                            size='sm' className="btn btn-icon btn-rounded btn-danger"
                        >
                            <i className="feather icon-delete" /> &nbsp; Delete
                        </Button>
                    }

                </>
            );
            finalDataArray.push(resultData[index]);

        }
        console.log('finalDataArray: ', finalDataArray);
        setSchoolData(finalDataArray);
        setIsLoading(false);
        // hideLoader();
    }

    useEffect(() => {
        _fetchSchoolData();
    }, [_data])

    return (
        <div>
            {
                isLoading && isEmptyArray(_data) ? (
                    <BasicSpinner />
                ) : (
                    <>
                        {_data.length <= 0 && isEmptyArray(_data) ?

                            (
                                <div>
                                    <br />
                                    <h3 style={{ textAlign: 'center' }} >No Schools found</h3>
                                    <div className="form-group fill text-center">
                                        <br></br>
                                        <div className="d-flex justify-content-md-center">

                                            <Button
                                                variant="success"
                                                className="btn-sm btn-round has-ripple ml-2"
                                                onClick={openHandler}>
                                                <i className="feather icon-plus" /> Add Schools
                                            </Button>



                                            <Modal dialogClassName="my-modal" show={isOpen} onHide={() => setIsOpen(false)}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title as="h5">Add School</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <AddSchoolForm setIsOpen={setIsOpen} fetchSchoolData={fetchSchoolData} />
                                                </Modal.Body>

                                            </Modal>
                                        </div>
                                    </div>
                                </div>
                            )


                            : (
                                <>
                                    <React.Fragment>
                                        <Row>
                                            <Col sm={12}>
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5" className='d-flex justify-content-between'>
                                                            <h5>Schools List</h5>
                                                            <h5>Total Entries :- {schoolData.length}</h5>
                                                        </Card.Title>

                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Table columns={columns} data={schoolData} modalOpen={openHandler} />
                                                    </Card.Body>
                                                </Card>
                                                <Modal dialogClassName="my-modal" show={isOpen} onHide={() => setIsOpen(false)}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title as="h5">Add School</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <AddSchoolForm setIsOpen={setIsOpen} fetchSchoolData={fetchSchoolData} />
                                                    </Modal.Body>


                                                    {/* <Modal.Footer>
                            <Button variant="danger" onClick={() => setIsOpen(false)}>
                                Clear
                            </Button>
                            <Button variant="primary">Submit</Button>
                        </Modal.Footer> */}
                                                </Modal>
                                            </Col>


                                            {_isOpen &&
                                                <Modal dialogClassName="my-modal" show={_isOpen} onHide={() => _setIsOpen(false)}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title as="h5">Add School</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <AddSchoolForm _setIsOpen={_setIsOpen} fetchSchoolData={fetchSchoolData} />
                                                    </Modal.Body>
                                                    {/* <Modal.Footer>s
                            <Button variant="danger" onClick={() => setIsOpen(false)}>
                                Clear
                            </Button>
                            <Button variant="primary">Submit</Button>
                        </Modal.Footer> */}
                                                </Modal>
                                            }
                                        </Row>



                                        <Modal dialogClassName="my-modal" show={isOpenSubscribeClass} onHide={() => setIsOpenSubscribeClass(false)}>

                                            <Modal.Header closeButton>

                                                <Modal.Title as="h5">Subscribe Class</Modal.Title>

                                            </Modal.Header>

                                            <Modal.Body>

                                                <SubscribeClass id={subscribeID} setIsOpenSubscribeClass={setIsOpenSubscribeClass} />

                                            </Modal.Body>

                                        </Modal>

                                        <Modal dialogClassName="my-modal" show={isOpenEditSchool} onHide={() => setIsOpenEditSchool(false)}>

                                            <Modal.Header closeButton>

                                                <Modal.Title as="h5">Edit School</Modal.Title>

                                            </Modal.Header>

                                            <Modal.Body>

                                                <EditSchoolForm id={editID} setIsOpenEditSchool={setIsOpenEditSchool} fetchSchoolData={fetchSchoolData} setInactive={setInactive} />

                                            </Modal.Body>

                                        </Modal>

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
export default SchoolChild;
