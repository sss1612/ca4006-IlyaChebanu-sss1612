import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './rootReducer';


const devConfigureStore = sagaMiddleware => createStore(
    rootReducer,
    compose(
        applyMiddleware(sagaMiddleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
            actionSanitizer: action => (
                ['sharedState/ADD_METADATA', 'sharedState/SET_INITIAL_STATE'].includes(action.type)
                    ? { type: action.type, data: 'tl;dr' }
                    : action
            ),
            stateSanitizer: state => ({
                ...state,
                sharedState: {
                    ...state.sharedState,
                    metaData: 'tl;dr'
                }
            })
        }),
    )
)


export default devConfigureStore;
