import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';

import * as m4Core from '@amcharts/amcharts4/core';
import * as m4Maps from '@amcharts/amcharts4/maps';
import AnimatedTheme from '@amcharts/amcharts4/themes/animated';
import WORLD_MAP from '@amcharts/amcharts4-geodata/worldLow';

m4Core.useTheme(AnimatedTheme);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private chart: m4Maps.MapChart;

  constructor(private readonly zone: NgZone) {}

  private animateBullet(circle) {
    const animation = circle.animate(
      [
        { property: 'scale', from: 1, to: 5 },
        { property: 'opacity', from: 1, to: 0 },
      ],
      1000,
      m4Core.ease.circleOut
    );
    animation.events.on('animationended', (event) => {
      this.animateBullet(event.target.object);
    });
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // Create map instance
      const map = m4Core.create('map', m4Maps.MapChart);

      // Set map definition
      map.geodata = WORLD_MAP;

      // Set projection
      map.projection = new m4Maps.projections.Miller();

      // Create map polygon series
      const pgSeries = map.series.push(new m4Maps.MapPolygonSeries());

      // Exclude Antartica
      pgSeries.exclude = ['AQ'];

      // Make map load polygon (like country names) data from GeoJSON
      pgSeries.useGeodata = true;

      // Configure series
      const pgTemplate = pgSeries.mapPolygons.template;
      pgTemplate.tooltipText = '{name}';
      pgTemplate.polygon.fillOpacity = 0.6;

      // Create hover state and set alternative fill color
      const hs = pgTemplate.states.create('hover');
      hs.properties.fill = map.colors.getIndex(0);

      // Add image series
      const imgSeries = map.series.push(new m4Maps.MapImageSeries());
      imgSeries.mapImages.template.propertyFields.longitude = 'longitude';
      imgSeries.mapImages.template.propertyFields.latitude = 'latitude';
      imgSeries.mapImages.template.tooltipText = '{title}';
      imgSeries.mapImages.template.propertyFields.url = 'url';

      const circle1 = imgSeries.mapImages.template.createChild(m4Core.Circle);
      circle1.radius = 3;
      circle1.propertyFields.fill = 'color';

      const circle2 = imgSeries.mapImages.template.createChild(m4Core.Circle);
      circle2.radius = 3;
      circle2.propertyFields.fill = 'color';

      circle2.events.on('inited', (event) => {
        this.animateBullet(event.target);
      });

      const colorSet = new m4Core.ColorSet();

      imgSeries.data = [
        {
          title: 'Brussels',
          latitude: 50.8371,
          longitude: 4.3676,
          color: colorSet.next(),
        },
        {
          title: 'Copenhagen',
          latitude: 55.6763,
          longitude: 12.5681,
          color: colorSet.next(),
        },
        {
          title: 'Paris',
          latitude: 48.8567,
          longitude: 2.351,
          color: colorSet.next(),
        },
        {
          title: 'Reykjavik',
          latitude: 64.1353,
          longitude: -21.8952,
          color: colorSet.next(),
        },
        {
          title: 'Moscow',
          latitude: 55.7558,
          longitude: 37.6176,
          color: colorSet.next(),
        },
        {
          title: 'Madrid',
          latitude: 40.4167,
          longitude: -3.7033,
          color: colorSet.next(),
        },
        {
          title: 'London',
          latitude: 51.5002,
          longitude: -0.1262,
          url: 'http://www.google.co.uk',
          color: colorSet.next(),
        },
        {
          title: 'Peking',
          latitude: 39.9056,
          longitude: 116.3958,
          color: colorSet.next(),
        },
        {
          title: 'New Delhi',
          latitude: 28.6353,
          longitude: 77.225,
          color: colorSet.next(),
        },
        {
          title: 'Tokyo',
          latitude: 35.6785,
          longitude: 139.6823,
          url: 'http://www.google.co.jp',
          color: colorSet.next(),
        },
        {
          title: 'Ankara',
          latitude: 39.9439,
          longitude: 32.856,
          color: colorSet.next(),
        },
        {
          title: 'Buenos Aires',
          latitude: -34.6118,
          longitude: -58.4173,
          color: colorSet.next(),
        },
        {
          title: 'Brasilia',
          latitude: -15.7801,
          longitude: -47.9292,
          color: colorSet.next(),
        },
        {
          title: 'Ottawa',
          latitude: 45.4235,
          longitude: -75.6979,
          color: colorSet.next(),
        },
        {
          title: 'Washington',
          latitude: 38.8921,
          longitude: -77.0241,
          color: colorSet.next(),
        },
        {
          title: 'Kinshasa',
          latitude: -4.3369,
          longitude: 15.3271,
          color: colorSet.next(),
        },
        {
          title: 'Cairo',
          latitude: 30.0571,
          longitude: 31.2272,
          color: colorSet.next(),
        },
        {
          title: 'Pretoria',
          latitude: -25.7463,
          longitude: 28.1876,
          color: colorSet.next(),
        },
      ];
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
