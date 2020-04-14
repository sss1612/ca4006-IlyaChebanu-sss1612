import React, { useCallback, useState, useEffect, useRef } from 'react';
import './App.css';
import { connect } from "react-redux";
import { useDropzone } from 'react-dropzone';
import UploadButtonComponent from "./UploadFileButton/UploadFileButton";
import MetadataWindowComponent from "./components/MetadataWindow/MetadataWindow";
import {
  actions as windowStateActions,
  selectors as windowStateSelectors
} from "./store/windowState/windowState";
import File from './components/File/File.component';
import StorageStats from './components/StorageStats/StorageStats.component';
import { selectors as sharedStateSelectors } from '../shared/store/sharedState';
import { actions as queryActions } from './store/query/query';

import { cancelFileProcessing, requestOutputFile } from './api_lib/processing';
import uploadFile from './api_lib/upload';
import { deleteInputFile, deleteOutputFile } from './api_lib/deleter';
import store from './store/store';
import { selectors as initialStateSelectors } from './store/initialLoadingState/initialLoadingState';
import axios from 'axios';

const randInt = (n) => Math.random() * n << 0;

const downloadOutputFile = async filename => {
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", "http://localhost:8080/static/" + filename);
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

const App = ({
  uploadedFiles,
  processingQueue,
  generatedFiles,
  metadata,
  wordsCompleted,
  timePerWord,
  fileWritingOverhead,
  setCurrentSelectedUploadedFile,
  selectedFile,
  queryChunkSpecs,
  isLoading,
  diskSimulationIsTrue,
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

  const onDrop = useCallback(files => {
    files.forEach(async file => {
      if (file.type === 'text/plain') {
        const bodyData = new FormData();
        bodyData.append("recfile", file);
        try {
          const res = await uploadFile(bodyData);
        } catch (e) {
          // Duplicate file
        }
      } else {
        // Display some error
      }
    })
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const isSimulationRunningMutable = useRef(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  isSimulationRunningMutable.current = isSimulationRunning;

  useEffect(() => {
    const runner = () => setTimeout(() => {
      const { sharedState } = store.getState();
      const possibleTasks = [];

      if (sharedState.uploadedFiles.length) possibleTasks.push('create-metadata');
      if (Object.keys(sharedState.metaData).length) possibleTasks.push('request-processing');
      if (sharedState.processingQueue.length) possibleTasks.push('cancel-processing');
      if (sharedState.outputFiles.length) possibleTasks.push('delete-generated');

      const taskToExecute = possibleTasks[randInt(possibleTasks.length)];

      switch (taskToExecute) {
        case 'create-metadata': {
          const alphabet = 'abcdefghijklmnopqrstuvwxyz';
          const startingIndex = randInt(alphabet.length);
          const endingIndex = startingIndex + randInt(alphabet.length - startingIndex);
          const filter = `${alphabet.charAt(startingIndex)}-${alphabet.charAt(endingIndex)}`;
          const file = sharedState.uploadedFiles[randInt(sharedState.uploadedFiles.length)];
          queryChunkSpecs({ filename: file, filter });
          break;
        }
        case 'request-processing': {
          const files = Object.keys(sharedState.metaData);
          const file = files[randInt(files.length)];
          const filters = Object.keys(sharedState.metaData[file]);
          const filter = filters[randInt(filters.length)];
          requestOutputFile(file, filter);
          break;
        }
        case 'cancel-procesing': {
          const file = sharedState.processingQueue[randInt(sharedState.processingQueue.length)];
          cancelFileProcessing(file);
          break;
        }
        case 'delete-generated': {
          const file = sharedState.outputFiles[randInt(sharedState.outputFiles.length)];
          deleteOutputFile(file);
          break;
        }
        default:
          break;
      }

      if (isSimulationRunningMutable.current) runner();
    }, randInt(2000));
    if (isSimulationRunning) runner();
  }, [isSimulationRunning, queryChunkSpecs]);

  return (
    <div className="App-container">
      <div className="App">
        <p>
          Ilie and Stephen's epic file processor
        </p>
        {
          isLoading
            ? <div className="spinner"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>
            : <>
              <section>
                <span className="upload-heading"><h2>Uploaded files</h2><UploadButtonComponent /></span>
                <div
                  {...getRootProps({ onClick: e => e.stopPropagation() })}
                  className={`scroll-row ${isDragActive ? 'drop-ready' : ''}`}
                >
                  <input {...getInputProps()}></input>
                  {uploadedFiles.map(filename => (
                    <File
                      filename={filename}
                      key={filename}
                      onDoubleClick={() => setCurrentSelectedUploadedFile(filename)}
                      onDeleteButtonClick={() => deleteInputFile(filename)}
                      variant="blue"
                      active={selectedFile === filename}
                    />
                  ))}
                </div>
                {selectedFile && <MetadataWindowComponent metadataList={metadataList} />}
              </section>
              <section>
                <h2>Processing files</h2>
                <div className="scroll-row">
                  {processingQueue.map((task, i) => (
                    <File
                      filename={task.filename}
                      key={task.filename}
                      onDeleteButtonClick={() => {
                        cancelFileProcessing(task.filename);
                      }}
                      variant="yellow"
                      progress={i === 0 ? wordsCompleted / task.totalWordCount : 0}
                      loading={i === 0 && (wordsCompleted === 0 || wordsCompleted === task.totalWordCount)}
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
                      onDoubleClick={() => downloadOutputFile(filename)}
                      onDeleteButtonClick={() => deleteOutputFile(filename)}
                      variant="green"
                    />
                  ))}
                </div>
              </section>
              <StorageStats />
              <section className="bottom-buttons">
                <button
                  className={`simulation-button ${isSimulationRunning ? 'active' : ''}`}
                  onClick={() => setIsSimulationRunning(v => !v)}
                >
                  Simulate random events
                </button>
                <button
                  className={`simulation-button ${diskSimulationIsTrue ? 'active' : ''}`}
                  onClick={() => axios.post("http://localhost:8080/simulate", {flag: !diskSimulationIsTrue})}
                >
                  Simulate disk space full
                </button>
              </section>
          </>
        }
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  setCurrentSelectedUploadedFile: filename => dispatch(windowStateActions.setCurrentSelectedUploadedFile(filename)),
  queryChunkSpecs: filterProps => dispatch(queryActions.queryFilter(filterProps))
})

const mapStateToProps = state => ({
  uploadedFiles: sharedStateSelectors.getUploadedFiles(state),
  processingQueue: sharedStateSelectors.getProcessingQueue(state),
  generatedFiles: sharedStateSelectors.getOutputFiles(state),
  metadata: sharedStateSelectors.getMetadataSelector(state),
  wordsCompleted: sharedStateSelectors.getWordsCompleted(state),
  timePerWord: sharedStateSelectors.getTimePerWord(state),
  fileWritingOverhead: sharedStateSelectors.getFileWritingOverhead(state),
  selectedFile: windowStateSelectors.getCurrentSelectedUploadedFileSelector(state),
  isLoading: initialStateSelectors.getLoadingState(state),
  diskSimulationIsTrue: sharedStateSelectors.getForcedFullDiskSpaceIsTrue(state),
});

// common practice I make mapDisPatchToProps null, just for the sake of clarity for arity(s)
export default connect(mapStateToProps, mapDispatchToProps)(App);
