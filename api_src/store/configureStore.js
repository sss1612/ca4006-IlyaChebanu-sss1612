import { createStore, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';
import synchronizer from './synchronizer';


const configureStore = sagaMiddleware => createStore(rootReducer,
    applyMiddleware(sagaMiddleware, synchronizer),
)

export default configureStore;
