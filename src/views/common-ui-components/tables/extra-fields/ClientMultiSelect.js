import React from 'react';
import Select from 'react-select';

function ClientMultiSelect(props) {
  const { colourOptions, colourStylesMulti, handleOnSelect, defaultValueData } = props;
  return (
    <>
      {/* <div className="form-group fill"> */}
        <label className="floating-label" htmlFor="clientComponents">
          <small className="text-danger">* </small>Assign Clients
        </label>
        <Select
          closeMenuOnSelect={false}
          defaultValue={defaultValueData}
          isMulti
          options={colourOptions}
          styles={colourStylesMulti}
          onChange={handleOnSelect}
        />
      {/* </div> */}
    </>
  )
}

export default ClientMultiSelect;