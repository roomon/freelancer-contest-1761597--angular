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

import { environment } from '../../environments/environment';

m4Core.useTheme(AnimatedTheme);

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss'],
})
export class GaugeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly URI = environment.api.uri + environment.api.endpoints.gauge;
  private readonly socket = socketio(environment.socket);
  private chart: m4Charts.GaugeChart;
  private hand: m4Charts.ClockHand;

  constructor(
    private readonly zone: NgZone,
    private readonly http: HttpClient
  ) {}

  ngOnInit() {
    // add data
    this.http.get<GaugeData>(this.URI).subscribe((data) => {
      this.hand.showValue(data.usage, 1000, m4Core.ease.cubicOut);
    });

    // listen for data change
    this.socket.on('gauge-replace', (change) => {
      const temp = change.updatedDocument.usage;
      this.hand.showValue(temp, 1000, m4Core.ease.cubicOut);
    });
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // create chart
      const gaugeChart = m4Core.create('gauge', m4Charts.GaugeChart);
      gaugeChart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

      gaugeChart.innerRadius = -25;

      const axis = gaugeChart.xAxes.push(
        new m4Charts.ValueAxis<m4Charts.AxisRendererCircular>()
      );
      axis.min = 0;
      axis.max = 100;
      axis.strictMinMax = true;
      axis.renderer.grid.template.stroke = new m4Core.InterfaceColorSet().getFor(
        'background'
      );
      axis.renderer.grid.template.strokeOpacity = 0.3;

      const colorSet = new m4Core.ColorSet();

      const range0 = axis.axisRanges.create();
      range0.value = 0;
      range0.endValue = 50;
      range0.axisFill.fillOpacity = 1;
      range0.axisFill.fill = colorSet.getIndex(0);
      range0.axisFill.zIndex = -1;

      const range1 = axis.axisRanges.create();
      range1.value = 50;
      range1.endValue = 80;
      range1.axisFill.fillOpacity = 1;
      range1.axisFill.fill = colorSet.getIndex(2);
      range1.axisFill.zIndex = -1;

      const range2 = axis.axisRanges.create();
      range2.value = 80;
      range2.endValue = 100;
      range2.axisFill.fillOpacity = 1;
      range2.axisFill.fill = colorSet.getIndex(4);
      range2.axisFill.zIndex = -1;

      this.hand = gaugeChart.hands.push(new m4Charts.ClockHand());

      this.chart = gaugeChart;
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

interface GaugeData {
  timestamp: Date;
  usage: number;
}
