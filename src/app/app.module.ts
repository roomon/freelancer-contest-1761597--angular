import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { SpeedometerComponent } from './speedometer/speedometer.component';
import { ChartModule } from './chart/chart.module';

@NgModule({
  declarations: [AppComponent, MapComponent, SpeedometerComponent],
  imports: [BrowserModule, HttpClientModule, ChartModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
