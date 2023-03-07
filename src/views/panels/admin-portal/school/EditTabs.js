import React, { useEffect } from 'react';
import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import EditSchoolForm from './EditSchoolForm'
import SubscribeClass from './SubscribeClass';
import SectionList from './SectionList'
import QuizConfiguration from './QuizConfiguration';
import SubscriptionFeatures from './SubscriptionFeatures';
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

    useEffect(() => {
        if (threadLinks.length === 2) {
            setDisplayHeader(false);
        } else {
            setDisplayHeader(true);
        }
    }, []);

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
                                                <li key="1" className="breadcrumb-item  ">
                                                    <a href="/upschool/admin-portal/admin-dashboard">
                                                        <i className="feather icon-home">
                                                        </i>
                                                    </a>
                                                </li>
                                                <li key="2" className="breadcrumb-item  ">School</li>
                                                <li key="3" className="breadcrumb-item  ">Active School</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <Tabs
                        // onSelect={handleUserChange}
                        defaultActiveKey={1}
                        className="mb-3"
                    >
                        <Tab eventKey={1} title="General" >
                            <EditSchoolForm id={school_id} />
                        </Tab>
                        <Tab eventKey={2} title="Subscription Features">
                            <SubscriptionFeatures id={school_id} />
                        </Tab>
                        <Tab eventKey={3} title="Quiz Configuration">
                            <QuizConfiguration id={school_id} />
                        </Tab>
                        <Tab eventKey={4} title="Subscribe Class">
                            <SubscribeClass id={school_id} />
                        </Tab>
                        <Tab eventKey={5} title="Add Section">
                            <SectionList id={school_id} />
                        </Tab>
                    </Tabs>
                </React.Fragment>
            )}
        </div>
    )
}

export default SectionAdd