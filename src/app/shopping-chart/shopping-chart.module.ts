import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingChartRoutingModule } from './shopping-chart-routing.module';
import { ShoppingChartComponent } from './shopping-chart.component';


@NgModule({
  declarations: [ShoppingChartComponent],
  imports: [
    CommonModule,
    ShoppingChartRoutingModule
  ]
})
export class ShoppingChartModule { }
