import { fork, all } from "redux-saga/effects";
import uploadRootSaga from "./userUpload/userUploadSaga";

export default function* rootSaga(){
    yield all([
        fork(uploadRootSaga),
    ])
}
