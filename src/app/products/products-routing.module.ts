import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './overview/products.component';
import { ProductCreateComponent } from './create/product-create.component';
import {ProductDetailComponent} from './detail/product-detail.component';
import {ProductUpdateComponent} from './product-update/product-update.component';

const routes: Routes = [
  { path: 'create',
    component: ProductCreateComponent
  },
  { path: 'detail/:id' ,
    component: ProductDetailComponent
  },
  { path: '',
    component: ProductsComponent
  },
  { path: 'update/:id',
    component: ProductUpdateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
