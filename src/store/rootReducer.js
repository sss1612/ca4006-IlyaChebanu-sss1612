import { combineReducers  } from "redux";
import sharedState from "../../shared/store/sharedState";
import windowState from "./windowState/windowState";
const rootReducer = combineReducers({
    sharedState,
    windowState,
});

export default rootReducer;
