import { fork, all } from "redux-saga/effects";
import queryRootSaga from "./query/querySaga";
import windowStateRootSaga from "./windowState/windowStateSaga";
import errorRootSaga from "./error/errorSaga";

export default function* rootSaga(){
    yield all([
        fork(queryRootSaga),
        fork(windowStateRootSaga),
        fork(errorRootSaga)
    ])
}
