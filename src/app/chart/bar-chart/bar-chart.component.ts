import { Component, NgZone, OnDestroy, AfterViewInit } from '@angular/core';

import * as m4Core from '@amcharts/amcharts4/core';
import * as m4Charts from '@amcharts/amcharts4/charts';
import AnimatedTheme from '@amcharts/amcharts4/themes/animated';

m4Core.useTheme(AnimatedTheme);

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements AfterViewInit, OnDestroy {
  private chart: m4Charts.XYChart3D;

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // create chart instance
      const xyChart = m4Core.create('bar-chart', m4Charts.XYChart3D);

      // add data
      xyChart.data = [
        {
          year: 2005,
          income: 23.5,
          color: xyChart.colors.next(),
        },
        {
          year: 2006,
          income: 26.2,
          color: xyChart.colors.next(),
        },
        {
          year: 2007,
          income: 30.1,
          color: xyChart.colors.next(),
        },
        {
          year: 2008,
          income: 29.5,
          color: xyChart.colors.next(),
        },
        {
          year: 2009,
          income: 24.6,
          color: xyChart.colors.next(),
        },
      ];

      // Create axes
      const catAxis = xyChart.yAxes.push(new m4Charts.CategoryAxis());
      catAxis.dataFields.category = 'year';
      catAxis.numberFormatter.numberFormat = '#';
      catAxis.renderer.inversed = true;

      const valAxis = xyChart.xAxes.push(new m4Charts.ValueAxis());

      // Create series
      const series = xyChart.series.push(new m4Charts.ColumnSeries3D());
      series.dataFields.valueX = 'income';
      series.dataFields.categoryY = 'year';
      series.name = 'Income';
      series.columns.template.propertyFields.fill = 'color';
      series.columns.template.tooltipText = '{valueX}';
      series.columns.template.column3D.stroke = m4Core.color('#fff');
      series.columns.template.column3D.strokeOpacity = 0.2;

      this.chart = xyChart;
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
