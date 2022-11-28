import React from 'react';
import { Card } from 'react-bootstrap';
// import { NavLink, Link } from 'react-router-dom';

import upschoolLogo from '../../../assets/images/UpSchoolSVG.svg';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

// import { CopyToClipboard } from 'react-copy-to-clipboard';

import Login from './Login';
//import JWTLogin from './JWTLogin';
//import Auth0Login from './Auth0Login';

const Signin1 = () => {
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content text-center">
          <Card className="borderless">
            <Card.Body>
              <img width={70} src={upschoolLogo} alt="" className="img-fluid mb-4" />
              {/* <h3 color='blue'>UpSchool</h3> */}
              <Login />
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
