import React, { useEffect } from 'react'
import axios from 'axios';
import dynamicUrl from '../../../../helper/dynamicUrls';
import SchoolChild from './SchoolChild'
import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useHistory } from 'react-router-dom';

// // import React, { useState } from 'react';
// import { Row, Col, Card, Pagination, Button, Modal } from 'react-bootstrap';
// import BTable from 'react-bootstrap/Table';

// import { GlobalFilter } from './GlobalFilter';

// import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
// // import makeData from '../../../data/schoolData';

const School = () => {
    const history = useHistory();
    const [_data, _setData] = useState([]);
    const [subscriptionActive, setSubscriptionActive] = useState([]);
    const [subscriptionInActive, setSubscriptionInActive] = useState([]);
    const [inactive, setInactive] = useState(false);

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
                console.log(err.response.data);

                if (err.response.data === "Invalid Token") {

                    sessionStorage.clear();
                    localStorage.clear();

                    history.push('/auth/signin-1');
                    window.location.reload();
                }

            })
    }

    useEffect(() => {
        fetchSchoolData();
    }, []);

    const handleYesClick = (key) => {
        if (key === '1') {
            _setData(subscriptionActive)
            setInactive(false);
        }
        else {
            _setData(subscriptionInActive)
            setInactive(true);
        }
    }
    console.log("subscriptionActive", subscriptionActive);

    console.log("subscriptionInActive", subscriptionInActive);
    return (
        <div>
            <Tabs
                defaultActiveKey={1}
                // id="uncontrolled-tab-example"
                onSelect={handleYesClick}
                className="mb-3"
            >
                <Tab eventKey={1} title="Subscription Active" >
                    <SchoolChild _data={_data} fetchSchoolData={fetchSchoolData} />
                </Tab>
                <Tab eventKey={2} title="Subscription Inactive">
                    <SchoolChild _data={_data} fetchSchoolData={fetchSchoolData} inactive={inactive} />
                </Tab>
            </Tabs>
        </div>
    )
}

export default School