import React from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from "react-redux";
import FilterFieldsComponent from "./FilterFields/FilterFields";
import UploadButtonComponent from "./UploadFileButton/UploadFileButton";

import File from './components/File/File.component';

import { selectors as sharedStateSelectors } from '../shared/store/sharedState';

const App = ({ uploadedFiles }) => {
  return (
    <div className="App-container">
      <div className="App">
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
        <UploadButtonComponent/>
        <FilterFieldsComponent/>
        <section>
          <h2>Uploaded files</h2>
          <div className="scroll-row">
            {uploadedFiles.map(filename => (
              <File
                filename={filename}
                key={filename}
                onDoubleClick={() => console.log('test')}
                onDeleteButtonClick={() => console.log('yeetus deletus')}
              />
            ))}
            <File progress={0.32} filename="some_bullshit-fileName.txt"/>
            <File progress={0.42} filename="some_bullshit-fileName2.txt"/>
            <File progress={1} filename="some_bullshit-fileName3-really-fucking_loNG.txt"/>
          </div>
        </section>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  uploadedFiles: sharedStateSelectors.getUploadedFiles(state),
});

// common practice I make mapDisPatchToProps null, just for the sake of clarity for arity(s)
export default connect(mapStateToProps, null)(App);
