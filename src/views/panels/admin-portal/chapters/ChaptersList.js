import React, { useEffect } from 'react'
import axios from 'axios';
import dynamicUrl from '../../../../helper/dynamicUrls';
import ChaptersListChild  from './ChaptersListChild';
import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';



const CaptersList = () => {
    const [_data, _setData] = useState([]);
    const [chapterActive, setChapterActive] = useState([]);
    const [chapterArchived, setChapterArchived] = useState([]);
    

    console.log("chapterActive -- ", chapterActive);

    const fetchChapterData = () => {
        axios.post(dynamicUrl.fetchAllChapters, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                console.log(response.data.Items);
                let resultData = response.data.Items;
                setChapterActive(resultData && resultData.filter(e => e.chapter_status === 'Active'));
                setChapterArchived(resultData && resultData.filter(e => e.chapter_status === 'Archived'));
                _setData(resultData && resultData.filter(e => e.chapter_status === 'Active'))

            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchChapterData();
    }, []);

    const handleYesClick = (key) => {
        if (key === '1') {
            _setData(chapterActive)
        }
        else {
            _setData(chapterArchived)
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
                <Tab eventKey={1} title="Chapter Active" >
                    <ChaptersListChild _data={_data} />
                </Tab>
                <Tab eventKey={2} title="Chapters Archived">
                    <ChaptersListChild _data={_data} />
                </Tab>
            </Tabs>
        </div>
    )
}

export default CaptersList