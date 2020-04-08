import { combineReducers  } from "redux";
import userUpload from "../../shared/store/userUpload";
import synchronizer from "./synchronizer";

const rootReducer = combineReducers({
    userUpload,
});

synchronizer.subscribe('userUpload');

export default rootReducer;
