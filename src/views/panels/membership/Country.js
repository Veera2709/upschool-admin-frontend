import React, { useState } from 'react';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';

import { GlobalFilter } from './GlobalFilter';

import makeData from '../../../data/countryData';

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

const Country = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        Cell: ({ row }) => row.id
      },
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Abbreviation',
        accessor: 'code'
      },
      {
        Header: 'Tax/Vat',
        Cell: ({ row }) => Math.floor(Math.random() * 28 + 0) + '%'
      },
      {
        Header: 'Capita',
        Cell: ({ row }) => Math.floor(Math.random() * 9.99 + 0.1) + '%'
      },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <button type="button" className="btn btn-icon btn-outline-primary" onClick={() => setIsOpen(true)}>
            <i className="feather icon-check-circle" />
          </button>
        )
      }
    ],
    []
  );

  const data = React.useMemo(() => makeData(18), []);

  const [isOpen, setIsOpen] = useState(false);

  const openHandler = () => {
    setIsOpen(true);
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Country List</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table columns={columns} data={data} modalOpen={openHandler} />
            </Card.Body>
          </Card>
          <Modal show={isOpen} onHide={() => setIsOpen(false)}>
            <Modal.Header closeButton>
              <Modal.Title as="h5">Edit Country</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={6}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Name">
                      <small className="text-danger">* </small>Country Name
                    </label>
                    <input type="text" className="form-control" id="Name" placeholder="Country Name" />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Subject">
                      Subject
                    </label>
                    <input type="email" className="form-control" id="Subject" placeholder="Subject" />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="VAT">
                      TAX/VAT
                    </label>
                    <input type="text" className="form-control" id="VAT" placeholder="TAX/VAT" />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Sorting">
                      Sorting
                    </label>
                    <input type="text" className="form-control" id="Sorting" placeholder="Sorting" />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <label className="d-block mb-2">Status</label>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      id="customRadioInline1"
                      name="customRadioInline1"
                      className="custom-control-input"
                      defaultChecked={true}
                    />
                    <label className="custom-control-label" htmlFor="customRadioInline1">
                      Active
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="customRadioInline2" name="customRadioInline1" className="custom-control-input" />
                    <label className="custom-control-label" htmlFor="customRadioInline2">
                      Inactive
                    </label>
                  </div>
                </Col>
                <Col sm={6}>
                  <label className="d-block mb-2">Default</label>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      id="customRadioInline11"
                      name="customRadioInline11"
                      className="custom-control-input"
                      defaultChecked={true}
                    />
                    <label className="custom-control-label" htmlFor="customRadioInline11">
                      Yes
                    </label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="customRadioInline12" name="customRadioInline11" className="custom-control-input" />
                    <label className="custom-control-label" htmlFor="customRadioInline12">
                      No
                    </label>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => setIsOpen(false)}>
                Clear
              </Button>
              <Button variant="primary">Submit</Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Country;
