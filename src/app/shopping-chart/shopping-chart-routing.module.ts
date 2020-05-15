import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingChartComponent } from './overview/shopping-chart.component';

const routes: Routes = [{ path: '', component: ShoppingChartComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingChartRoutingModule { }
