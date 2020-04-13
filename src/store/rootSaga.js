import { fork, all } from "redux-saga/effects";
import queryRootSaga from "./query/querySaga";
import windowStateRootSaga from "./windowState/windowStateSaga";

export default function* rootSaga(){
    yield all([
        fork(queryRootSaga),
        fork(windowStateRootSaga),
    ])
}
