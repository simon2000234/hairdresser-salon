import {Component, OnDestroy, OnInit} from '@angular/core';
import {Product} from '../shared/product';
import {Observable, Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {ProductState} from '../shared/product.state';
import {GetProduct, UpdateProduct} from '../shared/product.action';
import {Navigate} from '@ngxs/router-plugin';
import {routingConstants} from '../../public/shared/constants';

@Component({
  selector: 'app-innotech-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss']
})
export class ProductUpdateComponent implements OnInit, OnDestroy {
  id;
  product: Product;
  sub: Subscription;
  productForm = this.fb.group({
    picUrl: [''],
    price: [''] ,
    name: [''],
  });
  constructor(private route: ActivatedRoute,
              private store: Store,
              private fb: FormBuilder) {}
  @Select(ProductState.product)
  products$: Observable<Product>;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new GetProduct(this.id));
    this.sub = this.products$.subscribe(product => {
      this.product = product;
      if (product) {
        this.productForm.patchValue({
          picUrl: product.url,
          price: product.price,
          name: product.name
        });
      }
    });
  }

  update() {
    const updatedProduct: Product = {
      name: this.productForm.value.name,
      price: this.productForm.value.price,
      url: this.productForm.value.picUrl,
    };
    this.store.dispatch(new UpdateProduct(updatedProduct, this.id));
    this.store.dispatch(new Navigate(['products']));
  }

  gotToOverview() {
    this.store.dispatch(new Navigate([routingConstants.products]));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
