import { Component, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as m4Core from '@amcharts/amcharts4/core';
import * as m4Maps from '@amcharts/amcharts4/maps';
import AnimatedTheme from '@amcharts/amcharts4/themes/animated';
import WORLD_MAP from '@amcharts/amcharts4-geodata/worldLow';
import { environment } from '../../environments/environment';

m4Core.useTheme(AnimatedTheme);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private chart: m4Maps.MapChart;

  constructor(
    private readonly zone: NgZone,
    private readonly http: HttpClient
  ) {}

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

      this.http
        .get<MapData[]>(environment.apiEndpoint + '/map')
        .subscribe((data) => {
          imgSeries.data = data.map((each) => ({
            ...each,
            color: colorSet.next(),
          }));
        });

      this.chart = map;
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

interface MapData {
  title: string;
  latitude: number;
  longitude: number;
  url?: string;
  color: m4Core.Color;
}
