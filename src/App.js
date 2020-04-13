import React, { useCallback } from 'react';
import './App.css';
import { connect } from "react-redux";
import { useDropzone } from 'react-dropzone';
import FilterFieldsComponent from "./FilterFields/FilterFields";
import UploadButtonComponent from "./UploadFileButton/UploadFileButton";
import RequestOutputButton from "./components/FileOutputRequestButton/FileOutputRequestButton";
import MetadataWindowComponent from "./components/MetadataWindow/MetadataWindow";
import {
  actions as windowStateActions,
  selectors as windowStateSelectors
} from "./store/windowState/windowState";
import File from './components/File/File.component';
import StorageStats from './components/StorageStats/StorageStats.component';
import { selectors as sharedStateSelectors } from '../shared/store/sharedState';

import { requestOutputFile, cancelFileProcessing } from './api_lib/processing';
import uploadFile from './api_lib/upload';
import { deleteInputFile, deleteOutputFile } from './api_lib/deleter';

const downloadOutputFile = async filename => {
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     "http://localhost:8080/static/"+filename);
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
  selectedFile
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
        console.log(file);
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

  return (
    <div className="App-container">
      <div className="App">
        <p>
          Ilie and Stephen's epic file processor
        </p>
        <FilterFieldsComponent/>
        <section>
          <span className="upload-heading"><h2>Uploaded files</h2><UploadButtonComponent/></span>
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
          {selectedFile && <MetadataWindowComponent metadataList={metadataList}/>}
        </section>
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
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  setCurrentSelectedUploadedFile: filename => dispatch(windowStateActions.setCurrentSelectedUploadedFile(filename))
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
});

// common practice I make mapDisPatchToProps null, just for the sake of clarity for arity(s)
export default connect(mapStateToProps, mapDispatchToProps)(App);
