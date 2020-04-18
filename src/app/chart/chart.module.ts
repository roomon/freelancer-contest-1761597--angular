import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
  declarations: [PieChartComponent, BarChartComponent, LineChartComponent],
  imports: [CommonModule],
  exports: [PieChartComponent, BarChartComponent, LineChartComponent],
})
export class ChartModule {}
