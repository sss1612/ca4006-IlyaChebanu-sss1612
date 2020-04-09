import { fork, all, put } from "redux-saga/effects";
import uploadRootSaga from "./userUpload/userUploadSaga";
import { actions as userUploadActions } from "../../shared/store/userUpload";
export default function* rootSaga(){
    yield all([
        fork(uploadRootSaga),
    ])
    yield put(userUploadActions.test("custom message"))
}
