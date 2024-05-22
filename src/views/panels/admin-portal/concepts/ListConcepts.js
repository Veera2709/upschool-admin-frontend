

import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import ConceptTableView from './ConceptTableView';

const ListUsers = () => {

    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [userStatus, setUserStatus] = useState('');

    useEffect(() => {

        console.log(pageLocation);

        if (pageLocation) {

            const status = pageLocation === "active-concepts" ? 'active-concepts' : 'archived-concepts';
            setUserStatus(status);

        }

    }, [pageLocation]);

    return (
        <ConceptTableView userStatus={userStatus} />
    )
};

export default ListUsers;


