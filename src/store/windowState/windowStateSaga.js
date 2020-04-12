import { takeLatest, call } from "redux-saga/effects"
import { DOWNLOAD_METADATA_JSON } from "./windowState";

function* downloadJsonMetadataSaga({payload:{data, filename}}) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    var downloadAnchorNode = document.createElement('a');
    yield downloadAnchorNode.setAttribute("href",     dataStr);
    yield downloadAnchorNode.setAttribute("download", filename + ".json");
    yield document.body.appendChild(downloadAnchorNode); // required for firefox
    yield downloadAnchorNode.click();
    yield downloadAnchorNode.remove();
}

function* downloadJsonMetadataSagaWatcher() {
    yield takeLatest(DOWNLOAD_METADATA_JSON, downloadJsonMetadataSaga)
}

export default function* rootSaga() {
    yield call(downloadJsonMetadataSagaWatcher)
}