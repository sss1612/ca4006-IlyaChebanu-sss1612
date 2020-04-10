import { fork, all } from "redux-saga/effects";
import sharedStateRootSaga from "./sharedState/sharedStateSaga";

export default function* rootSaga(){
    yield all([
        fork(sharedStateRootSaga),
    ])
}
