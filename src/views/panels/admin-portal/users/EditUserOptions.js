import React, { useEffect } from 'react';
import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import BasicSpinner from '../../../../helper/BasicSpinner';
import EditUsersGeneral from './EditUsersGeneral';
import AllocateClass from './AllocateClass';
import AllocateSubjects from './AllocateSubjects';
import EditUsersGeneralStudent from './EditUsersGeneralStudent';

const SectionAdd = () => {
    const history = useHistory();
    const [_data, _setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const threadLinks = document.getElementsByClassName('page-header');
    const [displayHeader, setDisplayHeader] = useState(true);

    const { user_id, user_role, schoolId } = useParams();
    console.log(user_id, user_role, schoolId);

    const handleUserChange = (key) => {

        if (key === '1') {
        }
        else if (key === '2') {
        }
        else if (key === '3') {
        } else {
            console.log("Invalid option!");
        }
    }

    useEffect(() => {

        const validateJWT = sessionStorage.getItem('user_jwt');

        if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

        } else {
            
            if (threadLinks.length === 2) {
                setDisplayHeader(false);
            } else {
                setDisplayHeader(true);
            }
        }
    }, [])

    return (
        <div>
            {isLoading ? <BasicSpinner /> : (
                <React.Fragment>

                    {
                        displayHeader && (
                            <div className="page-header">
                                <div className="page-block">
                                    <div className="row align-items-center">
                                        <div className="col-md-12">
                                            <div className="page-header-title">
                                                <h5 className="m-b-10">{sessionStorage.getItem('user_type')}</h5>
                                            </div><ul className="breadcrumb  ">
                                                <li className="breadcrumb-item  ">
                                                    <a href="/upschool/admin-portal/admin-dashboard">
                                                        <i className="feather icon-home">
                                                        </i>
                                                    </a>
                                                </li>
                                                <li className="breadcrumb-item  ">Users</li>
                                                <li className="breadcrumb-item  ">{sessionStorage.getItem('user_type')}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        user_role === 'Teacher' && (
                            <Tabs
                                onSelect={handleUserChange}
                                defaultActiveKey={1}
                                className="mb-3"
                            >
                                <Tab eventKey={1} title="General" >
                                    <EditUsersGeneral user_id={user_id} user_role={user_role} />
                                </Tab>
                                <Tab eventKey={2} title="Allocate Class">
                                    <AllocateClass schoolId={schoolId} user_id={user_id} />
                                </Tab>
                                <Tab eventKey={3} title="Allocate Subjects">
                                    <AllocateSubjects schoolId={schoolId} user_id={user_id} />
                                </Tab>
                            </Tabs>
                        )
                    }

                    {
                        user_role === 'Student' && (
                            <Tabs
                                onSelect={handleUserChange}
                                defaultActiveKey={1}
                                className="mb-3"
                            >
                                <Tab eventKey={1} title="General" >
                                    <EditUsersGeneralStudent user_id={user_id} user_role={user_role} />
                                </Tab>
                            </Tabs>
                        )
                    }

                    {
                        user_role === 'Parent' && (
                            <Tabs
                                onSelect={handleUserChange}
                                defaultActiveKey={1}
                                className="mb-3"
                            >
                                <Tab eventKey={1} title="General" >
                                    <EditUsersGeneral user_id={user_id} user_role={user_role} />
                                </Tab>
                            </Tabs>
                        )
                    }

                </React.Fragment>
            )}
        </div>
    )
}

export default SectionAdd