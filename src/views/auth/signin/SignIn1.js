import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
// import { NavLink, Link } from 'react-router-dom';

import upschoolLogo from '../../../assets/images/UpSchoolSVG.svg';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

// import { CopyToClipboard } from 'react-copy-to-clipboard';

import Login from './Login';
import LoginWithOTP from './LoginWithOTP';
//import JWTLogin from './JWTLogin';
//import Auth0Login from './Auth0Login';

const Signin1 = () => {

  const [toggle, setToggle] = useState(false);

  const handleLogin = () => {
    alert(toggle)
    setToggle(!toggle)
  }

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content text-center">
          <Card className="borderless">
            <Card.Body>
              <img width={70} src={upschoolLogo} alt="" className="img-fluid mb-4" />
              {/* <h3 color='blue'>UpSchool</h3> */}

              {toggle === false ? <Login handleLogin={handleLogin} /> : <LoginWithOTP handleLogin={handleLogin} />}

            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
