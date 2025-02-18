import { combineReducers } from "redux";
import positionReducer from "./positionReducer";

const appReducer = combineReducers({
  position: positionReducer,
});

export default appReducer;
