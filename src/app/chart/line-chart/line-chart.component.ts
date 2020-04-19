import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as m4Core from '@amcharts/amcharts4/core';
import * as m4Charts from '@amcharts/amcharts4/charts';
import AnimatedTheme from '@amcharts/amcharts4/themes/animated';
import { environment } from '../../../environments/environment';

m4Core.useTheme(AnimatedTheme);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements AfterViewInit, OnDestroy {
  private chart: m4Charts.XYChart;

  constructor(
    private readonly zone: NgZone,
    private readonly http: HttpClient
  ) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      const lineChart = m4Core.create('line-chart', m4Charts.XYChart);

      // Add data
      this.http
        .get<LineChartData[]>(environment.apiEndpoint + '/line-chart')
        .subscribe((data) => {
          lineChart.data = data;
        });

      // Create axes
      const dateAxis = lineChart.xAxes.push(new m4Charts.DateAxis());
      dateAxis.startLocation = 0.5;
      dateAxis.endLocation = 0.5;

      // Create value axis
      const valueAxis = lineChart.yAxes.push(new m4Charts.ValueAxis());

      // Create series
      const series = lineChart.series.push(new m4Charts.LineSeries());
      series.dataFields.valueY = 'visits';
      series.dataFields.dateX = 'date';
      series.strokeWidth = 3;
      series.tooltipText = '{valueY.value}';
      series.fillOpacity = 0.1;

      // Create a range to change stroke for values below 0
      const range = valueAxis.createSeriesRange(series);
      range.value = 0;
      range.endValue = -1000;
      range.contents.stroke = lineChart.colors.getIndex(4);
      range.contents.fill = range.contents.stroke;
      range.contents.strokeOpacity = 0.7;
      range.contents.fillOpacity = 0.1;

      // Add cursor
      lineChart.cursor = new m4Charts.XYCursor();
      lineChart.cursor.xAxis = dateAxis;
      lineChart.scrollbarX = new m4Core.Scrollbar();

      series.tooltip.getFillFromObject = false;
      series.tooltip.adapter.add('x', (x, target) => {
        if (
          (series.tooltip.tooltipDataItem as m4Charts.ColumnSeriesDataItem)
            .valueY < 0
        ) {
          series.tooltip.background.fill = lineChart.colors.getIndex(4);
        } else {
          series.tooltip.background.fill = lineChart.colors.getIndex(0);
        }
        return x;
      });

      this.chart = lineChart;
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}

interface LineChartData {
  date: Date;
  visits: number;
}
