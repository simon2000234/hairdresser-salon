import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingChartRoutingModule } from './shopping-chart-routing.module';
import { ShoppingChartComponent } from './overview/shopping-chart.component';
import {FlexModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatRippleModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [ShoppingChartComponent],
  imports: [
    CommonModule,
    ShoppingChartRoutingModule,
    FlexModule,
    MatCardModule,
    MatRippleModule,
    MatListModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ShoppingChartModule { }
