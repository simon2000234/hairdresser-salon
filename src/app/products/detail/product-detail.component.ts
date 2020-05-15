import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {GetProduct} from '../shared/product.action';
import {Product} from '../shared/product';
import {Observable, Subscription} from 'rxjs';
import {Navigate} from '@ngxs/router-plugin';
import {routingConstants} from '../../public/shared/constants';
import {ProductState} from '../shared/product.state';

@Component({
  selector: 'app-innotech-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  id;
  product: Product;
  sub: Subscription;
  constructor(private route: ActivatedRoute,
              private store: Store) { }
  @Select(ProductState.product)
  product$: Observable<Product>;
  limit = 4;
  cardWidth = 100 / this.limit;
  ngOnInit(): void {
    this.sub = this.product$.subscribe(p => this.product = p);
    this.id = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new GetProduct(this.id));
  }
  gotToOverview() {
    this.store.dispatch(new Navigate([routingConstants.products]));
  }

}
