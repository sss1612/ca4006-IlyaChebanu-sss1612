import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./MetadataWindow.css"
import { selectors as sharedSelectors } from "../../../shared/store/sharedState";
import { selectors as windowStateSelectors } from "../../store/windowState/windowState";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

const FilterTabs = ({ filenameFilterData, metadata, currentSelectedFile }) => {
    const filterNames = Object.keys(filenameFilterData).filter(filterName => {
        return !filterName.includes(".txt")
    })
    const [currentFilterTabName, setCurrentFilterTabName] = useState(filterNames[0])
    useEffect(() => {
        
        if(document.getElementById("MyPieChart") === null) {
            return
        }
        const currentFilterData = metadata[currentSelectedFile][currentFilterTabName];
        console.log("--->", currentFilterData);
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
        const chart = am4core.create("MyPieChart", am4charts.PieChart);
        chart.data = characterCountFilterData
        const pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "count";
        pieSeries.dataFields.category = "character";


    }, [currentFilterTabName])

    return (
        <div className="FilterTabs">
            {filterNames.map(
                filterName => (
                <p className="FilterTabPills" key={filterName} onClick={()=> setCurrentFilterTabName(filterName)} >{filterName}</p>)
            )}
        </div>
    )

}
const MetadataWindow = props => {
    const { metadata, currentSelectedFile } = props;
    const filenameFilterData = metadata[currentSelectedFile];
    
    
    if (!filenameFilterData) {
        return (<></>)
    }
    return (
        <>
            <h2>Filters{" "}<p className="Smalltext"> (Select a filter to see it's metadata)</p></h2>
            <div className="MetadataWindowWrapper">
                <div className="FilterTabsWrapper">
                    <FilterTabs {...{filenameFilterData, metadata, currentSelectedFile}}/>
                </div>
                    <div id="MyPieChart"></div>
                    <div id="MyHistChart"></div>
                <p>{currentSelectedFile}</p>
            </div>
        </>
    )
}

const mapStateToPRops = state => ({
    metadata: sharedSelectors.getMetadataSelector(state),
    currentSelectedFile: windowStateSelectors.getCurrentSelectedUploadedFileSelector(state),
})

export default connect(mapStateToPRops, null)(MetadataWindow);
