import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./MetadataWindow.css"
import { selectors as sharedSelectors } from "../../../shared/store/sharedState";
import { selectors as windowStateSelectors, actions as windowStateActions } from "../../store/windowState/windowState";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

const sortingKey = (a, b) => {
    return b.count - a.count ;
}
var active_filter;
const downloadMetadata = (exportObj, exportName) => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

const FilterTabs = ({ filenameFilterData, metadata, currentSelectedFile }) => {
    const filterNames = Object.keys(filenameFilterData).filter(filterName => {
        return !filterName.includes(".txt")
    })
    const [currentFilterTabName, setCurrentFilterTabName] = useState(filterNames[0])
    
    console.log("TAB", currentFilterTabName)
    active_filter = currentFilterTabName;
    console.log("ACTIVE FILTER", active_filter)
    useEffect(() => {
        
        if(document.getElementById("MyPieChart") === null) {
            return
        }
        const currentFilterData = metadata[currentSelectedFile][currentFilterTabName];
        const { letterCount: letterCountObj } = currentFilterData;

        const characterCountFilterData = Object.keys(letterCountObj).reduce((acc, character) => {
            const charObject = {
                character,
                count: letterCountObj[character],
            }
            acc.push(charObject);
            return acc;
        },[])
        // Pie chart
        // if (!currentSelectedFile in )
        const chart = am4core.create("MyPieChart", am4charts.PieChart);
        chart.data = characterCountFilterData
        const pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "count";
        pieSeries.dataFields.category = "character";
        
    }, [currentFilterTabName, currentSelectedFile, metadata]);
    const wontCrash = (currentFilterTabName in metadata[currentSelectedFile]);
    if (!wontCrash) {
        setCurrentFilterTabName(filterNames[0])
    }
    if(metadata[currentSelectedFile][currentFilterTabName] === undefined) {
        setCurrentFilterTabName(filterNames[0])
        return (<></>)
    }
    const { wordsCount } = metadata[currentSelectedFile][currentFilterTabName];
    const filterWordCountObjectArray = Object.keys(wordsCount).reduce((acc, word) => {
        acc.push({
            word,
            count: wordsCount[word],
        })
        return acc;
    },[])
    filterWordCountObjectArray.sort(sortingKey)

    return (
        <>
            <div className="FilterTabs">
                {filterNames.map(
                    filterName => (
                    <p className="FilterTabPills" key={filterName} onClick={()=> setCurrentFilterTabName(filterName)} >{filterName}</p>)
                )}
            </div>
            <div className="FilterTableWrapper">
                    <p className="SmallText" marginLeft="30px"> {` ${"\u200b"} `} Words {filterWordCountObjectArray.length <= 100? "": "100 out of"} {filterWordCountObjectArray.length} from {currentFilterTabName}</p>
                <table>
                    <tr>
                        <th>Word</th>
                        <th>Count</th>
                    </tr>
                {filterWordCountObjectArray.slice(0,100).map((wordObject) => {
                    const { word, count } = wordObject;
                    return (
                        <tr>
                            <th>{word}</th>
                            <th>{count}</th>
                        </tr>
                    )
                })}
                </table>
            </div>
        </>
    )
}

const MetadataWindow = props => {
    const { metadata, currentSelectedFile, downloadJsonMetadata } = props;
    const filenameFilterData = metadata[currentSelectedFile];
    
    
    if (!filenameFilterData) {
        return (<></>)
    }
    return (
        <>
            <h2>Filters{" "}<p className="Smalltext"> (Select a filter to view its metadata)</p></h2>
            <div className="MetadataWindowWrapper">
                <div className="FilterTabsWrapper">
                    <FilterTabs {...{filenameFilterData, metadata, currentSelectedFile}} />
                    <div id="MyPieChart"/>
                </div>
                <div className="FilterFooter">
                    <p className="FilterMetrics">File: {currentSelectedFile}</p>
                    <button className="FilterTabPills" onClick={() => {downloadJsonMetadata({data:metadata[currentSelectedFile][active_filter], filename: currentSelectedFile})}}>Download metadata</button>
                </div>
            </div>
        </>
    )
}

const mapDispatchToProps = dispatch => ({
    downloadJsonMetadata: (obj) => dispatch(windowStateActions.downloadMetadataJson(obj))
})

const mapStateToPRops = state => ({
    metadata: sharedSelectors.getMetadataSelector(state),
    currentSelectedFile: windowStateSelectors.getCurrentSelectedUploadedFileSelector(state),
})

export default connect(mapStateToPRops, mapDispatchToProps)(MetadataWindow);
