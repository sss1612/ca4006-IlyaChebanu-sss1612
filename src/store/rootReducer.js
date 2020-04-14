import { combineReducers  } from "redux";
import sharedState from "../../shared/store/sharedState";
import windowState from "./windowState/windowState";
import initialLoadingState from './initialLoadingState/initialLoadingState';

const rootReducer = combineReducers({
    sharedState,
    windowState,
    initialLoadingState,
});

export default rootReducer;
