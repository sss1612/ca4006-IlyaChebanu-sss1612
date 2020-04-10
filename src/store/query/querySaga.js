import { call, all, takeLatest } from "redux-saga/effects";
import {
    QUERY_FILTER,
} from "./query";
import queryfilterEndpoint from "../../api_lib/filter";
function* queryFilterSaga({ payload: filterData }) {
    yield call(queryfilterEndpoint, filterData);
}

function* queryFilterSagaWatcher() {
    yield takeLatest(QUERY_FILTER, queryFilterSaga);
}

export default function* queryRootSaga() {
    yield all([
        call(queryFilterSagaWatcher),
    ]);
}
