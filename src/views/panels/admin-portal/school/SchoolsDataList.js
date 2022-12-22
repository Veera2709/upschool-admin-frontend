
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Row, Col, Card, Pagination, Button, Modal, Alert } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { SessionStorage } from '../../../../util/SessionStorage';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import MESSAGES from './../../../../helper/messages';
import { isEmptyArray, decodeJWT } from '../../../../util/utils';

import { GlobalFilter } from './GlobalFilter';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import dynamicUrl from '../../../../helper/dynamicUrls';


export const colourOptions = [
    { value: 'Education', label: 'Education', color: 'black' },
    { value: 'Address', label: 'Address', color: 'black' },
    { value: 'Employment', label: 'Employment', color: 'black' },
    { value: 'DatabaseCheck', label: 'DatabaseCheck', color: 'black', isFixed: true },
    { value: 'DrugTest', label: 'DrugTest', color: 'black' },
    { value: 'CreditCheck', label: 'CreditCheck', color: 'black' },
    { value: 'Criminal', label: 'Criminal', color: 'black', isFixed: true },
    { value: 'Identification', label: 'Identification', color: 'black' },
    { value: 'Reference', label: 'Reference', color: 'black' },
    { value: 'GapVerification', label: 'GapVerification', color: 'black' },
    { value: 'SocialMedia', label: 'SocialMedia', color: 'black' },
    { value: 'PoliceVerification', label: 'PoliceVerification', color: 'black' },
    { value: 'CompanyCheck', label: 'CompanyCheck', color: 'black' },
    { value: 'DirectorshipCheck', label: 'DirectorshipCheck', color: 'black' },
    { value: 'CvValidation', label: 'CvValidation', color: 'black' }
];

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

    // const saveSchoolIdDelete = (e, school_id, updateStatusSch) => {
    //     e.preventDefault();

    //     pageLocation === 'active-schools' ? (
    //         sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_RECOVER }, school_id, updateStatusSch)
    //     ) : (
    //         sweetConfirmHandler({ title: MESSAGES.TTTLES.AreYouSure, type: 'warning', text: MESSAGES.INFO.ABLE_TO_DELETE }, school_id, updateStatusSch)
    //     )

    // };


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
                    {/* <Button variant="success" className="btn-sm btn-round has-ripple ml-2" onClick={modalOpen}>
            <i className="feather icon-plus" /> Add User
          </Button> */}

                    <Link to={'/admin-portal/active-schools'}>
                        <Button variant="success" className="btn-sm btn-round has-ripple ml-2">
                            {/* onClick={(e) => saveUserIdDelete(e, userId, responseData[index].user_role, 'Active')} */}
                            <i className="feather icon-plus" /> Add School
                        </Button>

                    </Link>
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




