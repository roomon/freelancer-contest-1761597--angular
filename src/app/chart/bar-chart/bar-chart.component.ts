import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as m4Core from '@amcharts/amcharts4/core';
import * as m4Charts from '@amcharts/amcharts4/charts';
import AnimatedTheme from '@amcharts/amcharts4/themes/animated';
import { environment } from '../../../environments/environment';

m4Core.useTheme(AnimatedTheme);

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements AfterViewInit, OnDestroy {
  private chart: m4Charts.XYChart3D;

  constructor(
    private readonly zone: NgZone,
    private readonly http: HttpClient
  ) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // create chart instance
      const xyChart = m4Core.create('bar-chart', m4Charts.XYChart3D);

      // add data
      this.http
        .get<BarChartData[]>(environment.apiEndpoint + '/bar-chart')
        .subscribe((data) => {
          xyChart.data = data.map((each) => ({
            ...each,
            color: xyChart.colors.next(),
          }));
        });

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

interface BarChartData {
  year: number;
  income: number;
  color?: m4Core.Color;
}
