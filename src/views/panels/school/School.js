import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import makeData from '../../../data/schoolData';

import AddSchoolForm from './AddSchoolForm'
import dynamicUrl from '../../../helper/dynamicUrls';

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

const School = () => {
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
                Header: 'Email',
                accessor: 'email'
            },
            {
                Header: 'Primary Contact',
                accessor: 'roll'
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

    const openHandler = () => {
        setIsOpen(true);
    };

    const fetchSchoolData = () => {
        axios.post(dynamicUrl.fetchAllSchool, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                let resultData = response.data.Items;
                let finalDataArray = [];
                for (let index = 0; index < resultData.length; index++) {
                    resultData[index]['school_avatar'] = <img src={resultData[index].school_logoURL} />
                    resultData[index]['actions'] = (
                        <>
                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-primary"
                            // onClick={(e) => history.push(`/admin-portal/admin-casedetails/${resultData[index].client_id}/all_cases`)}
                            >
                                <i className="feather icon-eye" /> &nbsp; View
                            </Button>
                            &nbsp;
                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-info"
                            // onClick={(e) => saveClientId(e, resultData[index].client_id, 'Edit')}
                            >
                                <i className="feather icon-edit" /> &nbsp; Edit
                            </Button>
                            &nbsp;
                            {/* <Button size='sm' className="btn btn-icon btn-rounded btn-danger" onClick={(e) => saveClientIdDelete(e, responseData[index].client_id)}>
                            <i className="feather icon-delete" /> &nbsp; Delete
                          </Button> */}
                        </>
                    );
                    finalDataArray.push(resultData[index]);
                    console.log('finalDataArray: ', finalDataArray)
                }
                setData(finalDataArray);
                console.log('resultData: ', finalDataArray);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchSchoolData();
    }, [])

    return data.length <= 0 ? null : (
        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Schools List</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Table columns={columns} data={data} modalOpen={openHandler} />
                        </Card.Body>
                    </Card>
                    <Modal dialogClassName="my-modal" show={isOpen} onHide={() => setIsOpen(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Add School</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <AddSchoolForm />
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
        </React.Fragment >
    );
};
export default School;
