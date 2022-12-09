import { createStore, combineReducers, applyMiddleware } from "redux";

import addReducer from "../reducers/addReducer";

import thunk from "redux-thunk";

const configureStore = () => {
  const store = createStore(
    combineReducers({
      navState: addReducer,
    }),
    applyMiddleware(thunk)
  );

  return store;
};

export default configureStore;
