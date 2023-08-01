import React, { useState, useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useLocation, useHistory } from 'react-router-dom';
import { userRolesArray } from '../../../../helper/constants';
import UserTableView from './UserTableView';
import UserTableViewStudent from './UserTableViewStudent';
import dynamicUrl from '../../../../helper/dynamicUrls';
import axios from 'axios';

const ListUsers = () => {
    const history = useHistory();
    const [state, setState] = useState(false);
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [data, setData] = useState(null);

    useEffect(() => {
        const validateJWT = sessionStorage.getItem('user_jwt');

        if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

        }
        else {

            let storeValue = pageLocation === 'active-users' ? 'Active Users' : 'Archived Users';
            sessionStorage.setItem('user_type', storeValue);
            setState(true);
        }
    }, [])

    useEffect(() => {
        axios
            .post(
                dynamicUrl.usersPagination,
                {
                    data: {

                        page_size: "5/10/20/50",

                        user: "Teacher/Parent/Student",

                        // start_key: null / lastKey,

                        searchedKeyword: "soh"

                    }
                },
                {
                    headers: { Authorization: sessionStorage.getItem("user_jwt") },
                }
            )
            .then((response) => {
                let result = response.status === 200;
                console.log(result)

                // if (result) {
                //     console.log("inside res fetchDigicardAndConcept");

                //     let responseData = response.data;
                //     console.log(responseData);
                //     // setDisableButton(false);
                //     hideLoader();
                //     _setRelatedConcepts(responseData.conceptList);
                //     _setDigicards(responseData.digicardList);
                // } else {
                //     console.log("else res");

                //     hideLoader();
                // }
            })
            .catch((error) => {
                // if (error.response) {
                //     hideLoader();
                //     // Request made and server responded
                //     console.log(error.response.data);

                //     if (error.response.data === "Invalid Token") {
                //         sessionStorage.clear();
                //         localStorage.clear();

                //         history.push("/auth/signin-1");
                //         window.location.reload();
                //     } else {
                //         sweetAlertHandler({
                //             title: "Error",
                //             type: "error",
                //             text: error.response.data,
                //         });
                //     }
                // } else if (error.request) {
                //     // The request was made but no response was received
                //     console.log(error.request);
                //     hideLoader();
                // } else {
                //     // Something happened in setting up the request that triggered an Error
                //     console.log("Error", error.message);
                //     hideLoader();
                // }
            });
    }, []);

    const [_userRole, _setUserRole] = useState('Teachers');

    const handleUserChange = (key) => {

        if (key === '1') {
            _setUserRole('Teachers');
        }
        else if (key === '2') {
            _setUserRole('Students');
        }
        else if (key === '3') {
            _setUserRole('Parents');
        } else {
            console.log("Invalid option!");
        }
    }

    return (
        <>
            {state && (
                <>
                    <Tabs
                        defaultActiveKey={0}
                        onSelect={handleUserChange}
                        className="mb-3"
                    >
                        {userRolesArray.map((userRole, userRoleIndex) => {

                            return userRole === "Students" ? <Tab eventKey={userRoleIndex} title={userRole} >
                                {sessionStorage.setItem('user_role', userRole)}
                                <UserTableViewStudent
                                    _userRole={userRole}

                                />
                            </Tab>
                                :
                                <Tab eventKey={userRoleIndex} title={userRole} >
                                    {sessionStorage.setItem('user_role', userRole)}
                                    <UserTableView _userRole={userRole} />
                                </Tab>
                        })}
                        {/* <Tab eventKey={1} title="Teachers" >
                            {sessionStorage.setItem('user_role', _userRole)}
                            <UserTableView _userRole={_userRole} />
                        </Tab>
                        <Tab eventKey={2} title="Students">
                            {sessionStorage.setItem('user_role', _userRole)}
                            <UserTableViewStudent _userRole={_userRole} />
                        </Tab>
                        <Tab eventKey={3} title="Parents">
                            {sessionStorage.setItem('user_role', _userRole)}
                            <UserTableView _userRole={_userRole} />
                        </Tab> */}
                    </Tabs>
                </>
            )}
        </>

    );
};

export default ListUsers;