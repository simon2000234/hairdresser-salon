import { Component, OnInit } from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {CartState} from '../shared/cart.state';
import {Cart} from '../shared/cart';
import {GetCart} from '../shared/cart.action';

@Component({
  selector: 'app-innotech-shopping-chart',
  templateUrl: './shopping-chart.component.html',
  styleUrls: ['./shopping-chart.component.scss']
})
export class ShoppingChartComponent implements OnInit {

  cart: Cart;
  constructor(private store: Store) { }
  @Select(CartState.userCart)
  cart$: Observable<Cart>;
  ngOnInit(): void {
    console.log('hallo from top')
    this.store.dispatch(new GetCart('ig8pe77VQEYWt9GbqrHN'));
    this.cart$.subscribe(cart => this.cart = cart);
  }

}