const SchoolsDataList = (props) => {

    const { _data } = props;

    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor: 'school_avatar'
            },
            {
                Header: 'School Name',
                accessor: 'school_name'
            },
            {
                Header: 'Phone Number',
                accessor: 'phone_number'
            },
            {
                Header: 'city',
                accessor: 'city'
            },
            {
                Header: 'Options',
                accessor: 'actions'
            }
        ],
        []
    );

    const handleRestoreSchool = (e, school_id, Archieved) => {
        e.preventDefault();

        const value = {
            school_id: school_id,
            school_status: Archieved
        };

        console.log(value);
        const MySwal = withReactContent(Swal);
        //     MySwal.fire({
        //         title: 'Are you sure?',
        //         text: 'Once deleted, you will not be able to recover!',
        //         type: 'warning',
        //         showCloseButton: true,
        //         showCancelButton: true
        //     }).then((willDelete) => {
        //         if (willDelete.value))
        // }






        axios
            .post(
                dynamicUrl.toggleSchoolStatus,
                {
                    data: {
                        school_id: school_id,
                        school_status: Archieved
                    }
                },
                {
                    headers: { Authorization: sessionStorage.getItem('user_jwt') }
                }
            )
            .then(async (response) => {
                let responseData = response.status === 200;
                if (response.Error) {
                    hideLoader();
                    sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });

                    window.location.reload();

                } else {
                    sweetAlertHandler({ title: '', type: 'success', text: MESSAGES.SUCCESS.RestoredSuccessfully });
                    hideLoader();
                    window.location.reload();
                }
            })

            .catch((error) => {
                if (error.response) {
                    // Request made and server responded
                    hideLoader();
                    console.log(error.response.data);
                    sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
                } else if (error.request) {
                    // The request was made but no response was received
                    hideLoader();
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    hideLoader();
                    console.log('Error', error.message);
                }
            });
    };

    const _fetchSchoolData = () => {
        let resultData = _data && _data;
        console.log("RESULT DATA : ", resultData);
        let finalDataArray = [];
        for (let index = 0; index < resultData.length; index++) {
            console.log('status: ', resultData[index]['school_status'])
            resultData[index]['school_avatar'] = <img className='img-fluid img-radius wid-50 circle-image' src={resultData[index].school_logoURL} alt="school_image" />
            resultData[index]['school_name'] = <p>{resultData[index].school_name}</p>
            resultData[index]['phone_number'] = <p>{resultData[index].school_contact_info.business_address.phone_no}</p>
            resultData[index]['city'] = <p>{resultData[index].school_contact_info.business_address.city}</p>
            // resultData[index]['subscription_active'] = <p>{resultData[index].subscription_active}</p>
            resultData[index]['actions'] = (
                <>
                    <Button onClick={(e) => { handleRestoreSchool(e, resultData[index].school_id, 'Active') }}
                        size="sm" className="btn btn-icon btn-rounded btn-primary"
                    >

                        <i className="feather icon-plus" /> &nbsp;Restore
                    </Button>

                </>
            );
            finalDataArray.push(resultData[index]);

        }
        console.log('finalDataArray: ', finalDataArray);
        setSchoolData(finalDataArray)
    }

    useEffect(() => {
        _fetchSchoolData();
    }, [_data])

    // const data = React.useMemo(() => makeData(50), []);

    const [userData, setUserData] = useState([]);
    const [schoolData, setSchoolData] = useState([]);
    const [individualUserData, setIndividualUserData] = useState([]);
    const [userDOB, setUserDOB] = useState('');
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [className_ID, setClassName_ID] = useState({});
    const [schoolName_ID, setSchoolName_ID] = useState({});
    const [previousSchool, setPreviousSchool] = useState('');
    const [previousClass, setPreviousClass] = useState('');
    const [_userID, _setUserID] = useState('');

    const [isOpen, setIsOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [validationObj, setValidationObj] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const { user_id } = decodeJWT(sessionStorage.getItem('user_jwt'));
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [selectClassErr, setSelectClassErr] = useState(false);

    const classNameRef = useRef('');
    const schoolNameRef = useRef('');

    const phoneRegExp = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;

    const MySwal = withReactContent(Swal);

    const sweetAlertHandler = (alert) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            icon: alert.type
        });
    };

    const sweetConfirmHandler = (alert, school_id, school_Status) => {
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type,
            showCloseButton: true,
            showCancelButton: true
        }).then((willDelete) => {
            if (willDelete.value) {
                showLoader();
                // deleteUser(user_id, user_role, updateStatus);
            } else {

                const returnValue = pageLocation === 'active-users' ? (
                    MySwal.fire('', MESSAGES.INFO.DATA_SAFE, 'success')
                ) : (
                    MySwal.fire('', MESSAGES.INFO.FAILED_TO_RESTORE, 'error')
                )
                return returnValue;
            }
        });
    };

    const saveSchoolId = (e, school_id) => {
        e.preventDefault();
        // getIndividualUser(user_id, user_role);
        showLoader();
    };



    return (
        <div>
            {schoolData.length <= 0 ? (
                <div>
                    <h3 style={{ textAlign: 'center' }}>No Archived Schools Found</h3>
                </div>
            ) : (
                <>
                    <Row>
                        <Col sm={12}>
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h5">Archived List</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Table columns={columns} data={schoolData} />
                                </Card.Body>
                            </Card>

                        </Col>
                    </Row>
                </>
            )
            }

        </div>
    );
};

export default SchoolsDataList;