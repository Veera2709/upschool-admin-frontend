const initialNav = false;

const addReducer = (state = initialNav, action) => {
  switch (action.type) {
    case "ADD_TRUE": {
      return action.payload;
    }

    case "ADD_FALSE": {
      return false;
    }

    default: {
      return state;
    }
  }
};

export default addReducer;
