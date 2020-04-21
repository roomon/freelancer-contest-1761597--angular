import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { GaugeComponent } from './gauge/gauge.component';
import { ChartModule } from './chart/chart.module';

@NgModule({
  declarations: [AppComponent, MapComponent, GaugeComponent],
  imports: [BrowserModule, HttpClientModule, ChartModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
