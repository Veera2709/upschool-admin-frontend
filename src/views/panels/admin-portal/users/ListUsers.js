

import React, { useState, useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useLocation, useHistory } from 'react-router-dom';
import UserTableView from './UserTableView';

const ListUsers = () => {
    const history = useHistory();
    const [state, setState] = useState(false);
    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);

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
            )}
        </>

    );
};

export default ListUsers;