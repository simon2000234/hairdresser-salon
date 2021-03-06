import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './overview/products.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProductCreateComponent } from './create/product-create.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ProductUpdateComponent} from './product-update/product-update.component';
import {ProductDetailComponent} from './detail/product-detail.component';
import {MatRippleModule} from '@angular/material/core';
@NgModule({
  declarations: [ProductsComponent, ProductCreateComponent,  ProductUpdateComponent, ProductDetailComponent],
    imports: [
        CommonModule,
        ProductsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSnackBarModule,
        MatListModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatToolbarModule,
        MatRippleModule
    ]
})
export class ProductsModule { }
