import { createStore, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';


const configureStore = sagaMiddleware => createStore(rootReducer,
    applyMiddleware(sagaMiddleware),
)

export default configureStore;
