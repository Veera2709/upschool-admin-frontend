import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Row, Col, Card, Pagination, Button } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import axios from 'axios';
import Swal from 'sweetalert2';

import { SessionStorage } from '../../../../util/SessionStorage';
import withReactContent from 'sweetalert2-react-content';
import MESSAGES from '../../../../helper/messages';
import { decodeJWT } from '../../../../util/utils';
import { GlobalFilter } from '../../../common-ui-components/tables/GlobalFilter';
import { useTable, useSortBy, usePagination, useGlobalFilter,useRowSelect } from 'react-table';
import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import BasicSpinner from '../../../../helper/BasicSpinner';
import {toggleMultipleGroupStatus} from '../../../api/CommonApi'

function Table({ columns, data, modalOpen }) {
    const initiallySelectedRows = React.useMemo(() => new Set(["1"]), []);
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const payLoadStatus = pageLocation === "active-groups" ? 'Active' : 'Archived';
    const MySwal = withReactContent(Swal);
    let history = useHistory();

    const IndeterminateCheckbox = React.forwardRef(
        ({ indeterminate, ...rest }, ref) => {
            const defaultRef = React.useRef();
            const resolvedRef = ref || defaultRef;

            React.useEffect(() => {
                resolvedRef.current.indeterminate = indeterminate;
            }, [resolvedRef, indeterminate]);

            return (
                <>
                    <input type="checkbox" ref={resolvedRef} {...rest} />
                </>
            );
        }
    );

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
        selectedFlatRows,
        state: { pageIndex, pageSize,selectedRowPaths}
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10,selectedRowPaths: initiallySelectedRows }
        },
        useGlobalFilter,
        useSortBy,
        usePagination, useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                {
                    id: "selection",
                    Header: ({ getToggleAllPageRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
                        </div>
                    ),
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    )
                },
                ...columns
            ]);
        }
    );

    const multiDelete = async(status)=>{
        console.log("selectedFlatRows",selectedFlatRows);
        const groupIds = [];
        selectedFlatRows.map((item) => {
            groupIds.push(item.original.group_id)
        })
        if (groupIds.length > 0) {
            var payload = {
                "group_status": status,
                "group_array": groupIds
            }

            const ResultData = await toggleMultipleGroupStatus(payload)
            if (ResultData.Error) {
                if (ResultData.Error.response.data == 'Invalid Token') {
                    sessionStorage.clear();
                    localStorage.clear();
                    history.push('/auth/signin-1');
                    window.location.reload();
                } else {
                    return MySwal.fire('Error', ResultData.Error.response.data, 'error').then(() => {
                        window.location.reload();
                    });
                }
            } else {
                return MySwal.fire('success', `Groups have been ${status === 'Active' ? 'Restored' : "Deleted"} Successfully`, 'success').then(() => {
                    window.location.reload();
                });
            }
        } else {
            return MySwal.fire('Sorry', 'No Chapters Selected!', 'warning').then(() => {
                // window.location.reload();
            });
        }
    }

    const addingGroup = () =>{
        history.push('/admin-portal/add-groups')
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
                <Col className="mb-3" style={{ display: 'contents' }}>
                    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                        <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={(e)=>{addingGroup()}}>
                            <i className="feather icon-plus" /> Add Groups
                        </Button>
                    {payLoadStatus === 'Active' ? (
                        <Button variant="success" className='btn-sm btn-round has-ripple ml-2 btn btn-danger'
                            onClick={() => { multiDelete("Archived") }}
                            style={{ marginRight: '15px' }}
                        >
                            <i className="feather icon-trash-2" />  Multi Delete
                        </Button>
                    ) : (
                        <Button className='btn-sm btn-round has-ripple ml-2 btn btn-primary'
                            onClick={() => { multiDelete("Active") }}
                            style={{ marginRight: '15px' }}
                        >
                            <i className="feather icon-plus" />   Multi Restore
                        </Button>
                    )}
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
                                    {// Add a sort direction indicator //
                                    }
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
                            className="form-control ml-2"
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                gotoPage(page);
                            }}
                            onWheel={(e) => e.target.blur()}
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

