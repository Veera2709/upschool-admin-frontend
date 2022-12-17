import React, { useState } from "react";

function App() {
  const [inputList, setInputList] = useState([{ firstName: "", lastName: "" }]);
  const [formError, setFormError] = useState([]);
  const [isSubmit, setisSubmit] = useState(false);

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { firstName: "", lastName: "" }]);
  };

  // CHANGE HERE: a flag to be set when there is an error
  var isError = false;

  const Submit = (e) => {
    e.preventDefault();
    const errorMsg = inputList.map((list, key) => {
      let error = {};
      if (!list.firstName) {
        error.errorfirstName = "FirstName is required";
        // CHANGE HERE: set error flag
        isError = true;
      } else {
        error.errorfirstName = "";
      }
      if (!list.lastName) {
        error.errorlastName = "LastName is required";
        // CHANGE HERE: set error flag
        isError = true;
      } else {
        error.errorlastName = "";
      }
      return error;
    });
    console.log(errorMsg);
    setFormError(errorMsg);
    // CHANGE HERE: return false and prevent form submission in case of errors
    if (isError)
      return false;
  };

  // CHANGE HERE: added Error function
  const Error = () => {
    return <>
      {formError.map((error, i) => {
        var str = error.errorfirstName + " " + error.errorlastName;
        if (str !== ' ')
          return <p key={i.toString()}> {i} {str}</p>;
        return <></>
      })}
    </>;
  };

  return (
    <div className="App">
      {inputList.map((x, i) => {
        return (
          <div className="box">
            <input
              name="firstName"
              placeholder="Enter First Name"
              value={x.firstName}
              onChange={(e) => handleInputChange(e, i)}
            />
            <input
              className="ml10"
              name="lastName"
              placeholder="Enter Last Name"
              value={x.lastName}
              onChange={(e) => handleInputChange(e, i)}
            />
            <div className="btn-box">
              {inputList.length !== 1 && (
                <button className="mr10" onClick={() => handleRemoveClick(i)}>
                  Remove
                </button>
              )}
              {inputList.length - 1 === i && (
                <button onClick={handleAddClick}>Add</button>
              )}
            </div>
          </div>
        );
      })}
      <button onClick={Submit}>Submit</button>
      {/* // CHANGE HERE: show an error if any */}
      <Error />
      <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
    </div>
  );
}

export default App;