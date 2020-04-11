import { fork, all } from "redux-saga/effects";
import queryRootSaga from "./query/querySaga";

export default function* rootSaga(){
    yield all([
        fork(queryRootSaga),
    ])
}
