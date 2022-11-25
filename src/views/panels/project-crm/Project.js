import React, { useState } from 'react';
import { Row, Col, Card, Tabs, Tab, Button, Pagination } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import ReactTags from 'react-tag-autocomplete';

import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from 'jodit-react';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import makeData from '../../../data/projectData';

function Table({ columns, data }) {
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

const Project = () => {
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

  const data = React.useMemo(() => makeData(8), []);

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

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>Projects Summary</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={2} xs={6} className="border-right">
                  <h3>2</h3>
                  <span className="">Not Started</span>
                </Col>
                <Col md={2} xs={6} className="border-right">
                  <h3>12</h3>
                  <span className="text-primary">In Progress</span>
                </Col>
                <Col md={2} xs={6} className="border-right">
                  <h3>0</h3>
                  <span className="text-danger">On Hold</span>
                </Col>
                <Col md={2} xs={6} className="border-right">
                  <h3>1</h3>
                  <span className="">Cancelled</span>
                </Col>
                <Col md={2} xs={6}>
                  <h3>0</h3>
                  <span className="text-success">Finished</span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Tabs defaultActiveKey="project" className="px-20">
                <Tab eventKey="project" title="PROJECTS">
                  <hr className="mt-4" />
                  <Table columns={columns} data={data} />
                </Tab>
                <Tab eventKey="new-project" title="NEW PROJECT">
                  <hr className="mt-4" />
                  <Row>
                    <Col>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Project">
                          <small className="text-danger">* </small>Project Name
                        </label>
                        <input type="text" className="form-control" id="Project" placeholder="Project Name" />
                      </div>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Customer">
                          <small className="text-danger">* </small>Customer
                        </label>
                        <input type="text" className="form-control" id="Customer" placeholder="Customer" />
                      </div>
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="customCheck1">
                          Calculate progress through tasks
                        </label>
                      </div>
                      <label htmlFor="customRange1">
                        Progress <span className="badge badge-primary">0%</span>
                      </label>
                      <input type="range" className="custom-range mb-3" id="customRange1" defaultValue="0" placeholder="Progress" />
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group fill">
                            <label className="floating-label" htmlFor="Billing">
                              <small className="text-danger">* </small>Billing Type
                            </label>
                            <select className="form-control" id="Billing">
                              <option value="" />
                              <option defaultValue={1}>Fixed Rate</option>
                              <option value="2">Project Hours</option>
                              <option value="3">Task Hours</option>
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
                              <option value="1">Not Started</option>
                              <option value="2">In Progress</option>
                              <option value="3">On Hold</option>
                              <option value="5">Cancelled</option>
                              <option value="4">Finished</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="Rate">
                          Rate Per Hour
                        </label>
                        <input type="text" className="form-control" id="Rate" placeholder="Rate Per Hour" />
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group fill">
                            <label className="floating-label" htmlFor="Hours">
                              Estimated Hours
                            </label>
                            <input type="text" className="form-control" id="Hours" placeholder="" />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group fill">
                            <label className="floating-label" htmlFor="Members">
                              Members
                            </label>
                            <select className="form-control" id="Members">
                              <option value="" />
                              <option value="9">Sigurd Kessler</option>
                              <option value="2">Marshall Morissette</option>
                              <option value="10">Marlin Sipes</option>
                              <option value="7">Lula Reichel</option>
                              <option value="3">Lorenzo Stroman</option>
                              <option value="1">Guido Nolan</option>
                              <option value="8">Ernesto Kerluke</option>
                              <option value="5">Clifford Roberts</option>
                              <option value="6">Chet Rempel</option>
                              <option value="4">Amani Wiegand</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group fill">
                            <label className="floating-label" htmlFor="Start">
                              Start Date
                            </label>
                            <input type="date" className="form-control" id="Start" placeholder="123" />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group fill">
                            <label className="floating-label" htmlFor="Deadline">
                              Deadline
                            </label>
                            <input type="date" className="form-control" id="Deadline" placeholder="123" />
                          </div>
                        </div>
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
                    </Col>
                    <div className="col-md-6">
                      <h5 className="mb-4">Project settings</h5>
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset1" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="proset1">
                          Allow customer to view tasks
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset2" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="proset2">
                          Allow customer to edit tasks (only tasks created from contact)
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset3" />
                        <label className="custom-control-label" htmlFor="proset3">
                          Allow customer to comment on project tasks
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset4" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="proset4">
                          Allow customer to view task comments
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset5" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="proset5">
                          Allow customer to view task attachments
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset6" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="proset6">
                          Allow customer to view task checklist items
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset7" />
                        <label className="custom-control-label" htmlFor="proset7">
                          Allow customer to upload attachments on tasks
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset8" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="proset8">
                          Allow customer to view task total logged time
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset9" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="proset9">
                          Allow customer to view finance overview
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset10" />
                        <label className="custom-control-label" htmlFor="proset10">
                          Allow customer to upload files
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset11" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="proset11">
                          Allow customer to open discussions
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset12" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="proset12">
                          Allow customer to view milestones
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset13" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="proset13">
                          Allow customer to view Gantt
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset14" />
                        <label className="custom-control-label" htmlFor="proset14">
                          Allow customer to view timesheets
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset15" />
                        <label className="custom-control-label" htmlFor="proset15">
                          Allow customer to view activity log
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset16" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="proset16">
                          Allow customer to view team members
                        </label>
                      </div>
                      <hr />
                      <div className="custom-control custom-checkbox mb-3">
                        <input type="checkbox" className="custom-control-input" id="proset17" defaultChecked={true} />
                        <label className="custom-control-label" htmlFor="proset17">
                          Hide project tasks on main tasks table (admin area)
                        </label>
                      </div>
                    </div>
                    <Col sm={12}>
                      <Button variant="primary mr-2"> Save </Button>
                      <Button variant="danger"> Clear </Button>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Project;
