import { Component, NgZone, OnDestroy, AfterViewInit } from '@angular/core';

import * as m4Core from '@amcharts/amcharts4/core';
import * as m4Charts from '@amcharts/amcharts4/charts';
import AnimatedTheme from '@amcharts/amcharts4/themes/animated';

m4Core.useTheme(AnimatedTheme);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements AfterViewInit, OnDestroy {
  private chart: m4Charts.PieChart3D;

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const pieChart = m4Core.create('pie-chart', m4Charts.PieChart3D);

      pieChart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      pieChart.legend = new m4Charts.Legend();

      pieChart.data = [
        {
          country: 'Lithuania',
          litres: 501.9,
        },
        {
          country: 'Czech Republic',
          litres: 301.9,
        },
        {
          country: 'Ireland',
          litres: 201.1,
        },
        {
          country: 'Germany',
          litres: 165.8,
        },
        {
          country: 'Australia',
          litres: 139.9,
        },
        {
          country: 'Austria',
          litres: 128.3,
        },
        {
          country: 'UK',
          litres: 99,
        },
        {
          country: 'Belgium',
          litres: 60,
        },
        {
          country: 'The Netherlands',
          litres: 50,
        },
      ];

      const pieSeries = pieChart.series.push(new m4Charts.PieSeries3D());
      pieSeries.dataFields.value = 'litres';
      pieSeries.dataFields.category = 'country';

      this.chart = pieChart;
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
