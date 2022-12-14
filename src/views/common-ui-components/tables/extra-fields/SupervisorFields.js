import React, { useState, useEffect } from 'react';
import dynamicUrl from '../../../../helper/dynamicUrls';
import { defaultPostApi } from '../../sow/bgv-api/BgvApi';
import { isEmptyObject } from '../../../../util/utils';

function SupervisorField(props) {
  const { handleSupervisor, supervisorType, existingSupervisor } = props;
  const [supervisors, setSupervisors] = useState([]);
  const [active, setActive] = useState(false);

  const _fetchSupervisors = async () => {
    let apiUrl = '';
    let reqPayload = {
      data: {
        'user_category': "",
        'supervisor_id': ""
      }
    }

    switch (supervisorType) {
      case "CST":
        apiUrl = dynamicUrl.fetchAllUsers;
        reqPayload.data.user_category = "CST Supervisor";
        break;
      case "Operation Team":
        apiUrl = dynamicUrl.fetchAllUsers;
        reqPayload.data.user_category = "Operation Supervisor";
        break;
      default:
        apiUrl = dynamicUrl.fetchAllUsers;
        reqPayload.data.user_category = "";
        break;
    }

    const supervisorData = await defaultPostApi(apiUrl, reqPayload);
    console.log("supervisorData", supervisorData);
    if (supervisorData !== 'Error') {
      setSupervisors(supervisorData.data.Items);
      console.log("exisitngSuper", existingSupervisor)
      setActive(true);
    } else {
      // put error alert here
    }
  }

  useEffect(() => {
    _fetchSupervisors();
  }, []);

  return isEmptyObject(supervisors) ? null : (
    <>
      <div className="form-group fill">
        <label className="floating-label" htmlFor="userClientId">
          <small className="text-danger">* </small>Select Supervisor
        </label>
        <select name="select" className="form-control" onChange={handleSupervisor} value={existingSupervisor}>
          <option value="">Select a supervisor</option>
          {supervisors.map((ele, i) => {
            return <option key={i} value={ele.user_id} >{ele.user_name}</option>
          })}
        </select>
      </div>
    </>
  )
}

export default SupervisorField;