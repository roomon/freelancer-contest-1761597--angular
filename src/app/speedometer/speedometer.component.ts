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
      gaugeChart.innerRadius = m4Core.percent(82);

      /**
       * Normal axis
       */

      const axis = gaugeChart.xAxes.push(new m4Charts.ValueAxis());
      axis.min = 0;
      axis.max = 100;
      axis.strictMinMax = true;
      axis.renderer.radius = m4Core.percent(80);
      axis.renderer.inside = true;
      axis.renderer.line.strokeOpacity = 1;
      axis.renderer.ticks.template.disabled = false;
      axis.renderer.ticks.template.strokeOpacity = 1;
      axis.renderer.ticks.template.length = 10;
      axis.renderer.grid.template.disabled = true;
      axis.renderer.labels.template.radius = 40;
      axis.renderer.labels.template.adapter.add('text', (text) => text + '%');

      /**
       * Axis for ranges
       */

      const colorSet = new m4Core.ColorSet();

      const axis2 = gaugeChart.xAxes.push(new m4Charts.ValueAxis());
      axis2.min = 0;
      axis2.max = 100;
      axis2.strictMinMax = true;
      axis2.renderer.labels.template.disabled = true;
      axis2.renderer.ticks.template.disabled = true;
      axis2.renderer.grid.template.disabled = true;

      const range0 = axis2.axisRanges.create();
      range0.value = 0;
      range0.endValue = 50;
      range0.axisFill.fillOpacity = 1;
      range0.axisFill.fill = colorSet.getIndex(0);

      const range1 = axis2.axisRanges.create();
      range1.value = 50;
      range1.endValue = 100;
      range1.axisFill.fillOpacity = 1;
      range1.axisFill.fill = colorSet.getIndex(2);

      /**
       * Label
       */

      const label = gaugeChart.radarContainer.createChild(m4Core.Label);
      label.isMeasured = false;
      label.fontSize = 45;
      label.x = m4Core.percent(50);
      label.y = m4Core.percent(100);
      label.horizontalCenter = 'middle';
      label.verticalCenter = 'bottom';
      label.text = '50%';

      /**
       * Hand
       */

      const hand = gaugeChart.hands.push(new m4Charts.ClockHand());
      hand.axis = axis2;
      hand.innerRadius = m4Core.percent(20);
      hand.startWidth = 10;
      hand.pin.disabled = true;
      hand.value = 50;

      hand.events.on('propertychanged', (event) => {
        range0.endValue = event.target.value;
        range1.value = event.target.value;
        label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
        axis2.invalidate();
      });

      setInterval(() => {
        const value = Math.round(Math.random() * 100);
        const animation = new m4Core.Animation(
          hand,
          {
            property: 'value',
            to: value,
          },
          1000,
          m4Core.ease.cubicOut
        );
        animation.start();
      }, 2000);

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
