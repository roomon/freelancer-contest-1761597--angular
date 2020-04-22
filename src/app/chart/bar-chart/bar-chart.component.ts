import {
  Component,
  NgZone,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as socketio from 'socket.io-client';

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
export class BarChartComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly URI =
    environment.api.uri + environment.api.endpoints.chartBar;
  private readonly socket = socketio(environment.socket);
  private chart: m4Charts.XYChart3D;

  constructor(
    private readonly zone: NgZone,
    private readonly http: HttpClient
  ) {}

  ngOnInit() {
    // add data
    this.http.get<BarChartData[]>(this.URI).subscribe((data) => {
      this.chart.data = data.map((each) => ({
        ...each,
        color: this.chart.colors.next(),
      }));
    });

    // listen for changes
    this.socket.on('barchart-replace', (change) => {
      const temp = this.chart.data;
      const index = temp.findIndex(
        (each) => each.year === change.updatedDocument.year
      );
      temp[index].income = change.updatedDocument.income;
      this.chart.data = temp;
    });
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // create chart instance
      const xyChart = m4Core.create('bar-chart', m4Charts.XYChart3D);

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
      series.sequencedInterpolation = true;

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
