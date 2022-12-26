import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { GlobalFilter } from '../digicard/GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
// import makeData from '../../../data/schoolData';
import { useHistory } from 'react-router-dom';


import dynamicUrl from '../../../../helper/dynamicUrls';
import MESSAGES from '../../../../helper/messages';
import { SessionStorage } from '../../../../util/SessionStorage';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import withReactContent from 'sweetalert2-react-content';
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


    let history = useHistory();

    const addTopics = () => {
        history.push('/admin-portal/Topics/addTopics');
        setIsOpen(true);
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
                    entries
                </Col>
                <Col className="d-flex justify-content-end">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    <Button className='btn-sm btn-round has-ripple ml-2 btn btn-success' onClick={() => { addTopics(); }}  >
                        Add Topics
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



const ActiveTopics = () => {
    const columns = React.useMemo(
        () => [
            // {
            //     Header: '#',
            //     accessor: 'digicard_image'
            // },
            {
                Header: 'Topic Title',
                accessor: 'topic_title_name'
            },

            {
                Header: 'Type of Learning',
                accessor: 'pre_post_learning'
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
    const [viewTopic, setViewTopic] = useState({});
    console.log('viewTopic: ', viewTopic);
    const [isOpen, setIsOpen] = useState(false);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const MySwal = withReactContent(Swal);


    const openHandler = () => setIsOpen(true);

    let history = useHistory();

    function deleteTopic(e, topic_id, topic_title) {
        e.preventDefault();
        // var data = { "topic_id": topic_id, topic_status: 'Active/Archived' }
        var data = { topic_id: topic_id, topic_status: 'Archived' }

        const sweetConfirmHandler = () => {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: 'Are you sure?',
                text: 'Confirm deleting this Topic',
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true
            }).then((willDelete) => {
                if (willDelete.value) {
                    axios.post(dynamicUrl.deleteTopic, { data: data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
                        .then((response) => {
                            if (response.Error) {
                                hideLoader();
                                sweetConfirmHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingTopic });
                            } else {
                                // sweetConfirmHandler({ type: 'success', title: 'Success', text: `The ${topic_title} is Deleted` });
                                // window.location.reload();
                                MySwal.fire({
                                    title: '',
                                    text: `The ${topic_title} is Deleted`,
                                    type: 'warning',
                                    showCloseButton: true,
                                    showCancelButton: true
                                })
                                // window.location.reload();
                            }
                        })
                        .catch((error) => {
                            if (error.response) {
                                // Request made and server responded
                                console.log(error.response.data);
                                hideLoader();
                                sweetConfirmHandler({ title: 'Error', type: 'error', text: error.response.data });
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
                    return MySwal.fire('', 'Topic is safe!', 'error');
                }
            });
        };
        sweetConfirmHandler();

    }

    const fetchAllTopics = () => {
        axios.post(dynamicUrl.getTopics, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                let resultData = response.data.Items;
                console.log('resultData: ', resultData);
                let finalDataArray = [];

                for (let index = 0; index < resultData.length; index++) {
                    resultData[index]['topic_title_name'] = resultData[index].topic_title;
                    // resultData[index]['pre_post_learning'] = resultData[index].pre_post_learning;
                    resultData[index]['actions'] = (
                        <>
                            &nbsp;
                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-primary"
                                onClick={(e) => history.push(`/admin-portal/Topics/editTopic/${resultData[index].topic_id}`)}
                            >
                                <i className="feather icon-edit" /> &nbsp; Edit
                            </Button>
                            &nbsp;
                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-danger"
                                onClick={(e) => deleteTopic(e, resultData[index].topic_id, resultData[index].topic_title)}
                            >
                                <i className="feather icon-trash-2 " /> &nbsp; Delete
                            </Button>
                            &nbsp;
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
        fetchAllTopics();
    }, [])

    return (
        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Topic List</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Table columns={columns} data={data} modalOpen={openHandler} />
                        </Card.Body>
                    </Card>
                    {/* <Modal dialogClassName="my-modal" show={isOpen} onHide={() => setIsOpen(false)}>
                <Modal.Header closeButton>
                  <Modal.Title as="h5">Add School</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <AddSchoolForm />
                </Modal.Body>
                <Modal.Footer>
                                <Button variant="danger" onClick={() => setIsOpen(false)}>
                      s              Clear
                                </Button>
                                <Button variant="primary">Submit</Button>
                            </Modal.Footer>
              </Modal> */}
                </Col>
            </Row>
        </React.Fragment >
    );
}

export default ActiveTopics