const GroupsTableView = ({ _groupType }) => {

    const columns = React.useMemo(() => [
        {
            Header: '#',
            accessor: 'id'
        },
        {
            Header: 'Group',
            accessor: 'group_name'
        },
        {
            Header: 'Levels',
            accessor: 'group_levels'
        },
        {
            Header: 'Options',
            accessor: 'action'
        }
    ], []);

    const history = useHistory();
    const [groupData, setGroupData] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [_groupID, _setGroupID] = useState('');

    const [isOpen, setIsOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const { user_id } = decodeJWT(sessionStorage.getItem('user_jwt'));
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [_data, _setData] = useState([]);

    const [levelsDropdown, setLevelsDropdown] = useState([
        { value: 'Level_1', label: 'Level-1' },
        { value: 'Level_2', label: 'Level-2' },
        { value: 'Level_3', label: 'Level-3' }
    ]);

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const sweetConfirmHandler = (alert, group_id, updateStatus) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type,
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                showLoader();
                deleteGroup(group_id, updateStatus);
            }
        });
    };


    const saveGroupIdDelete = (e, group_id, updateStatus) => {
        e.preventDefault();

        pageLocation === 'active-groups' ? (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, group_id, updateStatus)
        ) : (
            sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: 'This will restore the group!' }, group_id, updateStatus)
        )

    };


    const deleteGroup = (group_id, updateStatus) => {
        const values = {
            group_id: group_id,
            group_status: updateStatus
        };

        console.log(values);

        axios
            .post(dynamicUrl.toggleGroupStatus,
                {
                    data: {
                        group_id: group_id,
                        group_status: updateStatus
                    }
                }, { headers: { Authorization: SessionStorage.getItem('user_jwt') } })
            .then(async (response) => {
                if (response.Error) {
                    hideLoader();
                    sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingGroup });
                    fetchGroupsData();


                } else {

                    hideLoader();

                    updateStatus === 'Active' ? (

                        MySwal.fire('', MESSAGES.INFO.GROUP_RESTORED, 'success')

                    ) : (
                        MySwal.fire('', MESSAGES.INFO.GROUP_DELETED, 'success')
                    )

                    fetchGroupsData();

                }
            })
            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    hideLoader();
                    console.log(error.response.data);

                    if (error.response.data === 'Invalid Token') {

                        sessionStorage.clear();
                        localStorage.clear();

                        history.push('/auth/signin-1');
                        window.location.reload();

                    } else {

                        sweetAlertHandler({ title: 'Sorry', type: 'warning', text: error.response.data });
                        fetchGroupsData();
                    }


                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                    fetchGroupsData();

                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                    fetchGroupsData();

                }
            });
    };

    const openHandler = () => {
        setIsOpen(true);
    };

    const updateValues = (_data) => {
        let responseData = _data;
        // let responseData = [];

        console.log("responseData", responseData);

        let finalDataArray = [];
        let levelNames;

        for (let index = 0; index < responseData.length; index++) {

            responseData[index].id = index + 1;

            levelNames = responseData[index]['group_levels'];

            responseData[index]['group_levels'] = (
                <>
                    {
                        levelNames.map((form, index) => {
                            return (
                                <>
                                    &nbsp;
                                    <span
                                        style={{ backgroundColor: "cadetblue" }}
                                        className="badge badge-warning inline-block mr-1"
                                    >{levelsDropdown.filter(p => p.value === form)[0].label}</span>
                                </>
                            );
                        })
                    }
                </>
            );

            responseData[index]['action'] = (
                <>

                    {pageLocation === 'active-groups' ? (

                        <>
                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-info"
                                onClick={(e) => history.push(`/admin-portal/edit-groups/${responseData[index].group_id}`)}
                            >
                                <i className="feather icon-edit" /> &nbsp; Edit
                            </Button>{' '}

                            &nbsp;
                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-danger"
                                onClick={(e) => saveGroupIdDelete(e, responseData[index].group_id, 'Archived')}
                            >
                                <i className="feather icon-trash-2" /> &nbsp;Delete
                            </Button>
                        </>

                    ) : (

                        <>

                            <Button
                                size="sm"
                                className="btn btn-icon btn-rounded btn-primary"
                                onClick={(e) => saveGroupIdDelete(e, responseData[index].group_id, 'Active')}
                            >
                                <i className="feather icon-plus" /> &nbsp;Restore
                            </Button>
                        </>

                    )
                    }

                </>
            );
            finalDataArray.push(responseData[index]);
        }

        setGroupData(finalDataArray);
        setIsLoading(false);
    }

    const fetchGroupsData = () => {

        setIsLoading(true);
        // showLoader();

        const payLoadStatus = pageLocation === "active-groups" ? 'Active' : 'Archived';

        axios.post(dynamicUrl.fetchAllGroupsData, {
            data: {
                group_type: _groupType,
                group_status: payLoadStatus
            }
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {

                let resultData = response.data.Items;
                console.log("resultData", resultData);

                if (resultData) {

                    setIsLoading(false);
                    updateValues(resultData);

                }

            })
            .catch((error) => {
                console.log(error.response.data);

                if (error.response.data === 'Invalid Token') {

                    sessionStorage.clear();
                    localStorage.clear();

                    history.push('/auth/signin-1');
                    window.location.reload();

                } else {

                    fetchGroupsData();
                }

            })

    };

    useEffect(() => {
        const validateJWT = sessionStorage.getItem('user_jwt');

        if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

        }
        else {
            fetchGroupsData();
        }

    }, [pageLocation]);

    useEffect(() => {
        const validateJWT = sessionStorage.getItem('user_jwt');

        if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

        }
        else {
            fetchGroupsData();
        }

    }, [_groupType]);

    return (

        <React.Fragment>
            <div>

                {isLoading ? (
                    <BasicSpinner />
                ) : (
                    <>

                        {
                            groupData.length <= 0 && _data ? (
                                <div>

                                    <h3 style={{ textAlign: 'center' }}>No {pageLocation === "active-groups" ? 'Active Groups' : 'Archived Groups'} Found</h3>
                                    <div className="form-group fill text-center">
                                        <br></br>
                                        {
                                            pageLocation === "active-groups" && (
                                                <Link to={'/admin-portal/add-groups'}>
                                                    <Button variant="success" className="btn-sm btn-round has-ripple ml-2">
                                                        <i className="feather icon-plus" /> Add Groups
                                                    </Button>
                                                </Link>

                                            )
                                        }

                                    </div>

                                </div>
                            ) : (

                                <>
                                    {_data && (

                                        <>

                                            < React.Fragment >
                                                <Row>
                                                    <Col sm={12}>
                                                        <Card>
                                                            <Card.Header>
                                                                <Card.Title as="h5">Groups List</Card.Title>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <Table columns={columns} data={groupData} modalOpen={openHandler} />
                                                            </Card.Body>
                                                        </Card>

                                                    </Col>
                                                </Row>
                                            </React.Fragment>
                                        </>
                                    )}

                                </>
                            )
                        }
                    </>
                )

                }



            </div >
            {loader}
        </React.Fragment>
    );
};

export default GroupsTableView;