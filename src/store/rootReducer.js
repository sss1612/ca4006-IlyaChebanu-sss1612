import { combineReducers  } from "redux";
import userUpload from "../../shared/store/userUpload";

const rootReducer = combineReducers({
    userUpload,
});

export default rootReducer;
