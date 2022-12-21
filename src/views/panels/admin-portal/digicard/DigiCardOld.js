import React, { useEffect } from 'react'
import axios from 'axios';
import dynamicUrl from '../../../../helper/dynamicUrls';
import DigicardChild from './DigiCardChild'
import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';



const DigiCard = () => {
    const [_data, _setData] = useState([]);
    const [digiCardActive, setDigiCardActive] = useState([]);
    const [digiCardArchived, setDigiCardArchived] = useState([]);

    console.log("digiCardActive -- ", digiCardActive);
    console.log("digiCardArchived -- ", digiCardArchived);

    const fetchDigcardData = () => {
        axios.post(dynamicUrl.fetchAllDigiCards, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response.data.Items);
                let resultData = response.data.Items;
                setDigiCardActive(resultData && resultData.filter(e => e.digicard_status === 'Active'));
                setDigiCardArchived(resultData && resultData.filter(e => e.digicard_status === 'Archived'));
                _setData(resultData && resultData.filter(e => e.digicard_status === 'Active'))

              
                
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchDigcardData();
    }, []);

    const handleYesClick = (key) => {
        if (key === '1') {
            _setData(digiCardActive)
        }
        else {
            _setData(digiCardArchived)
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
                <Tab eventKey={1} title="DigiCard Active" >
                    <DigicardChild _data={_data} />
                </Tab>
                <Tab eventKey={2} title="DigiCard Archived">
                    <DigicardChild _data={_data} />
                </Tab>
            </Tabs>
        </div>
    )
}

export default DigiCard