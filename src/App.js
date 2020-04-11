import React from 'react';
import './App.css';
import { connect } from "react-redux";
import FilterFieldsComponent from "./FilterFields/FilterFields";
import UploadButtonComponent from "./UploadFileButton/UploadFileButton";
import RequestOutputButton from "./components/FileOutputRequestButton/FileOutputRequestButton";
import File from './components/File/File.component';

import { selectors as sharedStateSelectors } from '../shared/store/sharedState';

import { requestOutputFile, cancelFileProcessing } from './api_lib/processing';

const App = ({
  uploadedFiles,
  processingQueue,
  generatedFiles,
  metadata,
  wordsCompleted,
  timePerWord,
  fileWritingOverhead
}) => {
  const metadataList = [];
  Object.keys(metadata).forEach(filename => {
    const chunks = [];
    Object.keys(metadata[filename]).forEach(chunk => {
      chunks.push(`${filename}:${chunk}`);
    })
    metadataList.push(...chunks);
  })

  let totalWordsPrior = 0;
  processingQueue.forEach((task, i) => {
    if (i === 0) {
      totalWordsPrior += task.totalWordCount - wordsCompleted;
    } else {
      totalWordsPrior += task.totalWordCount;
    }
    task.timeEstimate = (timePerWord * totalWordsPrior) + (fileWritingOverhead * task.totalWordCount);
  });

  return (
    <div className="App-container">
      <div className="App">
        <p>
          Ilie and Stephen's epic file processor
        </p>
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
                variant="blue"
              />
            ))}
          </div>
        </section>
        <span className="RequestOutputButtonWrapper">
          {metadataList.map(filename => (
            <RequestOutputButton key={filename} filename={filename} callBack={requestOutputFile} />
          ))}
        </span>
        <section>
          <h2>Processing files</h2>
          <div className="scroll-row">
            {processingQueue.map((task, i) => (
              <File
                filename={task.filename}
                key={task.filename}
                onDoubleClick={() => console.log('test')}
                onDeleteButtonClick={() => {
                  cancelFileProcessing(task.filename);
                }}
                variant="yellow"
                progress={i === 0 ? wordsCompleted / task.totalWordCount : 0}
                timeEstimate={task.timeEstimate}
              />
            ))}
          </div>
        </section>
        <section>
          <h2>Generated files</h2>
          <div className="scroll-row">
            {generatedFiles.map(filename => (
              <File
                filename={filename}
                key={filename}
                onDoubleClick={() => console.log('test')}
                onDeleteButtonClick={() => console.log('yeetus deletus')}
                variant="green"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  uploadedFiles: sharedStateSelectors.getUploadedFiles(state),
  processingQueue: sharedStateSelectors.getProcessingQueue(state),
  generatedFiles: sharedStateSelectors.getOutputFiles(state),
  metadata: sharedStateSelectors.getMetadataSelector(state),
  wordsCompleted: sharedStateSelectors.getWordsCompleted(state),
  timePerWord: sharedStateSelectors.getTimePerWord(state),
  fileWritingOverhead: sharedStateSelectors.getFileWritingOverhead(state),
});

// common practice I make mapDisPatchToProps null, just for the sake of clarity for arity(s)
export default connect(mapStateToProps, null)(App);
