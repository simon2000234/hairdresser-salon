import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngxs/store';
import {GetProduct} from '../shared/product.action';
import {Product} from '../shared/product';
import {Observable, Subscription} from 'rxjs';




@Component({
  selector: 'app-innotech-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  id;
  product: Product;
  sub: Subscription;
  product$: Observable<Product>;
  constructor(private route: ActivatedRoute,
              private store: Store) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(new GetProduct(this.id));
    this.sub = this.product$.subscribe(p => this.product = p);
  }
}
