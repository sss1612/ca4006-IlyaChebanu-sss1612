import React, { useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import './MetadataPie.styles.css';

const MetadataPie = ({ metadata, currentSelectedFile, currentFilterTabName }) => {
  useEffect(() => {
    if (document.getElementById("MyPieChart") === null) {
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
    }, [])
    characterCountFilterData.sort((a, b) => b.count - a.count);
    // Pie chart
    // if (!currentSelectedFile in )
    const chart = am4core.create("MyPieChart", am4charts.PieChart);
    chart.data = characterCountFilterData
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "character";

    // experimental
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;
    // experimental

    return () => {
      chart.dispose();
    }

  }, [currentFilterTabName, currentSelectedFile, metadata]);

  return (
    <div className="PieChartWrapper">
      <span className="text">Letter counts</span>
      <div id="MyPieChart" />
    </div>
  );
};

export default MetadataPie;
