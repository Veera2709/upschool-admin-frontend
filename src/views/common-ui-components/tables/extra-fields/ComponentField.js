import React from 'react';
import Select from 'react-select';

function ComponentField(props) {

  const { colourOptions, colourStylesMulti, handleOnSelect, defaultValueData } = props;
  return (
    <>
      <div className="form-group fill">
        <label className="floating-label" htmlFor="clientComponents">
          <small className="text-danger">* </small>Choose Components
        </label>
        <Select
          closeMenuOnSelect={false}
          defaultValue={defaultValueData}
          isMulti
          options={colourOptions}
          styles={colourStylesMulti}
          onChange={handleOnSelect}
        />
      </div>
    </>
  )
}

export default ComponentField;