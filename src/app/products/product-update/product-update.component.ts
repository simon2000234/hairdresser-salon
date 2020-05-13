import {Component, OnDestroy, OnInit} from '@angular/core';
import {Product} from '../shared/product';
import {Observable, Subscription} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {ProductState} from '../shared/product.state';
import {GetProduct, UpdateProduct} from '../shared/product.action';
import {Navigate} from '@ngxs/router-plugin';

@Component({
  selector: 'app-innotech-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss']
})
export class ProductUpdateComponent implements OnInit, OnDestroy {
  id;
  product: Product;
  sub: Subscription;
  productForm: FormGroup = new FormGroup({
    picUrl: new FormControl(''),
    price: new FormControl(''),
    name: new FormControl(''),
  });
  constructor(private route: ActivatedRoute,
              private store: Store,
  ) {}
  @Select(ProductState.product2Update)
  products$: Observable<Product>;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new GetProduct(this.id));
    this.sub = this.products$.subscribe(product => this.product = product);
  }

  update() {
    const updatedProduct: Product = {
      name: this.product.name,
      price: this.product.price,
      url: this.product.url,
    };
    this.store.dispatch(new UpdateProduct(updatedProduct));
    this.store.dispatch(new Navigate(['products']));
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
