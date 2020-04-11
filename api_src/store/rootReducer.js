import { combineReducers  } from "redux";
import sharedState from "../../shared/store/sharedState";
import synchronizer from "./synchronizer";

const rootReducer = combineReducers({
    sharedState,
});

synchronizer.subscribe('sharedState');

export default rootReducer;
