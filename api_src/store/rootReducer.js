import { combineReducers  } from "redux";
import userUpload from "../../shared/store/userUpload";
import sharedState from "../../shared/store/sharedState";
import synchronizer from "./synchronizer";

const rootReducer = combineReducers({
    userUpload,
    sharedState,
});

synchronizer.subscribe('userUpload');
synchronizer.subscribe('sharedState');

export default rootReducer;
