import React from 'react';
import Select from 'react-select';

function UsersMultiSelect(props) {
  const { colourOptions, colourStylesMulti, handleOnSelect, defaultValueData } = props;
  return (
    <>
      <label className="floating-label" htmlFor="clientComponents">
        <small className="text-danger">* </small>Assign Users
      </label>
      <Select
        closeMenuOnSelect={false}
        defaultValue={defaultValueData}
        isMulti
        options={colourOptions}
        styles={colourStylesMulti}
        onChange={handleOnSelect}
      />
    </>
  )
}

export default UsersMultiSelect;