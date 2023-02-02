import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import GroupsTableView from './GroupsTableView';

const ListGroups = () => {

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

            let storeValue = pageLocation === 'active-groups' ? 'Active Groups' : 'Archived Groups';
            sessionStorage.setItem('group_status', storeValue);
            setState(true);
        }
    }, [])


    const [_groupType, _setGroupType] = useState('Basic');

    const handleQuestionStatusTab = (key) => {

        if (key === '1') {
            _setGroupType('Basic');
        }
        else if (key === '2') {
            _setGroupType('Intermediate');
        }
        else if (key === '3') {
            _setGroupType('Advanced');
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

                        <Tab eventKey={1} title="Basic" >
                            {sessionStorage.setItem('group_type', _groupType)}
                            <GroupsTableView _groupType={_groupType} />
                        </Tab>
                        <Tab eventKey={2} title="Intermediate" >
                            {sessionStorage.setItem('group_type', _groupType)}
                            <GroupsTableView _groupType={_groupType} />
                        </Tab>
                        <Tab eventKey={3} title="Advanced" >
                            {sessionStorage.setItem('group_type', _groupType)}
                            <GroupsTableView _groupType={_groupType} />
                        </Tab>
                    </Tabs>
                </>
            )}
        </>

    );
};

export default ListGroups;