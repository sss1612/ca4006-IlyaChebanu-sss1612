import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import "./MetadataWindow.css"
import { selectors as sharedSelectors } from "../../../shared/store/sharedState";
import { selectors as windowStateSelectors, actions as windowStateActions } from "../../store/windowState/windowState";
import { requestOutputFile } from '../../api_lib/processing';
import MetadataTable from "../MetadataTable/MetadataTable.component";
import MetadataPie from "../MetadataPie/MetadataPie.component";
import { actions as queryActions } from '../../store/query/query';


var active_filter;


const FilterTabs = ({ filenameFilterData, metadata, currentSelectedFile, currentFilterTabName, setCurrentFilterTabName }) => {
  const filterNames = Object.keys(filenameFilterData).filter(filterName => {
    return !filterName.includes(".txt")
  })

  active_filter = currentFilterTabName;

  const wontCrash = (currentFilterTabName in metadata[currentSelectedFile]);
  if (!wontCrash) {
    setCurrentFilterTabName(filterNames[0])
  }
  if (metadata[currentSelectedFile][currentFilterTabName] === undefined) {
    setCurrentFilterTabName(filterNames[0])
    return (<></>)
  }

  return (
    <>
      <div className="FilterTabs">
        {filterNames.map(
          filterName => (
            <p className={`FilterTabPills ${filterName === currentFilterTabName ? 'active' : ''}`} key={filterName} onClick={() => setCurrentFilterTabName(filterName)} >{filterName}</p>)
        )}
      </div>
    </>
  )
}

const MetadataWindow = props => {
  const { metadata, currentSelectedFile, downloadJsonMetadata } = props;

  const filenameFilterData = metadata[currentSelectedFile];
  const [currentFilterTabName, setCurrentFilterTabName] = useState();

  useEffect(() => {
    const filterNames = Object.keys(filenameFilterData).filter(filterName => {
      return !filterName.includes(".txt")
    });
    setCurrentFilterTabName(filterNames[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelectedFile]);

  const filterInputRef = useRef();

  return (
    <div className="metadata-window">
      <span className="upload-heading">
        <h2>Filters{" "}<p className="Smalltext"> (Select a filter to view its metadata)</p></h2>
        <div className="new-filter">
          <input type="text" placeholder="a-c" ref={filterInputRef}/>
          <button onClick={() => {
            const filter = filterInputRef.current.value;
            if (filter && filter.length === 3 && filter[1] === '-') {
              props.queryChunkSpecs({ filter, filename: currentSelectedFile });
            } else {
              alert('Invalid filter format.');
            }
          }}>Request new filter</button>
        </div>
      </span>
      <div className="MetadataWindowWrapper">
        <div className="FilterTabsWrapper">
          <div className="FilterTabsFlexItem">
            <FilterTabs {...{ filenameFilterData, metadata, currentSelectedFile, currentFilterTabName, setCurrentFilterTabName }} />
          </div>
        </div>
        {currentFilterTabName && <div className="metadata-window-content">
          <div className="total-words">Total words in chunk: {metadata[currentSelectedFile][currentFilterTabName].totalWordCount}</div>
          <div className="metadata-window-main">
            <MetadataTable metadata={metadata} currentSelectedFile={currentSelectedFile} currentFilterTabName={currentFilterTabName}/>
            <MetadataPie metadata={metadata} currentSelectedFile={currentSelectedFile} currentFilterTabName={currentFilterTabName}/>
          </div>
        </div>}
        <div className="FilterFooter">
          <button className="footer-button" onClick={() => { downloadJsonMetadata({ data: metadata[currentSelectedFile][active_filter], filename: currentSelectedFile }) }}>Download metadata</button>
          <button className="footer-button" onClick={() => {requestOutputFile(currentSelectedFile, currentFilterTabName)}}>Generate output file</button>
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  downloadJsonMetadata: (obj) => dispatch(windowStateActions.downloadMetadataJson(obj)),
  queryChunkSpecs: filterProps => dispatch(queryActions.queryFilter(filterProps))
})

const mapStateToPRops = state => ({
  metadata: sharedSelectors.getMetadataSelector(state),
  currentSelectedFile: windowStateSelectors.getCurrentSelectedUploadedFileSelector(state),
})

export default connect(mapStateToPRops, mapDispatchToProps)(MetadataWindow);
