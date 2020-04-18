import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';

import * as m4Core from '@amcharts/amcharts4/core';
import * as m4Charts from '@amcharts/amcharts4/charts';
import AnimatedTheme from '@amcharts/amcharts4/themes/animated';

m4Core.useTheme(AnimatedTheme);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements AfterViewInit, OnDestroy {
  private chart: m4Charts.XYChart;

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      const lineChart = m4Core.create('line-chart', m4Charts.XYChart);

      // Add data
      lineChart.data = generateChartData();

      // Create axes
      const dateAxis = lineChart.xAxes.push(new m4Charts.DateAxis());

      const valueAxis = lineChart.yAxes.push(new m4Charts.ValueAxis());

      // Create series
      const series = lineChart.series.push(new m4Charts.LineSeries());
      series.dataFields.valueY = 'visits';
      series.dataFields.dateX = 'date';
      series.strokeWidth = 1;
      series.minBulletDistance = 10;
      series.tooltipText = '{valueY}';
      series.fillOpacity = 0.1;
      series.tooltip.pointerOrientation = 'vertical';
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.fillOpacity = 0.5;
      series.tooltip.label.padding(12, 12, 12, 12);

      const seriesRange = dateAxis.createSeriesRange(series);
      seriesRange.contents.strokeDasharray = '2,3';
      seriesRange.contents.stroke = lineChart.colors.getIndex(8);
      seriesRange.contents.strokeWidth = 1;

      const pattern = new m4Core.LinePattern();
      pattern.rotation = -45;
      pattern.stroke = seriesRange.contents.stroke;
      pattern.width = 1000;
      pattern.height = 1000;
      pattern.gap = 6;
      seriesRange.contents.fill = pattern;
      seriesRange.contents.fillOpacity = 0.5;

      // Add scrollbar
      lineChart.scrollbarX = new m4Core.Scrollbar();

      function generateChartData() {
        const chartData = [];
        const firstDate = new Date();
        firstDate.setDate(firstDate.getDate() - 200);
        let visits = 1200;
        for (let i = 0; i < 200; i++) {
          // we create date objects here. In your data, you can have date strings
          // and then set format of your dates using lineChart.dataDateFormat property,
          // however when possible, use date objects, as this will speed up chart rendering.
          const newDate = new Date(firstDate);
          newDate.setDate(newDate.getDate() + i);

          visits += Math.round(
            (Math.random() < 0.5 ? 1 : -1) * Math.random() * 10
          );

          chartData.push({
            date: newDate,
            visits,
          });
        }
        return chartData;
      }

      // add range
      const range = dateAxis.axisRanges.push(new m4Charts.DateAxisDataItem());
      range.grid.stroke = lineChart.colors.getIndex(0);
      range.grid.strokeOpacity = 1;
      range.bullet = new m4Core.ResizeButton();
      range.bullet.background.fill = lineChart.colors.getIndex(0);
      range.bullet.background.states.copyFrom(
        lineChart.zoomOutButton.background.states
      );
      range.bullet.minX = 0;
      range.bullet.adapter.add('minY', (minY, target) => {
        target.maxY = lineChart.plotContainer.maxHeight;
        target.maxX = lineChart.plotContainer.maxWidth;
        return lineChart.plotContainer.maxHeight;
      });

      range.bullet.events.on('dragged', () => {
        range.value = dateAxis.xToValue(range.bullet.pixelX);
        seriesRange.value = range.value;
      });

      const firstTime = lineChart.data[0].date.getTime();
      const lastTime = lineChart.data[lineChart.data.length - 1].date.getTime();
      const date = new Date(firstTime + (lastTime - firstTime) / 2);

      range.date = date;

      seriesRange.date = date;
      seriesRange.endDate = lineChart.data[lineChart.data.length - 1].date;

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
