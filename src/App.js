import React from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from "react-redux";
import { selectors as userUploadSelectors } from "./store/userUpload/userUpload";
const App = ({message}) => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
          <p id="fucksake">{message}</p>
      </header>
    </div>
  );
}

const mapStateToProps = state => ({
  message: userUploadSelectors.getSuccessSelector(state),
})

// common practice I make mapDisPatchToProps null, just for the sake of clarity for arity(s)
export default connect(mapStateToProps, null)(App);
