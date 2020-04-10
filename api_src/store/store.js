import configureStore from './configureStore';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export default configureStore(sagaMiddleware);

sagaMiddleware.run(rootSaga);
