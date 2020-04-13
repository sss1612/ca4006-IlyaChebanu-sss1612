import { call, takeEvery } from "redux-saga/effects";
import { NOTIFY_USER_ERROR_MESSAGE } from "../../../shared/store/sharedState";

function* errorSaga({ errorMessage }) {
    yield console.log(errorMessage)
    try {
        alert(errorMessage)
    } catch(e) {
        // alert is not defined in nodejs
    }
} 

function* errorSagaWatcher() {
    yield takeEvery(NOTIFY_USER_ERROR_MESSAGE, errorSaga);
}

export default function* errorRootSaga() {
    yield call(errorSagaWatcher)
}
