import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';

import * as m4Core from '@amcharts/amcharts4/core';
import * as m4Charts from '@amcharts/amcharts4/charts';
import AnimatedTheme from '@amcharts/amcharts4/themes/animated';

m4Core.useTheme(AnimatedTheme);

@Component({
  selector: 'app-speedometer',
  templateUrl: './speedometer.component.html',
  styleUrls: ['./speedometer.component.scss'],
})
export class SpeedometerComponent implements AfterViewInit, OnDestroy {
  private chart: m4Charts.GaugeChart;

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // create chart
      const gaugeChart = m4Core.create('speedometer', m4Charts.GaugeChart);
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

      const hand = gaugeChart.hands.push(new m4Charts.ClockHand());

      // using gaugeChart.setTimeout method as the timeout will be disposed together with a chart
      gaugeChart.setTimeout(randomValue, 2000);

      function randomValue() {
        hand.showValue(Math.random() * 100, 1000, m4Core.ease.cubicOut);
        gaugeChart.setTimeout(randomValue, 2000);
      }

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
