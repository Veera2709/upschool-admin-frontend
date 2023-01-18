import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { GlobalFilter } from '../units/GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';

import dynamicUrl from '../../../../helper/dynamicUrls';

import { isEmptyArray } from '../../../../util/utils';

import { Link, useHistory } from 'react-router-dom';
import { SessionStorage } from '../../../../util/SessionStorage';
import MESSAGES from '../../../../helper/messages';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { useLocation } from "react-router-dom";
import { fetchAllTopics } from '../../../api/CommonApi'
import BasicSpinner from '../../../../helper/BasicSpinner';
import AddTopics from './AddTopics';
import EditTopics from './EditTopics';




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
    const [isOpenAddTopic, setOpenAddTopic] = useState(false);
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
                    <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={() => { setOpenAddTopic(true) }}>
                        <i className="feather icon-plus" /> Add Topic
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
            <Modal dialogClassName="my-modal" show={isOpenAddTopic} onHide={() => setOpenAddTopic(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Add Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddTopics setOpenAddTopic={setOpenAddTopic} />
                </Modal.Body>
            </Modal>
        </>
    );
}

const ActiveTopics = (props) => {
    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor: "index_no"
            },
            {
                Header: ' Topic Title',
                accessor: 'topic_title'
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
    const [topicData, setTopicData] = useState([]);
    const [reloadAllData, setReloadAllData] = useState('Fetched');
    const [statusUrl, setStatusUrl] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[3]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenAddTopic, setOpenAddTopic] = useState(false);
    const [isOpenEditTopic, setOpenEditTopic] = useState(false);
    const [topicId, setTopicId] = useState();




    // console.log('data: ', data)


    let history = useHistory();

    const MySwal = withReactContent(Swal);
    const sweetConfirmHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    }


    const handleAddTopic = () => {
        setOpenAddTopic(true)
    }

    const confirmHandler = (topic_id, topic_title) => {
        var data = {
            "topic_id": topic_id,
            "topic_status": "Archived"
        }
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Confirm deleting ' + topic_title + 'Topic',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                axios
                    .post(dynamicUrl.toggleTopicStatus, { data: data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
                    .then((response) => {
                        if (response.Error) {
                            hideLoader();
                            sweetConfirmHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                        } else {
                            allTopicList(statusUrl&&statusUrl)
                            setReloadAllData("Deleted");
                            return MySwal.fire('', 'The ' + topic_title + ' is Deleted', 'success');
                        }
                    })
                    .catch((error) => {
                        if (error.response) {
                            // Request made and server responded
                            console.log(error.response.data);
                            hideLoader();
                            if (error.response.data === 'Invalid Token') {
                                sessionStorage.clear();
                                localStorage.clear();
                                history.push('/auth/signin-1');
                                window.location.reload();
                            } else {
                                sweetConfirmHandler({ title: 'Sorry', type: 'warning', text: error.response.data });
                            }
                        } else if (error.request) {
                            // The request was made but no response was received
                            console.log(error.request);
                            hideLoader();
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            // console.log('Error', error.message);
                            // hideLoader();
                        }
                    });
            } else {
            }
        });
    };





    function restoreChapter(topic_id, topic_title) {
        console.log("topic_id", topic_id);
        var data = {
            "topic_id": topic_id,
            "topic_status": 'Active'
        }

        const sweetConfirmHandler = () => {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: 'Are you sure?',
                text: 'Confirm to Restore ' + topic_title + 'Topic',
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true
            }).then((willDelete) => {
                if (willDelete.value) {
                    axios
                        .post(dynamicUrl.toggleTopicStatus, { data: data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
                        .then((response) => {
                            if (response.Error) {
                                hideLoader();
                                sweetConfirmHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                            } else {
                                allTopicList(statusUrl&&statusUrl)
                                setReloadAllData("Deleted");
                                return MySwal.fire('', 'The ' + topic_title + ' is Restored', 'success')
                            }
                        })
                        .catch((error) => {
                            if (error.response) {
                                // Request made and server responded
                                console.log(error.response.data);
                                if (error.response.data === 'Invalid Token') {
                                    sessionStorage.clear();
                                    localStorage.clear();
                                    history.push('/auth/signin-1');
                                    window.location.reload();
                                } else {
                                    console.log("err", error);
                                }
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
                }
            });
        };
        sweetConfirmHandler();
    }


    const allTopicList = async (TopicStatus) => {
        let userJWT = sessionStorage.getItem('user_jwt');
        console.log("jwt", userJWT);

        if (userJWT === "" || userJWT === undefined || userJWT === "undefined" || userJWT === null) {

            sessionStorage.clear();
            localStorage.clear();
            history.push('/auth/signin-1');
            window.location.reload();
        } else {
            setIsLoading(true)
            const allUnitsData = await fetchAllTopics();
            if (allUnitsData.ERROR) {
                console.log("allUnitsData.ERROR", allUnitsData.ERROR);
            } else {
                let dataResponse = allUnitsData.Items
                console.log("dataResponse", dataResponse);
                let finalDataArray = [];
                if (TopicStatus === 'Active') {
                    let ActiveresultData = (dataResponse && dataResponse.filter(e => e.topic_status === 'Active'))
                    console.log("ActiveresultData", ActiveresultData);

                    for (let index = 0; index < ActiveresultData.length; index++) {
                        ActiveresultData[index].index_no = index + 1;
                        ActiveresultData[index]['actions'] = (
                            <>
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        // onClick={(e) => history.push(`/admin-portal/Topics/editTopic/${ActiveresultData[index].topic_id}`)}
                                        onClick={(e) => { setTopicId(ActiveresultData[index].topic_id); setOpenEditTopic(true) }}
                                    >
                                        <i className="feather icon-edit" /> &nbsp; Edit
                                    </Button>
                                    &nbsp;
                                    {/* if(resultData[index].chapter_status=='Active') */}
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-danger"
                                        onClick={(e) => confirmHandler(ActiveresultData[index].topic_id, ActiveresultData[index].topic_title)}
                                    >
                                        <i className="feather icon-trash-2 " /> &nbsp; Delete
                                    </Button>
                                    &nbsp;
                                </>
                            </>
                        );
                        finalDataArray.push(ActiveresultData[index]);
                        console.log('finalDataArray: ', finalDataArray)
                    }
                } else {
                    let resultData = (dataResponse && dataResponse.filter(e => e.topic_status === 'Archived'))
                    for (let index = 0; index < resultData.length; index++) {
                        resultData[index].index_no = index + 1;
                        resultData[index]['actions'] = (
                            <>
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        onClick={(e) => restoreChapter(resultData[index].topic_id, resultData[index].topic_title)}
                                    >
                                        <i className="feather icon-plus" /> &nbsp; Restore
                                    </Button>
                                    &nbsp;
                                </>
                            </>
                        );
                        finalDataArray.push(resultData[index]);
                        console.log('finalDataArray: ', finalDataArray)
                    }
                }
                setTopicData(finalDataArray);
                console.log('resultData: ', finalDataArray);
                setIsLoading(false)
            }

        }



    }

    useEffect(() => {

        if (pageLocation) {
            console.log("--", pageLocation);
            const url = pageLocation === "active-topics" ? 'Active' : 'Archived';
            setStatusUrl(url)
            allTopicList(url);
        }

    }, [reloadAllData])

    return (
        <div>
            {
                isLoading ? (
                    <BasicSpinner />
                ) : (
                    <>
                        {
                            topicData.length <= 0 ? (
                                <>
                                    < React.Fragment >
                                        <div>

                                            <h3 style={{ textAlign: 'center' }}>No Topics Found</h3>
                                            <div className="form-group fill text-center">
                                                <br></br>
                                                <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={handleAddTopic}>
                                                    <i className="feather icon-plus" /> Add Topic
                                                </Button>
                                            </div>
                                        </div>
                                        <Modal dialogClassName="my-modal" show={isOpenAddTopic} onHide={() => setOpenAddTopic(false)}>
                                            <Modal.Header closeButton>
                                                <Modal.Title as="h5">Add Topic</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <AddTopics setOpenAddTopic={setOpenAddTopic} />
                                            </Modal.Body>
                                        </Modal>
                                    </React.Fragment>
                                </>
                            ) : (
                                <>
                                    <React.Fragment>
                                        <Row>
                                            <Col sm={12}>
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">Topics List</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Table columns={columns} data={topicData} />
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Modal dialogClassName="my-modal" show={isOpenEditTopic} onHide={() => setOpenEditTopic(false)}>
                                            <Modal.Header closeButton>
                                                <Modal.Title as="h5">Edit Topic</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <EditTopics setOpenEditTopic={setOpenEditTopic} topicId={topicId} />
                                            </Modal.Body>
                                        </Modal>
                                    </React.Fragment>
                                </>
                            )
                        }
                    </>
                )
            }
        </div >

    );
};
export default ActiveTopics;
