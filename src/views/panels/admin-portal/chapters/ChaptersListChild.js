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

import { useHistory } from 'react-router-dom';
import { SessionStorage } from '../../../../util/SessionStorage';
import MESSAGES from '../../../../helper/messages';
import useFullPageLoader from '../../../../helper/useFullPageLoader';



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
                    entries
                </Col>

                <Col className="d-flex justify-content-end">
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                    <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={() => { addingChapter() }}>
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

        </>
    );
}

const ChaptersListChild = (props) => {
    const { _data } = props

    var i=1;
    console.log('_data: ', _data);
    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor:"index_no"
            },
            {
                Header: ' DigiCard Title',
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
    const [digiCardData, setDigiCardData] = useState([]);
  const [reloadAllData, setReloadAllData] = useState('Fetched');
  const [loader, showLoader, hideLoader] = useFullPageLoader();

    // console.log('data: ', data)

    let history = useHistory();

    function deleteChapter(chapter_id, chapter_title) {
      console.log("chapter_id", chapter_id);
      var data = {
        "chapter_id": chapter_id
      }
  
      const sweetConfirmHandler = () => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: 'Are you sure?',
          text: 'Confirm deleting ' + chapter_title + ' Chapter',
          type: 'warning',
          showCloseButton: true,
          showCancelButton: true
        }).then((willDelete) => {
          if (willDelete.value) {
            axios
              .post(dynamicUrl.deleteChapter, { data: data }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
              .then((response) => {
                if (response.Error) {
                  hideLoader();
                  sweetConfirmHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
                } else {
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
            return MySwal.fire('', 'Chapter is safe!', 'error');
          }
        });
      };
      sweetConfirmHandler();
  
    }


    const allChaptersList = () => {
        console.log("School data func called");
        let resultData = _data && _data;
        console.log('resultData', resultData);
        let finalDataArray = [];
        for (let index = 0; index < resultData.length; index++) {
            resultData[index].index_no = index + 1;
            resultData[index]['actions'] = (
                <>
                    <>
                        <Button
                            size="sm"
                            className="btn btn-icon btn-rounded btn-primary"
                            onClick={(e) => history.push(`/admin-portal/editChapter/${resultData[index].chapter_id}`)}
                        >
                            <i className="feather icon-edit" /> &nbsp; Edit
                        </Button>
                        &nbsp;
                        {/* if(resultData[index].chapter_status=='Active') */}
                        <Button
                            size="sm"
                            className="btn btn-icon btn-rounded btn-danger"
                            onClick={(e) => deleteChapter(resultData[index].chapter_id , resultData[index].chapter_title)}
                        >
                            <i className="feather icon-trash-2 " /> &nbsp; Delete
                        </Button>
                        &nbsp;
                    </>
                </>
            );
            finalDataArray.push(resultData[index]);

        }
        console.log('finalDataArray: ', finalDataArray);
        setDigiCardData(finalDataArray)
    }

    useEffect(() => {
        allChaptersList();
    }, [_data])

    useEffect(()=>{

    },[reloadAllData])

    return  (
        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">DigiCard List</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Table columns={columns} data={digiCardData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


        </React.Fragment>
    );
};
export default ChaptersListChild;
