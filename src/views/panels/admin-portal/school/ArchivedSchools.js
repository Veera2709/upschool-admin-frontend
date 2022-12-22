import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { isEmptyArray } from '../../../../util/utils';
import SchoolsDataList from './SchoolsDataList';

const ArchivedSchools = () => {
    const [_data, setData] = useState([]);
    console.log('_data: ', _data);

    useEffect(() => {
        axios.post(dynamicUrl.fetchInactiveSchool, {}, { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
            .then((response) => {
                const result = response.data.Items;
                if (!isEmptyArray(result)) {
                    result && setData([...result]);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    return (
        <div>
            <SchoolsDataList _data={_data} />
        </div>
    )
}

export default ArchivedSchools