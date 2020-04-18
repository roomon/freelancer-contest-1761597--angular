import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { SpeedometerComponent } from './speedometer/speedometer.component';
import { ChartModule } from './chart/chart.module';

@NgModule({
  declarations: [AppComponent, MapComponent, SpeedometerComponent],
  imports: [BrowserModule, ChartModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
