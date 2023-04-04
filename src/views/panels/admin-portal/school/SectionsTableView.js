import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
// import makeData from '../../../data/schoolData';
import { Link, useHistory } from 'react-router-dom';


import dynamicUrl from '../../../../helper/dynamicUrls';
import MESSAGES from '../../../../helper/messages';
import { SessionStorage } from '../../../../util/SessionStorage';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import withReactContent from 'sweetalert2-react-content';
import { useLocation } from "react-router-dom";
import BasicSpinner from '../../../../helper/BasicSpinner';
import CreateSection from './CreateSection';
import EditSection from './EditSection';
import { fetchSchoolSection } from '../../../api/CommonApi'


import Swal from 'sweetalert2';

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

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAddSection, setOpenAddSection] = useState(false);
    const [schoolId,setSchoolId] = useState(sessionStorage.getItem('school_id'))
    let history = useHistory();

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
                    <Button className='btn-sm btn-round has-ripple ml-2 btn btn-success' onClick={() => { setOpenAddSection(true) }}  >
                        Add Section
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
            <Modal dialogClassName="my-modal" show={isOpenAddSection} onHide={() => setOpenAddSection(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Add Section</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateSection setOpenAddSection={setOpenAddSection} id={schoolId}/>
                </Modal.Body>
            </Modal>
        </>
    );
}

const SectionsTableView = ({ id }) => {
    sessionStorage.setItem('school_id',id)
    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor: 'index_no'
            },
            {
                Header: 'Section Name',
                accessor: 'section_name'
            },
            {
                Header: 'Class Name',
                accessor: 'client_class_name'
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
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [isLoading, setIsLoading] = useState(false);
    const [reloadAllData, setReloadAllData] = useState('Fetched');
    const MySwal = withReactContent(Swal);
    const [isOpenAddSection, setOpenAddSection] = useState(false);
    const [isOpenEditSection, setOpenEditSection] = useState(false);
    const [sectionId, setEditId] = useState();

    const sweetConfirmHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    }

    const handelAddSection = () => {
        setOpenAddSection(true)
    }

    const handleEditSection = (section_id) => {
        setEditId(section_id)
        setOpenEditSection(true)
    }

    const fetchAllSchoolS = async () => {
        const allSectionData = await fetchSchoolSection(id);
        console.log("allSectionData", allSectionData);
        if (allSectionData.Error) {
            console.log('allSectionData.Error', allSectionData.Error);
        } else {
            const finalDataArray = [] ;
            const resultData = allSectionData.Items
            for (let index = 0; index < resultData.length; index++) {
                resultData[index].index_no = index + 1;
                resultData[index]['actions'] = (
                    <>
                        <Button
                            onClick={(e) => { handleEditSection( resultData[index].section_id);}}
                            size="sm"
                            className="btn btn-icon btn-rounded btn-info"
                        >
                            <i className="feather icon-edit" /> &nbsp; Edit
                        </Button>
                    </>
                );
                finalDataArray.push(resultData[index]);

            }
            console.log('finalDataArray: ', finalDataArray);
            setData(finalDataArray);
            setIsLoading(false);
        }

    }

    useEffect(() => {

        fetchAllSchoolS();
    }, [])

    return (

        <div>
            {
                isLoading ? (
                    <BasicSpinner />
                ) : (
                    <>
                        {
                            data.length <= 0 ? (
                                <>
                                    < React.Fragment >
                                        <div>
                                            <h3 style={{ textAlign: 'center' }}>No Section Found</h3>
                                            <div className="form-group fill text-center">
                                                <br></br>

                                                <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={handelAddSection}>
                                                    <i className="feather icon-plus" /> Add Section
                                                </Button>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                    <Modal dialogClassName="my-modal" show={isOpenAddSection} onHide={() => setOpenAddSection(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title as="h5">Add Section</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <CreateSection setOpenAddSection={setOpenAddSection} id={id} />
                                        </Modal.Body>
                                    </Modal>
                                </>
                            ) : (
                                <>
                                    <React.Fragment>
                                        <Row>
                                            <Col sm={12}>
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">Section List</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Table columns={columns} data={data} />
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </React.Fragment >
                                    <Modal dialogClassName="my-modal" show={isOpenEditSection} onHide={() => setOpenEditSection(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title as="h5">Edit Section</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <EditSection setOpenEditSection={setOpenEditSection} id={id} sectionId={sectionId} />
                                        </Modal.Body>
                                    </Modal>
                                </>
                            )
                        }
                    </>
                )
            }
        </div >
    );
};
export default SectionsTableView;
