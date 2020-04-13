import React, { useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dark from '@amcharts/amcharts4/themes/dark';

import './MetadataTable.styles.css';

am4core.useTheme(am4themes_dark);

const MetadataTable = ({ metadata, currentSelectedFile, currentFilterTabName }) => {
  const { wordsCount } = metadata[currentSelectedFile][currentFilterTabName];

  useEffect(() => {
    // Add data
    const filterWordCountObjectArray = Object.keys(wordsCount).reduce((acc, word) => {
      acc.push({
        word,
        count: wordsCount[word],
      })
      return acc;
    }, [])
    filterWordCountObjectArray.sort((a, b) => b.count - a.count);

    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.data = filterWordCountObjectArray.slice(0, 20);
    chart.fontSize = 18;

    console.log(chart.data);

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    console.log(categoryAxis.dataFields);
    categoryAxis.dataFields.category = "word";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
      if (target.dataItem && target.dataItem.index & 2 == 2) {
        return dy + 25;
      }
      return dy;
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "word";
    series.name = "Visits";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
  }, [wordsCount]);

  return (
    <div className="FilterTableWrapper">
      <span className="text">Most common words</span>
      <div id="chartdiv"></div>
    </div>
  );
};

export default MetadataTable;
