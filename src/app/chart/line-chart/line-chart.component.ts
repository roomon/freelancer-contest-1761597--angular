import {
  Component,
  NgZone,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as socketio from 'socket.io-client';

import * as m4Core from '@amcharts/amcharts4/core';
import * as m4Charts from '@amcharts/amcharts4/charts';
import AnimatedTheme from '@amcharts/amcharts4/themes/animated';

import { environment } from 'src/environments/environment';

m4Core.useTheme(AnimatedTheme);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly URI =
    environment.api.uri + environment.api.endpoints.chartLine;
  private readonly socket = socketio(environment.socket);
  private chart: m4Charts.XYChart;

  constructor(
    private readonly zone: NgZone,
    private readonly http: HttpClient
  ) {}

  ngOnInit() {
    // add data
    this.http
      .get<{ statusCode: number; body: string }>(this.URI)
      .pipe(
        map((resp) => {
          const { body } = resp;
          const array = JSON.parse(body);
          const data = array.map((each) => ({
            date: each.date,
            visits: each.visits,
          }));
          return data;
        })
      )
      .subscribe((data) => {
        this.chart.data = data;
      });

    // listen for changes
    this.socket.on('linechart-replace', (change) => {
      const temp = this.chart.data;
      const index = temp.findIndex(
        (each) => each.date === change.updatedDocument.date
      );
      temp[index].visits = change.updatedDocument.visits;
      this.chart.data = temp;
    });
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // create chart instance
      const lineChart = m4Core.create('line-chart', m4Charts.XYChart);

      // create axes
      const dateAxis = lineChart.xAxes.push(new m4Charts.DateAxis());
      dateAxis.startLocation = 0.5;
      dateAxis.endLocation = 0.5;

      // create value axis
      const valueAxis = lineChart.yAxes.push(new m4Charts.ValueAxis());

      // create series
      const series = lineChart.series.push(new m4Charts.LineSeries());
      series.dataFields.valueY = 'visits';
      series.dataFields.dateX = 'date';
      series.strokeWidth = 3;
      series.tooltipText = '{valueY.value}';
      series.fillOpacity = 0.1;

      // create a range to change stroke for values below 0
      const range = valueAxis.createSeriesRange(series);
      range.value = 0;
      range.endValue = -1000;
      range.contents.stroke = lineChart.colors.getIndex(4);
      range.contents.fill = range.contents.stroke;
      range.contents.strokeOpacity = 0.7;
      range.contents.fillOpacity = 0.1;

      // add cursor
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
