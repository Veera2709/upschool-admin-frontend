import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {

    let history = useHistory();
    console.log("Dashboard");

    useEffect(() => {
        window.addEventListener('popstate', (e) => {
            window.history.go(1);
        });
    }, []);

    const validateJWT = sessionStorage.getItem('user_jwt');

    if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

        sessionStorage.clear();
        localStorage.clear();

        history.push('/auth/signin-1');
        window.location.reload();

    } else {

        return (
            < h1 > DASHBOARD</h1 >
        )

    }


};

export default Dashboard;