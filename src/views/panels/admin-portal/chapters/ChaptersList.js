import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { GlobalFilter } from './GlobalFilter';

import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';

import dynamicUrl from '../../../../helper/dynamicUrls';

import { isEmptyArray } from '../../../../util/utils';

import { Link, useHistory } from 'react-router-dom';
import { SessionStorage } from '../../../../util/SessionStorage';
import MESSAGES from '../../../../helper/messages';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import { useLocation } from "react-router-dom";
import BasicSpinner from '../../../../helper/BasicSpinner';
import AddChapter from './AddChapters';
import EditChapter from './EditChapter';


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
    const [isOpenAddChapter, setOpenAddChapter] = useState(false);
    let history = useHistory();

    const addingChapter = () => {
        history.push('/admin-portal/addChapters');
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
                    Entries
                </Col>

                <Col className="d-flex justify-content-end">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={() => { setOpenAddChapter(true) }}>
                        <i className="feather icon-plus" /> Add Chapter
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
            <Modal dialogClassName="my-modal" show={isOpenAddChapter} onHide={() => setOpenAddChapter(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Add Chapter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddChapter setOpenAddChapter={setOpenAddChapter} />
                </Modal.Body>
            </Modal>
        </>
    );
}

const ChaptersListChild = (props) => {
    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor: "index_no"
            },
            {
                Header: ' Chapter Title',
                accessor: 'chapter_title'
            },
            {
                Header: 'Options',
                accessor: 'actions'
            }
        ],
        []
    );

    // const data = React.useMemo(() => makeData(80), []);
    const [chapterData, setChapterData] = useState([]);
    const [reloadAllData, setReloadAllData] = useState('Fetched');
    const [statusUrl, setStatusUrl] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[3]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenEditChapter, setOpenEditChapter] = useState(false);
    const [chapterId, setChapterId] = useState();
    const [isOpenAddChapter, setOpenAddChapter] = useState(false);


    const handleAddChapter = (e) => {
        e.preventDefault();
        setOpenAddChapter(true)
    }


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

    function deleteChapter(chapter_id, chapter_title) {
        console.log("chapter_id", chapter_id);

        confirmHandler(chapter_id, chapter_title)
    }

    const confirmHandler = (chapter_id, chapter_title) => {
        var data = {
            "chapter_id": chapter_id,
            "chapter_status": "Archived"
        }
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Confirm deleting ' + chapter_title + ' Chapter',
            type: 'warning',
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                axios
                    .post(dynamicUrl.toggleChapterStatus, { data: data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
                    .then((response) => {
                        if (response.Error) {
                            hideLoader();
                            sweetConfirmHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                        } else {
                            allChaptersList(statusUrl)
                            setReloadAllData("Deleted");
                            return MySwal.fire('', 'The ' + chapter_title + ' is Deleted', 'success');
                            // window. location. reload() 
                            //  MySwal.fire('', MESSAGES.INFO.CLIENT_DELETED, 'success');

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
                            console.log('Error', error.message);
                            hideLoader();
                        }
                    });
            } else {
            }
        });
    };





    function restoreChapter(chapter_id, chapter_title) {
        console.log("chapter_id", chapter_id);
        var data = {
            "chapter_id": chapter_id,
            "chapter_status": 'Active'
        }

        const sweetConfirmHandler = () => {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
                title: 'Are you sure?',
                text: 'Confirm to Restore ' + chapter_title + ' Chapter',
                type: 'warning',
                showCloseButton: true,
                showCancelButton: true
            }).then((willDelete) => {
                if (willDelete.value) {
                    axios
                        .post(dynamicUrl.toggleChapterStatus, { data: data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
                        .then((response) => {
                            if (response.Error) {
                                hideLoader();
                                sweetConfirmHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                            } else {
                                allChaptersList(statusUrl)
                                setReloadAllData("Deleted");
                                return MySwal.fire('', 'The ' + chapter_title + ' is Restored', 'success');
                                // window. location. reload() 
                                //  MySwal.fire('', MESSAGES.INFO.CLIENT_DELETED, 'success');
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


    const allChaptersList = (chapterStatus) => {
        setIsLoading(true);
        axios.post(dynamicUrl.fetchAllChapters, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                let dataResponse = response.data.Items
                let finalDataArray = [];

                if (chapterStatus === 'Active') {
                    let ActiveresultData = (dataResponse && dataResponse.filter(e => e.chapter_status === 'Active'))
                    console.log("ActiveresultData", ActiveresultData);

                    for (let index = 0; index < ActiveresultData.length; index++) {
                        ActiveresultData[index].index_no = index + 1;
                        ActiveresultData[index]['actions'] = (
                            <>
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        // onClick={(e) => history.push(`/admin-portal/editChapter/${ActiveresultData[index].chapter_id}`)}
                                        onClick={(e) => {
                                            setChapterId(ActiveresultData[index].chapter_id);
                                            setOpenEditChapter(true)
                                        }}
                                    >
                                        <i className="feather icon-edit" /> &nbsp; Edit
                                    </Button>
                                    &nbsp;
                                    {/* if(resultData[index].chapter_status=='Active') */}
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-danger"
                                        onClick={(e) => deleteChapter(ActiveresultData[index].chapter_id, ActiveresultData[index].chapter_title)}
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
                    let resultData = (dataResponse && dataResponse.filter(e => e.chapter_status === 'Archived'))
                    for (let index = 0; index < resultData.length; index++) {
                        resultData[index].index_no = index + 1;
                        resultData[index]['actions'] = (
                            <>
                                <>
                                    <Button
                                        size="sm"
                                        className="btn btn-icon btn-rounded btn-primary"
                                        onClick={(e) => restoreChapter(resultData[index].chapter_id, resultData[index].chapter_title)}
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
                setChapterData(finalDataArray);
                console.log('resultData: ', finalDataArray);
                setIsLoading(false);

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
            })
    }

    useEffect(() => {

        if (pageLocation) {
            console.log("--", pageLocation);
            const url = pageLocation === "active-chapter" ? 'Active' : 'Archived';
            setStatusUrl(url)
            allChaptersList(url);
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
                            chapterData.length <= 0 ? (
                                <>
                                    < React.Fragment >
                                        <div>

                                            <h3 style={{ textAlign: 'center' }}>No Chapter Found</h3>
                                            <div className="form-group fill text-center">
                                                <br></br>
                                                <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={(e) => { handleAddChapter(e) }}>
                                                    <i className="feather icon-plus" /> Add Chapter
                                                </Button>
                                            </div>
                                        </div>
                                        <Modal dialogClassName="my-modal" show={isOpenAddChapter} onHide={() => setOpenAddChapter(false)}>
                                            <Modal.Header closeButton>
                                                <Modal.Title as="h5">Add Chapter</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <AddChapter setOpenAddChapter={setOpenAddChapter} />
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
                                                        <Card.Title as="h5">Chapters List</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Table columns={columns} data={chapterData} />
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Modal dialogClassName="my-modal" show={isOpenEditChapter} onHide={() => setOpenEditChapter(false)}>
                                            <Modal.Header closeButton>
                                                <Modal.Title as="h5">Edit Chapter</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <EditChapter setOpenEditChapter={setOpenEditChapter} chapterId={chapterId} />
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
export default ChaptersListChild;
