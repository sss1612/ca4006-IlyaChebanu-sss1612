import { fork, all } from "redux-saga/effects";
import uploadRootSaga from "./userUpload/userUploadSaga";
import sharedStateRootSaga from "./sharedState/sharedStateSaga";

export default function* rootSaga(){
    yield all([
        fork(uploadRootSaga),
        fork(sharedStateRootSaga),
    ])
}
