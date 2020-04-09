import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
    actions as userUploadActions,
    TEST,
}
from "../../../shared/store/userUpload";

function* testSaga(action) {
    try {
        const { payload: message } = action;
        yield put(userUploadActions.testSuccess(message));

    } catch (error) {
        yield put(userUploadActions.testError(error));
    }
}

function* testSagaWatcher() {
    yield takeLatest(TEST, testSaga);
}

export default function* rootUserUploadSaga() {
    yield all([
        call(testSagaWatcher),
    ])
}
