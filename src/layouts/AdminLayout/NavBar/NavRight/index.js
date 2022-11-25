import React, { useContext, useState } from 'react';
import { ListGroup, Dropdown, Media } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import jwt from 'jwt-decode';

import ChatList from './ChatList';
import { ConfigContext } from '../../../../contexts/ConfigContext';
import useAuth from '../../../../hooks/useAuth';

import dynamicUrl from '../../../../helper/dynamicUrls';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import user from '../../../../assets/images/user/gravatar.png';
// import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
// import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
// import avatar4 from '../../../../assets/images/user/avatar-4.jpg';


const NavRight = () => {
  let history = useHistory();
  const configContext = useContext(ConfigContext);
  const { logout } = useAuth();
  const { rtlLayout } = configContext.state;

  const [listOpen, setListOpen] = useState(false);
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  // const handleLogout = async () => {
  //   try {
  //     console.log('logout');
  //     //handleClose();
  //     await logout();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleLogout = async () => {
    showLoader();

    try {

      axios
        .post(
          dynamicUrl.logout,
          {
            data: {
              user_email: '',
              user_password: ''
            }
          },
          {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
          }
        )
        .then((response) => {
          console.log({ response });
          hideLoader();

          sessionStorage.clear();
          localStorage.clear();

          history.push('/auth/signin-1');
          window.location.reload();

        })
        .catch((error) => {
          if (error.response) {
            hideLoader();
            // Request made and server responded
            console.log(error.response.data);
            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();

          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
            hideLoader();

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            hideLoader();

            sessionStorage.clear();
            localStorage.clear();

            history.push('/auth/signin-1');
            window.location.reload();
          }
        });


    } catch (err) {
      console.error(err);

      sessionStorage.clear();
      localStorage.clear();

      history.push('/auth/signin-1');
      window.location.reload();
    }
  };

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto">
        {/* <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown alignRight={!rtlLayout}>
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="feather icon-bell icon" />
              <span className="badge badge-pill badge-danger">
                <span />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight className="notification notification-scroll">
              <div className="noti-head">
                <h6 className="d-inline-block m-b-0">Notifications</h6>
                <div className="float-right">
                  <Link to="#" className="m-r-10">
                    mark as read
                  </Link>
                  <Link to="#">clear all</Link>
                </div>
              </div>
              <PerfectScrollbar>
                <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">NEW</p>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix=" " className="notification">
                    <Media>
                      <img className="img-radius" src={avatar1} alt="Generic placeholder" />
                      <Media.Body>
                        <p>
                          <strong>John Doe</strong>
                          <span className="n-time text-muted">
                            <i className="icon feather icon-clock m-r-10" />
                            30 min
                          </span>
                        </p>
                        <p>New ticket Added</p>
                      </Media.Body>
                    </Media>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">EARLIER</p>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix=" " className="notification">
                    <Media>
                      <img className="img-radius" src={avatar2} alt="Generic placeholder" />
                      <Media.Body>
                        <p>
                          <strong>Joseph William</strong>
                          <span className="n-time text-muted">
                            <i className="icon feather icon-clock m-r-10" />
                            30 min
                          </span>
                        </p>
                        <p>Purchase New Theme and make payment</p>
                      </Media.Body>
                    </Media>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix=" " className="notification">
                    <Media>
                      <img className="img-radius" src={avatar3} alt="Generic placeholder" />
                      <Media.Body>
                        <p>
                          <strong>Sara Soudein</strong>
                          <span className="n-time text-muted">
                            <i className="icon feather icon-clock m-r-10" />
                            30 min
                          </span>
                        </p>
                        <p>currently login</p>
                      </Media.Body>
                    </Media>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix=" " className="notification">
                    <Media>
                      <img className="img-radius" src={avatar4} alt="Generic placeholder" />
                      <Media.Body>
                        <p>
                          <strong>Suzen</strong>
                          <span className="n-time text-muted">
                            <i className="icon feather icon-clock m-r-10" />
                            yesterday
                          </span>
                        </p>
                        <p>Purchase New Theme and make payment</p>
                      </Media.Body>
                    </Media>
                  </ListGroup.Item>
                </ListGroup>
              </PerfectScrollbar>
              <div className="noti-footer">
                <Link to="#">show all</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item> */}
        {/* <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown>
            <Dropdown.Toggle as={Link} variant="link" to="#" className="displayChatbox" onClick={() => setListOpen(true)}>
              <i className="icon feather icon-mail" />
              <span className="badge bg-success">
                <span />
              </span>
            </Dropdown.Toggle>
          </Dropdown>
        </ListGroup.Item> */}
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown alignRight={!rtlLayout} className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <img src={user} className="img-radius wid-40" alt="User Profile" />
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight className="profile-notification">
              <div className="pro-head">
                <img src={user} className="img-radius" alt="User Profile" />
                <span>John Doe</span>
                <Link to="#" className="dud-logout" title="Logout">
                  <i className="feather icon-log-out" />
                </Link>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-settings" /> Settings
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                {/* <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-mail" /> My Messages
                  </Link>
                </ListGroup.Item> */}
                {/* <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-lock" /> Lock Screen
                  </Link>
                </ListGroup.Item> */}
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item" onClick={handleLogout}>
                    <i className="feather icon-log-out" /> Logout
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
