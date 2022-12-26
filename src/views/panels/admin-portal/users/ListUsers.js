

import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from 'axios';

import UserTableView from './UserTableView';
import dynamicUrl from '../../../../helper/dynamicUrls';

const ListUsers = () => {

    const [pageLocation,    setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [pageURL, setPageURL] = useState('');
    const [userRole, setUserRole] = useState('Teachers');

    const [_data, _setData] = useState([]);
    const [teachersData, setTeachersData] = useState([]);
    const [studentsData, setStudentsData] = useState([]);
    const [parentsData, setParentsData] = useState([]);

    const fetchAllUsersData = async (url) => {

        return new Promise((resolve, reject) => {

            axios.post(url, {}, {
                headers: { Authorization: sessionStorage.getItem('user_jwt') }
            })
                .then((response) => {

                    let resultData = response.data.Items;

                    console.log("resultData", resultData);

                    setTeachersData(resultData && resultData.filter(p => p.user_role === 'Teacher'))
                    setStudentsData(resultData && resultData.filter(p => p.user_role === 'Student'))
                    setParentsData(resultData && resultData.filter(p => p.user_role === 'Parent'))
                    _setData(resultData && resultData.filter(p => p.user_role === 'Teacher'))

                    if (resultData) {

                        console.log("URL API");

                        if (userRole === "Teachers") {

                            _setData(teachersData)
                            resolve(teachersData);

                        } else if (userRole === "Students") {

                            console.log("SSSS");

                            _setData(studentsData)
                            resolve(studentsData);

                        } else if (userRole === "Parents") {
                            _setData(parentsData)
                            resolve(parentsData);

                        } else {

                            console.log("Invalid Option!");
                            resolve({ Error: _data });
                        }

                    }



                })
                .catch((err) => {
                    console.log(err);
                    resolve({ Error: err });
                })
        })
    }

    useEffect(() => {
        console.log(pageLocation);

        if (pageLocation) {

            const url = pageLocation === "active-users" ? dynamicUrl.fetchAllUsersData : dynamicUrl.fetchInactiveUsersData;
            setPageURL(url);
            fetchAllUsersData(url);

        }

    }, [pageLocation]);

    const handleUserChange = (key) => {

        if (key === '1') {
            setUserRole('Teachers');
            _setData(teachersData)
        }
        else if (key === '2') {
            setUserRole('Students');
            _setData(studentsData)
        }
        else if (key === '3') {
            setUserRole('Parents');
            _setData(parentsData)
        } else {
            console.log("Invalid option!");
        }
    }


    return (
        <>
            <Tabs
                defaultActiveKey={1}
                // id="uncontrolled-tab-example"
                onSelect={handleUserChange}
                className="mb-3"
            >
                <Tab eventKey={1} title="Teachers" >
                    {sessionStorage.setItem('user_role', userRole)}
                    <UserTableView _data={_data} fetchAllUsersData={fetchAllUsersData} pageURL={pageURL} />
                </Tab>
                <Tab eventKey={2} title="Students">
                    {sessionStorage.setItem('user_role', userRole)}
                    <UserTableView _data={_data} fetchAllUsersData={fetchAllUsersData} pageURL={pageURL} />
                </Tab>
                <Tab eventKey={3} title="Parents">
                    {sessionStorage.setItem('user_role', userRole)}
                    <UserTableView _data={_data} fetchAllUsersData={fetchAllUsersData} pageURL={pageURL} />
                </Tab>
            </Tabs>
        </>
    );
};

export default ListUsers;

