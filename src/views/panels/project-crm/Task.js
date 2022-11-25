import React, { useState } from 'react';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import ReactTags from 'react-tag-autocomplete';

import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from 'jodit-react';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import makeData from '../../../data/projectData';

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
            <i className="feather icon-plus" /> Add Task
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

const Task = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id'
      },
      {
        Header: 'Project Name',
        accessor: 'description'
      },
      {
        Header: 'Customer',
        accessor: 'name'
      },
      {
        Header: 'Tags',
        accessor: 'tags'
      },
      {
        Header: 'Start Date',
        accessor: 'date'
      },
      {
        Header: 'Deadline',
        accessor: 'deadline'
      },
      {
        Header: 'Members',
        accessor: 'member'
      },
      {
        Header: 'Status',
        accessor: 'status'
      }
    ],
    []
  );

  const data = React.useMemo(() => makeData(50), []);

  const [isOpen, setIsOpen] = useState(false);

  const [tags, setTags] = useState([
    { id: 1, name: 'Washington' },
    { id: 2, name: 'Sydney' },
    { id: 3, name: 'Beijing' }
  ]);
  const [content, setContent] = useState('Hello....');

  const updateContent = (value) => {
    setContent(value);
  };

  const setRef = (jodit) => {
    // control
  };

  const config = {
    readonly: false
  };

  const handleDelete = (i) => {
    const tagsNew = tags.slice(0);
    tagsNew.splice(i, 1);
    setTags(tagsNew);
  };

  const handleAddition = (tag) => {
    const tagsNew = [].concat(tags, tag);
    setTags(tagsNew);
  };

  const openHandler = () => {
    setIsOpen(true);
  };

  return (
    <React.Fragment>
      <Row className="btn-page">
        <Col sm={12}>
          <Card>
            <Card.Header>
              <h5>Projects Summary</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={2} xs={6} className="border-right">
                  <h3>14</h3>
                  <h6 className="text-success">Not Started</h6>
                  <span className="">Assigned to me: 7</span>
                </Col>
                <Col md={2} xs={6} className="border-right">
                  <h3>17</h3>
                  <h6 className="text-primary">In Progress</h6>
                  <span className="">Assigned to me: 8</span>
                </Col>
                <Col md={2} xs={6} className="border-right">
                  <h3>10</h3>
                  <h6 className="">Testing</h6>
                  <span className="">Assigned to me: 4</span>
                </Col>
                <Col md={2} xs={6} className="border-right">
                  <h3>1</h3>
                  <h6 className="text-success">Awaiting Feedback</h6>
                  <span className="">Assigned to me: 3</span>
                </Col>
                <Col md={2} xs={6}>
                  <h3>6</h3>
                  <h6 className="text-success">Complete</h6>
                  <span className="">Assigned to me: 5</span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Task List</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table columns={columns} data={data} modalOpen={openHandler} />
            </Card.Body>
          </Card>
          <Modal size="xl" show={isOpen} onHide={() => setIsOpen(false)}>
            <Modal.Header closeButton>
              <Modal.Title as="h5">Add Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Public
                </label>
              </div>
              <div className="custom-control custom-checkbox custom-control-inline mb-2">
                <input type="checkbox" className="custom-control-input" id="customCheck2" />
                <label className="custom-control-label" htmlFor="customCheck2">
                  Billable
                </label>
              </div>
              <div className="form-group fill">
                <label className="floating-label" htmlFor="Subject">
                  <small className="text-danger">* </small>Subject
                </label>
                <input type="text" className="form-control" id="Subject" placeholder="Subject" />
              </div>
              <div className="form-group fill">
                <label className="floating-label" htmlFor="Rate">
                  Hourly Rate
                </label>
                <input type="text" className="form-control" id="Rate" placeholder="Hourly Rate" />
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Start">
                      Start Date
                    </label>
                    <input type="date" className="form-control" id="Start" placeholder="Start Date" />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Deadline">
                      Due Date
                    </label>
                    <input type="date" className="form-control" id="Deadline" placeholder="Due Date" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Billing">
                      <small className="text-danger">* </small>Billing Type
                    </label>
                    <select className="form-control" id="Billing">
                      <option value="" />
                      <option value="1">Low</option>
                      <option value="2">Medium</option>
                      <option value="3">High</option>
                      <option value="4">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Status">
                      Status
                    </label>
                    <select className="form-control" id="Status">
                      <option value="" />
                      <option value="1-week">Week</option>
                      <option value="2-week">2 Weeks</option>
                      <option value="1-month">1 Month</option>
                      <option value="2-month">2 Months</option>
                      <option value="3-month">3 Months</option>
                      <option value="6-month">6 Months</option>
                      <option value="1-year">1 Year</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-group fill">
                <label className="floating-label" htmlFor="Related">
                  Related To
                </label>
                <select className="form-control" id="Related">
                  <option value="" />
                  <option value="project">Project</option>
                  <option value="invoice">Invoice </option>
                  <option value="customer">Customer </option>
                  <option value="estimate">Estimate </option>
                  <option value="contract">Contract </option>
                  <option value="ticket">Ticket </option>
                  <option value="expense">Expense </option>
                  <option value="lead">Lead </option>
                  <option value="proposal">Proposal </option>
                </select>
              </div>
              <div className="form-group fill">
                <label className="label">Tags</label>
                <ReactTags
                  classNames={{ root: 'react-tags bootstrap-tagsinput', selectedTag: 'react-tags__selected-tag btn-primary' }}
                  allowNew={true}
                  tags={tags}
                  onDelete={handleDelete}
                  onAddition={(e) => handleAddition(e)}
                />
              </div>
              <div className="form-group fill">
                <label className="label">Description</label>
                <JoditEditor editorRef={setRef} value={content} config={config} onChange={() => updateContent} />
              </div>
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

export default Task;
