import React, { useState } from 'react';
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';

import { GlobalFilter } from './GlobalFilter';

import makeData from '../../../data/membershipData';
import CkDecoupledEditor from '../../../components/CK-Editor/CkDecoupledEditor';

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

const Email = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id'
      },
      {
        Header: 'Template Name',
        accessor: 'name'
      },
      {
        Header: 'Subject',
        accessor: 'subject'
      },
      {
        Header: 'Action',
        accessor: 'action',
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

  const html = `
            <h2 style="text-align:center;">The Flavorful Tuscany Meetup</h2>
            <h3 style="text-align:center;">Welcome letter</h3>
            <p>Dear Guest,</p>
            <p>We are delighted to welcome you to the annual <i>Flavorful Tuscany Meetup</i> and hope you will enjoy the programmer as well as your stay at the <a href="http://ckeditor.com">Bilancino Hotel</a>.</p>
            <p>Please find below the full schedule of the event.</p>
            <figure class="table ck-widget ck-widget_selectable" contenteditable="false">
                <table>
                    <thead>
                        <tr>
                            <th class="ck-editor__editable ck-editor__nested-editable" contenteditable="true" colspan="2">Saturday, July 14</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="ck-editor__editable ck-editor__nested-editable" contenteditable="true">9:30&nbsp;AM&nbsp;-&nbsp;11:30&nbsp;AM</td>
                            <td class="ck-editor__editable ck-editor__nested-editable" contenteditable="true">Americano vs. Brewed - “know coffee” with <strong>Stefano Garau</strong></td>
                        </tr>
                        <tr>
                            <td class="ck-editor__editable ck-editor__nested-editable" contenteditable="true">1:00&nbsp;PM&nbsp;-&nbsp;3:00&nbsp;PM</td>
                            <td class="ck-editor__editable ck-editor__nested-editable" contenteditable="true">Pappardelle al pomodoro -
                                <mark class="marker-yellow">live cooking</mark> with <strong>Rita</strong></td>
                        </tr>
                        <tr>
                            <td class="ck-editor__editable ck-editor__nested-editable" contenteditable="true">5:00&nbsp;PM&nbsp;-&nbsp;8:00&nbsp;PM</td>
                            <td class="ck-editor__editable ck-editor__nested-editable" contenteditable="true">Tuscan vineyards at a glancewith <strong>Frederico Riscoli</strong></td>
                        </tr>
                    </tbody>
                </table>
            </figure>
            <blockquote>
                <p>The annual Flavorful Tuscany meetups are always a culinary discovery. You get the best of Tuscan flavors during an intense one-day stay at one of the top hotels of the region. All the
                    sessions are lead by top chefs passionate about their profession. I would certainly recommend to save the date in your calendar for this one!</p>
                <p>Angelina Calvino, food journalist</p>
            </blockquote>
            <p>Please arrive at the <a href="http://ckeditor.com">Bilancino Hotel</a> reception desk
                <mark class="marker-yellow">at least half an hour earlier</mark> to make sure that the registration process goes as smoothly as possible.</p>
            <p>We look forward to welcoming you to the event.</p>
            <p><strong>Victoria Valc</strong></p>
            <p><strong>Event Manager</strong></p>
            <p><strong>Bilancino Hotel</strong></p>
        `;

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Email Template List</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table columns={columns} data={data} modalOpen={openHandler} />
            </Card.Body>
          </Card>
          <Modal size="xl" show={isOpen} onHide={() => setIsOpen(false)}>
            <Modal.Header closeButton>
              <Modal.Title as="h5">Edit Email Template</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col sm={6}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Name">
                      <small className="text-danger">* </small>Template Name
                    </label>
                    <input type="text" className="form-control" id="Name" placeholder="Template Name" />
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group fill">
                    <label className="floating-label" htmlFor="Subject">
                      <small className="text-danger">* </small>Subject
                    </label>
                    <input type="text" className="form-control" id="Subject" placeholder="Subject" />
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="document-editor">
                    <div className="document-editor__toolbar" />
                    <div className="document-editor__editable-container">
                      <div className="document-editor__editable">
                        <CkDecoupledEditor html={html} editor="document" />
                      </div>
                    </div>
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

export default Email;
