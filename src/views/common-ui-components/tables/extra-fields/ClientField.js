import React from 'react';

function ClientField(props) {

  const { handleUserType, handleClients, clients, userTypeSeleted, userClientSeleted } = props;

  return (
    <>
      <div className="form-group fill">
        <label className="floating-label" htmlFor="userClientId">
          <small className="text-danger">* </small>Select Client
        </label>
        <select name="select" className="form-control form-control-sm" onChange={handleClients} value={userClientSeleted}>
          {clients.map((ele, i) => {
            return <option key={i} value={ele.client_id} >{ele.client_name}</option>
          })}
        </select>
      </div>

      <div className="form-group fill">
        <label className="floating-label" htmlFor="userType">
          <small className="text-danger">* </small>Select Type
        </label>
        <select name="select" className="form-control form-control-sm" onChange={handleUserType} value={userTypeSeleted}>
          <option value="HR">HR</option>
          <option value="Employee">Employee</option>
        </select>
      </div></>
  )
}

export default ClientField;
