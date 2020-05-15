import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './overview/products.component';
import { ProductCreateComponent } from './create/product-create.component';
import {ProductDetailComponent} from './detail/product-detail.component';

const routes: Routes = [
  { path: 'create',
    component: ProductCreateComponent
  },
  { path: 'detail/:id' ,
    component: ProductDetailComponent
  },
  { path: '',
    component: ProductsComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
