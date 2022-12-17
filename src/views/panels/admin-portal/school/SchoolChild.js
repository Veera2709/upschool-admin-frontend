import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
// import makeData from '../../../data/schoolData';

import AddSchoolForm from './AddSchoolForm';
import dynamicUrl from '../../../../helper/dynamicUrls';
import EditSchoolForm from './EditSchoolForm';
import SubscribeClass from './SubscribeClass';
import { isEmptyArray } from '../../../../util/utils';

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
                    <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={modalOpen}>
                        <i className="feather icon-plus" /> Add School
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
    const { _data, fetchSchoolData } = props
    console.log('_data: ', _data);


    const columns = React.useMemo(
        () => [
            {
                Header: '#',
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
                Header: 'Subscription Active',
                accessor: 'subscription_active'
            },
            {
                Header: 'Options',
                accessor: 'actions'
            }
        ],
        []
    );

    // const data = React.useMemo(() => makeData(80), []);
    const [schoolData, setSchoolData] = useState([]);
    // console.log('data: ', data)
    const [isOpen, setIsOpen] = useState(false); 

    const [isOpenEditSchool, setIsOpenEditSchool] = useState(false);
    const [isOpenSubscribeClass, setIsOpenSubscribeClass] = useState(false);
    const [editID, setEditID] = useState('');
    const [subscribeID, setSubscribeClass] = useState('');
    const [toggle, setToggle] = useState(true);

    const handleDeleteSchool = (school_id) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover!',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                axios
                    .post(
                        dynamicUrl.deleteSchool,
                        {
                            data: {
                                school_id: school_id,
                            }
                        },
                        {
                            headers: { Authorization: sessionStorage.getItem('user_jwt') }
                        }
                    )
                    .then((response) => {
                        console.log({ response });
                        console.log(response.status);
                        console.log(response.status === 200);
                        let result = response.status === 200;
                        if (result) {
                            console.log('inside res');
                            return MySwal.fire('', 'Your school has been deleted!', 'success');

                            fetchSchoolData();
                        } else {
                            console.log('else res');
                            // Request made and server responded
                            return MySwal.fire('', 'Failed to delete your School!', 'error');
                            fetchSchoolData();

                        }
                    })
                    .catch((error) => {
                        if (error.response) {
                            // Request made and server responded
                            console.log(error.response.data);
                            return MySwal.fire('', 'Failed to delete your School!', 'error');
                            fetchSchoolData();
                        } else if (error.request) {
                            // The request was made but no response was received
                            console.log(error.request);
                            return MySwal.fire('', 'Failed to delete your School!', 'error');
                            fetchSchoolData();
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                            return MySwal.fire('', 'Failed to delete your School!', 'error');
                            fetchSchoolData();
                        }
                    });
            } else {
                return MySwal.fire('', 'Your School is safe!', 'error');
            }
        });
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

    const _fetchSchoolData = () => {
        console.log("School data func called");
        let resultData = _data && _data;
        let finalDataArray = [];
        for (let index = 0; index < resultData.length; index++) {
            resultData[index]['school_avatar'] = <img className='img-fluid img-radius wid-50 circle-image' src={resultData[index].school_logoURL} alt="school_image" />
            resultData[index]['school_name'] = <p>{resultData[index].school_name}</p>
            resultData[index]['phone_number'] = <p>{resultData[index].school_contact_info.business_address.phone_no}</p>
            resultData[index]['city'] = <p>{resultData[index].school_contact_info.business_address.city}</p>
            resultData[index]['subscription_active'] = <p>{resultData[index].subscription_active}</p>
            resultData[index]['actions'] = (
                <>
                    {/* <Button
                              size="sm"
                              className="btn btn-icon btn-rounded btn-primary"
                          // onClick={(e) => history.push(`/admin-portal/admin-casedetails/${resultData[index].client_id}/all_cases`)}
                          >
                              <i className="feather icon-eye" /> &nbsp; View
                          </Button>
                          &nbsp; */}


                    <Button onClick={(e) => {
                        handleSubscribeClass(e, resultData[index].school_id);
                    }}

                        size="sm"
                        className="btn btn-icon btn-rounded btn-primary">
                        <i className="feather icon-plus" />
                        Subscribe Class
                    </Button>
                    &nbsp;
                    <Button onClick={(e) => {
                        handleEditSchool(e, resultData[index].school_id);
                    }}
                        size="sm"
                        className="btn btn-icon btn-rounded btn-info"
                    >
                        <i className="feather icon-edit" /> &nbsp; Edit
                    </Button>
                    &nbsp;
                    <Button onClick={() => {
                        handleDeleteSchool(resultData[index].school_id)

                    }}
                        size='sm' className="btn btn-icon btn-rounded btn-danger"
                    // onClick={(e) => saveClientIdDelete(e, responseData[index].client_id)}
                    >
                        <i className="feather icon-delete" /> &nbsp; Delete
                    </Button>
                </>
            );
            finalDataArray.push(resultData[index]);

        }
        console.log('finalDataArray: ', finalDataArray);
        setSchoolData(finalDataArray)
    }

    useEffect(() => {
        _fetchSchoolData();
    }, [_data])

    return isEmptyArray(schoolData) ? null : (
        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Schools List</Card.Title>
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

                    <EditSchoolForm id={editID} setIsOpenEditSchool={setIsOpenEditSchool} fetchSchoolData={fetchSchoolData} />

                </Modal.Body>

            </Modal>
        </React.Fragment>
    );
};
export default SchoolChild;
