

import React, { useState, useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from 'axios';

import UserTableView from '../../../common-ui-components/tables/UserTableView';
import dynamicUrl from '../../../../helper/dynamicUrls';

const ListUsers = () => {

    const [_data, _setData] = useState([]);
    const [teachersData, setTeachersData] = useState([]);
    const [studentsData, setStudentsData] = useState([]);
    const [parentsData, setParentsData] = useState([]);

    const fetchAllUsersData = () => {

        axios.post(dynamicUrl.fetchAllUsersData, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                
                let resultData = response.data.Items;
                setTeachersData(resultData && resultData.filter(p => p.user_role === 'Teacher'))
                setStudentsData(resultData && resultData.filter(p => p.user_role === 'Student'))
                setParentsData(resultData && resultData.filter(p => p.user_role === 'Parent'))
                _setData(resultData && resultData.filter(p => p.user_role === 'Teacher'))


            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchAllUsersData();
    }, []);

    const handleUserChange = (key) => {

        if (key === '1') {
            _setData(teachersData)
        }
        else if (key === '2') {
            _setData(studentsData)
        }
        else {
            _setData(parentsData)
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
                    <UserTableView _data={_data} />
                </Tab>
                <Tab eventKey={2} title="Students">
                    <UserTableView _data={_data} />
                </Tab>
                <Tab eventKey={3} title="Parents">
                    <UserTableView _data={_data} />
                </Tab>
            </Tabs>
        </>
    );
};

export default ListUsers;

