import React from 'react';
import { useHistory } from 'react-router-dom';

const AdminDashboard = () => {

  const history = useHistory();

  // useEffect(() => {

  //   console.log(dashboardPage[0] === "admin-dashboard");
  //   if (dashboardPage[0] === "admin-dashboard") {

  //     window.history.pushState(null, document.title, window.location.href);

  //     window.addEventListener('popstate', function (event) {

  //       window.history.pushState(null, document.title, window.location.href);

  //     });

  //   }
  // }, []);

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