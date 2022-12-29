

import React, { useState, useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useLocation } from 'react-router-dom';
import UserTableView from './UserTableView';

const ListUsers = () => {   

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
            <Tabs
                defaultActiveKey={1}
                onSelect={handleUserChange}
                className="mb-3"
            >

                <Tab eventKey={1} title="Teachers" >
                    {sessionStorage.setItem('user_role', _userRole)}
                    <UserTableView _userRole={_userRole} />
                </Tab>
                <Tab eventKey={2} title="Students">
                    {sessionStorage.setItem('user_role', _userRole)}
                    <UserTableView _userRole={_userRole} />
                </Tab>
                <Tab eventKey={3} title="Parents">
                    {sessionStorage.setItem('user_role', _userRole)}
                    <UserTableView _userRole={_userRole} />
                </Tab>
            </Tabs>
        </>

    );
};

export default ListUsers;