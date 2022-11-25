import React, { useState } from 'react';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import makeData from '../../../data/sisData';

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
            <i className="feather icon-plus" /> Add Leave
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

const Leave = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id'
      },
      {
        Header: 'Start Date',
        accessor: 'date'
      },
      {
        Header: 'End Date',
        accessor: 'deadline'
      },
      {
        Header: 'Leave Reason',
        accessor: 'description'
      },
      {
        Header: 'Status',
        accessor: 'status'
      },
      {
        Header: 'Remark',
        accessor: 'name'
      }
    ],
    []
  );

  const data = React.useMemo(() => makeData(50), []);

  const [isOpen, setIsOpen] = useState(false);

  const openHandler = () => {
    setIsOpen(true);
  };

  return (
    <React.Fragment>
      <Row className="btn-page">
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Leave List</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table columns={columns} data={data} modalOpen={openHandler} />
            </Card.Body>
          </Card>
          <Modal show={isOpen} onHide={() => setIsOpen(false)}>
            <Modal.Header closeButton>
              <Modal.Title as="h5">Apply For Leave</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={12}>
                  <h5>From Date</h5>
                </Col>
                <Col sm={6}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Date1">
                      Date
                    </label>
                    <input type="date" className="form-control" id="Date1" placeholder="Date" />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Time1">
                      Time
                    </label>
                    <input type="time" className="form-control" id="Time1" placeholder="Time" />
                  </div>
                </Col>
                <Col sm={12} className="p-b-5">
                  <h5>To Date</h5>
                </Col>
                <Col sm={6}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Date2">
                      Date
                    </label>
                    <input type="date" className="form-control" id="Date2" placeholder="Date" />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Time2">
                      Time
                    </label>
                    <input type="time" className="form-control" id="Time2" placeholder="Time" />
                  </div>
                </Col>
                <Col sm={12} className="p-b-5">
                  <h5>Reason</h5>
                </Col>
                <Col sm={12}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Reason">
                      Reason
                    </label>
                    <textarea className="form-control" id="Reason" rows="3" placeholder="Reason" />
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => setIsOpen(false)}>
                Clear
              </Button>
              <Button variant="primary">Save & Create Contact</Button>
              <Button variant="primary">Submit</Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Leave;
