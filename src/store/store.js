import createSagaMiddleware from 'redux-saga';
import devConfigureStore from "./devConfigureStore";
import configureStore from "./configureStore";
import rootSaga from './rootSaga';
import synchronizer from './synchronizer';

const sagaMiddleware = createSagaMiddleware()
let store;
if (process.env.NODE_ENV === "production")
    store = configureStore(sagaMiddleware)
else if(process.env.NODE_ENV === "development")
    store = devConfigureStore(sagaMiddleware)
else {
    const error = new Error(`Environment variable not set. (${process.env.NODE_ENV})`)
    throw error;
}

synchronizer(store);
synchronizer.subscribe('sharedState');

sagaMiddleware.run(rootSaga);

export default store;
