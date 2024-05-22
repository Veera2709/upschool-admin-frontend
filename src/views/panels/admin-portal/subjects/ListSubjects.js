

import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import SubjectTableView from './SubjectTableView';

const ListSubjects = () => {

    const [pageLocation, setPageLocation] = useState(useLocation().pathname.split('/')[2]);
    const [subjectStatus, setUserStatus] = useState('');

    useEffect(() => {

        console.log(pageLocation);

        if (pageLocation) {

            const status = pageLocation === "active-subjects" ? 'active-subjects' : 'archived-subjects';
            setUserStatus(status);

        }

    }, [pageLocation]);


    return (
        <SubjectTableView subjectStatus={subjectStatus} />
    )
};

export default ListSubjects;


