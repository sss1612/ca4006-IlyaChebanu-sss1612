import { combineReducers  } from "redux";
import userUpload from "../../shared/store/userUpload";
import sharedState from "../../shared/store/sharedState";

const rootReducer = combineReducers({
    userUpload,
    sharedState
});

export default rootReducer;
