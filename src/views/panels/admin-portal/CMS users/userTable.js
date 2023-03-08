import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import UsersList from './usersList';

const UserTable = () => {

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

            let storeValue = pageLocation === 'active-upSchoolUsers' ? 'Active Users' : 'Archived Users';
            sessionStorage.setItem('upSchoolUsers_status', storeValue);
            setState(true);
        }
    }, [])


    const [_userType, _setUserType] = useState('admin');

    const handleQuestionStatusTab = (key) => {

        if (key === '1') {
            _setUserType('admin');
        }
        else if (key === '2') {
            _setUserType('creator');
        }
        else if (key === '3') {
            _setUserType('reviewer');
        }
        else if (key === '4') {
            _setUserType('publisher');
        }
        else {
            console.log("Invalid Tab Option!");
        }
    }

    return (
        <>
            {state && (
                <>
                    <Tabs
                        defaultActiveKey={1}
                        onSelect={handleQuestionStatusTab}
                        className="mb-3"
                    >
                        <Tab eventKey={1} title="Admin" >
                            {sessionStorage.setItem('user_type', _userType)}
                            <UsersList _userType={_userType} />
                        </Tab>
                        <Tab eventKey={2} title="Creator" >
                            {sessionStorage.setItem('user_type', _userType)}
                            <UsersList _userType={_userType} />
                        </Tab>
                        <Tab eventKey={3} title="Reviewer" >
                            {sessionStorage.setItem('user_type', _userType)}
                            <UsersList _userType={_userType} />
                        </Tab>
                        <Tab eventKey={4} title="Publisher" >
                            {sessionStorage.setItem('user_type', _userType)}
                            <UsersList _userType={_userType} />
                        </Tab>
                    </Tabs>
                </>
            )}
        </>

    );
};

export default UserTable;