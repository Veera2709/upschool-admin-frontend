import React, { useEffect } from 'react'
import axios from 'axios';
import dynamicUrl from '../../../../helper/dynamicUrls';
import EditSchoolForm from './EditSchoolForm'
import SubscribeClass from './SubscribeClass';
import SectionList from './SectionList'
import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useHistory, useParams } from 'react-router-dom';
import BasicSpinner from '../../../../helper/BasicSpinner';

const SectionAdd = () => {
    const history = useHistory();
    const [_data, _setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [subscriptionActive, setSubscriptionActive] = useState([]);
    const [subscriptionInActive, setSubscriptionInActive] = useState([]);
    // const [displayHeading, setDisplayHeading] = useState(sessionStorage.getItem('status'));
    const [inactive, setInactive] = useState(false);
    const threadLinks = document.getElementsByClassName('page-header');
    const [displayHeader, setDisplayHeader] = useState(true);



    const { school_id } = useParams();

    const handleUserChange = (key) => {

        if (key === '1') {
        }
        else if (key === '2') {
        }
        else if (key === '3') {
        } else {
            console.log("Invalid option!");
        }
    }
    useEffect(() => {
        if (threadLinks.length === 2) {
            setDisplayHeader(false);
        } else {
            setDisplayHeader(true);
        }
    },[])
    return (
        <div>
            {isLoading ? <BasicSpinner /> : (
                <React.Fragment>
                    {
                        displayHeader && (
                            <div className="page-header">
                                <div className="page-block">
                                    <div className="row align-items-center">
                                        <div className="col-md-12">
                                            <div className="page-header-title">
                                                <h5 className="m-b-10">Active School</h5>
                                            </div><ul className="breadcrumb  ">
                                                <li className="breadcrumb-item  ">
                                                    <a href="/upschool/admin-portal/admin-dashboard">
                                                        <i className="feather icon-home">
                                                        </i>
                                                    </a>
                                                </li>
                                                <li className="breadcrumb-item  ">School</li>
                                                <li className="breadcrumb-item  ">Active School</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <Tabs
                        onSelect={handleUserChange}
                        defaultActiveKey={1}
                        className="mb-3"
                    >
                        <Tab eventKey={1} title="General" >
                            <EditSchoolForm id={school_id} />
                        </Tab>
                        <Tab eventKey={2} title="Subscribe Class">
                            <SubscribeClass id={school_id} />
                        </Tab>
                        <Tab eventKey={3} title="Add Section">
                            <SectionList id={school_id} />
                        </Tab>
                    </Tabs>
                </React.Fragment>
            )}
        </div>
    )
}

export default SectionAdd