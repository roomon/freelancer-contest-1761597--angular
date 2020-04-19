import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as m4Core from '@amcharts/amcharts4/core';
import * as m4Charts from '@amcharts/amcharts4/charts';
import AnimatedTheme from '@amcharts/amcharts4/themes/animated';
import { environment } from '../../../environments/environment';

m4Core.useTheme(AnimatedTheme);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements AfterViewInit, OnDestroy {
  private chart: m4Charts.PieChart3D;

  constructor(
    private readonly zone: NgZone,
    private readonly http: HttpClient
  ) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const pieChart = m4Core.create('pie-chart', m4Charts.PieChart3D);

      pieChart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      pieChart.legend = new m4Charts.Legend();

      this.http
        .get<PieChartData[]>(environment.apiEndpoint + '/pie-chart')
        .subscribe((data) => {
          pieChart.data = data;
        });

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

interface PieChartData {
  country: string;
  litres: number;
}
