import React from 'react';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {

    let history = useHistory();
    console.log("Dashboard");

    const validateJWT = sessionStorage.getItem('user_jwt');

    if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

        history.push('/auth/signin-1');
        window.location.reload();

    } else {

        return (
            < h1 > DASHBOARD</h1 >
        )

    }


};

export default Dashboard;