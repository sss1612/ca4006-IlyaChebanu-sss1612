import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import createSagaMiddleware from 'redux-saga';
import devConfigureStore from "./store/devConfigureStore";
import configureStore from "./store/configureStore";
import rootSaga from './store/rootSaga';

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

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
