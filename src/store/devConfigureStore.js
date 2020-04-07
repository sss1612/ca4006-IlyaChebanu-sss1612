import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';


const devConfigureStore = sagaMiddleware => createStore(
    rootReducer,
    compose(
        applyMiddleware(sagaMiddleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    )
)


export default devConfigureStore;
