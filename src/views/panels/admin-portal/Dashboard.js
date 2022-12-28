import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const AdminDashboard = () => {

  const dashboardPage = useState(useLocation().pathname.split('/')[2]);
  let history = useHistory();
  console.log("Dashboard", dashboardPage[0]);

  useEffect(() => {
      window.addEventListener('popstate', (e) => {
          window.history.go(1);
      });
  }, []);

  useEffect(() => {

    console.log(dashboardPage[0] === "admin-dashboard");
    if (dashboardPage[0] === "admin-dashboard") {

      window.history.pushState(null, document.title, window.location.href);

      window.addEventListener('popstate', function (event) {

        window.history.pushState(null, document.title, window.location.href);

      });

    }
  }, [dashboardPage]);

  const validateJWT = sessionStorage.getItem('user_jwt');

  if (validateJWT === "" || validateJWT === null || validateJWT === undefined || validateJWT === "undefined") {

    sessionStorage.clear();
    localStorage.clear();

    history.push('/auth/signin-1');
    window.location.reload();

  } else {

    return (

      <React.Fragment>
        < h1 > DASHBOARD</h1 >
      </React.Fragment>
    )

  }
};

export default AdminDashboard;