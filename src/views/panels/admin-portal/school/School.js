import React, { useEffect } from 'react'
import axios from 'axios';
import dynamicUrl from '../../../../helper/dynamicUrls';
import SchoolChild from './SchoolChild'
import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const School = () => {
    const [_data, _setData] = useState([]);
    const [subscriptionActive, setSubscriptionActive] = useState([]);
    const [subscriptionInActive, setSubscriptionInActive] = useState([]);

    const fetchSchoolData = () => {
        axios.post(dynamicUrl.fetchAllSchool, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                let resultData = response.data.Items;
                setSubscriptionActive(resultData && resultData.filter(p => p.subscription_active === 'Yes'))
                setSubscriptionInActive(resultData && resultData.filter(p => p.subscription_active === 'No'))
                _setData(resultData && resultData.filter(p => p.subscription_active === 'Yes'))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchSchoolData();
    }, []);

    const handleYesClick = (key) => {
        if (key === '1') {
            _setData(subscriptionActive)
        }
        else {
            _setData(subscriptionInActive)
        }
    }

    return (
        <div>
            <Tabs
                defaultActiveKey={1}
                // id="uncontrolled-tab-example"
                onSelect={handleYesClick}
                className="mb-3"
            >
                <Tab eventKey={1} title="Subscription Active" >
                    <SchoolChild _data={_data} />
                </Tab>
                <Tab eventKey={2} title="Subscription Inactive">
                    <SchoolChild _data={_data} />
                </Tab>
            </Tabs>
        </div>
    )
}

export default School