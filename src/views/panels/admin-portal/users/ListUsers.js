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
    const [dataFromChild, setDataFromChild] = useState({});
    // const [startKey, setStartKey] = useState(null)
    const [startKeys, setStartKeys] = useState({
        Teachers: null,
        Students: null,
        Parents: null,
    });

    const [_userRole, _setUserRole] = useState('Teachers');
    const setStartKeyForUserRole = (userRole, key) => {
        setStartKeys((prevStartKeys) => ({
            ...prevStartKeys,
            [userRole]: key,
        }));
    };

    const handleUserChange = (key) => {
        console.log("KEY ====================================== : ", key);
        console.log("USER ROLE : ============================== ", _userRole);
        // setStartKey(null);
        if (key === '1') {
            _setUserRole('Teachers');
            UsePaginationApi()
        }
        else if (key === '2') {
            _setUserRole('Students');
            UsePaginationApi()
        }
        else if (key === '3') {
            _setUserRole('Parents');
            UsePaginationApi()
        } else {
            console.log("Invalid option!");
        }
    }
    console.log("dataFromChild", dataFromChild)

    const handleDataFromParent = (data) => {
        console.log('Data received in GrandParent:', data);
        setDataFromChild(data);
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

            let storeValue = pageLocation === 'active-users' ? 'Active Users' : 'Archived Users';
            sessionStorage.setItem('user_type', storeValue);
            setState(true);
        }
        if (dataFromChild !== {}) {
            UsePaginationApi()
        }
    }, [dataFromChild, _userRole])




    // const UsePaginationApi = () => {
    //     console.log("USER ROLE : ", _userRole);
    //     console.log("START KEY : ", startKey);

    //     console.log('dataFromChild', dataFromChild);
    //     console.log("dataFromChild.user : ", dataFromChild.user);
    //     axios.post(
    //         dynamicUrl.usersPagination,
    //         {
    //             data: {
    //                 page_size: dataFromChild.page_size,
    //                 user: _userRole,
    //                 // user: dataFromChild.user,

    //                 start_key: startKey,
    //                 searchedKeyword: dataFromChild.searchedKeyword,
    //             }
    //         },

    //         {
    //             headers: { Authorization: sessionStorage.getItem("user_jwt") },
    //         }
    //     )

    //         .then((response) => {
    //             let result = response.status === 200;
    //             if (result) {
    //                 console.log("userresult", response.data.Items.length)
    //                 setStartKey(response.data.lastKey)
    //             } else {
    //                 // Throw Error : 
    //                 alert(response.error)
    //             }

    //         })
    //         .catch((error) => {
    //             // alert(error)
    //             console.log(error)
    //         });
    // }
    const UsePaginationApi = () => {
        console.log("USER ROLE : ", _userRole);
        console.log("START KEY : ", startKeys[_userRole]); // Use the start key specific to the current user role

        // ... (existing code)

        axios
            .post(
                dynamicUrl.usersPagination,
                {
                    data: {
                        page_size: dataFromChild.page_size,
                        user: dataFromChild.user,
                        start_key: startKeys[_userRole], // Use the start key specific to the current user role
                        searchedKeyword: dataFromChild.searchedKeyword,
                    },
                },
                {
                    headers: { Authorization: sessionStorage.getItem("user_jwt") },
                }
            )
            .then((response) => {
                let result = response.status === 200;
                if (result) {
                    console.log("userresult", response.data.Items.length);
                    setStartKeyForUserRole(_userRole, response.data.lastKey); // Set the start key for the current user role
                } else {
                    // Throw Error :
                    alert(response.error);
                }
            })
            .catch((error) => {
                // alert(error)
                console.log(error);
            });
    };



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

                            return userRole === "Students" ?

                                <Tab key={userRoleIndex} eventKey={userRoleIndex} title={userRole} >
                                    {sessionStorage.setItem('user_role', userRole)}
                                    <UserTableViewStudent
                                        _userRole={userRole}
                                        sendDataToGrandParent={handleDataFromParent}

                                    />
                                </Tab>
                                :
                                <Tab key={userRoleIndex} eventKey={userRoleIndex} title={userRole} >
                                    {sessionStorage.setItem('user_role', userRole)}
                                    <UserTableView
                                        _userRole={userRole}
                                        sendDataToGrandParent={handleDataFromParent}


                                    />
                                </Tab>
                        })}

                    </Tabs>
                </>
            )}
        </>

    );
};

export default ListUsers;